// Stuck Account Ledger: one card per account a service won't delete, following the
// steps of Playbook Runbook H, with the details overwritten and the 30/90-day checks.
//
// Everything the user types (service names, URLs, values, notes) reaches the page
// through textContent and setAttribute only, never through an HTML string: an
// imported backup file can carry any text, so nothing here is trusted as markup.

const store = spidergraphStore('spidergraph-stuck-ledger-v1');
const saved = store.load();
let accounts =
  saved && saved.data && Array.isArray(saved.data.accounts)
    ? saved.data.accounts
    : [];

const STEPS = [
  { key: 'request', label: 'Asked for deletion formally (GDPR or state law)' },
  { key: 'links', label: 'Removed "Sign in with…" links and recovery ties' },
  { key: 'overwrite', label: 'Overwrote the details it still shows' },
  { key: 'content', label: 'Deleted photos and content where possible' },
  { key: 'visibility', label: 'Turned off search and "find me" visibility' },
];
const OUTCOMES = {
  'no-delete': 'No delete option',
  deactivate: 'Deactivate only',
  retains: 'Keeps data after deleting',
  'login-linked': 'Other services sign in through it',
  refused: 'Request refused',
};
const CHECKS = [
  { key: 'd30', days: 30 },
  { key: 'd90', days: 90 },
];
const DAY = 86400000;

let decoy = spidergraphDecoy();

function el(tag, props, children) {
  const node = document.createElement(tag);
  Object.entries(props || {}).forEach(([k, v]) => {
    if (k === 'text') node.textContent = v;
    else if (k === 'class') node.className = v;
    else node.setAttribute(k, v);
  });
  (children || []).forEach((c) => c && node.appendChild(c));
  return node;
}

