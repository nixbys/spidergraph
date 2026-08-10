# Changelog

All notable changes to Spidergraph are documented here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/) — this project doesn't cut tagged
releases (it's a continuously-deployed static site, not a versioned package other
consumers install), so entries are grouped by date rather than by version number.
`package.json`'s `version` field stays at `1.0.0` for that same reason; bump it only
if this ever ships as a consumable package rather than a deployed site.

Built from the real commit history — this file doesn't backfill entries for changes
that predate it (2026-08-09). Going forward, add a line here in the same PR/commit
that makes the change, not as a separate retroactive pass.

## Unreleased

### Fixed

- `actions/checkout`/`actions/setup-node` bumped `v4`→`v7` in both `ci.yml` and
  `deploy.yml` — GitHub flagged `v4` as targeting a deprecated Node 20 runner (forced
  onto Node 24 in the meantime, but not for much longer). Verified `v7` is a real,
  stable, non-prerelease tag (not assumed from memory) before pinning to it.
- **Security**: `breach-check-tracker` (2 spots) and `digital-legacy-worksheet` (1
  spot) interpolated user-typed free text (an address label / an account name)
  unescaped into an `aria-label` attribute inside an `innerHTML` template, while the
  adjacent visible text correctly escaped the same value — an attribute-breakout
  injection, exploitable via a crafted label typed directly or delivered through the
  Backup & Restore import flow, both of which share this origin's `localStorage`
  across every tool (Digital Legacy Worksheet contacts, Incident Response Card fraud
  lines, etc.). Flagged by an automated PR review; verified as real and fixed via a
  live Playwright exploit attempt (confirmed the attack succeeded before the fix and
  failed after) rather than taking the report at face value. Fixed by setting the
  attribute via `setAttribute()` post-creation instead of string-interpolating it —
  not by wrapping it in the existing `escapeHtml()` helper, which only escapes
  `&`/`</>` for text-node contexts and does **not** escape the quote character an
  attribute-breakout injection actually needs; the initially-suggested fix ("use
  escapeHtml()") would not have fully closed this. Audited every other
  `aria-label`/`title` interpolation across all six tool pages for the same pattern —
  the only other matches (`broker-removal-tracker`'s broker names, all six tools'
  snapshot `data-date`/summary text) come from hardcoded constants or computed
  count-strings, never raw user input, so no further instances exist.
- CSP no longer allows `https://cdnjs.cloudflare.com` in `script-src` — a dead
  allowance left over from the pre-Astro era when `marked.js` loaded via CDN;
  nothing has loaded from there since the 2026-08-05 Astro migration.
- `persist.js`'s doc comment pointed at a `CLAUDE.md` section that no longer exists
  (renamed at some point); repointed to the section that actually covers it.
- `history.js` and `nav.js` used `var` while every other JS file in the project uses
  `let`/`const`; normalized.
- README's `public/shared/` file listing was missing `backup.js`, and the site-wide
  Backup & Restore feature (shipped 2026-08-08) was never described in the README at
  all.
- All 8 non-home pages' `<meta name="description">` exceeded Google's ~155–160 char
  snippet guidance (163–204 chars); tightened all of them. Six pages also carried a
  now-redundant explicit `ogDescription` prop duplicating the old long description —
  removed, since `BaseLayout` already falls back `ogDescription` to `description`.
- ~30 hardcoded hex color literals across page-level `<style>` blocks and SVG-drawing
  JS (radar charts, checkmarks, status pills) duplicated `tokens.css`'s palette
  instead of reading it, risking silent drift if the palette ever changes. Converted
  to `var(--token)` (and `color-mix(in srgb, var(--token) N%, transparent)` for
  alpha-tinted variants). Deliberately left alone: `Nav.astro`'s inline brand-mark SVG
  (matches the standalone `logo-mark.svg`/`logo-lockup.svg` files, which can't read
  CSS custom properties at all), the `<meta name="theme-color">` value (can't
  reference `var()` — it's read before any stylesheet loads), print-only `#fff`/`#000`
  colors in Incident Response Card's `@media print` block (intentionally ink-safe,
  not a token match), and a handful of one-off grays (`#374252`, `#5e6b7c`) that
  don't duplicate any existing token.

- Stack Builder's and OPSEC Field Manual's `render()`/`generateReport()` each
  independently recomputed the same status/percentage classification logic in two
  places within the same file (the live-scoring pass and the exported-report pass) —
  consolidated onto one implementation each (see "Added" below), removing the
  duplication rather than just leaving it in sync by hand.
- Stack Builder's `AUTH-01` (2FA / Hardware Auth) listed `cost:0` on both its
  hardware-key tiers, even though the Playbook's own prose already documented a real
  $25–60/key price for that exact row — an authoring oversight, not a stale figure.
  Corrected to $29 (1x, budget FIDO2-only key)/$58 (2x) after re-verifying current
  Yubico pricing; see the slot's `legacyNotes` for the full explanation, including why
  this is a one-time hardware cost rather than the recurring/annual cost every other
  priced slot tracks.
- `og:image`/`twitter:image` reused a 512×512 favicon, which crops awkwardly in most
  social-card previews; `twitter:card` was `summary` (small square) instead of
  `summary_large_image`. Built a proper 1200×630 `public/og-image.png` from the site's
  own brand lockup (`public/logo-lockup.svg`'s mark + wordmark, same dark gradient
  background as `tokens.css`'s `body`) via a headless-browser screenshot, and switched
  both meta tags plus the Twitter card type to match.

### Added

- `SECURITY.md`, `CONTRIBUTING.md`, this `CHANGELOG.md`, and GitHub issue/PR
  templates — process documentation the repo didn't have yet.
- `package.json` metadata: `license`, `author`, `homepage`, `repository`, `bugs`,
  `engines.node`.
- `.github/workflows/ci.yml` — build+typecheck+lint+test on every PR against `main`
  and on push to `main`, separate from `deploy.yml`. Previously only push-to-`main`
  triggered any CI, which meant a broken build could merge and only fail _after_
  landing.
- `astro check` (via `@astrojs/check` + `typescript`, new `tsconfig.json`) as a
  `typecheck` script — the `.astro` files' TypeScript `interface Props` blocks were
  never actually type-checked by anything before this. Result on first run: 0 errors,
  2 trivial unused-parameter hints (fixed).
- ESLint (`eslint.config.mjs`, flat config, `eslint-plugin-astro`) as a `lint` script.
  First real run caught a genuine dropped-error-cause bug in `backup.js`
  (`throw new Error(...)` inside a `catch` without `{cause: e}`) and a `history`
  local variable shadowing the browser's built-in `window.history` across all six
  tool pages (renamed to `historyStore` everywhere) — both fixed. Also surfaced (and
  fixed) 14 `prefer-const` warnings via `--fix`.
- Real re-verification (via current web search, not training-data memory — per
  `CLAUDE.md`'s own rule) of the 7 Stack Builder slots that had never carried a
  `verified` date: `AUTH-01`, `SYS-01`, `SYS-02`, `NET-02`, `NET-03`, `COM-01`,
  `DATA-02`. All 7 recommendations confirmed still current (YubiKey/Security Key
  pricing, GrapheneOS Pixel-only support, Ente Auth/Aegis both actively maintained,
  Mullvad DNS/Quad9, OpenWrt, Signal/SimpleX, and — the one genuinely volatile item —
  confirmed uBlock Origin still works at full strength on Firefox despite Chrome's
  Manifest V3 removal, which is exactly why this Playbook recommends Firefox
  specifically rather than "a Chromium browser + uBlock Origin"). All 15 Stack Builder
  slots now carry a `verified` date.
- Prettier (`.prettierrc.json`, `prettier-plugin-astro`) as `format`/`format:check`
  scripts, applied repo-wide after a full manual diff review of every changed file
  (not a spot-check) — see `CLAUDE.md`'s "SDLC tooling" section for what that review
  covered and the `prettier-plugin-astro` idempotency quirk it surfaced (needs two
  `format` passes to fully converge on a handful of `.astro` files).
- `test/` — Vitest unit tests for two tools' scoring logic:
  - `public/shared/stack-builder-scoring.js` (`classifyStatus`/`isCovered`/
    `coveragePercent`), extracted out of Stack Builder's `render()` and
    `generateReport()`, both of which previously reimplemented the same
    tier-vs-target classification independently.
  - `public/shared/opsec-scoring.js` (`computeReadiness`), extracted out of OPSEC
    Field Manual's `render()` and `generateReport()` for the same reason.
  - Both extractions went through two reverted approaches before landing on "plain
    classic script, same pattern as `persist.js`/`history.js`" — an ES-module version
    broke at runtime from a script-execution-ordering bug, and the fix for _that_ broke
    `astro check` instead (dropping `is:inline` on the consuming script exposed a
    ~500-line script to type-checking for the first time, surfacing 180+ unrelated
    pre-existing errors). See the header comment in `stack-builder-scoring.js` for the
    full story — worth reading before touching this pattern again.
  - `test/helpers/load-classic-script.js` runs these files in a real Node `vm`
    context (they have zero DOM/localStorage dependencies) rather than rewriting them
    as ES modules just to get a clean `import` in tests.
