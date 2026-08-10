// Spidergraph localStorage helper — shared by every stateful interactive tool.
// One tiny wrapper instead of each tool hand-rolling its own try/catch boilerplate
// (see CLAUDE.md "Local persistence — all six interactive tools use it" — three tools
// repeating the same ~10-line pattern was tolerable, a fourth was the documented
// trigger to extract this).
//
// save(data) wraps whatever shape a tool's own state is in with a lastUpdated
// timestamp, so "audited N days ago" (the homepage summary, and each tool's own
// UI) doesn't need every tool to track that separately. load() returns the whole
// {data, lastUpdated} envelope, or null if nothing's saved / storage is blocked.
// Every method fails soft — private browsing or a blocked localStorage should
// degrade to "state doesn't persist," never a thrown error that breaks the page.
//
// Called from every tool page's own inline <script> tag, not from within this file —
// /* exported */ tells eslint's no-unused-vars this classic script's function is
// meant to be used as a global by whatever loads it next, not dead code.
/* exported spidergraphStore */
function spidergraphStore(key) {
  return {
    load() {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    },
    save(data) {
      try {
        localStorage.setItem(
          key,
          JSON.stringify({ data, lastUpdated: new Date().toISOString() }),
        );
      } catch {
        /* storage unavailable — in-memory state for this tab still works */
      }
    },
    clear() {
      try {
        localStorage.removeItem(key);
      } catch {
        /* storage unavailable */
      }
    },
  };
}
