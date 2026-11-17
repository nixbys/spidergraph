const DOMAINS = [
  {
    code: 'SE',
    name: 'Social Engineering & Human-Layer Defense',
    items: [
      {
        t: 'I verify sender domains character-by-character before clicking links in unsolicited messages',
        crit: true,
      },
      {
        t: 'I never act on urgency alone — a request framed as urgent gets slower, not faster, verification',
      },
      {
        t: 'My close family/contacts and I use a verbal passphrase to verify money/credential requests',
        crit: true,
      },
      {
        t: "For any 'urgent' institutional call, I hang up and call back using a number I already had on file, not one they gave me",
        crit: true,
      },
      {
        t: 'I confirm unusual requests from known contacts through a second channel before acting',
      },
      {
        t: "I don't discuss travel plans or home-alone windows on public social channels",
      },
      {
        t: "I'm skeptical by default of unsolicited technicians, deliveries, or 'can I use your phone' requests",
      },
      {
        t: "My security question answers aren't publicly discoverable facts (pet names, mother's maiden name, etc.)",
      },
      {
        t: "I've had the actual 'why' conversation with close family about phishing/vishing, not just handed them an app",
      },
    ],
  },
  {
    code: 'PHY',
    name: 'Physical Security',
    items: [
      {
        t: 'Auto-lock is set to under 1 minute on every device I carry',
        crit: true,
      },
      {
        t: "Find My / anti-theft tracking is enabled and I've confirmed it actually works",
      },
      {
        t: 'Full-disk encryption is verified — not assumed — on every device',
      },
      { t: 'I use a privacy screen filter in public or shared workspaces' },
      {
        t: 'I never leave devices unattended in vehicles or visible in public spaces',
      },
      {
        t: 'Smart home / IoT devices sit on a segmented network, isolated from my primary devices',
        crit: true,
      },
      {
        t: 'I use a Faraday bag or airplane mode for higher-risk travel with sensitive devices',
      },
      {
        t: "I've actually tested a remote wipe or remote lock at least once, not just enabled the setting",
      },
    ],
  },
  {
    code: 'LEG',
    name: 'Legal & Documentation',
    items: [
      {
        t: 'Credit is frozen at all three bureaus (Equifax, Experian, TransUnion)',
        crit: true,
      },
      {
        t: 'A trusted person has offline instructions for where my recovery info lives — not live credentials',
      },
      {
        t: "My password manager's emergency access / legacy contact feature is actually configured",
      },
      {
        t: 'Personal accounts and any content-creator/business accounts are financially and legally separated',
      },
      {
        t: "I've evaluated whether an LLC or equivalent makes sense given current revenue from content/business work",
      },
      {
        t: 'I have a written incident-contact list: bank fraud line, carrier fraud line, local non-emergency police line',
      },
    ],
  },
  {
    code: 'BEH',
    name: 'Operational Discipline',
    items: [
      {
        t: 'I strip metadata (EXIF/GPS) from images before posting anything publicly',
        crit: true,
      },
      {
        t: "I don't reuse usernames between my public-facing identity and my personal accounts",
        crit: true,
      },
      {
        t: 'I keep browser profiles/sessions compartmentalized between identities',
      },
      { t: "I review my phone's app permissions at least quarterly" },
      {
        t: "I've audited old or dormant accounts still tied to my real identity",
      },
      {
        t: 'Every account password is unique and generated — no reuse anywhere',
      },
      {
        t: 'I avoid posting real-time location; anything location-tagged goes up after the fact, not during',
      },
    ],
  },
  {
    code: 'IR',
    name: 'Incident Response Readiness',
    items: [
      {
        t: "I know the first three things I'd do in the first 15 minutes if my email were compromised",
        crit: true,
      },
      {
        t: "I know my mobile carrier's specific process for locking a SIM against unauthorized swap",
      },
      {
        t: "I've actually restored a file from backup in the last 6 months to confirm it works",
        crit: true,
      },
      {
        t: 'I know how to report doxxing or impersonation on every platform I actively use',
      },
      {
        t: "I know exactly who I'd call first in a financial fraud incident, before I'd need to",
      },
      {
        t: 'If I suspect malware, I disconnect the device from the network immediately rather than trying to clean an infected OS in place',
        crit: true,
      },
      {
        t: 'I have access to clean rescue/boot media (USB) to scan or reinstall a compromised device without trusting the infected OS',
      },
      {
        t: 'If I ever give up any information during a social-engineering attempt, I treat it as a credential-compromise incident right away, not something to just note and move on from',
      },
    ],
  },
  {
    code: 'AUD',
    name: 'Maintenance & Audit Cadence',
    items: [
      {
        t: 'OS, browser, and app updates are on auto-update or checked weekly without fail',
      },
      {
        t: 'I review recent account activity/login alerts on email and financial accounts monthly, not just after an alert fires',
      },
      {
        t: 'I re-run my own OSINT self-audit (searching my own name/handles/number) quarterly',
        crit: true,
      },
      {
        t: 'I work through the Broker Removal Tracker at least once and revisit it quarterly — broker listings reappear on their own re-scrape cycle',
      },
      {
        t: "I revisit my threat model — what I'm protecting, from whom — every 6 months",
      },
      {
        t: 'I do a full credential rotation review annually rather than only after a breach alert',
      },
    ],
  },
];

