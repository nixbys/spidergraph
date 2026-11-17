const store = spidergraphStore('spidergraph-incident-card-v1');
const saved = store.load();
const savedData = saved
  ? saved.data !== undefined
    ? saved.data
    : saved
  : null;

let state = {
  bankLine: '',
  cardLine: '',
  carrierLine: '',
  policeLine: '',
  note: '',
};
if (savedData) state = Object.assign(state, savedData);

const el = {
  bankLine: document.getElementById('bankLine'),
  cardLine: document.getElementById('cardLine'),
  carrierLine: document.getElementById('carrierLine'),
  policeLine: document.getElementById('policeLine'),
  note: document.getElementById('note'),
  scoreNum: document.getElementById('scoreNum'),
  saveIndicator: document.getElementById('saveIndicator'),
};

el.bankLine.value = state.bankLine;
el.cardLine.value = state.cardLine;
el.carrierLine.value = state.carrierLine;
el.policeLine.value = state.policeLine;
el.note.value = state.note;

function debounce(fn, ms) {
  let t = null;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), ms);
  };
}

let saveTimer = null;
function persist() {
  store.save(state);
  el.saveIndicator.textContent = 'Saved locally just now';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    el.saveIndicator.textContent = '';
  }, 2000);
  renderScore();
  renderPrintCard();
}
const persistDebounced = debounce(persist, 500);

el.bankLine.addEventListener('input', () => {
  state.bankLine = el.bankLine.value;
  persistDebounced();
});
el.cardLine.addEventListener('input', () => {
  state.cardLine = el.cardLine.value;
  persistDebounced();
});
el.carrierLine.addEventListener('input', () => {
  state.carrierLine = el.carrierLine.value;
  persistDebounced();
});
el.policeLine.addEventListener('input', () => {
  state.policeLine = el.policeLine.value;
  persistDebounced();
});
el.note.addEventListener('input', () => {
  state.note = el.note.value;
  persistDebounced();
});

function renderScore() {
  let filled = 0;
  [state.bankLine, state.cardLine, state.carrierLine, state.policeLine].forEach(
    (v) => {
      if (v.trim()) filled++;
    },
  );
  el.scoreNum.textContent = `${filled}/4`;
}

function renderPrintCard() {
  document.getElementById('pBank').textContent = state.bankLine.trim() || '—';
  document.getElementById('pCard').textContent = state.cardLine.trim() || '—';
  document.getElementById('pCarrier').textContent =
    state.carrierLine.trim() || '—';
  document.getElementById('pPolice').textContent =
    state.policeLine.trim() || '—';
  const noteRow = document.getElementById('pNoteRow');
  if (state.note.trim()) {
    noteRow.hidden = false;
    document.getElementById('pNote').textContent = state.note.trim();
  } else {
    noteRow.hidden = true;
  }
}

document
  .getElementById('printBtn')
  .addEventListener('click', () => window.print());

document.getElementById('resetBtn').addEventListener('click', () => {
  state = {
    bankLine: '',
    cardLine: '',
    carrierLine: '',
    policeLine: '',
    note: '',
  };
  store.clear();
  el.bankLine.value = '';
  el.cardLine.value = '';
  el.carrierLine.value = '';
  el.policeLine.value = '';
  el.note.value = '';
  renderScore();
  renderPrintCard();
  el.saveIndicator.textContent = '';
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const now = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const lines = [];
  lines.push('SPIDERGRAPH — INCIDENT RESPONSE CARD');
  lines.push(`Generated ${now}`);
  lines.push('='.repeat(60));
  lines.push('');
  lines.push('FIRST 15 MINUTES');
  lines.push('1. Change password from a clean device (email first).');
  lines.push('2. Revoke all active sessions/devices.');
  lines.push('3. Check recovery email/phone for tampering.');
  lines.push('');
  lines.push('YOUR NUMBERS');
  lines.push(
    `Bank fraud line:        ${state.bankLine.trim() || '(not filled in)'}`,
  );
  lines.push(
    `Card fraud line:        ${state.cardLine.trim() || '(not filled in)'}`,
  );
  lines.push(
    `Carrier fraud line:     ${state.carrierLine.trim() || '(not filled in)'}`,
  );
  lines.push(
    `Non-emergency police:   ${state.policeLine.trim() || '(not filled in)'}`,
  );
  if (state.note.trim()) {
    lines.push('');
    lines.push('NOTE');
    lines.push(state.note.trim());
  }
  lines.push('');
  lines.push('-'.repeat(60));
  lines.push(
    "Full runbooks: see the Playbook's Incident Response Runbooks section.",
  );

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `incident-response-card-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

renderScore();
renderPrintCard();

const historyStore = spidergraphHistory('spidergraph-incident-card-v1');

// Rebuilds state from a saved snapshot and re-renders every field + the print card —
// data is the full card state object, same shape store.load() saves.
function restoreSnapshot(data) {
  if (!data) return;
  if (
    !confirm(
      'Restore this snapshot? This replaces your current card with the saved checkpoint.',
    )
  )
    return;
  state = Object.assign(
    {
      bankLine: '',
      cardLine: '',
      carrierLine: '',
      policeLine: '',
      note: '',
    },
    data,
  );
  el.bankLine.value = state.bankLine;
  el.cardLine.value = state.cardLine;
  el.carrierLine.value = state.carrierLine;
  el.policeLine.value = state.policeLine;
  el.note.value = state.note;
  persist();
}

function renderHistory() {
  const snapshots = historyStore.list().slice().reverse();
  const el = document.getElementById('historyList');
  if (snapshots.length === 0) {
    el.innerHTML =
      '<div class="history-empty">No snapshots yet — save one to start tracking completeness over time.</div>';
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
  const filled = [
    state.bankLine,
    state.cardLine,
    state.carrierLine,
    state.policeLine,
  ].filter((v) => v.trim()).length;
  historyStore.save(`${filled}/4 numbers filled in`, state);
  renderHistory();
});

renderHistory();
