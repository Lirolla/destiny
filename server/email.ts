import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

type EmailLanguage = "en" | "pt" | "es";

const SUBJECTS: Record<EmailLanguage, string> = {
  en: "Destiny Hacking — Reset Your Password",
  pt: "Destiny Hacking — Redefinir Senha",
  es: "Destiny Hacking — Restablecer Contraseña",
};

const TAGLINES: Record<EmailLanguage, string> = {
  en: "Master Your Free Will",
  pt: "Domine Seu Livre Arbítrio",
  es: "Domina Tu Libre Albedrío",
};

const HEADINGS: Record<EmailLanguage, string> = {
  en: "Reset Your Password",
  pt: "Redefinir Senha",
  es: "Restablecer Contraseña",
};

const BODIES: Record<EmailLanguage, string> = {
  en: 'We received a request to reset your account password. Click the button below to create a new password. This link expires in <strong style="color: #f5f5f5;">1 hour</strong>.',
  pt: 'Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha. Este link expira em <strong style="color: #f5f5f5;">1 hora</strong>.',
  es: 'Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón de abajo para crear una nueva contraseña. Este enlace expira en <strong style="color: #f5f5f5;">1 hora</strong>.',
};

const BUTTON_LABELS: Record<EmailLanguage, string> = {
  en: "Reset Password",
  pt: "Redefinir Senha",
  es: "Restablecer Contraseña",
};

const DISCLAIMERS: Record<EmailLanguage, string> = {
  en: "If you didn't request this reset, you can safely ignore this email. Your password will remain unchanged.",
  pt: "Se você não solicitou esta redefinição, ignore este e-mail com segurança. Sua senha permanecerá inalterada.",
  es: "Si no solicitaste este restablecimiento, puedes ignorar este correo de forma segura. Tu contraseña permanecerá sin cambios.",
};

export async function sendPasswordResetEmail(
  to: string,
  resetToken: string,
  language: EmailLanguage = "en"
): Promise<boolean> {
  // Build reset URL — use the request origin in production, fallback for dev
  const baseUrl = process.env.VITE_APP_URL || process.env.BASE_URL || "";
  const resetUrl = `${baseUrl}/auth?mode=reset&token=${resetToken}`;

  const subject = SUBJECTS[language];
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #0a0a0a; color: #e5e5e5; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #10b981; margin: 0;">Destiny Hacking</h1>
        <p style="font-size: 12px; color: #737373; margin: 4px 0 0; letter-spacing: 2px; text-transform: uppercase;">${TAGLINES[language]}</p>
      </div>
      <h2 style="font-size: 18px; font-weight: 600; color: #f5f5f5; margin: 0 0 12px;">${HEADINGS[language]}</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #a3a3a3; margin: 0 0 24px;">
        ${BODIES[language]}
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${resetUrl}" style="display: inline-block; background: #10b981; color: #000; font-weight: 600; font-size: 14px; padding: 12px 32px; border-radius: 8px; text-decoration: none;">${BUTTON_LABELS[language]}</a>
      </div>
      <p style="font-size: 12px; color: #737373; margin: 24px 0 0; line-height: 1.5;">
        ${DISCLAIMERS[language]}
      </p>
      <hr style="border: none; border-top: 1px solid #262626; margin: 24px 0;" />
      <p style="font-size: 11px; color: #525252; text-align: center; margin: 0;">
        Merx Digital Solutions Ltd · 128 City Road, London, EC1V 2NX · Company No. 16920547
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

    console.log(`[Email] Password reset email sent to ${to} (${language})`);
    return true;
  } catch (err) {
    console.error("[Email] Error sending password reset email:", err);
    return false;
  }
}
