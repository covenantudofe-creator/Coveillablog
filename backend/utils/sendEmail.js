
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const MAILGUN_BASE_URL = (
  process.env.MAILGUN_BASE_URL || "https://api.mailgun.net"
).replace(/\/+$/, "");

async function sendEmail(to, subject, html, context = {}) {
  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
    const error = new Error("Mailgun configuration is missing.");
    error.code = "MAILGUN_CONFIG_MISSING";
    throw error;
  }

  if (!to || !subject || !html) {
    const error = new Error("Recipient, subject, and email content are required.");
    error.code = "EMAIL_ARGUMENTS_MISSING";
    throw error;
  }

  const from =
    process.env.MAILGUN_FROM ||
    `Coveilla Blog <postmaster@${MAILGUN_DOMAIN}>`;

  const body = new URLSearchParams({
    from,
    to,
    subject,
    html,
  });

  const response = await fetch(
    `${MAILGUN_BASE_URL}/v3/${MAILGUN_DOMAIN}/messages`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );

  const result = await response.json().catch(() => ({}));
  const audience = context.notificationType === "login" ? ` (login audience=${context.audience})` : "";

  if (!response.ok) {
    console.error(`Mailgun rejected email request${audience} (HTTP ${response.status}).`);
    const error = new Error(`Mailgun rejected the email request (${response.status}).`);
    error.code = `MAILGUN_HTTP_${response.status}`;
    error.status = response.status;
    throw error;
  }

  const messageId = typeof result.id === "string" ? result.id : "unknown";
  console.info(`Mailgun accepted email request${audience}; messageId=${messageId}. Delivery is not confirmed.`);
  return result;
}

module.exports = sendEmail;
