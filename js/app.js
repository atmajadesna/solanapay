/* ============================================================
   Dompetin — logika aplikasi (vanilla JS, tanpa dependency)
   Data disimpan di localStorage supaya demo tetap "hidup"
   setelah refresh. Ganti lapisan `store` dengan API kalau
   nanti sudah ada backend.
   ============================================================ */

const STORE_KEY = 'dompetin.v1';
const PIN_LENGTH = 6;

/* ---------- data awal ---------- */
const seed = {
  name: 'Bos Desna',
  phone: '0812 •••• 4821',
  balance: 1250000,
  points: 25000,
  hidden: false,
  contacts: [
    { id: 'c1', name: 'Laura Rara', sub: '0812 •••• 7788', initial: 'LR' },
    { id: 'c2', name: 'Dheline Caffe', sub: 'Merchant', initial: 'DC' },
    { id: 'c3', name: 'Atmaja Car', sub: 'Merchant', initial: 'AC' },
    { id: 'c4', name: 'Rizky', sub: '0857 •••• 1122', initial: 'R' },
  ],
  tx: [
    { id: 't1', title: 'Top Up GoPay', date: 'Hari ini, 09:12', amount: 250000, type: 'in' },
    { id: 't2', title: 'QRIS — Dheline Caffe', date: 'Hari ini, 08:40', amount: -38000, type: 'out' },
    { id: 't3', title: 'Transfer ke Laura', date: 'Kemarin, 19:05', amount: -150000, type: 'out' },
    { id: 't4', title: 'Cashback QRIS', date: 'Kemarin, 12:20', amount: 12000, type: 'in' },
    { id: 't5', title: 'Tarik Tunai — BCA', date: '21 Okt, 16:33', amount: -500000, type: 'out' },
  ],
};

/* ---------- store ---------- */
function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return structuredClone(seed);
    const data = JSON.parse(raw);
    return { ...structuredClone(seed), ...data };
  } catch {
    return structuredClone(seed);
  }
}

function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

let state = load();

/* ---------- util ---------- */
const $ = (sel) => document.querySelector(sel);
const rupiah = (n) => 'Rp ' + Math.abs(Math.round(n)).toLocaleString('id-ID');
const nowLabel = () => {
  const d = new Date();
  const jam = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  return `Hari ini, ${jam}`;
};

function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { el.hidden = true; }, 2200);
}

/* ---------- render ---------- */
function renderBalance() {
  const el = $('#balanceText');
  el.textContent = state.hidden ? 'Rp ••••••' : rupiah(state.balance);
  $('#userName').textContent = state.name;
  $('.avatar').textContent = state.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function txRow(t) {
  const sign = t.amount > 0 ? '+' : '−';
  return `
    <li class="tx">
      <span class="tx-icon ${t.type}">${t.amount > 0 ? '↓' : '↑'}</span>
      <div class="tx-meta">
        <p class="tx-title">${t.title}</p>
        <span class="tx-date">${t.date}</span>
      </div>
      <span class="tx-amount ${t.type}">${sign} ${rupiah(t.amount)}</span>
    </li>`;
}

function renderTx(limit = 5) {
  const list = $('#txList');
  if (!state.tx.length) {
    list.innerHTML = '<li class="tx-empty">Belum ada transaksi. Mulai dari Top Up.</li>';
    return;
  }
  list.innerHTML = state.tx.slice(0, limit).map(txRow).join('');
}

function render() {
  renderBalance();
  renderTx();
}

/* ---------- sheet ---------- */
function openSheet(html) {
  $('#sheetContent').innerHTML = html;
  $('#backdrop').hidden = false;
}

function closeSheet() {
  $('#backdrop').hidden = true;
  $('#sheetContent').innerHTML = '';
}

$('#backdrop').addEventListener('click', (e) => {
  if (e.target.id === 'backdrop') closeSheet();
});

/* ---------- transaksi ---------- */
function addTx(title, amount, type) {
  state.tx.unshift({ id: 't' + Date.now(), title, date: nowLabel(), amount, type });
  save();
  render();
}

/* ============================================================
   ALUR: TOP UP
   ============================================================ */
function flowTopUp() {
  openSheet(`
    <h3>Top Up Saldo</h3>
    <p class="sub">Pilih nominal atau ketik sendiri.</p>
    <label class="field-label" for="topupAmount">Nominal</label>
    <input id="topupAmount" class="amount-input" type="text" inputmode="numeric" placeholder="Rp 0" />
    <div class="chips" id="topupChips">
      <button class="chip" data-v="50000">50.000</button>
      <button class="chip" data-v="100000">100.000</button>
      <button class="chip" data-v="250000">250.000</button>
      <button class="chip" data-v="500000">500.000</button>
    </div>
    <button class="btn-primary" id="topupGo" disabled>Lanjut Top Up</button>
    <button class="btn-ghost" id="cancel1">Batal</button>
  `);

  const input = $('#topupAmount');
  const go = $('#topupGo');
  let amount = 0;

  const sync = () => {
    amount = Number(String(input.value).replace(/\D/g, '')) || 0;
    input.value = amount ? amount.toLocaleString('id-ID') : '';
    go.disabled = amount < 10000;
    go.textContent = amount ? `Top Up ${rupiah(amount)}` : 'Lanjut Top Up';
  };

  input.addEventListener('input', sync);
  $('#topupChips').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    document.querySelectorAll('#topupChips .chip').forEach((c) => c.classList.remove('is-active'));
    btn.classList.add('is-active');
    input.value = Number(btn.dataset.v).toLocaleString('id-ID');
    sync();
  });

  go.addEventListener('click', () => {
    state.balance += amount;
    state.points += Math.floor(amount * 0.001);
    addTx('Top Up Saldo', amount, 'in');
    save();
    successSheet('Top Up Berhasil', amount, 'Saldo Dompetin kamu');
  });

  $('#cancel1').addEventListener('click', closeSheet);
}

