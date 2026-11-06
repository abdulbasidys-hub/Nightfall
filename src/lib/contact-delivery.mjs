/** Only the configured authenticated address is used as the sender. */
export async function sendContactNotification(enquiry, config, fetchEmail = fetch) {
  const response = await fetchEmail('https://api.resend.com/emails', {
    method: 'POST',
    headers: {Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json'},
    signal: AbortSignal.timeout(15000),
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      reply_to: enquiry.email,
      subject: `Nightfall enquiry: ${enquiry.subject}`,
      text: `Name: ${enquiry.name}\nEmail: ${enquiry.email}\nSubject: ${enquiry.subject}\n\n${enquiry.message}`,
    }),
  });
  let result;
  try { result = await response.json(); } catch { throw new Error('Email provider returned an invalid response.'); }
  if (!response.ok || typeof result?.id !== 'string' || !result.id.trim()) {
    // Provider error bodies may contain account details; do not expose or log them.
    throw new Error('Email provider did not accept the enquiry.');
  }
  return {id: result.id};
}
