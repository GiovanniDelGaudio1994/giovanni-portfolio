/* Giovanni Del Gaudio — Portfolio v2.0
   Native scroll choreography and accessible motion effects.
   Uses CSS transitions, requestAnimationFrame, and reduced-motion support.
*/
(() => {
  'use strict';
  const doc = document;
  const english = doc.documentElement.lang === 'en';
  const nav = doc.getElementById('site-nav');
  const toggle = doc.getElementById('nav-toggle');
  const menu = doc.getElementById('nav-links');
  const progress = doc.getElementById('scroll-progress');
  const heroHalo = doc.getElementById('hero-halo');
  const heroVisual = doc.querySelector('.hero-visual');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const revealItems = [...doc.querySelectorAll('.reveal')];
  const sections = [...doc.querySelectorAll('section[id]')];
  const allNavLinks = [...doc.querySelectorAll('.nav-links a[href^="#"]')];
  let scheduled = false;

  doc.getElementById('current-year').textContent = String(new Date().getFullYear());
  const closeMenu = () => {
    if (!menu || !toggle) return;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', english ? 'Open navigation menu' : 'Apri il menu di navigazione');
  };
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? (english ? 'Close navigation menu' : 'Chiudi il menu di navigazione') : (english ? 'Open navigation menu' : 'Apri il menu di navigazione'));
      if (open) menu.querySelector('a')?.focus({ preventScroll: true });
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    doc.addEventListener('click', e => { if (!toggle.contains(e.target) && !menu.contains(e.target)) closeMenu(); });
    doc.addEventListener('keydown', e => { if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
    const desktop = matchMedia('(min-width: 1211px)');
    if (desktop.addEventListener) desktop.addEventListener('change', () => { if (desktop.matches) closeMenu(); });
  }

  const updateScroll = () => {
    scheduled = false;
    const y = window.scrollY || window.pageYOffset;
    const total = Math.max(1, doc.documentElement.scrollHeight - window.innerHeight);
    nav?.classList.toggle('is-scrolled', y > 24);
    if (progress) progress.style.width = `${Math.min(100, Math.max(0, y / total * 100))}%`;
    if (!reduceMotion.matches && window.innerWidth > 700) {
      if (heroHalo) heroHalo.style.setProperty('--hero-shift', `${Math.min(190, y * 0.17)}px`);
      if (heroVisual) heroVisual.style.setProperty('--portrait-y', `${Math.min(80, y * 0.08)}px`);
    }
    // Native reveal animation: no third-party JavaScript required.
    const threshold = window.innerHeight * .88;
    revealItems.forEach(el => {
      if (!el.classList.contains('is-visible') && el.getBoundingClientRect().top < threshold) el.classList.add('is-visible');
    });
    let active = '';
    sections.forEach(section => { if (section.getBoundingClientRect().top <= window.innerHeight * .36) active = section.id; });
    allNavLinks.forEach(link => {
      if (link.getAttribute('href') === `#${active}`) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };
  const requestScroll = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); } };

  // Enable entrance transitions only after initialization so content never disappears if JS fails.
  if (!reduceMotion.matches) {
    revealItems.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight * .88) el.classList.add('is-visible');
    });
    doc.documentElement.classList.add('motion-ready');
  }
  window.addEventListener('scroll', requestScroll, {passive:true});
  window.addEventListener('resize', requestScroll);
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', () => { if (reduceMotion.matches) doc.documentElement.classList.remove('motion-ready'); requestScroll(); });
  requestScroll();
})();


/* Certifications catalog with accessible filters. No network calls, only uploaded assets. */
(() => {
  const buttons=[...document.querySelectorAll('[data-cert-filter]')];
  const cards=[...document.querySelectorAll('.credential-card[data-cert-cat]')];
  const output=document.getElementById('credential-count');
  for(const button of buttons){
    button.addEventListener('click',()=>{
      const selected=button.getAttribute('data-cert-filter');
      let visible=0;
      for(const card of cards){
        const show=selected==='all'||card.getAttribute('data-cert-cat')===selected;
        card.hidden=!show;
        if(show){visible++;card.classList.add('is-visible')}
      }
      for(const other of buttons){
        const active=other===button;
        other.classList.toggle('is-active',active);
        other.setAttribute('aria-pressed',String(active));
      }
      if(output)output.textContent=visible+' '+(document.documentElement.lang==='en'?(visible===1?'credential':'credentials'):(visible===1?'attestazione':'attestazioni'));
    });
  }
})();

