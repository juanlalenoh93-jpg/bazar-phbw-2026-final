import { useSyncExternalStore } from "react";

// =============== Types ===============
export type Bazar = {
  id: string;
  name: string;
  date: string;
  createdAt: number;
};

export type MenuItem = {
  id: string;
  bazarId: string;
  name: string;
  price: number;
  qty: number;
  createdAt?: number;
  cost?: number;
  image?: string;
};

export type OrderItem = { menuId: string; qty: number };
export type Order = {
  id: string;
  bazarId: string;
  customer: string;
  items: OrderItem[];
  createdAt: number;
  soldAt?: number;
  saleId?: string;
  originalCustomer?: string;
  note?: string;
};

export type SaleItem = {
  menuId: string;
  name: string;
  price: number;
  qty: number;
  cost?: number;
};
export type Sale = {
  id: string;
  bazarId: string;
  orderId?: string;
  customer: string;
  items: SaleItem[];
  total: number;
  method: "cash" | "transfer";
  paid: number;
  proof?: string;
  createdAt: number;
  note?: string;
};

export type Expense = {
  id: string;
  bazarId: string;
  name: string;
  amount: number;
  qty?: number;
  createdAt: number;
};

export type PiutangPayment = {
  id: string;
  saleId: string;
  bazarId: string;
  customer: string;
  menuName: string;
  amount: number;
  method: "cash" | "transfer";
  proof?: string;
  date: number;
};

export type DB = {
  modalAwal: number;
  bazars: Bazar[];
  menus: MenuItem[];
  orders: Order[];
  sales: Sale[];
  expenses: Expense[];
  payments: PiutangPayment[];
};

const KEY = "phbw-2026-db-v1";

const initialDB: DB = {
  modalAwal: 0,
  bazars: [],
  menus: [],
  orders: [],
  sales: [],
  expenses: [],
  payments: [],
};

// =============== Store ===============
let db: DB = initialDB;
let loaded = false;
const listeners = new Set<() => void>();

function load(): DB {
  if (typeof window === "undefined") return initialDB;
  if (loaded) return db;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) db = { ...initialDB, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  loaded = true;
  return db;
}

function save() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(db));
  listeners.forEach((l) => l());
}

export function getDB(): DB {
  return load();
}

export function setDB(updater: (d: DB) => DB | void) {
  load();
  const next = updater(db);
  if (next) db = next;
  db = {
    ...db,
    bazars:[...db.bazars],
    menus:[...db.menus],
    orders:[...db.orders],
    sales:[...db.sales],
    expenses:[...db.expenses],
    payments:[...db.payments],
  };
  dbSnapshot = db;
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(db));
  }
  listeners.forEach((l) => l());
}

// ------- Logo (header) -------
const LOGO_KEY = "phbw-2026-logo-v1";
let logo: string | null = null;
let logoLoaded = false;
const logoListeners = new Set<() => void>();

function loadLogo(): string | null {
  if (typeof window === "undefined") return null;
  if (logoLoaded) return logo;
  try {
    logo = localStorage.getItem(LOGO_KEY);
  } catch {
    logo = null;
  }
  logoLoaded = true;
  return logo;
}

export function setLogo(value: string | null) {
  logo = value;
  logoLoaded = true;
  if (typeof window !== "undefined") {
    if (value) localStorage.setItem(LOGO_KEY, value);
    else localStorage.removeItem(LOGO_KEY);
  }
  logoListeners.forEach((l) => l());
}

export function useLogo(): string | null {
  return useSyncExternalStore(
    (cb) => {
      logoListeners.add(cb);
      return () => logoListeners.delete(cb);
    },
    () => loadLogo(),
    () => null,
  );
}

// ------- Right logo -------
const RIGHT_LOGO_KEY = "phbw-2026-right-logo-v1";
let rightLogo: string | null = null;
let rightLogoLoaded = false;
const rightLogoListeners = new Set<() => void>();

function loadRightLogo(): string | null {
  if (typeof window === "undefined") return null;
  if (rightLogoLoaded) return rightLogo;
  try {
    rightLogo = localStorage.getItem(RIGHT_LOGO_KEY);
  } catch {
    rightLogo = null;
  }
  rightLogoLoaded = true;
  return rightLogo;
}

