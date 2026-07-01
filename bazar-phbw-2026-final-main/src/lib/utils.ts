import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Buka pesan WhatsApp lewat wa.me. Beberapa browser (mode hemat data,
 * pop-up blocker, atau saat dibuka dari dalam PWA/WebView) bisa membatalkan
 * window.open secara diam-diam sehingga tombol "Kirim ke WA" terlihat tidak
 * berfungsi padahal sebenarnya pop-up-nya yang diblokir. Fungsi ini mendeteksi
 * itu dan otomatis menyalin teksnya ke clipboard sebagai cadangan, supaya user
 * tetap bisa paste manual ke WhatsApp kalau pop-up gagal terbuka.
 */
export async function shareToWhatsApp(
  text: string,
): Promise<{ opened: boolean; copied: boolean }> {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  let opened = false;

  try {
    const win = window.open(url, "_blank");
    // window.open mengembalikan null/undefined kalau diblokir pop-up blocker,
    // dan beberapa browser menutup window-nya sendiri sesaat setelah dibuka
    // ketika navigasinya ditolak.
    opened = !!win && !win.closed;
  } catch {
    opened = false;
  }

  if (opened) return { opened: true, copied: false };

  let copied = false;
  try {
    await navigator.clipboard.writeText(text);
    copied = true;
  } catch {
    copied = false;
  }

  return { opened: false, copied };
}
