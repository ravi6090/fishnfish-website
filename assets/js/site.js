document.documentElement.classList.add('js');
/* ============================== REVEAL ==============================
   A plain viewport sweep rather than an IntersectionObserver: the observer
   can be throttled or skip a re-delivery when a node goes display:none and
   back, which would leave a whole page stuck at opacity 0. This cannot. */
function lightInView(){
  var root = document;
  var els = root.querySelectorAll('.rv:not(.is-lit)');
  var n = 0, vh = window.innerHeight;
  Array.prototype.forEach.call(els, function(e){
    var b = e.getBoundingClientRect();
    if(b.top < vh * 0.94 && b.bottom > 0){
      setTimeout(function(){ e.classList.add('is-lit'); }, Math.min(n, 6) * 70);
      n++;
    }
  });
  return !root.querySelector('.rv:not(.is-lit)');
}

/* Scroll events are the fast path, but some embedded webviews never fire
   them. This poll is the guarantee that content always appears; it stops
   itself as soon as the page is fully revealed. */
var pumpTimer = null;
function startPump(){
  if(pumpTimer) clearInterval(pumpTimer);
  pumpTimer = setInterval(function(){
    if(lightInView()){ clearInterval(pumpTimer); pumpTimer = null; }
  }, 250);
}

/* elements the menu needs; the router that used to declare these is gone */
var head = document.querySelector('.site-head');
var menuBtn = document.getElementById('menuBtn');
/* mobile nav */
menuBtn.addEventListener('click', function(){
  var open = head.classList.toggle('is-open');
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});

/* in-page scroll (the trade CTA jumps to the contact block below it) */
document.addEventListener('click', function(e){
  var t = e.target.closest ? e.target.closest('[data-scrollto]') : null;
  if(!t) return;
  var dest = document.getElementById(t.getAttribute('data-scrollto'));
  if(!dest) return;
  var from = window.scrollY;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  try { dest.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'start'}); }
  catch(err) { dest.scrollIntoView(true); }
  // some webviews ignore smooth scrolling entirely -- make sure we still land
  setTimeout(function(){
    if(Math.abs(window.scrollY - from) < 4){
      window.scrollTo(0, dest.getBoundingClientRect().top + window.scrollY);
    }
  }, 400);
});

/* enquiry form: posts to whatever the form's own action says, so swapping
   provider is a one-line change in the HTML. Submits over fetch so the visitor
   stays on the page; if that fails they get a real fallback rather than silence.
   Without JS the form still posts natively and lands on thank-you.html. */
var enquiryForm = document.getElementById('enquiry');
if (enquiryForm) enquiryForm.addEventListener('submit', function(e){
  if (!enquiryForm.checkValidity()) return;   // let the browser show its own messages
  e.preventDefault();
  var status = document.getElementById('formStatus');
  var btn    = enquiryForm.querySelector('button[type="submit"]');
  var label  = btn.innerHTML;
  var endpoint = enquiryForm.getAttribute('action').replace('formsubmit.co/', 'formsubmit.co/ajax/');

  btn.disabled = true;
  btn.innerHTML = 'Sending\u2026';
  status.hidden = false;
  status.className = 'form-status';
  status.textContent = 'Sending your enquiry\u2026';

  fetch(endpoint, {
    method: 'POST',
    headers: {'Accept': 'application/json'},
    body: new FormData(enquiryForm)
  })
  .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(function(){
    enquiryForm.reset();
    status.textContent = 'Thank you \u2014 your enquiry is with us. '
      + 'The regional manager for your state will come back to you within one working day.';
  })
  .catch(function(){
    status.className = 'form-status form-status--error';
    status.innerHTML = 'That did not send. Please email '
      + '<a href="mailto:map@mulpuri.org">map@mulpuri.org</a> or call '
      + '<a href="tel:+917799456456">+91 77 99 456 456</a> and we will pick it up from there.';
  })
  .then(function(){ btn.disabled = false; btn.innerHTML = label; });
});

lightInView();
startPump();