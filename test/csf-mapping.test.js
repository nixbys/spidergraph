import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { playbookParts } from '../src/lib/csf-section.ts';

const md = readFileSync(
  new URL('../src/content/personal-security-playbook.md', import.meta.url),
  'utf8',
);
const map = JSON.parse(
  readFileSync(
    new URL('../src/content/csf-mapping.json', import.meta.url),
    'utf8',
  ),
);
const { domains, runbooks } = playbookParts(md);
const report = readFileSync(
  new URL('../src/content/recommendations-report.md', import.meta.url),
  'utf8',
);
// CSF 2.0 subcategory IDs: function.category-NN, e.g. PR.AA-03.
const CSF_ID = /^(GV|ID|PR|DE|RS|RC)\.[A-Z]{2}-\d{2}$/;

describe('CSF 2.0 mapping', () => {
  it('pins the edition and its source', () => {
    expect(map.framework).toBe('NIST Cybersecurity Framework 2.0');
    expect(map.source).toBe('https://doi.org/10.6028/NIST.CSWP.29');
    expect(map.reviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('maps every domain and runbook in the playbook, and nothing else', () => {
    expect(domains.length).toBeGreaterThan(10);
    expect(Object.keys(map.domains).sort()).toEqual(
      domains.map((d) => d.key).sort(),
    );
    expect(Object.keys(map.runbooks).sort()).toEqual(
      runbooks.map((r) => r.key).sort(),
    );
  });

  it('uses well-formed, distinct CSF 2.0 IDs for every entry', () => {
    for (const ids of [
      ...Object.values(map.domains),
      ...Object.values(map.runbooks),
    ]) {
      expect(ids.length).toBeGreaterThan(0);
      expect(new Set(ids).size).toBe(ids.length);
      ids.forEach((id) => expect(id).toMatch(CSF_ID));
    }
  });

  it('tags every report category and practice, and nothing else', () => {
    const part1 = report.split('## Part 2')[0];
    const categories = [...part1.matchAll(/^\| ([^|]+?) +\|/gm)]
      .map((m) => m[1])
      .filter((c) => c !== 'Category' && !/^-+$/.test(c));
    const part2 = report.split('## Part 2')[1].split('## Part 3')[0];
    const practices = [...part2.matchAll(/^### (.+)$/gm)].map((m) => m[1]);
    expect(Object.keys(map.report).sort()).toEqual(
      [...categories, ...practices].sort(),
    );
  });

  it('has a plain-language gloss for every CSF category it uses', () => {
    const all = [
      ...Object.values(map.domains),
      ...Object.values(map.runbooks),
      ...Object.values(map.report),
    ].flat();
    for (const id of all) {
      expect(id).toMatch(CSF_ID);
      expect(map.glosses[id.slice(0, 5)]).toBeTruthy();
    }
  });
});
