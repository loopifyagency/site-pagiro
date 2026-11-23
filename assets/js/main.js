/* ==========================================================================
   PAGIRO — comportement et animations (GSAP + ScrollTrigger + Lenis)
   Règles : on n'anime que transform/opacity (plus quelques masques clip-path),
   courbes en expo/power, décalages entre éléments, version allégée sur mobile,
   et aucune animation si prefers-reduced-motion est actif.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = root.classList.contains('reduced');
  var hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var lenis = null;

  /* ------------------------------------------------------------------
     Horaires : pastille « ouvert / fermé » et ligne du jour
     ------------------------------------------------------------------ */
  var SCHEDULE = { 0: null, 1: [[9, 30], [18, 30]], 2: [[8, 30], [18, 30]], 3: null, 4: [[8, 30], [18, 30]], 5: [[8, 30], [18, 30]], 6: [[8, 30], [15, 0]] };
  var DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  var EN = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  function fmt(t) { return t[0] + 'h' + (t[1] ? String(t[1]).padStart(2, '0') : ''); }

  function parisNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
      var o = {};
      parts.forEach(function (p) { o[p.type] = p.value; });
      return { day: EN[o.weekday], min: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function initStatus() {
    function update() {
      var now = parisNow();
      var today = SCHEDULE[now.day];
      var open = false, text = '';
      if (today) {
        var o = today[0][0] * 60 + today[0][1], c = today[1][0] * 60 + today[1][1];
        if (now.min >= o && now.min < c) { open = true; text = 'Ouvert · jusqu’à ' + fmt(today[1]); }
      }
      if (!open) {
        for (var k = 0; k < 8; k++) {
          var d = (now.day + k) % 7, s = SCHEDULE[d];
          if (!s) continue;
          var start = s[0][0] * 60 + s[0][1];
          if (k === 0 && now.min >= start) continue;
          text = 'Fermé · ouvre ' + (k === 0 ? 'aujourd’hui' : k === 1 ? 'demain' : DAYS[d]) + ' à ' + fmt(s[0]);
          break;
        }
      }
      $$('[data-status]').forEach(function (el) {
        el.classList.toggle('is-open', open);
        var t = $('[data-status-text]', el);
        if (t) t.textContent = text;
      });
      $$('.hours tr').forEach(function (tr) { tr.classList.toggle('is-today', parseInt(tr.dataset.day, 10) === now.day); });
    }
    update();
    setInterval(update, 60000);
  }

  /* ------------------------------------------------------------------
     En-tête, progression, menu, ancres
     ------------------------------------------------------------------ */
  function initChrome() {
    var header = $('[data-header]');
    var bar = $('[data-progress]');
    var last = window.scrollY, ticking = false;

    function onScroll() {
      var y = window.scrollY;
      header.classList.toggle('is-stuck', y > 40);
      if (!root.classList.contains('menu-open')) {
        if (y > last + 6 && y > 240) header.style.translate = '0 -100%';
        else if (y < last - 6 || y < 240) header.style.translate = '';
      }
      last = y;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar && max > 0) bar.style.transform = 'scaleX(' + Math.min(1, y / max).toFixed(4) + ')';
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
    header.style.transition = 'background-color .4s, border-color .4s, translate .6s cubic-bezier(.16,1,.3,1)';

    // Menu mobile
    var burger = $('[data-burger]');
    var menu = $('[data-menu]');
    $$('.menu__nav a', menu).forEach(function (a, i) { a.style.setProperty('--i', i); });
    function setMenu(open) {
      root.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      $('.sr-only', burger).textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
      if (open) { menu.removeAttribute('inert'); header.style.translate = ''; if (lenis) lenis.stop(); }
      else { menu.setAttribute('inert', ''); if (lenis) lenis.start(); }
    }
    burger.addEventListener('click', function () { setMenu(!root.classList.contains('menu-open')); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('menu-open')) { setMenu(false); burger.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth >= 900 && root.classList.contains('menu-open')) setMenu(false); });

    // Ancres : scroll fluide (Lenis) ou natif
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = $(id);
        if (!target) return;
        e.preventDefault();
        var wasOpen = root.classList.contains('menu-open');
        if (wasOpen) setMenu(false);
        var go = function () {
          if (lenis) lenis.scrollTo(target, { offset: id === '#accueil' ? 0 : -8, duration: 1.6, easing: function (t) { return 1 - Math.pow(1 - t, 4); } });
          else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        };
        wasOpen ? setTimeout(go, 450) : go();
      });
    });
    var top = $('[data-top]');
    if (top) top.addEventListener('click', function () {
      if (lenis) lenis.scrollTo(0, { duration: 1.8, easing: function (t) { return 1 - Math.pow(1 - t, 4); } });
      else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
    var yr = $('[data-year]');
    if (yr) yr.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------
     Sélecteur de routine (boutique) — marche aussi sans GSAP
     ------------------------------------------------------------------ */
  function initPicker() {
    var products = [
      { name: 'I Want Body', desc: 'Un après-shampoing léger pour donner du corps aux cheveux, sans les alourdir.', box: [16.2, 14.4] },
      { name: 'Hydrate My Hair', desc: 'Un shampoing riche, nourrissant et hydratant, pensé pour les cheveux normaux à secs.', box: [30.6, 14.6] },
      { name: 'Repair My Hair', desc: 'Un shampoing fortifiant pour les cheveux abîmés, qui les protège aussi de la chaleur.', box: [45.7, 15] },
      { name: 'Smooth Me Now', desc: 'Un shampoing lissant pour dompter les cheveux épais et frisés : adieu les frisottis.', box: [60.7, 23] }
    ];
    var btns = $$('.picker__btn');
    var spot = $('[data-spot]');
    var name = $('[data-pname]'), desc = $('[data-pdesc]');
    if (!btns.length || !spot) return;

    function select(i, instant) {
      var p = products[i];
      btns.forEach(function (b, k) { b.classList.toggle('is-active', k === i); b.setAttribute('aria-pressed', String(k === i)); });
      name.textContent = p.name;
      desc.textContent = p.desc;
      if (hasGSAP && !instant && !reduced) {
        gsap.to(spot, { left: p.box[0] + '%', width: p.box[1] + '%', duration: .9, ease: 'expo.out' });
        gsap.fromTo([name, desc], { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'expo.out', stagger: .07, overwrite: true });
      } else {
        spot.style.left = p.box[0] + '%';
        spot.style.width = p.box[1] + '%';
      }
    }
    btns.forEach(function (b, i) { b.addEventListener('click', function () { select(i); }); });
    select(0, true);
  }

  /* ------------------------------------------------------------------
     Compteurs à rouleaux (une phrase, des chiffres qui défilent)
     ------------------------------------------------------------------ */
  function initOdometers() {
    var rolls = [];
    $$('[data-odo]').forEach(function (el) {
      var value = el.dataset.odo, suffix = el.dataset.suffix || '';
      var sr = document.createElement('span');
      sr.className = 'sr-only';
      sr.textContent = value + suffix + ' ';
      var vis = document.createElement('span');
      vis.setAttribute('aria-hidden', 'true');
      vis.style.display = 'inline-flex';
      el.textContent = '';
      el.appendChild(sr);
      el.appendChild(vis);
      value.split('').forEach(function (ch) {
        if (/\d/.test(ch)) {
          var col = document.createElement('span');
          col.className = 'odo__d';
          var roll = document.createElement('span');
          roll.className = 'odo__roll';
          for (var k = 0; k < 20; k++) { var s = document.createElement('span'); s.textContent = k % 10; roll.appendChild(s); }
          col.appendChild(roll);
          vis.appendChild(col);
          var d = parseInt(ch, 10);
          rolls.push({ el: roll, d: d });
          if (reduced || !hasGSAP) roll.style.transform = 'translateY(' + (-(10 + d) * 5) + '%)';
        } else {
          var sp = document.createElement('span');
          sp.className = 'odo__s';
          sp.textContent = ch;
          vis.appendChild(sp);
        }
      });
      if (suffix) {
        var sf = document.createElement('span');
        sf.className = 'odo__s';
        sf.style.fontWeight = '300';
        sf.textContent = suffix;
        vis.appendChild(sf);
      }
    });
    return rolls;
  }

  /* ------------------------------------------------------------------
     Découpage du texte en mots / lettres (masques qui montent)
     ------------------------------------------------------------------ */
  function splitText(el, mode, label) {
    var words = [], chars = [];
    if (label !== false) el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span');
            w.className = 'w';
            w.setAttribute('aria-hidden', 'true');
            if (mode === 'chars') {
              part.split('').forEach(function (ch) {
                var c = document.createElement('span');
                c.className = 'c';
                c.textContent = ch;
                w.appendChild(c);
                chars.push(c);
              });
            } else {
              var c2 = document.createElement('span');
              c2.className = 'c';
              c2.textContent = part;
              w.appendChild(c2);
            }
            words.push(w);
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR' && !n.classList.contains('pill')) {
          walk(n);
        }
      });
    })(el);
    return { words: words, chars: chars, inner: words.map(function (w) { return w.firstChild; }) };
  }

  /* ------------------------------------------------------------------
     Préchargeur : coup de ciseaux
     ------------------------------------------------------------------ */
  function runLoader() {
    var loader = $('[data-loader]');
    if (!loader || reduced || !hasGSAP) { if (loader) loader.remove(); return Promise.resolve(); }

    var counts = $$('[data-count]', loader);
    var letters = $$('.loader__letters', loader);
    var line = $('.loader__line', loader);
    var sc = $('.loader__scissors', loader);
    var a = $('.sc-a', loader), b = $('.sc-b', loader);
    var top = $('.loader__half--top', loader), bottom = $('.loader__half--bottom', loader);
    var state = { p: 0 };

    gsap.set(letters, { yPercent: 115 });
    gsap.set([a, b], { svgOrigin: '28 18' });

    var hero = $('.mirror--hero img');
    var ready = Promise.race([
      Promise.all([document.fonts && document.fonts.ready, hero && hero.decode ? hero.decode().catch(function () {}) : null]),
      new Promise(function (r) { setTimeout(r, 1600); })
    ]);

    return ready.then(function () {
      return new Promise(function (resolve) {
        var snip = gsap.timeline({ repeat: -1, yoyo: true });
        snip.to(a, { rotation: -11, duration: .13, ease: 'sine.inOut' }, 0).to(b, { rotation: 11, duration: .13, ease: 'sine.inOut' }, 0);

        var tl = gsap.timeline({ onComplete: function () { loader.remove(); } });
        tl.to(letters, { yPercent: 0, duration: 1.15, ease: 'expo.out' }, 0)
          .to(state, {
            p: 100, duration: 1.75, ease: 'power2.inOut',
            onUpdate: function () {
              var v = Math.round(state.p);
              counts.forEach(function (c) { c.textContent = v; });
              var w = window.innerWidth;
              var x = state.p / 100 * (w + 90) - 86;
              gsap.set(sc, { x: x });
              gsap.set(line, { clipPath: 'inset(0 ' + Math.max(0, 100 - (x + 86) / w * 100) + '% 0 0)' });
            }
          }, 0.15)
          .add(function () { snip.kill(); gsap.to([a, b], { rotation: 0, duration: .15 }); }, '>-0.02')
          .to([sc, line], { opacity: 0, duration: .22, ease: 'power2.out' }, '>0.08')
          .addLabel('split', '>0.02')
          .to(top, { yPercent: -101, duration: 1.2, ease: 'expo.inOut' }, 'split')
          .to(bottom, { yPercent: 101, duration: 1.2, ease: 'expo.inOut' }, 'split')
          .add(resolve, 'split+=0.28');
      });
    });
  }

  /* ------------------------------------------------------------------
     Mouvement
     ------------------------------------------------------------------ */
  function initMotion() {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    var rolls = initOdometers();

    // Éléments de départ cachés pendant le préchargeur
    var heroWord = $('.hero__word');
    var heroSplit = splitText(heroWord, 'chars', false);
    var curtain = $('.mirror__curtain');
    var heroImg = $('.mirror--hero img');
    var heroIns = $$('[data-hero-in]');
    var fores = $$('.hero__fore .float');
    var arches = $$('.hero__arches path');
    var header = $('[data-header]');

    gsap.set(heroSplit.chars, { yPercent: 125 });
    gsap.set(heroImg, { scale: 1.38 });
    gsap.set($('.mirror--hero'), { opacity: 0, y: 70 });
    gsap.set(heroIns, { opacity: 0, y: 34 });
    gsap.set(fores, { opacity: 0, scale: .6 });
    gsap.set(arches, { opacity: 0, svgOrigin: '500 1000', scale: .9 });
    gsap.set(header, { yPercent: -110 });
    var glare = $('.mirror--hero .mirror__glare');
    gsap.set(glare, { xPercent: -130, opacity: 1 });

    // Lenis
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({ lerp: .09, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      lenis.stop();
    }
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    buildScrollScenes(rolls);

    runLoader().then(function () {
      var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.to($('.mirror--hero'), { opacity: 1, y: 0, duration: 1.5 }, 0)
        .to(curtain, { yPercent: -101, duration: 1.5, ease: 'expo.inOut' }, 0.05)
        .to(heroImg, { scale: 1.1, duration: 2.4 }, 0.05)
        .to(arches, { opacity: function (i) { return 1; }, scale: 1, duration: 2, stagger: .1 }, 0)
        .to(heroSplit.chars, { yPercent: 0, duration: 1.4, stagger: .07 }, 0.35)
        .to(heroIns, { opacity: 1, y: 0, duration: 1.1, stagger: .12 }, 0.95)
        .to(fores, { opacity: 1, scale: 1, duration: 1.3, stagger: .12, ease: 'back.out(1.6)' }, 1.1)
        .to(header, { yPercent: 0, duration: 1.1 }, 1.0)
        .add(function () {
          if (lenis) lenis.start();
          ScrollTrigger.refresh();
          gsap.to(glare, { xPercent: 130, duration: 1.9, ease: 'power2.inOut', repeat: -1, repeatDelay: 4.2 });
          gsap.to(heroImg, { scale: 1.17, duration: 16, ease: 'sine.inOut', yoyo: true, repeat: -1 });
          heroMouse();
        }, 1.3);
    });
  }

  function heroMouse() {
    if (!fine) return;
    var hero = $('[data-hero]');
    var stage = $('.hero__stage'), title = $('.hero__title');
    var fores = $$('.hero__fore .float');
    var sx = gsap.quickTo(stage, 'x', { duration: 1.2, ease: 'power3.out' });
    var sy = gsap.quickTo(stage, 'y', { duration: 1.2, ease: 'power3.out' });
    var tx = gsap.quickTo(title, 'x', { duration: 1.1, ease: 'power3.out' });
    var fx = fores.map(function (f) { return gsap.quickTo(f, 'x', { duration: 1.4, ease: 'power3.out' }); });
    var fy = fores.map(function (f) { return gsap.quickTo(f, 'y', { duration: 1.4, ease: 'power3.out' }); });
    hero.addEventListener('pointermove', function (e) {
      var nx = e.clientX / window.innerWidth - .5, ny = e.clientY / window.innerHeight - .5;
      sx(nx * -18); sy(ny * -12); tx(nx * 30);
      fores.forEach(function (f, i) { var k = parseFloat(f.dataset.speed || 1); fx[i](nx * 46 * k); fy[i](ny * 36 * k); });
    });
  }

  /* ------------------------------------------------------------------
     Toutes les scènes pilotées par le scroll
     ------------------------------------------------------------------ */
  function buildScrollScenes(rolls) {
    var mm = gsap.matchMedia();

    /* ----- Hero : parallaxe multicouche ----- */
    var hero = $('[data-hero]');
    var st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: .7 };
    gsap.to('[data-layer="bg"]', { yPercent: 14, scale: 1.1, ease: 'none', transformOrigin: '50% 100%', scrollTrigger: st });
    gsap.to('.hero__stage', { yPercent: -7, ease: 'none', scrollTrigger: st });
    gsap.to('.mirror--hero img', { yPercent: 6, ease: 'none', scrollTrigger: st });
    gsap.to('.hero__title', { yPercent: -28, ease: 'none', scrollTrigger: st });
    gsap.to('.hero__foot', { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: { trigger: hero, start: '30% top', end: 'bottom top', scrub: .7 } });
    $$('.hero__fore .float').forEach(function (f) {
      gsap.to(f, { yPercent: -80 * parseFloat(f.dataset.speed || 1), ease: 'none', scrollTrigger: st });
    });

    /* ----- Bandeau : deux lames, vitesse liée au scroll ----- */
    var blades = $('[data-blades]');
    var runners = $$('[data-marquee]').map(function (el) {
      var dir = parseInt(el.dataset.marquee, 10);
      var track = $('.blade__track', el);
      var tween = dir < 0
        ? gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 })
        : gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration: 46, ease: 'none', repeat: -1 });
      return { tween: tween, sign: dir < 0 ? 1 : -1 };
    });
    // les lames « coupent » à l'entrée
    gsap.from('.blade--a', { clipPath: 'inset(0 100% 0 0)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: blades, start: 'top 85%', once: true } });
    gsap.from('.blade--b', { clipPath: 'inset(0 0 0 100%)', duration: 1.4, delay: .15, ease: 'expo.out', scrollTrigger: { trigger: blades, start: 'top 85%', once: true } });
    ScrollTrigger.create({
      trigger: blades, start: 'top bottom', end: 'bottom top',
      onUpdate: function (self) {
        var v = Math.abs(self.getVelocity());
        var boost = 1 + Math.min(v / 280, 6);
        var dir = self.direction;
        runners.forEach(function (r) { gsap.to(r.tween, { timeScale: r.sign * dir * boost, duration: .5, overwrite: true, ease: 'power2.out' }); });
      }
    });

    /* ----- Manifeste : les mots s'allument au scroll ----- */
    var mt = $('[data-words]');
    var ms = splitText(mt, 'words');
    gsap.to(ms.words, { opacity: 1, stagger: .12, ease: 'none', scrollTrigger: { trigger: mt, start: 'top 82%', end: 'bottom 48%', scrub: .6 } });
    $$('[data-pill]').forEach(function (p) {
      gsap.fromTo(p, { width: 0, marginLeft: 0, marginRight: 0 }, { width: '1.7em', marginLeft: '.12em', marginRight: '.12em', ease: 'power2.out', scrollTrigger: { trigger: p.parentNode, start: 'top 80%', end: 'top 45%', scrub: .6 } });
      gsap.from($('img', p), { scale: 1.6, ease: 'none', scrollTrigger: { trigger: p.parentNode, start: 'top 80%', end: 'top 30%', scrub: .6 } });
    });

    /* ----- Révélations d'images : rideau + zoom + parallaxe interne ----- */
    $$('[data-reveal-img]').forEach(function (el) {
      var glass = $('.mirror__glass, .arch-photo', el);
      var frame = $('.mirror, .arch-photo', el);
      var img = $('img', glass);
      var cur = document.createElement('span');
      cur.className = 'curtain';
      cur.setAttribute('aria-hidden', 'true');
      glass.appendChild(cur);
      var gl = $('.mirror__glare', glass);
      if (gl) gsap.set(gl, { xPercent: -130, opacity: 1 });
      var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 82%', once: true } });
      tl.fromTo(frame, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out' }, 0)
        .to(cur, { yPercent: -101, duration: 1.3, ease: 'expo.inOut' }, 0.1);
      if (img) tl.fromTo(img, { scale: 1.32 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.1);
      if (gl) tl.to(gl, { xPercent: 130, duration: 1.8, ease: 'power2.inOut' }, 0.9);
      if (fine && gl) glass.addEventListener('pointerenter', function () {
        if (!gl._busy) { gl._busy = true; gsap.fromTo(gl, { xPercent: -130 }, { xPercent: 130, duration: 1.4, ease: 'power2.inOut', onComplete: function () { gl._busy = false; } }); }
      });
    });
    $$('[data-pimg]').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* ----- Titres et textes : masques qui montent, différents selon la section ----- */
    $$('[data-split="words"]').forEach(function (h) {
      var s = splitText(h, 'words');
      gsap.set(s.inner, { yPercent: 115 });
      ScrollTrigger.create({
        trigger: h, start: 'top 88%', once: true,
        onEnter: function () { gsap.to(s.inner, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: .06 }); }
      });
    });
    $$('[data-fade]').forEach(function (el) {
      gsap.from(el, { y: 36, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });

    /* ----- Rendez-vous pas à pas : section pinnée (desktop) / simple (mobile) ----- */
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', function () {
      var story = $('[data-story]');
      var pin = $('[data-story-pin]');
      var steps = $$('[data-step]');
      var imgs = $$('[data-simg]');
      var n = steps.length;
      var num = $('[data-bignum]');
      var rail = $('.story__rail'), railLine = $('.story__rail-line'), railSc = $('.story__rail-sc');

      gsap.set(steps.slice(1), { autoAlpha: 0 });
      imgs.forEach(function (im, i) { gsap.set(im, { zIndex: i, clipPath: i ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 0% 0%)' }); });
      gsap.set(railSc, { rotation: 90, x: 0 });
      gsap.set(railLine, { clipPath: 'inset(0 100% 0 0)' });

      var state = { i: 0 };
      var tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: story, start: 'top top', end: function () { return '+=' + (n * window.innerHeight * .8); },
          pin: pin, scrub: .8, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: function (self) {
            var idx = Math.min(n - 1, Math.floor(self.progress * n + .12));
            if (idx !== state.i) { state.i = idx; swapNum(idx); }
          }
        }
      });
      function swapNum(i) {
        gsap.fromTo(num, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .7, ease: 'expo.out', overwrite: true });
        num.textContent = '0' + (i + 1);
      }
      for (var i = 0; i < n - 1; i++) {
        var T = i + .62;
        tl.to(steps[i], { yPercent: -14, autoAlpha: 0, duration: .3, ease: 'power2.in' }, T)
          .fromTo(steps[i + 1], { yPercent: 16, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: .36, ease: 'power2.out' }, T + .14)
          .to(imgs[i + 1], { clipPath: 'inset(0% 0% 0% 0%)', duration: .42, ease: 'power2.inOut' }, T)
          .fromTo(imgs[i + 1], { scale: 1.25 }, { scale: 1, duration: .62, ease: 'power2.out' }, T);
      }
      tl.fromTo(railSc, { x: 0 }, { x: function () { return rail.clientWidth - 30; }, duration: n - .4 }, 0)
        .to(railLine, { clipPath: 'inset(0 0% 0 0)', duration: n - .4 }, 0);
    });
    mm.add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', function () {
      $$('[data-step]').forEach(function (s) {
        var fig = $('.step__fig', s);
        gsap.from(s.children, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: s, start: 'top 85%', once: true } });
        if (fig) gsap.from($('img', fig), { scale: 1.3, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: fig, start: 'top 88%', once: true } });
      });
    });

    /* ----- Prestations : défilement horizontal piloté par le scroll (desktop) ----- */
    var arts = $$('.panel__art');
    gsap.set($$('path, circle, rect', $('[data-track]')).filter(function (e) { return e.closest('.panel__art'); }), { strokeDashoffset: 1 });
    function draw(art) {
      gsap.to($$('path, circle, rect', art), { strokeDashoffset: 0, duration: 1.7, ease: 'power2.inOut', stagger: .1 });
    }
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', function () {
      var section = $('[data-services]');
      var pin = $('[data-services-pin]');
      var track = $('[data-track]');
      var bar = $('[data-services-bar]');
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      var tween = gsap.to(track, {
        x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: {
          trigger: section, start: 'top top', end: function () { return '+=' + dist(); }, pin: pin, scrub: .7, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: function (self) { gsap.set(bar, { scaleX: self.progress }); }
        }
      });
      $$('.panel', track).forEach(function (p) {
        var art = $('.panel__art', p);
        if (art) {
          ScrollTrigger.create({ trigger: p, containerAnimation: tween, start: 'left 85%', once: true, onEnter: function () { draw(art); } });
          gsap.fromTo(art, { xPercent: -18 }, { xPercent: 18, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
        }
      });
      // Clavier : quand un lien du rail reçoit le focus, on amène le scroll à sa hauteur
      var onFocus = function (e) {
        pin.scrollLeft = 0;
        var panel = e.target.closest ? e.target.closest('.panel') : null;
        if (!panel) return;
        var st = tween.scrollTrigger, d = dist();
        var target = Math.min(d, Math.max(0, panel.offsetLeft - (window.innerWidth - panel.offsetWidth) / 2));
        var y = st.start + (st.end - st.start) * (d ? target / d : 0);
        if (lenis) lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y);
      };
      pin.addEventListener('focusin', onFocus);
      // Inclinaison 3D + reflet qui suit la souris
      var cleanups = [function () { pin.removeEventListener('focusin', onFocus); }];
      if (fine) $$('[data-tilt]', track).forEach(function (card) {
        var rx = gsap.quickTo(card, 'rotationX', { duration: .6, ease: 'power3.out' });
        var ry = gsap.quickTo(card, 'rotationY', { duration: .6, ease: 'power3.out' });
        gsap.set(card, { transformPerspective: 900 });
        var move = function (e) {
          var r = card.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          ry((x - .5) * 14); rx((.5 - y) * 12);
          card.style.setProperty('--gx', (x * 100) + '%');
          card.style.setProperty('--gy', (y * 100) + '%');
        };
        var leave = function () { rx(0); ry(0); };
        card.addEventListener('pointermove', move);
        card.addEventListener('pointerleave', leave);
        cleanups.push(function () { card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', leave); });
      });
      return function () { cleanups.forEach(function (c) { c(); }); };
    });
    mm.add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', function () {
      ScrollTrigger.create({ trigger: $('.services__rail'), start: 'top 88%', once: true, onEnter: function () { arts.forEach(draw); } });
    });
    mm.add('(prefers-reduced-motion: reduce)', function () {
      gsap.set($$('path, circle, rect', $('[data-track]')).filter(function (e) { return e.closest('.panel__art'); }), { strokeDashoffset: 0 });
    });

    /* ----- Chiffres : les rouleaux tournent quand la phrase entre ----- */
    if (!reduced) {
      ScrollTrigger.create({
        trigger: '.figures__text', start: 'top 72%', once: true,
        onEnter: function () {
          rolls.forEach(function (r, i) {
            gsap.fromTo(r.el, { yPercent: 0 }, { yPercent: -(10 + r.d) * 5, duration: 2.6 + i * .08, ease: 'expo.out', delay: i * .12 });
          });
        }
      });
      gsap.from('.figures__text', { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.figures__text', start: 'top 88%', once: true } });
    }

    /* ----- Lignes de coupe ----- */
    $$('.cut').forEach(function (cut) {
      var sc = $('.cut__sc', cut), line = $('.cut__line', cut);
      gsap.set(sc, { rotation: 90 });
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: cut, start: 'top 92%', end: 'top 35%', scrub: .5 } })
        .fromTo(sc, { x: 0 }, { x: function () { return cut.clientWidth - 28; } }, 0)
        .fromTo(line, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }, 0);
    });

    /* ----- Galerie : colonnes à vitesses différentes, masques variés, tilt ----- */
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', function () {
      var grid = $('.gallery__grid');
      $$('.gcol').forEach(function (col) {
        var sp = parseFloat(col.dataset.speed || 0);
        gsap.fromTo(col, { y: sp * 70 }, { y: sp * -70, ease: 'none', scrollTrigger: { trigger: grid, start: 'top bottom', end: 'bottom top', scrub: .8 } });
      });
    });
    var masks = [
      ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
      ['circle(0% at 50% 50%)', 'circle(75% at 50% 50%)'],
      ['inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)']
    ];
    $$('[data-gi]').forEach(function (it, i) {
      var frame = $('.gitem__frame', it), img = $('img', it), m = masks[i % 3];
      gsap.fromTo(frame, { clipPath: m[0] }, { clipPath: m[1], duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: it, start: 'top 86%', once: true } });
      gsap.from(img, { scale: 1.35, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: it, start: 'top 86%', once: true } });
      if (fine) {
        gsap.set(frame, { transformPerspective: 900 });
        var rx = gsap.quickTo(frame, 'rotationX', { duration: .7, ease: 'power3.out' });
        var ry = gsap.quickTo(frame, 'rotationY', { duration: .7, ease: 'power3.out' });
        it.addEventListener('pointermove', function (e) {
          var r = it.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - .5) * 10);
          rx((.5 - (e.clientY - r.top) / r.height) * 8);
        });
        it.addEventListener('pointerleave', function () { rx(0); ry(0); });
      }
    });

    /* ----- Appel à l'action ----- */
    var badge = $('[data-badge]');
    var spin = gsap.to(badge, { rotation: 360, duration: 22, ease: 'none', repeat: -1, svgOrigin: '100 100' });
    ScrollTrigger.create({
      trigger: '.cta', start: 'top bottom', end: 'bottom top',
      onUpdate: function (self) {
        gsap.to(spin, { timeScale: 1 + Math.min(Math.abs(self.getVelocity()) / 220, 8), duration: .4, overwrite: true, onComplete: function () { gsap.to(spin, { timeScale: 1, duration: 1.2 }); } });
      }
    });
    gsap.fromTo('.cta__arches', { yPercent: 8 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.bigbtn', { scale: 0, rotation: -40, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.bigbtn', start: 'top 92%', once: true } });
    gsap.from('.cta__tel', { x: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.cta__tel', start: 'top 92%', once: true } });

    /* ----- Pied de page : lettres géantes qui montent ----- */
    var gs = splitText($('[data-giant]'), 'chars', false);
    gsap.set(gs.chars, { yPercent: 105 });
    gsap.to(gs.chars, { yPercent: 0, ease: 'none', stagger: .12, scrollTrigger: { trigger: '[data-footer]', start: 'top 85%', end: 'bottom bottom', scrub: .6 } });

    // Boutons magnétiques
    if (fine) $$('[data-magnetic]').forEach(function (el) {
      var strength = parseFloat(el.dataset.magneticStrength || .32);
      var label = $('.btn__label, .bigbtn__label', el);
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        gsap.to(el, { x: dx * strength, y: dy * strength, duration: .5, ease: 'power3.out' });
        if (label) gsap.to(label, { x: dx * strength * .45, y: dy * strength * .45, duration: .5, ease: 'power3.out' });
      });
      el.addEventListener('pointerleave', function () {
        gsap.to([el, label].filter(Boolean), { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, .4)' });
      });
    });

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }

  /* ------------------------------------------------------------------
     Avis : paquet de cartes à glisser (fonctionne aussi sans animation)
     ------------------------------------------------------------------ */
  function initDeck() {
    var deck = $('[data-deck]');
    if (!deck || !hasGSAP) return;
    gsap.registerPlugin(ScrollTrigger);
    var slides = $$('[data-slide]', deck);
    var n = slides.length;
    var bar = $('[data-deck-bar]'), idx = $('[data-deck-i]');
    var prev = $('[data-prev]'), next = $('[data-next]'), pause = $('[data-pause]');
    var cur = 0, paused = reduced, inView = false, hover = false, dragging = false;
    var prog = null;

    deck.classList.add('is-live');
    deck.setAttribute('role', 'group');
    deck.setAttribute('tabindex', '0');
    deck.setAttribute('aria-label', 'Avis des clients, flèches gauche et droite pour naviguer');

    var heights = [];
    function setHeight(animate) {
      var h = heights[cur] + 40;
      if (animate && !reduced) gsap.to(deck, { height: h, duration: .8, ease: 'expo.out', overwrite: 'auto' });
      else { gsap.killTweensOf(deck); deck.style.height = h + 'px'; }
    }
    function sizes() {
      heights = slides.map(function (s) { return s.offsetHeight; });
      setHeight(false);
    }
    function layout(animate) {
      var W = slides[0].offsetWidth;
      var wide = window.innerWidth >= 900;
      slides.forEach(function (s, i) {
        var d = i - cur;
        if (d > n / 2) d -= n;
        if (d < -n / 2) d += n;
        var a = Math.abs(d);
        gsap.to(s, {
          x: d * W * (wide ? .66 : .94), xPercent: -50, scale: 1 - a * .09, rotation: d * 2.6,
          opacity: a === 0 ? 1 : a === 1 ? (wide ? .5 : .35) : a === 2 ? .18 : 0,
          zIndex: 10 - a, duration: animate && !reduced ? 1.1 : 0, ease: 'expo.out', overwrite: 'auto'
        });
        s.setAttribute('aria-hidden', a ? 'true' : 'false');
      });
      idx.textContent = cur + 1;
    }
    function startProgress() {
      if (prog) prog.kill();
      if (reduced) return;
      gsap.set(bar, { scaleX: 0 });
      prog = gsap.to(bar, { scaleX: 1, duration: 8, ease: 'none', onComplete: function () { go(cur + 1); } });
      sync();
    }
    function sync() { if (!prog) return; (paused || !inView || hover || dragging) ? prog.pause() : prog.play(); }
    function go(i) { cur = (i + n) % n; layout(true); setHeight(true); startProgress(); }

    prev.addEventListener('click', function () { go(cur - 1); });
    next.addEventListener('click', function () { go(cur + 1); });
    deck.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
    });
    if (reduced) { pause.hidden = true; bar.parentNode.hidden = true; }
    pause.addEventListener('click', function () {
      paused = !paused;
      pause.setAttribute('aria-pressed', String(paused));
      pause.textContent = paused ? 'Reprendre la lecture' : 'Mettre en pause';
      sync();
    });
    deck.addEventListener('pointerenter', function () { hover = true; sync(); });
    deck.addEventListener('pointerleave', function () { hover = false; sync(); });
    deck.addEventListener('focusin', function () { hover = true; sync(); });
    deck.addEventListener('focusout', function () { hover = false; sync(); });

    // Glisser à la souris ou au doigt
    var x0 = 0, dx = 0, pid = null;
    deck.addEventListener('pointerdown', function (e) { if (e.button > 0) return; dragging = true; x0 = e.clientX; dx = 0; pid = e.pointerId; sync(); });
    window.addEventListener('pointermove', function (e) {
      if (!dragging || e.pointerId !== pid) return;
      dx = e.clientX - x0;
      var W = slides[0].offsetWidth, wide = window.innerWidth >= 900;
      slides.forEach(function (s, i) {
        var d = i - cur; if (d > n / 2) d -= n; if (d < -n / 2) d += n;
        gsap.to(s, { x: d * W * (wide ? .66 : .94) + dx * .9, duration: .25, ease: 'power2.out', overwrite: 'auto' });
      });
    });
    function endDrag(e) {
      if (!dragging || (e && e.pointerId !== pid)) return;
      dragging = false;
      if (Math.abs(dx) > 70) go(cur + (dx < 0 ? 1 : -1)); else { layout(true); sync(); }
    }
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    sizes();
    layout(false);
    var rs;
    window.addEventListener('resize', function () { clearTimeout(rs); rs = setTimeout(function () { sizes(); layout(false); }, 150); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { sizes(); layout(false); });

    ScrollTrigger.create({
      trigger: deck, start: 'top 90%', end: 'bottom 10%',
      onToggle: function (self) { inView = self.isActive; sync(); },
      onEnter: function () { if (!reduced) gsap.from(slides, { y: 70, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .08, overwrite: false }); }
    });
    startProgress();
  }

  /* ------------------------------------------------------------------
     Démarrage
     ------------------------------------------------------------------ */
  initStatus();
  initChrome();
  initPicker();

  if (hasGSAP && !reduced) {
    initMotion();
    initDeck();
  } else {
    initOdometers();
    if (hasGSAP) initDeck();
    var l = $('[data-loader]');
    if (l) l.remove();
  }
})();
