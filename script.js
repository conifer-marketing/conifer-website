(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* nav scrolled state */
  var nav = document.getElementById('nav');
  var onScroll = function(){ nav.classList.toggle('scrolled', window.scrollY > 20); };
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  /* mobile menu */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function(){
    var open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', function(e){
    if(e.target.classList.contains('nav-link')){
      links.classList.remove('open'); toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    }
  });

  /* product tabs */
  var panel = document.querySelector('.products .panel');
  if(panel){
    panel.querySelector('.tab-nav').addEventListener('click', function(e){
      var btn = e.target.closest('.tab'); if(!btn) return;
      var key = btn.dataset.tab;
      panel.querySelectorAll('.tab').forEach(function(t){ t.classList.remove('active'); });
      panel.querySelectorAll('.pane').forEach(function(p){ p.classList.remove('active'); });
      btn.classList.add('active');
      var pane = panel.querySelector('.pane[data-pane="'+key+'"]');
      if(pane) pane.classList.add('active');
    });
  }

  /* scroll reveal */
  var rev = document.querySelectorAll('.reveal:not(.in)');
  if('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});
    rev.forEach(function(el){ io.observe(el); });
  } else { rev.forEach(function(el){ el.classList.add('in'); }); }

  /* count-up on scroll */
  function count(el){
    var t = parseFloat(el.dataset.count), p = el.dataset.prefix||'', s = el.dataset.suffix||'';
    if(reduce){ el.textContent = p + t.toLocaleString() + s; return; }
    var dur = 1500, st = performance.now();
    (function tick(now){
      var k = Math.min((now-st)/dur,1), e = 1-Math.pow(1-k,3);
      el.textContent = p + Math.round(t*e).toLocaleString() + s;
      if(k<1) requestAnimationFrame(tick);
    })(st);
  }
  var done = new WeakSet();
  if('IntersectionObserver' in window){
    var c = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting && !done.has(e.target)){ done.add(e.target); count(e.target); c.unobserve(e.target); } });
    }, {threshold:.6});
    document.querySelectorAll('[data-count]').forEach(function(el){ c.observe(el); });
  } else {
    document.querySelectorAll('[data-count]').forEach(function(el){ count(el); });
  }

  /* form (front-end only — wire to your real endpoint) */
  var form = document.getElementById('motorForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!form.checkValidity()){ form.reportValidity(); return; }
      document.getElementById('formNote').classList.add('ok');
      form.reset();
    });
  }
})();
