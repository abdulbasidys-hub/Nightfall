import assert from 'node:assert/strict';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
for (const route of ['/', '/work', '/services', '/about', '/contact', '/studio', '/robots.txt', '/sitemap.xml', '/opengraph-image', '/icon.svg']) {
  const response = await fetch(base + route);
  assert.equal(response.status, 200, route);
  if (route === '/opengraph-image') assert.match(response.headers.get('content-type'), /image\/png/);
  console.log(`PASS ${route}`);
}
for (const route of ['/this-page-does-not-exist', '/work/this-project-does-not-exist', '/api/draft-mode/enable', '/api/draft-mode/disable']) {
  assert.equal((await fetch(base + route)).status, 404, route);
}
const post = (body, origin = base) => fetch(base + '/api/contact', {method: 'POST', headers: {'Content-Type': 'application/json', origin}, body: JSON.stringify(body)});
assert.equal((await post({})).status, 400, 'empty form rejected');
assert.equal((await post({}, 'https://untrusted.example')).status, 403, 'cross-origin form rejected');
const body = {name: 'Local QA', email: 'qa@example.com', subject: 'Local form validation', message: 'Local validation check; this request must never send email.', startedAt: Date.now() - 10000};
for (const invalid of [{email: ''}, {email: 'invalid'}, {subject: ''}, {message: ''}]) {
  assert.equal((await post({...body, ...invalid})).status, 400);
}
assert.equal((await post({...body, startedAt: Date.now() + 10000})).status, 429, 'unreasonable submission time rejected');
assert.equal((await post({...body, website: 'spam'})).status, 400, 'hidden-field spam rejected without success');
const contact = await (await fetch(base + '/contact')).text();
for (const field of ['name', 'email', 'subject', 'message']) {
  assert.ok(contact.includes(`id="contact-${field}"`));
  assert.ok(contact.includes(`for="contact-${field}"`));
}
assert.ok(!/turnstile|challenges\.cloudflare|contact-service|contact-description/i.test(contact));
assert.ok(!contact.includes('mailto:') && !contact.includes('wa.me/'));
const sitemap = await (await fetch(base + '/sitemap.xml')).text();
assert.ok(!sitemap.includes('/studio'));
console.log('PASS 404s, published-only preview policy, four contact fields, validation, origin check, spam/timing checks, sitemap');
console.log('No valid enquiry was sent to a real mailbox by these smoke checks.');
