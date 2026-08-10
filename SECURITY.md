# Security Policy

Spidergraph is a static, client-side site with no backend, no accounts, and no
server-side data of any kind — see [CLAUDE.md](CLAUDE.md)'s mission guardrail and
`README.md`. That constrains the realistic threat model considerably, but it isn't
zero:

## What's in scope

- **XSS or data-exfiltration in any interactive tool.** All six tools
  (`localStorage`-backed) build DOM from user input and generate exports/print
  output. A bug that lets one user's own input execute as script, or that causes
  `localStorage` data to leave the browser (contradicting the no-backend design), is
  a real finding.
- **The Backup & Restore import path** (`public/shared/backup.js`). It's the one
  place this site parses a file a user chooses and writes to `localStorage` from it.
  It validates the file is JSON with a `data` object and only writes
  `spidergraph-`-prefixed keys, precisely to prevent a malicious/malformed backup
  file from injecting arbitrary keys into this origin's storage — if you find a way
  around that, report it.
- **CSP or other header misconfiguration** that weakens the site's own defenses (see
  the CSP `<meta>` tag in `src/layouts/BaseLayout.astro` — GitHub Pages serves static
  files only, so a `<meta>` tag is the ceiling of what's enforceable here; that's a
  hosting constraint, not something a report needs to relitigate).
- **Dependency vulnerabilities** in `astro` or `marked` (see `package.json`) that are
  actually reachable given how this project uses them (build-time markdown
  compilation, static output — no server-side execution of untrusted input).
- **GitHub Actions supply-chain issues** in `.github/workflows/` (e.g. an unpinned
  action version that could be a vector).

## What's explicitly out of scope

- Reports about the lack of a backend, accounts, or server-side rate limiting —
  that's the design, not a gap (see CLAUDE.md).
- The Broker Removal Tracker linking out to real third-party opt-out pages, or the
  Breach Check Tracker linking to Have I Been Pwned — this project never performs
  lookups on a user's behalf by design; see the mission guardrail in `CLAUDE.md` and
  `README.md`'s "Deliberately out of scope" section before reporting this as a gap.
- Content/pricing accuracy issues (a tool recommendation being stale) — that's a
  maintenance issue, not a security one. Open a normal issue instead, following the
  verification convention in `README.md`'s Maintenance section.

## Reporting a vulnerability

This is a solo-maintained project with no dedicated security team or bug bounty —
please calibrate expectations accordingly, but reports are genuinely welcome.

Use **[GitHub's private vulnerability reporting](https://github.com/nixbys/spidergraph/security/advisories/new)**
(Security tab → "Report a vulnerability") rather than a public issue, so anything
exploitable isn't disclosed before a fix ships. Include:

- What page/tool, and what input or action triggers it.
- What you expected vs. what actually happened.
- Impact, if not obvious (e.g. "this lets data leave the browser," "this executes
  arbitrary script").

There's no formal SLA, but expect an initial response within a few days. Credit is
happily given in the fix's commit/changelog entry unless you'd rather stay anonymous.
