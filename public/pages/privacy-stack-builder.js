const TIERS = { 1: 'Budget', 2: 'Mid', 3: 'No-Limit' };

const DATA = [
  {
    domain: 'Identity & Accounts',
    code: 'IDN-01',
    name: 'Password Manager',
    verified: '2026-08-07',
    options: [
      {
        id: 'none',
        label: 'None / browser-saved passwords',
        tier: 0,
        cost: 0,
      },
      { id: 'bw-free', label: 'Bitwarden (Free)', tier: 1, cost: 0 },
      {
        id: 'bw-prem',
        label: 'Bitwarden Premium / Proton Pass',
        tier: 2,
        cost: 20,
      },
      {
        id: '1p',
        label: '1Password (Families/Business-grade)',
        tier: 3,
        cost: 72,
      },
    ],
    rec: 'Bitwarden Premium or Proton Pass — cross-platform, hardware-key lockable.',
    legacyNotes: [
      "1Password (Families/Business-grade) was listed at $60/yr; corrected to $72/yr on 2026-07-25 following 1Password's March 2026 price increase ($59.88→$71.88/yr).",
      "Bitwarden Premium was listed at $10/yr; corrected to $20/yr on 2026-08-07 following Bitwarden's January 2026 price increase ($9.99→$19.80/yr, its first change in ten years).",
    ],
  },

  {
    domain: 'Identity & Accounts',
    code: 'IDN-02',
    name: 'Email & Aliasing',
    verified: '2026-07-25',
    options: [
      {
        id: 'none',
        label: 'Mainstream free email, no aliasing',
        tier: 0,
        cost: 0,
      },
      {
        id: 'proton-free',
        label: 'Proton Mail (Free) + free aliasing tier',
        tier: 1,
        cost: 0,
      },
      {
        id: 'proton-plus',
        label: 'Proton Unlimited (Mail + aliasing bundled)',
        tier: 2,
        cost: 120,
      },
      {
        id: 'dual',
        label: 'Proton Unlimited + second compartmentalized provider',
        tier: 3,
        cost: 168,
      },
    ],
    rec: 'Proton Unlimited bundles Mail + SimpleLogin aliasing at the best per-feature price.',
  },

  {
    domain: 'Authentication',
    code: 'AUTH-01',
    name: '2FA / Hardware Auth',
    verified: '2026-08-09',
    options: [
      { id: 'none', label: 'SMS codes only, or no 2FA', tier: 0, cost: 0 },
      {
        id: 'totp',
        label: 'TOTP app (Ente Auth / Aegis)',
        tier: 1,
        cost: 0,
      },
      {
        id: 'key1',
        label: '1x Hardware key (YubiKey) on core accounts',
        tier: 2,
        cost: 29,
      },
      {
        id: 'key2',
        label: '2x Hardware keys, primary + offsite backup',
        tier: 3,
        cost: 58,
      },
    ],
    rec: 'Two hardware keys — one carried, one stored offsite as a lockout backup.',
    legacyNotes: [
      "Tier 2/3 hardware-key cost was listed at $0 (an oversight — the Playbook's own prose already documented a $25–60/key range); corrected on 2026-08-09 to $29 (1x Yubico Security Key C NFC, the budget FIDO2-only option) / $58 (2x), matching current Yubico pricing. This is a one-time hardware cost, not a recurring subscription, unlike every other priced slot in this picker — see NET-02's self-hosted-router tier for the only other one-time-cost precedent.",
    ],
  },

  {
    domain: 'Endpoint',
    code: 'SYS-01',
    name: 'Desktop OS Hardening',
    platformAxis: 'desktop',
    verified: '2026-08-09',
    platforms: {
      windows: {
        options: [
          {
            id: 'none',
            label: 'Windows Home, Microsoft account, default settings',
            tier: 0,
            cost: 0,
          },
          {
            id: 'patched',
            label:
              'Fully patched, local account, device encryption/BitLocker verified',
            tier: 1,
            cost: 0,
          },
          {
            id: 'grouppolicy',
            label:
              'Windows Pro + Group Policy privacy hardening (Recall/Copilot telemetry off)',
            tier: 2,
            cost: 0,
          },
          {
            id: 'sandboxed',
            label:
              'Windows Pro/Education hardened + Sandbox or Hyper-V VM isolation',
            tier: 3,
            cost: 0,
          },
        ],
        rec: "Privacy Guides/Techlore rate Linux as the stronger privacy default (less baked-in telemetry) — but staying on Windows for compatibility or comfort isn't a failure. Sandbox/Hyper-V VM isolation is the realistic ceiling here since Windows has no Qubes-equivalent compartmentalization. Avoid modified ISOs like Tiny11 or Windows AME: they fall behind on security updates and AV definitions.",
      },
      macos: {
        options: [
          {
            id: 'none',
            label: 'macOS default settings, iCloud account',
            tier: 0,
            cost: 0,
          },
          {
            id: 'patched',
            label: 'Fully patched, FileVault enabled, firewall on',
            tier: 1,
            cost: 0,
          },
          {
            id: 'lockdown',
            label:
              'Same + Lockdown Mode, Advanced Data Protection, Standard (non-admin) account',
            tier: 2,
            cost: 0,
          },
          {
            id: 'apple-silicon',
            label:
              'Apple Silicon (M2+) + Lockdown Mode standing default, firewall blocks all incoming',
            tier: 3,
            cost: 0,
          },
        ],
        rec: "Privacy Guides/Techlore rate Linux as the stronger privacy default — but neither treats staying in the Apple ecosystem as a mistake. FileVault + Lockdown Mode cover most of the realistic gain here; no third-party antivirus needed, XProtect plus Apple Silicon's Secure Enclave is the hardware ceiling.",
      },
      linux: {
        options: [
          {
            id: 'none',
            label: 'Mainstream OS, default settings',
            tier: 0,
            cost: 0,
          },
          {
            id: 'patched',
            label: 'Mainstream distro, fully patched + FDE verified',
            tier: 1,
            cost: 0,
          },
          {
            id: 'atomic',
            label: 'Fedora Atomic (Silverblue/Kinoite)',
            tier: 2,
            cost: 0,
          },
          {
            id: 'hardened',
            label: 'Secureblue or Qubes OS',
            tier: 3,
            cost: 0,
          },
        ],
        rec: 'The Privacy Guides/Techlore-preferred desktop default — avoids the telemetry baked into mainstream proprietary OSes. Immutable/atomic distro further limits persistence of malware and config drift.',
      },
    },
  },

  {
    domain: 'Endpoint',
    code: 'SYS-02',
    name: 'Mobile OS Hardening',
    platformAxis: 'mobile',
    verified: '2026-08-09',
    platforms: {
      ios: {
        options: [
          {
            id: 'none',
            label: 'Stock iOS, default settings',
            tier: 0,
            cost: 0,
          },
          {
            id: 'hardened-stock',
            label: 'Stock iOS, App Tracking Transparency off, ad ID reset',
            tier: 1,
            cost: 0,
          },
          {
            id: 'disciplined',
            label: 'Same + quarterly privacy/permission report audits',
            tier: 2,
            cost: 0,
          },
          {
            id: 'lockdown',
            label: 'Lockdown Mode enabled as standing default',
            tier: 3,
            cost: 0,
          },
        ],
        rec: "GrapheneOS on Android is Privacy Guides' preferred mobile pick, but staying on iOS is a legitimate, common choice, not a compromise to feel bad about. Lockdown Mode is the realistic ceiling here — meaningfully shrinks attack surface at the cost of some convenience features.",
      },
      android: {
        options: [
          {
            id: 'none',
            label: 'Stock Android, default settings',
            tier: 0,
            cost: 0,
          },
          {
            id: 'hardened-stock',
            label:
              'Stock Android, ad ID reset, Play Protect on, hardened settings',
            tier: 1,
            cost: 0,
          },
          {
            id: 'disciplined',
            label:
              'Same + quarterly permission audits, sensitive apps in a separate profile',
            tier: 2,
            cost: 0,
          },
          {
            id: 'graphene',
            label: 'GrapheneOS on a Pixel — full de-Googled hardened AOSP',
            tier: 3,
            cost: 0,
          },
        ],
        rec: 'GrapheneOS on Pixel hardware is the Privacy Guides-preferred mobile ceiling — only Pixel devices support it, due to firmware/bootloader requirements.',
      },
    },
  },

  {
    domain: 'Network',
    code: 'NET-01',
    name: 'VPN',
    verified: '2026-07-25',
    options: [
      { id: 'none', label: 'No VPN', tier: 0, cost: 0 },
      { id: 'free', label: 'Proton VPN (Free tier)', tier: 1, cost: 0 },
      {
        id: 'paid',
        label: 'Mullvad / IVPN / Proton VPN (paid)',
        tier: 2,
        cost: 70,
      },
      {
        id: 'selfhost',
        label: 'Paid VPN + self-hosted WireGuard exit node',
        tier: 3,
        cost: 130,
      },
    ],
    rec: 'A VPN shifts trust from your ISP — it is not anonymity. Pick based on payment privacy (cash/Monero accepted) if that matters to your model.',
  },

  {
    domain: 'Network',
    code: 'NET-02',
    name: 'DNS / Router',
    verified: '2026-08-09',
    options: [
      {
        id: 'none',
        label: 'ISP default DNS, stock router firmware',
        tier: 0,
        cost: 0,
      },
      {
        id: 'encrypted-dns',
        label: 'Encrypted DNS (Mullvad DNS / Quad9)',
        tier: 1,
        cost: 0,
      },
      {
        id: 'openwrt',
        label: 'Encrypted DNS + OpenWrt router firmware',
        tier: 2,
        cost: 0,
      },
      {
        id: 'segmented',
        label: 'Self-hosted resolver + OPNsense/pfSense, VLAN-segmented',
        tier: 3,
        cost: 150,
      },
    ],
    rec: 'DNS changes alone are oversold — real gains come from router firmware + network segmentation.',
  },

  {
    domain: 'Network',
    code: 'NET-03',
    name: 'Browser Hardening',
    verified: '2026-08-09',
    options: [
      {
        id: 'none',
        label: 'Default browser, no extensions',
        tier: 0,
        cost: 0,
      },
      { id: 'ff-ubo', label: 'Firefox + uBlock Origin', tier: 1, cost: 0 },
      {
        id: 'containers',
        label: 'Same + container/profile separation, disciplined',
        tier: 2,
        cost: 0,
      },
      {
        id: 'mullvad-br',
        label: 'Mullvad Browser / Tor Browser for sensitive sessions',
        tier: 3,
        cost: 0,
      },
    ],
    rec: 'Firefox + uBlock Origin is the highest value-per-minute control in the entire stack.',
  },

  {
    domain: 'Communications',
    code: 'COM-01',
    name: 'Messaging',
    verified: '2026-08-09',
    options: [
      {
        id: 'none',
        label: 'Standard SMS / unencrypted platform DMs',
        tier: 0,
        cost: 0,
      },
      {
        id: 'signal',
        label: 'Signal, core contacts migrated',
        tier: 1,
        cost: 0,
      },
      {
        id: 'signal-hardened',
        label: 'Signal + disappearing messages + registration lock',
        tier: 2,
        cost: 0,
      },
      {
        id: 'simplex',
        label: 'Signal (hardened) + SimpleX for zero-identifier needs',
        tier: 3,
        cost: 0,
      },
    ],
    rec: 'Signal covers nearly everyone; SimpleX is the ceiling for relationships needing no persistent ID.',
  },

  {
    domain: 'Communications',
    code: 'COM-02',
    name: 'Voice/Video & Burner Numbers',
    verified: '2026-11-16',
    options: [
      {
        id: 'none',
        label: 'Real number given out for calls/texts everywhere',
        tier: 0,
        cost: 0,
      },
      {
        id: 'signal-calls',
        label: 'Signal voice/video for contacts already on Signal',
        tier: 1,
        cost: 0,
      },
      {
        id: 'google-voice',
        label:
          'Same + free Google Voice number for lower-trust contexts (US only)',
        tier: 2,
        cost: 0,
      },
      {
        id: 'burner',
        label:
          'Same + a dedicated burner number (Burner ~$5/mo or Hushed ~$7/mo) for full compartmentalization',
        tier: 3,
        cost: 60,
      },
    ],
    rec: "Google Voice covers most 'give this out instead of my real number' needs for free; pay for Burner/Hushed only when the number itself needs to be disposable, not just separate.",
    legacyNotes: [
      "Hushed was listed at ~$5/mo alongside Burner; corrected to ~$7/mo on 2026-11-16 (Hushed's cheapest recurring plan is now $6.99/mo; Burner's is still $4.99/mo).",
    ],
  },

  {
    domain: 'Data',
    code: 'DATA-01',
    name: 'Cloud Storage & Encryption',
    verified: '2026-08-07',
    options: [
      {
        id: 'none',
        label: 'Unencrypted mainstream cloud storage',
        tier: 0,
        cost: 0,
      },
      {
        id: 'free-tier',
        label: 'Proton Drive / Filen free tier',
        tier: 1,
        cost: 0,
      },
      {
        id: 'cryptomator',
        label: 'Zero-knowledge provider + Cryptomator client-side encryption',
        tier: 2,
        cost: 90,
      },
      {
        id: 'selfhost',
        label: 'Self-hosted Nextcloud + encrypted offsite (B2/Storj)',
        tier: 3,
        cost: 250,
      },
    ],
    rec: 'Client-side encryption (Cryptomator) matters more than which provider you pick.',
    legacyNotes: [
      "This slot's cryptomator-tier cost was still listed at $115/yr — the Playbook's own equivalent row was corrected to ~$90/yr (Filen's actual Pro III annual price) on 2026-07-25, but that correction was never propagated here, so the two representations of this recommendation had drifted apart. Synced to $90/yr on 2026-08-07.",
    ],
  },

  {
    domain: 'Data',
    code: 'DATA-02',
    name: 'Backup Strategy',
    verified: '2026-08-09',
    options: [
      { id: 'none', label: 'No regular backup', tier: 0, cost: 0 },
      {
        id: 'single',
        label: 'Single cloud backup, no local copy',
        tier: 1,
        cost: 0,
      },
      {
        id: '321',
        label: 'Full 3-2-1 (local + local sync + offsite)',
        tier: 2,
        cost: 0,
      },
      {
        id: 'cold',
        label: '3-2-1 + offline cold backup, quarterly restore-tested',
        tier: 3,
        cost: 0,
      },
    ],
    rec: '3-2-1 fully implemented is the real target — most people are missing the second local copy.',
  },

  {
    domain: 'Financial',
    code: 'FIN-01',
    name: 'Card Masking / Payment Privacy',
    verified: '2026-11-16',
    options: [
      {
        id: 'none',
        label: 'Real card number used everywhere, no masking',
        tier: 0,
        cost: 0,
      },
      {
        id: 'bank',
        label: "Bank's built-in virtual card feature, if available",
        tier: 1,
        cost: 0,
      },
      {
        id: 'privacy-free',
        label: 'Privacy.com (Free or Plus tier)',
        tier: 2,
        cost: 0,
      },
      {
        id: 'privacy-pro',
        label:
          'Privacy.com Premium + dedicated per-vendor cards on every subscription',
        tier: 3,
        cost: 300,
      },
    ],
    rec: "One leaked merchant database shouldn't expose your real card everywhere else — Privacy.com's free tier alone (12 cards/month, no monthly fee) covers most people's actual usage.",
    legacyNotes: [
      'The $300/yr option was labeled Privacy.com Pro; relabeled Premium on 2026-11-16, the tier that actually costs $300/yr (Pro is $120/yr).',
    ],
  },

  {
    domain: 'Financial',
    code: 'FIN-02',
    name: 'Credit Monitoring & Freezes',
    verified: '2026-07-24',
    options: [
      { id: 'none', label: 'No monitoring, no freeze', tier: 0, cost: 0 },
      {
        id: 'freeze',
        label: 'Free credit freezes at all 3 bureaus + free annual reports',
        tier: 1,
        cost: 0,
      },
      {
        id: 'monitoring',
        label: 'Same + a paid credit monitoring alert layer',
        tier: 2,
        cost: 150,
      },
      {
        id: 'insurance',
        label: 'Full identity theft insurance/restoration service',
        tier: 3,
        cost: 250,
      },
    ],
    rec: 'The freeze is the actual control — it prevents new accounts from opening at all. Monitoring only tells you after the fact, so do the freeze even if you also pay for monitoring.',
  },

  {
    domain: 'Digital Footprint',
    code: 'OSN-01',
    name: 'Data Broker Removal',
    verified: '2026-11-16',
    options: [
      { id: 'none', label: 'Never audited or opted out', tier: 0, cost: 0 },
      {
        id: 'manual',
        label: 'Manual opt-outs via free broker lists',
        tier: 1,
        cost: 0,
      },
      {
        id: 'easyoptouts',
        label: 'EasyOptOuts (automated, quarterly)',
        tier: 2,
        cost: 20,
      },
      {
        id: 'layered',
        label: 'EasyOptOuts + DeleteMe layered',
        tier: 3,
        cost: 149,
      },
    ],
    rec: "EasyOptOuts alone out-performs DeleteMe alone on documented removal rate — layer, don't just upgrade. Doing the manual tier yourself? The <a href='../broker-removal-tracker/' style='color:var(--red)'>Broker Removal Tracker</a> walks the top ~16 sites one by one with direct links to each site's own opt-out page.",
    legacyNotes: [
      'The $149/yr option also offered Optery Ultimate; removed on 2026-11-16 because Ultimate costs $249/yr, not $149/yr.',
    ],
  },
];

