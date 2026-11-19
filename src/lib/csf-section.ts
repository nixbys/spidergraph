// Builds the Playbook's "Framework references" section at build time from
// src/content/csf-mapping.json: one plain explainer and a table of each domain and
// runbook with its NIST CSF 2.0 subcategories. The Playbook's own prose stays as it
// is; the framework layer lives only here (and in the JSON, which carries no voice).
import { marked } from 'marked';

export interface CsfMapping {
  framework: string;
  edition: string;
  source: string;
  reviewed: string;
  domains: Record<string, string[]>;
  runbooks: Record<string, string[]>;
}

// Same rule as public/shared/doc-page.js, which gives the headings their ids at load.
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Domain and runbook headings, as written in the Playbook markdown.
export function playbookParts(md: string) {
  const domains = [...md.matchAll(/^## (\d+)\. (.+)$/gm)].map((m) => ({
    key: m[1],
    title: `${m[1]}. ${m[2].trim()}`,
    heading: `${m[1]}. ${m[2].trim()}`,
  }));
  const runbooks = [...md.matchAll(/^### Runbook ([A-Z]): (.+)$/gm)].map(
    (m) => ({
      key: m[1],
      title: `Runbook ${m[1]}: ${m[2].replace(/\s*\(.*$/, '').trim()}`,
      heading: `Runbook ${m[1]}: ${m[2].trim()}`,
    }),
  );
  return { domains, runbooks };
}

export function csfSectionHtml(md: string, map: CsfMapping): string {
  const { domains, runbooks } = playbookParts(md);
  // The headings' text as the browser sees it (markdown rendered, tags stripped), so
  // the anchor matches the id doc-page.js gives the heading.
  const plain = (s: string) =>
    (marked.parseInline(s) as string)
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  const row = (p: { title: string; heading: string }, ids: string[] = []) =>
    `<tr><td><a href="#${slugify(plain(p.heading))}">${esc(p.title)}</a></td><td><code>${ids.map(esc).join('</code>, <code>')}</code></td></tr>`;
  return `
<hr>
<h2>Framework references</h2>
<p>Some recommendations carry a tag like <code>PR.AA-03</code>. That's a category from the
<a href="${esc(map.source)}">NIST Cybersecurity Framework 2.0</a>, a standard many
organizations use to organize security. Think of it as a subtitle for each part of this
playbook: the same advice, in a vocabulary an employer's security team would recognize.
It's orientation, not a compliance badge. Look up any tag in the framework itself.</p>
<table>
<thead><tr><th>Part of this playbook</th><th>NIST CSF 2.0</th></tr></thead>
<tbody>
${domains.map((d) => row(d, map.domains[d.key])).join('\n')}
${runbooks.map((r) => row(r, map.runbooks[r.key])).join('\n')}
</tbody>
</table>
<p class="verified-tag">${esc(map.framework)}, ${esc(map.edition)} · mapping reviewed ${esc(map.reviewed)}</p>
`;
}