export function setRightLogo(value: string | null) {
  rightLogo = value;
  rightLogoLoaded = true;
  if (typeof window !== "undefined") {
    if (value) localStorage.setItem(RIGHT_LOGO_KEY, value);
    else localStorage.removeItem(RIGHT_LOGO_KEY);
  }
  rightLogoListeners.forEach((l) => l());
}

export function useRightLogo(): string | null {
  return useSyncExternalStore(
    (cb) => {
      rightLogoListeners.add(cb);
      return () => rightLogoListeners.delete(cb);
    },
    () => loadRightLogo(),
    () => null,
  );
}

let dbSnapshot: DB = initialDB;

export function useDB(): DB {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => {
      load();
      dbSnapshot = db;
      return dbSnapshot;
    },
    () => initialDB,
  );
}

export const uid = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

// =============== Selectors ===============
export const fmtIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n || 0);

export const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const fmtDateTime = (ts: number) =>
  new Date(ts).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export function salePaidTotal(d: DB, saleId: string): number {
  const sale = d.sales.find((s) => s.id === saleId);
  if (!sale) return 0;
  const extra = d.payments
    .filter((p) => p.saleId === saleId)
    .reduce((s, p) => s + p.amount, 0);
  return sale.paid + extra;
}

export function saleOutstanding(d: DB, saleId: string): number {
  const sale = d.sales.find((s) => s.id === saleId);
  if (!sale) return 0;
  return Math.max(0, sale.total - salePaidTotal(d, saleId));
}

export function computeSaldo(d: DB): number {
  const totalReceived =
    d.sales.reduce((s, sale) => s + sale.paid, 0) +
    d.payments.reduce((s, p) => s + p.amount, 0);
  const totalExpense = d.expenses.reduce((s, e) => s + e.amount, 0);
  return d.modalAwal + totalReceived - totalExpense;
}

export function allCustomerNames(d: DB): string[] {
  const set = new Set<string>();
  for (const o of d.orders) if (o.customer?.trim()) set.add(o.customer.trim());
  for (const s of d.sales) if (s.customer?.trim()) set.add(s.customer.trim());
  for (const p of d.payments) if (p.customer?.trim()) set.add(p.customer.trim());
  return Array.from(set).sort((a, b) => a.localeCompare(b, "id"));
}

export function bazarStats(d: DB, bazarId: string) {
  const sales = d.sales.filter((s) => s.bazarId === bazarId);
  const expenses = d.expenses.filter((e) => e.bazarId === bazarId);
  const totalSales = sales.reduce((s, x) => s + x.total, 0);
  const totalExpense = expenses.reduce((s, x) => s + x.amount, 0);
  const totalPiutang = sales.reduce((s, x) => s + saleOutstanding(d, x.id), 0);
  const grossProfit = sales.reduce((s, x) => {
    return s + x.items.reduce((ss, it) => ss + ((it.price - (it.cost || 0)) * it.qty), 0);
  }, 0);
  const totalCash =
    sales.filter((s) => s.method === "cash").reduce((s, x) => s + x.paid, 0) +
    d.payments
      .filter((p) => p.bazarId === bazarId && p.method === "cash")
      .reduce((s, p) => s + p.amount, 0);
  const totalTransfer =
    sales
      .filter((s) => s.method === "transfer")
      .reduce((s, x) => s + x.paid, 0) +
    d.payments
      .filter((p) => p.bazarId === bazarId && p.method === "transfer")
      .reduce((s, p) => s + p.amount, 0);
  return {
    totalSales,
    totalExpense,
    totalPiutang,
    profit: grossProfit - totalExpense,
    totalCash,
    totalTransfer,
  };
}

export function menuSoldQty(d: DB, menuId: string): number {
  let total = 0;
  for (const s of d.sales) {
    for (const it of s.items) {
      if (it.menuId === menuId) total += it.qty;
    }
  }
  return total;
}

export function menuPendingQty(d: DB, menuId: string, excludeOrderId?: string): number {
  let total = 0;
  for (const o of d.orders) {
    if (o.soldAt) continue;
    if (excludeOrderId && o.id === excludeOrderId) continue;
    for (const it of o.items) {
      if (it.menuId === menuId) total += it.qty;
    }
  }
  return total;
}

