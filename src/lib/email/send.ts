// Sends plain-text email through Brevo. Never throws: a failed email must not break the action that triggered it.
export async function sendEmail(opts: { to: string; subject: string; text: string }): Promise<boolean> {
  const key = process.env.BREVO_API_KEY;
  const from = process.env.MAIL_FROM_EMAIL;
  if (!key || !from) return false;
  try {
    const res = await fetch(process.env.BREVO_API_URL ?? "https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { name: process.env.MAIL_FROM_NAME || "Baba Spark", email: from },
        to: [{ email: opts.to }],
        subject: opts.subject.replace(/[\r\n]+/g, " ").slice(0, 150),
        textContent: opts.text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
