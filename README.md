# Spidergraph

A self-contained, client-side privacy and security program: a tiered reference playbook,
two interactive audit tools, and a live coverage visualization — no backend, no accounts,
no tracking. Named after its own signature visual: a radar chart that plots your real
coverage across every security domain as one shape.

## Structure

- `docs/index.html` — hub / landing page
- `docs/playbook/index.html` — renders `personal-security-playbook.md`, served at `/playbook/`
- `docs/report/index.html` — renders `recommendations-report.md`, served at `/report/`
- `docs/privacy-stack-builder/index.html` — interactive product/tool picker with live gap analysis, served at `/privacy-stack-builder/`
- `docs/opsec-field-manual/index.html` — interactive behavioral/OPSEC self-audit checklist, served at `/opsec-field-manual/`
- `docs/personal-security-playbook.md` — source content for the playbook page
- `docs/recommendations-report.md` — source content for the report page
- `docs/logo-mark.svg`, `docs/logo-lockup.svg`, `docs/favicon.svg`, `docs/favicon-*.png`, `docs/favicon.ico` — brand assets
- `docs/spidergraph-demo.gif` — real Stack Builder screen recording (radar chart filling from a partial to a fully covered build) for social/launch posts
- `LICENSE` — MIT

## Local preview

Because the doc pages fetch their markdown at runtime, opening the HTML files directly
(`file://`) will not load the content — serve the `docs/` folder over local HTTP instead:

```bash
cd docs && python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deployment

Deployed automatically via GitHub Actions to GitHub Pages (`.github/workflows/deploy.yml`)
on every push to `main`, publishing the `docs/` folder directly — no build step. If this
project ever grows past five pages, Astro is the planned upgrade path for shared
nav/component reuse; not needed at the current size.

## Brand

"Spidergraph" was checked against existing products before adoption — the name shows up
generically as a chart-type synonym (radar/spider charts) across various dashboarding
tools, and as an unrelated font marketplace, but not as a privacy/security product brand.
The logo mark is an original geometric construction (not derived from any existing logo)
built directly from the same radar-chart math the tools render live — see `logo-mark.svg`.

## Maintenance

Tool and pricing recommendations in this project are time-sensitive. Re-verify against
current sources (see the Recommendations Report's sources section) on a quarterly cadence
rather than treating this as a one-time build.
