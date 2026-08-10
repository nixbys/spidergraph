// Spidergraph snapshot history — shared by every interactive tool's "Save snapshot" button.
// Separate from shared/persist.js on purpose: persist.js is the live auto-save (always the
// current state, overwritten on every change); this is an explicit, user-triggered, dated
// checkpoint list ("your coverage 3 months ago vs. now" — see SESSION-NOTES.md's roadmap).
// Each snapshot is a fully self-contained {date, summary, data} object — no snapshot depends
// on another's shape, so there's no cross-snapshot migration to get wrong later, only the
// same saved.data-shape handling every tool's live load path already does.
// Called from every tool page's own inline <script> tag, not from within this file —
// see the same /* exported */ note in shared/persist.js.
/* exported spidergraphHistory */
function spidergraphHistory(key, maxSnapshots) {
  maxSnapshots = maxSnapshots || 12; // ~3 years of quarterly saves before the oldest rolls off
  const historyKey = key + '-history-v1';
  return {
    list() {
      try {
        const raw = localStorage.getItem(historyKey);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    },
    save(summary, data) {
      let snapshots = this.list();
      snapshots.push({
        date: new Date().toISOString(),
        summary: summary,
        data: data,
      });
      if (snapshots.length > maxSnapshots)
        snapshots = snapshots.slice(snapshots.length - maxSnapshots);
      try {
        localStorage.setItem(historyKey, JSON.stringify(snapshots));
      } catch {
        /* storage unavailable */
      }
      return snapshots;
    },
    clear() {
      try {
        localStorage.removeItem(historyKey);
      } catch {
        /* storage unavailable */
      }
    },
  };
}