/* Theme persistence and lightweight hero cursor parallax. */
(() => {
  'use strict';
  const root=document.documentElement;
  const toggle=document.getElementById('theme-switch');
  const updateToggle=()=>{
    if(!toggle)return;
    const light=root.dataset.theme==='light';
    const en=root.lang==='en';
    toggle.setAttribute('aria-label',light?(en?'Activate dark theme':'Attiva tema scuro'):(en?'Activate light theme':'Attiva tema chiaro'));
    toggle.setAttribute('title',light?(en?'Switch to dark theme':'Passa al tema scuro'):(en?'Switch to light theme':'Passa al tema chiaro'));
    toggle.setAttribute('aria-pressed',String(light));
    const label=toggle.querySelector('.theme-switch-text');
    if(label)label.textContent=light?(en?'Dark':'Scuro'):(en?'Light':'Chiaro');
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.setAttribute('content',light?'#f8fbff':'#080c16');
  };
  if(toggle){
    updateToggle();
    toggle.addEventListener('click',()=>{
      const newTheme=root.dataset.theme==='light'?'dark':'light';
      root.dataset.theme=newTheme;
      try{localStorage.setItem('gdg-theme',newTheme)}catch(_){}
      updateToggle();
    });
  }
  const visual=document.querySelector('.hero-visual');
  const portrait=visual?.querySelector('.portrait-frame img');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
  if(visual && portrait && !reduce.matches && fine.matches){
    visual.addEventListener('pointermove',(event)=>{
      const rect=visual.getBoundingClientRect();
      const dx=(event.clientX-(rect.left+rect.width/2))/Math.max(rect.width,1);
      const dy=(event.clientY-(rect.top+rect.height/2))/Math.max(rect.height,1);
      portrait.style.setProperty('--face-x',(dx*7).toFixed(2)+'px');
      portrait.style.setProperty('--face-y',(dy*6).toFixed(2)+'px');
    },{passive:true});
    visual.addEventListener('pointerleave',()=>{
      portrait.style.setProperty('--face-x','0px');
      portrait.style.setProperty('--face-y','0px');
    });
  }
})();

// Cursor glow on project cards for pointer devices.
(() => {
 const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
 if(!fine.matches)return;
 document.querySelectorAll('.dg-feature-card,.dg-wide-card,.dg-academic-card').forEach(card=>{
  card.addEventListener('pointermove',e=>{
   const r=card.getBoundingClientRect();
   card.style.setProperty('--glow-x',Math.round(e.clientX-r.left)+'px');
   card.style.setProperty('--glow-y',Math.round(e.clientY-r.top)+'px');
  },{passive:true});
 });
})();


/* In-portfolio live demo viewer; static, same-origin demonstrations only. */
(() => {
 const dialog=document.getElementById('dg-demo-dialog');
 const frame=document.getElementById('dg-demo-frame');
 const title=document.getElementById('dg-demo-title');
 const ext=document.getElementById('dg-demo-open');
 const close=document.getElementById('dg-demo-close');
 if(!dialog||!frame||!title||!ext||!close)return;
 let opener=null;
 const dismiss=()=>{if(dialog.open)dialog.close()};
 for(const trigger of document.querySelectorAll('.dg-demo-trigger')){
  trigger.addEventListener('click',()=>{
   const source=trigger.getAttribute('data-demo-url');
   const full=new URL(source,document.baseURI);
   if(full.origin!==location.origin)return;
   title.textContent=trigger.getAttribute('data-demo-title')||(document.documentElement.lang==='en'?'University demo':'Demo universitaria');
   frame.title=title.textContent;
   ext.href=full.href;
   opener=trigger;
   frame.src=full.href;
   if(typeof dialog.showModal==='function')dialog.showModal();
   else window.open(full.href,'_blank','noopener,noreferrer');
  });
 }
 close.addEventListener('click',dismiss);
 dialog.addEventListener('click',e=>{if(e.target===dialog)dismiss()});
 dialog.addEventListener('close',()=>{frame.src='about:blank';opener?.focus();opener=null});
})();


