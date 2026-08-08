import { defineConfig } from 'astro/config';

// Deployed to GitHub Pages as a project site: https://nixbys.github.io/spidergraph/
// `base` is why every internal link in src/ uses `${import.meta.env.BASE_URL}...`
// instead of hand-tracked `../` chains — that's the whole point of this migration
// (see CLAUDE.md "Site navigation" and SESSION-NOTES.md for the full history). If this
// ever moves to a custom domain serving from the root, this is the one line that needs
// to change (base would become '/' or be removed).
export default defineConfig({
  site: 'https://nixbys.github.io',
  base: '/spidergraph',
  trailingSlash: 'always',
  outDir: './dist',
  build: {
    format: 'directory',
  },
});
