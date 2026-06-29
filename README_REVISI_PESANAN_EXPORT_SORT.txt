Revisi tambahan:

1. Sheet Pesanan diperbaiki:
   - Qty tidak lagi 0/tanggal 30/12/1899.
   - Total Harga dihitung dari qty asli pesanan x harga menu.
   - Terjual berisi jumlah qty yang sudah terjual, bukan Ya/Tidak.
   - ID ekspor dibuat rapi: BZR001, PSN001, JUAL001, PNG001, BYR001.

2. Tab Pesanan:
   - Pesanan tidak hilang setelah terjual.
   - Status pesanan:
     Belum di proses, Sebagian Terjual, Terjual.
   - Kalau sudah Terjual semua, tombol lain dimatikan dan hanya tersisa tombol Hapus.

3. Sorting input:
   - Daftar Bazar, Menu Bazar, Pesanan, Penjualan, Pengeluaran, Daftar Piutang, dan Riwayat Pembayaran Piutang diurutkan dari input paling awal.

4. Riwayat Pembayaran Piutang:
   - Ditambahkan tombol Hapus.
   - Hapus pembayaran piutang wajib PIN.

5. Apps Script:
   - APPS_SCRIPT_FINAL.gs diperbarui agar kolom angka tidak berubah menjadi tanggal.
   - Setelah upload kode ini, salin ulang isi APPS_SCRIPT_FINAL.gs ke Google Apps Script dan deploy versi baru.
