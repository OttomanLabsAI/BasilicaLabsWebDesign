/* The light/dark toggle in the masthead, wired exactly as on basilicalabs.ai
 * (assets/site-header.js there): persists to localStorage 'ol-theme',
 * exposes window.__setTheme(mode) and window.__theme, and dispatches
 * 'themechange' so any script can re-read the colour tokens.
 */
(function(){
  "use strict";

  var root = document.documentElement;
  var btn = document.getElementById('themeToggle');
  var lbl = document.getElementById('themeLabel');
  if(!btn || !lbl) return;

  window.__setTheme = function(mode){
    var dark = (mode === 'dark');
    if(dark) root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    lbl.textContent = dark ? 'Light' : 'Dark';
    window.__theme = dark ? 'dark' : 'light';
    try { localStorage.setItem('ol-theme', window.__theme); } catch(e){}
    window.dispatchEvent(new Event('themechange'));
  };

  var saved = false;
  try { saved = localStorage.getItem('ol-theme') === 'dark'; } catch(e){}
  window.__setTheme(saved ? 'dark' : 'light');

  btn.addEventListener('click', function(){
    window.__setTheme(window.__theme === 'dark' ? 'light' : 'dark');
  });
})();
