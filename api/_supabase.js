import pg from "pg";

const { Pool } = pg;

function shouldUseSsl(connectionString) {
  if (String(process.env.DB_SSL || "").toLowerCase() === "false") return false;
  if (String(process.env.DB_SSL || "").toLowerCase() === "true") return true;
  return process.env.NODE_ENV === "production" || /supabase\.(co|com)|pooler\.supabase\.com/i.test(String(connectionString || ""));
}

function normalizeConnectionString(value) {
  try {
    const url = new URL(value);
    url.searchParams.delete("ssl");
    url.searchParams.delete("sslcert");
    url.searchParams.delete("sslkey");
    url.searchParams.delete("sslmode");
    url.searchParams.delete("sslrootcert");
    return url.toString();
  } catch {
    return value;
  }
}

const rawConnectionString = process.env.SUPABASE_DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!rawConnectionString) {
  throw new Error("Missing database connection string. Set SUPABASE_DATABASE_URL, POSTGRES_URL, or DATABASE_URL.");
}

const connectionString = normalizeConnectionString(rawConnectionString);

export const pool = new Pool({
  connectionString,
  max: Number(process.env.DATABASE_POOL_MAX || 5),
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
  ssl: shouldUseSsl(rawConnectionString) ? { rejectUnauthorized: false } : undefined,
});

export async function query(text, params) {
  return pool.query(text, params);
}
