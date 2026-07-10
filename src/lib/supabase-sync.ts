import { supabase } from "./supabase";

// ===========================================================================
// Sinkronisasi data aplikasi (bazar, menu, pesanan, penjualan, dll) ke Supabase.
//
// Desainnya sengaja dibuat "local-first": semua baca/tulis data di aplikasi
// TETAP memakai localStorage seperti sebelumnya (jadi instan, tidak perlu
// loading, dan tetap bisa dipakai offline). Modul ini hanya menambahkan
// lapisan sinkronisasi di belakang layar:
//   - Saat aplikasi dibuka: coba ambil data dari Supabase.
//       - Kalau Supabase SUDAH punya data → data itu dipakai (menimpa data
//         lokal), supaya semua perangkat melihat data yang sama.
//       - Kalau Supabase MASIH KOSONG (baru pertama kali dipasang) → data
//         lokal yang sudah ada di HP ini diunggah otomatis ke Supabase.
//   - Setiap kali data berubah (tambah pesanan, edit menu, dll): perubahan
//     otomatis dikirim ke Supabase beberapa saat kemudian (debounced),
//     tanpa mengganggu kecepatan aplikasi.
//
// Semua panggilan ke Supabase dibungkus try/catch dan tidak pernah membuat
// aplikasi error meskipun Supabase sedang tidak bisa diakses — localStorage
// tetap menjadi sumber data utama yang selalu bisa diandalkan.
// ===========================================================================

export type SyncedState = {
  db: unknown;
  logo: string | null;
  rightLogo: string | null;
  workspaceLogo: string | null;
  customers: string[];
  customersDeleted: string[];
  adminList?: string[];
  pin?: string;
};

const TABLE = "app_state";
const ROW_ID = "main";

export async function fetchRemoteState(): Promise<SyncedState | null> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("data")
      .eq("id", ROW_ID)
      .maybeSingle();
    if (error) {
      console.warn("[supabase-sync] Gagal mengambil data dari Supabase:", error.message);
      return null;
    }
    if (!data || !data.data) return null;
    return data.data as SyncedState;
  } catch (err) {
    console.warn("[supabase-sync] Tidak bisa terhubung ke Supabase:", err);
    return null;
  }
}

let pushTimer: ReturnType<typeof setTimeout> | null = null;
let pendingState: SyncedState | null = null;
let pushInFlight = false;

async function flushPush() {
  if (pushInFlight) return;
  const toSend = pendingState;
  if (!toSend) return;
  pendingState = null;
  pushInFlight = true;
  try {
    const { error } = await supabase
      .from(TABLE)
      .upsert({ id: ROW_ID, data: toSend, updated_at: new Date().toISOString() });
    if (error) console.warn("[supabase-sync] Gagal menyimpan ke Supabase:", error.message);
  } catch (err) {
    console.warn("[supabase-sync] Tidak bisa terhubung ke Supabase:", err);
  } finally {
    pushInFlight = false;
    // Kalau ada perubahan baru yang masuk selagi push berjalan, kirim lagi.
    if (pendingState) scheduleRemotePush(pendingState);
  }
}

export function scheduleRemotePush(state: SyncedState) {
  if (typeof window === "undefined") return;
  pendingState = state;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    void flushPush();
  }, 800);
}

export async function pushRemoteStateNow(state: SyncedState) {
  if (typeof window === "undefined") return;
  pendingState = state;
  if (pushTimer) { clearTimeout(pushTimer); pushTimer = null; }
  await flushPush();
}
