# Nightfall

Next.js App Router / TypeScript portfolio with a public Sanity dataset and a Resend-backed enquiry form. The established design and supplied portrait are preserved. No client projects, testimonials, or outcomes are invented.

## Local setup

Requires Node.js 22.12+; Node 24 is recommended.

```sh
npm ci
npm run dev
```

Use the existing ignored `.env` file, or copy `.env.example` to `.env.local` if you have not configured a local file yet. Never overwrite a configured file with the blank template. If both files exist, `.env.local` takes precedence: keep active settings in one file to avoid confusion. Both filenames are ignored by Git. Restart the dev server after changing values.

The only application environment variables are:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Keep `http://localhost:3000` locally; set the deployment's HTTPS origin when deploying. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public Sanity project identifier. |
| `NEXT_PUBLIC_SANITY_DATASET` | Public content dataset, normally `production`. |
| `RESEND_API_KEY` | Server-only Resend sending credential. |
| `CONTACT_FROM_EMAIL` | Server-only authenticated sender on a domain verified in Resend. |
| `CONTACT_TO_EMAIL` | Server-only inbox receiving enquiries. |

Only the first three variables are public. Never put private credentials into a variable prefixed `NEXT_PUBLIC_`, source files, commits, screenshots, or logs. Configure these same six variables in the deployment host's environment settings.

## Sanity

1. Select the project at https://www.sanity.io/manage and use the public `production` dataset. Set its ID and dataset in your local environment.
2. Add the local origin and eventual deployment origin to Sanity's CORS settings, allowing credentials for authenticated Studio use.
3. Open `/studio`, sign in with an authorized Sanity account, and create a Project. Public dataset visibility permits reading published content; it does not allow anonymous editing.
4. Supply the title, slug, summary, category, concept/commissioned classification, presentation type, cover image and alt text. Add role, context, gallery images/videos, process, outcomes, tags and external links where available.
5. Set featured status and display order. Publish when approved. The public site uses the published perspective and explicitly excludes draft/release documents. No read token is needed or used. Unpublishing removes a project from listings, details, and sitemap on subsequent requests.

Home displays up to three featured projects. Work displays featured projects and a Creative Archive, with category filters derived from published work. Work currently has no pagination. Project detail queries fetch only the requested slug. The only current CMS document type is Project; the other page copy remains in source.

The presentation options are product showcase, editorial gallery, website preview, video showcase, case study, and interactive demo. Each uses a distinct media treatment. Interactive demos use supplied media and an optional external link; no live product functionality is fabricated. Upload captioned videos and provide useful image alt text.

**Preview policy:** Studio supports editing and saving drafts, but the embedded website preview shows published content only. Website draft-mode endpoints have been removed. Previewing unpublished drafts on the website would require a separate authenticated design and credentials; it is not part of this token-free setup.

## Contact form

The form collects **name, email address, subject, and message**. All fields are required. The email address is used as Reply-To. The sender always comes from `CONTACT_FROM_EMAIL`, and notifications go only to `CONTACT_TO_EMAIL`. Direct contact links to the owner's X profile; no email address or WhatsApp number is displayed publicly.

Frontend and backend share validation. The backend checks origin, JSON/body size, a hidden honeypot, minimum completion time, and a bounded per-instance submission throttle. The throttle is best effort across a single running server process, not a shared global quota. No external anti-spam service, database, or message storage is introduced. Short-lived throttle counters expire after ten minutes.

The API uses Resend over HTTPS and reports success only after an OK provider response containing an email ID. This means **accepted for delivery**, not a guarantee of inbox delivery. Provider rejection, network failure, malformed responses, and missing configuration produce clear failure states. The form retains entered values after a failed submission. Credentials and raw provider error bodies are never returned to visitors or logged.

**Email launch requirement:** A Gmail sender is not an authenticated custom-domain sender. Obtain and verify a domain in Resend, then set `CONTACT_FROM_EMAIL` to an address on that domain. Keep the receiving inbox in `CONTACT_TO_EMAIL`; it may be Gmail. The implementation never substitutes a visitor address or a test-domain address to bypass verification. Until the sender is valid, a real request may fail and the visitor will see a delivery failure. Review final privacy wording and inbox retention before public launch.

## Verification

```sh
npm test
npm run build
npm run typecheck
node tests/check-sanity.mjs
```

Unit tests exercise shared form validation, request handling, rate limits, sender/Reply-To configuration, provider acceptance and rejection, public-only GROQ queries against test-only fixtures, and atom geometry. Mock email tests never send real messages. The Sanity check uses the saved environment and makes unauthenticated read-only queries; it reports a skip if the project ID is blank and does not print environment values.

With a production server running, `npm run test:smoke` checks routes, required form fields, validation/spam rejection, retired draft-route 404s, social image, sitemap, and assets. It never sends a valid enquiry to a real mailbox. For an alternate local port, set `TEST_BASE_URL` in that test process. Real successful email delivery must be verified separately after domain setup. Read `QA.md` for observed results and limits.

## Deployment

Run `npm run build`, then `npm start`, or deploy to a Node-compatible Next.js host such as Vercel. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin and configure the other five variables privately in the host dashboard. Static export is unsuitable because CMS reads and contact delivery use server code. The project includes page/project metadata, social artwork, sitemap, robots, 404/error states, responsive images and reduced-motion styles.

Supply approved portfolio content, final domain, configured integration values, and a verified sender before launch. Successful source checks do not establish live CMS access, email deliverability, authenticated Studio workflows, or full browser/mobile QA.
