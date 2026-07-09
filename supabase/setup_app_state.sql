-- =============================================================================
-- Setup tabel penyimpanan data aplikasi Bazar PHBW 2026 di Supabase
-- =============================================================================
-- Cara pakai:
--   1. Buka project Supabase kamu di https://supabase.com/dashboard
--   2. Buka menu "SQL Editor" (ikon di sidebar kiri)
--   3. Klik "New query", tempel SEMUA isi file ini, lalu klik "Run"
--   4. Cukup dijalankan SEKALI SAJA. Aman dijalankan ulang (tidak duplikat)
--      karena memakai IF NOT EXISTS / ON CONFLICT.
-- =============================================================================

-- Tabel utama: menyimpan seluruh data aplikasi (bazar, menu, pesanan,
-- penjualan, pengeluaran, piutang, logo, header, dsb) sebagai satu dokumen
-- JSON per baris. Ini SENGAJA didesain sederhana (bukan tabel per-jenis-data)
-- supaya aman disinkronkan otomatis dari aplikasi tanpa migrasi yang rumit.
create table if not exists public.app_state (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Aktifkan Row Level Security (RLS) -- wajib di Supabase, tapi kita buka
-- aksesnya penuh di bawah karena aplikasi ini sudah punya lapisan keamanan
-- sendiri (PIN admin), bukan lewat Supabase Auth.
alter table public.app_state enable row level security;

-- PENTING (baca ini):
-- Policy di bawah mengizinkan SIAPA SAJA yang punya anon key kamu (yang
-- memang sudah tertanam di kode frontend, jadi publik) untuk baca & tulis
-- tabel ini. Untuk aplikasi internal panitia bazar yang tidak sensitif,
-- ini cukup wajar -- sama seperti localStorage yang tadinya "aman" karena
-- cuma ada di HP kamu, sekarang datanya di cloud tapi tetap tidak
-- memerlukan login khusus untuk diakses lewat aplikasi.
-- Kalau suatu saat kamu mau lebih aman (misalnya wajib login), kasih tahu
-- saya, nanti kita tambahkan pengecekan lewat Supabase Auth.
drop policy if exists "app_state_public_access" on public.app_state;
create policy "app_state_public_access"
  on public.app_state
  for all
  using (true)
  with check (true);
