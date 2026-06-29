FIX: "Kirim Rekapan" / Ekspor ke Google Sheets tidak pernah benar-benar bisa diverifikasi

ROOT CAUSE
----------
Di src/lib/sync.ts, fungsi exportAll() memanggil fetch ke Apps Script dengan
`mode: "no-cors"`. Di mode itu browser TIDAK PERNAH mengizinkan JavaScript
membaca status/isi response — promise-nya selalu "berhasil" selama request
sempat keluar dari device, terlepas apakah Apps Script di server benar-benar
berhasil menulis ke Google Sheets atau tidak (URL salah, deployment belum
di-redeploy ulang, akses bukan "Anyone", error di script, dll semuanya tetap
dianggap "sukses"). Akibatnya tombol "Ekspor Semua Data ke Google Sheets"
selalu menampilkan toast sukses padahal datanya belum tentu masuk ke sheet —
dan setiap kali dicoba "diperbaiki", tidak ada cara untuk tahu apakah
perbaikannya benar-benar berhasil.

FIX
---
1. src/lib/sync.ts — exportAll() sekarang pakai mode fetch default ("cors").
   Karena body dikirim dengan Content-Type "text/plain" (bukan
   application/json), browser tidak mengirim CORS preflight; saat Apps
   Script merespons, Google redirect ke script.googleusercontent.com lewat
   GET, dan response itu sudah membawa header Access-Control-Allow-Origin,
   jadi JSON balasan asli dari Apps Script ({ok, message, error}) sekarang
   benar-benar bisa dibaca. Kalau ternyata browser tertentu masih gagal
   membaca response (true network/CORS error), ada fallback kirim ulang
   dengan no-cors supaya data tetap punya kesempatan terkirim, tapi user
   diberi tahu jujur bahwa hasilnya tidak bisa diverifikasi — bukan diklaim
   "berhasil" begitu saja.
2. src/routes/index.tsx — toast sukses/gagal sekarang menampilkan pesan asli
   dari Apps Script (mis. error spesifik), bukan pesan generik.
3. vercel.json — hapus rewrite catch-all "/(.*)" -> "/" yang merupakan pola
   SPA lama (sebelum project ini pakai TanStack Start SSR). Nitro vercel
   preset sudah otomatis membuat routing yang benar untuk setiap halaman;
   rewrite manual ini berisiko membuat direct-link/refresh ke halaman
   tertentu (termasuk /bazar/$id/rekapan) malah disajikan konten halaman
   utama.
4. Tombol "Kirim ... ke WA" (Rekapan Bazar, Rekap Piutang, Nota Riwayat)
   sekarang pakai helper shareToWhatsApp() di src/lib/utils.ts: kalau
   window.open kena pop-up blocker, teksnya otomatis disalin ke clipboard
   dan user diberi toast supaya bisa tempel manual ke WhatsApp — supaya
   tombol tidak terasa "diam saja" tanpa penjelasan saat pop-up diblokir.

CATATAN UNTUK DEPLOY ULANG
---------------------------
Tidak perlu mengubah APPS_SCRIPT_FINAL.gs — script itu sudah benar dan
sudah mengembalikan {ok, message, error} dengan format yang tepat. Pastikan
saja:
- Deployment Apps Script di-set "Who has access: Anyone".
- Setiap kali isi APPS_SCRIPT_FINAL.gs diubah, lakukan Deploy > Manage
  deployments > Edit > New version, bukan cuma Save — kalau tidak, URL
  /exec lama akan tetap menjalankan kode versi sebelumnya.
- Apps Script ini harus dibuat dari dalam Google Sheet tujuan (Extensions >
  Apps Script), bukan project standalone, supaya
  SpreadsheetApp.getActiveSpreadsheet() mengarah ke sheet yang benar.
