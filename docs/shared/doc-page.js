// Shared behavior for the two markdown-rendering pages (playbook/, report/):
// fetches the page's source .md (from #content's data-src attribute), renders it
// via marked.js, builds the section-jump dropdown, and wires the scroll-to-top button.
//
// IMPORTANT: marked.js must already be loaded (non-deferred, in <head>) before this
// script runs, and this script itself must not be deferred — it must execute inline,
// after #content exists in the DOM, same as the code it replaces. See the marked.js
// defer gotcha noted in CLAUDE.md / project memory.
(function(){
  function slugify(text){
    return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function buildSectionJump(){
    const headings = document.querySelectorAll('#content h1, #content h2');
    const seen = {};
    const jumpSel = document.getElementById('sectionJump');
    headings.forEach(h => {
      let slug = slugify(h.textContent) || 'section';
      if(seen[slug] !== undefined){ seen[slug]++; slug = `${slug}-${seen[slug]}`; } else { seen[slug] = 0; }
      h.id = slug;
      if(h.tagName === 'H2'){
        const opt = document.createElement('option');
        opt.value = '#' + slug;
        opt.textContent = h.textContent;
        jumpSel.appendChild(opt);
      }
    });
    jumpSel.addEventListener('change', () => {
      if(!jumpSel.value) return;
      const target = document.querySelector(jumpSel.value);
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
      jumpSel.value = '';
    });
  }

  const contentEl = document.getElementById('content');
  const src = contentEl.getAttribute('data-src');

  fetch(src)
    .then(r => { if(!r.ok) throw new Error('fetch failed'); return r.text(); })
    .then(md => { contentEl.innerHTML = marked.parse(md); buildSectionJump(); })
    .catch(() => {
      contentEl.innerHTML =
        '<div class="loading">Could not load ' + src.split('/').pop() + ' — this page needs to be served over HTTP (e.g. GitHub Pages or a local server), not opened directly as a file.</div>';
    });

  const scrollBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  }, {passive:true});
  scrollBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
})();
