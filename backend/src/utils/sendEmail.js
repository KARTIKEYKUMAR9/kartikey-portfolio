import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Nodemailer's default timeouts are generous enough to leave a request
  // hanging for a long time if Gmail's SMTP is slow to respond or an
  // outbound port is throttled. Bounding them means a real failure shows
  // up in the logs within seconds instead of minutes.
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

// contactController validates length and type, but never escapes HTML —
// that's not its job, since the same values also get stored in Mongo and
// shown as plain text in your React admin panel, where React escapes them
// automatically. This function is the one place that drops visitor input
// into raw HTML, so it's the one place that needs to escape it. Without
// this, a message like `<a href="evil.example">Reset your password</a>`
// renders as a real, clickable link inside a notification email that
// arrives from your own site — a phishing vector aimed at you, not your
// visitors.
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Table-based layout, not divs. This isn't a stylistic choice — Outlook's
// desktop rendering engine (still Word's, even in 2026) ignores large parts
// of CSS on <div>s but has decent <table> support. A div-based template
// that looks perfect in Gmail can render completely broken in Outlook;
// tables are the one layout method that behaves consistently across both.
function buildEmailHtml({ name, email, subject, message, submittedAt }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  // \n -> <br> AFTER escaping, never before — escaping first guarantees any
  // literal "<br>" the visitor typed becomes inert text, not a real tag.
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  return `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#0f172a; font-family: Arial, Helvetica, sans-serif;">
    <!-- Preheader: shown in the inbox preview line, hidden in the body -->
    <div style="display:none; max-height:0; overflow:hidden;">
      New portfolio message from ${safeName}: ${safeSubject}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background-color:#1e293b; border-radius:16px; overflow:hidden;">

            <!-- Header -->
            <tr>
              <td style="background-color:#22d3ee; padding:20px 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:40px; height:40px; background-color:rgba(255,255,255,0.25); border-radius:50%; text-align:center; vertical-align:middle; color:#ffffff; font-weight:bold; font-size:14px;">
                      KK
                    </td>
                    <td style="padding-left:12px; color:#ffffff; font-size:15px; font-weight:600;">
                      New Portfolio Contact Message
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Visitor details -->
            <tr>
              <td style="padding:24px 24px 0 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px; color:#94a3b8;">
                  <tr>
                    <td style="padding-bottom:6px;">
                      <strong style="color:#e2e8f0;">${safeName}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:2px;">
                      <a href="mailto:${safeEmail}" style="color:#22d3ee; text-decoration:none;">${safeEmail}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:16px; font-size:12px; color:#64748b;">
                      ${submittedAt}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Subject -->
            <tr>
              <td style="padding:0 24px;">
                <p style="margin:0 0 8px 0; font-size:12px; text-transform:uppercase; letter-spacing:0.05em; color:#64748b;">
                  Subject
                </p>
                <p style="margin:0 0 16px 0; font-size:15px; font-weight:600; color:#f1f5f9;">
                  ${safeSubject}
                </p>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="padding:0 24px;">
                <p style="margin:0 0 8px 0; font-size:12px; text-transform:uppercase; letter-spacing:0.05em; color:#64748b;">
                  Message
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a; border-radius:10px; margin-bottom:20px;">
                  <tr>
                    <td style="padding:16px; font-size:14px; line-height:1.6; color:#cbd5e1;">
                      ${safeMessage}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Reply button -->
            <tr>
              <td style="padding:0 24px 24px 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background-color:#22d3ee; border-radius:10px;">
                      <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent(subject)}"
                         style="display:block; padding:12px 0; font-size:14px; font-weight:600; color:#0f172a; text-decoration:none;">
                        Reply to ${safeName}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:16px 24px; border-top:1px solid #334155;">
                <p style="margin:0; font-size:11px; color:#64748b;">
                  Sent automatically from your portfolio's contact form.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

// Plain-text fallback. Every HTML email should ship one: it's what renders
// in text-only clients, and its absence is itself a signal some spam
// filters weigh — an email that's ONLY HTML with no text part looks more
// like a marketing blast than a personal message.
function buildEmailText({ name, email, subject, message, submittedAt }) {
  return [
    `New portfolio contact message`,
    ``,
    `From: ${name} <${email}>`,
    `Sent: ${submittedAt}`,
    `Subject: ${subject}`,
    ``,
    `Message:`,
    message,
  ].join("\n");
}

export const sendContactEmail = async ({
  name,
  email,
  subject,
  message,
}) => {
  const submittedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const templateData = { name, email, subject, message, submittedAt };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: email, // clicking "Reply" in Gmail goes straight to the visitor
    subject: `Portfolio Contact: ${subject}`,
    text: buildEmailText(templateData),
    html: buildEmailHtml(templateData),
  };

  await transporter.sendMail(mailOptions);
};