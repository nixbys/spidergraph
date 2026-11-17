# Contributing to Spidergraph

Spidergraph is a personal project with one maintainer. Issues and pull requests are
welcome; reading this first saves a round trip.

## Scope

Spidergraph helps a person audit and reduce their own exposure. It does two things the
guides it draws on (Privacy Guides, EFF's Surveillance Self-Defense, The New Oil) don't:

1. It combines them into one tiered, domain-by-domain program.
2. It turns "have I done this?" into a scored, visualized audit instead of a checklist.

A feature that serves neither is probably out of scope. Some limits are firm:

- No backend, accounts, analytics or tracking scripts.
- Nothing that looks up, aggregates or fetches personal data about other people, or about
  the user from a third party. No breach-lookup proxy, no scraping broker sites. Where an
  outside check helps (Have I Been Pwned, a broker's opt-out page), a tool links to it and
  the user checks for themselves.

If you're unsure whether an idea fits, open an issue before writing code.

## Stack

Astro with static output, no SSR adapter. Astro is there to share the layout and nav
across pages, nothing more. Pages and components use plain HTML, CSS and JavaScript; a PR
that adds a UI framework, a state library or client-side routing will be declined. Bug
fixes, accessibility work, content corrections and extensions of an existing tool are all
in scope.

`marked` compiles the Playbook and Report from `src/content/*.md` at build time, so no
markdown is parsed in the browser.

## Local setup

```bash
npm install
npm run dev        # dev server at http://localhost:4321/spidergraph/
```

Before opening a PR:

```bash
npm run build
npm run typecheck
npm run lint
npm test
npm run format:check
```

CI runs the same commands.

## Conventions

- **One change per PR.** A content fix and a feature go in separate PRs.
- **Each page's CSS and script are plain files** in `public/pages/<page>.css` and
  `public/pages/<page>.js`, loaded by the page in `src/pages/`. Keep them there: the CSP
  allows no inline scripts, and Astro's scoped `<style>` wouldn't match the rows the tools
  build with JavaScript.
- **Colors come from `public/shared/tokens.css`.** Use `var(--teal)` and friends, also in
  SVG that JavaScript draws, never a literal hex value. Teal means good, amber partial,
  red a gap, blue informational. Each page passes its accent to `<BaseLayout accent="…">`.
- **Comments explain why.** A comment that restates the next line in English can go.
- **Notable changes go in `CHANGELOG.md`.**

## Changing a recommendation

Prices and tiers go stale. When you change one:

1. Check the vendor's own current pricing page.
2. Edit the markdown in `src/content/`, not the rendered page.
3. A tier change goes in two places that don't know about each other: the domain table in
   `src/content/personal-security-playbook.md` and the slot in the `DATA` array in
   `public/pages/privacy-stack-builder.js`.
4. Don't overwrite a changed figure silently. In `DATA`, set the slot's
   `verified:"YYYY-MM-DD"` and add a line to its `legacyNotes` with the old value and why
   it changed (`IDN-01` has an example). In markdown, put
   `<span class="verified-tag">✓ verified YYYY-MM-DD</span>` and
   `<span class="legacy-note"><b>Legacy:</b> …</span>` next to the cell.
5. A `verified` date means someone checked that figure on that day. Never add one without
   doing the check.

## Issues

For a stale price or dead link, name the page and row and give the correct value with a
source link; re-checking sources is what slows these fixes down. Report security problems
privately as described in [SECURITY.md](SECURITY.md).