/* ============================================================
   ALUR: TRANSFER (pilih kontak → nominal → PIN)
   ============================================================ */
function flowTransfer() {
  openSheet(`
    <h3>Transfer</h3>
    <p class="sub">Pilih penerima dulu.</p>
    <div class="contact-list" id="contacts">
      ${state.contacts.map((c) => `
        <button class="contact" data-id="${c.id}">
          <span class="contact-av">${c.initial}</span>
          <span>
            <div class="contact-name">${c.name}</div>
            <div class="contact-sub">${c.sub}</div>
          </span>
        </button>`).join('')}
    </div>
    <button class="btn-ghost" id="cancel2">Batal</button>
  `);

  $('#contacts').addEventListener('click', (e) => {
    const btn = e.target.closest('.contact');
    if (!btn) return;
    const contact = state.contacts.find((c) => c.id === btn.dataset.id);
    transferAmount(contact);
  });

  $('#cancel2').addEventListener('click', closeSheet);
}

function transferAmount(contact) {
  openSheet(`
    <h3>Transfer ke ${contact.name}</h3>
    <p class="sub">${contact.sub}</p>
    <label class="field-label" for="trAmount">Nominal</label>
    <input id="trAmount" class="amount-input" type="text" inputmode="numeric" placeholder="Rp 0" />
    <div class="chips" id="trChips">
      <button class="chip" data-v="20000">20.000</button>
      <button class="chip" data-v="50000">50.000</button>
      <button class="chip" data-v="100000">100.000</button>
      <button class="chip" data-v="200000">200.000</button>
    </div>
    <button class="btn-primary" id="trGo" disabled>Lanjut</button>
    <button class="btn-ghost" id="cancel3">Batal</button>
  `);

  const input = $('#trAmount');
  const go = $('#trGo');
  let amount = 0;

  const sync = () => {
    amount = Number(String(input.value).replace(/\D/g, '')) || 0;
    input.value = amount ? amount.toLocaleString('id-ID') : '';
    const cukup = amount >= 10000 && amount <= state.balance;
    go.disabled = !cukup;
    go.textContent = amount > state.balance
      ? 'Saldo tidak cukup'
      : amount ? `Transfer ${rupiah(amount)}` : 'Lanjut';
  };

  input.addEventListener('input', sync);
  $('#trChips').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    document.querySelectorAll('#trChips .chip').forEach((c) => c.classList.remove('is-active'));
    btn.classList.add('is-active');
    input.value = Number(btn.dataset.v).toLocaleString('id-ID');
    sync();
  });

  go.addEventListener('click', () => {
    pinSheet(amount, () => {
      state.balance -= amount;
      addTx(`Transfer ke ${contact.name}`, -amount, 'out');
      save();
      successSheet('Transfer Berhasil', amount, contact.name);
    });
  });

  $('#cancel3').addEventListener('click', closeSheet);
}

