import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import cors from "cors";
import express from "express";
import { pool, initDb } from "./db.js";
import { getDatabaseConnectionDiagnostics } from "./api/_supabase.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "./mailer.js";

const app = express();
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");
const holidayCache = new Map();
const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
const authTokenTtlMs = Number(process.env.AUTH_TOKEN_TTL_HOURS || 12) * 60 * 60 * 1000;
const allowedCorsOrigins = String(process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const departments = ["SOC", "NOC"];
const systemAdminRole = "מנהל מערכת";
const managerRoles = [systemAdminRole, "מנהל SOC", "מנהל NOC", "מנהל/ת"];
const scheduleEditorRoles = [...managerRoles, "אחראי/ת משמרת"];
const employeeRoles = ["עובד/ת", "Tier 1", "Tier 2", "NOC - משרה מלאה", "NOC - משרה חלקית"];
const publicRegistrationRolesByDepartment = {
  SOC: ["Tier 1", "Tier 2"],
  NOC: ["NOC - משרה מלאה", "NOC - משרה חלקית"],
};
const attendanceSelect = `
  SELECT ae.*, u.employee_number, u.employment_status, COALESCE(ae.department, u.department, 'NOC') AS department
  FROM attendance_entries ae
  LEFT JOIN users u ON LOWER(u.email) = LOWER(ae.employee_email)
`;
let initDbPromise;

async function ensureDbInitialized() {
  initDbPromise ||= initDb();
  await initDbPromise;
}

app.disable("x-powered-by");
app.set("trust proxy", true);
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "same-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (req.path.startsWith("/api/")) res.setHeader("Cache-Control", "no-store");
  next();
});
app.use(
  cors({
    origin(origin, callback) {
      callback(null, !origin || allowedCorsOrigins.includes(origin));
    },
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  if (!["GET", "HEAD"].includes(req.method) || req.path.startsWith("/api/")) return next();
  let requestedPath = "";
  try {
    requestedPath = path.basename(decodeURIComponent(req.path || ""));
  } catch {
    return res.sendStatus(400);
  }
  const blockedFiles = new Set([
    ".env",
    ".env.example",
    ".gitignore",
    "db.js",
    "docker-compose.yml",
    "mailer.js",
    "package-lock.json",
    "package.json",
    "README.md",
    "server.err.log",
    "server.js",
    "server.out.log",
  ]);
  if (blockedFiles.has(requestedPath) || requestedPath.endsWith(".log")) return res.sendStatus(404);
  next();
});
app.use(express.static(publicDir, { dotfiles: "deny", fallthrough: true }));
app.get(["/", "/index.html"], (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});
app.use("/api", async (req, _res, next) => {
  if (req.path === "/health" || req.path === "/db-health") return next();
  try {
    await ensureDbInitialized();
    next();
  } catch (error) {
    next(error);
  }
});

function normalizeUser(row) {
  const department = departments.includes(row.department) ? row.department : "NOC";
  return {
    id: row.id,
    name: row.name,
    username: row.username || row.email,
    email: row.email,
    phone: row.phone,
    employeeNumber: row.employee_number,
    employmentStatus: row.employment_status || "משרה מלאה",
    department,
    role: normalizeRole(row.role, department, true),
    status: row.status,
    verificationSentAt: row.verification_sent_at,
    verifiedAt: row.verified_at,
    createdAt: row.created_at,
  };
}

function isSystemAdmin(role) {
  return role === systemAdminRole;
}

function isManagerRole(role) {
  return managerRoles.includes(role);
}

function canManageDepartmentSchedule(role) {
  return isManagerRole(role) || role === "אחראי/ת משמרת";
}

function normalizeDepartment(value) {
  const department = String(value || "").toUpperCase();
  return departments.includes(department) ? department : "NOC";
}

function normalizeRole(role, department = "NOC", allowSystemAdmin = false) {
  const value = String(role || "").trim();
  if (allowSystemAdmin && value === systemAdminRole) return systemAdminRole;
  if (value === "מנהל/ת") return department === "SOC" ? "מנהל SOC" : "מנהל NOC";
  if (value === "עובד/ת") return department === "SOC" ? "Tier 1" : "NOC - משרה מלאה";
  if (value === "מנהל SOC" && department === "SOC") return value;
  if (value === "מנהל NOC" && department === "NOC") return value;
  if (value === "אחראי/ת משמרת") return value;
  if (department === "SOC" && ["Tier 1", "Tier 2"].includes(value)) return value;
  if (department === "NOC" && ["NOC - משרה מלאה", "NOC - משרה חלקית"].includes(value)) return value;
  return department === "SOC" ? "Tier 1" : "NOC - משרה מלאה";
}

function getScopedDepartment(actor, requestedDepartment = "") {
  if (isSystemAdmin(actor.role)) return normalizeDepartment(requestedDepartment || actor.department);
  return actor.department || "NOC";
}

function normalizeAttendance(row) {
  return {
    id: row.id,
    userId: row.user_id,
    employee: row.employee_name,
    email: row.employee_email,
    shiftLabel: row.shift_label,
    enteredBy: row.entered_by_name,
    employeeNumber: row.employee_number,
    employmentStatus: row.employment_status || "משרה מלאה",
    department: row.department || "NOC",
    clockIn: row.clock_in,
    clockOut: row.clock_out,
  };
}

function buildShiftTimestamp(date, time) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date)) || !/^\d{2}:\d{2}$/.test(String(time))) {
    throw Object.assign(new Error("Invalid date or time."), { status: 400 });
  }
  return new Date(`${date}T${time}:00`);
}

