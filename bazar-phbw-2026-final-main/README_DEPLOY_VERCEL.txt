PHBW 2026 - Vercel-ready final

Versi ini sudah dibersihkan dari URL registry internal yang membuat Vercel gagal di npm install/npm ci dengan error ETIMEDOUT.

Cara upload ke GitHub:
1. Extract ZIP ini.
2. Masuk ke dalam folder bazar-phbw-2026-vercel-final.
3. Upload ISI foldernya ke GitHub, bukan folder luarnya.
4. Pastikan package.json, package-lock.json, vercel.json, vite.config.ts, src, public ada langsung di halaman utama repo.

Setting Vercel:
- Application Preset: TanStack Start
- Root Directory: ./
- Build Command: npm run build
- Install Command: npm ci --no-audit --no-fund
- Output Directory: biarkan default, jangan override ke dist
- Environment Variables: kosong, karena versi ini tidak perlu Supabase

Catatan penting:
- Jangan upload .env ke GitHub.
- Kalau Vercel masih gagal ETIMEDOUT ke registry internal, berarti package-lock.json lama masih terpakai. Upload ulang package-lock.json dari ZIP ini.
