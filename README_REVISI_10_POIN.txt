Revisi 10 poin + Google Login

Yang perlu diatur di Vercel setelah upload kode ini:
1. Build Command: npm run build
2. Install Command: npm install --package-lock=false --no-audit --no-fund --registry=https://registry.npmjs.org/
3. Output Directory: jangan override / biarkan default
4. Environment Variables:
   - VITE_GOOGLE_CLIENT_ID = OAuth Client ID Google kamu

Catatan:
- Aplikasi sekarang mewajibkan login Google sebelum masuk.
- Nama Google dipakai untuk sapaan di halaman utama, misalnya "Selamat Pagi, Juan Lalenoh".
- Sinkron Google Sheets tetap memakai URL Apps Script di aplikasi.
- Export semua data dipindah ke halaman utama.
