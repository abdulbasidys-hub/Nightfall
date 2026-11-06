# Verification record

External account workflows require owner configuration; they must not be treated as passed based on a successful source build.

## Automated checks completed

- Homepage atom revision: all rings and icon centers now share one SVG coordinate system. Two additional geometry tests verify icon centers on rotated ellipses at phone/desktop sizes, badge bounds, and separation. All five tests pass. The production SVG was rasterized and visually inspected at 310px and 450px; icon centers sit on the curves. Mobile hero CSS now centers the artwork, preserves the indented headline, and uses a 48px work-link touch target. Full-page browser mobile review remains pending.

- TypeScript validation passed.
- Final production build passed after dependency cleanup and the form widget lifecycle fix; all specified routes compiled successfully.
- Clean-install validation (`npm ci --dry-run --ignore-scripts --no-audit`) passed against the final manifest and lockfile.
- Three enquiry validation tests passed: accepted/trimmed input, malformed fields, and invalid payload types.
- Production HTTP smoke checks passed for Home, Work, Services, About, Contact, Studio setup, robots, sitemap, generated social image, and icon.
- Unknown page and project routes returned 404. Unconfigured draft preview returned 503. Cross-origin form POST returned 403, invalid form returned 400, implausible timing returned 429, and unavailable email delivery returned an explicit 503.
- Sitemap excludes Studio. No seeded portfolio content or fake claims are included.
- Dependency audit after compatible overrides: **0 high, 0 critical, 14 moderate**. Remaining findings propagate through Sanity CLI packages and `minimatch`; npm's proposed automatic solution is a major Sanity downgrade. No forced downgrade was applied. The exact dependency tree is locked; review upstream updates before deployment.

## Verification limits

- Browser visual/interactive QA was blocked: Windows Computer Use stopped because it could not confidently determine the current browser URL. No mobile screenshots, keyboard interaction, live focus behavior, or measured browser performance are claimed as verified. Responsive CSS and reduced-motion rules are implemented and still need browser review.
- No Sanity project credentials, approved portfolio data, mail provider settings, Turnstile keys, final contact details, or deployment account were supplied. CMS lifecycle, six presentation modes with real media, and successful email delivery require staging verification.
- Portrait artwork was supplied and preserved; it includes sunglasses despite the prose brief saying no accessories.

## Manual staging checklist

Revision on 6 November 2026: updated editorial headings, separated the homepage headline and orbital artwork, added four SVG capability icons, removed hero scroll/index extras, made wordmark asterisks green, removed budget/timeline from form validation and delivery, and replaced direct contact links with the owner's X profile. Production build, validation tests, and rendered route checks pass. Visual browser/mobile review remains unverified. Work currently displays all published projects without pagination; Home is limited to three featured projects.

- Sanity: authorized editor login, viewer permissions, draft creation and preview, image and video upload, publish, edit, unpublish, and draft isolation from public routes/sitemap.
- Work: featured order, archive layout, every category filter, tags/classification, six presentation types, optional fields, external links, related projects and unpublished slug 404.
- Contact: required-field and email validation, spam rejection, successful provider delivery, provider error feedback, direct email and WhatsApp links.
- Accessibility: keyboard menu and form, visible focus, screen-reader labels/statuses, 200% zoom, reduced motion, meaningful media alt text, captioned final videos.
- Responsive: 390px phone, 768px tablet, 1440px laptop, 1920px desktop; no horizontal scrolling.
