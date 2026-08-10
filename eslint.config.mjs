// Flat ESLint config (ESLint 9+/10 default). Deliberately minimal: this project's own
// stated philosophy (CLAUDE.md) is plain HTML/CSS/vanilla JS with no framework beyond
// Astro itself, so this isn't trying to impose a large rule set — just the class of
// bug that's cheap to catch mechanically (unused vars, undefined globals, accidental
// var, etc.) and that the repo-wide var/let cleanup already established as this
// project's actual style.
import js from '@eslint/js';
import astro from 'eslint-plugin-astro';

const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  localStorage: 'readonly',
  console: 'readonly',
  URL: 'readonly',
  Blob: 'readonly',
  navigator: 'readonly',
  alert: 'readonly',
  confirm: 'readonly',
  FileReader: 'readonly',
};

const sharedRules = {
  'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  'no-var': 'error',
  'prefer-const': 'warn',
};

export default [
  js.configs.recommended,
  // `flat/recommended`, not `recommended` — the latter is the old eslintrc-style
  // export (a single config object, not an array of flat-config objects); spreading
  // it here silently produces garbage entries instead of an error, which is exactly
  // what broke .astro frontmatter parsing (interface/`as` TS syntax) the first time
  // this config was written. `flat/recommended` is what actually wires up
  // astro-eslint-parser + the TS parser for frontmatter, and lints each <script>
  // block in a page as its own virtual file.
  ...astro.configs['flat/recommended'],
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**'],
  },
  {
    // public/shared/*.js — the classic, unbundled browser scripts (no import/export)
    // that DEFINE spidergraphStore/spidergraphHistory/spidergraphExport/
    // spidergraphImport/classifyStatus/isCovered/coveragePercent/computeReadiness as
    // globals via /* exported */ comments (see each file). They must NOT also have
    // those names declared as pre-existing globals here — that's exactly what a
    // no-redeclare ("already defined as a built-in global") error is catching if you
    // get this wrong, which happened once while writing this config.
    files: ['public/shared/*.js'],
    languageOptions: { sourceType: 'script', globals: browserGlobals },
    rules: sharedRules,
  },
  {
    // The virtual per-<script>-block files eslint-plugin-astro extracts from every
    // .astro page — also classic browser scripts, no import/export (every tool page's
    // main script is deliberately is:inline; see the header comments in
    // public/shared/stack-builder-scoring.js and opsec-scoring.js for the two things
    // that were tried and reverted before landing on that). These are *.ts files, not
    // *.js: eslint-plugin-astro routes every <script> block in a .astro file through
    // its TS processor regardless of whether the block actually uses TS syntax
    // (confirmed via `DEBUG=eslint:linter` — it names them `<page>.astro/<n>_<n>.ts`);
    // a `*.js`-only glob here silently matches nothing.
    //
    // Every global below is CONSUMED here, defined by a sibling <script src> tag on
    // the same page (see CLAUDE.md's "Local persistence" / "Snapshot history" /
    // "Backup & Restore" sections, plus the two scoring files' own header comments,
    // for which page loads which). A per-block linter can't see that on its own, so
    // it's declared explicitly rather than producing false no-undef errors. `base`
    // (index.astro's own script, via Astro's define:vars={{ base }} directive) does
    // NOT need declaring here — eslint-plugin-astro already recognizes define:vars
    // bindings itself; adding it manually caused a no-redeclare conflict against its
    // own detection.
    files: ['**/*.astro/*.js', '**/*.astro/*.ts'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        ...browserGlobals,
        spidergraphStore: 'readonly',
        spidergraphHistory: 'readonly',
        spidergraphExport: 'readonly',
        spidergraphImport: 'readonly',
        classifyStatus: 'readonly',
        isCovered: 'readonly',
        coveragePercent: 'readonly',
        computeReadiness: 'readonly',
      },
    },
    rules: sharedRules,
  },
  {
    // test/**/*.js runs under Node (via Vitest), not a browser — real ES modules
    // (import/export, the flat-config default sourceType already handles that), but
    // needing Node's globals rather than browserGlobals above.
    files: ['test/**/*.js'],
    languageOptions: {
      globals: { process: 'readonly', URL: 'readonly', console: 'readonly' },
    },
    rules: sharedRules,
  },
];
