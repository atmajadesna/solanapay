'use strict';
(async()=>{
const $=s=>document.querySelector(s);
try{
const response=await fetch('screens.json'); if(!response.ok)throw Error('screens');
const screens=await response.json(), map=new Map(screens.map(s=>[s.id,s]));
for(const s of screens){const o=document.createElement('option');o.value=s.id;o.textContent=`${s.name} · ${s.id}`;$('#pages').append(o);}
const trail=[];let current=null;
function go(id,remember=true){
 if(id==='back'){go(trail.pop()||'1:2',false);return;}
 const s=map.get(id)||map.get('1:2');if(remember&&current&&current!==s.id)trail.push(current);current=s.id;
 $('#design').src=s.image;$('#design').alt=`Desain asli Figma: ${s.name}`;$('#pages').value=s.id;$('#hotspots').replaceChildren();
 for(const link of s.links){
  const x=Math.max(0,link.x),y=Math.max(0,link.y),w=Math.min(s.w,link.x+link.w)-x,h=Math.min(s.h,link.y+link.h)-y;
  if(w<=0||h<=0)continue;
  const btn=document.createElement('button');btn.className='hotspot';btn.style.cssText=`left:${x/s.w*100}%;top:${y/s.h*100}%;width:${w/s.w*100}%;height:${h/s.h*100}%`;
  const target=map.get(link.to);btn.setAttribute('aria-label',target?`Buka ${target.name}`:'Kembali');btn.title=btn.getAttribute('aria-label');btn.addEventListener('click',()=>go(link.to));$('#hotspots').append(btn);
 }
 history.replaceState(null,'','#'+encodeURIComponent(s.id));$('#status').textContent=`${s.name} — ${screens.length} layar desain tersedia`;window.scrollTo(0,0);
}
$('#pages').addEventListener('change',e=>go(e.target.value));$('#home').onclick=()=>go('1:2');$('#back').onclick=()=>go('back');$('#hints').onclick=()=>{$('#screen').classList.toggle('show-hints');$('#hints').setAttribute('aria-pressed',String($('#screen').classList.contains('show-hints')));};$('#design').onerror=()=>{$('#error').hidden=false;};$('#design').onload=()=>{$('#error').hidden=true;};go(decodeURIComponent(location.hash.slice(1))||'1:2');
}catch(e){$('#error').hidden=false;}
})();
