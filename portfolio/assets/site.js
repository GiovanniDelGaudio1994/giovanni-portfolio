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
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach(el => {
        if (!el.classList.contains('is-visible') && el.getBoundingClientRect().top < threshold) el.classList.add('is-visible');
      });
    }
    let active = '';
    sections.forEach(section => { if (section.getBoundingClientRect().top <= window.innerHeight * .36) active = section.id; });
    allNavLinks.forEach(link => {
      if (link.getAttribute('href') === `#${active}`) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };
  const requestScroll = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); } };

  // Reveal only elements crossing the viewport; avoids scanning all cards on every scroll.
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      for (const item of entries) {
        if (item.isIntersecting) {
          item.target.classList.add('is-visible');
          observer.unobserve(item.target);
        }
      }
    }, {rootMargin:'0px 0px 100px 0px',threshold:0.01});
    revealItems.forEach(el => revealObserver.observe(el));
  }
  // Enable entrance transitions only after initialization so content never disappears if JS fails.
  if (!reduceMotion.matches && window.innerWidth > 700) {
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
   Progressive enhancement only: on JS-enabled pages show four latest by default;
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
      card.hidden = !matches || (slug === 'all' && !expanded && matchIndex >= 4);
      if (matches) matchIndex++;
    });
    buttons.forEach(button => {
      const active = button.dataset.updateFilter === slug;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-active', active);
    });
    if (more) more.hidden = slug !== 'all' || expanded || cards.length <= 4;
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
  window.setInterval(tick, 30000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
})();


/* Keyboard-accessible, entirely local portfolio command panel.
   Commands are a fixed allowlist; input never runs JavaScript or shell code. */
(() => {
  'use strict';
  const root = document.querySelector('[data-portfolio-terminal]');
  if (!root) return;
  const form = root.querySelector('[data-terminal-form]');
  const field = root.querySelector('[data-terminal-input]');
  const output = root.querySelector('[data-terminal-output]');
  if (!form || !field || !output) return;
  const en = document.documentElement.lang === 'en';
  const lines = {
    help: en ? 'Commands: help, about, skills, projects, contact, cv, clear.' :
      'Comandi: help, about, skills, projects, contact, cv, clear.',
    about: en ? 'Giovanni — Computer Science student and junior software developer.' :
      'Giovanni — studente di Informatica e junior software developer.',
    skills: 'Flutter · Dart · Java · Python · SQL · Web',
    projects: en ? 'Open the projects section:' : 'Vai ai progetti:',
    contact: en ? 'Go to the contact section:' : 'Vai ai contatti:',
    cv: en ? 'Open my CV (PDF):' : 'Apri il curriculum (PDF):',
    unknown: en ? 'Unknown command. Type help.' : 'Comando sconosciuto. Digita help.'
  };
  const whitelist = new Set(['help','about','skills','projects','contact','cv','clear']);
  const destinations = {
    projects: {href:'#progetti', text: en ? 'View projects ↗' : 'Vedi progetti ↗'},
    contact: {href:'#contatti', text: en ? 'Contact ↗' : 'Contatti ↗'},
    cv: {href:'/cv/CV_Giovanni_Del_Gaudio_HR_2026_v4.pdf', text:'CV PDF ↗'}
  };
  const addLine = (message, className, link) => {
    const row = document.createElement('div');
    row.className = 'terminal-line' + (className ? ' ' + className : '');
    row.appendChild(document.createTextNode(message));
    if (link) {
      row.appendChild(document.createTextNode(' '));
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = link.text;
      row.appendChild(anchor);
    }
    output.appendChild(row);
    while (output.children.length > 8) output.firstElementChild.remove();
    output.scrollTop = output.scrollHeight;
  };
  form.addEventListener('submit', event => {
    event.preventDefault();
    const command = field.value.trim().toLowerCase();
    field.value = '';
    if (!command) return;
    if (command === 'clear') {
      output.textContent = en ? 'Terminal cleared. Type help.' : 'Terminale pulito. Digita help.';
      return;
    }
    addLine('> ' + command, 'command');
    if (!whitelist.has(command)) { addLine(lines.unknown, 'error'); return; }
    addLine(lines[command], '', destinations[command]);
  });
  // Stop page-level keyboard shortcuts while the visitor is entering commands.
  field.addEventListener('keydown', event => {
    if (event.key === 'Escape') field.blur();
  });
})();



