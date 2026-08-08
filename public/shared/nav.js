// Spidergraph top nav — shared across every page.
// The "Tools" dropdown (.nav-tools, a native <details>/<summary>) gets its open/close
// toggle and keyboard support for free from the browser. This just adds the two things
// <details> doesn't do on its own: close when you click outside it, and close on Escape.
(function(){
  var toolsMenus = document.querySelectorAll('.nav-tools');
  if(!toolsMenus.length) return;

  function closeAll(except){
    toolsMenus.forEach(function(menu){
      if(menu !== except) menu.removeAttribute('open');
    });
  }

  document.addEventListener('click', function(e){
    toolsMenus.forEach(function(menu){
      if(menu.hasAttribute('open') && !menu.contains(e.target)) menu.removeAttribute('open');
    });
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeAll();
  });

  // Only one .nav-tools per page today, but if that ever changes, opening one should
  // close the others rather than stacking multiple panels.
  toolsMenus.forEach(function(menu){
    menu.addEventListener('toggle', function(){
      if(menu.hasAttribute('open')) closeAll(menu);
    });
  });
})();
