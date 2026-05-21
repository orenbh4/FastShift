import { Resend } from "resend";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

const mailFrom = () => process.env.MAIL_FROM || "FastShift <onboarding@resend.dev>";

async function sendViaResend(resend, payload) {
  const { data, error } = await resend.emails.send(payload);
  if (error) {
    console.error("[mail error] Resend API error:", JSON.stringify(error));
    const err = new Error(error.message || "שליחת המייל נכשלה.");
    err.status = 503;
    throw err;
  }
  return data;
}

export async function sendVerificationEmail({ to, name, token, temporaryPassword, baseUrl = process.env.APP_BASE_URL || "http://localhost:3000" }) {
  const verifyUrl = `${baseUrl}/api/verify?token=${encodeURIComponent(token)}`;
  const resend = getResend();

  if (!resend) {
    console.log(`[mail skipped] Verification link for ${to}: ${verifyUrl}`);
    console.log(`[mail skipped] Temporary password for ${to}: ${temporaryPassword}`);
    return { sent: false, verifyUrl };
  }

  try {
    await sendViaResend(resend, {
      from: mailFrom(),
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
  const resend = getResend();

  if (!resend) {
    const err = new Error("שירות המייל אינו מוגדר. פנה למנהל המערכת.");
    err.status = 503;
    throw err;
  }

  try {
    await sendViaResend(resend, {
      from: mailFrom(),
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
    const mailErr = new Error(err.message || "שליחת המייל נכשלה. נסה שוב מאוחר יותר.");
    mailErr.status = 503;
    throw mailErr;
  }
}
