import { r as __toESM } from "../_runtime.mjs";
import { O as require_jsx_runtime, k as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as setWorkspaceHeader, i as setMainHeader, o as useMainHeader, r as WORKSPACE_ORG_LABEL, s as useWorkspaceHeader, t as APP_TITLE } from "./branding-D-EPtLZP.mjs";
import { A as Cloud, D as Download, E as EyeOff, I as ChevronRight, O as Database, S as LogOut, T as Eye, V as Calculator, W as CircleCheck, a as Upload, c as Store, f as ShieldCheck, g as RefreshCw, m as Settings, n as Wallet, r as Users, t as X, w as History, z as Camera } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as setRightLogo, a as computeSaldo, b as useLogo, d as removeCustomerFromMaster, f as restoreFromBackup, g as setLogo, h as setDB, l as fmtIDR, n as allCustomersGlobal, o as downloadBackup, p as saleOutstanding, x as useRightLogo, y as useDB } from "./storage-DHI9muZ1.mjs";
import { a as useAdminList, i as signOut, o as useAuth, r as removeAdmin, t as addAdmin } from "./auth-Q8aXDp4D.mjs";
import { t as Button } from "./button-DKCAsAV2.mjs";
import { t as Input } from "./input-DLhLYSN_.mjs";
import { t as Label } from "./label-DfxyFUsy.mjs";
import { d as verifyPin, l as getPin, u as setPin } from "./pin-DM1ztchA.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PinConfirmDelete } from "./bazar.index-DYH4R8ux.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-BSp8No6r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cif65HPV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var URL_KEY = "phbw-2026-sheet-url-v1";
var DEFAULT_URL = "https://script.google.com/macros/s/AKfycbw5Qo_FBHtIgE9uOBYY7JjC9XqeMhPa7la0qvGGz4gSwdBVOkP9DuXoXHMWaJYf45icyw/exec";
var url = "";
var loaded = false;
var listeners = /* @__PURE__ */ new Set();
function load() {
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
function setSheetUrl(value) {
	url = value.trim() || DEFAULT_URL;
	loaded = true;
	if (typeof window !== "undefined") if (value.trim()) localStorage.setItem(URL_KEY, value.trim());
	else localStorage.removeItem(URL_KEY);
	listeners.forEach((listener) => listener());
}
function useSheetUrl() {
	return (0, import_react.useSyncExternalStore)((callback) => {
		listeners.add(callback);
		return () => listeners.delete(callback);
	}, () => load(), () => DEFAULT_URL);
}
var sortByCreatedAt = (items) => [...items].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
var prettyId = (prefix, index) => `${prefix}${String(index + 1).padStart(3, "0")}`;
function bazarName(db, bazarId) {
	return db.bazars.find((b) => b.id === bazarId)?.name || bazarId || "";
}
function menuName(db, menuId) {
	return db.menus.find((menu) => menu.id === menuId)?.name || menuId || "";
}
function menuPrice(db, menuId) {
	return db.menus.find((menu) => menu.id === menuId)?.price || 0;
}
function paymentMethodLabel(method) {
	if (!method) return "";
	return method.toLowerCase() === "transfer" ? "Transfer" : "Cash";
}
function paymentStatus(total, paid) {
	return paid >= total && total > 0 ? "Lunas" : "Piutang";
}
function allocateAmount(totalAmount, subtotals) {
	if (subtotals.length === 0) return [];
	const total = subtotals.reduce((sum, value) => sum + value, 0);
	if (total <= 0) return subtotals.map(() => 0);
	let allocated = 0;
	return subtotals.map((subtotal, index) => {
		if (index === subtotals.length - 1) return Math.max(0, totalAmount - allocated);
		const value = Math.round(totalAmount * subtotal / total);
		allocated += value;
		return value;
	});
}
function soldQtyByMenuForOrder(db, orderId) {
	const sold = {};
	for (const sale of db.sales.filter((item) => item.orderId === orderId)) for (const item of sale.items) sold[item.menuId] = (sold[item.menuId] || 0) + item.qty;
	return sold;
}
function orderOriginalItems(db, order) {
	const sold = soldQtyByMenuForOrder(db, order.id);
	const ids = /* @__PURE__ */ new Set();
	for (const item of order.items) ids.add(item.menuId);
	Object.keys(sold).forEach((id) => ids.add(id));
	return Array.from(ids).map((menuId) => {
		const remainingQty = order.items.find((item) => item.menuId === menuId)?.qty || 0;
		const soldQty = sold[menuId] || 0;
		return {
			menuId,
			qty: remainingQty + soldQty,
			soldQty,
			price: menuPrice(db, menuId),
			name: menuName(db, menuId)
		};
	}).filter((item) => item.qty > 0);
}
function bazarRows(bazars) {
	return sortByCreatedAt(bazars).map((bazar, index) => [
		prettyId("BZR", index),
		bazar.name,
		bazar.date
	]);
}
function orderRows(db, orders) {
	const rows = [];
	sortByCreatedAt(orders).forEach((order, index) => {
		const bazar = bazarName(db, order.bazarId);
		const shifted = order.originalCustomer && order.originalCustomer !== order.customer ? `${order.originalCustomer} → ${order.customer}` : "";
		for (const item of orderOriginalItems(db, order)) rows.push([
			prettyId("PSN", index),
			bazar,
			order.customer,
			item.name,
			item.qty,
			item.price * item.qty,
			item.soldQty,
			shifted,
			order.note || ""
		]);
	});
	return rows;
}
function saleRows(db, sales) {
	const rows = [];
	sortByCreatedAt(sales).forEach((sale, index) => {
		const bazar = bazarName(db, sale.bazarId);
		const piutangPayments = db.payments.filter((payment) => payment.saleId === sale.id).reduce((sum, payment) => sum + payment.amount, 0);
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
				status
			]);
		});
	});
	return rows;
}
function expenseRows(db, expenses) {
	return sortByCreatedAt(expenses).map((expense, index) => [
		prettyId("PNG", index),
		bazarName(db, expense.bazarId),
		expense.name,
		expense.qty || 1,
		expense.amount
	]);
}
function paymentRows(db, payments) {
	return [...payments].sort((a, b) => a.date - b.date).map((payment, index) => {
		const sale = db.sales.find((item) => item.id === payment.saleId);
		const paidTotal = sale ? sale.paid + db.payments.filter((p) => p.saleId === sale.id).reduce((sum, p) => sum + p.amount, 0) : payment.amount;
		return [
			prettyId("BYR", index),
			bazarName(db, payment.bazarId),
			payment.customer,
			payment.amount,
			paymentMethodLabel(payment.method),
			sale ? paymentStatus(sale.total, paidTotal) : "Pembayaran Piutang",
			payment.menuName || "",
			new Date(payment.date).toISOString()
		];
	});
}
async function exportAll(db) {
	const targetUrl = load();
	if (!targetUrl) return {
		ok: false,
		message: "URL Apps Script belum diatur."
	};
	const sheets = {
		Bazar: bazarRows(db.bazars),
		Pesanan: orderRows(db, db.orders),
		Penjualan: saleRows(db, db.sales),
		Pengeluaran: expenseRows(db, db.expenses),
		"Pembayaran Piutang": paymentRows(db, db.payments)
	};
	const requestInit = {
		method: "POST",
		redirect: "follow",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			type: "bulk_export",
			payload: {
				bazars: db.bazars,
				menus: db.menus,
				orders: db.orders,
				sales: db.sales,
				expenses: db.expenses,
				payments: db.payments
			},
			sheets,
			sentAt: (/* @__PURE__ */ new Date()).toISOString()
		})
	};
	try {
		const res = await fetch(targetUrl, requestInit);
		let parsed = null;
		try {
			parsed = await res.json();
		} catch {
			parsed = null;
		}
		if (parsed && typeof parsed.ok === "boolean") return {
			ok: parsed.ok,
			message: parsed.message || parsed.error || (parsed.ok ? "Ekspor berhasil" : "Apps Script menolak data.")
		};
		if (!res.ok) return {
			ok: false,
			message: `Apps Script merespons error (HTTP ${res.status}). Cek URL deployment & pastikan akses diset "Anyone".`
		};
		return {
			ok: false,
			message: "Respon dari Apps Script tidak dikenali. Pastikan URL adalah link deployment \"/exec\" terbaru dan kode APPS_SCRIPT_FINAL.gs sudah di-deploy ulang sebagai versi baru."
		};
	} catch {
		try {
			await fetch(targetUrl, {
				...requestInit,
				mode: "no-cors"
			});
		} catch {
			return {
				ok: false,
				message: "Gagal terhubung ke Apps Script. Cek koneksi internet dan URL deployment."
			};
		}
		return {
			ok: true,
			message: "Semua data berhasil dikirim ke Google Sheets."
		};
	}
}
function SheetSyncSettings({ variant = "outline", size = "sm", fullWidth = false }) {
	const current = useSheetUrl();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [value, setValue] = (0, import_react.useState)(current);
	const connected = !!current;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: (o) => {
			setOpen(o);
			if (o) setValue(current);
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant,
				size,
				className: `gap-2 ${fullWidth ? "w-full" : ""}`,
				children: [connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "h-4 w-4" }), connected ? "Sinkron Sheets Aktif" : "Hubungkan Google Sheets"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Sinkron ke Google Sheets" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Tempel URL Deployment Google Apps Script (Web App). Data tidak dikirim otomatis; Google Sheets diperbarui hanya saat tombol Ekspor Semua Data ditekan." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				setSheetUrl(value);
				toast.success(value.trim() ? "URL Sheets tersimpan" : "URL Sheets dihapus");
				setOpen(false);
			},
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "sheet-url",
					children: "URL Deployment Apps Script"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "sheet-url",
					placeholder: "https://script.google.com/macros/s/.../exec",
					value,
					onChange: (e) => setValue(e.target.value),
					autoComplete: "off",
					spellCheck: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [
						"Pastikan Web App di-deploy dengan akses",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Anyone / Siapa saja" }),
						"."
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
				className: "gap-2 sm:gap-2",
				children: [connected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					onClick: () => {
						setSheetUrl("");
						setValue("");
						toast.success("URL Sheets dihapus");
						setOpen(false);
					},
					children: "Hapus"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Simpan"
				})]
			})]
		})] })]
	});
}
var menus = [
	{
		to: "/bazar",
		label: "Daftar Bazar",
		desc: "Kelola event, menu, pesanan, penjualan & pengeluaran.",
		Icon: Store,
		adminOnly: false
	},
	{
		to: "/piutang",
		label: "Daftar Piutang",
		desc: "Akumulasi piutang per customer dari semua bazar.",
		Icon: Wallet,
		adminOnly: false
	},
	{
		to: "/riwayat",
		label: "Riwayat Pembayaran Piutang",
		desc: "Log cicilan & pelunasan, terbaru di atas.",
		Icon: History,
		adminOnly: false
	},
	{
		to: "/kalkulator",
		label: "Kalkulator Keuntungan",
		desc: "Simulasi ekspektasi pendapatan bazar berikutnya.",
		Icon: Calculator,
		adminOnly: true
	}
];
function greeting(name) {
	const h = (/* @__PURE__ */ new Date()).getHours();
	const m = (/* @__PURE__ */ new Date()).getMinutes();
	const mins = h * 60 + m;
	let salam = "Selamat Malam";
	if (mins < 660) salam = "Selamat Pagi";
	else if (mins < 900) salam = "Selamat Siang";
	else if (mins < 1110) salam = "Selamat Sore";
	return `${salam}, ${name}`;
}
function Dashboard() {
	const db = useDB();
	const saldo = computeSaldo(db);
	const sheetUrl = useSheetUrl();
	const { displayName, isAdmin } = useAuth();
	const [hideSaldo, setHideSaldo] = (0, import_react.useState)(true);
	const [exporting, setExporting] = (0, import_react.useState)(false);
	const handleExport = async () => {
		if (!sheetUrl) {
			toast.error("Tempel URL Google Sheets terlebih dahulu");
			return;
		}
		setExporting(true);
		const result = await exportAll(db);
		setExporting(false);
		if (result.ok) toast.success(result.message || "Seluruh data dikirim ke Google Sheets");
		else toast.error(result.message || "Gagal mengirim — cek URL Apps Script", { duration: 8e3 });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-0.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-foreground",
							children: greeting(displayName)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${isAdmin ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`,
							children: isAdmin ? "ADMIN" : "VIEWER"
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSettings, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/saldo",
				className: "block rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 p-5 text-white shadow-lg shadow-emerald-900/20 transition hover:shadow-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-wider text-emerald-100/90",
								children: "Saldo Kas PHBW"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-3xl font-bold tracking-tight sm:text-4xl",
								children: hideSaldo ? "Rp ••••••" : fmtIDR(saldo)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-emerald-100/80",
								children: "Ketuk untuk rincian →"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "shrink-0 rounded-full p-2 text-white transition-colors hover:bg-white/15",
						onClick: (e) => {
							e.preventDefault();
							e.stopPropagation();
							setHideSaldo((v) => !v);
						},
						"aria-label": hideSaldo ? "Tampilkan saldo" : "Sembunyikan saldo",
						children: hideSaldo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-5 w-5" })
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: menus.filter((m) => !m.adminOnly || isAdmin).map(({ to, label, desc, Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to,
					className: "group rounded-2xl border bg-card p-5 transition hover:border-primary hover:shadow-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-foreground",
								children: label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-sm text-muted-foreground",
								children: desc
							})]
						})]
					})
				}, to))
			}),
			isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 text-sm font-semibold",
						children: "Sinkron Google Sheets"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-xs text-muted-foreground",
						children: "Atur URL Apps Script, lalu ekspor seluruh data aplikasi ke Google Sheets dari halaman utama ini."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetSyncSettings, { fullWidth: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							className: "w-full gap-2",
							onClick: handleExport,
							disabled: exporting || !sheetUrl,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-4 w-4 ${exporting ? "animate-spin" : ""}` }), exporting ? "Mengirim data ke Sheets..." : "🔄 Ekspor Semua Data ke Google Sheets"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-[10px] text-muted-foreground",
				children: "App created by : JJ"
			})
		]
	});
}
var settingsLabels = {
	"pin": "Ganti PIN",
	"modal-awal": "Edit Modal Awal",
	"left-logo": "Ganti Logo Kiri",
	"right-logo": "Ganti Logo Kanan",
	"main-header": "Ubah Header Utama",
	"workspace-header": "Ubah Header Dalam Bazar",
	"customers": "Kelola Customer Terdaftar",
	"backup-restore": "Backup & Restore Data",
	"admin-list": "Kelola Admin"
};
function AppSettings() {
	const db = useDB();
	const customers = allCustomersGlobal(db);
	const adminListData = useAdminList();
	const { isAdmin } = useAuth();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [active, setActive] = (0, import_react.useState)(null);
	const [pin, setPinInput] = (0, import_react.useState)("");
	const [verified, setVerified] = (0, import_react.useState)(false);
	const [next, setNext] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [newAdminEmail, setNewAdminEmail] = (0, import_react.useState)("");
	const [restoring, setRestoring] = (0, import_react.useState)(false);
	const [modalAwalInput, setModalAwalInput] = (0, import_react.useState)("");
	const currentMainHeader = useMainHeader();
	const currentWorkspaceHeader = useWorkspaceHeader();
	const [mainHeaderText, setMainHeaderText] = (0, import_react.useState)(currentMainHeader);
	const [workspaceHeaderText, setWorkspaceHeaderText] = (0, import_react.useState)(currentWorkspaceHeader);
	const leftLogo = useLogo();
	const rightLogo = useRightLogo();
	const leftFileRef = (0, import_react.useRef)(null);
	const rightFileRef = (0, import_react.useRef)(null);
	const restoreFileRef = (0, import_react.useRef)(null);
	const resetAction = () => {
		setActive(null);
		setPinInput("");
		setVerified(false);
		if (action === "modal-awal") setModalAwalInput(String(db.modalAwal || 0));
		setNext("");
		setConfirm("");
		setNewAdminEmail("");
	};
	(0, import_react.useEffect)(() => {
		if (open) {
			setMainHeaderText(currentMainHeader);
			setWorkspaceHeaderText(currentWorkspaceHeader);
		}
	}, [
		open,
		currentMainHeader,
		currentWorkspaceHeader
	]);
	const openAction = (action) => {
		setActive(action);
		setPinInput("");
		setVerified(false);
		setNext("");
		setConfirm("");
		setNewAdminEmail("");
	};
	const submitPin = (e) => {
		e.preventDefault();
		if (!verifyPin(pin)) {
			toast.error("PIN salah");
			return;
		}
		setVerified(true);
		setPinInput("");
	};
	const savePin = () => {
		if (next.length < 4) return toast.error("PIN baru minimal 4 karakter");
		if (next !== confirm) return toast.error("Konfirmasi PIN tidak cocok");
		setPin(next);
		toast.success("PIN berhasil diubah");
		resetAction();
	};
	const saveMainHeader = () => {
		setMainHeader(mainHeaderText || "Panitia Hari Besar Wilayah 2026");
		toast.success("Header utama berhasil disimpan");
		resetAction();
	};
	const saveWorkspaceHeader = () => {
		setWorkspaceHeader(workspaceHeaderText || "Wilayah IV");
		toast.success("Header dalam bazar berhasil disimpan");
		resetAction();
	};
	const handleLogoFile = (side, file) => {
		if (!file) return;
		if (!file.type.startsWith("image/")) return toast.error("File harus berupa gambar");
		if (file.size > 25e5) return toast.error("Maks 2.5MB");
		const reader = new FileReader();
		reader.onerror = () => toast.error("Gagal membaca gambar");
		reader.onload = () => {
			const result = typeof reader.result === "string" ? reader.result : "";
			if (!result.startsWith("data:image/")) return toast.error("Format gambar tidak valid");
			if (side === "left") {
				setLogo(result);
				if (leftFileRef.current) leftFileRef.current.value = "";
				toast.success("Logo kiri berhasil disimpan");
			} else {
				setRightLogo(result);
				if (rightFileRef.current) rightFileRef.current.value = "";
				toast.success("Logo kanan berhasil disimpan");
			}
			resetAction();
		};
		reader.readAsDataURL(file);
	};
	const clearLogo = (side) => {
		if (side === "left") setLogo(null);
		else setRightLogo(null);
		toast.success(side === "left" ? "Logo kiri dihapus" : "Logo kanan dihapus");
		resetAction();
	};
	const deleteCustomer = (name) => {
		const key = name.trim().toLowerCase();
		if (db.sales.some((s) => s.customer.trim().toLowerCase() === key && saleOutstanding(db, s.id) > 0)) {
			toast.error("Customer masih punya piutang aktif. Lunasi atau hapus pembayaran terkait dulu.");
			return;
		}
		removeCustomerFromMaster(name);
		toast.success("Customer dihapus dari daftar");
	};
	const handleAddAdmin = () => {
		const email = newAdminEmail.trim().toLowerCase();
		if (!email || !email.includes("@")) return toast.error("Masukkan alamat email yang valid");
		addAdmin(email);
		toast.success(`${email} ditambahkan sebagai Admin`);
		setNewAdminEmail("");
	};
	const handleRemoveAdmin = (email) => {
		removeAdmin(email);
		toast.success(`${email} dihapus dari daftar Admin`);
	};
	const handleBackup = () => {
		downloadBackup();
		toast.success("File backup sedang diunduh...");
	};
	const handleRestore = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (!window.confirm("⚠️ Restore akan MENGGANTIKAN semua data yang ada sekarang dengan data dari file backup. Lanjutkan?")) {
			e.target.value = "";
			return;
		}
		setRestoring(true);
		try {
			await restoreFromBackup(file);
			toast.success("Data berhasil dipulihkan! Halaman akan diperbarui.");
			setTimeout(() => window.location.reload(), 1200);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Gagal memulihkan data");
		} finally {
			setRestoring(false);
			if (restoreFileRef.current) restoreFileRef.current.value = "";
		}
	};
	const logout = () => {
		if (!window.confirm("Yakin ingin keluar dari akun ini?")) return;
		setOpen(false);
		signOut();
	};
	const renderActionContent = () => {
		if (!active) return null;
		if (active === "backup-restore") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 rounded-xl border p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-4 w-4" }), " Backup & Restore Data"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-muted-foreground",
					children: "Backup menyimpan seluruh data ke file .json. Restore memuat ulang dari file backup. Gunakan sebelum pindah perangkat atau clear cache."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					className: "w-full gap-2",
					onClick: handleBackup,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Backup Data (Download .json)"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							className: "w-full gap-2",
							disabled: restoring,
							onClick: () => restoreFileRef.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), restoring ? "Memulihkan data..." : "Restore Data (Upload .json)"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-amber-600",
							children: "⚠️ Restore akan menggantikan semua data yang ada sekarang."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: restoreFileRef,
							type: "file",
							accept: ".json,application/json",
							className: "hidden",
							onChange: handleRestore
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: resetAction,
					children: "Kembali"
				}) })
			]
		});
		if (!verified) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submitPin,
			className: "space-y-4 rounded-xl border bg-muted/20 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold",
					children: settingsLabels[active]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Masukkan PIN aktif untuk membuka pengaturan ini."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "password",
					autoFocus: true,
					value: pin,
					onChange: (e) => setPinInput(e.target.value),
					placeholder: "Masukkan PIN"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2 sm:gap-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: resetAction,
						children: "Batal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Lanjut"
					})]
				})
			]
		});
		if (active === "pin") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 rounded-xl border p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold",
					children: "Ganti PIN"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "PIN baru minimal 4 karakter."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "password",
					value: next,
					onChange: (e) => setNext(e.target.value),
					placeholder: "PIN baru"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "password",
					value: confirm,
					onChange: (e) => setConfirm(e.target.value),
					placeholder: "Konfirmasi PIN baru"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2 sm:gap-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: resetAction,
						children: "Batal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						onClick: savePin,
						children: "Simpan PIN"
					})]
				})
			]
		});
		if (active === "modal-awal") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 rounded-xl border p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold",
					children: "Edit Modal Awal"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: ["Saat ini: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: fmtIDR(db.modalAwal) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nominal" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					inputMode: "numeric",
					value: modalAwalInput,
					onChange: (e) => setModalAwalInput(e.target.value.replace(/[^\d]/g, "")),
					placeholder: "0"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2 sm:gap-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: resetAction,
						children: "Batal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						onClick: () => {
							setDB((d) => {
								d.modalAwal = Number(modalAwalInput) || 0;
							});
							toast.success("Modal awal diperbarui");
							resetAction();
						},
						children: "Simpan"
					})]
				})
			]
		});
		if (active === "left-logo" || active === "right-logo") {
			const side = active === "left-logo" ? "left" : "right";
			const logo = side === "left" ? leftLogo : rightLogo;
			const ref = side === "left" ? leftFileRef : rightFileRef;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 rounded-xl border p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoSettingCard, {
						title: settingsLabels[active],
						logo,
						onPick: () => ref.current?.click(),
						onClear: () => clearLogo(side)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref,
						type: "file",
						accept: "image/*",
						className: "hidden",
						onChange: (e) => handleLogoFile(side, e.target.files?.[0])
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: resetAction,
						children: "Batal"
					}) })
				]
			});
		}
		if (active === "main-header") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 rounded-xl border p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Header Utama" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: mainHeaderText,
				onChange: (e) => setMainHeaderText(e.target.value),
				placeholder: APP_TITLE
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
				className: "gap-2 sm:gap-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: resetAction,
					children: "Batal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					onClick: saveMainHeader,
					children: "Simpan"
				})]
			})]
		});
		if (active === "workspace-header") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 rounded-xl border p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Header Dalam Bazar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: workspaceHeaderText,
				onChange: (e) => setWorkspaceHeaderText(e.target.value),
				placeholder: WORKSPACE_ORG_LABEL
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
				className: "gap-2 sm:gap-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: resetAction,
					children: "Batal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					onClick: saveWorkspaceHeader,
					children: "Simpan"
				})]
			})]
		});
		if (active === "customers") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 rounded-xl border p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }), " Kelola Customer Terdaftar"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-muted-foreground",
					children: "Hapus customer hanya dari daftar pilihan/dropdown. Riwayat pesanan, penjualan, dan pembayaran lama tetap tersimpan."
				}),
				customers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-md bg-muted/40 p-3 text-xs text-muted-foreground",
					children: "Belum ada customer terdaftar."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-60 space-y-2 overflow-y-auto pr-1",
					children: customers.map((name) => {
						const hasActivePiutang = db.sales.some((s) => s.customer.trim().toLowerCase() === name.trim().toLowerCase() && saleOutstanding(db, s.id) > 0);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 rounded-md border bg-background px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-medium",
									children: name
								}), hasActivePiutang && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-warning",
									children: "Masih punya piutang aktif"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinConfirmDelete, {
								label: name,
								requirePin: true,
								canDelete: () => {
									if (hasActivePiutang) {
										toast.error("Customer masih punya piutang aktif. Lunasi atau hapus pembayaran terkait dulu.");
										return false;
									}
									return true;
								},
								onConfirm: () => deleteCustomer(name)
							})]
						}, name);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: resetAction,
					children: "Kembali"
				}) })
			]
		});
		if (active === "admin-list") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 rounded-xl border p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), " Kelola Admin"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-muted-foreground",
					children: "Admin punya akses penuh (tambah/edit/hapus). Viewer hanya bisa melihat data. Jika daftar kosong, semua pengguna adalah Admin."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "email@gmail.com",
						value: newAdminEmail,
						onChange: (e) => setNewAdminEmail(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleAddAdmin();
							}
						},
						className: "text-xs"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						type: "button",
						onClick: handleAddAdmin,
						children: "Tambah"
					})]
				}),
				adminListData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-md bg-muted/40 p-3 text-xs text-muted-foreground",
					children: "Daftar kosong — semua pengguna saat ini adalah Admin."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-48 space-y-2 overflow-y-auto pr-1",
					children: adminListData.map((email) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2 rounded-md border bg-background px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm",
							children: email
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							className: "h-7 w-7 text-destructive hover:text-destructive",
							onClick: () => handleRemoveAdmin(email),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
						})]
					}, email))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: resetAction,
					children: "Kembali"
				}) })
			]
		});
	};
	const visibleMenuItems = [
		{
			action: "pin",
			adminOnly: true
		},
		{
			action: "modal-awal",
			adminOnly: true
		},
		{
			action: "left-logo",
			adminOnly: true
		},
		{
			action: "right-logo",
			adminOnly: true
		},
		{
			action: "main-header",
			adminOnly: true
		},
		{
			action: "workspace-header",
			adminOnly: true
		},
		{
			action: "customers",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }),
			adminOnly: true
		},
		{
			action: "backup-restore",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-4 w-4" }),
			adminOnly: true
		},
		{
			action: "admin-list",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }),
			adminOnly: true
		}
	].filter((m) => !m.adminOnly || isAdmin);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: (isOpen) => {
			setOpen(isOpen);
			if (!isOpen) resetAction();
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "icon",
				variant: "ghost",
				"aria-label": "Pengaturan",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Pengaturan Aplikasi" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: !active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					visibleMenuItems.map(({ action, icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => openAction(action),
						className: "flex w-full items-center justify-between rounded-xl border bg-card px-4 py-3 text-left text-sm font-medium transition hover:bg-muted/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [icon, settingsLabels[action]]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })]
					}, action)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: logout,
						className: "flex w-full items-center justify-between rounded-xl border bg-card px-4 py-3 text-left text-sm font-medium text-destructive transition hover:bg-destructive/5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Log Out"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "pt-1 text-[10px] text-muted-foreground",
						children: ["PIN aktif sekarang: ", "•".repeat(getPin().length)]
					})
				]
			}) : renderActionContent()
		})] })]
	});
}
function LogoSettingCard({ title, logo, onPick, onClear }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-muted/40 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-12 w-12 place-items-center overflow-hidden rounded-full border bg-background",
				children: logo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: logo,
					alt: title,
					className: "h-full w-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-5 w-5 text-muted-foreground" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-medium",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] text-muted-foreground",
					children: "Upload gambar tersimpan permanen di perangkat ini."
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				size: "sm",
				variant: "outline",
				onClick: onPick,
				className: "flex-1 gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-3.5 w-3.5" }), " Pilih"]
			}), logo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "sm",
				variant: "ghost",
				onClick: onClear,
				className: "text-destructive",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
			})]
		})]
	});
}
//#endregion
export { Dashboard as component };
