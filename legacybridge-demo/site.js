(() => {'use strict';const tabs=[...document.querySelectorAll('[role="tab"]')];const panels=[...document.querySelectorAll('[role="tabpanel"]')];const activate=tab=>{tabs.forEach(t=>{const on=t===tab;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1});panels.forEach(p=>p.hidden=p.id!==tab.getAttribute('aria-controls'))};tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',event=>{let index=null;if(event.key==='ArrowRight')index=(i+1)%tabs.length;if(event.key==='ArrowLeft')index=(i-1+tabs.length)%tabs.length;if(event.key==='Home')index=0;if(event.key==='End')index=tabs.length-1;if(index===null)return;event.preventDefault();activate(tabs[index]);tabs[index].focus()})})})();
/* IT/EN demo navigation — functional links with graceful no-JS fallback. */
(() => {
  'use strict';
  const key = 'gdg-language';
  const path = window.location.pathname.replace(/index\.html$/, '');
  const english = document.documentElement.lang === 'en';
  let stored = null;
  try { stored = window.localStorage.getItem(key); } catch (_) {}
  if (!english && stored === 'en' && path === '/legacybridge-demo/') {
    window.location.replace('/legacybridge-demo/en/' + window.location.hash);
    return;
  }
  document.querySelectorAll('.locale-switch a[data-locale]').forEach(link => {
    link.addEventListener('click', event => {
      const lang = link.getAttribute('data-locale');
      if (lang !== 'it' && lang !== 'en') return;
      try { window.localStorage.setItem(key, lang); } catch (_) {}
      const url = new URL(link.href);
      url.hash = window.location.hash;
      event.preventDefault();
      window.location.assign(url.href);
    });
  });
})();
