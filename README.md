# Dompetin — e-Wallet (frontend demo)

Aplikasi dompet digital versi frontend. Semua alur jalan tanpa backend: saldo,
transaksi, dan PIN disimulasikan di browser dengan `localStorage`.

## Menjalankan

```bash
cd ewallet
python3 -m http.server 8099
# buka http://localhost:8099
```

Tidak butuh build step, tidak butuh dependency. Cukup buka `index.html`
langsung juga bisa (kecuali kalau mau tes di HP lewat jaringan lokal).

## Struktur

```
index.html        markup layar utama + shell modal
css/style.css     seluruh styling (token warna di :root)
js/app.js         state, render, dan semua alur transaksi
```

## Yang sudah jalan

| Fitur | Status |
|---|---|
| Lihat saldo + sembunyikan saldo | jalan |
| Top Up (nominal cepat / manual) | jalan, saldo bertambah |
| Transfer (pilih kontak → nominal → PIN) | jalan, saldo berkurang, validasi saldo |
| Tarik tunai | jalan |
| QRIS | simulasi (belum ada merchant asli) |
| Riwayat transaksi | jalan, tersimpan setelah refresh |
| Profil + reset data demo | jalan |

PIN di mode demo menerima angka apa pun. Verifikasi PIN yang benar **harus**
di server, bukan di browser.

## Yang belum ada (sengaja)

- Backend. Saldo disimpan di `localStorage`, jadi bisa diubah siapa pun yang
  buka DevTools. Untuk uang sungguhan, saldo dan mutasi wajib di server.
- Autentikasi, session, dan enkripsi.
- QRIS asli (butuh integrasi payment gateway).

## Menyesuaikan dengan desain Figma

Semua warna, radius, dan bayangan ada di blok `:root` pada `css/style.css`.
Ganti variabel di sana, dan hampir seluruh tampilan ikut berubah tanpa
menyentuh markup.
