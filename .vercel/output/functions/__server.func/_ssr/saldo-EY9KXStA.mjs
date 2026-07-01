import { r as __toESM } from "../_runtime.mjs";
import { O as require_jsx_runtime, k as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { F as ChevronUp, G as CircleArrowUp, H as ArrowLeft, K as CircleArrowDown, L as ChevronDown } from "../_libs/lucide-react.mjs";
import { a as computeSaldo, l as fmtIDR, s as fmtDate, y as useDB } from "./storage-DHI9muZ1.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/saldo-EY9KXStA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SaldoPage() {
	const db = useDB();
	const saldo = computeSaldo(db);
	const [showMasuk, setShowMasuk] = (0, import_react.useState)(false);
	const [showKeluar, setShowKeluar] = (0, import_react.useState)(false);
	const totalIn = db.sales.reduce((s, x) => s + x.paid, 0) + db.payments.reduce((s, x) => s + x.amount, 0);
	const totalExpense = db.expenses.reduce((s, x) => s + x.amount, 0);
	const transaksiMasuk = [...db.sales.filter((s) => s.paid > 0).map((s) => {
		const bazar = db.bazars.find((b) => b.id === s.bazarId);
		return {
			id: s.id,
			tanggal: s.createdAt,
			jenis: `Penjualan Bazar (${s.customer})`,
			bazar: bazar?.name || "-",
			jumlah: s.paid
		};
	}), ...db.payments.map((p) => {
		const bazar = db.bazars.find((b) => b.id === p.bazarId);
		return {
			id: p.id,
			tanggal: p.date,
			jenis: `Pembayaran Piutang (${p.customer})`,
			bazar: bazar?.name || "-",
			jumlah: p.amount
		};
	})].sort((a, b) => b.tanggal - a.tanggal);
	const transaksiKeluar = db.expenses.map((e) => {
		const bazar = db.bazars.find((b) => b.id === e.bazarId);
		return {
			id: e.id,
			tanggal: e.createdAt,
			jenis: `Belanja (${e.name})`,
			bazar: bazar?.name || "-",
			jumlah: e.amount
		};
	}).sort((a, b) => b.tanggal - a.tanggal);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Kembali"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-bold",
				children: "Rincian Saldo Kas"
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-gradient-to-br from-primary to-emerald-600 p-6 text-primary-foreground shadow-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase tracking-wider opacity-90",
					children: "Saldo Saat Ini"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-4xl font-bold",
					children: fmtIDR(saldo)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Modal Awal",
						value: db.modalAwal
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Total Uang Masuk",
						value: totalIn
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Total Pengeluaran",
						value: totalExpense,
						negative: true
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border bg-card overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex w-full items-center justify-between px-4 py-3",
					onClick: () => setShowMasuk((v) => !v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleArrowDown, { className: "h-4 w-4 text-emerald-600" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-sm",
								children: "Transaksi Masuk"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-emerald-600 font-medium",
								children: fmtIDR(transaksiMasuk.reduce((s, t) => s + t.jumlah, 0))
							})
						]
					}), showMasuk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 text-muted-foreground" })]
				}), showMasuk && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t px-4 pb-4 pt-3 space-y-2",
					children: transaksiMasuk.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center text-sm text-muted-foreground py-4",
						children: "Belum ada transaksi masuk"
					}) : transaksiMasuk.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border bg-background p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted-foreground",
									children: [
										fmtDate(t.tanggal),
										" · ",
										t.bazar
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 text-sm font-medium",
									children: t.jenis
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "shrink-0 font-semibold text-emerald-600",
								children: ["+", fmtIDR(t.jumlah)]
							})]
						})
					}, t.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border bg-card overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex w-full items-center justify-between px-4 py-3",
					onClick: () => setShowKeluar((v) => !v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleArrowUp, { className: "h-4 w-4 text-destructive" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-sm",
								children: "Transaksi Keluar"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-destructive font-medium",
								children: fmtIDR(transaksiKeluar.reduce((s, t) => s + t.jumlah, 0))
							})
						]
					}), showKeluar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 text-muted-foreground" })]
				}), showKeluar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t px-4 pb-4 pt-3 space-y-2",
					children: transaksiKeluar.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center text-sm text-muted-foreground py-4",
						children: "Belum ada transaksi keluar"
					}) : transaksiKeluar.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border bg-background p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted-foreground",
									children: [
										fmtDate(t.tanggal),
										" · ",
										t.bazar
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 text-sm font-medium",
									children: t.jenis
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "shrink-0 font-semibold text-destructive",
								children: ["-", fmtIDR(t.jumlah)]
							})]
						})
					}, t.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border bg-card p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Untuk ubah ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Modal Awal" }),
						", buka ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Pengaturan ⚙️" }),
						" → ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Edit Modal Awal" }),
						"."
					]
				})
			})
		]
	});
}
function Row({ label, value, negative }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between rounded-xl border bg-card px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `font-semibold ${negative ? "text-destructive" : "text-foreground"}`,
			children: fmtIDR(value)
		})]
	});
}
//#endregion
export { SaldoPage as component };
