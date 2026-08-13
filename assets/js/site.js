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

/* prototype enquiry form */
var enquiryForm = document.getElementById('enquiry');
if (enquiryForm) enquiryForm.addEventListener('submit', function(e){
  e.preventDefault();
  var s = document.getElementById('formStatus');
  var name = document.getElementById('f-name').value.trim();
  s.textContent = (name ? 'Thanks ' + name + ' -- in' : 'In') +
    ' the built site this would reach the regional manager for your state. Nothing was sent from this prototype.';
  s.hidden = false;
});

lightInView();
startPump();