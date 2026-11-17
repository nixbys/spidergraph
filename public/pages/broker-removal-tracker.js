const BROKERS = [
  {
    id: 'spokeo',
    name: 'Spokeo',
    method: 'form',
    methodLabel: 'Self-service form',
    note: "Per-listing opt-out — you'll need to repeat this for each profile URL of yours that turns up.",
    url: 'https://www.spokeo.com/optout',
    time: '24–48 hrs',
    verified: '2026-08-05',
  },
  {
    id: 'beenverified',
    name: 'BeenVerified',
    method: 'form',
    methodLabel: 'Form + email confirm',
    note: 'Search by name/state to find your listing, then confirm removal via the emailed link.',
    url: 'https://www.beenverified.com/app/optout/search',
    time: '~48 hrs',
    verified: '2026-08-05',
  },
  {
    id: 'whitepages',
    name: 'Whitepages',
    method: 'phone',
    methodLabel: 'Phone-verified',
    note: 'Five-step suppression wizard; requires a phone number for an automated verification call. Removes the consumer People listing only, not government records.',
    url: 'https://www.whitepages.com/suppression-requests',
    time: 'Immediate–7 days',
    verified: '2026-08-05',
  },
  {
    id: 'peopleconnect',
    name: 'PeopleConnect network — Intelius, TruthFinder, USSearch, Instant Checkmate',
    method: 'multi',
    methodLabel: '1 request → 4 sites',
    note: 'One suppression request on this shared portal covers all four PeopleConnect-owned sites — no need to repeat it per brand. No confirmation email is sent; recheck manually after 48 hrs.',
    url: 'https://suppression.peopleconnect.us/login',
    time: '~48 hrs to propagate',
    verified: '2026-08-05',
  },
  {
    id: 'mylife',
    name: 'MyLife',
    method: 'email',
    methodLabel: 'Form or email',
    note: 'Use the CCPA opt-out form (works for all states, not just CA), or email privacy@mylife.com directly. Widely reported as the slowest and most persistent re-lister on this list — expect to resubmit.',
    url: 'https://www.mylife.com/ccpa/index.pubview',
    time: '7–15 business days',
    verified: '2026-08-05',
    flag: 'Notoriously resistant to permanent removal',
  },
  {
    id: 'radaris',
    name: 'Radaris',
    method: 'form',
    methodLabel: 'Self-service form',
    note: 'Submit via the control panel, then verify by email.',
    url: 'https://radaris.com/control/privacy',
    time: '1–14 days',
    verified: '2026-08-05',
  },
  {
    id: 'peekyou',
    name: 'PeekYou',
    method: 'form',
    methodLabel: 'Self-service form',
    note: 'Submit your profile URL and email, then click the confirmation link PeekYou sends you.',
    url: 'https://www.peekyou.com/about/contact/optout',
    time: 'Up to 30 days',
    verified: '2026-08-05',
  },
  {
    id: 'fastpeoplesearch',
    name: 'FastPeopleSearch',
    method: 'form',
    methodLabel: 'Self-service form',
    note: 'Find your listing, select "Remove My Record," then confirm via the emailed link.',
    url: 'https://www.fastpeoplesearch.com/optout',
    time: '~3 days',
    verified: '2026-08-05',
  },
  {
    id: 'peoplefinders',
    name: 'PeopleFinders',
    method: 'form',
    methodLabel: 'Self-service form',
    note: 'The confirmation link PeopleFinders emails you expires in 24 hours — act on it promptly.',
    url: 'https://www.peoplefinders.com/opt-out',
    time: '3+ days',
    verified: '2026-08-05',
  },
  {
    id: 'nuwber',
    name: 'Nuwber',
    method: 'form',
    methodLabel: 'Self-service form',
    note: 'Find your listing, copy its URL into the removal page, then confirm by email.',
    url: 'https://nuwber.com/removal/link',
    time: 'A few days',
    verified: '2026-08-05',
  },
  {
    id: 'checkpeople',
    name: 'CheckPeople',
    method: 'email',
    methodLabel: 'Email confirm',
    note: 'No ID upload required — just email confirmation.',
    url: 'https://www.checkpeople.com/opt-out',
    time: 'A few days',
    verified: '2026-08-05',
  },
  {
    id: 'backgroundchecks',
    name: 'BackgroundChecks.com',
    method: 'email',
    methodLabel: 'Email / footer form',
    note: 'No single dedicated opt-out URL — check the privacy policy linked in the site footer for the current request form, or email info@backgroundchecks.com with your name plus phone or email to be matched.',
    url: 'https://www.backgroundchecks.com/privacy-policy',
    time: 'Varies',
    verified: '2026-08-05',
    flag: "Confirm you're on backgroundchecks.com — several similarly-named sites exist",
  },
  {
    id: 'socialcatfish',
    name: 'Social Catfish',
    method: 'form',
    methodLabel: 'Self-service form',
    note: 'Standard "Do Not Sell My Info" request form.',
    url: 'https://socialcatfish.com/opt-out/',
    time: 'Up to 15 days',
    verified: '2026-08-05',
  },
  {
    id: 'truepeoplesearch',
    name: 'TruePeopleSearch',
    method: 'email',
    methodLabel: 'Email confirm',
    note: 'Select "the subject of the request" for yourself, then confirm via the emailed link — it expires in 24 hours.',
    url: 'https://www.truepeoplesearch.com/removal',
    time: 'A few days',
    verified: '2026-08-06',
  },
  {
    id: 'usphonebook',
    name: 'USPhoneBook',
    method: 'form',
    methodLabel: 'Self-service form',
    note: 'Confirmation link expires in 24 hours — check your email promptly after submitting.',
    url: 'https://www.usphonebook.com/opt-out',
    time: 'Up to 72 hrs',
    verified: '2026-08-06',
  },
  {
    id: 'clustrmaps',
    name: 'ClustrMaps',
    method: 'form',
    methodLabel: 'Self-service form',
    note: 'Enter your name, email, listing URL, and address, then tick which fields to remove and submit.',
    url: 'https://clustrmaps.com/bl/opt-out',
    time: 'A few days',
    verified: '2026-08-06',
  },
];

