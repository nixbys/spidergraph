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

export interface CsfReportMapping extends CsfMapping {
  report: Record<string, string[]>;
  glosses: Record<string, string>;
}

// One clinical tag per CSF ID; the plain-language gloss is behind hover (title), not
// inline, so the report's own text reads as before.
function tags(ids: string[], map: CsfReportMapping): string {
  return ids
    .map((id) => {
      const gloss = map.glosses[id.slice(0, 5)] ?? '';
      return `<abbr class="csf-tag" title="${esc(gloss)} (NIST CSF 2.0)">${esc(id)}</abbr>`;
    })
    .join(' ');
}

// Adds CSF 2.0 tags to the report at build time: beside each Part 1 category and
// under each Part 2 heading (not inside it, so heading ids and links stay the same).
export function annotateReport(html: string, map: CsfReportMapping): string {
  let out = html;
  for (const [name, ids] of Object.entries(map.report)) {
    const label = esc(name);
    const cell = new RegExp(
      `(<td[^>]*>)${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(</td>)`,
    );
    const head = new RegExp(
      `(<h3[^>]*>${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h3>)`,
    );
    if (cell.test(out))
      out = out.replace(cell, `$1${label} ${tags(ids, map)}$2`);
    else if (head.test(out))
      out = out.replace(head, `$1\n<p class="csf-tags">${tags(ids, map)}</p>`);
  }
  // The one bridge for readers: what the tags are, pointing to the Playbook's explainer.
  return out.replace(
    '</table>',
    '</table>\n<p class="csf-note">Tags like <code>PR.AA-01</code> are NIST Cybersecurity Framework 2.0 categories; hover one for what it covers, or see <a href="../playbook/#framework-references">Framework references</a> in the Playbook.</p>',
  );
}
