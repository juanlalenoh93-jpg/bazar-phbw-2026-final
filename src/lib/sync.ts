import { useSyncExternalStore } from "react";
import type { DB, Order, Sale, Expense, Bazar, PiutangPayment } from "./storage";

const URL_KEY = "phbw-2026-sheet-url-v1";

// URL Apps Script default (bisa di-override via Pengaturan).
const DEFAULT_URL =
  "https://script.google.com/macros/s/AKfycbw5Qo_FBHtIgE9uOBYY7JjC9XqeMhPa7la0qvGGz4gSwdBVOkP9DuXoXHMWaJYf45icyw/exec";

let url = "";
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

export function getSheetUrl(): string {
  return load();
}

export function setSheetUrl(value: string) {
  url = value.trim() || DEFAULT_URL;
  loaded = true;
  if (typeof window !== "undefined") {
    if (value.trim()) localStorage.setItem(URL_KEY, value.trim());
    else localStorage.removeItem(URL_KEY);
  }
  listeners.forEach((listener) => listener());
}

export function useSheetUrl(): string {
  return useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    () => load(),
    () => DEFAULT_URL,
  );
}

// ============= Row Builders (1 menu/item = 1 baris) =============
type Row = (string | number)[];

const sortByCreatedAt = <T extends { createdAt?: number }>(items: T[]) =>
  [...items].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

const prettyId = (prefix: string, index: number) => `${prefix}${String(index + 1).padStart(3, "0")}`;

function bazarName(db: DB, bazarId: string): string {
  return db.bazars.find((b) => b.id === bazarId)?.name || bazarId || "";
}

function menuName(db: DB, menuId: string): string {
  return db.menus.find((menu) => menu.id === menuId)?.name || menuId || "";
}

function menuPrice(db: DB, menuId: string): number {
  return db.menus.find((menu) => menu.id === menuId)?.price || 0;
}

function paymentMethodLabel(method?: string): string {
  if (!method) return "";
  return method.toLowerCase() === "transfer" ? "Transfer" : "Cash";
}

function paymentStatus(total: number, paid: number): string {
  return paid >= total && total > 0 ? "Lunas" : "Piutang";
}

function allocateAmount(totalAmount: number, subtotals: number[]): number[] {
  if (subtotals.length === 0) return [];
  const total = subtotals.reduce((sum, value) => sum + value, 0);
  if (total <= 0) return subtotals.map(() => 0);

  let allocated = 0;
  return subtotals.map((subtotal, index) => {
    if (index === subtotals.length - 1) return Math.max(0, totalAmount - allocated);
    const value = Math.round((totalAmount * subtotal) / total);
    allocated += value;
    return value;
  });
}

function soldQtyByMenuForOrder(db: DB, orderId: string): Record<string, number> {
  const sold: Record<string, number> = {};
  for (const sale of db.sales.filter((item) => item.orderId === orderId)) {
    for (const item of sale.items) {
      sold[item.menuId] = (sold[item.menuId] || 0) + item.qty;
    }
  }
  return sold;
}

function orderOriginalItems(db: DB, order: Order) {
  const sold = soldQtyByMenuForOrder(db, order.id);
  const ids = new Set<string>();
  for (const item of order.items) ids.add(item.menuId);
  Object.keys(sold).forEach((id) => ids.add(id));

  return Array.from(ids).map((menuId) => {
    const remainingQty = order.items.find((item) => item.menuId === menuId)?.qty || 0;
    const soldQty = sold[menuId] || 0;
    const originalQty = remainingQty + soldQty;
    return {
      menuId,
      qty: originalQty,
      soldQty,
      price: menuPrice(db, menuId),
      name: menuName(db, menuId),
    };
  }).filter((item) => item.qty > 0);
}

export function bazarRows(bazars: Bazar[]): Row[] {
  return sortByCreatedAt(bazars).map((bazar, index) => [
    prettyId("BZR", index),
    bazar.name,
    bazar.date,
  ]);
}

