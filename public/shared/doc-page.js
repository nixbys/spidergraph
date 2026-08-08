// Shared behavior for the two markdown-rendering pages (playbook/, report/).
//
// 2026-08-05 Astro migration: markdown now compiles to HTML at BUILD time (see
// src/pages/playbook/index.astro / report/index.astro, which import `marked` as an npm
// dependency and render server-side) instead of being fetched and parsed client-side.
// That means the "must be served over HTTP, not opened as a file://" caveat this file used
// to guard against no longer applies — #content already has its final HTML when this script
// runs. This file now only builds the section-jump dropdown and wires the scroll-to-top
// button; it no longer fetches or calls marked.parse() itself.
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

  buildSectionJump();

  const scrollBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  }, {passive:true});
  scrollBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
})();