/* Desktop-only ambient pointer light; passive, frame-throttled, optional. */
(() => {
  'use strict';
  const hero = document.querySelector('.hero');
  if (!hero || !window.matchMedia('(hover:hover) and (pointer:fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let pending = false;
  let x = 70, y = 38;
  hero.addEventListener('pointermove', event => {
    const rect = hero.getBoundingClientRect();
    x = (100 * (event.clientX - rect.left) / Math.max(1, rect.width)).toFixed(2);
    y = (100 * (event.clientY - rect.top) / Math.max(1, rect.height)).toFixed(2);
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      hero.style.setProperty('--light-x', x + '%');
      hero.style.setProperty('--light-y', y + '%');
      pending = false;
    });
  }, {passive:true});
})();

/* Portfolio 2.2 — small, accessible glow following the real mouse cursor. */
(() => {
  'use strict';
  const mouse = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!mouse.matches || reduced.matches) return;

  const aura = document.createElement('div');
  aura.className = 'gdg-cursor-aura';
  aura.setAttribute('aria-hidden', 'true');
  document.body.append(aura);

  let positionX = -150;
  let positionY = -150;
  let pending = false;
  const hide = () => document.body.classList.remove('gdg-mouse-active');

  document.addEventListener('pointermove', event => {
    if ((event.pointerType && event.pointerType !== 'mouse') ||
        !mouse.matches || reduced.matches ||
        event.target.closest('dialog[open]')) {
      hide();
      return;
    }
    positionX = event.clientX - 48;
    positionY = event.clientY - 48;
    aura.classList.toggle('is-over-action', Boolean(
      event.target.closest('a,button,[role="button"],.dg-feature-card,.dg-academic-card,.credential-card')
    ));
    document.body.classList.add('gdg-mouse-active');
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      aura.style.transform = 'translate3d(' +
        Math.round(positionX) + 'px,' + Math.round(positionY) + 'px,0)';
      pending = false;
    });
  }, {passive:true});

  document.addEventListener('pointerout', event => {
    if (!event.relatedTarget) hide();
  }, {passive:true});
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hide();
  });
  if (reduced.addEventListener) reduced.addEventListener('change', hide);
  if (mouse.addEventListener) mouse.addEventListener('change', hide);
})();


/* Visual-only progressive enhancement: evidence-based stack bars. */
(() => {
  'use strict';
  const panel = document.querySelector('.stack-map');
  if (!panel) return;
  const show = () => panel.classList.add('stack-ready');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    show();
    return;
  }
  panel.classList.add('stack-animate');
  const observer = new IntersectionObserver((entries, instance) => {
    if (entries.some(entry => entry.isIntersecting)) {
      show();
      instance.disconnect();
    }
  }, {threshold:0.12,rootMargin:'0px 0px -48px 0px'});
  observer.observe(panel);
})();


/* Language persistence: standard links work even with JavaScript disabled. */
(() => {
  'use strict';
  const key = 'gdg-language';
  const path = window.location.pathname.replace(/index\.html$/, '');
  const english = document.documentElement.lang === 'en';
  let stored = null;
  try { stored = window.localStorage.getItem(key); } catch (_) {}
  // Only auto-redirect from the default Italian landing pages.
  if (!english && stored === 'en' && (path === '/' || path === '/portfolio/')) {
    window.location.replace((path === '/portfolio/' ? '/portfolio/en/' : '/en/') + window.location.hash);
    return;
  }
  document.querySelectorAll('.locale-switch a[data-locale]').forEach(link => {
    link.addEventListener('click', event => {
      const lang = link.getAttribute('data-locale');
      if (!lang || (lang !== 'it' && lang !== 'en')) return;
      try { window.localStorage.setItem(key, lang); } catch (_) {}
      // Preserve the current section during the language switch.
      const url = new URL(link.href);
      url.hash = window.location.hash;
      event.preventDefault();
      window.location.assign(url.href);
    });
  });
})();