// Platform detection: guess desktop/mobile OS from the browser, default to the
// global-majority platforms (Windows, Android) rather than assuming Linux/iOS.
function detectPlatform() {
  const ua = navigator.userAgent || '';
  const uaData = navigator.userAgentData;
  let desktop = null,
    mobile = null;

  if (/android/i.test(ua)) mobile = 'android';
  else if (/iphone|ipad|ipod/i.test(ua)) mobile = 'ios';

  if (!mobile) {
    if (uaData && uaData.platform) {
      const p = uaData.platform.toLowerCase();
      if (p.includes('win')) desktop = 'windows';
      else if (p.includes('mac')) desktop = 'macos';
      else if (p.includes('linux')) desktop = 'linux';
    } else {
      if (/windows/i.test(ua)) desktop = 'windows';
      else if (/macintosh|mac os x/i.test(ua)) desktop = 'macos';
      else if (/linux/i.test(ua)) desktop = 'linux';
    }
  }
  return { desktop, mobile };
}

const store = spidergraphStore('spidergraph-stack-builder-v1');
const savedRaw = store.load();
// Back-compat: pre-persist.js saves were {target, platformState, state} directly, not {data, lastUpdated}.
const saved = savedRaw
  ? savedRaw.data !== undefined
    ? savedRaw.data
    : savedRaw
  : null;

