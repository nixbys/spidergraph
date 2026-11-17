const store = spidergraphStore('spidergraph-breach-check-v1');
const saved = store.load();
let items = saved && saved.data && Array.isArray(saved.data) ? saved.data : [];

const listEl = document.getElementById('addrList');
const emptyEl = document.getElementById('emptyState');
const addrInput = document.getElementById('addrInput');

function makeId() {
  return (
    'addr-' +
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).slice(2, 7)
  );
}

function renderList() {
  listEl.innerHTML = '';
  emptyEl.hidden = items.length > 0;
  items.forEach((it) => {
    // <label>, not <div>: makes the whole row a tap target on mobile, not just the raw
    // 20x20px checkbox (which is below WCAG's 24x24px minimum on its own) — matches the
    // OPSEC Field Manual's checklist rows, which already use this pattern. Native label
    // click-forwarding correctly skips the link and the remove button inside it, so
    // tapping either of those still does its own thing rather than also toggling the box.
    const row = document.createElement('label');
    row.className = 'addr-row' + (it.checked ? ' done' : '');
    row.id = 'row-' + it.id;
    row.innerHTML = `
  <input type="checkbox" id="cb-${it.id}" ${it.checked ? 'checked' : ''}>
  <div class="addr-body">
    <div class="addr-top">
      <span class="addr-label">${escapeHtml(it.label)}</span>
    </div>
    <div class="addr-meta">
      <a href="https://haveibeenpwned.com/" target="_blank" rel="noopener">Check on Have I Been Pwned →</a>
      ${it.checkedOn ? `<span class="addr-checked-on">Last checked ${it.checkedOn}</span>` : ''}
    </div>
  </div>
  <button type="button" class="addr-remove" title="Remove">✕</button>
`;
    listEl.appendChild(row);

    const cb = row.querySelector('input[type=checkbox]');
    // it.label is free-text the user typed (or restored from an imported backup
    // file, not just hand-entered here) — set via setAttribute rather than
    // interpolated into the innerHTML template above, since setAttribute can't be
    // broken out of via an embedded quote the way a template-string attribute
    // can. escapeHtml() (used for the visible <span> above) isn't sufficient on
    // its own for an attribute context: it only escapes &/</>, not the quote
    // character an attribute-breakout injection actually needs.
    cb.setAttribute('aria-label', `Mark ${it.label} as checked this cycle`);
    row
      .querySelector('.addr-remove')
      .setAttribute('aria-label', `Remove ${it.label}`);
    cb.addEventListener('change', () => {
      it.checked = cb.checked;
      it.checkedOn = cb.checked
        ? new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : it.checkedOn;
      row.classList.toggle('done', cb.checked);
      store.save(items);
      renderList();
      renderScore();
    });

    row.querySelector('.addr-remove').addEventListener('click', () => {
      items = items.filter((x) => x.id !== it.id);
      store.save(items);
      renderList();
      renderScore();
    });
  });
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function renderScore() {
  const done = items.filter((it) => it.checked).length;
  const total = items.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  document.getElementById('itemCount').textContent = total;
  document.getElementById('scoreNum').textContent = `${pct}%`;
  document.getElementById('mDone').textContent = `${done}/${total}`;
  document.getElementById('mTodo').textContent = total - done;
}

function addItem() {
  const label = addrInput.value.trim();
  if (!label) return;
  items.push({ id: makeId(), label, checked: false, checkedOn: null });
  store.save(items);
  addrInput.value = '';
  renderList();
  renderScore();
  addrInput.focus();
}

document.getElementById('addBtn').addEventListener('click', addItem);
addrInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addItem();
});

document.getElementById('resetBtn').addEventListener('click', () => {
  items = [];
  store.clear();
  renderList();
  renderScore();
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const now = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const lines = [];
  lines.push('BREACH CHECK TRACKER — PROGRESS EXPORT');
  lines.push(`Generated ${now}`);
  lines.push('='.repeat(60));
  lines.push('');
  if (items.length === 0) {
    lines.push('(no addresses tracked yet)');
  } else {
    items.forEach((it) => {
      lines.push(
        `[${it.checked ? 'x' : ' '}] ${it.label}${it.checkedOn ? ` — last checked ${it.checkedOn}` : ''}`,
      );
    });
  }
  const done = items.filter((it) => it.checked).length;
  lines.push('');
  lines.push('-'.repeat(60));
  lines.push(`Checked: ${done}/${items.length}`);
  lines.push('');
  lines.push('Checks were performed manually by you at haveibeenpwned.com —');
  lines.push('this export only reflects what you told this page, nothing was');
  lines.push('looked up automatically.');

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `breach-check-progress-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

const historyStore = spidergraphHistory('spidergraph-breach-check-v1');

// Rebuilds the address list from a saved snapshot and re-renders everything — data is
// the items array, same shape store.load() saves. Re-keys defensively so a restore can
// never collide with ids created since the snapshot was taken.
function restoreSnapshot(data) {
  if (!data || !Array.isArray(data)) return;
  if (
    !confirm(
      'Restore this snapshot? This replaces your current address list with the saved checkpoint.',
    )
  )
    return;
  items = data.map((it) => ({
    id: makeId(),
    label: it.label || '',
    checked: !!it.checked,
    checkedOn: it.checkedOn || null,
  }));
  store.save(items);
  renderList();
  renderScore();
}

function renderHistory() {
  const snapshots = historyStore.list().slice().reverse();
  const el = document.getElementById('historyList');
  if (snapshots.length === 0) {
    el.innerHTML =
      '<div class="history-empty">No snapshots yet — save one to start tracking progress over time.</div>';
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
  const done = items.filter((it) => it.checked).length;
  const summary =
    items.length === 0
      ? 'No addresses tracked'
      : `${done}/${items.length} addresses checked (${Math.round((done / items.length) * 100)}%)`;
  historyStore.save(summary, items);
  renderHistory();
});

renderList();
renderScore();
renderHistory();
