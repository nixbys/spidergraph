import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Spidergraph's public/shared/*.js files are plain classic browser scripts (no
// import/export — see each file's own header comment for why) loaded via <script src>
// tags, whose top-level function declarations become globals for whichever is:inline
// script runs after them on the same page. Running one in a real Node vm context —
// rather than rewriting it as an ES module just so tests can `import` it — exercises
// the exact same code the browser runs, and top-level `function foo(){}` declarations
// attach to the vm context object the same way they'd attach to `window` in a browser.
//
// These files have zero DOM/localStorage dependencies (verified by their own header
// comments — see stack-builder-scoring.js and opsec-scoring.js), so an empty context
// is sufficient; nothing here needs jsdom.
//
// `relativePath` resolves against THIS file's own location (test/helpers/), not the
// caller's — e.g. '../../public/shared/foo.js', not '../public/shared/foo.js'.
export function loadClassicScript(relativePath) {
  const code = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
  const context = {};
  vm.createContext(context);
  vm.runInContext(code, context);
  return context;
}
