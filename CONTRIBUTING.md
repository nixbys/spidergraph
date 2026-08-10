# Contributing to Spidergraph

Thanks for considering it. This is a solo-maintained personal project, not a
governed open-source org — but it's public, and PRs/issues are genuinely welcome.
Read this before opening one; it'll save a round-trip.

## Before you write any code

**Read [CLAUDE.md](CLAUDE.md) first**, specifically the mission statement and its
guardrail. The short version: Spidergraph only ever helps a user audit and reduce
_their own_ exposure. It never looks up, aggregates, or auto-fetches personal data
about other people or about the user from a third party — no backend, no accounts,
no analytics, no tracking, by design. A PR that adds any of those, however useful it
sounds, will be declined regardless of implementation quality. If you're unsure
whether an idea fits, open an issue to discuss it before writing code.

Also read the **"Tech stack" section of CLAUDE.md**. This project deliberately
migrated to Astro for exactly one reason (nav/brand markup duplicated across 9 hand-written
pages) and stopped there — it is _not_ a general license to add more tooling.
Keep leaning on plain HTML/CSS/vanilla JS inside components and pages. A PR that
introduces a UI framework, a state-management library, or client-side routing on top
of Astro is out of scope; a PR that fixes a bug, improves accessibility, corrects
stale content, or extends an existing tool within its current architecture is very
much in scope.

## Local setup

```bash
npm install
npm run dev      # hot-reloading dev server at http://localhost:4321/spidergraph/
```

Before opening a PR, run:

```bash
npm run build      # must succeed — this is also the PR CI gate
npm run typecheck  # astro check — catches Props/interface mismatches
npm run lint       # if present — see package.json for the current script list
npm test           # if present — see package.json for the current script list
```

(Some of these were added after the project's initial build; if a script listed
above isn't in `package.json` yet, it hasn't landed — check `package.json` for what
actually exists rather than assuming this list is current.)

## What a good PR looks like here

- **One change, one PR.** A content fix and a feature don't belong in the same diff.
- **If you touch a recommendation's price/tier**, follow the verification convention
  in `README.md`'s Maintenance section and `CLAUDE.md`'s "Content maintenance
  discipline": re-check the vendor's own current pricing, don't rely on memory, and
  if the number changed, mark it with a `verified` date + a legacy note rather than
  silently overwriting the old figure. Both `src/content/personal-security-playbook.md`
  and `src/pages/privacy-stack-builder/index.astro`'s `DATA` array need updating
  together — they're two independent representations of the same recommendation.
- **If you touch a page's `<style>` block**, it needs `is:global` — see the gotcha
  documented in `CLAUDE.md`. Every tool creates DOM at runtime via JS, and Astro's
  default scoped CSS silently won't match elements that don't exist at build time.
- **If you touch shared color values**, source them from `public/shared/tokens.css`'s
  custom properties (`var(--teal)`, etc.), not literal hex — including inside
  JS-drawn SVG (`setAttribute("fill", "var(--teal)")` works fine in evergreen
  browsers). This was a real, repo-wide cleanup once; don't reintroduce it.
- **Match the existing voice in comments.** This codebase's comments explain _why_,
  not _what_ — see any existing file for the pattern. A comment that just restates
  the line below it in English isn't pulling its weight.
- **Update `CLAUDE.md` and `CHANGELOG.md`** if the change affects architecture,
  conventions, or is otherwise worth a future session/contributor knowing about.

## Reporting bugs / requesting features

Open a GitHub issue. For a content-accuracy bug (stale price, dead link), say which
tool/page and what the current correct value actually is, ideally with a source link
— that's the single most useful thing you can include, since re-verifying pricing is
the actual bottleneck on those fixes.

For security issues, see [SECURITY.md](SECURITY.md) instead of a public issue.
