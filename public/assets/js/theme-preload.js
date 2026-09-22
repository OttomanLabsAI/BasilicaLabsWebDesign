/* Runs in <head> before first paint: restores a saved dark theme so the page
   never flashes light first. Same key as basilicalabs.ai ('ol-theme'). */
(function(){try{var t=localStorage.getItem('ol-theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();
