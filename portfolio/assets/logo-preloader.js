/* Non-blocking, one-per-tab logo reveal. Always clears the overlay. */
(()=>{'use strict';const overlay=document.getElementById('dg-preloader');if(!overlay)return;
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const seen=(()=>{try{return sessionStorage.getItem('dg-preloader-seen')==='1'}catch{return false}})();
let finished=false;const started=performance.now();
function finish(){if(finished)return;finished=true;overlay.classList.add('is-done');overlay.setAttribute('aria-hidden','true');try{sessionStorage.setItem('dg-preloader-seen','1')}catch{}setTimeout(()=>overlay.remove(),600)}
if(reduce||seen){finish();return}
function ready(){const elapsed=performance.now()-started;setTimeout(finish,Math.max(0,1250-elapsed))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
setTimeout(finish,2400);
})();
