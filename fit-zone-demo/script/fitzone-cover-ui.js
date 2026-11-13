/* Fit Zone static portfolio demo. No backend calls; all form actions are simulated. */
'use strict';
const menuToggle = document.querySelector('.fz-menu-toggle');
const navLinks = document.querySelector('#fz-nav-links');
if (menuToggle && navLinks) {
  const closeMenu = () => { menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Apri il menu'); navLinks.classList.remove('is-open'); };
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
    navLinks.classList.toggle('is-open', open);
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', e => { if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) closeMenu(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuToggle.focus();
    }
  });
  // Chiudi il menu quando si passa da mobile/tablet a desktop.
  const desktopMedia = window.matchMedia('(min-width: 931px)');
  const handleViewportChange = () => { if (desktopMedia.matches) closeMenu(); };
  if (desktopMedia.addEventListener) desktopMedia.addEventListener('change', handleViewportChange);
  else if (desktopMedia.addListener) desktopMedia.addListener(handleViewportChange);
  // Non lasciare aperto il menu dopo aver selezionato un'ancora interna.
  window.addEventListener('hashchange', closeMenu);
}
const filters = [...document.querySelectorAll('.fz-filter[data-filter]')];
const cards = [...document.querySelectorAll('.fz-catalog-card[data-type]')];
const count = document.querySelector('#fz-result-count');
function setFilter(type) {
  let visible = 0;
  cards.forEach(card => {const show = type === 'all' || card.dataset.type === type; card.hidden = !show; if (show) visible++; });
  filters.forEach(btn => { const active = btn.dataset.filter === type; btn.classList.toggle('is-selected', active); btn.setAttribute('aria-pressed', String(active)); });
  if(count) count.textContent = `${visible} ${visible === 1 ? 'corso' : 'corsi'}`;
}
filters.forEach(btn => btn.addEventListener('click', () => setFilter(btn.dataset.filter)));
if (cards.length && location.hash) {
  const id = decodeURIComponent(location.hash.slice(1));
  const selected = document.getElementById(id);
  if (selected?.matches('.fz-catalog-card')) setFilter('all');
}
let toastTimeout;
const toast = document.querySelector('#fz-toast');
document.querySelectorAll('[data-demo-form]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    form.reset();
    if (!toast) return;
    clearTimeout(toastTimeout);
    toast.textContent = 'Questa è una demo frontend: il messaggio non è stato inviato né salvato.';
    toast.hidden = false;
    toastTimeout = setTimeout(() => { toast.hidden = true; }, 5200);
  });
});
