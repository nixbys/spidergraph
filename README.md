# Spidergraph

**Live site: https://nixbys.github.io/spidergraph/**

A self-contained, client-side privacy and security program: a tiered reference playbook,
six interactive audit tools, a generated-report mechanism, and a live coverage
visualization — no backend, no accounts, no tracking. Named after its own signature
visual: a radar chart that plots your real coverage across every security domain as one
shape.

## What's on the site

| Page | URL | What it is |
|---|---|---|
| Home | `/` | Hub/landing page linking everything below |
| Personal Security Playbook | `/playbook/` | Reference doc: threat modeling, 12 tiered control domains (Budget → Mid → No-Limit), 7 incident-response runbooks, and a maintenance-cadence calendar |
| Stack Builder | `/privacy-stack-builder/` | Interactive tool — pick a target tier, select what you actually run across 15 product/tool slots, see live gap analysis, cost totals, and a radar chart. Modeled on a PC-part-picker build sheet |
| OPSEC Field Manual | `/opsec-field-manual/` | Interactive tool — 44 behavioral controls across 6 domains (social engineering, physical security, legal documentation, operational discipline, incident readiness, maintenance cadence). Habits, not purchases |
| Broker Removal Tracker | `/broker-removal-tracker/` | Interactive tool — self-audit checklist across the 16 highest-traffic people-search/background-check sites, with a direct link to each site's own official opt-out page and progress tracked locally |
| Breach Check Tracker | `/breach-check-tracker/` | Interactive tool — add your own email addresses/aliases and track your own quarterly Have I Been Pwned check for each one; this page never performs a lookup itself, it only remembers what you've checked |
| Digital Legacy Worksheet | `/digital-legacy-worksheet/` | Interactive tool — a local-only worksheet for your trusted contact, where recovery info lives, and your password manager's emergency-access status; exports a working note, never a live password |
| Incident Response Card | `/incident-response-card/` | Interactive tool — fill in your own bank/card/carrier/police fraud lines once, then print or export a compact card with the Playbook's "first 15 minutes" steps |
| Recommendations Report | `/report/` | Generated capstone doc — top pick per category, best practices to close any gap to 100%, and full source documentation. Both audit tools can also export a personalized version of this same report reflecting your live selections |

The Playbook is the source of truth for every recommendation. The Stack Builder and OPSEC
Field Manual audit your actual setup against it; the other four interactive tools are narrower
by design — flat checklists and worksheets tracking your own progress against real, external
sites or your own emergency-preparedness info, never domain-scored against the Playbook and
never aggregating data about anyone else. Nothing entered in any tool ever leaves your browser.

**Deliberately out of scope, by design**: this project only ever helps a user audit and
reduce *their own* exposure. It does not include, and should not grow, any feature that
looks up or aggregates personal data about other people — that's the category of site the
Broker Removal Tracker exists to help users escape, not emulate.

## Structure

Built with [Astro](https://astro.build) (static output only — no server, no SSR adapter). The
site started as plain hand-duplicated HTML across 9 pages and migrated to Astro once that
duplication (a full copy of the nav/brand markup in every page) became real, felt friction —
see `CLAUDE.md` and `SESSION-NOTES.md` for the trigger and the full history.

```
src/
├── pages/                              # one folder per route → clean URL, no .html
│   ├── index.astro                     # hub / landing page
│   ├── playbook/index.astro            # compiles personal-security-playbook.md to HTML at build time
│   ├── report/index.astro              # compiles recommendations-report.md to HTML at build time
│   ├── privacy-stack-builder/index.astro
│   ├── opsec-field-manual/index.astro
│   ├── broker-removal-tracker/index.astro
│   ├── breach-check-tracker/index.astro
│   ├── digital-legacy-worksheet/index.astro
│   └── incident-response-card/index.astro
├── layouts/BaseLayout.astro            # shared <head> + nav for every page
├── components/Nav.astro                # the one copy of the brand SVG + top nav + Tools ▾ dropdown
└── content/                            # markdown source — edit these, not the .astro files
    ├── personal-security-playbook.md
    └── recommendations-report.md
public/                                 # served as-is at the site root
├── shared/                             # tokens.css, nav.css, nav.js, persist.js, history.js, doc-page.css, doc-page.js
├── logo-mark.svg, logo-lockup.svg, favicon.svg, favicon-*.png, favicon.ico
├── robots.txt, sitemap.xml
└── spidergraph-demo.gif                # real Stack Builder screen recording, for social/launch posts
astro.config.mjs                        # site + base path config, build output → dist/
LICENSE                                 # MIT
.github/workflows/deploy.yml            # npm ci && npm run build, deploy dist/ to GitHub Pages
```

`dist/` (Astro's build output) is gitignored and regenerated on every deploy — never hand-edit
anything there. Shared assets (design tokens, nav, `localStorage` helpers) live in `public/shared/`
and are linked by every page via `src/layouts/BaseLayout.astro`/`src/components/Nav.astro`, which
resolve asset URLs through Astro's `import.meta.env.BASE_URL` — no more hand-tracking `../` by
directory depth per page.

All six interactive tools (Stack Builder, OPSEC Field Manual, Broker Removal Tracker, Breach
Check Tracker, Digital Legacy Worksheet, Incident Response Card) save your progress to
`localStorage` and reload it on your next visit, with a `Reset` button in each to clear it —
nothing here means a backend or account, `localStorage` never leaves your browser. Each also has
a "Save snapshot" history card for dated checkpoints, separate from the live autosave.

## Local preview

```bash
npm install
npm run dev            # hot-reloading dev server at http://localhost:4321/spidergraph/
# — or, to check the exact production build —
npm run build && npm run preview
```

Markdown now compiles to HTML at build time (not fetched client-side), so there's no more
`file://`-doesn't-work caveat for the Playbook/Report pages specifically — but this is still an
Astro site, not flat files, so use one of the commands above rather than opening `dist/*.html`
directly.

## Deployment

Deployed automatically via GitHub Actions to GitHub Pages (`.github/workflows/deploy.yml`) on
every push to `main`: the workflow installs dependencies, runs `npm run build`, and publishes
`dist/` — Astro's static build output — as the Pages artifact. The top nav is `Home / Playbook /
Tools ▾ / Recommendations Report`, with all six interactive tools grouped inside a native
`<details>` dropdown rather than as flat top-level links.

## Brand

"Spidergraph" was checked against existing products before adoption — the name shows up
generically as a chart-type synonym (radar/spider charts) across various dashboarding
tools, and as an unrelated font marketplace, but not as a privacy/security product brand.
The logo mark is an original geometric construction (not derived from any existing logo)
built directly from the same radar-chart math the tools render live — see `public/logo-mark.svg`,
drawn once in `src/components/Nav.astro`.
Each interactive tool has its own accent color so a user can tell them apart at a glance —
though the palette only has four accents and reuse is now the norm past the first four pages:
Stack Builder = teal, OPSEC Field Manual = amber, Broker Removal Tracker = red, Breach Check
Tracker = blue (reuses Playbook's), Digital Legacy Worksheet = amber and Incident Response
Card = amber (both reuse OPSEC's, since both operationalize an OPSEC Field Manual domain — LEG
and IR respectively); the Playbook is blue and the Report is teal.

## Maintenance

Tool and pricing recommendations in this project are time-sensitive. Re-verify against
current sources (see the Recommendations Report's sources section) on a quarterly cadence
rather than treating this as a one-time build. A `verified:"YYYY-MM-DD"` date on a claim
means a person or agent actually re-checked that specific figure on that date — never
backfill one without doing the check.
