import { describe, it, expect, beforeAll } from 'vitest';
import { loadClassicScript } from './helpers/load-classic-script.js';

let spidergraphDecoy, decoyFields;

beforeAll(() => {
  // The generator's default random source is crypto.getRandomValues; the vm context
  // gets Node's webcrypto so that default path is exercised too.
  ({ spidergraphDecoy, decoyFields } = loadClassicScript(
    '../../public/shared/decoy-generator.js',
    { crypto: globalThis.crypto },
  ));
});

// A fixed sequence, so a test can force the lowest or highest pick of every list.
const constant = (x) => () => x;

describe('spidergraphDecoy', () => {
  it('returns every field the ledger lists, and nothing else', () => {
    const d = spidergraphDecoy();
    expect(Object.keys(d).sort()).toEqual(
      decoyFields()
        .map((f) => f.key)
        .sort(),
    );
  });

  it('never generates an email address', () => {
    for (let i = 0; i < 200; i++) {
      expect(Object.values(spidergraphDecoy()).join(' ')).not.toContain('@');
    }
  });

  it('only uses the 555-0100 to 555-0199 phone range reserved for fiction', () => {
    for (const x of [0, 0.5, 0.999999]) {
      expect(spidergraphDecoy(constant(x)).phone).toMatch(
        /^\(\d{3}\) 555-01\d{2}$/,
      );
    }
    for (let i = 0; i < 500; i++) {
      expect(spidergraphDecoy().phone).toMatch(/^\(\d{3}\) 555-01\d{2}$/);
    }
  });

  it('gives a valid adult date of birth between 1965 and 2000', () => {
    for (const x of [0, 0.999999]) {
      const { birthDate } = spidergraphDecoy(constant(x));
      expect(birthDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const date = new Date(birthDate + 'T00:00:00Z');
      expect(Number.isNaN(date.getTime())).toBe(false);
      expect(date.getUTCFullYear()).toBeGreaterThanOrEqual(1965);
      expect(date.getUTCFullYear()).toBeLessThanOrEqual(2000);
    }
  });

  it('builds plausible values at both ends of every list', () => {
    const low = spidergraphDecoy(constant(0));
    const high = spidergraphDecoy(constant(0.999999));
    for (const d of [low, high]) {
      expect(d.name).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+$/);
      expect(d.username).toMatch(/^[a-z]+_[a-z]+\d{2}$/);
      expect(d.address).toMatch(/^\d{3,4} [A-Z][a-z]+ [A-Z][a-z]+$/);
      expect(d.city).toMatch(/^[A-Z][A-Za-z ]+, [A-Z]{2}$/);
      expect(d.bio.length).toBeGreaterThan(10);
    }
    expect(low).not.toEqual(high);
  });
});
