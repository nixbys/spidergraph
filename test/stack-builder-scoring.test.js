import { describe, it, expect, beforeAll } from 'vitest';
import { loadClassicScript } from './helpers/load-classic-script.js';

let classifyStatus, isCovered, coveragePercent;

beforeAll(() => {
  ({ classifyStatus, isCovered, coveragePercent } = loadClassicScript(
    '../../public/shared/stack-builder-scoring.js',
  ));
});

describe('classifyStatus', () => {
  it('returns "gap" when nothing is set (tier 0), regardless of target', () => {
    expect(classifyStatus(0, 1)).toBe('gap');
    expect(classifyStatus(0, 3)).toBe('gap');
  });

  it('returns "optimal" when the selected tier exactly matches the target', () => {
    expect(classifyStatus(1, 1)).toBe('optimal');
    expect(classifyStatus(2, 2)).toBe('optimal');
    expect(classifyStatus(3, 3)).toBe('optimal');
  });

  it('returns "below" when the selected tier is under the target (but not 0)', () => {
    expect(classifyStatus(1, 2)).toBe('below');
    expect(classifyStatus(2, 3)).toBe('below');
  });

  it('returns "above" when the selected tier exceeds the target', () => {
    expect(classifyStatus(2, 1)).toBe('above');
    expect(classifyStatus(3, 1)).toBe('above');
  });
});

describe('isCovered', () => {
  it('counts optimal and above as covered', () => {
    expect(isCovered('optimal')).toBe(true);
    expect(isCovered('above')).toBe(true);
  });

  it('does not count below or gap as covered', () => {
    expect(isCovered('below')).toBe(false);
    expect(isCovered('gap')).toBe(false);
  });
});

describe('coveragePercent', () => {
  it('rounds to the nearest whole percent', () => {
    expect(coveragePercent(1, 3)).toBe(33); // 33.33... -> 33
    expect(coveragePercent(2, 3)).toBe(67); // 66.66... -> 67
  });

  it('returns 100 when every slot is covered', () => {
    expect(coveragePercent(15, 15)).toBe(100);
  });

  it('returns 0 when nothing is covered', () => {
    expect(coveragePercent(0, 15)).toBe(0);
  });

  it('does not divide by zero if there are no slots', () => {
    expect(coveragePercent(0, 0)).toBe(0);
  });
});
