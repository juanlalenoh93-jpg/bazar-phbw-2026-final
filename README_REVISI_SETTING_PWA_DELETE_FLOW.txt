REVISI SETTING, PWA, DAN ALUR HAPUS

Perubahan yang diterapkan:

1. Pengaturan Aplikasi dibuat ringkas berbentuk list menu:
   - Ganti PIN
   - Ganti Logo Kiri
   - Ganti Logo Kanan
   - Ubah Header Utama
   - Ubah Header Dalam Bazar
   - Kelola Customer Terdaftar
   - Log Out

2. Tombol Log Out dipindahkan ke Pengaturan Aplikasi.
   Tombol logout tidak lagi tampil langsung di halaman utama.

3. Logo kiri dan kanan tetap tidak bisa diganti dengan menekan logo langsung.
   Penggantian logo hanya lewat menu Pengaturan.

4. Aksi pengaturan yang mengubah data wajib memasukkan PIN terlebih dahulu.

5. Semua aksi hapus yang memakai PIN sekarang memakai alur:
   - Klik Hapus
   - Konfirmasi dulu
   - Jika pilih Ya, baru muncul input PIN
   - Jika PIN benar, data dihapus

6. Data kosong bisa dihapus tanpa PIN:
   - Daftar Bazar kosong tidak perlu PIN
   - Menu Bazar kosong/belum dipakai tidak perlu PIN
   - Pengeluaran nominal 0 tidak perlu PIN

7. Pesanan yang sudah punya riwayat penjualan tidak bisa dihapus langsung.
   Pengguna harus menghapus penjualan terkait terlebih dahulu.

8. Penjualan yang sudah punya pembayaran piutang tetap tidak bisa dihapus langsung.
   Pengguna harus menghapus pembayaran piutang terkait terlebih dahulu.

9. Tambahan credit kecil:
   App created by : JJ
   Posisi: kanan bawah aplikasi, opacity rendah.

10. PWA ditambahkan:
    - manifest.webmanifest
    - icon 192x192 dan 512x512
    - service worker dasar
    - bisa dipasang ke layar utama HP lewat Chrome/Safari.

Catatan uji:
- Setelah deploy, buka aplikasi di Chrome Android lalu cek menu Install app/Add to Home Screen.
- Untuk iPhone gunakan Safari > Share > Add to Home Screen.
