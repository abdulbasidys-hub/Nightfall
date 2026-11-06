# Nightfall

A multi-page Next.js App Router / TypeScript website built from `build.md`. The supplied portrait is preserved on About. No client work, metrics, or testimonials have been invented. The portfolio stays empty until real content is published.

## Run locally

Requires Node.js 22.12+ (Node 24 recommended).

```sh
npm ci
cp .env.example .env.local
npm run dev
```

On PowerShell use `Copy-Item .env.example .env.local`. Open http://localhost:3000. Production: `npm run build`, then `npm start`. Validation: `npm run typecheck` and `npm test`. With an **unconfigured** production server running, `npm run test:smoke` checks the routes and safe API failure states; it expects CMS and mail credentials to be absent.

## Connect Sanity

1. Create/select a project at https://www.sanity.io/manage. Create the `production` dataset and **make it private**. Invite only authorized editors; Sanity's own login and dataset permissions secure the embedded Studio. `/studio` is excluded from search indexing and public navigation. The Studio application shell is reachable; content and editing require an authorized Sanity account.
2. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in `.env.local` and hosting environment variables. These IDs are public, not credentials.
3. Create a **Viewer** read token and set server-only `SANITY_API_READ_TOKEN`. Never prefix this token with `NEXT_PUBLIC_`. A private dataset needs this token for published reads as well as previews.
4. Add `http://localhost:3000` and the final HTTPS website origin to Sanity API CORS origins, allowing credentials for Studio authentication. Restart Next.js after changing environment variables.
5. Visit `/studio`, sign in, and create a Project. Fill title, slug, summary, category, classification, presentation type, cover and its alt text. Add role, context, gallery, process, outcome, tags, and external link as available. Set featured/display order as needed. Upload images directly; gallery files accept video.
6. Use the Presentation tab to preview drafts. The signed Sanity handshake enables an HTTP-only Draft Mode cookie for that browser; public visitors receive the published perspective. Navigate the preview iframe to `/work/your-slug` if necessary. Exit using the preview banner.
7. Publish when approved. Changes are fetched on every request; unpublishing removes work without a source edit. Featured work appears on Home and the top of Work; other work appears in the asymmetric Creative Archive. Filters derive only from published projects. Optional fields stay hidden when absent.

The six presentation options each apply a different media treatment: product framing, staggered editorial gallery, website browser framing, centered video, paired case-study media, and a demonstration rail. An interactive demo is represented by supplied media and an optional external link; the site never invents live product functionality. For videos, include an accessible caption and provide captioned video files. This implementation has no sample or automatically seeded projects.

## Enquiry delivery

The Contact page links directly to https://x.com/nightfallbuilds with an X icon. Public email and WhatsApp environment variables are no longer used. The form collects name, email, service area, and project description; budget and timeline have been removed.

For form delivery, configure:

- `RESEND_API_KEY`: server-only Resend key.
- `CONTACT_FROM_EMAIL`: sender on your verified Resend domain.
- `CONTACT_TO_EMAIL`: inbox for enquiries.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and server-only `TURNSTILE_SECRET_KEY`: a Cloudflare Turnstile widget restricted to your website hostnames.

The form uses native browser validation plus server validation, a hidden honeypot, minimum completion time, same-origin enforcement, a request size limit, and server-verified Turnstile tokens. Turnstile is required for delivery; missing credentials return an explicit 503 message. Success is shown only after the mail provider accepts the message. The app does not store enquiries; the mail provider and receiving inbox process them. Approve privacy wording and retention arrangements before launch. Use Turnstile's documented test keys and a staging inbox for delivery QA; never commit credentials.

## Deploy

Deploy this directory as a standard Next.js application to a Node-compatible host (for example Vercel). Configure the environment variables, set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin, and build. Do not use a static export: CMS draft previews and the contact API require a server. The root metadata, generated social image, sitemap, robots, project metadata, and optimized Sanity images are included. Do not expose secrets in source or build logs.

## Owner review / launch gates

- Supply approved project content, imagery, dates, classification, and roles. PULSE is not included because no approved project data was supplied.
- Confirm final wordmark/logo and portrait usage. The provided image has sunglasses; it was preserved rather than altering the supplied character to match the prose description.
- Supply domain, email, WhatsApp, deployment access, and final privacy/legal copy.
- Connect Sanity, then test authorized login, unauthorized content access, draft preview, publish/unpublish, image/video upload, and each presentation type using actual staging content.
- Configure mail and Turnstile, then test a successful delivery and rejected spam, provider error, validation and retry states.
- Review desktop/tablet/mobile, keyboard navigation, and reduced motion with final content.

These external account workflows cannot be verified without owner configuration. See `QA.md` for checks actually completed. The project is a local implementation; no public launch has been performed.
