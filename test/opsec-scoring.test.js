import { describe, it, expect, beforeAll } from 'vitest';
import { loadClassicScript } from './helpers/load-classic-script.js';

let computeReadiness;

beforeAll(() => {
  ({ computeReadiness } = loadClassicScript(
    '../../public/shared/opsec-scoring.js',
  ));
});

const domains = [
  {
    code: 'SE',
    name: 'Social Engineering',
    items: [{ t: 'a', crit: true }, { t: 'b' }],
  },
  {
    code: 'PHY',
    name: 'Physical Security',
    items: [{ t: 'c' }, { t: 'd' }],
  },
];

describe('computeReadiness', () => {
  it('scores 0% overall and per-domain when nothing is checked', () => {
    const r = computeReadiness(domains, {});
    expect(r.totalChecked).toBe(0);
    expect(r.totalItems).toBe(4);
    expect(r.overallPct).toBe(0);
    expect(r.domainPct).toEqual({ SE: 0, PHY: 0 });
  });

  it('scores 100% overall when every item is checked', () => {
    const state = { 'SE-0': true, 'SE-1': true, 'PHY-0': true, 'PHY-1': true };
    const r = computeReadiness(domains, state);
    expect(r.overallPct).toBe(100);
    expect(r.domainPct).toEqual({ SE: 100, PHY: 100 });
    expect(r.critGaps).toBe(0);
  });

  it('computes per-domain percentage independently of other domains', () => {
    const state = { 'SE-0': true, 'SE-1': true }; // SE fully checked, PHY untouched
    const r = computeReadiness(domains, state);
    expect(r.domainPct.SE).toBe(100);
    expect(r.domainPct.PHY).toBe(0);
    expect(r.overallPct).toBe(50);
  });

  it('only counts an unchecked item as a critical gap when it is actually marked crit', () => {
    // SE-0 is crit:true and unchecked -> counts. SE-1/PHY items aren't crit.
    const r = computeReadiness(domains, {});
    expect(r.critGaps).toBe(1);
  });

  it('does not count a checked critical item as a gap', () => {
    const r = computeReadiness(domains, { 'SE-0': true });
    expect(r.critGaps).toBe(0);
  });

  it('identifies the weakest domain as the lowest-percentage one', () => {
    const state = { 'SE-0': true, 'SE-1': true }; // SE=100%, PHY=0%
    const r = computeReadiness(domains, state);
    expect(r.weakest).toBe('PHY');
    expect(r.weakestPct).toBe(0);
  });

  it('breaks a tie between equally-weak domains by keeping the first one in list order', () => {
    const r = computeReadiness(domains, {}); // both 0%
    expect(r.weakest).toBe('SE');
  });

  it('sorts gap items with critical gaps first', () => {
    const r = computeReadiness(domains, {});
    expect(r.gapItems[0].crit).toBe(true);
    expect(r.gapItems.slice(1).every((g) => g.crit === false)).toBe(true);
  });

  it('handles an empty domain list without dividing by zero', () => {
    const r = computeReadiness([], {});
    expect(r.overallPct).toBe(0);
    expect(r.weakest).toBe('');
    expect(r.weakestPct).toBe(0);
  });
});