/* Project slider — native CSS snap + optional arrows; no autoplay or third-party JS. */
(() => {
  'use strict';
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  for (const slider of document.querySelectorAll('.project-slider')) {
    const buttons = [...document.querySelectorAll('[data-slide-target="' + slider.id + '"]')];
    const cards = [...slider.querySelectorAll(':scope > article')];
    if (!cards.length) continue;
    let pending = false;
    const update = () => {
      pending = false;
      const max = Math.max(0,slider.scrollWidth - slider.clientWidth);
      for(const button of buttons){
        button.disabled = button.dataset.slideDir === '-1'
          ? slider.scrollLeft < 5
          : slider.scrollLeft >= max - 5;
      }
    };
    const request = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(update);
    };
    buttons.forEach(button => button.addEventListener('click', () => {
      const dir = Number(button.dataset.slideDir) || 1;
      const current = slider.scrollLeft;
      const next = dir > 0
        ? cards.find(card => card.offsetLeft - cards[0].offsetLeft > current + 10)
        : [...cards].reverse().find(card => card.offsetLeft - cards[0].offsetLeft < current - 10);
      const target = next ? next.offsetLeft - cards[0].offsetLeft : (dir>0?slider.scrollWidth:0);
      slider.scrollTo({left:Math.max(0,target),behavior:isReduced.matches?'instant':'smooth'});
    }));
    slider.addEventListener('scroll',request,{passive:true});
    window.addEventListener('resize',request,{passive:true});
    update();
  }
})();


/* Developer Growth Tree — SVG branch draw, node buds and accessible viewport reveal.
   Progressive enhancement: existing branches remain when JS is unavailable.
   Desktop only; native mobile carousel, no scroll hijacking, reduced-motion fallback. */
(() => {
  'use strict';
  const section = document.querySelector('#progetti.project-tree-edition');
  if (!section) return;
  const grids = [...section.querySelectorAll('.project-slider')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const cards = grids.flatMap(grid => [...grid.querySelectorAll(':scope > article')]);
  const svgNS = 'http://www.w3.org/2000/svg';
  let ticking = false;
  let observer = null;

  // Decorative markup is hidden from assistive technology and never receives focus.
  for (const card of cards) {
    if (card.querySelector('.tree-twig')) continue;
    const twig = document.createElementNS(svgNS, 'svg');
    twig.setAttribute('viewBox', '0 0 41 62');
    twig.setAttribute('class', 'tree-twig');
    twig.setAttribute('aria-hidden', 'true');
    twig.setAttribute('focusable', 'false');
    const branch = document.createElementNS(svgNS, 'path');
    branch.setAttribute('d', 'M0 31 C11 31 12 17 21 31 S33 31 41 31');
    twig.append(branch);
    const node = document.createElement('span');
    node.className = 'tree-node';
    node.setAttribute('aria-hidden', 'true');
    const bud = document.createElement('span');
    bud.className = 'tree-bud';
    bud.setAttribute('aria-hidden', 'true');
    card.append(twig, node, bud);
  }
  section.classList.add('tree-embellished');

  const measure = () => {
    ticking = false;
    if (motion.matches) return;
    const checkpoint = window.innerHeight * 0.63;
    for (const grid of grids) {
      const rect = grid.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (checkpoint - rect.top) / Math.max(1, rect.height)));
      grid.style.setProperty('--tree-progress', (progress * 100).toFixed(2) + '%');
    }
  };
  const schedule = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(measure);
  };
  const configure = () => {
    observer?.disconnect();
    observer = null;
    const animate = !motion.matches;
    if (animate && 'IntersectionObserver' in window) {
      cards.forEach(card => {
        card.classList.toggle('tree-visible', card.classList.contains('tree-visible') ||
          card.getBoundingClientRect().top < window.innerHeight * .96);
      });
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('tree-visible');
          entry.target.classList.toggle('tree-in-view', entry.isIntersecting);
        });
      }, {rootMargin:'0px 0px -10% 0px',threshold:0.06});
      cards.forEach(card => observer.observe(card));
      document.documentElement.classList.add('tree-motion-ready');
    } else {
      document.documentElement.classList.remove('tree-motion-ready');
      cards.forEach(card => {
        card.classList.add('tree-visible');
        card.classList.remove('tree-in-view');
      });
      grids.forEach(grid => grid.style.setProperty('--tree-progress','100%'));
    }
    schedule();
  };
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule, {passive:true});
  motion.addEventListener?.('change', configure);
  configure();
})();