// Menu tidak lagi dibatasi stok (Qty manual dihapus dari master data menu).
// Sisa pesanan dianggap tak terbatas — Admin bebas memesan berapapun.
export function menuRemaining(_d: DB, _menuId: string, _excludeOrderId?: string): number {
  return Infinity;
}

/**
 * Statistik menu (dihitung realtime, TIDAK disimpan ke DB):
 *  - Pesanan       = total qty menu pada SELURUH data pesanan (order.items, baik yang masih
 *                    pending maupun yang sudah soldAt) ditambah qty yang sudah terjual dari
 *                    pesanan itu (karena saat menu terjual, qty di order.items dikurangi).
 *  - Terjual       = total qty menu yang sudah berhasil dijual (dari data sales).
 *  - Belum Diambil = Pesanan - Terjual.
 */
export function menuOrderedQty(d: DB, menuId: string): number {
  // qty yang masih tersisa di pesanan (belum diambil/dijual)
  let remainingInOrders = 0;
  for (const o of d.orders) {
    for (const it of o.items) {
      if (it.menuId === menuId) remainingInOrders += it.qty;
    }
  }
  // qty yang berasal dari pesanan dan SUDAH terjual (orderId tertaut)
  let soldFromOrders = 0;
  for (const s of d.sales) {
    if (!s.orderId) continue;
    for (const it of s.items) {
      if (it.menuId === menuId) soldFromOrders += it.qty;
    }
  }
  return remainingInOrders + soldFromOrders;
}

export function menuNotTakenQty(d: DB, menuId: string): number {
  const ordered = menuOrderedQty(d, menuId);
  const sold = menuSoldQty(d, menuId);
  return Math.max(0, ordered - sold);
}

export function menuStats(d: DB, menuId: string) {
  const pesanan = menuOrderedQty(d, menuId);
  const terjual = menuSoldQty(d, menuId);
  const belumDiambil = Math.max(0, pesanan - terjual);
  return { pesanan, terjual, belumDiambil };
}

export function bazarMenuSummary(d: DB, bazarId: string) {
  const menus = d.menus.filter((m) => m.bazarId === bazarId);
  return menus.reduce(
    (acc, m) => {
      const s = menuStats(d, m.id);
      acc.pesanan += s.pesanan;
      acc.terjual += s.terjual;
      acc.belumDiambil += s.belumDiambil;
      return acc;
    },
    { pesanan: 0, terjual: 0, belumDiambil: 0 },
  );
}

// =============== Customer Master (global) ===============
const CUSTOMER_KEY = "phbw-2026-customers-v1";
const CUSTOMER_DELETED_KEY = "phbw-2026-customers-deleted-v1";
let customerMaster: string[] | null = null;
let deletedCustomerMaster: string[] | null = null;
const customerListeners = new Set<() => void>();

function customerKey(name: string): string {
  return name.trim().toLowerCase();
}

function uniqueSortedNames(names: string[]): string[] {
  const map = new Map<string, string>();
  for (const raw of names) {
    const trimmed = String(raw || "").trim();
    if (!trimmed) continue;
    const key = customerKey(trimmed);
    if (!map.has(key)) map.set(key, trimmed);
  }
  return Array.from(map.values()).sort((a, b) => a.localeCompare(b, "id"));
}

function loadDeletedCustomers(): string[] {
  if (typeof window === "undefined") return [];
  if (deletedCustomerMaster) return deletedCustomerMaster;
  try {
    deletedCustomerMaster = JSON.parse(localStorage.getItem(CUSTOMER_DELETED_KEY) || "[]");
  } catch {
    deletedCustomerMaster = [];
  }
  return deletedCustomerMaster!;
}

function saveDeletedCustomers() {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOMER_DELETED_KEY, JSON.stringify(deletedCustomerMaster || []));
}

function isCustomerDeleted(name: string): boolean {
  const key = customerKey(name);
  return loadDeletedCustomers().some((n) => customerKey(n) === key);
}

function loadCustomers(): string[] {
  if (typeof window === "undefined") return [];
  if (customerMaster) return customerMaster;
  try {
    customerMaster = uniqueSortedNames(JSON.parse(localStorage.getItem(CUSTOMER_KEY) || "[]"));
  } catch {
    customerMaster = [];
  }
  return customerMaster!;
}