export function orderRows(db: DB, orders: Order[]): Row[] {
  const rows: Row[] = [];
  sortByCreatedAt(orders).forEach((order, index) => {
    const bazar = bazarName(db, order.bazarId);
    const shifted =
      order.originalCustomer && order.originalCustomer !== order.customer
        ? `${order.originalCustomer} → ${order.customer}`
        : "";

    for (const item of orderOriginalItems(db, order)) {
      rows.push([
        prettyId("PSN", index),
        bazar,
        order.customer,
        item.name,
        item.qty,
        item.price * item.qty,
        item.soldQty,
        shifted,
        order.note || "",
      ]);
    }
  });
  return rows;
}

export function saleRows(db: DB, sales: Sale[]): Row[] {
  const rows: Row[] = [];
  sortByCreatedAt(sales).forEach((sale, index) => {
    const bazar = bazarName(db, sale.bazarId);
    const piutangPayments = db.payments
      .filter((payment) => payment.saleId === sale.id)
      .reduce((sum, payment) => sum + payment.amount, 0);
    const paidTotal = sale.paid + piutangPayments;
    const status = paymentStatus(sale.total, paidTotal);
    const subtotals = sale.items.map((item) => item.price * item.qty);
    const paidByItem = allocateAmount(paidTotal, subtotals);

    sale.items.forEach((item, itemIndex) => {
      rows.push([
        prettyId("JUAL", index),
        bazar,
        sale.customer,
        item.name,
        item.qty,
        subtotals[itemIndex],
        paidByItem[itemIndex],
        paymentMethodLabel(sale.method),
        status,
      ]);
    });
  });
  return rows;
}

export function expenseRows(db: DB, expenses: Expense[]): Row[] {
  return sortByCreatedAt(expenses).map((expense, index) => [
    prettyId("PNG", index),
    bazarName(db, expense.bazarId),
    expense.name,
    expense.qty || 1,
    expense.amount,
  ]);
}

export function paymentRows(db: DB, payments: PiutangPayment[]): Row[] {
  return [...payments].sort((a, b) => a.date - b.date).map((payment, index) => {
    const sale = db.sales.find((item) => item.id === payment.saleId);
    const paidTotal = sale
      ? sale.paid + db.payments.filter((p) => p.saleId === sale.id).reduce((sum, p) => sum + p.amount, 0)
      : payment.amount;

    return [
      prettyId("BYR", index),
      bazarName(db, payment.bazarId),
      payment.customer,
      payment.amount,
      paymentMethodLabel(payment.method),
      sale ? paymentStatus(sale.total, paidTotal) : "Pembayaran Piutang",
      payment.menuName || "",
      new Date(payment.date).toISOString(),
    ];
  });
}

// Auto-sync sengaja dimatikan sesuai keputusan final user:
// semua tambah/edit/hapus hanya tersimpan lokal dulu, lalu Google Sheets diperbarui
// saat tombol "Ekspor Semua Data ke Google Sheets" ditekan.
export function pushRows(_sheet: string, _rows: Row[]): void {
  // no-op by design
}

export type SyncEventType = "order" | "sale" | "expense" | "bulk_export" | "bazar";
export function pushToSheet(_type: SyncEventType, _payload: unknown): void {
  // deprecated no-op
}

// ============= Bulk export final =============
// Hanya menulis 5 sheet final:
// Bazar, Pesanan, Penjualan, Pengeluaran, Pembayaran Piutang.
export async function exportAll(db: DB): Promise<boolean> {
  const targetUrl = load();
  if (!targetUrl) return false;

  const sheets: Record<string, Row[]> = {
    Bazar: bazarRows(db.bazars),
    Pesanan: orderRows(db, db.orders),
    Penjualan: saleRows(db, db.sales),
    Pengeluaran: expenseRows(db, db.expenses),
    "Pembayaran Piutang": paymentRows(db, db.payments),
  };

  try {
    await fetch(targetUrl, {
      method: "POST",
      mode: "no-cors",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        type: "bulk_export",
        payload: {
          bazars: db.bazars,
          menus: db.menus,
          orders: db.orders,
          sales: db.sales,
          expenses: db.expenses,
          payments: db.payments,
        },
        sheets,
        sentAt: new Date().toISOString(),
      }),
    });
    return true;
  } catch {
    return false;
  }
}