/* ============================================================
   ALUR: TARIK TUNAI
   ============================================================ */
function flowWithdraw() {
  openSheet(`
    <h3>Tarik Tunai</h3>
    <p class="sub">Dana masuk ke rekening BCA •••• 4821.</p>
    <label class="field-label" for="wdAmount">Nominal</label>
    <input id="wdAmount" class="amount-input" type="text" inputmode="numeric" placeholder="Rp 0" />
    <div class="chips" id="wdChips">
      <button class="chip" data-v="50000">50.000</button>
      <button class="chip" data-v="100000">100.000</button>
      <button class="chip" data-v="250000">250.000</button>
    </div>
    <button class="btn-primary" id="wdGo" disabled>Lanjut</button>
    <button class="btn-ghost" id="cancel4">Batal</button>
  `);

  const input = $('#wdAmount');
  const go = $('#wdGo');
  let amount = 0;

  const sync = () => {
    amount = Number(String(input.value).replace(/\D/g, '')) || 0;
    input.value = amount ? amount.toLocaleString('id-ID') : '';
    go.disabled = amount < 50000 || amount > state.balance;
    go.textContent = amount > state.balance ? 'Saldo tidak cukup' : 'Lanjut';
  };

  input.addEventListener('input', sync);
  $('#wdChips').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    document.querySelectorAll('#wdChips .chip').forEach((c) => c.classList.remove('is-active'));
    btn.classList.add('is-active');
    input.value = Number(btn.dataset.v).toLocaleString('id-ID');
    sync();
  });

  go.addEventListener('click', () => {
    pinSheet(amount, () => {
      state.balance -= amount;
      addTx('Tarik Tunai — BCA', -amount, 'out');
      save();
      successSheet('Penarikan Diproses', amount, 'BCA •••• 4821');
    });
  });

  $('#cancel4').addEventListener('click', closeSheet);
}

/* ============================================================
   ALUR: QRIS (placeholder — belum ada backend merchant)
   ============================================================ */
function flowQris() {
  openSheet(`
    <h3>Bayar dengan QRIS</h3>
    <p class="sub">Scan QR merchant, atau tunjukkan QR-mu.</p>
    <div style="display:grid;place-items:center;margin:8px 0 20px">
      <div style="width:190px;height:190px;border-radius:18px;border:2px dashed #c8ccdb;display:grid;place-items:center;color:#a6abc0;font-size:.75rem;text-align:center;padding:12px">
        area kamera / QR<br>belum aktif
      </div>
    </div>
    <button class="btn-primary" id="qrisDemo">Simulasi Bayar Rp 38.000</button>
    <button class="btn-ghost" id="cancel5">Tutup</button>
  `);

  $('#qrisDemo').addEventListener('click', () => {
    const amount = 38000;
    if (state.balance < amount) return toast('Saldo tidak cukup');
    state.balance -= amount;
    state.points += Math.floor(amount * 0.01);
    addTx('QRIS — Dheline Caffe', -amount, 'out');
    save();
    successSheet('Pembayaran Berhasil', amount, 'Dheline Caffe');
  });

  $('#cancel5').addEventListener('click', closeSheet);
}

/* ============================================================
   PIN
   ============================================================ */