const platformState = { desktop: 'windows', mobile: 'android' };
const detected = detectPlatform();
if (detected.desktop) platformState.desktop = detected.desktop;
if (detected.mobile) platformState.mobile = detected.mobile;
if (saved && saved.platformState) {
  if (['windows', 'macos', 'linux'].includes(saved.platformState.desktop))
    platformState.desktop = saved.platformState.desktop;
  if (['ios', 'android'].includes(saved.platformState.mobile))
    platformState.mobile = saved.platformState.mobile;
}

function currentOptions(d) {
  return d.platformAxis
    ? d.platforms[platformState[d.platformAxis]].options
    : d.options;
}
function currentRec(d) {
  return d.platformAxis
    ? d.platforms[platformState[d.platformAxis]].rec
    : d.rec;
}

let target = saved && [1, 2, 3].includes(saved.target) ? saved.target : 2;
const state = {}; // id -> selected option id
DATA.forEach((d) => {
  const fallback = currentOptions(d)[0].id;
  const savedVal = saved && saved.state ? saved.state[d.code] : undefined;
  state[d.code] =
    savedVal && currentOptions(d).some((o) => o.id === savedVal)
      ? savedVal
      : fallback;
});

function persist() {
  store.save({ target, platformState, state });
}

function populateSelect(d) {
  const sel = document.getElementById(`sel-${d.code}`);
  sel.innerHTML = '';
  currentOptions(d).forEach((o) => {
    const opt = document.createElement('option');
    opt.value = o.id;
    opt.textContent = o.label;
    sel.appendChild(opt);
  });
  sel.value = state[d.code];
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const rowsEl = document.getElementById('rows');
const jumpSel = document.getElementById('sectionJump');
let lastDomain = null;

DATA.forEach((d) => {
  if (d.domain !== lastDomain) {
    const h = document.createElement('div');
    h.className = 'domain-title';
    h.textContent = d.domain;
    h.id = 'domain-' + slugify(d.domain);
    rowsEl.appendChild(h);
    lastDomain = d.domain;

    const opt = document.createElement('option');
    opt.value = '#' + h.id;
    opt.textContent = d.domain;
    jumpSel.appendChild(opt);
  }
  const row = document.createElement('div');
  row.className = 'row';
  row.innerHTML = `
  <div class="code-chip">${d.code}</div>
  <div class="row-main">
    <div class="name">${d.name}</div>
    <div class="note" id="note-${d.code}"></div>
  </div>
  <select id="sel-${d.code}"></select>
  <div class="status" id="status-${d.code}"></div>
`;
  rowsEl.appendChild(row);

  populateSelect(d);
  const sel = row.querySelector(`#sel-${d.code}`);
  sel.addEventListener('change', () => {
    state[d.code] = sel.value;
    persist();
    render();
  });
});

document.getElementById('platformDesktop').value = platformState.desktop;
document.getElementById('platformMobile').value = platformState.mobile;
document.querySelectorAll('#tierBtns .tier-btn').forEach((b) => {
  const isActive = parseInt(b.dataset.tier, 10) === target;
  b.classList.toggle('active', isActive);
  b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
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

function onPlatformChange(axis, newValue) {
  const affected = DATA.filter((d) => d.platformAxis === axis);
  const prevTiers = affected.map((d) => {
    const cur = currentOptions(d).find((o) => o.id === state[d.code]);
    return cur ? cur.tier : 0;
  });
  platformState[axis] = newValue;
  affected.forEach((d, i) => {
    const newOptions = currentOptions(d);
    const matched =
      newOptions.find((o) => o.tier === prevTiers[i]) || newOptions[0];
    state[d.code] = matched.id;
    populateSelect(d);
  });
  persist();
  render();
}

document
  .getElementById('platformDesktop')
  .addEventListener('change', (e) =>
    onPlatformChange('desktop', e.target.value),
  );
document
  .getElementById('platformMobile')
  .addEventListener('change', (e) =>
    onPlatformChange('mobile', e.target.value),
  );

document.querySelectorAll('#tierBtns .tier-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#tierBtns .tier-btn').forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    target = parseInt(btn.dataset.tier, 10);
    persist();
    render();
  });
});

