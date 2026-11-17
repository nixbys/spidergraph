const store = spidergraphStore('spidergraph-digital-legacy-v1');
const saved = store.load();
const savedData = saved
  ? saved.data !== undefined
    ? saved.data
    : saved
  : null;

let state = {
  contactName: '',
  contactMethod: '',
  recoveryLocation: '',
  emergencyAccess: '',
  accounts: [],
  notes: '',
};
if (savedData) state = Object.assign(state, savedData);

const el = {
  contactName: document.getElementById('contactName'),
  contactMethod: document.getElementById('contactMethod'),
  recoveryLocation: document.getElementById('recoveryLocation'),
  notes: document.getElementById('notes'),
  acctList: document.getElementById('acctList'),
  noAccounts: document.getElementById('noAccounts'),
  acctInput: document.getElementById('acctInput'),
  scoreNum: document.getElementById('scoreNum'),
  saveIndicator: document.getElementById('saveIndicator'),
};

el.contactName.value = state.contactName;
el.contactMethod.value = state.contactMethod;
el.recoveryLocation.value = state.recoveryLocation;
el.notes.value = state.notes;
document.querySelectorAll('input[name="ea"]').forEach((r) => {
  r.checked = r.value === state.emergencyAccess;
});

let saveTimer = null;
function persist() {
  store.save(state);
  el.saveIndicator.textContent = 'Saved locally just now';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    el.saveIndicator.textContent = '';
  }, 2000);
  renderScore();
}

function debounce(fn, ms) {
  let t = null;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), ms);
  };
}
const persistDebounced = debounce(persist, 500);

el.contactName.addEventListener('input', () => {
  state.contactName = el.contactName.value;
  persistDebounced();
});
el.contactMethod.addEventListener('input', () => {
  state.contactMethod = el.contactMethod.value;
  persistDebounced();
});
el.recoveryLocation.addEventListener('input', () => {
  state.recoveryLocation = el.recoveryLocation.value;
  persistDebounced();
});
el.notes.addEventListener('input', () => {
  state.notes = el.notes.value;
  persistDebounced();
});
document.querySelectorAll('input[name="ea"]').forEach((r) => {
  r.addEventListener('change', () => {
    state.emergencyAccess = r.value;
    persist();
  });
});

function renderAccounts() {
  el.acctList.innerHTML = '';
  el.noAccounts.hidden = state.accounts.length > 0;
  state.accounts.forEach((label, i) => {
    const row = document.createElement('div');
    row.className = 'acct-row';
    row.innerHTML = `<span></span><button type="button" title="Remove">✕</button>`;
    row.querySelector('span').textContent = label;
    // label is free-text the user typed (or restored from an imported backup
    // file) — set via setAttribute rather than interpolated into the innerHTML
    // template above, since setAttribute can't be broken out of via an embedded
    // quote the way a template-string attribute can (unlike .textContent just
    // above, which is always safe regardless of content).
    row.querySelector('button').setAttribute('aria-label', `Remove ${label}`);
    row.querySelector('button').addEventListener('click', () => {
      state.accounts.splice(i, 1);
      renderAccounts();
      persist();
    });
    el.acctList.appendChild(row);
  });
}

document.getElementById('acctAddBtn').addEventListener('click', addAccount);
el.acctInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addAccount();
});
function addAccount() {
  const label = el.acctInput.value.trim();
  if (!label) return;
  state.accounts.push(label);
  el.acctInput.value = '';
  renderAccounts();
  persist();
  el.acctInput.focus();
}

function renderScore() {
  let filled = 0;
  if (state.contactName.trim()) filled++;
  if (state.contactMethod.trim()) filled++;
  if (state.recoveryLocation.trim()) filled++;
  if (state.emergencyAccess) filled++;
  if (state.accounts.length > 0) filled++;
  if (state.notes.trim()) filled++;
  el.scoreNum.textContent = `${filled}/6`;
}

document.getElementById('resetBtn').addEventListener('click', () => {
  state = {
    contactName: '',
    contactMethod: '',
    recoveryLocation: '',
    emergencyAccess: '',
    accounts: [],
    notes: '',
  };
  store.clear();
  el.contactName.value = '';
  el.contactMethod.value = '';
  el.recoveryLocation.value = '';
  el.notes.value = '';
  document
    .querySelectorAll('input[name="ea"]')
    .forEach((r) => (r.checked = false));
  renderAccounts();
  renderScore();
  el.saveIndicator.textContent = '';
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const now = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const eaLabels = {
    'not-set-up': 'Not set up yet',
    'set-up-untested': 'Set up, not tested',
    'set-up-tested': 'Set up and tested',
  };
  const lines = [];
  lines.push('DIGITAL LEGACY WORKSHEET — EXPORT');
  lines.push(`Generated ${now}`);
  lines.push(
    'This is a working note, not a legal document or a substitute for an attorney.',
  );
  lines.push('='.repeat(60));
  lines.push('');
  lines.push('TRUSTED CONTACT');
  lines.push(state.contactName || '(not filled in)');
  lines.push(state.contactMethod || '');
  lines.push('');
  lines.push('WHERE RECOVERY INFO LIVES');
  lines.push(state.recoveryLocation || '(not filled in)');
  lines.push('');
  lines.push('PASSWORD MANAGER EMERGENCY ACCESS');
  lines.push(eaLabels[state.emergencyAccess] || '(not set)');
  lines.push('');
  lines.push('ACCOUNTS FLAGGED');
  if (state.accounts.length === 0) {
    lines.push('(none yet)');
  } else {
    state.accounts.forEach((a) => lines.push(`- ${a}`));
  }
  lines.push('');
  lines.push('NOTES');
  lines.push(state.notes || '(none)');
  lines.push('');
  lines.push('-'.repeat(60));
  lines.push(
    'Reminder: no actual password or account number should ever appear in this',
  );
  lines.push(
    "file. Use your password manager's emergency access feature instead — see",
  );
  lines.push('Domain 11 of the Playbook and the Stack Builder for details.');

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `digital-legacy-worksheet-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

const historyStore = spidergraphHistory('spidergraph-digital-legacy-v1');

// Rebuilds state from a saved snapshot and re-renders every field — data is the full
// worksheet state object, same shape store.load() saves.
function restoreSnapshot(data) {
  if (!data) return;
  if (
    !confirm(
      'Restore this snapshot? This replaces your current worksheet with the saved checkpoint.',
    )
  )
    return;
  state = Object.assign(
    {
      contactName: '',
      contactMethod: '',
      recoveryLocation: '',
      emergencyAccess: '',
      accounts: [],
      notes: '',
    },
    data,
  );
  el.contactName.value = state.contactName;
  el.contactMethod.value = state.contactMethod;
  el.recoveryLocation.value = state.recoveryLocation;
  el.notes.value = state.notes;
  document.querySelectorAll('input[name="ea"]').forEach((r) => {
    r.checked = r.value === state.emergencyAccess;
  });
  renderAccounts();
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
  let filled = 0;
  if (state.contactName.trim()) filled++;
  if (state.contactMethod.trim()) filled++;
  if (state.recoveryLocation.trim()) filled++;
  if (state.emergencyAccess) filled++;
  if (state.accounts.length > 0) filled++;
  if (state.notes.trim()) filled++;
  historyStore.save(`${filled}/6 sections filled in`, state);
  renderHistory();
});

renderAccounts();
renderScore();
renderHistory();
