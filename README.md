# Spidergraph

**Live site: https://nixbys.github.io/spidergraph/**

A self-contained, client-side privacy and security program: a tiered reference playbook,
four interactive audit tools, a generated-report mechanism, and a live coverage
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
| Recommendations Report | `/report/` | Generated capstone doc — top pick per category, best practices to close any gap to 100%, and full source documentation. Both audit tools can also export a personalized version of this same report reflecting your live selections |

The Playbook is the source of truth for every recommendation. The Stack Builder and OPSEC
Field Manual audit your actual setup against it; the Broker Removal Tracker and Breach Check
Tracker are narrower by design — flat checklists tracking your own progress against real,
external sites, not domain-scored against the Playbook, and neither one aggregates data about
anyone else. Nothing entered in any tool ever leaves your browser.

**Deliberately out of scope, by design**: this project only ever helps a user audit and
reduce *their own* exposure. It does not include, and should not grow, any feature that
looks up or aggregates personal data about other people — that's the category of site the
Broker Removal Tracker exists to help users escape, not emulate.

## Structure

```
docs/
├── index.html                                 # hub / landing page, served at /
├── playbook/index.html                        # renders personal-security-playbook.md, served at /playbook/
├── report/index.html                          # renders recommendations-report.md, served at /report/
├── privacy-stack-builder/index.html            # interactive product/tool picker + radar chart, served at /privacy-stack-builder/
├── opsec-field-manual/index.html               # interactive behavioral/OPSEC self-audit + radar chart, served at /opsec-field-manual/
├── broker-removal-tracker/index.html           # interactive data-broker opt-out checklist (no radar — flat list, not domain-scored), served at /broker-removal-tracker/
├── breach-check-tracker/index.html             # interactive HIBP self-check tracker (no radar, user-managed list), served at /breach-check-tracker/
├── shared/                                     # tokens.css, nav.css, nav.js, persist.js, doc-page.css, doc-page.js — linked by all seven pages, no build step
├── personal-security-playbook.md               # source content for the playbook page
├── recommendations-report.md                   # source content for the report page
├── logo-mark.svg, logo-lockup.svg, favicon.svg, favicon-*.png, favicon.ico  # brand assets
├── robots.txt, sitemap.xml
└── spidergraph-demo.gif                        # real Stack Builder screen recording (radar chart filling from a partial to a fully covered build), for social/launch posts
LICENSE                                         # MIT
.github/workflows/deploy.yml                    # GitHub Pages deploy on push to main
```

Every page except the home page (`playbook/`, `report/`, `privacy-stack-builder/`,
`opsec-field-manual/`, `broker-removal-tracker/`, `breach-check-tracker/`) is its own directory
with an `index.html`, so the served URL never has a `.html` extension. This means each of
those six files is one directory level deeper than `docs/index.html` — their asset links and
inter-page nav links use `../` to reach files at the `docs/` root.

The design tokens, nav bar CSS/JS, the localStorage helper, and (for the two markdown-rendering
pages) the doc-shell CSS/JS live in `docs/shared/` and are linked by all seven HTML files via
plain `<link>`/`<script src>` — still zero build step, just no longer copy-pasted. What's left
duplicated per-page: the inline brand SVG markup and the favicon `<link>` lines, since their
paths differ by directory depth and there's no include mechanism to inject markup without a
build step — see the Astro note below.

All four interactive tools (Stack Builder, OPSEC Field Manual, Broker Removal Tracker, Breach
Check Tracker) save your selections to `localStorage` and reload them on your next visit, with
a `Reset` button in each to clear it — nothing here means a backend or account, `localStorage`
never leaves your browser.

## Local preview

Because the doc pages (`playbook/`, `report/`) fetch their markdown at runtime, opening the
HTML files directly (`file://`) will not load the content — serve the `docs/` folder over
local HTTP instead:

```bash
cd docs && python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deployment

Deployed automatically via GitHub Actions to GitHub Pages (`.github/workflows/deploy.yml`)
on every push to `main`, publishing the `docs/` folder directly — no build step. If this
project ever grows past the current seven hand-duplicated page shells, Astro is the planned
upgrade path for shared nav/component reuse; not needed at the current size.

## Brand

"Spidergraph" was checked against existing products before adoption — the name shows up
generically as a chart-type synonym (radar/spider charts) across various dashboarding
tools, and as an unrelated font marketplace, but not as a privacy/security product brand.
The logo mark is an original geometric construction (not derived from any existing logo)
built directly from the same radar-chart math the tools render live — see `logo-mark.svg`.
Each interactive tool has its own accent color so a user can tell them apart at a glance:
Stack Builder = teal, OPSEC Field Manual = amber, Broker Removal Tracker = red; the Playbook
is blue and the Report is teal. The Breach Check Tracker reuses the Playbook's blue (the
palette only has four accents — Report already reuses Stack Builder's teal on the same basis).

## Maintenance

Tool and pricing recommendations in this project are time-sensitive. Re-verify against
current sources (see the Recommendations Report's sources section) on a quarterly cadence
rather than treating this as a one-time build. A `verified:"YYYY-MM-DD"` date on a claim
means a person or agent actually re-checked that specific figure on that date — never
backfill one without doing the check.
