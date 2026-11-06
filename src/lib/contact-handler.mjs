import {validateEnquiry} from './contact-validation.mjs';

const deliveryError = 'Your enquiry could not be delivered. Please try again later or contact Nightfall on X.';
const json = (body, status = 200) => Response.json(body, {status, headers: {'Cache-Control': 'no-store'}});

/** Best-effort per-server-instance throttling; no external service or storage. */
export function createSubmissionLimiter(now = Date.now) {
  const attempts = new Map();
  return request => {
    const time = now();
    for (const [key, entry] of attempts) if (entry.expires <= time) attempts.delete(key);
    const key = (request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local').slice(0, 128);
    const entry = attempts.get(key);
    if (entry) {
      if (entry.count >= 5) return false;
      entry.count++;
    } else {
      if (attempts.size >= 1000) attempts.delete(attempts.keys().next().value);
      attempts.set(key, {count: 1, expires: time + 10 * 60 * 1000});
    }
    return true;
  };
}

export function createContactHandler({getConfig, sendEmail, now = Date.now, allowSubmission = createSubmissionLimiter(now)}) {
  return async function POST(request) {
    const url = new URL(request.url);
    const expectedOrigin = url.protocol + '//' + (request.headers.get('host') || url.host);
    if (request.headers.get('origin') !== expectedOrigin) {
      return json({error: 'Please submit the form from this website.'}, 403);
    }
    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
      return json({error: 'Please submit a valid enquiry.'}, 415);
    }
    if (Number(request.headers.get('content-length') || 0) > 20000) {
      return json({error: 'Your enquiry is too long.'}, 413);
    }
    let data;
    try {
      const raw = await request.text();
      if (new TextEncoder().encode(raw).length > 20000) return json({error: 'Your enquiry is too long.'}, 413);
      data = JSON.parse(raw);
    } catch {
      return json({error: 'Please submit a valid enquiry.'}, 400);
    }
    const validated = validateEnquiry(data);
    if (validated.error) return json({error: validated.error, errors: validated.errors}, 400);
    if (data.website) return json({error: 'Your enquiry could not be submitted.'}, 400);
    if (!Number.isFinite(data.startedAt) || now() - data.startedAt < 3000) {
      return json({error: 'Please take a moment to review your enquiry, then send again.'}, 429);
    }
    const config = getConfig();
    if (!config.apiKey || !config.from || !config.to) return json({error: deliveryError}, 503);
    if (!allowSubmission(request)) return json({error: 'Too many enquiries. Please try again in ten minutes.'}, 429);
    try {
      const accepted = await sendEmail(validated.value, config);
      if (!accepted?.id) throw new Error('Email was not accepted.');
      return json({success: true});
    } catch {
      return json({error: deliveryError}, 502);
    }
  };
}
