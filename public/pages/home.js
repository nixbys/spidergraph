(function () {
  // The site root (/spidergraph/), from this file's own URL: pages/home.js.
  const base = new URL('../', document.currentScript.src).pathname;
  function timeAgo(iso) {
    if (!iso) return null;
    const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (days <= 0) return 'today';
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }
  function pctChecked(map) {
    const keys = Object.keys(map);
    if (keys.length === 0) return null;
    const done = keys.filter((k) => map[k] === true).length;
    return {
      done,
      total: keys.length,
      pct: Math.round((done / keys.length) * 100),
    };
  }
  const TIER_NAMES = { 1: 'Budget', 2: 'Mid', 3: 'No-Limit' };

  const TOOLS = [
    {
      key: 'spidergraph-stack-builder-v1',
      label: 'Stack Builder',
      href: base + 'privacy-stack-builder/',
      accent: 'tool-teal',
      summarize(data) {
        if (!data || !data.state) return 'Not started yet';
        const count = Object.keys(data.state).length;
        const tier = TIER_NAMES[data.target] || '—';
        return `Target: ${tier} tier · ${count} slots configured`;
      },
    },
    {
      key: 'spidergraph-opsec-v1',
      label: 'OPSEC Field Manual',
      href: base + 'opsec-field-manual/',
      accent: 'tool-amber',
      summarize(data) {
        const p = data ? pctChecked(data) : null;
        return p
          ? `${p.done}/${p.total} controls checked (${p.pct}%)`
          : 'Not started yet';
      },
    },
    {
      key: 'spidergraph-broker-tracker-v1',
      label: 'Broker Removal Tracker',
      href: base + 'broker-removal-tracker/',
      accent: 'tool-red',
      summarize(data) {
        const p = data ? pctChecked(data) : null;
        return p
          ? `${p.done}/${p.total} sites requested (${p.pct}%)`
          : 'Not started yet';
      },
    },
    {
      key: 'spidergraph-breach-check-v1',
      label: 'Breach Check Tracker',
      href: base + 'breach-check-tracker/',
      accent: 'tool-blue',
      summarize(data) {
        if (!data || !Array.isArray(data) || data.length === 0)
          return 'Not started yet';
        const done = data.filter((it) => it.checked).length;
        const pct = Math.round((done / data.length) * 100);
        return `${done}/${data.length} addresses checked (${pct}%)`;
      },
    },
    {
      key: 'spidergraph-digital-legacy-v1',
      label: 'Digital Legacy Worksheet',
      href: base + 'digital-legacy-worksheet/',
      accent: 'tool-amber',
      summarize(data) {
        if (!data) return 'Not started yet';
        let filled = 0;
        if ((data.contactName || '').trim()) filled++;
        if ((data.contactMethod || '').trim()) filled++;
        if ((data.recoveryLocation || '').trim()) filled++;
        if (data.emergencyAccess) filled++;
        if (Array.isArray(data.accounts) && data.accounts.length > 0) filled++;
        if ((data.notes || '').trim()) filled++;
        return filled === 0
          ? 'Not started yet'
          : `${filled}/6 sections filled in`;
      },
    },
    {
      key: 'spidergraph-incident-card-v1',
      label: 'Incident Response Card',
      href: base + 'incident-response-card/',
      accent: 'tool-amber',
      summarize(data) {
        if (!data) return 'Not started yet';
        const filled = [
          data.bankLine,
          data.cardLine,
          data.carrierLine,
          data.policeLine,
        ].filter((v) => (v || '').trim()).length;
        return filled === 0
          ? 'Not started yet'
          : `${filled}/4 numbers filled in`;
      },
    },
    {
      key: 'spidergraph-stuck-ledger-v1',
      label: 'Stuck Account Ledger',
      href: base + 'stuck-account-ledger/',
      accent: 'tool-red',
      summarize(data) {
        const list = data && Array.isArray(data.accounts) ? data.accounts : [];
        if (list.length === 0) return 'Not started yet';
        const steps = [
          'request',
          'links',
          'overwrite',
          'content',
          'visibility',
        ];
        const handled = list.filter((a) =>
          steps.every((k) => (a.steps || {})[k]),
        ).length;
        return `${handled}/${list.length} accounts handled`;
      },
    },
  ];

  const grid = document.getElementById('myStatusGrid');
  TOOLS.forEach((t) => {
    const store = spidergraphStore(t.key);
    const saved = store.load();
    const data = saved ? (saved.data !== undefined ? saved.data : saved) : null;
    const started = !!saved;
    const el = document.createElement('a');
    el.className =
      'mystatus-item ' + t.accent + (started ? '' : ' not-started');
    el.href = t.href;
    const ago =
      started && saved.lastUpdated ? timeAgo(saved.lastUpdated) : null;
    el.innerHTML = `
  <div class="mystatus-label">${t.label}</div>
  <div class="mystatus-value">${t.summarize(data)}</div>
  <div class="mystatus-ago">${ago ? `Updated ${ago}` : started ? '' : 'Start →'}</div>
`;
    grid.appendChild(el);
  });

  const backupStatus = document.getElementById('backupStatus');
  function setBackupStatus(msg, ok) {
    backupStatus.textContent = msg;
    backupStatus.className =
      'backup-status' + (ok === undefined ? '' : ok ? ' ok' : ' err');
  }

  document.getElementById('backupExportBtn').addEventListener('click', () => {
    const count = spidergraphExport();
    if (count === 0) {
      setBackupStatus(
        'Nothing to back up yet — use a tool first, then come back here.',
        false,
      );
    } else {
      setBackupStatus(
        `Downloaded a backup of ${count} saved item${count === 1 ? '' : 's'}.`,
        true,
      );
    }
  });

  const backupFileInput = document.getElementById('backupFileInput');
  document
    .getElementById('backupImportBtn')
    .addEventListener('click', () => backupFileInput.click());
  backupFileInput.addEventListener('change', () => {
    const file = backupFileInput.files[0];
    backupFileInput.value = ''; // allow re-selecting the same file later
    if (!file) return;
    if (
      !confirm(
        "Restore from this backup file? This overwrites any current Spidergraph data in this browser with what's saved in the file.",
      )
    ) {
      return;
    }
    spidergraphImport(file)
      .then((count) => {
        setBackupStatus(
          `Restored ${count} item${count === 1 ? '' : 's'} — reloading…`,
          true,
        );
        setTimeout(() => location.reload(), 700);
      })
      .catch((err) => {
        setBackupStatus(err.message || "Couldn't restore that file.", false);
      });
  });
})();
