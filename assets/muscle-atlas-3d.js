import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const groups=[
 {id:'chest',name:'Pettorali',color:0xd04cf9,description:'Area muscolare anteriore del torace, coinvolta soprattutto nei movimenti di spinta.',exercise:'Push-up facilitato',instruction:'Spinta a corpo libero con difficoltà adattabile. Movimento indicativo, non un programma individuale.',area:'Parte superiore'},
 {id:'shoulders',name:'Spalle',color:0x7c74ff,description:'Area deltoidea e articolazioni della spalla, coinvolte nel sollevamento e nel controllo delle braccia.',exercise:'Alzate laterali leggere',instruction:'Esempio di elevazione laterale controllata con carico gestibile.',area:'Parte superiore'},
 {id:'arms',name:'Braccia',color:0xff68bc,description:'Insieme semplificato dei muscoli anteriori e posteriori del braccio che partecipano alla flessione e all’estensione del gomito.',exercise:'Curl con manubri',instruction:'Esempio di flessione del gomito, senza indicazioni personalizzate di peso o volume.',area:'Parte superiore'},
 {id:'core',name:'Addome',color:0x42b9f8,description:'Muscolatura del tronco coinvolta nella stabilizzazione, nel controllo della postura e nei movimenti del busto.',exercise:'Dead bug semplificato',instruction:'Esempio di esercizio di controllo del tronco, da adattare alle proprie capacità.',area:'Core'},
 {id:'back',name:'Dorsali',color:0x9656ff,description:'Ampia area muscolare posteriore del tronco, coinvolta nei movimenti di trazione.',exercise:'Rematore con manubrio',instruction:'Esempio di movimento di trazione con attenzione al controllo del busto.',area:'Parte superiore'},
 {id:'glutes',name:'Glutei',color:0xff7c96,description:'Muscolatura posteriore del bacino coinvolta nell’estensione e stabilizzazione dell’anca.',exercise:'Ponte glutei',instruction:'Esempio di sollevamento controllato del bacino da posizione supina.',area:'Parte inferiore'},
 {id:'legs',name:'Gambe',color:0x7b88ff,description:'Vista semplificata di quadricipiti, posteriori della coscia e polpacci, coinvolti nel movimento delle gambe.',exercise:'Squat a corpo libero',instruction:'Esempio di piegamento e risalita con ampiezza e difficoltà adeguate alle capacità.',area:'Parte inferiore'}
];
const stage=document.getElementById('stage');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.55;
stage.appendChild(renderer.domElement);
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(37,1,.1,100);
camera.position.set(0,.15,9.1);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.065;
controls.enablePan=false;controls.minDistance=6.7;controls.maxDistance=13;
controls.minPolarAngle=.3;controls.maxPolarAngle=Math.PI-.3;
controls.target.set(0,.05,0);
scene.add(new THREE.HemisphereLight(0xcad3ff,0x1c1c56,2.1));
const key=new THREE.DirectionalLight(0xe9c1ff,3.4);key.position.set(3,6,5);scene.add(key);
const blue=new THREE.PointLight(0x527aff,65,12);blue.position.set(-3,-1,2);scene.add(blue);
const rim=new THREE.PointLight(0xae55ff,50,12);rim.position.set(3,2,-4);scene.add(rim);
// Two separate procedural models. All geometry is original, simplified anatomy.
const modelRoot=new THREE.Group();scene.add(modelRoot);
const baseMat=new THREE.MeshStandardMaterial({color:0x435276,metalness:.25,roughness:.44});
const jointMat=new THREE.MeshStandardMaterial({color:0x304066,metalness:.28,roughness:.42});
const modelParts={male:[],female:[]};
function makeBody(type){
 const female=type==='female';
 const body=new THREE.Group();
 const list=modelParts[type];
 const make=(x,y,z,sx,sy,sz,group=null,rot=0)=>{
  const mat=group?new THREE.MeshStandardMaterial({color:0x3e466c,metalness:.28,roughness:.4,emissive:0x080816,emissiveIntensity:.24}):baseMat;
  const obj=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),mat);
  obj.position.set(x,y,z);obj.scale.set(sx,sy,sz);obj.rotation.z=rot;
  obj.userData.group=group;body.add(obj);if(group)list.push(obj);
  return obj;
 };
 const bone=(x,y,z,sx,sy,sz,rot=0)=>{
  const obj=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),jointMat);
  obj.position.set(x,y,z);obj.scale.set(sx,sy,sz);obj.rotation.z=rot;body.add(obj);
 };
 const shoulder=female?.60:.70,hip=female?.56:.47;
 make(0,2.12,0,female?.34:.38,.42,.34);
 bone(0,1.67,0,.15,.19,.15);
 make(0,.85,0,shoulder,.88,.35);
 make(0,-.16,0,hip,.37,.36);
 for(const s of [-1,1]){
  make(s*(female?.28:.33),1.20,.30,female?.29:.34,female?.30:.37,.16,'chest',s*.10);
  make(s*(female?.62:.72),1.37,.03,female?.24:.29,.25,.29,'shoulders');
  make(s*(female?.77:.86),.87,.05,female?.165:.205,.42,.20,'arms',s*.1);
  make(s*(female?.87:.96),.14,.07,female?.155:.18,.38,.17,'arms',-s*.1);
  bone(s*(female?.87:.96),-.19,.07,.14,.15,.14);
  make(s*(female?.31:.33),-.72,0,female?.28:.30,.53,.29,'legs',-s*.05);
  bone(s*.33,-1.25,0,.22,.23,.23);
  make(s*.33,-1.69,.02,female?.18:.21,.45,.20,'legs',s*.03);
  make(s*.34,-2.14,.19,.22,.12,.38);
  make(s*(female?.31:.27),-.18,-.33,female?.32:.27,.34,.15,'glutes');
  make(s*(female?.30:.35),.56,-.33,female?.26:.30,.64,.14,'back',s*.04);
 }
 for(let i=0;i<3;i++)for(const s of [-1,1]){
  make(s*(female?.17:.19),.91-i*.30,.33,.16,.13,.085,'core');
 }
 make(0,-.04,.31,.27,.17,.12,'core');
 body.visible=type==='male';
 modelRoot.add(body);
 return body;
}
const bodies={male:makeBody('male'),female:makeBody('female')};
let model='male',body=bodies.male,transition=1;
let renderMode='3d';
const artStage=document.getElementById('art-stage');
const artImages=[...document.querySelectorAll('[data-art]')];
function refreshArt(){
 artImages.forEach(img=>{img.hidden=img.dataset.art!==model;});
 const current=artImages.find(img=>img.dataset.art===model);
 artStage.classList.toggle('failed',!current?.complete||!current.naturalWidth);
}
function setRenderMode(mode){
 if(mode!=='art'&&mode!=='3d')return;
 renderMode=mode;
 artStage.classList.toggle('active',mode==='art');
 document.querySelector('.viewer').classList.toggle('art-active',mode==='art');
 document.querySelectorAll('[data-render]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.render===mode)));
 refreshArt();
}
let manuallySelectedMode=false;
artImages.forEach(img=>{img.addEventListener('load',()=>{refreshArt();if(!manuallySelectedMode&&img.dataset.art===model)setRenderMode('art');});img.addEventListener('error',refreshArt);});
document.querySelectorAll('[data-render]').forEach(btn=>btn.addEventListener('click',()=>{manuallySelectedMode=true;setRenderMode(btn.dataset.render)}));
function activeMuscles(){return modelParts[model];}
function chooseModel(next,{persist=true}={}){
 if(!bodies[next]||model===next)return;
 const old=bodies[model],incoming=bodies[next];
 incoming.rotation.y=old.rotation.y;
 old.visible=false;incoming.visible=true;
 incoming.scale.setScalar(.96);transition=0;
 model=next;body=incoming;
 if(persist){try{localStorage.setItem('forma-ai-atlas-model',next)}catch{}}
 document.querySelectorAll('[data-model]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.model===model)));
 setActive(active);refreshArt();
}
const floor=new THREE.Mesh(new THREE.RingGeometry(1.16,1.19,90),new THREE.MeshBasicMaterial({color:0x7957f9,transparent:true,opacity:.5,side:THREE.DoubleSide}));
floor.rotation.x=-Math.PI/2;floor.position.y=-2.42;scene.add(floor);
const floor2=new THREE.Mesh(new THREE.CircleGeometry(1.08,90),new THREE.MeshBasicMaterial({color:0x46248a,transparent:true,opacity:.09,side:THREE.DoubleSide}));
floor2.rotation.x=-Math.PI/2;floor2.position.y=-2.43;scene.add(floor2);
const raycaster=new THREE.Raycaster();const pointer=new THREE.Vector2();
let active='chest',rotating=false,previous={x:0,y:0},drag=false,raf=0;
const buttonHolder=document.getElementById('muscles');
for(const group of groups){
 const button=document.createElement('button');button.type='button';button.className='muscle';button.dataset.group=group.id;button.textContent=group.name;
 button.addEventListener('click',()=>setActive(group.id));buttonHolder.appendChild(button);
}
function setActive(id){
 active=id;const g=groups.find(x=>x.id===id)||groups[0];
 document.getElementById('muscle-name').textContent=g.name;
 document.getElementById('muscle-description').textContent=g.description;
 document.getElementById('exercise-title').textContent=g.exercise;
 document.getElementById('exercise-description').textContent=g.instruction;
 document.getElementById('exercise-area').textContent=g.area;
 buttonHolder.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.group===id));
 modelParts.male.concat(modelParts.female).forEach(mesh=>{
  const selected=mesh.userData.group===id&&modelParts[model].includes(mesh);
  mesh.material.color.setHex(selected?g.color:0x354161);
  mesh.material.emissive.setHex(selected?g.color:0x070a18);
  mesh.material.emissiveIntensity=selected?.28:.12;
  mesh.material.metalness=selected?.15:.33;
 });
}
setActive('chest');
document.querySelectorAll('[data-model]').forEach(b=>b.addEventListener('click',()=>chooseModel(b.dataset.model)));
try{const preferred=localStorage.getItem('forma-ai-atlas-model');if(preferred==='female')chooseModel('female',{persist:false});}catch{}
setRenderMode('3d');
if(artImages.some(img=>img.dataset.art===model&&img.complete&&img.naturalWidth))setRenderMode('art');
stage.addEventListener('pointerdown',e=>{previous={x:e.clientX,y:e.clientY};drag=false});
stage.addEventListener('pointermove',e=>{if(Math.abs(e.clientX-previous.x)>5||Math.abs(e.clientY-previous.y)>5)drag=true});
stage.addEventListener('click',event=>{
 if(drag||renderMode==='art')return;
 const rect=renderer.domElement.getBoundingClientRect();
 pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
 raycaster.setFromCamera(pointer,camera);
 const hit=raycaster.intersectObjects(activeMuscles(),false)[0];
 if(hit?.object.userData.group)setActive(hit.object.userData.group);
});
document.getElementById('front').addEventListener('click',()=>{rotating=false;syncSpin();body.rotation.y=0;controls.reset()});
document.getElementById('back').addEventListener('click',()=>{rotating=false;syncSpin();body.rotation.y=Math.PI;controls.reset()});
document.getElementById('reset').addEventListener('click',()=>{body.rotation.y=0;rotating=false;syncSpin();controls.reset();setActive('chest')});
document.getElementById('spin').addEventListener('click',()=>{rotating=!rotating;syncSpin()});
function syncSpin(){document.getElementById('spin').setAttribute('aria-pressed',String(rotating));}
const size=new ResizeObserver(()=>{const w=stage.clientWidth||700,h=stage.clientHeight||600;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)});
size.observe(stage);
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let last=performance.now();
function draw(time){
 raf=requestAnimationFrame(draw);
 const dt=Math.min((time-last)/1000,.05);last=time;
 if(rotating&&renderMode==='3d'&&!reduceMotion)body.rotation.y+=dt*.44;
 if(transition<1){transition=reduceMotion?1:Math.min(1,transition+dt*3.2);const eased=1-Math.pow(1-transition,3);body.scale.setScalar(.96+.04*eased);}
 controls.update();renderer.render(scene,camera);
}
raf=requestAnimationFrame(draw);
window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);size.disconnect();controls.dispose();renderer.dispose()},{once:true});
