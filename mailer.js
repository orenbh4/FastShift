import nodemailer from "nodemailer";

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendVerificationEmail({ to, name, token, temporaryPassword, baseUrl = process.env.APP_BASE_URL || "http://localhost:3000" }) {
  const verifyUrl = `${baseUrl}/api/verify?token=${encodeURIComponent(token)}`;

  if (!smtpConfigured()) {
    console.log(`[mail skipped] Verification link for ${to}: ${verifyUrl}`);
    console.log(`[mail skipped] Temporary password for ${to}: ${temporaryPassword}`);
    return { sent: false, verifyUrl };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || "FastShift <no-reply@fastshift.local>",
      to,
      subject: "פרטי התחברות ואימות משתמש ל-FastShift",
      html: `
        <div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.6">
          <h2>שלום ${name},</h2>
          <p>נוצר עבורך משתמש במערכת FastShift.</p>
          <p><strong>שם משתמש:</strong> ${to}</p>
          <p><strong>סיסמה זמנית:</strong> ${temporaryPassword}</p>
          <p>כדי להפעיל את המשתמש יש ללחוץ על הקישור, להזין סיסמה חדשה ולאשר אותה:</p>
          <p><a href="${verifyUrl}">אימות משתמש ועדכון סיסמה</a></p>
          <p>לאחר העדכון, שם המשתמש שלך יהיה כתובת המייל הזו והסיסמה תהיה הסיסמה החדשה שבחרת.</p>
        </div>
      `,
    });
    return { sent: true, verifyUrl };
  } catch (err) {
    console.error("[mail error] Failed to send verification email:", err.message);
    return { sent: false, verifyUrl };
  }
}

export async function sendPasswordResetEmail({ to, name, token, baseUrl = process.env.APP_BASE_URL || "http://localhost:3000" }) {
  const resetUrl = `${baseUrl}/api/reset-password?token=${encodeURIComponent(token)}`;

  if (!smtpConfigured()) {
    const err = new Error("שירות המייל אינו מוגדר. פנה למנהל המערכת.");
    err.status = 503;
    throw err;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || "FastShift <no-reply@fastshift.local>",
      to,
      subject: "איפוס סיסמה ל-FastShift",
      html: `
        <div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.6">
          <h2>שלום ${name || ""},</h2>
          <p>קיבלנו בקשה לאיפוס הסיסמה שלך במערכת FastShift.</p>
          <p>כדי לבחור סיסמה חדשה יש ללחוץ על הקישור הבא:</p>
          <p><a href="${resetUrl}">בחירת סיסמה חדשה</a></p>
          <p>אם לא ביקשת איפוס סיסמה, אפשר להתעלם מהמייל הזה.</p>
        </div>
      `,
    });
    return { sent: true };
  } catch (err) {
    console.error("[mail error] Failed to send password reset email:", err.message);
    const mailErr = new Error("שליחת המייל נכשלה. נסה שוב מאוחר יותר.");
    mailErr.status = 503;
    throw mailErr;
  }
}
