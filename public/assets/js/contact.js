/* The contact form — the same flow as basilicalabs.ai/contact.
 * Sends through FormSubmit to the studio inbox. If the service is blocked or
 * refuses the message, it opens the visitor's mail app with the message
 * pre-filled, so an enquiry is never lost. A honeypot field catches bots.
 */
(function(){
  var form = document.getElementById('contactForm');
  var statusEl = document.getElementById('formStatus');
  var sendBtn = document.getElementById('sendBtn');
  if(!form) return;

  var INBOX = 'fid_kk@proton.me';
  var TAG = 'Website Design';

  function setStatus(msg, kind){
    statusEl.textContent = msg;
    statusEl.className = 'form-status' + (kind ? ' ' + kind : '');
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();

    // access fields explicitly (form.name would collide with the form's own .name property)
    var nameEl = document.getElementById('cName');
    var emailEl = document.getElementById('cEmail');
    var messageEl = document.getElementById('cMessage');
    var honeyEl = document.getElementById('cWebsite');

    // basic client-side validation
    var name = nameEl.value.trim();
    var email = emailEl.value.trim();
    var message = messageEl.value.trim();
    if(!name || !email || !message){
      setStatus('Please fill in your name, email and message.', 'err');
      return;
    }
    // honeypot tripped → silently pretend success
    if(honeyEl && honeyEl.value){
      setStatus('Thanks — your message has been sent.', 'ok');
      form.reset();
      return;
    }

    var data = new FormData(form);
    data.append('_subject', TAG + ' — message from ' + name);
    data.append('_captcha', 'false');
    data.append('_template', 'box');

    sendBtn.disabled = true;
    setStatus('Sending…');

    // If the form service can't be reached (ad blockers and Brave shields
    // often block it) fall back to opening the visitor's mail app with the
    // message pre-filled — the message still reaches the inbox either way.
    function mailFallback(reason){
      var subject = (document.getElementById('cSubject').value.trim() || TAG + ' — message from ' + name);
      var body = 'From: ' + name + ' <' + email + '>\n\n' + message;
      setStatus(reason + ' Opening your mail app with the message pre-filled…', 'err');
      window.location.href = 'mailto:' + INBOX + '?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    }

    fetch('https://formsubmit.co/ajax/' + INBOX, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    })
    .then(function(res){ return res.json().catch(function(){ return {}; }).then(function(j){ return { ok: res.ok, body: j }; }); })
    .then(function(r){
      var msg = r.body && (r.body.message || r.body.error);
      if(r.ok && String(r.body.success) !== 'false'){
        setStatus('Thanks — your message has been sent.', 'ok');
        form.reset();
      } else if(msg && /activat/i.test(msg)){
        // FormSubmit sends a one-time activation email to the inbox first
        setStatus('Nearly there — the form service has emailed the site owner a one-time activation link.', 'err');
      } else {
        mailFallback('The form service didn’t accept the message.');
      }
    })
    .catch(function(){
      mailFallback('The form service was blocked or unreachable.');
    })
    .then(function(){ sendBtn.disabled = false; });
  });
})();