const store = spidergraphStore('spidergraph-broker-tracker-v1');
const saved = store.load();
// Back-compat: pre-persist.js saves were the flat map itself, not {data, lastUpdated}.
let state = saved ? (saved.data !== undefined ? saved.data : saved) : {};

const listEl = document.getElementById('brokerList');

const methodClass = {
  form: 'method-form',
  phone: 'method-phone',
  email: 'method-email',
  multi: 'method-multi',
};

BROKERS.forEach((b) => {
  // <label>, not <div>: makes the whole row a tap target on mobile, not just the raw
  // 20x20px checkbox (which is below WCAG's 24x24px minimum on its own) — matches the
  // OPSEC Field Manual's checklist rows, which already use this pattern. Native label
  // click-forwarding correctly skips the "Open opt-out page" link inside it, so tapping
  // that still just navigates rather than also toggling the checkbox.
  const row = document.createElement('label');
  row.className = 'broker' + (state[b.id] ? ' done' : '');
  row.id = 'row-' + b.id;
  row.innerHTML = `
  <input type="checkbox" id="cb-${b.id}" ${state[b.id] ? 'checked' : ''} aria-label="Mark ${b.name} as requested">
  <div class="broker-body">
    <div class="broker-top">
      <span class="broker-name">${b.name}</span>
      <span class="method-tag ${methodClass[b.method]}">${b.methodLabel}</span>
    </div>
    <div class="broker-note">${b.note}${b.flag ? ` <span class="flag">⚠ ${b.flag}</span>` : ''}</div>
    <div class="broker-meta">
      <a href="${b.url}" target="_blank" rel="noopener">Open opt-out page →</a>
      <span class="broker-time">Est. ${b.time}</span>
      <span class="broker-verified">Checked ${b.verified}</span>
    </div>
  </div>
`;
  listEl.appendChild(row);
  const cb = row.querySelector('input');
  cb.addEventListener('change', () => {
    state[b.id] = cb.checked;
    row.classList.toggle('done', cb.checked);
    store.save(state);
    render();
  });
});

function render() {
  let done = 0;
  BROKERS.forEach((b) => {
    if (state[b.id]) done++;
  });
  const pct = Math.round((done / BROKERS.length) * 100);
  document.getElementById('scoreNum').textContent = `${pct}%`;
  document.getElementById('mDone').textContent = `${done}/${BROKERS.length}`;
  document.getElementById('mTodo').textContent = BROKERS.length - done;
}

document.getElementById('resetBtn').addEventListener('click', () => {
  state = {};
  store.clear();
  document
    .querySelectorAll('#brokerList input[type=checkbox]')
    .forEach((cb) => {
      cb.checked = false;
      cb.closest('.broker').classList.remove('done');
    });
  render();
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const now = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const lines = [];
  lines.push('BROKER REMOVAL TRACKER — PROGRESS EXPORT');
  lines.push(`Generated ${now}`);
  lines.push('='.repeat(60));
  lines.push('');
  let done = 0;
  BROKERS.forEach((b) => {
    const isDone = !!state[b.id];
    if (isDone) done++;
    lines.push(`[${isDone ? 'x' : ' '}] ${b.name}`);
    lines.push(`      ${b.url}`);
  });
  lines.push('');
  lines.push('-'.repeat(60));
  lines.push(`Requested: ${done}/${BROKERS.length}`);
  lines.push('');
  lines.push('This list covers the highest-traffic broker sites only. For the');
  lines.push(
    'full, actively-maintained free list: inteltechniques.com/workbook.html',
  );
  lines.push(
    'For an automated/recurring service instead: see the Stack Builder,',
  );
  lines.push('slot OSN-01, at ../privacy-stack-builder/');

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `broker-removal-progress-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

const historyStore = spidergraphHistory('spidergraph-broker-tracker-v1');

// Rebuilds the requested/not-requested map from a saved snapshot and re-renders everything —
// data is the flat brokerId -> bool map, same shape store.load() saves.
function restoreSnapshot(data) {
  if (!data) return;
  if (
    !confirm(
      'Restore this snapshot? This replaces your current tracker with the saved checkpoint.',
    )
  )
    return;
  state = {};
  BROKERS.forEach((b) => {
    state[b.id] = !!data[b.id];
    const cb = document.getElementById(`cb-${b.id}`);
    const row = document.getElementById(`row-${b.id}`);
    if (cb) cb.checked = state[b.id];
    if (row) row.classList.toggle('done', state[b.id]);
  });
  store.save(state);
  render();
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
  const done = BROKERS.filter((b) => state[b.id]).length;
  const pct = Math.round((done / BROKERS.length) * 100);
  const summary = `${done}/${BROKERS.length} sites requested (${pct}%)`;
  historyStore.save(summary, state);
  renderHistory();
});

render();
renderHistory();
