# Threat Model

Spidergraph is a **fully static, client-side site: no backend, no accounts, no
server-side data of any kind** (see `README.md` and `SECURITY.md`). That removes
entire classes of risk that a normal web app carries — there is no auth to bypass, no
database to inject into, no session to hijack, no API to abuse. This document states
what actually remains, so contributors and reviewers don't have to reason it out from
scratch each time.

## Trust boundary

Everything a visitor does — answering the playbook's audit questions, building a
privacy-tool stack, tracking a breach response — happens entirely in their own
browser and is persisted, if at all, to that browser's own `localStorage`. Nothing is
ever sent anywhere: there is no server this site talks to at runtime. The only two
places outside a visitor's own browser that matter are:

1. **The npm dependency tree** used to _build_ the site (Astro, marked, and their
   transitive dependencies), and the GitHub Actions that run that build.
2. **The GitHub Pages deploy pipeline** that takes the build output and publishes it
   as the live site every visitor loads.

Both are real, ordinary attack surfaces even though the shipped artifact is static
HTML/CSS/JS with no server component.

## In scope: what could actually go wrong

### 1. Supply-chain risk in the npm dependency tree

`astro`, `marked`, and the eslint/prettier/vitest toolchain (`package.json`) all run
arbitrary package code at build time, in CI, and on every contributor's machine. A
compromised or vulnerable transitive dependency could inject malicious code into the
bundled output that every site visitor's browser would then execute, or exfiltrate
data from a contributor's/CI's environment during `npm ci`/`npm run build`.

Mitigations:

- `package-lock.json` is committed; CI and the deploy pipeline both use `npm ci`
  (exact, reproducible installs), never `npm install`.
- Dependabot (`.github/dependabot.yml`) tracks the `npm` and `github-actions`
  ecosystems weekly, grouped per ecosystem.
- `dependency-review.yml` blocks any pull request that introduces a
  moderate-or-worse severity advisory; a `npm audit` job runs advisory-only on
  pushes to catch pre-existing issues in already-shipped dependencies.
- `codeql.yml` runs CodeQL's `javascript-typescript` query suite against the actual
  application code (not just dependency metadata) on every PR, push to `main`, and
  weekly on a schedule.

### 2. XSS / content-injection in the interactive client-side tools

All six tools (`src/pages/*/index.astro`, backed by `public/shared/*.js`) build DOM
from user input and generate export/print output; the site has already had at least
one real attribute-breakout XSS fix (see git history — `82fc9dc`). Because there's no
server, the practical severity of most such bugs is self-XSS (a user's own crafted
input running in their own browser) — but the **Backup & Restore import path**
(`public/shared/backup.js`) is qualitatively different: it's the one place this site
parses a _file the user chooses_, which could originate from someone else (a shared
backup, a downloaded "template," a support request attachment). A validation bypass
there is the closest thing this site has to a cross-user injection vector.

Mitigations:

- `backup.js` validates the imported file is JSON with a `data` object and only
  writes `spidergraph-`-prefixed keys — deliberately narrow, to prevent a malformed
  or malicious backup file from injecting arbitrary `localStorage` keys.
- The CSP `<meta>` tag in `src/layouts/BaseLayout.astro` restricts `script-src` to
  `'self'` — no third-party script origins can be loaded even if a bug caused a page
  to try. It does **not** protect against inline-script injection: `script-src`
  includes `'unsafe-inline'` because the tool pages ship inline `<script is:inline>`
  blocks by design, so CSP is a secondary defense here, not the primary one — actual
  DOM-building code must not interpolate untrusted strings into `innerHTML` (use
  `textContent`/`createElement`, as the fixed bugs above corrected).
- `eslint.config.mjs` catches the mechanical bug classes (unused vars, accidental
  `var`, undefined globals). `codeql.yml` (above) adds taint-flow analysis for
  injection-shaped bugs that ESLint's rule set doesn't attempt.

### 3. Deploy pipeline integrity

