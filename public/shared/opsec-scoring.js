// Pure scoring logic for the OPSEC Field Manual, extracted out of the tightly
// DOM-coupled render() function in src/pages/opsec-field-manual/index.astro so it's
// actually unit-testable (see test/opsec-scoring.test.js) without spinning up a DOM.
// This is the 44-item audit's actual scoring engine — a bug here silently mis-scores
// someone's real behavioral security posture, which is this tool's whole point, so
// it's worth extracting even though the rest of render() (DOM writes) stays inline.
//
// A plain classic script, loaded via <script src> exactly like persist.js/history.js
// — not an ES module. See the long comment at the top of stack-builder-scoring.js for
// why (short version: an ES-module version of this file broke at runtime from a
// script-ordering bug, and the fix that avoided that bug — dropping is:inline on the
// consuming script — broke astro check instead by exposing a previously-opaque script
// to full type-checking for the first time). See test/helpers/load-classic-script.js
// for how tests run this exact file.
/* exported computeReadiness */

/**
 * @typedef {{code: string, name: string, items: Array<{t: string, crit?: boolean}>}} Domain
 * @typedef {Object.<string, boolean>} OpsecState - keyed "DOMAINCODE-itemIndex" -> checked
 */

/**
 * Compute per-domain and overall readiness from the domain list + current checkbox
 * state. Domain order in the returned domainPct object matches `domains`' own order —
 * callers that need "weakest first" or similar should sort the entries themselves.
 * @param {Domain[]} domains
 * @param {OpsecState} state
 * @returns {{
 *   domainPct: Object.<string, number>,
 *   totalChecked: number,
 *   totalItems: number,
 *   overallPct: number,
 *   critGaps: number,
 *   weakest: string,
 *   weakestPct: number,
 *   gapItems: Array<{crit: boolean, domain: string, text: string}>,
 * }}
 */
function computeReadiness(domains, state) {
  let totalChecked = 0;
  let totalItems = 0;
  let critGaps = 0;
  const domainPct = {};
  const gapItems = [];

  domains.forEach((d) => {
    let checked = 0;
    d.items.forEach((it, i) => {
      totalItems++;
      const key = `${d.code}-${i}`;
      if (state[key]) {
        checked++;
        totalChecked++;
      } else if (it.crit) {
        critGaps++;
        gapItems.push({ crit: true, domain: d.code, text: it.t });
      } else {
        gapItems.push({ crit: false, domain: d.code, text: it.t });
      }
    });
    domainPct[d.code] = d.items.length
      ? Math.round((checked / d.items.length) * 100)
      : 0;
  });

  let weakest = domains.length ? domains[0].code : '';
  let weakestPct = 101;
  domains.forEach((d) => {
    if (domainPct[d.code] < weakestPct) {
      weakestPct = domainPct[d.code];
      weakest = d.code;
    }
  });

  // Critical gaps sort first, matching the page's own gap-list ordering.
  gapItems.sort((a, b) => Number(b.crit) - Number(a.crit));

  return {
    domainPct,
    totalChecked,
    totalItems,
    overallPct: totalItems ? Math.round((totalChecked / totalItems) * 100) : 0,
    critGaps,
    weakest,
    weakestPct: domains.length ? weakestPct : 0,
    gapItems,
  };
}