const store = spidergraphStore('spidergraph-opsec-v1');
const state = {}; // "CODE-idx" -> bool
DOMAINS.forEach((d) =>
  d.items.forEach((_it, i) => (state[`${d.code}-${i}`] = false)),
);
const saved = store.load();
if (saved) {
  // Back-compat: pre-persist.js saves were the flat map itself, not {data, lastUpdated}.
  const savedMap = saved.data !== undefined ? saved.data : saved;
  Object.keys(state).forEach((k) => {
    if (k in savedMap) state[k] = !!savedMap[k];
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const domainsEl = document.getElementById('domains');
const jumpSel = document.getElementById('sectionJump');
let totalItems = 0;
DOMAINS.forEach((d) => (totalItems += d.items.length));
document.getElementById('itemCount').textContent = totalItems;

DOMAINS.forEach((d) => {
  const block = document.createElement('div');
  block.className = 'domain-block';
  block.id = 'domain-' + slugify(d.name);
  block.innerHTML = `
  <div class="domain-head">
    <div class="domain-head-left">
      <span class="domain-code">${d.code}</span>
      <span class="domain-name">${d.name}</span>
    </div>
    <span class="domain-pct" id="pct-${d.code}">0%</span>
  </div>
  <div class="items" id="items-${d.code}"></div>
`;
  domainsEl.appendChild(block);

  const jumpOpt = document.createElement('option');
  jumpOpt.value = '#' + block.id;
  jumpOpt.textContent = d.name;
  jumpSel.appendChild(jumpOpt);
  const itemsEl = block.querySelector(`#items-${d.code}`);
  d.items.forEach((it, i) => {
    const key = `${d.code}-${i}`;
    const row = document.createElement('label');
    row.className = 'item' + (state[key] ? ' checked' : '');
    row.id = `row-${key}`;
    row.innerHTML = `
    <input type="checkbox" id="cb-${key}" ${state[key] ? 'checked' : ''}>
    <div class="item-text">
      <span class="item-label">${it.t}</span>${it.crit ? '<span class="item-crit">Critical</span>' : ''}
    </div>
  `;
    itemsEl.appendChild(row);
    const cb = row.querySelector('input');
    cb.addEventListener('change', () => {
      state[key] = cb.checked;
      row.classList.toggle('checked', cb.checked);
      store.save(state);
      render();
    });
  });
});

jumpSel.addEventListener('change', () => {
  if (!jumpSel.value) return;
  const target = document.querySelector(jumpSel.value);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  jumpSel.value = '';
});

const scrollBtn = document.getElementById('scrollTopBtn');
window.addEventListener(
  'scroll',
  () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  },
  { passive: true },
);
scrollBtn.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' }),
);

document.getElementById('resetBtn').addEventListener('click', () => {
  Object.keys(state).forEach((k) => (state[k] = false));
  store.clear();
  document.querySelectorAll('input[type=checkbox]').forEach((cb) => {
    cb.checked = false;
    cb.closest('.item').classList.remove('checked');
  });
  render();
});

function render() {
  // Scoring itself lives in src/lib/opsec-scoring.js (unit-tested there) — this just
  // maps the computed result to this page's own DOM.
  const r = computeReadiness(DOMAINS, state);

  DOMAINS.forEach((d) => {
    const pct = r.domainPct[d.code];
    const pctEl = document.getElementById(`pct-${d.code}`);
    pctEl.textContent = `${pct}%`;
    pctEl.style.color =
      pct === 100 ? 'var(--teal)' : pct >= 50 ? 'var(--amber)' : 'var(--red)';
  });

  document.getElementById('mChecked').textContent =
    `${r.totalChecked}/${totalItems}`;
  document.getElementById('mCritGap').textContent = r.critGaps;
  document.getElementById('scoreNum').textContent = `${r.overallPct}%`;
  document.getElementById('mWeakest').textContent =
    `${r.weakest} (${r.weakestPct}%)`;

  const gapItems = r.gapItems;
  const gapListEl = document.getElementById('gapList');
  gapListEl.innerHTML = '';
  if (gapItems.length === 0) {
    gapListEl.innerHTML = `<div class="empty-gaps">✓ Every control checked. Full behavioral coverage.</div>`;
  } else {
    gapItems.slice(0, 8).forEach((g) => {
      const div = document.createElement('div');
      div.className = 'gap-item' + (g.crit ? '' : ' amber');
      div.innerHTML = `<span class="dot"></span><span><b>${g.domain}:</b> ${g.text}</span>`;
      gapListEl.appendChild(div);
    });
  }

  drawRadar(r.domainPct);
}

function drawRadar(domainPct) {
  const svg = document.getElementById('radar');
  svg.innerHTML = '';
  const cx = 140,
    cy = 140,
    maxR = 105;
  const n = DOMAINS.length;
  const ns = 'http://www.w3.org/2000/svg';
  function pt(i, r) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  [1, 2, 3].forEach((l) => {
    const r = (maxR / 3) * l;
    const points = [];
    for (let i = 0; i < n; i++) {
      points.push(pt(i, r).join(','));
    }
    const poly = document.createElementNS(ns, 'polygon');
    poly.setAttribute('points', points.join(' '));
    poly.setAttribute('fill', 'none');
    poly.setAttribute(
      'stroke',
      l === 3 ? 'var(--border)' : 'var(--border-soft)',
    );
    poly.setAttribute('stroke-width', '1');
    svg.appendChild(poly);
  });
  for (let i = 0; i < n; i++) {
    const [x, y] = pt(i, maxR);
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', cx);
    line.setAttribute('y1', cy);
    line.setAttribute('x2', x);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', 'var(--border-soft)');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
  }

  const cpoints = [];
  DOMAINS.forEach((d, i) => {
    const pct = domainPct[d.code] || 0;
    const r = maxR * (pct / 100);
    cpoints.push(pt(i, r));
  });
  const cpoly = document.createElementNS(ns, 'polygon');
  cpoly.setAttribute('points', cpoints.map((p) => p.join(',')).join(' '));
  cpoly.setAttribute('fill', 'var(--amber)');
  cpoly.setAttribute('fill-opacity', '0.18');
  cpoly.setAttribute('stroke', 'var(--amber)');
  cpoly.setAttribute('stroke-width', '2');
  cpoly.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(cpoly);

  cpoints.forEach(([x, y]) => {
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('cx', x);
    c.setAttribute('cy', y);
    c.setAttribute('r', '2.5');
    c.setAttribute('fill', 'var(--amber)');
    svg.appendChild(c);
  });

  DOMAINS.forEach((d, i) => {
    const [x, y] = pt(i, maxR + 16);
    const t = document.createElementNS(ns, 'text');
    t.setAttribute('x', x);
    t.setAttribute('y', y);
    t.setAttribute('fill', '#5e6b7c');
    t.setAttribute('font-size', '9.5');
    t.setAttribute('font-family', 'IBM Plex Mono, monospace');
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('dominant-baseline', 'middle');
    t.textContent = d.code;
    svg.appendChild(t);
  });
}

document.getElementById('reportBtn').addEventListener('click', generateReport);

function generateReport() {
  const now = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  // Same scoring as render() above, from src/lib/opsec-scoring.js — this function
  // only adds its own per-item [x]/[ ] text formatting on top.
  const r = computeReadiness(DOMAINS, state);
  const lines = [];
  lines.push('BEHAVIORAL & OPSEC AUDIT — RECOMMENDATIONS REPORT');
  lines.push(`Generated ${now}`);
  lines.push('='.repeat(60));
  lines.push('');

  DOMAINS.forEach((d) => {
    lines.push(`[${d.code}] ${d.name}`);
    d.items.forEach((it, i) => {
      const key = `${d.code}-${i}`;
      const isChecked = state[key];
      const mark = isChecked ? '[x]' : it.crit ? '[ ] (CRITICAL)' : '[ ]';
      lines.push(`  ${mark} ${it.t}`);
    });
    lines.push(`  -> Domain completeness: ${r.domainPct[d.code]}%`);
    lines.push('');
  });

  lines.push('-'.repeat(60));
  lines.push('SUMMARY');
  lines.push(`  Controls in place:       ${r.totalChecked}/${totalItems}`);
  lines.push(`  Critical gaps unchecked: ${r.critGaps}`);
  lines.push(`  Overall readiness:       ${r.overallPct}%`);
  lines.push('');
  lines.push(
    '  Unchecked critical items are the highest-leverage next actions —',
  );
  lines.push(
    '  address those before lower-weight items, regardless of domain.',
  );
  lines.push('');
  lines.push('-'.repeat(60));
  lines.push('SOURCES');
  lines.push('  Methodology drawn from Privacy Guides (privacyguides.org),');
  lines.push('  The New Oil (thenewoil.org), IntelTechniques / Bazzell');
  lines.push(
    '  (inteltechniques.com), Techlore, and EFF Surveillance Self-Defense.',
  );
  lines.push(
    '  Full bibliography, best-practice detail per domain, and further-',
  );
  lines.push('  reading recommendations: see recommendations-report.md.');

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `opsec-audit-report-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const historyStore = spidergraphHistory('spidergraph-opsec-v1');

// Rebuilds the checked/unchecked map from a saved snapshot and re-renders everything —
// data is the flat "CODE-idx" -> bool map, same shape store.load() saves.
function restoreSnapshot(data) {
  if (!data) return;
  if (
    !confirm(
      'Restore this snapshot? This replaces your current checklist with the saved checkpoint.',
    )
  )
    return;
  Object.keys(state).forEach((k) => {
    state[k] = !!data[k];
    const cb = document.getElementById(`cb-${k}`);
    const row = document.getElementById(`row-${k}`);
    if (cb) cb.checked = state[k];
    if (row) row.classList.toggle('checked', state[k]);
  });
  store.save(state);
  render();
}

function renderHistory() {
  const snapshots = historyStore.list().slice().reverse();
  const el = document.getElementById('historyList');
  if (snapshots.length === 0) {
    el.innerHTML =
      '<div class="history-empty">No snapshots yet — save one to start tracking your audit over time.</div>';
    return;
  }
  el.innerHTML = snapshots
    .map((s) => {
      const d = new Date(s.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      return `<div class="history-item"><div class="history-item-main"><div class="h-date">${d}</div><div class="h-summary">${s.summary}</div></div><button type="button" class="history-restore-btn" data-date="${s.date}">Restore</button></div>`;
    })
    .join('');
  el.querySelectorAll('.history-restore-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const snap = historyStore.list().find((s) => s.date === btn.dataset.date);
      if (snap) restoreSnapshot(snap.data);
    });
  });
}

document.getElementById('snapshotBtn').addEventListener('click', () => {
  const total = Object.keys(state).length;
  const done = Object.values(state).filter((v) => v === true).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const summary = `${done}/${total} controls checked (${pct}%)`;
  historyStore.save(summary, state);
  renderHistory();
});

render();
renderHistory();
