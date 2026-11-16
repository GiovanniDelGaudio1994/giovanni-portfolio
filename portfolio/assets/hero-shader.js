/* Portfolio 2.4: lightweight, progressive WebGL orbital field.
   Runs only for visible hero content on motion-enabled desktop/tablet;
   pre-existing CSS orbit animation remains the full fallback.
   No tracking, external libraries, remote shaders or microphone/camera. */
(() => {
  'use strict';
  const canvas = document.querySelector('[data-hero-shader]');
  if (!canvas || !window.WebGLRenderingContext) return;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const small = window.matchMedia('(max-width: 700px)');
  if (media.matches || small.matches || navigator.connection?.saveData) return;
  const hero = canvas.closest('.hero-visual');
  const gl = canvas.getContext('webgl', {
    alpha: true, antialias: false, depth: false, stencil: false,
    premultipliedAlpha: true, powerPreference: 'low-power'
  });
  if (!gl) return;
  const vertex = 'attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}';
  const fragment = `precision mediump float;
uniform vec2 resolution;
uniform float time;
void main(){
 vec2 uv = (gl_FragCoord.xy-.5*resolution)/min(resolution.x,resolution.y);
 float theta=atan(uv.y,uv.x), r=length(uv);
 float spin=theta+time*.13;
 float rings=exp(-pow((r-.385-.012*sin(3.*spin)),2.)*2100.);
 float outer=exp(-pow((r-.60-.025*cos(2.*spin+time*.09)),2.)*1200.);
 float ripple=pow(max(0.,sin(spin*5.+time*.18)),4.);
 float specks=pow(max(0.,cos(spin*9.-time*.23)),24.);
 float mask=smoothstep(.16,.44,r)*(1.-smoothstep(.69,.85,r));
 vec3 blue=vec3(.13,.47,1.);
 vec3 cyan=vec3(.27,.82,1.);
 float w=(rings*.16+outer*.12+specks*.10*ripple)*mask;
 float aura=.018*exp(-pow((r-.49)*4.,2.));
 float alpha=clamp(w+aura,0.,.31);
 gl_FragColor=vec4(mix(blue,cyan,.5+.5*sin(spin*2.+time*.19))*alpha,alpha);
}`;
  const shader = (kind,source) => {
    const s = gl.createShader(kind);
    if (!s) return null;
    gl.shaderSource(s,source); gl.compileShader(s);
    if (!gl.getShaderParameter(s,gl.COMPILE_STATUS)) { gl.deleteShader(s);return null; }
    return s;
  };
  const v=shader(gl.VERTEX_SHADER,vertex), f=shader(gl.FRAGMENT_SHADER,fragment);
  if (!v || !f) return;
  const program=gl.createProgram();
  if (!program) return;
  gl.attachShader(program,v);gl.attachShader(program,f);gl.linkProgram(program);
  if (!gl.getProgramParameter(program,gl.LINK_STATUS)) return;
  gl.useProgram(program);
  const b=gl.createBuffer();if(!b)return;
  gl.bindBuffer(gl.ARRAY_BUFFER,b);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(program,'position');
  gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const uRes=gl.getUniformLocation(program,'resolution'),uTime=gl.getUniformLocation(program,'time');
  let visible=true,raf=0,active=false,contextLost=false,last=0;
  const resize=()=>{
    const rect=canvas.getBoundingClientRect();
    const dpr=Math.min(1.5,window.devicePixelRatio||1);
    const w=Math.max(1,Math.round(rect.width*dpr)),h=Math.max(1,Math.round(rect.height*dpr));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}
  };
  const frame=stamp=>{
    raf=0;
    if(!active||contextLost)return;
    if(stamp-last>=30){
      last=stamp;resize();
      gl.uniform2f(uRes,canvas.width,canvas.height);
      gl.uniform1f(uTime,stamp*.001);
      gl.drawArrays(gl.TRIANGLES,0,6);
    }
    raf=window.requestAnimationFrame(frame);
  };
  const eligible=()=>!media.matches&&!small.matches&&!document.hidden&&visible&&!contextLost;
  const sync=()=>{
    const allowed=eligible();
    if(allowed&&!active){active=true;raf=window.requestAnimationFrame(frame)}
    else if(!allowed&&active){active=false;window.cancelAnimationFrame(raf);raf=0}
  };
  const observer=('IntersectionObserver' in window)
    ? new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);sync()},{threshold:0.08})
    : null;
  observer?.observe(hero);
  document.addEventListener('visibilitychange',sync);
  media.addEventListener?.('change',sync);small.addEventListener?.('change',sync);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();contextLost=true;sync()});
  canvas.addEventListener('webglcontextrestored',()=>{contextLost=false;sync()});
  sync();
})();