// Spidergraph top nav — scroll-fade affordance, shared across every page.
// Toggles can-scroll-left/can-scroll-right on .topnav so the ::before/::after
// gradients in shared/nav.css only show when there's more nav to scroll to.
(function(){
  document.querySelectorAll('.topnav').forEach(function(nav){
    var inner = nav.querySelector('.topnav-inner');
    if(!inner) return;
    function update(){
      var overflowing = inner.scrollWidth > inner.clientWidth + 2;
      var atStart = inner.scrollLeft <= 2;
      var atEnd = inner.scrollLeft + inner.clientWidth >= inner.scrollWidth - 2;
      nav.classList.toggle('can-scroll-left', overflowing && !atStart);
      nav.classList.toggle('can-scroll-right', overflowing && !atEnd);
    }
    inner.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update);
    update();
  });
})();