`.github/workflows/deploy.yml` runs on every push to `main` with `pages: write` and
`id-token: write` permissions and publishes directly to the live site — this is the
one workflow in the repo that can put arbitrary content in front of every visitor. A
poorly written or tampered workflow (an unpinned third-party action swapped for a
malicious version, a workflow that lets a fork's PR run with these permissions, a
step that persists and leaks the checkout's credentials) is a realistic path to
defacement or a supply-chain-style client-side compromise of every visitor.

Mitigations:

- Every action in every workflow (`ci.yml`, `deploy.yml`, and the new workflows
  added here) is pinned to an exact upstream commit SHA, not a floating tag — a
  tag can be moved by the upstream maintainer or, in a compromise, by an attacker;
  a commit SHA cannot.
- `actions/checkout` steps set `persist-credentials: false` — the job's
  `GITHUB_TOKEN` is never left in the local git config for a later step (or a
  compromised dependency invoked by `npm run build`) to read and use.
- Every job declares its own least-privilege `permissions:` block (e.g. the `build`
  job only ever needs `contents: read`; only `deploy` gets `pages`/`id-token`)
  rather than relying on one broad workflow-level grant.
- `workflow-security.yml` runs `actionlint` (workflow syntax/shell-script bugs) and
  `zizmor` (Actions-specific SAST: template-injection, unpinned actions, credential
  persistence, over-broad permissions) against every workflow file in the repo,
  including itself and any future addition.
- `deploy.yml` and `ci.yml` trigger only on `push`/`pull_request` against `main`
  (no `pull_request_target`, which would run with write permissions against
  untrusted fork code) — deliberately kept that way; do not "fix" a fork-CI
  complaint by switching to `pull_request_target` without re-reading this section.

### 4. Secrets accidentally entering git history

There's no server-side secret in this project's actual design (no API keys, no
`.env` — see `SECURITY.md`), but a contributor could still paste a personal token
into a commit by accident while testing something unrelated. `secret-scan.yml`
(gitleaks, full history) and the matching local pre-commit hook
(`.pre-commit-config.yaml`) both guard against this, redundantly.

## Explicitly out of scope (by design, not oversight)

- **Server-side anything.** There is no backend to harden, patch, or rate-limit.
- **Authentication/authorization.** There are no accounts.
- **Real per-request HTTP security headers.** GitHub Pages serves static files only;
  a `<meta http-equiv="Content-Security-Policy">` tag is the ceiling of what's
  enforceable (no `frame-ancestors`, no `report-uri` support in the meta form —
  that's a browser-spec limitation of the meta tag itself, not a hosting oversight
  worth re-litigating in a report).
- **The site performing lookups on a user's behalf** (e.g. actually querying Have I
  Been Pwned, or actually submitting broker opt-outs). This is a deliberate mission
  guardrail, not a missing feature — see `README.md`'s "Deliberately out of scope."

## Known gaps

These are open and acknowledged, not hidden:

1. **`'unsafe-inline'` in the CSP's `script-src` and `style-src`.** Required because
   every tool page ships inline `<script is:inline>` and some inline `style=""`
   attributes are set at runtime. This means the CSP does not stop inline-script
   injection if a DOM-building bug ever reintroduced one — the real defense against
   that class of bug is code review + CodeQL + ESLint, not the CSP. Removing
   `'unsafe-inline'` would require a nonce- or hash-based policy, and a static-file
   host can't rotate a per-request nonce the way a real server response header
   could; a build-time-fixed nonce would offer little more than the current policy
   does. Worth revisiting if the site ever moves off pure static hosting.
2. **No Subresource Integrity (SRI).** Not currently needed — the only non-`self`
   resource loaded is the Google Fonts stylesheet, and there's no CDN-hosted script
   dependency to pin. If that ever changes (a CDN script is reintroduced), add SRI
   hashes at the same time.
3. **Branch protection on `main`** (requiring the CI/security workflows to pass and
   a review before merge) is a GitHub repository setting, not something a workflow
   file can enforce from inside the repo. Recommended, but must be turned on by a
   repo admin in Settings → Branches — nothing added by this hardening pass does
   that for you.
4. **`dependency-review-action` uses its default license policy** (flags
   copyleft/unknown licenses generically) rather than an explicit allow/deny list.
   Fine while the dependency tree stays MIT/permissive as it is today; revisit if
   that changes.
