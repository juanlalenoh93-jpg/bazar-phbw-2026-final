import { r as __toESM } from "../_runtime.mjs";
import { O as require_jsx_runtime, k as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { H as ArrowLeft, b as Pencil, x as MessageCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as fmtIDR, p as saleOutstanding, s as fmtDate, y as useDB } from "./storage-DHI9muZ1.mjs";
import { i as shareToWhatsApp, t as Button } from "./button-DKCAsAV2.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Textarea } from "./textarea-Bb1LXzHR.mjs";
import { t as Route } from "./bazar._id.rekapan-CoKsjaGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bazar._id.rekapan-C9ojxiIC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REKAP_TEMPLATE_KEY = "phbw-2026-rekap-template-v1";
var DEFAULT_TEMPLATE = `Shallom..
Berikut kami sampaikan Rekapan {BAZAR_NAME} PHBW 2026 ({BAZAR_DATE}):

PENGELUARAN
Total Pengeluaran : {TOTAL_PENGELUARAN}

PESANAN
Jumlah Customer : {JUMLAH_CUSTOMER_PESANAN} orang

Jumlah Menu Pesanan:
{LIST_MENU_PESANAN}

Pesanan Dialihkan : {DIALIHKAN}

PENJUALAN
Jumlah Customer : {JUMLAH_CUSTOMER_PENJUALAN} orang

Jumlah Menu Penjualan:
{LIST_MENU_PENJUALAN}

Jumlah Pendapatan Penjualan : {TOTAL_PENJUALAN}
Lunas : {TOTAL_LUNAS}
Piutang : {TOTAL_PIUTANG}

KEUNTUNGAN BERSIH
{KEUNTUNGAN}

Demikian rekapan {BAZAR_NAME} PHBW 2026 ({BAZAR_DATE}) yang dapat kami sampaikan.
Tuhan Yesus Memberkati...`;
var ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function alphaLabel(i) {
	return ALPHA[i] ?? String(i + 1);
}
function computeRekap(db, bazarId) {
	const bazarOrders = db.orders.filter((o) => o.bazarId === bazarId);
	const bazarSales = db.sales.filter((s) => s.bazarId === bazarId);
	const totalPengeluaran = db.expenses.filter((e) => e.bazarId === bazarId).reduce((sum, e) => sum + e.amount, 0);
	const pesananCustomers = /* @__PURE__ */ new Set();
	const pesananMenuMap = /* @__PURE__ */ new Map();
	for (const order of bazarOrders) {
		pesananCustomers.add(order.customer.trim().toLowerCase());
		const soldByMenu = {};
		for (const sale of db.sales.filter((s) => s.orderId === order.id)) for (const item of sale.items) soldByMenu[item.menuId] = (soldByMenu[item.menuId] || 0) + item.qty;
		const allMenuIds = /* @__PURE__ */ new Set([...order.items.map((i) => i.menuId), ...Object.keys(soldByMenu)]);
		for (const menuId of allMenuIds) {
			const originalQty = (order.items.find((i) => i.menuId === menuId)?.qty || 0) + (soldByMenu[menuId] || 0);
			if (originalQty <= 0) continue;
			const name = db.menus.find((m) => m.id === menuId)?.name || menuId;
			pesananMenuMap.set(name, (pesananMenuMap.get(name) || 0) + originalQty);
		}
	}
	const dialihkan = bazarOrders.filter((o) => o.originalCustomer && o.originalCustomer !== o.customer).map((o) => `${o.originalCustomer} → ${o.customer}`);
	const penjualanCustomers = /* @__PURE__ */ new Set();
	const penjualanMenuMap = /* @__PURE__ */ new Map();
	for (const sale of bazarSales) {
		penjualanCustomers.add(sale.customer.trim().toLowerCase());
		for (const item of sale.items) {
			const prev = penjualanMenuMap.get(item.name) || {
				qty: 0,
				total: 0
			};
			penjualanMenuMap.set(item.name, {
				qty: prev.qty + item.qty,
				total: prev.total + item.price * item.qty
			});
		}
	}
	const totalPenjualan = bazarSales.reduce((sum, s) => sum + s.total, 0);
	const totalPiutang = bazarSales.reduce((sum, s) => sum + saleOutstanding(db, s.id), 0);
	const totalLunas = totalPenjualan - totalPiutang;
	const keuntungan = bazarSales.reduce((s, x) => s + x.items.reduce((ss, it) => ss + (it.price - (it.cost || 0)) * it.qty, 0), 0) - totalPengeluaran;
	return {
		totalPengeluaran,
		pesananCustomers: pesananCustomers.size,
		pesananMenus: Array.from(pesananMenuMap.entries()),
		dialihkan,
		penjualanCustomers: penjualanCustomers.size,
		penjualanMenus: Array.from(penjualanMenuMap.entries()),
		totalPenjualan,
		totalLunas,
		totalPiutang,
		keuntungan
	};
}
function buildMessage(template, data, bazarName, bazarDate) {
	const listPesanan = data.pesananMenus.length ? data.pesananMenus.map(([name, qty], i) => `${alphaLabel(i)}. ${name} - ${qty}x`).join("\n") : "Belum ada pesanan";
	const listPenjualan = data.penjualanMenus.length ? data.penjualanMenus.map(([name, { qty, total }], i) => `${alphaLabel(i)}. ${name} - ${qty}x - ${fmtIDR(total)}`).join("\n") : "Belum ada penjualan";
	const dialihkanText = data.dialihkan.length ? data.dialihkan.join(", ") : "Tidak Ada";
	return template.replace(/\{BAZAR_NAME\}/g, bazarName).replace(/\{BAZAR_DATE\}/g, bazarDate).replace(/\{TOTAL_PENGELUARAN\}/g, fmtIDR(data.totalPengeluaran)).replace(/\{JUMLAH_CUSTOMER_PESANAN\}/g, String(data.pesananCustomers)).replace(/\{LIST_MENU_PESANAN\}/g, listPesanan).replace(/\{DIALIHKAN\}/g, dialihkanText).replace(/\{JUMLAH_CUSTOMER_PENJUALAN\}/g, String(data.penjualanCustomers)).replace(/\{LIST_MENU_PENJUALAN\}/g, listPenjualan).replace(/\{TOTAL_PENJUALAN\}/g, fmtIDR(data.totalPenjualan)).replace(/\{TOTAL_LUNAS\}/g, fmtIDR(data.totalLunas)).replace(/\{TOTAL_PIUTANG\}/g, fmtIDR(data.totalPiutang)).replace(/\{KEUNTUNGAN\}/g, fmtIDR(data.keuntungan));
}
function RekapanPage() {
	const { id } = Route.useParams();
	const db = useDB();
	const bazar = db.bazars.find((b) => b.id === id);
	const [editingTpl, setEditingTpl] = (0, import_react.useState)(false);
	const [template, setTemplate] = (0, import_react.useState)(DEFAULT_TEMPLATE);
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem(REKAP_TEMPLATE_KEY);
		if (saved) setTemplate(saved);
	}, []);
	const data = (0, import_react.useMemo)(() => computeRekap(db, id), [db, id]);
	if (!bazar) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/bazar",
			className: "inline-flex items-center gap-1 text-sm text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Daftar Bazar"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "Bazar tidak ditemukan."
		})]
	});
	const bazarDate = fmtDate(new Date(bazar.date).getTime());
	const message = buildMessage(template, data, bazar.name, bazarDate);
	const saveTemplate = () => {
		localStorage.setItem(REKAP_TEMPLATE_KEY, template);
		setEditingTpl(false);
		toast.success("Template disimpan");
	};
	const resetTemplate = () => {
		setTemplate(DEFAULT_TEMPLATE);
		localStorage.removeItem(REKAP_TEMPLATE_KEY);
		toast.success("Template direset ke default");
	};
	const sendWA = async () => {
		const result = await shareToWhatsApp(message);
		if (!result.opened) if (result.copied) toast.info("Pop-up WhatsApp diblokir browser. Teks rekapan sudah disalin — tempel manual di WhatsApp.");
		else toast.error("Gagal membuka WhatsApp. Pastikan pop-up tidak diblokir, lalu coba lagi.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/bazar/$id",
				params: { id },
				className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }),
					" ",
					bazar.name
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-bold",
				children: "Rekapan Bazar"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					bazar.name,
					" · ",
					bazarDate
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: sendWA,
				className: "flex w-full items-center gap-4 rounded-2xl bg-emerald-600 p-5 text-left text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-700 active:scale-[0.98]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-6 w-6" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-base font-semibold",
						children: "Kirim Rekapan Bazar ke WA"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-emerald-100/90",
						children: [
							bazar.name,
							" · ",
							bazarDate
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold",
						children: "Format Pesan WA"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => setEditingTpl((v) => !v),
						className: "gap-1 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" }),
							" ",
							editingTpl ? "Tutup" : "Edit"
						]
					})]
				}), editingTpl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-muted-foreground leading-relaxed",
							children: [
								"Token: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "rounded bg-muted px-1",
									children: "{BAZAR_NAME}"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "rounded bg-muted px-1",
									children: "{BAZAR_DATE}"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "rounded bg-muted px-1",
									children: "{TOTAL_PENGELUARAN}"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "rounded bg-muted px-1",
									children: "{JUMLAH_CUSTOMER_PESANAN}"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "rounded bg-muted px-1",
									children: "{LIST_MENU_PESANAN}"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "rounded bg-muted px-1",
									children: "{DIALIHKAN}"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "rounded bg-muted px-1",
									children: "{JUMLAH_CUSTOMER_PENJUALAN}"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "rounded bg-muted px-1",
									children: "{LIST_MENU_PENJUALAN}"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "rounded bg-muted px-1",
									children: "{TOTAL_PENJUALAN}"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "rounded bg-muted px-1",
									children: "{TOTAL_LUNAS}"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "rounded bg-muted px-1",
									children: "{TOTAL_PIUTANG}"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "rounded bg-muted px-1",
									children: "{KEUNTUNGAN}"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 16,
							value: template,
							onChange: (e) => setTemplate(e.target.value),
							className: "font-mono text-xs"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: saveTemplate,
								children: "Simpan"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: resetTemplate,
								children: "Reset Default"
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "whitespace-pre-wrap rounded-xl bg-muted/50 p-4 text-xs leading-relaxed text-foreground/80",
					children: message
				})]
			})
		]
	});
}
//#endregion
export { RekapanPage as component };