function dateOnly(value) {
  if (!value) return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isDateInWeek(dateValue, weekStartValue) {
  const date = new Date(`${dateOnly(dateValue)}T00:00:00`);
  const weekStart = new Date(`${dateOnly(weekStartValue)}T00:00:00`);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  return date >= weekStart && date < weekEnd;
}

function getShiftWindow(dateValue, shiftTime) {
  const [startTime, endTime] = String(shiftTime || "").split("-");
  const start = buildShiftTimestamp(dateOnly(dateValue), startTime);
  let end = buildShiftTimestamp(dateOnly(dateValue), endTime);
  if (end <= start) end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

async function findCurrentAssignmentForUser(userId, at = new Date()) {
  if (!userId) return null;
  const previousDay = new Date(at);
  previousDay.setDate(previousDay.getDate() - 1);
  const nextDay = new Date(at);
  nextDay.setDate(nextDay.getDate() + 1);
  const result = await pool.query(
    `
      SELECT sa.*
      FROM shift_assignments sa
      WHERE sa.user_id = $1
        AND sa.shift_date >= $2::date
        AND sa.shift_date <= $3::date
      ORDER BY sa.shift_date, sa.shift_label
    `,
    [userId, dateOnly(previousDay), dateOnly(nextDay)],
  );
  return (
    result.rows.find((assignment) => {
      const { start, end } = getShiftWindow(assignment.shift_date, assignment.shift_time);
      return at >= start && at <= end;
    }) || null
  );
}

async function attachMissingShiftLabels(rows) {
  for (const row of rows) {
    if (row.shift_label || row.clock_out || !row.user_id || !row.clock_in) continue;
    const assignment = await findCurrentAssignmentForUser(row.user_id, new Date(row.clock_in));
    if (!assignment) continue;
    row.shift_label = assignment.shift_label;
    row.department = assignment.department || row.department || "NOC";
    await pool.query(
      "UPDATE attendance_entries SET shift_label = $2, department = $3 WHERE id = $1 AND shift_label IS NULL",
      [row.id, assignment.shift_label, row.department],
    );
  }
  return rows;
}

function normalizeAssignment(row) {
  return {
    id: row.id,
    weekStart: dateOnly(row.week_start),
    department: row.department || "NOC",
    shiftDate: dateOnly(row.shift_date),
    shiftLabel: row.shift_label,
    shiftTime: row.shift_time,
    userId: row.user_id,
    employee: row.employee_name,
    email: row.employee_email,
    role: row.employee_role,
  };
}

function normalizeAvailability(row) {
  return {
    id: row.id,
    userId: row.user_id,
    employee: row.employee_name,
    email: row.employee_email,
    date: dateOnly(row.availability_date),
    shiftLabel: row.shift_label,
    status: row.status,
    note: row.note || "",
  };
}

function normalizeHoliday(item) {
  return {
    date: dateOnly(item.date),
    title: item.hebrew || item.title,
    titleEn: item.title,
  };
}

function requireFields(body, fields) {
  const missing = fields.filter((field) => !String(body[field] || "").trim());
  if (missing.length) {
    const error = new Error(`Missing required fields: ${missing.join(", ")}`);
    error.status = 400;
    throw error;
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeBaseUrl(value) {
  const raw = String(value || "").trim().replace(/\/$/, "");
  if (!raw || raw.includes("your-vercel-domain")) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

function getRequestBaseUrl(req) {
  const vercelProductionUrl = normalizeBaseUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (process.env.VERCEL && vercelProductionUrl) return vercelProductionUrl;

  const configuredBaseUrl = normalizeBaseUrl(process.env.APP_BASE_URL);
  if (configuredBaseUrl) return configuredBaseUrl;

  const forwardedHost = req.get("x-forwarded-host");
  const hostHeader = String(forwardedHost || req.get("host") || `localhost:${port}`).replace(/\/$/, "");
  const forwardedProto = String(req.get("x-forwarded-proto") || req.protocol || "http").split(",")[0].trim();
  return `${forwardedProto}://${hostHeader}`;
}

function generateTemporaryPassword() {
  const groups = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz", "0123456789", "!@#$%^&*"];
  const all = groups.join("");
  const chars = groups.map((group) => group[crypto.randomInt(group.length)]);
  while (chars.length < 8) chars.push(all[crypto.randomInt(all.length)]);
  return chars.sort(() => crypto.randomInt(3) - 1).join("");
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${derived}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash) return false;
  const [scheme, salt, expected] = storedHash.split(":");
  if (scheme !== "scrypt" || !salt || !expected) return false;
  const actual = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(Buffer.from(expected, "hex"), actual);
}

function isStrongPassword(password) {
  const value = String(password || "");
  return value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value);
}

function base64url(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function signAuthPayload(payload) {
  const body = base64url(payload);
  const signature = crypto.createHmac("sha256", sessionSecret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function passwordVersion(user) {
  return user?.password_updated_at ? new Date(user.password_updated_at).getTime() : 0;
}

function issueAuthToken(user) {
  const now = Date.now();
  return {
    token: signAuthPayload({
      sub: String(user.email || "").toLowerCase(),
      pwd: passwordVersion(user),
      iat: now,
      exp: now + authTokenTtlMs,
    }),
    expiresAt: new Date(now + authTokenTtlMs).toISOString(),
  };
}

function verifyAuthToken(token) {
  const [body, signature] = String(token || "").split(".");
  if (!body || !signature) return null;
  const expected = crypto.createHmac("sha256", sessionSecret).update(body).digest("base64url");
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload.sub || !payload.exp || Number(payload.exp) < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

const rateLimitBuckets = new Map();

function rateLimit({ windowMs, max, keyPrefix }) {
  return (req, res, next) => {
    const key = `${keyPrefix}:${req.ip}:${String(req.body?.email || req.body?.username || "").toLowerCase()}`;
    const now = Date.now();
    const bucket = rateLimitBuckets.get(key) || { count: 0, resetAt: now + windowMs };
    if (bucket.resetAt <= now) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }
    bucket.count += 1;
    rateLimitBuckets.set(key, bucket);
    if (bucket.count > max) return res.status(429).json({ error: "Too many attempts. Please try again later." });
    next();
  };
}

async function createPendingUser({ name, email, phone = "", employeeNumber = "", department: requestedDepartment = "", role }, options = {}) {
  const id = crypto.randomUUID();
  const token = crypto.randomBytes(32).toString("hex");
  const temporaryPassword = generateTemporaryPassword();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedEmployeeNumber = String(employeeNumber || "").trim();
  const department = normalizeDepartment(requestedDepartment);
  const normalizedRole = normalizeRole(role, department, Boolean(options.allowSystemAdminRole));
  const insertResult = await pool.query(
    `
      INSERT INTO users (id, name, username, email, phone, employee_number, department, role, status, password_hash, verification_token, verification_sent_at)
      VALUES ($1, $2, $3, $3, $4, $5, $6, $7, 'pending_verification', $8, $9, NOW())
      RETURNING *
    `,
    [id, name.trim(), normalizedEmail, phone.trim(), normalizedEmployeeNumber, department, normalizedRole, hashPassword(temporaryPassword), token],
  );

  const emailResult = await sendVerificationEmail({
    to: normalizedEmail,
    name: name.trim(),
    token,
    temporaryPassword,
    baseUrl: options.baseUrl,
  });

  return {
    user: normalizeUser(insertResult.rows[0]),
    emailSent: emailResult.sent,
    verifyUrl: emailResult.sent ? undefined : emailResult.verifyUrl,
  };
}

async function getActor(req) {
  const authorization = String(req.header("Authorization") || "");
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  const payload = verifyAuthToken(match[1]);
  if (!payload) return null;
  const email = String(payload.sub || "").trim().toLowerCase();
  const result = await pool.query("SELECT * FROM users WHERE email = $1 AND status = 'active' LIMIT 1", [email]);
  if (!result.rowCount) return null;
  const actor = result.rows[0];
  if (Number(payload.pwd || 0) !== passwordVersion(actor)) return null;
  return actor;
}

async function requireRoles(req, roles) {
  const actor = await getActor(req);
  const actorRole = actor ? normalizeRole(actor.role, actor.department, true) : "";
  const managerAllowed = roles.includes("מנהל/ת") && isManagerRole(actorRole);
  const scheduleEditorAllowed = roles.includes("אחראי/ת משמרת") && scheduleEditorRoles.includes(actorRole);
  const employeeAllowed = roles.some((role) => employeeRoles.includes(role)) && isEmployeeRole(actorRole);
  if (!actor || (!roles.includes(actorRole) && !managerAllowed && !scheduleEditorAllowed && !employeeAllowed)) {
    const error = new Error("Forbidden: insufficient permissions.");
    error.status = 403;
    throw error;
  }
  actor.role = actorRole;
  return actor;
}

function isEmployeeRole(role) {
  return employeeRoles.includes(role);
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/db-health", async (_req, res) => {
  const diagnostics = {
    ok: false,
    hasPostgresUrl: Boolean(process.env.POSTGRES_URL),
    hasSupabaseDatabaseUrl: Boolean(process.env.SUPABASE_DATABASE_URL),
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    nodeEnv: process.env.NODE_ENV || "",
    connection: getDatabaseConnectionDiagnostics(),
    steps: [],
  };

  try {
    await pool.query("SELECT 1 AS ok");
    diagnostics.steps.push("query");
  } catch (error) {
    return res.status(500).json({
      ...diagnostics,
      failedAt: "query",
      code: error.code || "",
      message: error.message || "Database query failed.",
    });
  }

  try {
    await ensureDbInitialized();
    diagnostics.steps.push("initDb");
  } catch (error) {
    return res.status(500).json({
      ...diagnostics,
      failedAt: "initDb",
      code: error.code || "",
      message: error.message || "Database initialization failed.",
    });
  }

  res.json({ ...diagnostics, ok: true });
});

app.get("/api/jewish-holidays", async (req, res, next) => {
  try {
    const start = dateOnly(req.query.start);
    const end = dateOnly(req.query.end);
    if (!start || !end) return res.status(400).json({ error: "start and end are required." });

    const cacheKey = `${start}:${end}`;
    if (holidayCache.has(cacheKey)) return res.json(holidayCache.get(cacheKey));

    const params = new URLSearchParams({
      v: "1",
      cfg: "json",
      start,
      end,
      maj: "on",
      min: "on",
      mod: "on",
      mf: "on",
      nx: "on",
      i: "on",
      lg: "he",
    });
    const response = await fetch(`https://www.hebcal.com/hebcal?${params.toString()}`);
    if (!response.ok) throw new Error(`Hebcal request failed with ${response.status}`);
    const payload = await response.json();
    const holidays = (payload.items || [])
      .filter((item) => item.category === "holiday" && item.date)
      .map(normalizeHoliday)
      .filter((holiday) => holiday.date && holiday.title);

    holidayCache.set(cacheKey, holidays);
    res.json(holidays);
  } catch (error) {
    next(error);
  }
});

app.get("/api/users", async (_req, res, next) => {
  try {
    const actor = await requireRoles(_req, ["מנהל/ת", "אחראי/ת משמרת", ...employeeRoles]);
    const result = isSystemAdmin(actor.role)
      ? await pool.query("SELECT * FROM users ORDER BY department, created_at DESC")
      : isManagerRole(actor.role) || actor.role === "אחראי/ת משמרת"
        ? await pool.query("SELECT * FROM users WHERE department = $1 ORDER BY created_at DESC", [actor.department || "NOC"])
        : await pool.query("SELECT * FROM users WHERE id = $1 ORDER BY created_at DESC", [actor.id]);
    res.json(result.rows.map(normalizeUser));
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/register", async (req, res, next) => {
  try {
    requireFields(req.body, ["name", "email", "role"]);
    const department = normalizeDepartment(req.body.department);
    const requestedRole = String(req.body.role || "").trim();
    if (!publicRegistrationRolesByDepartment[department].includes(requestedRole)) {
      return res.status(403).json({ error: "Public registration is limited to employee roles." });
    }
    const normalizedRole = normalizeRole(requestedRole, department, false);
    const result = await createPendingUser({ ...req.body, department, role: normalizedRole }, { baseUrl: getRequestBaseUrl(req) });
    res.status(201).json(result);
  } catch (error) {
    if (error.code === "23505") {
      error.status = 409;
      error.message = "A user with this email already exists.";
    }
    next(error);
  }
});

app.post("/api/auth/login", rateLimit({ windowMs: 15 * 60 * 1000, max: 20, keyPrefix: "login" }), async (req, res, next) => {
  try {
    requireFields(req.body, ["email", "password"]);
    const email = req.body.email.trim().toLowerCase();
    const result = await pool.query("SELECT * FROM users WHERE email = $1 OR username = $1 LIMIT 1", [email]);
    const user = result.rows[0];
    if (!user || user.status !== "active" || !verifyPassword(req.body.password, user.password_hash)) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    res.json({ user: normalizeUser(user), ...issueAuthToken(user) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/auth/me", async (req, res, next) => {
  try {
    const actor = await requireRoles(req, ["מנהל/ת", "אחראי/ת משמרת", ...employeeRoles]);
    res.json({ user: normalizeUser(actor) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/forgot-password", rateLimit({ windowMs: 15 * 60 * 1000, max: 20, keyPrefix: "forgot-password" }), async (req, res, next) => {
  try {
    requireFields(req.body, ["email"]);
    const email = req.body.email.trim().toLowerCase();
    const result = await pool.query("SELECT * FROM users WHERE email = $1 OR username = $1 LIMIT 1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.json({ ok: true, emailSent: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    await pool.query(
      `
        UPDATE users
        SET password_reset_token = $2,
            password_reset_sent_at = NOW(),
            updated_at = NOW()
        WHERE id = $1
      `,
      [user.id, token],
    );

    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      token,
      baseUrl: getRequestBaseUrl(req),
    });

    res.json({ ok: true, emailSent: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/reset-password", async (req, res, next) => {
  try {
    const token = String(req.query.token || "");
    if (!token) return res.status(400).send("Missing password reset token.");

    const result = await pool.query("SELECT email FROM users WHERE password_reset_token = $1 LIMIT 1", [token]);
    if (!result.rowCount) return res.status(404).send("Password reset token was not found or already used.");

    res.send(`
      <!doctype html>
      <html lang="he" dir="rtl">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>FastShift | איפוס סיסמה</title>
          <style>
            body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f4f7fb;font-family:Arial,sans-serif;color:#17212f}
            form{width:min(420px,calc(100% - 32px));display:grid;gap:14px;padding:28px;border:1px solid #dbe4ec;border-radius:8px;background:white;box-shadow:0 18px 45px rgba(19,33,47,.12)}
            h1,p{margin:0} label{display:grid;gap:7px;font-weight:700} input{min-height:44px;border:1px solid #dbe4ec;border-radius:8px;padding:8px 12px;font:inherit}
            button{min-height:46px;border:0;border-radius:8px;background:#126c65;color:white;font-weight:800;font:inherit;cursor:pointer}
          </style>
        </head>
        <body>
          <form method="post" action="/api/reset-password">
            <h1>איפוס סיסמה</h1>
            <p>שם המשתמש שלך יהיה: <strong>${escapeHtml(result.rows[0].email)}</strong></p>
            <input type="hidden" name="token" value="${escapeHtml(token)}">
            <label>סיסמה חדשה <input type="password" name="password" required minlength="8"></label>
            <label>אימות סיסמה חדשה <input type="password" name="confirmPassword" required minlength="8"></label>
            <button type="submit">עדכון</button>
          </form>
        </body>
      </html>
    `);
  } catch (error) {
    next(error);
  }
});

app.post("/api/reset-password", async (req, res, next) => {
  try {
    requireFields(req.body, ["token", "password", "confirmPassword"]);
    if (req.body.password !== req.body.confirmPassword) return res.status(400).send("Password confirmation does not match.");
    if (!isStrongPassword(req.body.password)) {
      return res.status(400).send("Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.");
    }

    const result = await pool.query(
      `
        UPDATE users
        SET username = email,
            password_hash = $2,
            password_updated_at = NOW(),
            password_reset_token = NULL,
            password_reset_sent_at = NULL,
            updated_at = NOW()
        WHERE password_reset_token = $1
        RETURNING email
      `,
      [req.body.token, hashPassword(req.body.password)],
    );

    if (!result.rowCount) return res.status(404).send("Password reset token was not found or already used.");

    res.send(`
      <!doctype html>
      <html lang="he" dir="rtl">
        <head><meta charset="utf-8"><title>FastShift</title></head>
        <body style="font-family:Arial,sans-serif;padding:32px">
          <h1>הסיסמה עודכנה בהצלחה</h1>
          <p>שם המשתמש שלך הוא ${escapeHtml(result.rows[0].email)}. אפשר לחזור למערכת FastShift ולהתחבר עם הסיסמה החדשה.</p>
          <p><a href="/">חזרה למערכת</a></p>
        </body>
      </html>
    `);
  } catch (error) {
    next(error);
  }
});

app.post("/api/users/invite", async (req, res, next) => {
  try {
    const actor = await requireRoles(req, ["מנהל/ת"]);
    requireFields(req.body, ["name", "email", "role"]);
    const department = getScopedDepartment(actor, req.body.department);
    const result = await createPendingUser({ ...req.body, department }, { allowSystemAdminRole: isSystemAdmin(actor.role), baseUrl: getRequestBaseUrl(req) });
    res.status(201).json(result);
  } catch (error) {
    if (error.code === "23505") {
      error.status = 409;
      error.message = "A user with this email already exists.";
    }
    next(error);
  }
});

app.get("/api/verify", async (req, res, next) => {
  try {
    const token = String(req.query.token || "");
    if (!token) return res.status(400).send("Missing verification token.");

    const result = await pool.query("SELECT email FROM users WHERE verification_token = $1 LIMIT 1", [token]);
    if (!result.rowCount) return res.status(404).send("Verification token was not found or already used.");

    res.send(`
      <!doctype html>
      <html lang="he" dir="rtl">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>FastShift | אימות משתמש</title>
          <style>
            body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f4f7fb;font-family:Arial,sans-serif;color:#17212f}
            form{width:min(420px,calc(100% - 32px));display:grid;gap:14px;padding:28px;border:1px solid #dbe4ec;border-radius:8px;background:white;box-shadow:0 18px 45px rgba(19,33,47,.12)}
            h1,p{margin:0} label{display:grid;gap:7px;font-weight:700} input{min-height:44px;border:1px solid #dbe4ec;border-radius:8px;padding:8px 12px;font:inherit}
            button{min-height:46px;border:0;border-radius:8px;background:#126c65;color:white;font-weight:800;font:inherit;cursor:pointer}
          </style>
        </head>
        <body>
          <form method="post" action="/api/verify">
            <h1>אימות משתמש</h1>
            <p>שם המשתמש שלך יהיה: <strong>${result.rows[0].email}</strong></p>
            <input type="hidden" name="token" value="${escapeHtml(token)}">
            <label>סיסמה נוכחית <input type="password" name="currentPassword" required minlength="8"></label>
            <label>סיסמה חדשה <input type="password" name="password" required minlength="8"></label>
            <label>אימות סיסמה חדשה <input type="password" name="confirmPassword" required minlength="8"></label>
            <button type="submit">עדכון</button>
          </form>
        </body>
      </html>
    `);
  } catch (error) {
    next(error);
  }
});

app.post("/api/verify", async (req, res, next) => {
  try {
    requireFields(req.body, ["token", "currentPassword", "password", "confirmPassword"]);
    if (req.body.password !== req.body.confirmPassword) return res.status(400).send("Password confirmation does not match.");
    if (!isStrongPassword(req.body.password)) {
      return res.status(400).send("Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.");
    }

    const existing = await pool.query("SELECT password_hash FROM users WHERE verification_token = $1 LIMIT 1", [req.body.token]);
    if (!existing.rowCount || !verifyPassword(req.body.currentPassword, existing.rows[0].password_hash)) {
      return res.status(401).send("Current temporary password is incorrect.");
    }

    const result = await pool.query(
      `
        UPDATE users
        SET status = 'active',
            username = email,
            password_hash = $2,
            password_updated_at = NOW(),
            verified_at = NOW(),
            verification_token = NULL,
            updated_at = NOW()
        WHERE verification_token = $1
        RETURNING email
      `,
      [req.body.token, hashPassword(req.body.password)],
    );

    if (!result.rowCount) return res.status(404).send("Verification token was not found or already used.");

    res.send(`
      <!doctype html>
      <html lang="he" dir="rtl">
        <head><meta charset="utf-8"><title>FastShift</title></head>
        <body style="font-family:Arial,sans-serif;padding:32px">
          <h1>הסיסמה עודכנה והמשתמש אומת בהצלחה</h1>
          <p>שם המשתמש שלך הוא ${result.rows[0].email}. אפשר לחזור למערכת FastShift ולהתחבר.</p>
          <p><a href="/">חזרה למערכת</a></p>
        </body>
      </html>
    `);
  } catch (error) {
    next(error);
  }
});

app.post("/api/users/:id/verify-admin", async (req, res, next) => {
  try {
    const actor = await requireRoles(req, ["מנהל/ת"]);
    const result = isSystemAdmin(actor.role)
      ? await pool.query(
          `
            UPDATE users
            SET status = 'active', verified_at = COALESCE(verified_at, NOW()), verification_token = NULL, updated_at = NOW()
            WHERE id = $1
            RETURNING *
          `,
          [req.params.id],
        )
      : await pool.query(
          `
            UPDATE users
            SET status = 'active', verified_at = COALESCE(verified_at, NOW()), verification_token = NULL, updated_at = NOW()
            WHERE id = $1 AND department = $2
            RETURNING *
          `,
          [req.params.id, actor.department || "NOC"],
        );

    if (!result.rowCount) return res.status(404).json({ error: "User not found." });
    res.json(normalizeUser(result.rows[0]));
  } catch (error) {
    next(error);
  }
});

app.patch("/api/users/:id/role", async (req, res, next) => {
  try {
    const actor = await requireRoles(req, ["מנהל/ת"]);
    requireFields(req.body, ["role"]);
    const target = await pool.query("SELECT department FROM users WHERE id = $1 LIMIT 1", [req.params.id]);
    if (!target.rowCount) return res.status(404).json({ error: "User not found." });
    const department = getScopedDepartment(actor, target.rows[0].department);
    if (!isSystemAdmin(actor.role) && target.rows[0].department !== department) return res.status(404).json({ error: "User not found." });
    const role = normalizeRole(req.body.role, department, isSystemAdmin(actor.role));
    const result = await pool.query(
      "UPDATE users SET role = $2, updated_at = NOW() WHERE id = $1 AND department = $3 RETURNING *",
      [req.params.id, role, department],
    );

    if (!result.rowCount) return res.status(404).json({ error: "User not found." });
    res.json(normalizeUser(result.rows[0]));
  } catch (error) {
    next(error);
  }
});

app.patch("/api/users/:id/details", async (req, res, next) => {
  try {
    const actor = await requireRoles(req, ["מנהל/ת"]);
    requireFields(req.body, ["name", "role", "email", "employmentStatus"]);
    const email = String(req.body.email || "").trim().toLowerCase();
    const name = String(req.body.name || "").trim();
    const phone = String(req.body.phone || "").trim();
    const requestedRole = String(req.body.role || "").trim();
    const employmentStatus = String(req.body.employmentStatus || "").trim();
    if (!name || !email || !requestedRole) {
      return res.status(400).json({ error: "Name, email and role are required." });
    }
    if (!["משרה חלקית", "משרה מלאה"].includes(employmentStatus)) {
      return res.status(400).json({ error: "Invalid employment status." });
    }
    const department = getScopedDepartment(actor, req.body.department || actor.department);
    const existing = await pool.query("SELECT email, employee_number, department FROM users WHERE id = $1 AND department = $2 LIMIT 1", [req.params.id, department]);
    if (!existing.rowCount) return res.status(404).json({ error: "User not found." });
    const role = normalizeRole(requestedRole, department, isSystemAdmin(actor.role));
    const employeeNumber = String(req.body.employeeNumber || "").trim();
    const duplicateEmail = await pool.query("SELECT id FROM users WHERE email = $1 AND id <> $2 LIMIT 1", [email, req.params.id]);
    if (duplicateEmail.rowCount) return res.status(409).json({ error: "Email already exists." });

    const result = await pool.query(
      `
        UPDATE users
        SET name = $2,
            username = $3,
            email = $3,
            employee_number = $4,
            role = $5,
            phone = $6,
            employment_status = $7,
            updated_at = NOW()
        WHERE id = $1 AND department = $8
        RETURNING *
      `,
      [req.params.id, name, email, employeeNumber, role, phone, employmentStatus, department],
    );

    await pool.query(
      `
        UPDATE attendance_entries
        SET employee_name = $2,
            employee_email = $3
        WHERE user_id = $1 OR LOWER(employee_email) = LOWER($4)
      `,
      [req.params.id, name, email, existing.rows[0].email],
    );

    res.json(normalizeUser(result.rows[0]));
  } catch (error) {
    next(error);
  }
});

app.delete("/api/users/:id", async (req, res, next) => {
  try {
    const actor = await requireRoles(req, ["מנהל/ת"]);
    if (isSystemAdmin(actor.role)) {
      await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    } else {
      await pool.query("DELETE FROM users WHERE id = $1 AND department = $2", [req.params.id, actor.department || "NOC"]);
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.get("/api/users/export", async (_req, res, next) => {
  try {
    const actor = await requireRoles(_req, ["מנהל/ת"]);
    const department = getScopedDepartment(actor, _req.query.department);
    const result = isSystemAdmin(actor.role) && !_req.query.department
      ? await pool.query("SELECT name, email, phone, employee_number, role, employment_status, status FROM users ORDER BY department, created_at DESC")
      : await pool.query("SELECT name, email, phone, employee_number, role, employment_status, status FROM users WHERE department = $1 ORDER BY created_at DESC", [department]);
    const rows = [["name", "employee_number", "role", "email", "phone", "employment_status", "account_status"], ...result.rows.map((user) => [
      user.name,
      user.employee_number || "",
      user.role,
      user.email,
      user.phone || "",
      user.employment_status || "משרה מלאה",
      user.status,
    ])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    res.header("Content-Type", "text/csv; charset=utf-8");
    res.header("Content-Disposition", "attachment; filename=fastshift-users.csv");
    res.send(`\uFEFF${csv}`);
  } catch (error) {
    next(error);
  }
});

app.get("/api/schedules/:weekStart", async (req, res, next) => {
  try {
    await requireRoles(req, ["מנהל/ת", "אחראי/ת משמרת", ...employeeRoles]);
    const department = normalizeDepartment(req.query.department);
    const schedule = await pool.query("SELECT * FROM weekly_schedules WHERE week_start = $1 AND department = $2", [req.params.weekStart, department]);
    const assignments = await pool.query(
      `
        SELECT sa.*, u.name AS employee_name, u.email AS employee_email, u.role AS employee_role
        FROM shift_assignments sa
        JOIN users u ON u.id = sa.user_id
        WHERE sa.week_start = $1
          AND sa.department = $2
          AND sa.shift_date >= sa.week_start
          AND sa.shift_date < (sa.week_start + INTERVAL '7 days')
        ORDER BY sa.shift_date, sa.shift_label, u.name
      `,
      [req.params.weekStart, department],
    );

    res.json({
      weekStart: dateOnly(req.params.weekStart),
      department,
      published: Boolean(schedule.rows[0]?.published_at),
      publishedAt: schedule.rows[0]?.published_at || null,
      assignments: assignments.rows.map(normalizeAssignment),
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/schedules/:weekStart/publish", async (req, res, next) => {
  try {
    const actor = await requireRoles(req, ["מנהל/ת", "אחראי/ת משמרת"]);
    const department = getScopedDepartment(actor, req.body.department);
    const result = await pool.query(
      `
        INSERT INTO weekly_schedules (week_start, department, published_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (department, week_start)
        DO UPDATE SET published_at = NOW(), updated_at = NOW()
        RETURNING *
      `,
      [req.params.weekStart, department],
    );
    res.json({ weekStart: dateOnly(result.rows[0].week_start), published: true, publishedAt: result.rows[0].published_at });
  } catch (error) {
    next(error);
  }
});

app.post("/api/schedules/:weekStart/publish-draft", async (req, res, next) => {
  const client = await pool.connect();
  try {
    const actor = await requireRoles(req, ["מנהל/ת", "אחראי/ת משמרת"]);
    const department = getScopedDepartment(actor, req.body.department);
    const assignments = Array.isArray(req.body.assignments) ? req.body.assignments : [];

    await client.query("BEGIN");
    const scheduleResult = await client.query(
      `
        INSERT INTO weekly_schedules (week_start, department, published_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (department, week_start)
        DO UPDATE SET published_at = NOW(), updated_at = NOW()
        RETURNING *
      `,
      [req.params.weekStart, department],
    );

    await client.query("DELETE FROM shift_assignments WHERE week_start = $1 AND department = $2", [req.params.weekStart, department]);

    for (const assignment of assignments) {
      if (!assignment.shiftDate || !assignment.shiftLabel || !assignment.shiftTime || !assignment.userId) continue;
      if (!isDateInWeek(assignment.shiftDate, req.params.weekStart)) continue;
      const selectedUser = await client.query("SELECT id FROM users WHERE id = $1 AND status = 'active' AND department = $2 LIMIT 1", [assignment.userId, department]);
      if (!selectedUser.rowCount) continue;
      await client.query(
        `
          INSERT INTO shift_assignments (id, week_start, department, shift_date, shift_label, shift_time, user_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          crypto.randomUUID(),
          req.params.weekStart,
          department,
          assignment.shiftDate,
          assignment.shiftLabel,
          assignment.shiftTime,
          assignment.userId,
        ],
      );
    }

    await client.query("COMMIT");
    res.json({ weekStart: dateOnly(scheduleResult.rows[0].week_start), published: true, publishedAt: scheduleResult.rows[0].published_at });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    next(error);
  } finally {
    client.release();
  }
});

app.post("/api/schedules/:weekStart/assignments", async (req, res, next) => {
  try {
    const actor = await requireRoles(req, ["מנהל/ת", "אחראי/ת משמרת"]);
    const department = getScopedDepartment(actor, req.body.department);
    requireFields(req.body, ["shiftDate", "shiftLabel", "shiftTime", "userId"]);
    const selectedUser = await pool.query("SELECT id FROM users WHERE id = $1 AND status = 'active' AND department = $2 LIMIT 1", [req.body.userId, department]);
    if (!selectedUser.rowCount) return res.status(404).json({ error: "User not found in this department." });

    await pool.query(
      `
        INSERT INTO weekly_schedules (week_start, department)
        VALUES ($1, $2)
        ON CONFLICT (department, week_start) DO NOTHING
      `,
      [req.params.weekStart, department],
    );

    const result = await pool.query(
      `
        INSERT INTO shift_assignments (id, week_start, department, shift_date, shift_label, shift_time, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
      [crypto.randomUUID(), req.params.weekStart, department, req.body.shiftDate, req.body.shiftLabel, req.body.shiftTime, req.body.userId],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/schedules/assignments/:id", async (req, res, next) => {
  try {
    const actor = await requireRoles(req, ["מנהל/ת", "אחראי/ת משמרת"]);
    if (isSystemAdmin(actor.role)) {
      await pool.query("DELETE FROM shift_assignments WHERE id = $1", [req.params.id]);
    } else {
      await pool.query("DELETE FROM shift_assignments WHERE id = $1 AND department = $2", [req.params.id, actor.department || "NOC"]);
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.get("/api/availability", async (_req, res, next) => {
  try {
    const actor = await requireRoles(_req, ["מנהל/ת", "אחראי/ת משמרת", ...employeeRoles]);
    const department = getScopedDepartment(actor, _req.query.department);
    const where = isEmployeeRole(actor.role)
      ? "WHERE ae.user_id = $1"
      : isSystemAdmin(actor.role) && !_req.query.department
        ? "WHERE u.role <> $1"
        : isSystemAdmin(actor.role)
          ? "WHERE u.department = $1 AND u.role <> $2"
          : "WHERE u.department = $1";
    const params = isEmployeeRole(actor.role)
      ? [actor.id]
      : isSystemAdmin(actor.role) && !_req.query.department
        ? [systemAdminRole]
        : isSystemAdmin(actor.role)
          ? [department, systemAdminRole]
          : [department];
    const result = await pool.query(
      `
        SELECT ae.*, u.name AS employee_name, u.email AS employee_email
        FROM availability_entries ae
        JOIN users u ON u.id = ae.user_id
        ${where}
        ORDER BY ae.availability_date DESC, ae.shift_label, u.name
      `,
      params,
    );
    res.json(result.rows.map(normalizeAvailability));
  } catch (error) {
    next(error);
  }
});

app.post("/api/availability", async (req, res, next) => {
  try {
    requireFields(req.body, ["userId", "date", "shiftLabel", "status"]);
    const actor = await requireRoles(req, ["מנהל/ת", "אחראי/ת משמרת", ...employeeRoles]);
    if (isEmployeeRole(actor.role) && actor.id !== req.body.userId) {
      return res.status(403).json({ error: "Forbidden: employees can only update their own availability." });
    }
    const selectedUser = isSystemAdmin(actor.role)
      ? await pool.query("SELECT id FROM users WHERE id = $1 LIMIT 1", [req.body.userId])
      : await pool.query("SELECT id FROM users WHERE id = $1 AND department = $2 LIMIT 1", [req.body.userId, actor.department || "NOC"]);
    if (!selectedUser.rowCount) return res.status(404).json({ error: "User not found in this department." });
    const result = await pool.query(
      `
        INSERT INTO availability_entries (id, user_id, availability_date, shift_label, status, note)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id, availability_date, shift_label)
        DO UPDATE SET status = EXCLUDED.status, note = EXCLUDED.note, updated_at = NOW()
        RETURNING *
      `,
      [crypto.randomUUID(), req.body.userId, req.body.date, req.body.shiftLabel, req.body.status, String(req.body.note || "").trim()],
    );
    res.status(201).json(normalizeAvailability(result.rows[0]));
  } catch (error) {
    next(error);
  }
});

app.post("/api/availability/bulk", async (req, res, next) => {
  const client = await pool.connect();
  try {
    requireFields(req.body, ["userId"]);
    const entries = Array.isArray(req.body.entries) ? req.body.entries : [];
    const actor = await requireRoles(req, ["מנהל/ת", "אחראי/ת משמרת", ...employeeRoles]);
    if (isEmployeeRole(actor.role) && actor.id !== req.body.userId) {
      return res.status(403).json({ error: "Forbidden: employees can only update their own availability." });
    }
    const selectedUser = isSystemAdmin(actor.role)
      ? await client.query("SELECT id FROM users WHERE id = $1 LIMIT 1", [req.body.userId])
      : await client.query("SELECT id FROM users WHERE id = $1 AND department = $2 LIMIT 1", [req.body.userId, actor.department || "NOC"]);
    if (!selectedUser.rowCount) return res.status(404).json({ error: "User not found in this department." });

    await client.query("BEGIN");
    let saved = 0;
    let deleted = 0;
    for (const entry of entries) {
      const date = String(entry.date || "").trim();
      const shiftLabel = String(entry.shiftLabel || "").trim();
      const note = String(entry.note || "").trim();
      const status = String(entry.status || "").trim();
      if (!date || !shiftLabel) continue;

      if (status) {
        await client.query(
          `
            INSERT INTO availability_entries (id, user_id, availability_date, shift_label, status, note)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (user_id, availability_date, shift_label)
            DO UPDATE SET status = EXCLUDED.status, note = EXCLUDED.note, updated_at = NOW()
          `,
          [crypto.randomUUID(), req.body.userId, date, shiftLabel, status, note],
        );
        saved += 1;
      } else {
        const result = await client.query(
          "DELETE FROM availability_entries WHERE user_id = $1 AND availability_date = $2 AND shift_label = $3",
          [req.body.userId, date, shiftLabel],
        );
        deleted += result.rowCount;
      }
    }
    await client.query("COMMIT");
    res.json({ ok: true, saved, deleted });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    next(error);
  } finally {
    client.release();
  }
});

app.delete("/api/availability", async (req, res, next) => {
  try {
    requireFields(req.body, ["userId", "date", "shiftLabel"]);
    const actor = await requireRoles(req, ["מנהל/ת", "אחראי/ת משמרת", ...employeeRoles]);
    if (isEmployeeRole(actor.role) && actor.id !== req.body.userId) {
      return res.status(403).json({ error: "Forbidden: employees can only update their own availability." });
    }
    const selectedUser = isSystemAdmin(actor.role)
      ? await pool.query("SELECT id FROM users WHERE id = $1 LIMIT 1", [req.body.userId])
      : await pool.query("SELECT id FROM users WHERE id = $1 AND department = $2 LIMIT 1", [req.body.userId, actor.department || "NOC"]);
    if (!selectedUser.rowCount) return res.status(404).json({ error: "User not found in this department." });
    await pool.query(
      "DELETE FROM availability_entries WHERE user_id = $1 AND availability_date = $2 AND shift_label = $3",
      [req.body.userId, req.body.date, req.body.shiftLabel],
    );
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.get("/api/attendance", async (_req, res, next) => {
  try {
    const actor = await requireRoles(_req, ["מנהל/ת", "אחראי/ת משמרת", ...employeeRoles]);
    const { userId } = _req.query;
    const department = getScopedDepartment(actor, _req.query.department);
    let result;
    if (canManageDepartmentSchedule(actor.role) && userId) {
      const selectedUser = isSystemAdmin(actor.role)
        ? await pool.query("SELECT email FROM users WHERE id = $1 AND status = 'active' AND role <> $2 LIMIT 1", [userId, systemAdminRole])
        : await pool.query("SELECT email FROM users WHERE id = $1 AND status = 'active' AND department = $2 LIMIT 1", [userId, actor.department || "NOC"]);
      if (!selectedUser.rowCount) return res.status(404).json({ error: "User not found." });
      result = await pool.query(`${attendanceSelect} WHERE ae.employee_email = $1 ORDER BY ae.clock_in DESC`, [selectedUser.rows[0].email]);
    } else if (canManageDepartmentSchedule(actor.role)) {
      result = isSystemAdmin(actor.role)
        ? await pool.query(`${attendanceSelect} WHERE COALESCE(ae.department, u.department) = $1 AND COALESCE(u.role, '') <> $2 ORDER BY ae.clock_in DESC`, [department, systemAdminRole])
        : await pool.query(`${attendanceSelect} WHERE COALESCE(ae.department, u.department) = $1 ORDER BY ae.clock_in DESC`, [actor.department || "NOC"]);
    } else {
      result = await pool.query(`${attendanceSelect} WHERE ae.employee_email = $1 ORDER BY ae.clock_in DESC`, [actor.email]);
    }
    const rows = await attachMissingShiftLabels(result.rows);
    res.json(rows.map(normalizeAttendance));
  } catch (error) {
    next(error);
  }
});

app.post("/api/attendance/toggle", async (req, res, next) => {
  const client = await pool.connect();
  try {
    const actor = await requireRoles(req, ["מנהל/ת", "אחראי/ת משמרת", ...employeeRoles]);
    const requestedUserId = String(req.body.userId || "").trim();
    const requestedEmail = String(req.body.email || "").trim().toLowerCase();
    if (!requestedUserId && !requestedEmail) {
      return res.status(400).json({ error: "userId or email is required." });
    }
    await client.query("BEGIN");
    const selectedUser = await client.query(
      `
        SELECT id, name, email, department, employee_number, employment_status
        FROM users
        WHERE status = 'active'
          AND ($1::uuid IS NOT NULL AND id = $1::uuid OR $2::text <> '' AND LOWER(email) = LOWER($2))
        LIMIT 1
        FOR UPDATE
      `,
      [requestedUserId || null, requestedEmail],
    );
    if (!selectedUser.rowCount) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "User not found." });
    }
    const targetUser = selectedUser.rows[0];
    const email = String(targetUser.email || "").trim().toLowerCase();

    if (!isManagerRole(actor.role) && actor.email !== email) {
      await client.query("ROLLBACK");
      return res.status(403).json({ error: "Forbidden: only managers can clock in/out for another user." });
    }
    if (!isSystemAdmin(actor.role) && targetUser.department !== (actor.department || "NOC")) {
      await client.query("ROLLBACK");
      return res.status(403).json({ error: "Forbidden: user belongs to another department." });
    }

    const openEntry = await client.query(
      "SELECT * FROM attendance_entries WHERE employee_email = $1 AND clock_out IS NULL ORDER BY clock_in DESC LIMIT 1 FOR UPDATE",
      [email],
    );

    if (openEntry.rowCount) {
      const assignment = openEntry.rows[0].shift_label ? null : await findCurrentAssignmentForUser(targetUser.id, new Date(openEntry.rows[0].clock_in));
      const department = assignment?.department || openEntry.rows[0].department || targetUser.department || "NOC";
      const closed = await client.query(
        "UPDATE attendance_entries SET clock_out = NOW(), shift_label = COALESCE(shift_label, $2), department = $3 WHERE id = $1 RETURNING *",
        [openEntry.rows[0].id, assignment?.shift_label || null, department],
      );
      await client.query("COMMIT");
      return res.json({
        action: "clock_out",
        entry: normalizeAttendance({
          ...closed.rows[0],
          department,
          employee_number: targetUser.employee_number,
          employment_status: targetUser.employment_status,
        }),
      });
    }

    const assignment = await findCurrentAssignmentForUser(targetUser.id);
    const department = assignment?.department || targetUser.department || "NOC";
    const inserted = await client.query(
      `
        INSERT INTO attendance_entries (id, user_id, employee_name, employee_email, department, shift_label, clock_in)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING *
      `,
      [crypto.randomUUID(), targetUser.id, targetUser.name, targetUser.email, department, assignment?.shift_label || null],
    );
    await client.query("COMMIT");

    res.status(201).json({
      action: "clock_in",
      entry: normalizeAttendance({
        ...inserted.rows[0],
        department,
        employee_number: targetUser.employee_number,
        employment_status: targetUser.employment_status,
      }),
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    next(error);
  } finally {
    client.release();
  }
});
app.post("/api/attendance/manual", async (req, res, next) => {
  const client = await pool.connect();
  try {
    const actor = await requireRoles(req, ["מנהל/ת", "אחראי/ת משמרת"]);
    requireFields(req.body, ["userId", "date", "shiftLabel", "clockIn", "clockOut"]);

    const department = getScopedDepartment(actor, req.body.department || actor.department);
    await client.query("BEGIN");
    const selectedUser = isSystemAdmin(actor.role)
      ? await client.query("SELECT id, name, email, department, employee_number, employment_status FROM users WHERE id = $1 AND status = 'active' LIMIT 1 FOR UPDATE", [req.body.userId])
      : await client.query("SELECT id, name, email, department, employee_number, employment_status FROM users WHERE id = $1 AND status = 'active' AND department = $2 LIMIT 1 FOR UPDATE", [req.body.userId, department]);
    if (!selectedUser.rowCount) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "User not found." });
    }

    const shiftLabel = req.body.shiftLabel.trim();
    const duplicate = await client.query(
      `
        SELECT id
        FROM attendance_entries
        WHERE user_id = $1
          AND shift_label = $2
          AND department = $4
          AND clock_in >= $3::date
          AND clock_in < ($3::date + INTERVAL '1 day')
        LIMIT 1
        FOR UPDATE
      `,
      [selectedUser.rows[0].id, shiftLabel, req.body.date, department],
    );
    const clockIn = buildShiftTimestamp(req.body.date, req.body.clockIn);
    let clockOut = buildShiftTimestamp(req.body.date, req.body.clockOut);
    if (clockOut <= clockIn) clockOut = new Date(clockOut.getTime() + 24 * 60 * 60 * 1000);

    if (duplicate.rowCount) {
      const updated = await client.query(
        `
          UPDATE attendance_entries
          SET employee_name = $2,
              employee_email = $3,
              entered_by_name = $4,
              clock_in = $5,
              clock_out = $6,
              department = $7
          WHERE id = $1
          RETURNING *
        `,
        [duplicate.rows[0].id, selectedUser.rows[0].name, selectedUser.rows[0].email, actor.name, clockIn, clockOut, department],
      );
      await client.query("COMMIT");
      return res.status(200).json(
        normalizeAttendance({
          ...updated.rows[0],
          employee_number: selectedUser.rows[0].employee_number,
          employment_status: selectedUser.rows[0].employment_status,
        }),
      );
    }

    const inserted = await client.query(
      `
        INSERT INTO attendance_entries (id, user_id, employee_name, employee_email, department, shift_label, entered_by_name, clock_in, clock_out)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `,
      [
        crypto.randomUUID(),
        selectedUser.rows[0].id,
        selectedUser.rows[0].name,
        selectedUser.rows[0].email,
        department,
        shiftLabel,
        actor.name,
        clockIn,
        clockOut,
      ],
    );
    await client.query("COMMIT");

    res.status(201).json(
      normalizeAttendance({
        ...inserted.rows[0],
        employee_number: selectedUser.rows[0].employee_number,
        employment_status: selectedUser.rows[0].employment_status,
      }),
    );
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    next(error);
  } finally {
    client.release();
  }
});

app.delete("/api/attendance/:id", async (req, res, next) => {
  try {
    const actor = await requireRoles(req, ["מנהל/ת", "אחראי/ת משמרת"]);
    const existing = await pool.query(
      `
        SELECT ae.id, u.department
        FROM attendance_entries ae
        LEFT JOIN users u
          ON u.id = ae.user_id
          OR LOWER(u.email) = LOWER(ae.employee_email)
        WHERE ae.id = $1
        LIMIT 1
      `,
      [req.params.id],
    );
    if (!existing.rowCount) return res.status(404).json({ error: "Attendance entry not found." });
    if (!isSystemAdmin(actor.role) && existing.rows[0].department !== (actor.department || "NOC")) {
      return res.status(403).json({ error: "Forbidden: attendance entry belongs to another department." });
    }

    const result = await pool.query("DELETE FROM attendance_entries WHERE id = $1 RETURNING id", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ error: "Attendance entry not found." });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.delete("/api/attendance", async (_req, res, next) => {
  try {
    await requireRoles(_req, ["מנהל/ת"]);
    res.status(405).json({ error: "Bulk attendance deletion is disabled. Delete specific records instead." });
  } catch (error) {
    next(error);
  }
});

app.get("/api/reports", async (req, res, next) => {
  try {
    const actor = await requireRoles(req, ["מנהל/ת", "אחראי/ת משמרת", ...employeeRoles]);
    const { from, to, userId } = req.query;
    if (!from || !to) return res.status(400).json({ error: "from and to are required." });
    const department = getScopedDepartment(actor, req.query.department);

    let employeeFilter = "";
    let params = [from, to];
    if (isManagerRole(actor.role) && userId) {
      const selectedUser = isSystemAdmin(actor.role)
        ? await pool.query("SELECT email FROM users WHERE id = $1 AND status = 'active' AND role <> $2 LIMIT 1", [userId, systemAdminRole])
        : await pool.query("SELECT email FROM users WHERE id = $1 AND status = 'active' AND department = $2 LIMIT 1", [userId, actor.department || "NOC"]);
      if (!selectedUser.rowCount) return res.status(404).json({ error: "User not found." });
      employeeFilter = "AND ae.employee_email = $3";
      params = [from, to, selectedUser.rows[0].email];
    } else if (isManagerRole(actor.role)) {
      employeeFilter = isSystemAdmin(actor.role)
        ? "AND COALESCE(ae.department, u.department) = $3 AND COALESCE(u.role, '') <> $4"
        : "AND COALESCE(ae.department, u.department) = $3";
      params = isSystemAdmin(actor.role) ? [from, to, department, systemAdminRole] : [from, to, actor.department || "NOC"];
    } else {
      employeeFilter = "AND ae.employee_email = $3";
      params = [from, to, actor.email];
    }
    const result = await pool.query(
      `
        ${attendanceSelect}
        WHERE ae.clock_in >= $1::date
          AND ae.clock_in < ($2::date + INTERVAL '1 day')
          ${employeeFilter}
        ORDER BY ae.employee_name ASC, ae.clock_in ASC
      `,
      params,
    );

    const entries = result.rows.map(normalizeAttendance);
    const completed = entries.filter((entry) => entry.clockOut);
    const totalHours = completed.reduce(
      (sum, entry) => sum + Math.max(0, new Date(entry.clockOut) - new Date(entry.clockIn)) / 36e5,
      0,
    );

    res.json({
      entries,
      metrics: {
        totalHours,
        totalShifts: entries.length,
        missing: entries.filter((entry) => !entry.clockOut).length,
      },
    });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.status || 500;
  res.status(status).json({ error: status >= 500 ? "Server error." : error.message || "Request failed." });
});

const isEntrypoint = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isEntrypoint && !process.env.VERCEL) {
  await ensureDbInitialized();
  app.listen(port, host, () => {
    console.log(`FastShift server running at http://${host}:${port}`);
    console.log(`Open locally at http://localhost:${port}`);
  });
}

export default app;