function makeId() {
  return (
    'acct-' +
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).slice(2, 7)
  );
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function fmt(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Only http(s) links become clickable: a backup file could hold "javascript:" URLs.
function safeUrl(u) {
  try {
    const url = new URL(u);
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? url.href
      : null;
  } catch {
    return null;
  }
}

// The checks count from the first time a detail was overwritten.
function overwrittenOn(a) {
  const dates = (a.fields || []).map((f) => f.on).filter(Boolean);
  return dates.length ? dates.sort()[0] : null;
}

function checkDue(a, c) {
  const start = overwrittenOn(a);
  if (!start || (a.checks || {})[c.key]) return false;
  return Date.now() >= new Date(start + 'T00:00:00').getTime() + c.days * DAY;
}

function isHandled(a) {
  return STEPS.every((s) => (a.steps || {})[s.key]);
}

function isComplete(a) {
  return isHandled(a) && CHECKS.every((c) => (a.checks || {})[c.key]);
}

function save() {
  store.save({ accounts });
}

function renderAccount(a) {
  const card = el('div', { class: 'acct' + (isHandled(a) ? ' handled' : '') });
  card.id = 'row-' + a.id;

  const url = safeUrl(a.url || '');
  const name = url
    ? el('a', {
        href: url,
        target: '_blank',
        rel: 'noopener noreferrer',
        text: a.service,
      })
    : document.createTextNode(a.service);
  const remove = el('button', {
    type: 'button',
    class: 'acct-remove',
    text: '✕',
    'aria-label': `Remove ${a.service}`,
    title: 'Remove',
  });
  remove.addEventListener('click', () => {
    if (!confirm(`Remove ${a.service} and its record from the ledger?`)) return;
    accounts = accounts.filter((x) => x.id !== a.id);
    save();
    render();
  });
  card.appendChild(
    el('div', { class: 'acct-top' }, [
      el('span', { class: 'acct-name' }, [name]),
      el('span', { class: 'acct-tag', text: OUTCOMES[a.outcome] || 'Stuck' }),
      remove,
    ]),
  );

  // Runbook H's steps.
  card.appendChild(el('div', { class: 'acct-section', text: 'Steps' }));
  STEPS.forEach((s) => {
    const cb = el('input', { type: 'checkbox' });
    cb.checked = !!(a.steps || {})[s.key];
    const row = el('label', { class: 'step' + (cb.checked ? ' done' : '') }, [
      cb,
      el('span', { text: s.label }),
    ]);
    cb.addEventListener('change', () => {
      a.steps = a.steps || {};
      a.steps[s.key] = cb.checked;
      save();
      render();
    });
    card.appendChild(row);
  });

  // What was overwritten, with what, and when.
  card.appendChild(
    el('div', { class: 'acct-section', text: 'Details overwritten' }),
  );
  const fields = a.fields || [];
  if (fields.length) {
    const tbody = el('tbody');
    fields.forEach((f, i) => {
      const del = el('button', {
        type: 'button',
        class: 'acct-remove',
        text: '✕',
        'aria-label': `Remove ${f.field} entry`,
      });
      del.addEventListener('click', () => {
        a.fields.splice(i, 1);
        save();
        render();
      });
      tbody.appendChild(
        el('tr', {}, [
          el('td', { text: f.field }),
          el('td', { class: 'val', text: f.value }),
          el('td', { class: 'when', text: fmt(f.on) }),
          el('td', {}, [del]),
        ]),
      );
    });
    card.appendChild(
      el('div', { class: 'fields-wrap' }, [
        el('table', { class: 'fields' }, [tbody]),
      ]),
    );
  }
  const fieldSel = el('select', { 'aria-label': 'Field' });
  decoyFields().forEach((f) =>
    fieldSel.appendChild(el('option', { value: f.key, text: f.label })),
  );
  fieldSel.appendChild(el('option', { value: 'other', text: 'Other' }));
  const valInput = el('input', {
    type: 'text',
    maxlength: '200',
    'aria-label': 'New value',
    placeholder: 'New value',
  });
  const fill = () => {
    valInput.value = decoy[fieldSel.value] || '';
  };
  fieldSel.addEventListener('change', fill);
  fill();
  const addField = el('button', {
    type: 'button',
    class: 'small-btn',
    text: 'Record',
  });
  addField.addEventListener('click', () => {
    const value = valInput.value.trim();
    if (!value) return;
    const label =
      fieldSel.value === 'other'
        ? 'Other'
        : decoyFields().find((f) => f.key === fieldSel.value).label;
    a.fields = a.fields || [];
    a.fields.push({ field: label, value, on: today() });
    save();
    render();
  });
  card.appendChild(
    el('div', { class: 'field-add' }, [fieldSel, valInput, addField]),
  );

  // Did the new details stick?
  const start = overwrittenOn(a);
  card.appendChild(el('div', { class: 'acct-section', text: 'Checks' }));
  CHECKS.forEach((c) => {
    const cb = el('input', { type: 'checkbox' });
    cb.checked = !!(a.checks || {})[c.key];
    cb.disabled = !start;
    const due = checkDue(a, c);
    const when = start
      ? `due ${fmt(new Date(new Date(start + 'T00:00:00').getTime() + c.days * DAY).toISOString().slice(0, 10))}`
      : 'starts when you record an overwritten detail';
    const row = el(
      'label',
      {
        class: 'step' + (cb.checked ? ' done' : '') + (due ? ' check-due' : ''),
      },
      [
        cb,
        el('span', {
          text: `${c.days}-day check: the new details are still there (${when})`,
        }),
      ],
    );
    cb.addEventListener('change', () => {
      a.checks = a.checks || {};
      a.checks[c.key] = cb.checked;
      save();
      render();
    });
    card.appendChild(row);
  });

  card.appendChild(el('div', { class: 'acct-section', text: 'Notes' }));
  const notes = el('textarea', {
    class: 'notes',
    maxlength: '1000',
    'aria-label': `Notes for ${a.service}`,
    placeholder:
      'Where the settings are, what support said, reference numbers…',
  });
  notes.value = a.notes || '';
  notes.addEventListener('change', () => {
    a.notes = notes.value;
    save();
  });
  card.appendChild(notes);
  return card;
}

function render() {
  const list = document.getElementById('acctList');
  list.replaceChildren(...accounts.map(renderAccount));
  document.getElementById('emptyState').hidden = accounts.length > 0;
  document.getElementById('itemCount').textContent = accounts.length;

  const totalSteps = accounts.length * STEPS.length;
  const doneSteps = accounts.reduce(
    (n, a) => n + STEPS.filter((s) => (a.steps || {})[s.key]).length,
    0,
  );
  const due = accounts.reduce(
    (n, a) => n + CHECKS.filter((c) => checkDue(a, c)).length,
    0,
  );
  const complete = accounts.filter(isComplete).length;
  const pct = accounts.length
    ? Math.round((complete / accounts.length) * 100)
    : 0;
  document.getElementById('scoreNum').textContent = `${pct}%`;
  document.getElementById('mSteps').textContent = `${doneSteps}/${totalSteps}`;
  document.getElementById('mDue').textContent = due;
}

function renderDecoy() {
  const dl = document.getElementById('genList');
  dl.replaceChildren();
  decoyFields().forEach((f) => {
    dl.appendChild(el('dt', { text: f.label }));
    dl.appendChild(el('dd', { text: decoy[f.key] }));
  });
}

document.getElementById('genBtn').addEventListener('click', () => {
  decoy = spidergraphDecoy();
  renderDecoy();
  render(); // the per-account "New value" boxes start from the current set
});

document.getElementById('addForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const svc = document.getElementById('svcInput');
  const url = document.getElementById('urlInput');
  const service = svc.value.trim();
  if (!service) return;
  accounts.push({
    id: makeId(),
    service,
    url: url.value.trim(),
    outcome: document.getElementById('outcomeInput').value,
    addedOn: today(),
    steps: {},
    fields: [],
    checks: {},
    notes: '',
  });
  save();
  svc.value = '';
  url.value = '';
  render();
  svc.focus();
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (
    !confirm(
      'Clear the whole ledger? Export it first if you may need the values you set.',
    )
  )
    return;
  accounts = [];
  store.clear();
  render();
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const lines = [
    'STUCK ACCOUNT LEDGER — EXPORT',
    `Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    '='.repeat(60),
    '',
  ];
  accounts.forEach((a) => {
    lines.push(`${a.service}${a.url ? ' — ' + a.url : ''}`);
    lines.push(
      `  Status: ${OUTCOMES[a.outcome] || 'Stuck'}; added ${a.addedOn}`,
    );
    STEPS.forEach((s) =>
      lines.push(`  [${(a.steps || {})[s.key] ? 'x' : ' '}] ${s.label}`),
    );
    (a.fields || []).forEach((f) =>
      lines.push(`  ${f.field}: ${f.value} (set ${f.on})`),
    );
    CHECKS.forEach((c) =>
      lines.push(
        `  [${(a.checks || {})[c.key] ? 'x' : ' '}] ${c.days}-day check`,
      ),
    );
    if (a.notes) lines.push(`  Notes: ${a.notes.replace(/\n/g, ' ')}`);
    lines.push('');
  });
  lines.push('-'.repeat(60));
  lines.push(
    'No passwords are stored in this ledger. Keep this file with your',
  );
  lines.push('other account records: reset flows may ask for these values.');
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = `stuck-account-ledger-${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
});

const historyStore = spidergraphHistory('spidergraph-stuck-ledger-v1');

function restoreSnapshot(data) {
  if (!data || !Array.isArray(data.accounts)) return;
  if (
    !confirm(
      'Restore this snapshot? This replaces your current ledger with the saved checkpoint.',
    )
  )
    return;
  accounts = JSON.parse(JSON.stringify(data.accounts));
  save();
  render();
}

function renderHistory() {
  const snapshots = historyStore.list().slice().reverse();
  const box = document.getElementById('historyList');
  box.replaceChildren();
  if (snapshots.length === 0) {
    box.appendChild(
      el('div', {
        class: 'history-empty',
        text: 'No snapshots yet — save one to start tracking progress over time.',
      }),
    );
    return;
  }
  snapshots.forEach((s) => {
    const restore = el('button', {
      type: 'button',
      class: 'history-restore-btn',
      text: 'Restore',
    });
    restore.addEventListener('click', () => restoreSnapshot(s.data));
    box.appendChild(
      el('div', { class: 'history-item' }, [
        el('div', { class: 'history-item-main' }, [
          el('div', {
            class: 'h-date',
            text: new Date(s.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
          }),
          el('div', { class: 'h-summary', text: s.summary }),
        ]),
        restore,
      ]),
    );
  });
}

document.getElementById('snapshotBtn').addEventListener('click', () => {
  const complete = accounts.filter(isComplete).length;
  historyStore.save(
    `${complete}/${accounts.length} accounts handled and checked`,
    { accounts },
  );
  renderHistory();
});

renderDecoy();
render();
renderHistory();
