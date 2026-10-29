/* Nailpainting29 : comportements du site.
   Partie 1 : fonctions utiles qui marchent sans animation (statut, menu, composeur, avis).
   Partie 2 : mouvement (GSAP + ScrollTrigger + Lenis), isolé pour que le site reste lisible s’il échoue. */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const $ = (s, c = doc) => c.querySelector(s);
  const $$ = (s, c = doc) => Array.from(c.querySelectorAll(s));
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const hasGsap = () => typeof window.gsap !== 'undefined';
  const app = { lenis: null, menuOpen: false, closeMenu: null };
  const PHONE = '+33678992003';

  /* ---------------------------------------------------------------
     Statut d’ouverture + jour en cours
  --------------------------------------------------------------- */
  function parisNow() {
    const f = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    });
    const p = Object.fromEntries(f.formatToParts(new Date()).map((x) => [x.type, x.value]));
    const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: days[p.weekday], h: +p.hour, m: +p.minute };
  }

  function initOpenStatus() {
    const now = parisNow();
    let text;
    let state = '';
    if (now.day >= 1 && now.day <= 6) {
      if (now.h >= 9 && now.h < 19) { text = 'Ouvert maintenant, jusqu’à 19 h'; state = 'is-open'; }
      else if (now.h < 9) { text = 'Fermé pour l’instant, ouvre à 9 h'; state = 'is-closed'; }
      else if (now.day === 6) { text = 'Fermé pour l’instant, envoie un SMS à Laurie'; state = 'is-closed'; }
      else { text = 'Fermé pour l’instant, rouvre demain à 9 h'; state = 'is-closed'; }
    } else {
      text = 'Dimanche : appelle pour confirmer';
    }
    $$('[data-open-status]').forEach((el) => {
      const span = $('span', el);
      const withPhone = el.classList.contains('status') && !el.classList.contains('status--on-color');
      span.textContent = withPhone ? `${text} · 06 78 99 20 03` : text;
      if (state) el.classList.add(state);
    });
    const row = $(`.hours tr[data-day="${now.day}"]`);
    if (row) {
      row.classList.add('is-today');
      row.setAttribute('aria-current', 'date');
      const th = $('th', row);
      th.insertAdjacentHTML('beforeend', '<span class="sr-only"> (aujourd’hui)</span>');
    }
  }

  /* ---------------------------------------------------------------
     Menu plein écran (mobile)
  --------------------------------------------------------------- */
  function initMenu() {
    const btn = $('.nav__burger');
    const menu = $('#menu');
    const nav = $('#nav');
    if (!btn || !menu) return;
    const links = $$('.menu__links a, .menu__foot a');
    const origin = 'calc(100% - 2.4rem) 2.4rem';
    let tween = null;

    const setOpen = (open) => {
      if (open === app.menuOpen) return;
      app.menuOpen = open;
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      nav.classList.toggle('is-menu-open', open);
      if (app.lenis) open ? app.lenis.stop() : app.lenis.start();
      if (!app.lenis) root.style.overflow = open ? 'hidden' : '';
      if (tween) tween.kill();

      if (open) {
        menu.hidden = false;
        if (hasGsap() && !reduceMQ.matches) {
          gsap.set(menu, { clipPath: `circle(0% at ${origin})` });
          tween = gsap.timeline()
            .to(menu, { clipPath: `circle(150% at ${origin})`, duration: 0.9, ease: 'expo.out' })
            .fromTo($$('.menu__links a span'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out' }, 0.15)
            .fromTo($$('.menu__foot > *'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'expo.out' }, 0.4);
        } else {
          menu.style.clipPath = 'none';
        }
        links[0] && links[0].focus({ preventScroll: true });
      } else {
        const done = () => { menu.hidden = true; menu.style.clipPath = ''; };
        if (hasGsap() && !reduceMQ.matches) {
          tween = gsap.to(menu, { clipPath: `circle(0% at ${origin})`, duration: 0.55, ease: 'expo.inOut', onComplete: done });
        } else done();
      }
    };

    app.closeMenu = () => setOpen(false);
    btn.addEventListener('click', () => setOpen(!app.menuOpen));
    doc.addEventListener('keydown', (e) => {
      if (!app.menuOpen) return;
      if (e.key === 'Escape') { setOpen(false); btn.focus(); }
      if (e.key === 'Tab') {
        const items = [btn, ...links];
        const i = items.indexOf(doc.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    });
    matchMedia('(min-width: 1101px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
  }

  /* ---------------------------------------------------------------
     Ancres : défilement fluide (Lenis si présent)
  --------------------------------------------------------------- */
  function initAnchors() {
    doc.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      if (app.menuOpen && app.closeMenu) app.closeMenu();
      const go = () => {
        if (app.lenis) app.lenis.scrollTo(target, { duration: 1.6, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        else target.scrollIntoView({ behavior: reduceMQ.matches ? 'auto' : 'smooth' });
      };
      app.menuOpen ? setTimeout(go, 350) : go();
      history.replaceState(null, '', id);
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  /* ---------------------------------------------------------------
     Composeur de set
  --------------------------------------------------------------- */
  function initCompose() {
    const hand = $('#hand');
    if (!hand) return;
    const msg = $('#compose-msg');
    const sms = $('#compose-sms');
    const copyBtn = $('#compose-copy');
    const status = $('#copy-status');
    const state = { shape: 'carré', tint: 'nude', motif: 'uni' };
    let shown = { tint: 'nude', motif: 'uni' };
    let tl = null;

    const nails = $$('.nail', hand);
    const layers = { cur: [], next: [] };
    const starSvg = '<svg class="nail__star" viewBox="0 0 24 24"><path d="M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z"/></svg>';
    nails.forEach((n) => {
      n.innerHTML = `<div class="layer layer--cur"><i class="nail__base"></i><i class="nail__tip"></i>${starSvg}</div><div class="layer layer--next"><i class="nail__base"></i><i class="nail__tip"></i>${starSvg}</div><i class="nail__gloss"></i>`;
      layers.cur.push($('.layer--cur', n));
      layers.next.push($('.layer--next', n));
    });

    const setLayer = (list, look) => list.forEach((l) => { l.dataset.tint = look.tint; l.dataset.motif = look.motif; });
    setLayer(layers.cur, shown);
    setLayer(layers.next, shown);
    if (hasGsap()) gsap.set(layers.next, { yPercent: 105, visibility: 'visible' });

    const text = () => {
      const t = `Bonjour Laurie, j’aimerais un set forme ${state.shape}, teinte ${state.tint}, motif ${state.motif}. Quand es-tu disponible ?`;
      msg.textContent = t;
      sms.href = `sms:${PHONE}?&body=${encodeURIComponent(t)}`;
      return t;
    };
    text();

    const commit = () => {
      setLayer(layers.cur, shown);
      if (hasGsap()) gsap.set(layers.next, { yPercent: 105 });
    };

    const repaint = () => {
      const next = { tint: state.tint, motif: state.motif };
      hand.dataset.tint = next.tint;
      if (tl) { tl.progress(1); tl.kill(); }
      shown = next;
      setLayer(layers.next, next);
      if (hasGsap() && !reduceMQ.matches) {
        tl = gsap.fromTo(layers.next, { yPercent: 105 }, { yPercent: 0, duration: 0.8, stagger: 0.07, ease: 'expo.out', onComplete: commit });
      } else {
        setLayer(layers.cur, next);
      }
    };

    $$('.picker input').forEach((input) => {
      input.addEventListener('change', () => {
        state[input.name] = input.value;
        text();
        if (input.name === 'shape') hand.dataset.shape = input.value;
        else repaint();
      });
    });

    copyBtn.addEventListener('click', async () => {
      const t = text();
      try {
        await navigator.clipboard.writeText(t);
      } catch (err) {
        const ta = doc.createElement('textarea');
        ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
        doc.body.appendChild(ta); ta.select();
        try { doc.execCommand('copy'); } catch (e2) { /* rien */ }
        ta.remove();
      }
      const label = $('.btn__label', copyBtn);
      status.textContent = 'Message copié.';
      label.textContent = 'Message copié';
      setTimeout(() => { label.textContent = 'Copier le message'; status.textContent = ''; }, 2200);
    });
  }

  /* ---------------------------------------------------------------
     Carrousel d’avis (défilement natif + boutons + lecture auto)
  --------------------------------------------------------------- */
  function initReviews() {
    const track = $('#reviews-track');
    if (!track) return;
    const items = $$('.review', track);
    const prev = $('.rc--prev');
    const next = $('.rc--next');
    const play = $('.rc--play');
    const cur = $('#rev-cur');
    const bar = $('.reviews__bar i');
    const live = $('#rev-live');
    const section = $('#avis');
    let idx = 0;
    let timer = null;
    let userPaused = reduceMQ.matches;
    let hovering = false;
    let visible = false;
    let raf = 0;

    const centerFor = (el) => el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2;
    const goTo = (i, announce) => {
      idx = (i + items.length) % items.length;
      track.scrollTo({ left: centerFor(items[idx]), behavior: reduceMQ.matches ? 'auto' : 'smooth' });
      if (announce) live.textContent = `Avis ${idx + 1} sur ${items.length}, ${$('cite', items[idx]).textContent}.`;
    };

    const sync = () => {
      raf = 0;
      const mid = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestD = Infinity;
      items.forEach((it, i) => {
        const d = Math.abs(it.offsetLeft + it.offsetWidth / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      idx = best;
      items.forEach((it, i) => it.classList.toggle('is-active', i === best));
      cur.textContent = String(best + 1);
      bar.style.transform = `scaleX(${(best + 1) / items.length})`;
    };
    track.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(sync); }, { passive: true });
    window.addEventListener('resize', () => goTo(idx), { passive: true });

    const tick = () => {
      clearInterval(timer);
      timer = null;
      if (!userPaused && !hovering && visible && !doc.hidden) timer = setInterval(() => goTo(idx + 1, false), 6500);
    };
    prev.addEventListener('click', () => { goTo(idx - 1, true); tick(); });
    next.addEventListener('click', () => { goTo(idx + 1, true); tick(); });
    play.addEventListener('click', () => {
      userPaused = !userPaused;
      play.setAttribute('aria-pressed', String(userPaused));
      play.setAttribute('aria-label', userPaused ? 'Reprendre le défilement automatique' : 'Mettre en pause le défilement automatique');
      tick();
    });
    play.setAttribute('aria-pressed', String(userPaused));
    play.setAttribute('aria-label', userPaused ? 'Reprendre le défilement automatique' : 'Mettre en pause le défilement automatique');

    const pause = () => { hovering = true; tick(); };
    const resume = () => { hovering = false; tick(); };
    track.addEventListener('pointerenter', pause);
    track.addEventListener('pointerleave', resume);
    track.addEventListener('focusin', pause);
    track.addEventListener('focusout', resume);
    track.addEventListener('touchstart', pause, { passive: true });
    track.addEventListener('touchend', () => setTimeout(resume, 4000), { passive: true });
    doc.addEventListener('visibilitychange', tick);
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; tick(); }, { threshold: 0.35 }).observe(section);

    sync();
    goTo(0, false);
  }

  /* ---------------------------------------------------------------
     MOUVEMENT
  --------------------------------------------------------------- */
  const fontsReady = () => Promise.race([
    (doc.fonts && doc.fonts.ready) || Promise.resolve(),
    new Promise((r) => setTimeout(r, 2500))
  ]);

  function split(el) {
    const label = el.getAttribute('aria-label') || el.textContent.replace(/\s+/g, ' ').trim();
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', label);
    el.dataset.splitFrom = label;
    el.textContent = '';
    const words = [];
    const chars = [];
    label.split(' ').forEach((word, wi, arr) => {
      const w = doc.createElement('span');
      w.className = 'w';
      w.setAttribute('aria-hidden', 'true');
      Array.from(word).forEach((ch) => {
        const c = doc.createElement('span');
        c.className = 'c';
        c.textContent = ch;
        w.appendChild(c);
        chars.push(c);
      });
      el.appendChild(w);
      words.push(w);
      if (wi < arr.length - 1) el.appendChild(doc.createTextNode(' '));
    });
    return { words, chars };
  }

  function revealEverything() {
    try {
      if (hasGsap()) {
        ScrollTrigger.getAll().forEach((t) => t.kill());
        gsap.globalTimeline.clear();
        gsap.set($$('[style]'), { clearProps: 'opacity,visibility,transform,clipPath,filter' });
      }
    } catch (e) { /* ignore */ }
    const l = $('#loader');
    if (l) l.remove();
    root.classList.remove('is-loading');
    root.classList.add('no-anim');
  }

  async function initMotion() {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = reduceMQ.matches;
    const ease = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

    if (!reduce && typeof window.Lenis !== 'undefined') {
      app.lenis = new Lenis({ duration: 1.15, easing: ease, smoothWheel: true });
      app.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => app.lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    root.classList.add('is-loading');
    if (app.lenis) app.lenis.stop();
    await fontsReady();

    /* découpage des titres */
    const heroSplit = $$('.hero__title .split').map(split);
    const heroChars = heroSplit.flatMap((s) => s.chars);
    const footSplit = split($('.footer__word .split'));
    const titleKinds = {
      '#rituel-title': 'chars', '#chiffres-title': 'skew', '#compose-title': 'blur',
      '#galerie-title': 'left', '#avis-title': 'flip', '#appel-title': 'chars', '#trouver-title': 'wipe'
    };
    const titles = Object.entries(titleKinds).map(([sel, kind]) => {
      const el = $(sel);
      return el ? { el, kind, ...split(el) } : null;
    }).filter(Boolean);

    /* état initial de l’intro (masqué sous le préchargeur) */
    if (!reduce) {
      gsap.set(heroChars, { yPercent: 118 });
      gsap.set('.hero .stroke', { xPercent: -104 });
      gsap.set(['.hero__lede', '.hero__cta > *', '.hero .status', '.scrollcue'], { y: 28, opacity: 0 });
      gsap.set('.hero .ph .frame', { y: 80, opacity: 0 });
      gsap.set('.hero .ph img', { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.35 });
      gsap.set('.hero .drop', { scale: 0 });
      gsap.set('.hero .charm', { scale: 0, rotation: -90 });
      gsap.set('.nav', { yPercent: -160 });
    }

    buildScroll({ reduce, ease, titles, footSplit });

    await runLoader(reduce);
    introHero(reduce, heroChars);
    if (app.lenis) app.lenis.start();
    root.classList.remove('is-loading');

    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    if (doc.readyState === 'complete') ScrollTrigger.refresh();
  }

  /* ---- Préchargeur : un ongle en quatre couches, puis rideau de vernis ---- */
  function runLoader(reduce) {
    const loader = $('#loader');
    if (!loader) return Promise.resolve();
    if (reduce) { loader.remove(); return Promise.resolve(); }

    let seen = false;
    try { seen = sessionStorage.getItem('np29-seen') === '1'; sessionStorage.setItem('np29-seen', '1'); } catch (e) { /* ignore */ }
    const k = seen ? 0.55 : 1;
    const coats = $$('.coat', loader);
    const pct = $('.loader__pct', loader);
    const curtain = $('.loader__curtain', loader);
    const prog = { v: 0 };

    gsap.set(coats, { y: 300, opacity: 1 });
    gsap.set(curtain, { y: 0, yPercent: 101 });
    gsap.set($('.gloss', loader), { opacity: 0 });

    const tl = gsap.timeline();
    tl.from('.loader__nail', { scale: 0.82, opacity: 0, duration: 0.6 * k, ease: 'expo.out' }, 0)
      .from('.loader__name', { y: 18, opacity: 0, duration: 0.6 * k, ease: 'expo.out' }, 0.08 * k)
      .to(prog, { v: 100, duration: 1.5 * k, ease: 'power2.inOut', onUpdate: () => { pct.textContent = Math.round(prog.v); } }, 0.2 * k);
    coats.forEach((c, i) => tl.to(c, { y: 0, duration: 0.62 * k, ease: 'power3.out' }, (0.25 + i * 0.3) * k));
    tl.to($('.gloss', loader), { opacity: 1, duration: 0.4 * k }, 1.7 * k);

    return tl.then(() => new Promise((resolve) => {
      const out = gsap.timeline({ onComplete: () => { loader.remove(); } });
      out.to(curtain, { yPercent: 0, duration: 0.7 * k, ease: 'expo.inOut' })
        .set(loader, { borderRadius: '0 0 50% 50% / 0 0 9vw 9vw', boxShadow: 'inset 0 -5px 0 rgba(255,255,255,.55)', backgroundColor: '#FE672E' })
        .to(loader, { yPercent: -101, duration: 0.95 * k, ease: 'expo.inOut' }, '>0.05')
        .add(resolve, '-=0.55');
    }));
  }

  function introHero(reduce, heroChars) {
    if (reduce) return;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to('.nav', { yPercent: 0, duration: 1, ease: 'expo.out' }, 0.5)
      .to(heroChars, { yPercent: 0, duration: 1.25, stagger: 0.035 }, 0)
      .to('.hero .stroke', { xPercent: 0, duration: 1.4, ease: 'expo.inOut' }, 0.45)
      .to('.hero .ph .frame', { y: 0, opacity: 1, duration: 1.3, stagger: 0.12 }, 0.15)
      .to('.hero .ph img', { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.5, stagger: 0.12, ease: 'expo.out' }, 0.2)
      .to('.hero .drop', { scale: 1, duration: 1, stagger: 0.09, ease: 'back.out(1.6)' }, 0.5)
      .to('.hero .charm', { scale: 1, rotation: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out' }, 0.7)
      .to(['.hero__lede', '.hero__cta > *', '.hero .status', '.scrollcue'], { y: 0, opacity: 1, duration: 0.95, stagger: 0.08 }, 0.65);
  }

  /* ---- Animations pilotées par le scroll ---- */
  function buildScroll({ reduce, ease, titles, footSplit }) {
    const mm = gsap.matchMedia();

    mm.add({
      motion: '(prefers-reduced-motion: no-preference)',
      lite: '(prefers-reduced-motion: reduce)',
      desk: '(min-width: 900px)',
      fine: '(hover: hover) and (pointer: fine)'
    }, (ctx) => {
      const { motion, lite, desk, fine } = ctx.conditions;

      /* progression de lecture */
      gsap.to('.progress__bar', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.15 } });

      /* barre de navigation : se cache en descendant, revient en remontant */
      const nav = $('#nav');
      let navHidden = false;
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: (self) => {
          if (app.menuOpen) return;
          const shouldHide = self.direction === 1 && self.scroll() > 140;
          if (shouldHide === navHidden) return;
          navHidden = shouldHide;
          gsap.to(nav, { yPercent: shouldHide ? -170 : 0, duration: 0.6, ease: 'expo.out', overwrite: true });
        }
      });

      /* bouton flottant : visible une fois le hero passé, discret sur l’appel et le pied de page */
      const fab = $('.fab');
      if (fab) {
        const cover = new Set();
        const sync = () => fab.classList.toggle('is-hidden', cover.size > 0);
        [['.hero__cta', 'top bottom', 'bottom top'], ['#rdv', 'top 85%', 'bottom top'], ['#contact', 'top 85%', 'bottom top'], ['.footer', 'top 90%', 'bottom bottom']].forEach(([sel, st, en]) => {
          const t = $(sel);
          if (t) ScrollTrigger.create({ trigger: t, start: st, end: en, onToggle: (s) => { s.isActive ? cover.add(sel) : cover.delete(sel); sync(); } });
        });
      }

      if (lite) {
        $$('.h2, .lede').forEach((el) => gsap.from(el, { opacity: 0, duration: 0.6, scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
        titles.forEach((t) => { /* titres lisibles tels quels */ });
        return;
      }

      /* le bord de chaque section monte comme un ménisque de vernis qui se pose */
      $$('.sec, .footer').forEach((el) => {
        gsap.fromTo(el, { '--e': 0.12 }, { '--e': 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 100%', end: 'top 62%', scrub: true } });
      });

      /* ===== HERO : parallax multicouche ===== */
      $$('.hero [data-speed]').forEach((el) => {
        const sp = parseFloat(el.dataset.speed);
        gsap.to(el, { y: () => -sp * innerHeight * 0.42, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
      });
      gsap.to('.hero__inner', { y: () => -innerHeight * 0.12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero .ph--main img', { scale: 1.14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero .stroke', { xPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

      if (fine && desk) {
        const depth = { '.ph--main': 14, '.ph--oval': 30, '.ph--sq': 22 };
        Object.entries(depth).forEach(([sel, d]) => {
          const t = $(`.hero ${sel} .shadow`);
          if (!t) return;
          const qx = gsap.quickTo(t, 'x', { duration: 1.1, ease: 'power3' });
          const qy = gsap.quickTo(t, 'y', { duration: 1.1, ease: 'power3' });
          $('.hero').addEventListener('pointermove', (e) => {
            qx((e.clientX / innerWidth - 0.5) * -d * 2);
            qy((e.clientY / innerHeight - 0.5) * -d * 2);
          });
        });
      }

      /* ===== MARQUEE : réagit à la vitesse et au sens du scroll ===== */
      const mq = $('.marquee');
      const lanes = $$('.marquee__track').map((track) => {
        const dir = parseFloat(track.dataset.dir);
        const unit = track.firstElementChild;
        const w = unit.offsetWidth;
        while (track.scrollWidth < innerWidth * 1.2 + w) track.appendChild(unit.cloneNode(true));
        const set = gsap.quickSetter(track, 'x', 'px');
        const lane = { dir, w, x: dir < 0 ? 0 : -w, set };
        set(lane.x);
        return lane;
      });
      let target = 1;
      let cur = 1;
      let mqActive = false;
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: (self) => {
          const v = Math.min(Math.abs(self.getVelocity()) / 500, 6);
          target = (self.direction === 1 ? 1 : -1) * (1 + v);
        }
      });
      const marqueeTick = (time, delta) => {
        if (!mqActive) return;
        cur += (target - cur) * 0.07;
        target += (Math.sign(target || 1) - target) * 0.03;
        const dt = Math.min(delta, 64) / 1000;
        lanes.forEach((l) => {
          l.x += l.dir * cur * 85 * dt;
          if (l.x <= -l.w) l.x += l.w;
          if (l.x > 0) l.x -= l.w;
          l.set(l.x);
        });
      };
      gsap.ticker.add(marqueeTick);
      ScrollTrigger.create({ trigger: mq, start: 'top bottom', end: 'bottom top', onToggle: (s) => { mqActive = s.isActive; } });
      gsap.from('.marquee__band--a', { xPercent: -8, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: mq, start: 'top 80%', once: true } });
      gsap.from('.marquee__band--b', { xPercent: 8, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: mq, start: 'top 80%', once: true } });

      /* ===== TITRES ===== */
      titles.forEach(({ el, kind, words, chars }) => {
        const st = { trigger: el, start: 'top 86%', once: true };
        if (kind === 'chars') { gsap.set(chars, { yPercent: 120 }); gsap.to(chars, { yPercent: 0, duration: 1.1, stagger: 0.02, ease: 'expo.out', scrollTrigger: st }); }
        if (kind === 'skew') { gsap.set(chars, { yPercent: 125, rotate: 9, transformOrigin: '0% 100%' }); gsap.to(chars, { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.022, ease: 'expo.out', scrollTrigger: st }); }
        if (kind === 'left') { gsap.set(chars, { xPercent: -130 }); gsap.to(chars, { xPercent: 0, duration: 1.1, stagger: 0.02, ease: 'expo.out', scrollTrigger: st }); }
        if (kind === 'blur') { gsap.set(chars, { opacity: 0, y: 24, filter: 'blur(10px)' }); gsap.to(chars, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, stagger: 0.025, ease: 'power3.out', scrollTrigger: st }); }
        if (kind === 'flip') { el.style.perspective = '700px'; gsap.set(chars, { rotationX: -95, opacity: 0, transformOrigin: '50% 100%' }); gsap.to(chars, { rotationX: 0, opacity: 1, duration: 1, stagger: 0.02, ease: 'expo.out', scrollTrigger: st }); }
        if (kind === 'wipe') { gsap.set(el, { clipPath: 'inset(0 100% 0 0)' }); gsap.to(el, { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: st }); }
        if (el.id === 'rituel-title' || el.id === 'appel-title') el.style.overflow = 'visible';
      });
      $$('.lede').forEach((el) => gsap.from(el, { y: 26, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));

      /* ===== RITUEL : section pinnée, quatre couches ===== */
      const rituel = $('.rituel');
      if (desk && rituel) {
        rituel.classList.add('is-pinned');
        const stage = $('.rituel__stage');
        const steps = $$('.step', rituel);
        const coats = $$('.rb:not(.rb--1)', rituel);
        const photos = $$('.cp', rituel);
        const rail = $$('.steps__rail i', rituel);
        gsap.set(steps, { autoAlpha: 0 });
        gsap.set(steps[0], { autoAlpha: 1 });
        gsap.set(coats, { yPercent: 102 });
        gsap.set(photos.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' });
        gsap.set(rail[0], { '--p': 1 });

        const tl = gsap.timeline({
          defaults: { ease: 'power3.inOut' },
          scrollTrigger: { trigger: stage, start: 'top top', end: () => '+=' + innerHeight * 3.6, pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true }
        });
        for (let i = 1; i < 4; i += 1) {
          const b = i;
          tl.to(steps[i - 1], { autoAlpha: 0, y: -46, duration: 0.3, ease: 'power2.in' }, b - 0.25)
            .to(coats[i - 1], { yPercent: 0, duration: 0.62 }, b - 0.32)
            .to(photos[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.62 }, b - 0.3)
            .fromTo(steps[i], { autoAlpha: 0, y: 56 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, b + 0.08)
            .to(rail[i], { '--p': 1, duration: 0.4, ease: 'none' }, b);
        }
        tl.to(photos, { scale: 1.1, duration: 4, ease: 'none' }, 0)
          .to('.r-star', { rotation: 200, duration: 4, ease: 'none' }, 0)
          .to('.r-bow', { rotation: -14, y: -30, duration: 4, ease: 'none' }, 0)
          .to({}, { duration: 0.01 }, 4);
      } else {
        $$('.step', rituel).forEach((s) => gsap.from(s, { y: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 88%', once: true } }));
      }

      /* ===== PRESTATIONS : défilement horizontal piloté par le scroll ===== */
      const presta = $('.presta');
      const rail = $('.rail');
      if (desk && presta && rail) {
        presta.classList.add('is-hrail');
        const pin = $('.presta__pin');
        const dist = () => Math.max(0, rail.scrollWidth - innerWidth);
        const run = gsap.to(rail, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: { trigger: pin, start: 'top top', end: () => '+=' + dist() * 1.05, pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true }
        });
        gsap.timeline({ scrollTrigger: { trigger: pin, start: 'top top', end: () => '+=' + dist() * 1.05, scrub: 0.6, invalidateOnRefresh: true } })
          .to('.presta__progress i', { scaleX: 1, ease: 'none', duration: 0.94 })
          .to('.presta__progress', { opacity: 0, ease: 'none', duration: 0.06 });
        $$('.card', rail).forEach((card, i) => {
          gsap.fromTo(card, { rotation: i % 2 ? 5 : -5, y: 70 }, { rotation: 0, y: 0, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: run, start: 'left 105%', end: 'left 62%', scrub: true } });
          const img = $('img', card);
          if (img) {
            gsap.set(img, { scale: 1.22 });
            gsap.fromTo(img, { xPercent: -7 }, { xPercent: 7, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: run, start: 'left 100%', end: 'right 0%', scrub: true } });
          }
        });
      }

      /* ===== CHIFFRES : marqueurs peints + compteurs ===== */
      $$('.count').forEach((row, i) => {
        const mark = $('.count__mark', row);
        const nums = $$('b[data-count]', row);
        const txt = $('.count__txt', row);
        gsap.set(mark, { '--paint': 0 });
        gsap.set(txt, { x: 36, opacity: 0 });
        gsap.set(nums, { textContent: 0 });
        ScrollTrigger.create({
          trigger: row, start: 'top 86%', once: true,
          onEnter: () => {
            gsap.to(mark, { '--paint': 1, duration: 1.1, ease: 'expo.inOut' });
            nums.forEach((n) => gsap.to(n, { textContent: parseFloat(n.dataset.count), duration: 1.5, ease: 'power2.out', snap: { textContent: 1 }, delay: 0.1 }));
            gsap.to(txt, { x: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.35 });
          }
        });
      });

      /* ===== COMPOSEUR : la main se peint à l’arrivée ===== */
      gsap.from('.compose__stage', { clipPath: 'circle(0% at 50% 60%)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.compose__stage', start: 'top 80%', once: true } });
      gsap.from('.set .nail', { yPercent: 60, opacity: 0, duration: 1.1, stagger: 0.09, ease: 'expo.out', scrollTrigger: { trigger: '.compose__stage', start: 'top 70%', once: true } });
      gsap.from('.picker fieldset', { y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.picker', start: 'top 85%', once: true } });

      /* ===== GALERIE : masques + parallaxe interne ===== */
      $$('.tile').forEach((tile, i) => {
        const img = $('img', tile);
        const kind = tile.dataset.reveal;
        const from = kind === 'circle' ? { clipPath: 'circle(0% at 50% 62%)' } : { clipPath: 'inset(100% 0% 0% 0%)' };
        const to = kind === 'circle' ? { clipPath: 'circle(78% at 50% 62%)' } : { clipPath: 'inset(0% 0% 0% 0%)' };
        gsap.set(img, { ...from, scale: 1.3 });
        gsap.to(img, { ...to, scale: 1.06, duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: tile, start: 'top 88%', once: true } });
        gsap.to(img, { yPercent: -4, ease: 'none', scrollTrigger: { trigger: tile, start: 'top bottom', end: 'bottom top', scrub: true } });
        if (fine) {
          tile.addEventListener('pointerenter', () => gsap.to(img, { scale: 1.16, duration: 1.1, ease: 'expo.out', overwrite: 'auto' }));
          tile.addEventListener('pointerleave', () => gsap.to(img, { scale: 1.06, duration: 1.1, ease: 'expo.out', overwrite: 'auto' }));
        }
      });
      gsap.set('.tile .frame img', { height: '108%', top: '-4%', position: 'absolute', left: 0 });

      /* ===== AVIS ===== */
      gsap.from('.reviews__track', { x: 160, opacity: 0, duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: '.reviews', start: 'top 85%', once: true } });
      gsap.from('.review__av', { scale: 0, duration: 0.9, stagger: 0.1, ease: 'back.out(2)', scrollTrigger: { trigger: '.reviews', start: 'top 80%', once: true } });

      /* ===== APPEL ===== */
      const digits = $$('.appel__digits .d');
      gsap.set('.appel__digits', { overflow: 'hidden', paddingBottom: '.06em' });
      gsap.from(digits, { yPercent: 115, duration: 1.2, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: '.appel__digits', start: 'top 88%', once: true } });
      gsap.from('.appel__ctas > *', { y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.appel__ctas', start: 'top 92%', once: true } });

      /* ===== NOUS TROUVER ===== */
      gsap.from('.mapframe', { clipPath: 'circle(0% at 50% 50%)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.mapframe', start: 'top 85%', once: true } });
      gsap.from('.hours tr', { x: -40, opacity: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: '.hours', start: 'top 88%', once: true } });
      gsap.from('.addr > *', { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.addr', start: 'top 90%', once: true } });

      /* ===== PIED DE PAGE ===== */
      gsap.set(footSplit.chars, { yPercent: 118 });
      gsap.to(footSplit.chars, {
        yPercent: 0, duration: 1.3, stagger: 0.04, ease: 'expo.out',
        scrollTrigger: { trigger: '.footer', start: 'top 70%', once: true },
        onComplete: () => gsap.set(footSplit.chars, { clearProps: 'transform' })
      });

      /* ===== MICRO-INTERACTIONS (souris) ===== */
      if (fine) {
        $$('.tilt').forEach((el) => {
          gsap.set(el, { transformPerspective: 900 });
          const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
          const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
          el.addEventListener('pointermove', (e) => {
            const r = el.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            ry((px - 0.5) * 14);
            rx(-(py - 0.5) * 14);
            el.style.setProperty('--mx', px * 100 + '%');
            el.style.setProperty('--my', py * 100 + '%');
          });
          el.addEventListener('pointerleave', () => { rx(0); ry(0); });
        });

        $$('.magnetic').forEach((el) => {
          const label = $('.btn__label', el) || el;
          const xs = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.6)' });
          const ys = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.6)' });
          const lx = gsap.quickTo(label, 'x', { duration: 0.7, ease: 'power3' });
          const ly = gsap.quickTo(label, 'y', { duration: 0.7, ease: 'power3' });
          el.addEventListener('pointermove', (e) => {
            const r = el.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            xs(dx * 0.3); ys(dy * 0.4); lx(dx * 0.12); ly(dy * 0.16);
          });
          el.addEventListener('pointerleave', () => { xs(0); ys(0); lx(0); ly(0); });
        });
      }

      return () => {
        gsap.ticker.remove(marqueeTick);
        rituel && rituel.classList.remove('is-pinned');
        presta && presta.classList.remove('is-hrail');
      };
    });
  }

  /* ---------------------------------------------------------------
     Démarrage
  --------------------------------------------------------------- */
  initOpenStatus();
  initMenu();
  initAnchors();
  initCompose();
  initReviews();

  if (!hasGsap() || typeof window.ScrollTrigger === 'undefined') {
    root.classList.add('no-anim');
    const l = $('#loader');
    if (l) l.remove();
    return;
  }
  initMotion().catch((err) => {
    console.error('[Nailpainting29] animation désactivée :', err);
    revealEverything();
  });
})();
