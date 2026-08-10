// Spidergraph backup/restore — a single site-wide export/import of every "spidergraph-"
// prefixed localStorage key: all six tools' live state (persist.js) plus all six tools'
// snapshot history (history.js). This is the only way to move your data to a new browser
// or device, or keep an offline copy, since there's no account/backend by design — see
// CLAUDE.md's no-backend guardrail. Lives on the homepage only (not per-tool) because it's
// inherently cross-tool, the same reason the "Your Spidergraph" summary widget lives there.
//
// Deliberately discovers keys by prefix rather than a hardcoded list, so a 7th tool's
// storage is picked up automatically — no edit needed here when the tool count changes.
//
// spidergraphExport/spidergraphImport are called from index.astro's inline script, a
// separate <script> tag on the same page — not from within this file, so a linter
// running file-by-file can't see the call site. /* exported */ tells eslint's
// no-unused-vars these are this classic script's intentional public surface, same as
// every other shared/*.js file in this project.
/* exported spidergraphExport, spidergraphImport */
function spidergraphBackupKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.indexOf('spidergraph-') === 0) keys.push(k);
  }
  return keys.sort();
}

// Triggers a browser download of every spidergraph-* key as one JSON file. Runs entirely
// client-side — nothing is uploaded, matching every other export button on this site.
// Returns the number of keys written, or 0 if there was nothing to back up.
function spidergraphExport() {
  const keys = spidergraphBackupKeys();
  if (keys.length === 0) return 0;
  const data = {};
  keys.forEach((k) => {
    try {
      data[k] = localStorage.getItem(k);
    } catch {
      /* skip unreadable key */
    }
  });
  const payload = {
    spidergraphBackup: 1,
    exportedAt: new Date().toISOString(),
    data,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `spidergraph-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return keys.length;
}

// Reads a File (from an <input type=file>), validates it's a Spidergraph backup, and
// writes every key back into localStorage. Only ever writes keys already prefixed
// "spidergraph-" found inside the file's own data object — a tampered or unrelated JSON
// file can't be used to inject arbitrary localStorage keys onto this origin. Returns a
// Promise resolving to the number of keys restored; rejects with a human-readable Error
// on anything malformed.
function spidergraphImport(file) {
  return file.text().then((text) => {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      throw new Error("That file isn't valid JSON.", { cause: e });
    }
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !parsed.data ||
      typeof parsed.data !== 'object'
    ) {
      throw new Error("That doesn't look like a Spidergraph backup file.");
    }
    let written = 0;
    Object.keys(parsed.data).forEach((k) => {
      if (k.indexOf('spidergraph-') !== 0) return; // ignore anything outside our namespace
      const v = parsed.data[k];
      if (typeof v !== 'string') return;
      try {
        localStorage.setItem(k, v);
        written++;
      } catch {
        /* storage unavailable */
      }
    });
    if (written === 0)
      throw new Error(
        "That file didn't contain any Spidergraph data to restore.",
      );
    return written;
  });
}
