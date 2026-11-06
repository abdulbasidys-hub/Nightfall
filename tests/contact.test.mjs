import test from 'node:test';
import assert from 'node:assert/strict';
import {validateEnquiry} from '../src/lib/contact-validation.mjs';
import {sendContactNotification} from '../src/lib/contact-delivery.mjs';
import {createContactHandler, createSubmissionLimiter} from '../src/lib/contact-handler.mjs';

const enquiry = {name: 'Alex', email: 'alex@example.com', subject: 'A new website', message: 'I would like to discuss a website for my project.'};
const config = {apiKey: 'test-only-key', from: 'website@example.com', to: 'owner@example.com'};
const now = () => 1000000;
const body = {...enquiry, startedAt: now() - 10000, website: ''};
const request = (data = body, headers = {}) => new Request('http://localhost:3000/api/contact', {
  method: 'POST', headers: {origin: 'http://localhost:3000', 'Content-Type': 'application/json', ...headers}, body: JSON.stringify(data),
});
const handler = (overrides = {}) => createContactHandler({getConfig: () => config, sendEmail: async () => ({id: 'accepted-test-id'}), now, ...overrides});

test('validates and trims the four intended fields without carrying obsolete fields', () => {
  const result = validateEnquiry({...enquiry, name: ' Alex ', budget: 'ignored', service: 'ignored'});
  assert.deepEqual(result.value, enquiry);
});

test('rejects empty fields, invalid emails, header injection, length violations and malformed payloads', () => {
  for (const invalid of [null, [], {}, {...enquiry, name: 5}, {...enquiry, name: ''}, {...enquiry, email: ''},
    {...enquiry, email: 'invalid'}, {...enquiry, email: 'a@example.com\nBcc: other@example.com'},
    {...enquiry, subject: ''}, {...enquiry, subject: 'x'.repeat(161)}, {...enquiry, subject: 'Subject\nInjected'},
    {...enquiry, message: ''}, {...enquiry, message: 'short'}, {...enquiry, message: 'x'.repeat(5001)}]) {
    assert.ok(validateEnquiry(invalid).error);
  }
});

test('empty and invalid requests never reach the email provider', async () => {
  let calls = 0;
  const post = handler({sendEmail: async () => { calls++; return {id: 'unexpected'}; }});
  for (const invalid of [{}, {...body, email: ''}, {...body, email: 'wrong'}, {...body, subject: ''}, {...body, message: ''}]) {
    const response = await post(request(invalid));
    assert.equal(response.status, 400);
    assert.ok((await response.json()).error);
  }
  assert.equal(calls, 0);
});

test('accepts a valid backend request only after the provider confirms acceptance', async () => {
  let received;
  const post = handler({sendEmail: async (value, receivedConfig) => { received = {value, receivedConfig}; return {id: 'provider-id'}; }});
  const response = await post(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {success: true});
  assert.deepEqual(received, {value: enquiry, receivedConfig: config});
});

test('keeps the configured sender and recipient and places the visitor in Reply-To', async () => {
  let sent;
  await sendContactNotification(enquiry, config, async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(options.headers.Authorization, 'Bearer test-only-key');
    sent = JSON.parse(options.body);
    return Response.json({id: 'provider-id'});
  });
  assert.equal(sent.from, config.from);
  assert.deepEqual(sent.to, [config.to]);
  assert.equal(sent.reply_to, enquiry.email);
  assert.equal(sent.subject, 'Nightfall enquiry: A new website');
  assert.ok(sent.text.includes(enquiry.message));
});

test('provider rejection, network failure and malformed acceptance cannot produce success', async () => {
  for (const sendEmail of [
    (value, settings) => sendContactNotification(value, settings, async () => Response.json({message: 'Sender domain is not verified'}, {status: 403})),
    (value, settings) => sendContactNotification(value, settings, async () => Response.json({})),
    (value, settings) => sendContactNotification(value, settings, async () => new Response('not-json')),
    async () => { throw new Error('Network timeout'); },
    async () => ({}),
  ]) {
    const response = await handler({sendEmail})(request());
    assert.equal(response.status, 502);
    const result = await response.json();
    assert.ok(!result.success);
    assert.match(result.error, /could not be delivered/);
    assert.ok(!result.error.includes('Sender domain'));
  }
});

test('missing configuration reports unavailable without inventing delivery', async () => {
  const response = await handler({getConfig: () => ({})})(request());
  assert.equal(response.status, 503);
  assert.ok(!(await response.json()).success);
});

test('rejects cross-origin requests, hidden-field spam and implausible submission times', async () => {
  assert.equal((await handler()(request(body, {origin: 'https://untrusted.example'}))).status, 403);
  assert.equal((await handler()(request({...body, website: 'spam'}))).status, 400);
  assert.equal((await handler()(request({...body, startedAt: now() + 1}))).status, 429);
  assert.equal((await handler()(request({...body, startedAt: null}))).status, 429);
});

test('same-origin validation uses the requested host rather than an internal server alias', async () => {
  assert.equal((await handler()(request(body, {host: '127.0.0.1:3000', origin: 'http://127.0.0.1:3000'}))).status, 200);
});

test('rejects malformed JSON, non-JSON payloads and oversized requests', async () => {
  const malformed = new Request('http://localhost:3000/api/contact', {method: 'POST', headers: {origin: 'http://localhost:3000', 'Content-Type': 'application/json'}, body: '{'});
  assert.equal((await handler()(malformed)).status, 400);
  assert.equal((await handler()(request(body, {'Content-Type': 'text/plain'}))).status, 415);
  assert.equal((await handler()(request(body, {'Content-Length': '20001'}))).status, 413);
  assert.equal((await handler()(request({...body, message: '字'.repeat(7000)}))).status, 413);
});

test('submission limiter caps attempts and recovers after its time window', () => {
  let clock = now();
  const allow = createSubmissionLimiter(() => clock);
  for (let i = 0; i < 5; i++) assert.equal(allow(request()), true);
  assert.equal(allow(request()), false);
  clock += 10 * 60 * 1000;
  assert.equal(allow(request()), true);
});

test('rate-limited requests do not reach the provider', async () => {
  let calls = 0;
  const post = handler({allowSubmission: () => false, sendEmail: async () => { calls++; return {id: 'unexpected'}; }});
  assert.equal((await post(request())).status, 429);
  assert.equal(calls, 0);
});
