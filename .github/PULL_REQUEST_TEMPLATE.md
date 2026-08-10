## What this changes

<!-- One or two sentences. If this fixes an issue, write "Fixes #123". -->

## Type of change

- [ ] Content fix (stale price/link/recommendation — see below)
- [ ] Bug fix
- [ ] New feature / tool enhancement
- [ ] Docs only
- [ ] Other (explain above)

## If this changes a recommendation's price/tier

- [ ] I re-checked the vendor's own current pricing page (not relying on memory/training data)
- [ ] I updated **both** `src/content/personal-security-playbook.md` and the `DATA` array in `src/pages/privacy-stack-builder/index.astro` (they're independent representations of the same fact and drift silently if only one is edited)
- [ ] I set a `verified:"YYYY-MM-DD"` date and added a legacy note describing the prior value, rather than silently overwriting it (see `CLAUDE.md`'s "Content maintenance discipline")

## Checklist

- [ ] `npm run build` succeeds locally
- [ ] `npm run typecheck` passes (if present in `package.json`)
- [ ] `npm run lint` passes (if present in `package.json`)
- [ ] I read `CLAUDE.md`'s mission guardrail and this doesn't add any lookup/aggregation of other people's data
- [ ] I didn't add new tooling/frameworks beyond what's already in `package.json`, or I explained above why this is the exception
