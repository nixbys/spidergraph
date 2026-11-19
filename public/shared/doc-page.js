// Shared behavior for the two markdown-rendering pages (playbook/, report/).
//
// 2026-08-05 Astro migration: markdown now compiles to HTML at BUILD time (see
// src/pages/playbook/index.astro / report/index.astro, which import `marked` as an npm
// dependency and render server-side) instead of being fetched and parsed client-side.
// That means the "must be served over HTTP, not opened as a file://" caveat this file used
// to guard against no longer applies — #content already has its final HTML when this script
// runs. This file now only builds the section-jump dropdown and wires the scroll-to-top
// button; it no longer fetches or calls marked.parse() itself.
(function () {
  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function buildSectionJump() {
    // h3s get ids too, so each runbook can be linked (playbook/#runbook-h-…).
    const headings = document.querySelectorAll(
      '#content h1, #content h2, #content h3',
    );
    const seen = {};
    const jumpSel = document.getElementById('sectionJump');
    // The runbooks are the Playbook's most-used part but sit at the end of a long
    // page, so they get their own group in the menu rather than only their section.
    let runbooks = null;
    headings.forEach((h) => {
      let slug = slugify(h.textContent) || 'section';
      if (seen[slug] !== undefined) {
        seen[slug]++;
        slug = `${slug}-${seen[slug]}`;
      } else {
        seen[slug] = 0;
      }
      h.id = slug;
      const isRunbook = h.tagName === 'H3' && /^Runbook /.test(h.textContent);
      if (h.tagName !== 'H2' && !isRunbook) return;
      const opt = document.createElement('option');
      opt.value = '#' + slug;
      if (isRunbook) {
        if (!runbooks) {
          runbooks = document.createElement('optgroup');
          runbooks.label = 'Incident runbooks';
        }
        // "Runbook H: Stuck Account (…)" → "H: Stuck Account" keeps the menu narrow.
        opt.textContent = h.textContent
          .replace(/^Runbook /, '')
          .replace(/\s*\(.*$/, '');
        runbooks.appendChild(opt);
      } else {
        opt.textContent = h.textContent;
        jumpSel.appendChild(opt);
      }
    });
    if (runbooks) jumpSel.appendChild(runbooks);
    jumpSel.addEventListener('change', () => {
      if (!jumpSel.value) return;
      const target = document.querySelector(jumpSel.value);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      jumpSel.value = '';
    });
    // The ids only exist now, after the browser's own jump to the URL's #fragment
    // already failed, so a shared link to a runbook or section needs this.
    if (location.hash) {
      let target = null;
      try {
        target = document.querySelector(decodeURIComponent(location.hash));
      } catch {
        /* not a valid selector: stay at the top */
      }
      if (target) target.scrollIntoView({ block: 'start' });
    }
  }

  buildSectionJump();

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
})();
