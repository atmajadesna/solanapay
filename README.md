# Solana pay — prototipe interaktif Figma

Versi ini memprioritaskan kecocokan visual dengan desain pemilik: 154 layar PNG 2× hasil ekspor Figma, dengan 400 tautan navigasi dari data interaksi Figma. Bukan implementasi komponen HTML penuh dan bukan layanan pembayaran.

## Jalankan
```bash
python3 -m http.server 8099 --bind 127.0.0.1
```
Buka http://127.0.0.1:8099 (perlu HTTP karena manifest dimuat melalui fetch).

## Penggunaan
Klik area interaktif sesuai desain. Panel pilih layar menyediakan akses semua frame, termasuk frame yang belum dihubungkan di Figma. Tombol Area klik menampilkan hotspot, Kembali mengembalikan layar sebelumnya.

## Batasan
- Teks, saldo, formulir dan angka adalah gambar desain statis, bukan input atau saldo dinamis.
- Tidak melakukan login, pembayaran, pengiriman uang, pemindaian QR, atau komunikasi bank.
- Tidak boleh memasukkan data pribadi/keuangan asli.
- Layar mengikuti ukuran Figma 402×874 dan diperkecil proporsional di ponsel.
- File css/style.css dan js/app.js lama tidak dipakai halaman ini; dipertahankan agar implementasi demo lama tidak hilang.
- Token Figma dan JSON dokumen mentah tidak disertakan dalam repositori.

## Pengujian
Browser Chromium: 154 pilihan layar, navigasi Home → Kirim uang → Home berhasil; viewport 360px tanpa overflow horizontal; tidak ada JavaScript page error.
