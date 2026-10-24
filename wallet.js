'use strict';
const KEY='solanapay.app.v1', $=s=>document.querySelector(s), fmt=n=>Math.round(n).toLocaleString('id-ID'), esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const seed=()=>({name:'Masboy',balance:150000000,points:4500,hidden:false,transactions:[]});
let state;try{state=JSON.parse(localStorage.getItem(KEY));if(!state||!Number.isSafeInteger(state.balance)||state.balance<0||!Array.isArray(state.transactions))state=seed();}catch{state=seed();}
let route='home',pending=null;
const navs=[['home','≋','Beranda'],['activity','▤','Aktivitas'],['qris','▦','QRIS'],['wallet','▣','Dompet'],['profile','◉','Saya']];
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch{toast('Penyimpanan browser penuh/tidak tersedia.');return false;}}
function toast(t){$('#toast').textContent=t;$('#toast').hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').hidden=true,3000);}
function page(title,html){return `<section class="page"><button class="back" data-go="home" aria-label="Kembali">←</button><h1>${title}</h1>${html}</section>`;}
function go(to){route=to;render();window.scrollTo(0,0);}
function transactions(){return state.transactions.length?state.transactions.map(t=>`<div class="item"><span class="avatar">${t.amount>0?'↓':'↑'}</span><div class="meta"><strong>${esc(t.title)}</strong><small>${new Date(t.date).toLocaleString('id-ID')}</small></div><strong class="${t.amount>0?'positive':'negative'}">${t.amount>0?'+':'−'}${fmt(Math.abs(t.amount))}</strong></div>`).join(''):'<p class="empty">Belum ada transaksi. Coba isi saldo virtual.</p>';}
const services=[['KUA','♧'],['Pln','ϟ'],['Tv kabel','▣'],['Proteksi','◇'],['Investasi','↗'],['Pulsa','▯'],['Pajak','▤'],['Lainya','•••']];
function home(){return `<section class="hero"><div class="logo">≋</div><div class="greeting"><span class="avatar">${esc(state.name.slice(0,1))}</span><span><small>Selamat malam,</small><br><b>${esc(state.name)}</b></span><span class="brand">Solana <i>pay</i></span></div><div class="balance"><div class="balance-inner"><small>Total saldo anda</small><div class="money"><small>Rp</small><span id="balanceValue">${state.hidden?'••••••••':fmt(state.balance)}</span><button class="eye" id="toggle" aria-label="Sembunyikan saldo">◉</button></div><div class="points">${fmt(state.points)} point</div></div><div class="quick">${[['topup','+','Isi saldo'],['request','↓','Minta'],['transfer','⇄','Kirim'],['messages','✉','Pesan']].map(([r,i,n])=>`<button data-go="${r}"><b>${i}</b>${n}</button>`).join('')}</div></div></section><section class="services">${services.map(([n,i])=>`<button class="service" data-service="${n}"><b>${i}</b>${n}</button>`).join('')}</section><div class="contacts">${['345','505','433','453'].map((n,i)=>`<button data-contact="+62${n}"><span class="avatar">${['A','D','R','M'][i]}</span>+62${n}</button>`).join('')}</div><div class="promo">Transaksi mudah setiap hari<small>Semua transaksi di aplikasi ini menggunakan uang virtual.</small></div>`;}
function moneyForm(kind,target=''){
 const top=kind==='topup', qr=kind==='qris', bill=kind==='bill';
 return `<p class="notice">Simulasi saja. Tidak ada dana sungguhan yang dikirim atau ditagih.</p><form id="moneyForm" data-kind="${kind}">${top?'<label>Metode isi saldo<select id="target"><option>Bank BCA (demo)</option><option>Bank Mandiri (demo)</option><option>Indomaret (demo)</option></select></label>':`<label>${qr?'Nama merchant demo':bill?'Nomor pelanggan demo':'Nomor/nama penerima demo'}<input id="target" required maxlength="50" placeholder="${qr?'Warung Demo':'Contoh: 081234567890'}" value="${esc(target)}"></label>`}<label>Nominal (Rp)<input id="amount" type="number" inputmode="numeric" min="10000" max="10000000" step="1" required placeholder="Minimal 10.000"></label><div class="chips">${[10000,50000,100000,500000].map(n=>`<button type="button" data-amount="${n}">${fmt(n)}</button>`).join('')}</div><p class="muted">Saldo virtual: Rp ${fmt(state.balance)} • Maksimal Rp10.000.000/transaksi</p><p class="error" id="formError" role="alert"></p><button class="primary" type="submit">${top?'Isi saldo virtual':qr?'Bayar virtual':'Lanjutkan'}</button></form>`;
}
function render(){
 $('#nav').innerHTML=navs.map(([r,i,n])=>`<button data-go="${r}" class="${r===route?'active ':''}${r==='qris'?'scan':''}"><b>${i}</b>${n}</button>`).join('');
 let h;
 if(route==='home')h=home();
 else if(route==='topup')h=page('Isi saldo',moneyForm('topup'));
 else if(route==='transfer')h=page('Kirim uang',moneyForm('transfer'));
 else if(route==='qris')h=page('Pembayaran QRIS',`<p class="notice">Pemindaian QR belum terhubung penyedia QRIS. Form ini hanya simulasi pembayaran merchant.</p>${moneyForm('qris')}`);
 else if(route==='activity')h=page('Aktivitas',transactions());
 else if(route==='wallet')h=page('Dompet',`<div class="balance"><div class="balance-inner"><small>Total saldo virtual</small><p class="big">Rp ${fmt(state.balance)}</p></div></div><button class="listbutton" data-go="topup">Isi saldo <span>→</span></button><button class="listbutton" data-go="transfer">Kirim uang <span>→</span></button><button class="listbutton" data-go="activity">Riwayat transaksi <span>→</span></button>`);
 else if(route==='profile')h=page('Saya',`<span class="avatar">${esc(state.name.slice(0,1))}</span><form id="profileForm"><label>Nama tampilan<input id="name" maxlength="30" required value="${esc(state.name)}"></label><button class="primary">Simpan nama</button></form><p class="notice">PIN demo: 123456. Jangan gunakan PIN atau data pribadi asli. Data hanya disimpan pada browser ini.</p><button class="listbutton" id="reset">Reset data demo <span>↺</span></button>`);
 else if(route==='request')h=page('Minta uang',`<p class="notice">Buat pesan permintaan uang virtual. Tidak mengirim pesan ke siapa pun secara otomatis.</p><form id="requestForm"><label>Nominal<input id="requestAmount" type="number" min="10000" max="10000000" required></label><button class="primary">Buat permintaan</button></form><p id="requestResult"></p>`);
 else if(route==='messages')h=page('Pesan',`<p class="notice">Notifikasi transaksi demo</p>${transactions()}`);
 else if(route.startsWith('service:')){const name=route.slice(8);h=page(esc(name),['Pln','Tv kabel','Pulsa','Pajak'].includes(name)?moneyForm('bill'):`<p class="notice">${esc(name)} belum terhubung layanan eksternal. Tidak ada pendaftaran, investasi, atau pembayaran sungguhan.</p><button class="primary" data-go="home">Kembali ke beranda</button>`);}
 else h=home();
 $('#app').innerHTML=h;
 const f=$('#moneyForm');if(f)f.addEventListener('submit',prepare);
 $('#profileForm')?.addEventListener('submit',e=>{e.preventDefault();const n=$('#name').value.trim();if(!n)return;state.name=n;save();toast('Nama diperbarui');go('profile');});
 $('#requestForm')?.addEventListener('submit',e=>{e.preventDefault();$('#requestResult').textContent=`${state.name} meminta Rp ${fmt(Number($('#requestAmount').value))} (permintaan demo, belum dikirim).`;});
 $('#toggle')?.addEventListener('click',()=>{state.hidden=!state.hidden;save();render();});
 $('#reset')?.addEventListener('click',()=>{if(window.confirm('Reset saldo dan hapus riwayat demo pada browser ini?')){state=seed();save();go('home');}});
}
function prepare(e){e.preventDefault();const amount=Number($('#amount').value),target=$('#target').value.trim(),kind=e.target.dataset.kind;
 if(!Number.isSafeInteger(amount)||amount<10000||amount>10000000||!target){$('#formError').textContent='Isi penerima dan nominal bulat Rp10.000–Rp10.000.000.';return;}
 if(kind!=='topup'&&amount>state.balance){$('#formError').textContent='Saldo tidak cukup.';return;}
 pending={amount,target,kind,service:route.startsWith('service:')?route.slice(8):null};$('#summary').textContent=`${kind==='topup'?'Isi saldo':'Bayar/kirim'} Rp ${fmt(amount)} · ${target}`;$('#pin').value='';$('#pinError').textContent='';$('#confirm').showModal();
}
$('#approve').onclick=()=>{
 if(!pending)return;if($('#pin').value!=='123456'){$('#pinError').textContent='PIN demo salah. Gunakan 123456.';return;}
 const p=pending;if(p.kind!=='topup'&&p.amount>state.balance){$('#pinError').textContent='Saldo tidak cukup.';return;}
 const title=p.kind==='topup'?`Isi saldo · ${p.target}`:p.kind==='qris'?`QRIS · ${p.target}`:p.kind==='bill'?`${p.service} · ${p.target}`:`Kirim · ${p.target}`;
 const signed=p.kind==='topup'?p.amount:-p.amount;state.balance+=signed;state.transactions.unshift({id:crypto.randomUUID(),title,amount:signed,date:new Date().toISOString()});state.transactions=state.transactions.slice(0,200);save();pending=null;$('#confirm').close();$('#app').innerHTML=page('Transaksi berhasil',`<div class="success"><div class="check">✓</div><p class="big">Rp ${fmt(p.amount)}</p><p>${esc(title)}</p><p class="muted">Simulasi selesai. Tidak ada uang sungguhan berpindah.</p><button class="primary" data-go="activity">Lihat aktivitas</button></div>`);window.scrollTo(0,0);
};
$('#confirm').addEventListener('close',()=>{pending=null;});
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){go(g.dataset.go);return;}const a=e.target.closest('[data-amount]');if(a){$('#amount').value=a.dataset.amount;return;}const s=e.target.closest('[data-service]');if(s){go('service:'+s.dataset.service);return;}const c=e.target.closest('[data-contact]');if(c){go('transfer');$('#target').value=c.dataset.contact;}});
$('#clock').textContent=new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});render();
