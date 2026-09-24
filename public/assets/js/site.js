/* FKarim Web Design: the page's small amount of behaviour.
 * Everything is progressive: with no script, every section is visible, the
 * first showcase site shows, and the brief form falls back to email links.
 */
(function(){
  "use strict";
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── header: a firmer edge once the page scrolls ── */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function(){ header.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── hero showcase: the recent sites, shown in turn ── */
  var showcase = document.querySelector('.showcase');
  if (showcase) {
    var slides = showcase.querySelectorAll('.screen img');
    var urlEl = showcase.querySelector('[data-url]');
    var dotsBox = showcase.querySelector('.slide-dots');
    var dots = dotsBox ? dotsBox.querySelectorAll('button') : [];
    var current = 0, timer = null, urlTimer = null;

    var show = function(n){
      current = (n + slides.length) % slides.length;
      for (var k = 0; k < slides.length; k++) slides[k].classList.toggle('on', k === current);
      for (var d = 0; d < dots.length; d++) dots[d].setAttribute('aria-current', d === current ? 'true' : 'false');
      // the address bar changes halfway through the crossfade, as the new site appears
      if (urlEl) {
        clearTimeout(urlTimer);
        urlTimer = setTimeout(function(){ urlEl.textContent = slides[current].getAttribute('data-url'); }, reduceMotion ? 0 : 400);
      }
    };
    var stop = function(){ if (timer) { clearInterval(timer); timer = null; } };
    var start = function(){ stop(); if (!reduceMotion && slides.length > 1) timer = setInterval(function(){ show(current + 1); }, 4200); };

    if (slides.length > 1 && dotsBox) {
      dotsBox.hidden = false;
      Array.prototype.forEach.call(dots, function(btn, k){
        btn.addEventListener('click', function(){ show(k); start(); });
      });
      showcase.addEventListener('mouseenter', stop);
      showcase.addEventListener('mouseleave', start);
      showcase.addEventListener('focusin', stop);
      showcase.addEventListener('focusout', start);
      document.addEventListener('visibilitychange', function(){ if (document.hidden) stop(); else start(); });
      start();
    }
  }

  /* ── reveal on scroll: only for sections still below the fold ── */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (!reduceMotion && 'IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    Array.prototype.forEach.call(revealEls, function(el){
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('pre'); io.observe(el); }
    });
  }

  /* ── the brief form: FormSubmit to the inbox, email as the fallback.
     Without this script the form still posts to FormSubmit directly. ── */
  var form = document.getElementById('brief');
  if (form) {
    var INBOX = 'fid_kk@proton.me';
    var statusEl = document.getElementById('fStatus');
    var sendBtn = document.getElementById('fSend');
    var field = function(id){ return document.getElementById(id); };
    var setStatus = function(msg, kind){
      statusEl.textContent = msg;
      statusEl.className = 'form-status' + (kind ? ' ' + kind : '');
    };

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var business = field('fBusiness').value.trim();
      var name = field('fName').value.trim();
      var email = field('fEmail').value.trim();
      var site = field('fSite').value.trim();
      var more = field('fMore').value.trim();

      var missing = [];
      if (!business && !site) missing.push('a line about your business or the link to your site');
      if (!name) missing.push('your name');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) missing.push('an email address');
      if (missing.length) {
        setStatus('Please add ' + missing.join(', ').replace(/, ([^,]*)$/, ' and $1') + '.', 'err');
        (!business && !site ? field('fBusiness') : !name ? field('fName') : field('fEmail')).focus();
        return;
      }
      // honeypot filled: a bot, so pretend all is well
      if (field('fHoney').value) { setStatus('Thanks, your brief is on its way.', 'ok'); form.reset(); return; }

      var data = new FormData(form);
      data.set('_subject', 'Website brief from ' + name + ': ' + (business || site).slice(0, 60));
      data.set('_captcha', 'false');
      data.set('_template', 'table');

      var mailFallback = function(reason){
        var body = (business ? 'Business: ' + business : 'Rebuild my site') +
          (site ? '\nCurrent website: ' + site : '') + (more ? '\n\n' + more : '') +
          '\n\nFrom: ' + name + ' <' + email + '>';
        setStatus(reason + ' Opening your email app with the brief filled in…', 'err');
        window.location.href = 'mailto:' + INBOX + '?subject=' + encodeURIComponent('Website brief from ' + name) +
          '&body=' + encodeURIComponent(body);
      };

      sendBtn.disabled = true;
      setStatus('Sending your brief…');
      fetch('https://formsubmit.co/ajax/' + INBOX, { method: 'POST', headers: { 'Accept': 'application/json' }, body: data })
        .then(function(res){ return res.json().catch(function(){ return {}; }).then(function(j){ return { ok: res.ok, body: j }; }); })
        .then(function(r){
          var msg = r.body && (r.body.message || r.body.error);
          if (r.ok && String(r.body.success) !== 'false') {
            setStatus('Thanks, ' + name.split(' ')[0] + '. Your brief is in, and your preview is on its way.', 'ok');
            form.reset();
          } else if (msg && /activat/i.test(msg)) {
            // the form service is waiting on its one-time confirmation: send by email so nothing is lost
            mailFallback('The form isn’t switched on yet.');
          } else {
            mailFallback('The form service didn’t accept the brief.');
          }
        })
        .catch(function(){ mailFallback('The form service couldn’t be reached.'); })
        .then(function(){ sendBtn.disabled = false; });
    });
  }
})();