/* Release notes project filter — fully readable without JavaScript.
   Progressive enhancement only: on JS-enabled pages show six latest by default;
   filtering reveals every matching release. */
(() => {
  'use strict';
  const buttons = [...document.querySelectorAll('[data-update-filter]')];
  const cards = [...document.querySelectorAll('[data-update-project]')];
  const more = document.getElementById('release-more');
  if (!buttons.length || !cards.length) return;
  let expanded = false;
  let selectedProject = 'all';
  const applyFilter = (slug) => {
    const exists = slug === 'all' || cards.some(card => card.dataset.updateProject === slug);
    if (!exists) return;
    selectedProject = slug;
    let matchIndex = 0;
    cards.forEach(card => {
      const matches = slug === 'all' || card.dataset.updateProject === slug;
      card.hidden = !matches || (slug === 'all' && !expanded && matchIndex >= 6);
      if (matches) matchIndex++;
    });
    buttons.forEach(button => {
      const active = button.dataset.updateFilter === slug;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-active', active);
    });
    if (more) more.hidden = slug !== 'all' || expanded || cards.length <= 6;
  };
  buttons.forEach(button => {
    button.addEventListener('click', () => applyFilter(button.dataset.updateFilter));
  });
  if (more) {
    more.addEventListener('click', () => {
      expanded = true;
      applyFilter(selectedProject);
    });
  }
  document.querySelectorAll('[data-update-target]').forEach(link => {
    link.addEventListener('click', () => applyFilter(link.dataset.updateTarget));
  });
  const changeFromHash = () => {
    const match = /^#updates-([a-z0-9-]+)$/.exec(window.location.hash);
    if (!match) return;
    applyFilter(match[1]);
    const section = document.getElementById('aggiornamenti');
    if (section) section.scrollIntoView({block:'start'});
  };
  window.addEventListener('hashchange', changeFromHash);
  applyFilter('all');
  changeFromHash();
})();

/* Live Italian time in Europe/Rome, with automatic CET/CEST handling. */
(() => {
  'use strict';
  const widget = document.querySelector('[data-rome-clock]');
  if (!widget) return;
  const timeNode = widget.querySelector('[data-clock-time]');
  const dateNode = widget.querySelector('[data-clock-date]');
  const zoneNode = widget.querySelector('[data-clock-zone]');
  const offsetNode = widget.querySelector('[data-clock-offset]');
  const zone = 'Europe/Rome';
  const locale = document.documentElement.lang === 'en' ? 'en-GB' : 'it-IT';
  const shortDate = new Intl.DateTimeFormat(locale, { timeZone: zone, weekday: 'short', day: 'numeric', month: 'short' });
  const fullDate = new Intl.DateTimeFormat(locale, { timeZone: zone, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const time = new Intl.DateTimeFormat(locale, { timeZone: zone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const timezone = new Intl.DateTimeFormat('en-GB', { timeZone: zone, timeZoneName: 'short' });
  const offset = new Intl.DateTimeFormat('en-GB', { timeZone: zone, timeZoneName: 'shortOffset' });
  const tick = () => {
    const now = new Date();
    const zoneName = timezone.formatToParts(now).find(p => p.type === 'timeZoneName')?.value || zone;
    const utc = offset.formatToParts(now).find(p => p.type === 'timeZoneName')?.value?.replace('GMT', 'UTC') || '';
    if (timeNode) { timeNode.textContent = time.format(now); timeNode.dateTime = now.toISOString(); }
    if (dateNode) dateNode.textContent = shortDate.format(now);
    if (zoneNode) zoneNode.textContent = zoneName;
    if (offsetNode) offsetNode.textContent = utc;
    const detail = (locale === 'en-GB' ? 'Italy time: ' : 'Ora italiana: ') + fullDate.format(now) + ', ' + time.format(now) + ', ' + zoneName + (utc ? ' (' + utc + ')' : '');
    widget.title = detail;
    widget.setAttribute('aria-label', detail);
  };
  tick();
  window.setInterval(tick, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
})();