function pinSheet(amount, onSuccess) {
  openSheet(`
    <h3>Masukkan PIN</h3>
    <p class="sub">Konfirmasi ${rupiah(amount)} dengan PIN 6 digit.</p>
    <div class="pin-dots" id="pinDots">
      ${Array.from({ length: PIN_LENGTH }, () => '<span class="pin-dot"></span>').join('')}
    </div>
    <div class="keypad" id="keypad">
      ${[1,2,3,4,5,6,7,8,9].map((n) => `<button class="key" data-k="${n}">${n}</button>`).join('')}
      <button class="key blank" disabled></button>
      <button class="key" data-k="0">0</button>
      <button class="key" data-k="del">⌫</button>
    </div>
    <button class="btn-ghost" id="cancelPin">Batal</button>
  `);

  let pin = '';

  const paint = () => {
    document.querySelectorAll('#pinDots .pin-dot').forEach((d, i) => {
      d.classList.toggle('filled', i < pin.length);
    });
  };

  $('#keypad').addEventListener('click', (e) => {
    const key = e.target.closest('.key');
    if (!key || key.classList.contains('blank')) return;
    const k = key.dataset.k;

    if (k === 'del') {
      pin = pin.slice(0, -1);
      paint();
      return;
    }
    if (pin.length >= PIN_LENGTH) return;

    pin += k;
    paint();

    if (pin.length === PIN_LENGTH) {
      setTimeout(() => {
        /* Demo: PIN apa pun diterima. Di backend, verifikasi di server. */
        onSuccess();
      }, 180);
    }
  });

  $('#cancelPin').addEventListener('click', closeSheet);
}

/* ============================================================
   SUKSES
   ============================================================ */
function successSheet(title, amount, target) {
  openSheet(`
    <div class="success">
      <div class="success-check">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <h3>${title}</h3>
      <div class="amount-big">${rupiah(amount)}</div>
      <p class="to">${target}</p>
      <button class="btn-primary" id="doneBtn">Selesai</button>
    </div>
  `);
  $('#doneBtn').addEventListener('click', closeSheet);
}

/* ============================================================
   RIWAYAT & PROFIL
   ============================================================ */
function flowHistory() {
  openSheet(`
    <h3>Semua Transaksi</h3>
    <p class="sub">${state.tx.length} transaksi tercatat.</p>
    <ul class="tx-list">${state.tx.map(txRow).join('') || '<li class="tx-empty">Belum ada transaksi.</li>'}</ul>
    <button class="btn-ghost" id="closeHist">Tutup</button>
  `);
  $('#closeHist').addEventListener('click', closeSheet);
}

function flowProfile() {
  openSheet(`
    <h3>Profil</h3>
    <p class="sub">Akun Dompetin</p>
    <div class="contact" style="cursor:default;margin-bottom:14px">
      <span class="contact-av">${state.name.split(' ').map((w) => w[0]).join('').slice(0,2).toUpperCase()}</span>
      <span>
        <div class="contact-name">${state.name}</div>
        <div class="contact-sub">${state.phone}</div>
      </span>
    </div>
    <div class="tx" style="margin-bottom:10px">
      <span class="tx-icon in">Rp</span>
      <div class="tx-meta"><p class="tx-title">Saldo</p><span class="tx-date">Dompetin</span></div>
      <span class="tx-amount">${rupiah(state.balance)}</span>
    </div>
    <div class="tx" style="margin-bottom:18px">
      <span class="tx-icon in">★</span>
      <div class="tx-meta"><p class="tx-title">Poin</p><span class="tx-date">bisa ditukar</span></div>
      <span class="tx-amount">${state.points.toLocaleString('id-ID')}</span>
    </div>
    <button class="btn-primary" id="resetDemo">Reset Data Demo</button>
    <button class="btn-ghost" id="closeProf">Tutup</button>
  `);

  $('#resetDemo').addEventListener('click', () => {
    localStorage.removeItem(STORE_KEY);
    state = structuredClone(seed);
    render();
    closeSheet();
    toast('Data demo direset');
  });
  $('#closeProf').addEventListener('click', closeSheet);
}

/* ============================================================
   WIRING
   ============================================================ */
document.addEventListener('click', (e) => {
  const act = e.target.closest('[data-act]');
  if (act) {
    const map = { topup: flowTopUp, transfer: flowTransfer, qris: flowQris, withdraw: flowWithdraw, history: flowHistory };
    map[act.dataset.act]?.();
    return;
  }

  const nav = e.target.closest('[data-nav]');
  if (nav) {
    document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('is-active'));
    nav.classList.add('is-active');
    if (nav.dataset.nav === 'history') flowHistory();
    if (nav.dataset.nav === 'profile') flowProfile();
    return;
  }
});

$('#toggleBalance').addEventListener('click', () => {
  state.hidden = !state.hidden;
  save();
  renderBalance();
});

$('#btnProfile').addEventListener('click', flowProfile);
$('#btnNotif').addEventListener('click', () => toast('Belum ada notifikasi baru'));

render();
