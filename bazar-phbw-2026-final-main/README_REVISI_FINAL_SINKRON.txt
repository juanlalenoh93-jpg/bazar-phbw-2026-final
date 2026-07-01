REVISI FINAL - Sinkron Google Sheets

Konsep yang dipakai:
1. Input/edit/hapus data di aplikasi hanya tersimpan di localStorage aplikasi.
2. Google Sheet tidak berubah otomatis saat input/edit/hapus.
3. Tombol "Ekspor Semua Data ke Google Sheets" di halaman utama adalah satu-satunya jalur kirim data.
4. Saat ekspor, Apps Script membersihkan isi lama 5 sheet lalu menulis ulang data terbaru dari aplikasi.
5. Sheet yang dipakai hanya:
   - Bazar
   - Pesanan
   - Penjualan
   - Pengeluaran
   - Pembayaran Piutang
6. Tidak ada ekspor sheet Menu, Saldo Kas, Rincian Keuangan, atau Master Customer.
7. Format baris:
   - Bazar = 1 baris per bazar
   - Pesanan = 1 baris per menu pesanan
   - Penjualan = 1 baris per menu terjual
   - Pengeluaran = 1 baris per item pengeluaran
   - Pembayaran Piutang = 1 baris per pembayaran piutang
8. Kolom ID tetap kode unik sistem, kolom lainnya dibuat tulisan normal yang mudah dibaca.

File Apps Script final ada di: APPS_SCRIPT_FINAL.gs