function saveCustomers() {
  if (typeof window === "undefined") return;
  customerMaster = uniqueSortedNames(customerMaster || []);
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customerMaster || []));
  customerListeners.forEach((l) => l());
}

export function addCustomerToMaster(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  loadCustomers();
  loadDeletedCustomers();
  const key = customerKey(trimmed);
  deletedCustomerMaster = (deletedCustomerMaster || []).filter((n) => customerKey(n) !== key);
  saveDeletedCustomers();
  const exists = customerMaster!.some((n) => customerKey(n) === key);
  if (!exists) customerMaster = [...customerMaster!, trimmed];
  saveCustomers();
}

export function removeCustomerFromMaster(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  loadCustomers();
  loadDeletedCustomers();
  const key = customerKey(trimmed);
  customerMaster = (customerMaster || []).filter((n) => customerKey(n) !== key);
  if (!(deletedCustomerMaster || []).some((n) => customerKey(n) === key)) {
    deletedCustomerMaster = [...(deletedCustomerMaster || []), trimmed];
  }
  saveDeletedCustomers();
  saveCustomers();
}

export function useCustomerMaster(): string[] {
  return useSyncExternalStore(
    (cb) => { customerListeners.add(cb); return () => customerListeners.delete(cb); },
    () => loadCustomers().filter((n) => !isCustomerDeleted(n)),
    () => [],
  );
}

export function allCustomersGlobal(d: DB): string[] {
  const set = new Map<string, string>();
  const add = (name?: string) => {
    const trimmed = String(name || "").trim();
    if (!trimmed || isCustomerDeleted(trimmed)) return;
    const k = customerKey(trimmed);
    if (!set.has(k)) set.set(k, trimmed);
  };
  for (const n of loadCustomers()) add(n);
  for (const o of d.orders) add(o.customer);
  for (const s of d.sales) add(s.customer);
  for (const p of d.payments) add(p.customer);
  return Array.from(set.values()).sort((a, b) => a.localeCompare(b, "id"));
}

// =============== Backup / Restore ===============
const BACKUP_KEYS = [
  "phbw-2026-db-v1",
  "phbw-2026-logo-v1",
  "phbw-2026-right-logo-v1",
  "phbw-2026-main-header-v1",
  "phbw-2026-workspace-header-v1",
  "phbw-2026-pin-v1",
  "phbw-2026-customers-v1",
  "phbw-2026-customers-deleted-v1",
  "phbw-2026-sheet-url-v1",
  "phbw-2026-admin-list-v1",
];

export function downloadBackup(): void {
  if (typeof window === "undefined") return;
  const raw: Record<string, string | null> = {};
  for (const key of BACKUP_KEYS) {
    raw[key] = localStorage.getItem(key);
  }
  const backup = {
    version: 2,
    exportedAt: new Date().toISOString(),
    appName: "PHBW 2026",
    raw,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `phbw-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function restoreFromBackup(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") { reject(new Error("Not browser")); return; }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const backup = JSON.parse(text) as {
          version?: number;
          raw?: Record<string, string | null>;
          db?: DB;
        };

        if (backup.version === 2 && backup.raw) {
          for (const [key, value] of Object.entries(backup.raw)) {
            if (value !== null && value !== undefined) {
              localStorage.setItem(key, value);
            } else {
              localStorage.removeItem(key);
            }
          }
        } else if (backup.db) {
          localStorage.setItem(KEY, JSON.stringify(backup.db));
        } else {
          reject(new Error("Format backup tidak valid"));
          return;
        }

        // Reset in-memory state so next read picks up fresh data
        loaded = false;
        logoLoaded = false;
        rightLogoLoaded = false;
        customerMaster = null;
        deletedCustomerMaster = null;
        db = initialDB;

        listeners.forEach((l) => l());
        logoListeners.forEach((l) => l());
        rightLogoListeners.forEach((l) => l());
        customerListeners.forEach((l) => l());

        resolve();
      } catch {
        reject(new Error("File backup tidak valid atau rusak"));
      }
    };
    reader.readAsText(file);
  });
}
