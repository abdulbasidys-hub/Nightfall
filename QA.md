# Nightfall verification — 6 November 2026

This record describes the current public-Sanity and Resend configuration. Earlier setup directions requiring private datasets, website draft previews, or a third-party challenge widget are superseded by README.md.

## Changes verified

- Preserved the existing website visual identity, hero artwork, typography, responsive styles, and X contact link.
- Contact form now collects only required name, email address, subject and message. The hidden honeypot is not a user-facing field.
- Shared browser/server validation, per-field feedback and focus, truthful success/failure states, and retention of input after delivery failure are implemented.
- Resend uses only the configured authenticated sender and receiving inbox. The visitor address is Reply-To. Success requires a successful provider response containing an email ID; acceptance is not an inbox-delivery guarantee.
- Removed the challenge widget, its server checks, its script/types/styles, public email/WhatsApp settings, and read-token dependencies.
- Public CMS queries use no token and exclude drafts and release versions. Slug detail queries are parameterized and fetch only the requested project.
- Studio retains native authenticated editing. Its website preview shows published content only. Removed website draft endpoints return 404.

## Environment and privacy

The owner clarified that active values are saved in `.env`. All six intended variables are present there: public site URL/project ID/dataset, plus server-only Resend key/sender/recipient. The local URL remains `http://localhost:3000`. No actual values are recorded in this report.

Both `.env` and `.env.local` are ignored by Git and are not tracked. Obsolete entries were removed without printing retained values. A scan found no configured private values in tracked files or public build assets. `.env.example` contains only the six intended settings and no private values.

## Results

- **Production build:** passed, including Next.js TypeScript validation.
- **Standalone TypeScript check:** passed.
- **Automated tests:** 17 passed. These cover required fields, invalid email, empty/malformed input, field length/header injection, origin/body checks, honeypot/timing, per-instance throttle, configured From/To and visitor Reply-To, accepted delivery, provider rejection/network error/malformed success, public-only GROQ listing/detail/media projection/sitemap, and responsive atom geometry.
- **Live Sanity:** an unauthenticated published-content query succeeded and returned **0 published projects**. Public website listings display the honest empty exhibition state. No real project details or CMS images could be exercised because no published projects exist. Query and media contracts were tested separately using local fixtures that were never uploaded or published.
- **Contact request checks:** empty/invalid requests returned 400, foreign origins 403, implausible submission times 429, and hidden-field spam 400. None of those requests sent email.
- **Live sender failure:** one valid local form request using the configured Gmail sender returned HTTP 502 with the intended delivery-failure message and no success response. No successful inbox delivery is claimed. Controlled mock-provider tests separately prove backend success handling and rejection handling.
- **Routes and assets:** Home, Work, Services, About, Contact, Studio, robots, sitemap, social image and icon returned 200. Unknown page/project and retired website draft URLs returned 404. The supplied portrait loaded through Next.js image optimization. Studio is absent from the sitemap.
- **Dependency audit:** installation reported 14 moderate advisories inherited through the Sanity toolchain; no high/critical findings were reported. No forced major downgrade was applied.

## Remaining verification and launch inputs

1. Verify a custom domain with Resend and change the configured sender to an address on that verified domain. Then confirm one real enquiry arrives and Reply opens to the visitor's address. Gmail cannot be used as an authenticated custom-domain sender.
2. Publish approved project content, then rerun `node tests/check-sanity.mjs` to test live detail queries and cover images. Exercise all six presentation types and real gallery/video content before launch.
3. Check authenticated Studio login, authoring, upload, publish and unpublish with the owner's account. No admin credentials or temporary projects were created by the implementation agent.
4. Browser console, interactive form focus/feedback and full mobile visual QA remain unverified: the browser-access host was unavailable. Existing responsive layout rules were preserved; source/build/HTTP checks do not replace browser testing.
5. No lint command or linter is configured in this repository; no lint pass is claimed. Build/TypeScript checks passed. Node reports an existing non-fatal module-type warning for the TypeScript atom geometry test import; all tests pass.

No deployment or GitHub push was performed as part of this update. See README.md for local setup, environment precedence, CMS publishing and deployment instructions.