document.getElementById('resetBtn').addEventListener('click', () => {
  target = 2;
  DATA.forEach((d) => {
    state[d.code] = currentOptions(d)[0].id;
    populateSelect(d);
  });
  document.querySelectorAll('#tierBtns .tier-btn').forEach((b) => {
    const isActive = parseInt(b.dataset.tier, 10) === target;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
  store.clear();
  render();
});

function getOption(d, id) {
  return currentOptions(d).find((o) => o.id === id);
}

function render() {
  let atTarget = 0,
    below = 0,
    gap = 0,
    cost = 0;
  const gapItems = [];

  DATA.forEach((d) => {
    const cur = getOption(d, state[d.code]);
    const statusEl = document.getElementById(`status-${d.code}`);
    const noteEl = document.getElementById(`note-${d.code}`);
    cost += cur.tier > 0 ? cur.cost : 0;

    // Classification itself lives in src/lib/stack-builder-scoring.js (unit-tested
    // there) — this just maps the returned status to this page's own DOM/copy.
    const statusKey = classifyStatus(cur.tier, target);
    if (isCovered(statusKey)) atTarget++;
    if (statusKey === 'below') below++;
    if (statusKey === 'gap') gap++;
    statusEl.textContent = statusKey.toUpperCase();
    statusEl.className = `status ${statusKey}`;
    if (statusKey === 'gap') {
      gapItems.push({
        name: d.name,
        msg: `Nothing set — start with: ${currentOptions(d)[1].label}`,
      });
    } else if (statusKey === 'below') {
      const recOpt = currentOptions(d).find((o) => o.tier === target);
      gapItems.push({
        name: d.name,
        msg: `Below target — consider: ${recOpt ? recOpt.label : currentRec(d)}`,
      });
    }

    const verifiedTag = d.verified
      ? `<span class="verified-tag">✓ verified ${d.verified}</span>`
      : '';
    const legacyHtml = (d.legacyNotes || [])
      .map((n) => `<span class="legacy-note"><b>Legacy:</b> ${n}</span>`)
      .join('');
    noteEl.innerHTML = `<b>Rec:</b> ${currentRec(d)}${verifiedTag}${legacyHtml}`;
  });

  document.getElementById('mAtTarget').textContent =
    `${atTarget}/${DATA.length}`;
  document.getElementById('mBelow').textContent = below;
  document.getElementById('mGap').textContent = gap;
  document.getElementById('mCost').textContent = `$${cost.toLocaleString()}`;
  document.getElementById('scoreNum').textContent =
    `${coveragePercent(atTarget, DATA.length)}%`;

  const gapListEl = document.getElementById('gapList');
  gapListEl.innerHTML = '';
  if (gapItems.length === 0) {
    gapListEl.innerHTML = `<div class="empty-gaps">✓ Every slot meets or exceeds the ${TIERS[target]} target.</div>`;
  } else {
    gapItems.slice(0, 6).forEach((g) => {
      const div = document.createElement('div');
      div.className = 'gap-item';
      div.innerHTML = `<span class="dot"></span><span><b>${g.name}:</b> ${g.msg}</span>`;
      gapListEl.appendChild(div);
    });
  }

  drawRadar();
}

function drawRadar() {
  const svg = document.getElementById('radar');
  svg.innerHTML = '';
  const cx = 140,
    cy = 140,
    maxR = 105;
  const n = DATA.length;
  const levels = 3;

  const ns = 'http://www.w3.org/2000/svg';
  function pt(i, r) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  // grid rings
  for (let l = 1; l <= levels; l++) {
    const r = (maxR / levels) * l;
    const points = [];
    for (let i = 0; i < n; i++) {
      points.push(pt(i, r).join(','));
    }
    const poly = document.createElementNS(ns, 'polygon');
    poly.setAttribute('points', points.join(' '));
    poly.setAttribute('fill', 'none');
    poly.setAttribute(
      'stroke',
      l === levels ? 'var(--border)' : 'var(--border-soft)',
    );
    poly.setAttribute('stroke-width', '1');
    svg.appendChild(poly);
  }
  // spokes
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

  // target tier reference shape (dashed)
  const tpoints = [];
  for (let i = 0; i < n; i++) {
    tpoints.push(pt(i, (maxR / levels) * target).join(','));
  }
  const tpoly = document.createElementNS(ns, 'polygon');
  tpoly.setAttribute('points', tpoints.join(' '));
  tpoly.setAttribute('fill', 'none');
  tpoly.setAttribute('stroke', 'var(--blue)');
  tpoly.setAttribute('stroke-width', '1.5');
  tpoly.setAttribute('stroke-dasharray', '3,4');
  tpoly.setAttribute('opacity', '0.6');
  svg.appendChild(tpoly);

  // current coverage shape (filled)
  const cpoints = [];
  DATA.forEach((d, i) => {
    const cur = getOption(d, state[d.code]);
    const r = (maxR / levels) * cur.tier;
    cpoints.push(pt(i, r));
  });
  const cpoly = document.createElementNS(ns, 'polygon');
  cpoly.setAttribute('points', cpoints.map((p) => p.join(',')).join(' '));
  cpoly.setAttribute('fill', 'var(--teal)');
  cpoly.setAttribute('fill-opacity', '0.2');
  cpoly.setAttribute('stroke', 'var(--teal)');
  cpoly.setAttribute('stroke-width', '2');
  cpoly.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(cpoly);

  cpoints.forEach(([x, y]) => {
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('cx', x);
    c.setAttribute('cy', y);
    c.setAttribute('r', '2.5');
    c.setAttribute('fill', 'var(--teal)');
    svg.appendChild(c);
  });

  // axis labels (codes only, kept short)
  DATA.forEach((d, i) => {
    const [x, y] = pt(i, maxR + 16);
    const t = document.createElementNS(ns, 'text');
    t.setAttribute('x', x);
    t.setAttribute('y', y);
    t.setAttribute('fill', '#5e6b7c');
    t.setAttribute('font-size', '8.5');
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
  let atTarget = 0,
    below = 0,
    gap = 0,
    cost = 0;
  const lines = [];
  const platformLabels = {
    windows: 'Windows',
    macos: 'macOS',
    linux: 'Linux',
    ios: 'iOS',
    android: 'Android',
  };
  lines.push('PRIVACY & SECURITY STACK — RECOMMENDATIONS REPORT');
  lines.push(`Generated ${now} · Target tier: ${TIERS[target]}`);
  lines.push(
    `Platform: Desktop = ${platformLabels[platformState.desktop]}, Mobile = ${platformLabels[platformState.mobile]}`,
  );
  lines.push('='.repeat(60));
  lines.push('');

  DATA.forEach((d) => {
    const cur = getOption(d, state[d.code]);
    cost += cur.tier > 0 ? cur.cost : 0;
    // Same classification as render() above, from src/lib/stack-builder-scoring.js —
    // only the report's own label/action wording differs per branch below.
    const statusKey = classifyStatus(cur.tier, target);
    if (isCovered(statusKey)) atTarget++;
    if (statusKey === 'below') below++;
    if (statusKey === 'gap') gap++;
    let status, action;
    if (statusKey === 'gap') {
      status = 'CRITICAL GAP';
      const first = currentOptions(d)[1];
      action = `Start with: ${first.label}. ${currentRec(d)}`;
    } else if (statusKey === 'optimal') {
      status = 'OPTIMAL';
      action = 'No action needed at current target tier.';
    } else if (statusKey === 'below') {
      status = 'BELOW TARGET';
      const recOpt = currentOptions(d).find((o) => o.tier === target);
      action = `Upgrade to: ${recOpt ? recOpt.label : currentRec(d)}. ${currentRec(d)}`;
    } else {
      status = 'EXCEEDS TARGET';
      action = 'Already above target tier — no action needed.';
    }
    lines.push(`[${d.code}] ${d.name}`);
    lines.push(`  Current:  ${cur.label}`);
    lines.push(`  Status:   ${status}`);
    lines.push(`  Guidance: ${action}`);
    lines.push('');
  });

  lines.push('-'.repeat(60));
  lines.push('SUMMARY');
  lines.push(`  Slots at/above target: ${atTarget}/${DATA.length}`);
  lines.push(`  Slots below target:    ${below}`);
  lines.push(`  Critical gaps (none):  ${gap}`);
  lines.push(`  Est. recurring cost:   $${cost.toLocaleString()}/yr`);
  lines.push(
    `  Overall completeness:  ${coveragePercent(atTarget, DATA.length)}%`,
  );
  lines.push('');
  lines.push('-'.repeat(60));
  lines.push('SOURCES');
  lines.push(
    '  Recommendations derived from Privacy Guides (privacyguides.org),',
  );
  lines.push(
    '  The New Oil (thenewoil.org), IntelTechniques (inteltechniques.com),',
  );
  lines.push(
    '  Techlore, Consumer Reports data-removal testing, and official vendor',
  );
  lines.push('  documentation. Full bibliography and further-reading list:');
  lines.push('  see recommendations-report.md.');
  lines.push('');
  lines.push(
    '  This space moves fast — re-verify pricing and tier details at each',
  );
  lines.push(
    "  vendor's site before purchasing, and re-run this audit periodically.",
  );

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `stack-report-${TIERS[target].toLowerCase()}-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const historyStore = spidergraphHistory('spidergraph-stack-builder-v1');

// Rebuilds target/platformState/state from a saved snapshot and re-renders everything —
// used by both the "Restore" buttons below. Snapshot data is a fully self-contained
// {target, platformState, state} object (see history.js), same shape store.load() saves.
function restoreSnapshot(data) {
  if (!data) return;
  if (
    !confirm(
      'Restore this snapshot? This replaces your current build with the saved checkpoint.',
    )
  )
    return;
  if ([1, 2, 3].includes(data.target)) target = data.target;
  if (data.platformState) {
    if (['windows', 'macos', 'linux'].includes(data.platformState.desktop))
      platformState.desktop = data.platformState.desktop;
    if (['ios', 'android'].includes(data.platformState.mobile))
      platformState.mobile = data.platformState.mobile;
  }
  DATA.forEach((d) => {
    const fallback = currentOptions(d)[0].id;
    const savedVal = data.state ? data.state[d.code] : undefined;
    state[d.code] =
      savedVal && currentOptions(d).some((o) => o.id === savedVal)
        ? savedVal
        : fallback;
    populateSelect(d);
  });
  document.getElementById('platformDesktop').value = platformState.desktop;
  document.getElementById('platformMobile').value = platformState.mobile;
  document.querySelectorAll('#tierBtns .tier-btn').forEach((b) => {
    const isActive = parseInt(b.dataset.tier, 10) === target;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
  persist();
  render();
}

function renderHistory() {
  const snapshots = historyStore.list().slice().reverse();
  const el = document.getElementById('historyList');
  if (snapshots.length === 0) {
    el.innerHTML =
      '<div class="history-empty">No snapshots yet — save one to start tracking your build over time.</div>';
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
  let atTarget = 0,
    gap = 0;
  DATA.forEach((d) => {
    const cur = getOption(d, state[d.code]);
    if (cur.tier === 0) gap++;
    else if (cur.tier >= target) atTarget++;
  });
  const tierName = TIERS[target] || '—';
  const summary = `Target: ${tierName} tier · ${atTarget}/${DATA.length} at target, ${gap} gaps`;
  historyStore.save(summary, { target, platformState, state });
  renderHistory();
});

render();
renderHistory();
