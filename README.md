# Solanapay — aplikasi dompet digital (demo)

Implementasi HTML/CSS/JavaScript, bukan gambar dengan hotspot. Home mengikuti komposisi frame Figma: header biru, kartu ungu, layanan 4 kolom dan navigasi 5 menu. Halaman fungsional lanjutan diadaptasi, belum mereplikasi seluruh 154 frame.

## Jalankan
```bash
python3 -m http.server 8099 --bind 127.0.0.1
```
Buka http://127.0.0.1:8099.

Demo live: https://atmajadesna.github.io/solanapay/

## Fitur
- Isi saldo virtual, kirim uang virtual dan pembayaran merchant demo.
- Validasi nominal bulat Rp10.000–Rp10.000.000 dan saldo mencukupi.
- Konfirmasi PIN demo **123456**; batal tidak mengubah saldo.
- Aktivitas transaksi, saldo dan nama tersimpan di localStorage.
- Sembunyikan saldo, edit nama, reset demo dengan konfirmasi.
- Buat teks permintaan uang tanpa mengirim pesan otomatis.
- Simulasi tagihan PLN, TV kabel, pulsa dan pajak.

## Batasan
Tidak ada uang asli, bank, QR scanner, blockchain, backend, autentikasi sungguhan, investasi atau pembayaran tagihan nyata. PIN client-side bukan fitur keamanan produksi. Data browser dapat diubah lewat DevTools. Jangan memasukkan data asli. Layanan yang belum terhubung ditandai jelas.

## File aktif
index.html, wallet.css, wallet.js. File prototype dan ekspor Figma lama dipertahankan sebagai referensi, tidak dimuat aplikasi.

## Tes
Chromium: topup, PIN salah, transfer, pembatalan, riwayat, persistensi setelah reload, mobile 360px tanpa overflow dan tanpa JS error.
