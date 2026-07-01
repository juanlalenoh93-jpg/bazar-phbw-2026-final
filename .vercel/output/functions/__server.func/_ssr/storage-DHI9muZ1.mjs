import { r as __toESM } from "../_runtime.mjs";
import { k as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/storage-DHI9muZ1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var KEY = "phbw-2026-db-v1";
var initialDB = {
	modalAwal: 0,
	bazars: [],
	menus: [],
	orders: [],
	sales: [],
	expenses: [],
	payments: []
};
var db = initialDB;
var loaded = false;
var listeners = /* @__PURE__ */ new Set();
function load() {
	if (typeof window === "undefined") return initialDB;
	if (loaded) return db;
	try {
		const raw = localStorage.getItem(KEY);
		if (raw) db = {
			...initialDB,
			...JSON.parse(raw)
		};
	} catch {}
	loaded = true;
	return db;
}
function setDB(updater) {
	load();
	const next = updater(db);
	if (next) db = next;
	db = {
		...db,
		bazars: [...db.bazars],
		menus: [...db.menus],
		orders: [...db.orders],
		sales: [...db.sales],
		expenses: [...db.expenses],
		payments: [...db.payments]
	};
	dbSnapshot = db;
	if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(db));
	listeners.forEach((l) => l());
}
var LOGO_KEY = "phbw-2026-logo-v1";
var logo = null;
var logoLoaded = false;
var logoListeners = /* @__PURE__ */ new Set();
function loadLogo() {
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
function setLogo(value) {
	logo = value;
	logoLoaded = true;
	if (typeof window !== "undefined") if (value) localStorage.setItem(LOGO_KEY, value);
	else localStorage.removeItem(LOGO_KEY);
	logoListeners.forEach((l) => l());
}
function useLogo() {
	return (0, import_react.useSyncExternalStore)((cb) => {
		logoListeners.add(cb);
		return () => logoListeners.delete(cb);
	}, () => loadLogo(), () => null);
}
var RIGHT_LOGO_KEY = "phbw-2026-right-logo-v1";
var rightLogo = null;
var rightLogoLoaded = false;
var rightLogoListeners = /* @__PURE__ */ new Set();
function loadRightLogo() {
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
function setRightLogo(value) {
	rightLogo = value;
	rightLogoLoaded = true;
	if (typeof window !== "undefined") if (value) localStorage.setItem(RIGHT_LOGO_KEY, value);
	else localStorage.removeItem(RIGHT_LOGO_KEY);
	rightLogoListeners.forEach((l) => l());
}
function useRightLogo() {
	return (0, import_react.useSyncExternalStore)((cb) => {
		rightLogoListeners.add(cb);
		return () => rightLogoListeners.delete(cb);
	}, () => loadRightLogo(), () => null);
}
var dbSnapshot = initialDB;
function useDB() {
	return (0, import_react.useSyncExternalStore)((cb) => {
		listeners.add(cb);
		return () => listeners.delete(cb);
	}, () => {
		load();
		dbSnapshot = db;
		return dbSnapshot;
	}, () => initialDB);
}
var uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
var fmtIDR = (n) => new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	maximumFractionDigits: 0
}).format(n || 0);
var fmtDate = (ts) => new Date(ts).toLocaleDateString("id-ID", {
	day: "2-digit",
	month: "short",
	year: "numeric"
});
var fmtDateTime = (ts) => new Date(ts).toLocaleString("id-ID", {
	day: "2-digit",
	month: "short",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit"
});
function salePaidTotal(d, saleId) {
	const sale = d.sales.find((s) => s.id === saleId);
	if (!sale) return 0;
	const extra = d.payments.filter((p) => p.saleId === saleId).reduce((s, p) => s + p.amount, 0);
	return sale.paid + extra;
}
function saleOutstanding(d, saleId) {
	const sale = d.sales.find((s) => s.id === saleId);
	if (!sale) return 0;
	return Math.max(0, sale.total - salePaidTotal(d, saleId));
}
function computeSaldo(d) {
	const totalReceived = d.sales.reduce((s, sale) => s + sale.paid, 0) + d.payments.reduce((s, p) => s + p.amount, 0);
	const totalExpense = d.expenses.reduce((s, e) => s + e.amount, 0);
	return d.modalAwal + totalReceived - totalExpense;
}
function bazarStats(d, bazarId) {
	const sales = d.sales.filter((s) => s.bazarId === bazarId);
	const expenses = d.expenses.filter((e) => e.bazarId === bazarId);
	const totalSales = sales.reduce((s, x) => s + x.total, 0);
	const totalExpense = expenses.reduce((s, x) => s + x.amount, 0);
	const totalPiutang = sales.reduce((s, x) => s + saleOutstanding(d, x.id), 0);
	const grossProfit = sales.reduce((s, x) => {
		return s + x.items.reduce((ss, it) => ss + (it.price - (it.cost || 0)) * it.qty, 0);
	}, 0);
	const totalCash = sales.filter((s) => s.method === "cash").reduce((s, x) => s + x.paid, 0) + d.payments.filter((p) => p.bazarId === bazarId && p.method === "cash").reduce((s, p) => s + p.amount, 0);
	const totalTransfer = sales.filter((s) => s.method === "transfer").reduce((s, x) => s + x.paid, 0) + d.payments.filter((p) => p.bazarId === bazarId && p.method === "transfer").reduce((s, p) => s + p.amount, 0);
	return {
		totalSales,
		totalExpense,
		totalPiutang,
		profit: grossProfit - totalExpense,
		totalCash,
		totalTransfer
	};
}
function menuSoldQty(d, menuId) {
	let total = 0;
	for (const s of d.sales) for (const it of s.items) if (it.menuId === menuId) total += it.qty;
	return total;
}
/**
* Statistik menu (dihitung realtime, TIDAK disimpan ke DB):
*  - Pesanan       = total qty menu pada SELURUH data pesanan (order.items, baik yang masih
*                    pending maupun yang sudah soldAt) ditambah qty yang sudah terjual dari
*                    pesanan itu (karena saat menu terjual, qty di order.items dikurangi).
*  - Terjual       = total qty menu yang sudah berhasil dijual (dari data sales).
*  - Belum Diambil = Pesanan - Terjual.
*/
function menuOrderedQty(d, menuId) {
	let remainingInOrders = 0;
	for (const o of d.orders) for (const it of o.items) if (it.menuId === menuId) remainingInOrders += it.qty;
	let soldFromOrders = 0;
	for (const s of d.sales) {
		if (!s.orderId) continue;
		for (const it of s.items) if (it.menuId === menuId) soldFromOrders += it.qty;
	}
	return remainingInOrders + soldFromOrders;
}
function menuStats(d, menuId) {
	const pesanan = menuOrderedQty(d, menuId);
	const terjual = menuSoldQty(d, menuId);
	return {
		pesanan,
		terjual,
		belumDiambil: Math.max(0, pesanan - terjual)
	};
}
function bazarMenuSummary(d, bazarId) {
	return d.menus.filter((m) => m.bazarId === bazarId).reduce((acc, m) => {
		const s = menuStats(d, m.id);
		acc.pesanan += s.pesanan;
		acc.terjual += s.terjual;
		acc.belumDiambil += s.belumDiambil;
		return acc;
	}, {
		pesanan: 0,
		terjual: 0,
		belumDiambil: 0
	});
}
var CUSTOMER_KEY = "phbw-2026-customers-v1";
var CUSTOMER_DELETED_KEY = "phbw-2026-customers-deleted-v1";
var customerMaster = null;
var deletedCustomerMaster = null;
var customerListeners = /* @__PURE__ */ new Set();
function customerKey(name) {
	return name.trim().toLowerCase();
}
function uniqueSortedNames(names) {
	const map = /* @__PURE__ */ new Map();
	for (const raw of names) {
		const trimmed = String(raw || "").trim();
		if (!trimmed) continue;
		const key = customerKey(trimmed);
		if (!map.has(key)) map.set(key, trimmed);
	}
	return Array.from(map.values()).sort((a, b) => a.localeCompare(b, "id"));
}
function loadDeletedCustomers() {
	if (typeof window === "undefined") return [];
	if (deletedCustomerMaster) return deletedCustomerMaster;
	try {
		deletedCustomerMaster = JSON.parse(localStorage.getItem(CUSTOMER_DELETED_KEY) || "[]");
	} catch {
		deletedCustomerMaster = [];
	}
	return deletedCustomerMaster;
}
function saveDeletedCustomers() {
	if (typeof window === "undefined") return;
	localStorage.setItem(CUSTOMER_DELETED_KEY, JSON.stringify(deletedCustomerMaster || []));
}
function isCustomerDeleted(name) {
	const key = customerKey(name);
	return loadDeletedCustomers().some((n) => customerKey(n) === key);
}
function loadCustomers() {
	if (typeof window === "undefined") return [];
	if (customerMaster) return customerMaster;
	try {
		customerMaster = uniqueSortedNames(JSON.parse(localStorage.getItem(CUSTOMER_KEY) || "[]"));
	} catch {
		customerMaster = [];
	}
	return customerMaster;
}
function saveCustomers() {
	if (typeof window === "undefined") return;
	customerMaster = uniqueSortedNames(customerMaster || []);
	localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customerMaster || []));
	customerListeners.forEach((l) => l());
}
function addCustomerToMaster(name) {
	const trimmed = name.trim();
	if (!trimmed) return;
	loadCustomers();
	loadDeletedCustomers();
	const key = customerKey(trimmed);
	deletedCustomerMaster = (deletedCustomerMaster || []).filter((n) => customerKey(n) !== key);
	saveDeletedCustomers();
	if (!customerMaster.some((n) => customerKey(n) === key)) customerMaster = [...customerMaster, trimmed];
	saveCustomers();
}
function removeCustomerFromMaster(name) {
	const trimmed = name.trim();
	if (!trimmed) return;
	loadCustomers();
	loadDeletedCustomers();
	const key = customerKey(trimmed);
	customerMaster = (customerMaster || []).filter((n) => customerKey(n) !== key);
	if (!(deletedCustomerMaster || []).some((n) => customerKey(n) === key)) deletedCustomerMaster = [...deletedCustomerMaster || [], trimmed];
	saveDeletedCustomers();
	saveCustomers();
}
function allCustomersGlobal(d) {
	const set = /* @__PURE__ */ new Map();
	const add = (name) => {
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
var BACKUP_KEYS = [
	"phbw-2026-db-v1",
	"phbw-2026-logo-v1",
	"phbw-2026-right-logo-v1",
	"phbw-2026-main-header-v1",
	"phbw-2026-workspace-header-v1",
	"phbw-2026-pin-v1",
	"phbw-2026-customers-v1",
	"phbw-2026-customers-deleted-v1",
	"phbw-2026-sheet-url-v1",
	"phbw-2026-admin-list-v1"
];
function downloadBackup() {
	if (typeof window === "undefined") return;
	const raw = {};
	for (const key of BACKUP_KEYS) raw[key] = localStorage.getItem(key);
	const backup = {
		version: 2,
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		appName: "PHBW 2026",
		raw
	};
	const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `phbw-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
function restoreFromBackup(file) {
	return new Promise((resolve, reject) => {
		if (typeof window === "undefined") {
			reject(/* @__PURE__ */ new Error("Not browser"));
			return;
		}
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Gagal membaca file"));
		reader.onload = () => {
			try {
				const text = reader.result;
				const backup = JSON.parse(text);
				if (backup.version === 2 && backup.raw) for (const [key, value] of Object.entries(backup.raw)) if (value !== null && value !== void 0) localStorage.setItem(key, value);
				else localStorage.removeItem(key);
				else if (backup.db) localStorage.setItem(KEY, JSON.stringify(backup.db));
				else {
					reject(/* @__PURE__ */ new Error("Format backup tidak valid"));
					return;
				}
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
				reject(/* @__PURE__ */ new Error("File backup tidak valid atau rusak"));
			}
		};
		reader.readAsText(file);
	});
}
//#endregion
export { setRightLogo as _, computeSaldo as a, useLogo as b, fmtDateTime as c, removeCustomerFromMaster as d, restoreFromBackup as f, setLogo as g, setDB as h, bazarStats as i, fmtIDR as l, salePaidTotal as m, allCustomersGlobal as n, downloadBackup as o, saleOutstanding as p, bazarMenuSummary as r, fmtDate as s, addCustomerToMaster as t, menuStats as u, uid as v, useRightLogo as x, useDB as y };
