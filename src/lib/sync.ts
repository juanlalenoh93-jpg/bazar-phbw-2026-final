import { useSyncExternalStore } from "react";
import type { DB, Order, Sale, Expense, Bazar } from "./storage";

const URL_KEY = "phbw-2026-sheet-url-v1";

// URL Apps Script default (bisa di-override via Pengaturan).
const DEFAULT_URL =
  "https://script.google.com/macros/s/AKfycbw5Qo_FBHtIgE9uOBYY7JjC9XqeMhPa7la0qvGGz4gSwdBVOkP9DuXoXHMWaJYf45icyw/exec";

let url: string = "";
let loaded = false;
const listeners = new Set<() => void>();

function load(): string {
  if (typeof window === "undefined") return DEFAULT_URL;
  if (loaded) return url;
  try {
    url = localStorage.getItem(URL_KEY) || DEFAULT_URL;
  } catch {
    url = DEFAULT_URL;
  }
  loaded = true;
  return url;
}

export function getSheetUrl(): string { return load(); }

export function setSheetUrl(value: string) {
  url = value.trim() || DEFAULT_URL;
  loaded = true;
  if (typeof window !== "undefined") {
    if (value.trim()) localStorage.setItem(URL_KEY, value.trim());
    else localStorage.removeItem(URL_KEY);
  }
  listeners.forEach((l) => l());
}

export function useSheetUrl(): string {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => load(),
    () => DEFAULT_URL,
  );
}

// ============= Row Builders (1 menu = 1 baris) =============
type Row = (string | number)[];

function bazarName(db: DB, bazarId: string): string {
  return db.bazars.find((b) => b.id === bazarId)?.name || bazarId;
}
function menuName(db: DB, menuId: string): string {
  return db.menus.find((m) => m.id === menuId)?.name || menuId;
}
function menuPrice(db: DB, menuId: string): number {
  return db.menus.find((m) => m.id === menuId)?.price || 0;
}

export function orderRows(db: DB, o: Order): Row[] {
  const bz = bazarName(db, o.bazarId);
  const terjual = o.soldAt ? "Yes" : "No";
  const dialihkan = o.originalCustomer && o.originalCustomer !== o.customer
    ? `${o.originalCustomer} → ${o.customer}` : "";
  const ket = o.note || "";
  return o.items.filter((i) => i.qty > 0).map((i) => {
    const nm = menuName(db, i.menuId);
    const pr = menuPrice(db, i.menuId);
    return [o.id, bz, o.customer, nm, i.qty, pr * i.qty, terjual, dialihkan, ket];
  });
}

export function saleRows(db: DB, s: Sale): Row[] {
  const bz = bazarName(db, s.bazarId);
  const paidTotal = s.paid + db.payments.filter((p) => p.saleId === s.id).reduce((a, p) => a + p.amount, 0);
  const status = paidTotal >= s.total ? "LUNAS" : "PIUTANG";
  return s.items.map((i) => [
    s.id, bz, s.customer, i.name, i.qty, i.price * i.qty, paidTotal, s.method, status,
  ]);
}

export function bazarRows(b: Bazar): Row[] { return [[b.id, b.name, b.date]]; }
export function expenseRows(e: Expense): Row[] { return [[e.id, e.bazarId, e.name, e.qty || 1, e.amount]]; }

// ============= Push =============
function send(body: string): void {
  const u = load();
  if (!u) return;
  try {
    fetch(u, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch { /* ignore */ }
}

export function pushRows(sheet: string, rows: Row[]): void {
  if (!rows.length) return;
  send(JSON.stringify({ type: "append", sheet, rows, sentAt: new Date().toISOString() }));
}

export type SyncEventType = "order" | "sale" | "expense" | "bulk_export" | "bazar";
export function pushToSheet(_t: SyncEventType, _p: unknown): void { /* deprecated */ }

// ============= Bulk export (sesuai permintaan user) =============
// Mengirim 2 format sekaligus agar Apps Script bisa pilih: 
//   1) payload: { bazars, orders, sales, expenses } — array mentah per sheet
//   2) sheets: { bazar, pesanan, penjualan, pengeluaran } — sudah jadi baris (1 menu = 1 baris)
export async function exportAll(db: DB): Promise<boolean> {
  const u = load();
  if (!u) return false;
  const sheets: Record<string, Row[]> = {
    "Bazar": db.bazars.flatMap(bazarRows),
    "Pesanan": db.orders.flatMap((o) => orderRows(db, o)),
    "Penjualan": db.sales.flatMap((s) => saleRows(db, s)),
    "Pengeluaran": db.expenses.flatMap(expenseRows),
  };
  try {
    await fetch(u, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        type: "bulk_export",
        payload: {
          bazars: db.bazars,
          orders: db.orders,
          sales: db.sales,
          expenses: db.expenses,
        },
        sheets,
        sentAt: new Date().toISOString(),
      }),
      keepalive: true,
    });
    return true;
  } catch {
    return false;
  }
}
