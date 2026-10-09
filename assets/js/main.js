(()=>{'use strict';
const d=document,w=window,$=(s,c=d)=>c.querySelector(s),$$=(s,c=d)=>[...c.querySelectorAll(s)];
const RM=w.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE=w.matchMedia('(pointer: fine)').matches;
const WA='https://wa.me/79771314777';
/* --- Moscow time / open status --- */
const msk=()=>{const p=new Intl.DateTimeFormat('ru-RU',{timeZone:'Europe/Moscow',hour:'2-digit',minute:'2-digit',weekday:'short',hour12:false}).formatToParts(new Date());const g=t=>(p.find(x=>x.type===t)||{}).value;return{h:+g('hour'),m:+g('minute'),wd:g('weekday')}};
const DAYS=['пн','вт','ср','чт','пт','сб','вс'];
function status(){const t=msk(),mins=t.h*60+t.m,open=mins>=540&&mins<1260;
 const txt=open?`Открыто до 21:00`:(mins<540?'Закрыто · откроемся в 09:00':'Закрыто · откроемся завтра в 09:00');
 $$('.js-status').forEach(e=>{e.classList.toggle('off',!open);e.lastElementChild.textContent=open?'Открыто · до 21:00':'Закрыто · с 09:00'});
 const s2=$('.js-status2');if(s2)s2.textContent='Сейчас: '+txt.toLowerCase();
 const c=$('.js-clock');if(c)c.textContent=String(t.h).padStart(2,'0')+':'+String(t.m).padStart(2,'0')+' МСК';
 const i=DAYS.indexOf((t.wd||'').toLowerCase().replace('.',''));const wk=$$('.js-week>div');wk.forEach((e,k)=>e.classList.toggle('today',k===i));}
status();setInterval(status,30000);
/* --- header / progress / mobile bar --- */
const hdr=$('#hdr'),prog=$('.prog'),mbar=$('.js-mbar');let lastY=0,tick=false;
function onScroll(){const y=w.scrollY,H=d.documentElement.scrollHeight-innerHeight;
 hdr.classList.toggle('s',y>40);hdr.classList.toggle('hide',y>lastY&&y>600&&!d.body.classList.contains('menu-open'));lastY=y;
 prog.style.transform=`scaleX(${H>0?y/H:0})`;if(mbar)mbar.classList.toggle('on',y>innerHeight*.6);
 pano();drift();par();tick=false;}
w.addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});
/* --- menu --- */
const bg=$('.burger'),mn=$('#mnav');bg.addEventListener('click',()=>{if(!mn.classList.contains('ready')){mn.classList.add('ready');mn.offsetWidth}const o=d.body.classList.toggle('menu-open');bg.setAttribute('aria-expanded',o)});
$$('.mnav a').forEach(a=>a.addEventListener('click',()=>{d.body.classList.remove('menu-open');bg.setAttribute('aria-expanded','false')}));
/* --- reveal --- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);if(e.target.dataset.count!==undefined||$('[data-count]',e.target))count(e.target)}}),{rootMargin:'0px 0px -10% 0px',threshold:.12});
$$('.rv,.h2,[data-count]').forEach(e=>io.observe(e));
function count(root){(root.dataset.count!==undefined?[root]:$$('[data-count]',root)).forEach(el=>{if(el._c)return;el._c=1;const to=+el.dataset.count,dec=+(el.dataset.dec||0);if(RM){el.textContent=to.toFixed(dec);return}
 const t0=performance.now(),D=1600;const f=n=>{const k=Math.min(1,(n-t0)/D),e=1-Math.pow(1-k,4);el.textContent=(to*e).toFixed(dec);if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)})}
/* --- manifest words light up on scroll --- */
const man=$('.js-words');let words=[];
function armMan(){if(!man||RM||words.length)return;const hl=['ДВС','КПП,','шиномонтаж,','09:00','21:00.','мойка'];man.innerHTML=man.textContent.trim().split(/\s+/).map(x=>`<span class="w${hl.includes(x)?' hl':''}">${x}</span>`).join(' ');words=$$('.w',man);man.classList.add('armed');manScroll()}
if(man&&!RM)new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){armMan();o.disconnect()}}),{rootMargin:'60% 0px'}).observe(man);
function manScroll(){if(!words.length)return;const r=man.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight*.85-r.top)/(r.height+innerHeight*.35)));const n=Math.round(p*words.length);words.forEach((x,i)=>x.classList.toggle('on',i<n))}
/* --- hero parallax --- */
const hm=$('.hero-media');function par(){manScroll();if(RM||!hm)return;const y=w.scrollY;if(y<innerHeight*1.2)hm.style.transform=`translate3d(0,${y*.18}px,0)`}
/* --- cine drift --- */
const dr=$('[data-drift]');function drift(){if(!dr||RM)return;const r=dr.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const p=(innerHeight-r.top)/(innerHeight+r.height);dr.style.transform=`translate3d(${(.5-p)*30}%,0,0) scale(${1+p*.08})`}
/* --- video lazy --- */
const v=$('.js-vid');if(v&&!RM&&!(navigator.connection&&navigator.connection.saveData)){new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){if(!v.src){v.src=v.dataset.src;v.addEventListener('playing',()=>v.style.opacity=1,{once:true})}v.play().catch(()=>{})}else if(v.src)v.pause()}),{rootMargin:'200px'}).observe(v)}
/* --- panorama horizontal pin --- */
const pS=$('#gallery'),tr=$('.js-track'),pb=$('.js-pbar'),pc=$('.js-pc'),shots=$$('.shot');let pOn=false,pDist=0;
function pSetup(){pOn=innerWidth>900&&!RM;if(!pOn){pS.style.height='';tr.style.transform='';return}pDist=Math.max(0,tr.scrollWidth-innerWidth);pS.style.height=(innerHeight+pDist)+'px';pano()}
function pano(){if(!pOn)return;const r=pS.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(pS.offsetHeight-innerHeight||1)));tr.style.transform=`translate3d(${-p*pDist}px,0,0)`;pb.style.transform=`scaleX(${p})`;pc.textContent=String(Math.min(shots.length,1+Math.floor(p*shots.length*.999))).padStart(2,'0')}
if(!pOn&&tr)tr.addEventListener('scroll',()=>{const i=Math.round(tr.scrollLeft/(tr.scrollWidth-tr.clientWidth||1)*(shots.length-1));pc.textContent=String(i+1).padStart(2,'0')},{passive:true});
let carOn=false;w.addEventListener('resize',()=>{pSetup();if(carOn)carSet()});
/* --- lightbox --- */
const lb=$('.js-lb'),li=$('img',lb),lc=$('.lb-c',lb),G=w.GAL||[];let gi=0,lastF;
function lbShow(i){gi=(i+G.length)%G.length;li.src=G[gi].s;li.alt=G[gi].a;lc.textContent=`${String(gi+1).padStart(2,'0')} / ${String(G.length).padStart(2,'0')} · ${G[gi].c}`}
function lbOpen(i){lastF=d.activeElement;lbShow(i);lb.classList.add('ready');lb.offsetWidth;lb.classList.add('open');$('.lb-x',lb).focus();d.body.style.overflow='hidden'}
function lbClose(){lb.classList.remove('open');d.body.style.overflow='';lastF&&lastF.focus()}
shots.forEach(s=>{s.addEventListener('click',()=>lbOpen(+s.dataset.i));s.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();lbOpen(+s.dataset.i)}})});
$('.lb-x',lb).onclick=lbClose;$('.lb-p',lb).onclick=()=>lbShow(gi-1);$('.lb-n',lb).onclick=()=>lbShow(gi+1);
lb.addEventListener('click',e=>{if(e.target===lb)lbClose()});
d.addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')lbClose();if(e.key==='ArrowLeft')lbShow(gi-1);if(e.key==='ArrowRight')lbShow(gi+1)});
/* --- service filter --- */
const cards=$$('.card');$$('.chip').forEach(c=>c.addEventListener('click',()=>{$$('.chip').forEach(x=>x.setAttribute('aria-pressed',x===c));const f=c.dataset.f;cards.forEach(k=>{const show=f==='all'||k.dataset.g===f;k.classList.toggle('hid',!show);if(show&&!RM){k.animate([{opacity:0,transform:'translateY(16px) scale(.98)'},{opacity:1,transform:'none'}],{duration:500,easing:'cubic-bezier(.2,.8,.1,1)'})}})}));
/* --- works search --- */
const q=$('.js-q'),cl=$$('.js-cloud li'),cw=$('.js-cloud'),mb=$('.js-more');if(mb)mb.onclick=()=>{cw.classList.remove('clip');mb.remove()};if(q)q.addEventListener('input',()=>{const s=q.value.trim().toLowerCase();if(s&&mb&&mb.isConnected){cw.classList.remove('clip');mb.remove()}cl.forEach(li=>{const m=s&&li.textContent.toLowerCase().includes(s);li.classList.toggle('hit',!!m);li.classList.toggle('dim',!!s&&!m)})});
/* --- configurator --- */
const form=$('.js-cfg'),list=$('.js-list'),tot=$('.js-tot'),send=$('.js-send');
const fmt=n=>n.toLocaleString('ru-RU').replace(/\u00a0/g,'\u202f')+' ₽';let shown=0;
function upd(){const ch=$$('input[name=w]:checked',form),sum=ch.reduce((a,x)=>a+ +x.dataset.p,0);
 list.innerHTML=ch.length?ch.map(x=>`<li><span>${x.dataset.t}</span><span>${fmt(+x.dataset.p)}</span></li>`).join(''):'<li class="empty">Выберите работы слева или нажмите «+» в прайсе</li>';
 const from=shown;shown=sum;if(RM)tot.textContent=fmt(sum);else{const t0=performance.now();const f=n=>{const k=Math.min(1,(n-t0)/500);tot.textContent=fmt(Math.round(from+(sum-from)*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
 const fd=new FormData(form);const car=[fd.get('t'),fd.get('b'),fd.get('m')].filter(Boolean).join(', ');
 const msg=['Здравствуйте! Хочу записаться в автосервис «Панорама».',car&&('Автомобиль: '+car),ch.length&&('Работы: '+ch.map(x=>x.dataset.t).join('; ')),'Когда удобно: '+fd.get('d'),fd.get('c')&&('Комментарий: '+fd.get('c')),fd.get('n')&&('Имя: '+fd.get('n'))].filter(Boolean).join('\n');
 send.href=WA+'?text='+encodeURIComponent(msg);
 $$('[data-add]').forEach(b=>{const i=$(`input[value="${b.dataset.add}"]`,form);b.classList.toggle('on',!!(i&&i.checked))});}
form.addEventListener('input',upd);form.addEventListener('change',upd);
$$('[data-add]').forEach(b=>b.addEventListener('click',()=>{const i=$(`input[value="${b.dataset.add}"]`,form);if(!i)return;i.checked=!i.checked;upd();
 const r=b.getBoundingClientRect();if(!RM&&i.checked){const p=d.createElement('span');p.textContent='+';p.style.cssText=`position:fixed;left:${r.left+r.width/2}px;top:${r.top}px;z-index:140;color:#fb524f;font:700 22px Oswald,sans-serif;pointer-events:none`;d.body.appendChild(p);p.animate([{transform:'translate(-50%,0)',opacity:1},{transform:'translate(-50%,-50px)',opacity:0}],{duration:700,easing:'ease-out'}).onfinish=()=>p.remove()}}));
upd();
/* --- reviews carousel --- */
const ctr=$('.js-ctr'),slides=$$('.rv-card',ctr),dots=$('.js-dots');let ci=0,per=3,pages=1,auto;
function carSet(){per=innerWidth<=600?1:innerWidth<=1100?2:3;pages=Math.max(1,slides.length-per+1);dots.innerHTML='';for(let i=0;i<pages;i++){const b=d.createElement('button');b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-label','Отзыв '+(i+1));b.onclick=()=>go(i);dots.appendChild(b)}go(Math.min(ci,pages-1))}
function go(i){ci=(i+pages)%pages;const s=slides[ci];ctr.style.transform=`translate3d(${-s.offsetLeft+slides[0].offsetLeft}px,0,0)`;$$('button',dots).forEach((b,k)=>b.setAttribute('aria-current',k===ci))}
$('.js-prev').onclick=()=>{go(ci-1);stop()};$('.js-next').onclick=()=>{go(ci+1);stop()};
function stop(){clearInterval(auto)}function start(){if(!RM){stop();auto=setInterval(()=>go(ci+1),6000)}}
const car=$('.js-car');car.addEventListener('mouseenter',stop);car.addEventListener('mouseleave',start);car.addEventListener('focusin',stop);
let sx=0,sy=0;ctr.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;stop()},{passive:true});
ctr.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))go(ci+(dx<0?1:-1))},{passive:true});
new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){if(!carOn){carOn=true;carSet()}start()}else stop()}),{rootMargin:'200px 0px'}).observe(car);
/* --- gauge --- */
const g=$('.js-g');if(g)new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){g.style.strokeDasharray=`${414.7*4.8/5} 1000`;o.disconnect()}}),{threshold:.4}).observe(g);
/* --- lazy map --- */
const mp=$('.js-map');function loadMap(){if(mp.dataset.l)return;mp.dataset.l=1;const f=d.createElement('iframe');f.src='https://yandex.ru/map-widget/v1/?ll=37.539443%2C55.472235&z=16&pt=37.539443%2C55.472235%2Cpm2rdm&oid=31852264831&ol=biz';f.title='Панорама на Яндекс Картах';f.loading='lazy';f.allowFullscreen=true;mp.appendChild(f);f.onload=()=>{const ph=$('.map-ph',mp);ph&&ph.animate([{opacity:1},{opacity:0}],{duration:500}).finished.then(()=>ph.remove())}}
$('.js-mapbtn').onclick=loadMap;
let ui=false;const arm=()=>{if(ui)return;ui=true;new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){loadMap();o.disconnect()}}),{rootMargin:'300px'}).observe(mp)};
['scroll','pointerdown','keydown','touchstart'].forEach(t=>w.addEventListener(t,arm,{once:true,passive:true}));
/* --- pointer FX: glow, dot, tilt, magnetic --- */
if(FINE&&!RM){const gl=$('.glow'),dt=$('.dot');let mx=-999,my=-999,gx=-999,gy=-999,raf=0;
 w.addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;d.body.classList.add('cur');if(!raf)raf=requestAnimationFrame(loop)},{passive:true});
 d.addEventListener('pointerleave',()=>d.body.classList.remove('cur'));
 function loop(){gx+=(mx-gx)*.14;gy+=(my-gy)*.14;gl.style.transform=`translate3d(${gx}px,${gy}px,0)`;dt.style.transform=`translate3d(${mx}px,${my}px,0)`;raf=Math.abs(mx-gx)+Math.abs(my-gy)>.5?requestAnimationFrame(loop):0}
 $$('a,button,.shot,label.opt').forEach(el=>{el.addEventListener('pointerenter',()=>dt.classList.add('big'));el.addEventListener('pointerleave',()=>dt.classList.remove('big'))});
 $$('[data-tilt]').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;el.style.setProperty('--mx',x*100+'%');el.style.setProperty('--my',y*100+'%');el.style.transform=`perspective(900px) rotateX(${(.5-y)*8}deg) rotateY(${(x-.5)*10}deg) translateZ(0)`});el.addEventListener('pointerleave',()=>el.style.transform='')});
 $$('.mag').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.22}px,${(e.clientY-r.top-r.height/2)*.3}px)`});el.addEventListener('pointerleave',()=>el.style.transform='')});
}
const boot=()=>requestAnimationFrame(()=>{pSetup();onScroll()});if(d.readyState==='complete')boot();else w.addEventListener('load',boot);
})();
