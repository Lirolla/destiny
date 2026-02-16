import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export async function sendPasswordResetEmail(
  to: string,
  resetToken: string,
  language: "en" | "pt" = "en"
): Promise<boolean> {
  // Build reset URL — use the request origin in production, fallback for dev
  const baseUrl = process.env.VITE_APP_URL || process.env.BASE_URL || "";
  const resetUrl = `${baseUrl}/auth?mode=reset&token=${resetToken}`;

  const subject =
    language === "pt"
      ? "Destiny Hacking — Redefinir Senha"
      : "Destiny Hacking — Reset Your Password";

  const html =
    language === "pt"
      ? `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #0a0a0a; color: #e5e5e5; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #10b981; margin: 0;">Destiny Hacking</h1>
        <p style="font-size: 12px; color: #737373; margin: 4px 0 0; letter-spacing: 2px; text-transform: uppercase;">Domine Seu Livre Arbítrio</p>
      </div>
      <h2 style="font-size: 18px; font-weight: 600; color: #f5f5f5; margin: 0 0 12px;">Redefinir Senha</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #a3a3a3; margin: 0 0 24px;">
        Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha. Este link expira em <strong style="color: #f5f5f5;">1 hora</strong>.
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${resetUrl}" style="display: inline-block; background: #10b981; color: #000; font-weight: 600; font-size: 14px; padding: 12px 32px; border-radius: 8px; text-decoration: none;">Redefinir Senha</a>
      </div>
      <p style="font-size: 12px; color: #737373; margin: 24px 0 0; line-height: 1.5;">
        Se você não solicitou esta redefinição, ignore este e-mail com segurança. Sua senha permanecerá inalterada.
      </p>
      <hr style="border: none; border-top: 1px solid #262626; margin: 24px 0;" />
      <p style="font-size: 11px; color: #525252; text-align: center; margin: 0;">
        Merx Digital Solutions Ltd · 128 City Road, London, EC1V 2NX
      </p>
    </div>
  `
      : `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #0a0a0a; color: #e5e5e5; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #10b981; margin: 0;">Destiny Hacking</h1>
        <p style="font-size: 12px; color: #737373; margin: 4px 0 0; letter-spacing: 2px; text-transform: uppercase;">Master Your Free Will</p>
      </div>
      <h2 style="font-size: 18px; font-weight: 600; color: #f5f5f5; margin: 0 0 12px;">Reset Your Password</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #a3a3a3; margin: 0 0 24px;">
        We received a request to reset your account password. Click the button below to create a new password. This link expires in <strong style="color: #f5f5f5;">1 hour</strong>.
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${resetUrl}" style="display: inline-block; background: #10b981; color: #000; font-weight: 600; font-size: 14px; padding: 12px 32px; border-radius: 8px; text-decoration: none;">Reset Password</a>
      </div>
      <p style="font-size: 12px; color: #737373; margin: 24px 0 0; line-height: 1.5;">
        If you didn't request this reset, you can safely ignore this email. Your password will remain unchanged.
      </p>
      <hr style="border: none; border-top: 1px solid #262626; margin: 24px 0;" />
      <p style="font-size: 11px; color: #525252; text-align: center; margin: 0;">
        Merx Digital Solutions Ltd · 128 City Road, London, EC1V 2NX
      </p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[Email] Failed to send password reset email:", error);
      return false;
    }

    console.log(`[Email] Password reset email sent to ${to}`);
    return true;
  } catch (err) {
    console.error("[Email] Error sending password reset email:", err);
    return false;
  }
}
