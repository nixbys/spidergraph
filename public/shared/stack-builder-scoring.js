// Pure scoring logic for the Stack Builder, extracted out of the tightly DOM-coupled
// render() function in src/pages/privacy-stack-builder/index.astro so it's actually
// unit-testable (see test/stack-builder-scoring.test.js) without spinning up a DOM.
// This is the one piece of that page's logic where a bug would silently mis-score a
// user's real security posture, so it's worth the extraction even though the rest of
// render() stays inline (DOM writes aren't meaningfully testable in isolation, and
// this project deliberately doesn't chase 100% coverage — see CONTRIBUTING.md).
//
// A plain classic script, loaded via <script src> exactly like persist.js/history.js
// — not an ES module. That was a deliberate second attempt, not the first: it was
// briefly written as an ES module imported by a small wrapper <script>, which broke
// at runtime (module scripts are always deferred regardless of where they sit in the
// HTML, so the later is:inline script that calls these functions actually ran BEFORE
// the "earlier" module's top-level code did — caught by a Playwright console-error
// check, not by lint/typecheck/tests, none of which execute the page). Converting the
// *consuming* is:inline script to a module instead (to fix the ordering) was tried
// too, and also reverted: dropping is:inline exposes that ~500-line script to
// astro check's strict type-checking for the first time (it's opaque to typecheck
// while is:inline), which surfaced 180+ pre-existing implicit-any/DOM-typing issues
// unrelated to this change — a much bigger undertaking than extracting one function.
// Matching the project's own already-proven pattern (persist.js/history.js) sidesteps
// both problems at once. See test/helpers/load-classic-script.js for how tests run
// this exact file, rather than a parallel ES-module rewrite of it.
/* exported classifyStatus, isCovered, coveragePercent */

/**
 * Classify a selected option's tier against the user's target tier.
 * @param {number} tier - The selected option's tier (0 = "nothing set"/gap).
 * @param {number} target - The user's chosen target tier (1=Budget, 2=Mid, 3=No-Limit).
 * @returns {'gap'|'optimal'|'below'|'above'}
 */
function classifyStatus(tier, target) {
  if (tier === 0) return 'gap';
  if (tier === target) return 'optimal';
  if (tier < target) return 'below';
  return 'above';
}

/**
 * Whether a slot counts as "covered" for the overall percentage — meeting or
 * exceeding target both count, only below-target and unset (gap) don't.
 * @param {'gap'|'optimal'|'below'|'above'} status
 * @returns {boolean}
 */
function isCovered(status) {
  return status === 'optimal' || status === 'above';
}

/**
 * The overall coverage percentage shown as the page's big scoreNum stat.
 * @param {number} coveredCount
 * @param {number} totalSlots
 * @returns {number} Rounded 0–100.
 */
function coveragePercent(coveredCount, totalSlots) {
  if (totalSlots <= 0) return 0;
  return Math.round((coveredCount / totalSlots) * 100);
}
