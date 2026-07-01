import { r as __toESM } from "../_runtime.mjs";
import { O as require_jsx_runtime, k as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { H as ArrowLeft, I as ChevronRight, b as Pencil, h as Search, l as SlidersHorizontal, n as Wallet, q as ChartColumn, x as MessageCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as fmtIDR, p as saleOutstanding, y as useDB } from "./storage-DHI9muZ1.mjs";
import { o as useAuth } from "./auth-Q8aXDp4D.mjs";
import { i as shareToWhatsApp, t as Button } from "./button-DKCAsAV2.mjs";
import { t as Input } from "./input-DLhLYSN_.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Textarea } from "./textarea-Bb1LXzHR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/piutang.index-Dor968QC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TEMPLATE_KEY = "phbw-wa-piutang-template-v1";
var DEFAULT_TEMPLATE = "*Rekap Piutang Bazar PHBW 2026*\n\n{LIST}\n\nTotal: {TOTAL}\n\nMohon segera dilunasi ya 🙏\nTerima kasih — Tuhan Memberkati.";
var AVATAR_COLORS = [
	"bg-emerald-100 text-emerald-700",
	"bg-blue-100 text-blue-700",
	"bg-amber-100 text-amber-700",
	"bg-rose-100 text-rose-700",
	"bg-violet-100 text-violet-700",
	"bg-teal-100 text-teal-700",
	"bg-orange-100 text-orange-700"
];
function avatarColor(name) {
	let h = 0;
	for (let i = 0; i < name.length; i++) h = h * 31 + name.charCodeAt(i) >>> 0;
	return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function PiutangList() {
	const db = useDB();
	const { isAdmin } = useAuth();
	const [editingTpl, setEditingTpl] = (0, import_react.useState)(false);
	const [showFormat, setShowFormat] = (0, import_react.useState)(false);
	const [template, setTemplate] = (0, import_react.useState)(DEFAULT_TEMPLATE);
	const [q, setQ] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem(TEMPLATE_KEY);
		if (saved) setTemplate(saved);
	}, []);
	const { list, totalAll } = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		const firstInput = /* @__PURE__ */ new Map();
		for (const s of db.sales) {
			const out = saleOutstanding(db, s.id);
			if (out > 0) {
				map.set(s.customer, (map.get(s.customer) || 0) + out);
				firstInput.set(s.customer, Math.min(firstInput.get(s.customer) || s.createdAt, s.createdAt));
			}
		}
		const list = [...map.entries()].sort((a, b) => (firstInput.get(a[0]) || 0) - (firstInput.get(b[0]) || 0));
		return {
			list,
			totalAll: list.reduce((s, [, v]) => s + v, 0)
		};
	}, [db]);
	const filtered = (0, import_react.useMemo)(() => list.filter(([c]) => c.toLowerCase().includes(q.trim().toLowerCase())), [list, q]);
	const buildMessage = () => {
		const lines = list.map(([c, v], i) => `${i + 1}. ${c}: ${fmtIDR(v)}`).join("\n");
		return template.replace(/\{LIST\}/g, lines).replace(/\{TOTAL\}/g, fmtIDR(totalAll));
	};
	const sendWA = async () => {
		if (list.length === 0) return;
		const result = await shareToWhatsApp(buildMessage());
		if (!result.opened) if (result.copied) toast.info("Pop-up WhatsApp diblokir. Teks rekap sudah disalin.");
		else toast.error("Gagal membuka WhatsApp.");
	};
	const saveTemplate = () => {
		localStorage.setItem(TEMPLATE_KEY, template);
		setEditingTpl(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 pb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-bold",
							children: "Daftar Piutang"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Akumulasi piutang per customer dari seluruh bazar."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setShowFormat((v) => !v),
					className: "mt-8 grid h-10 w-10 place-items-center rounded-full border bg-card text-muted-foreground hover:border-primary hover:text-foreground",
					"aria-label": "Filter",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-4 w-4" })
				})]
			}),
			isAdmin && list.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: sendWA,
				className: "flex w-full items-center gap-3 rounded-2xl bg-emerald-600 p-4 text-left text-white shadow-sm transition hover:bg-emerald-700",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-500/40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[15px] font-semibold leading-tight",
								children: "Kirim Rekap Semua Piutang ke WA"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-xs opacity-90",
								children: [list.length, " customer \xA0·\xA0 Total Piutang"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-lg font-bold leading-tight",
								children: fmtIDR(totalAll)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 opacity-90" })
				]
			}),
			showFormat && list.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold",
						children: "Format Pesan WA"
					}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
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
				}), editingTpl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-2 text-xs text-muted-foreground",
						children: [
							"Gunakan ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "bg-muted px-1",
								children: "{LIST}"
							}),
							" dan",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "bg-muted px-1",
								children: "{TOTAL}"
							}),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 7,
						value: template,
						onChange: (e) => setTemplate(e.target.value),
						className: "text-xs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: saveTemplate,
							children: "Simpan"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => {
								setTemplate(DEFAULT_TEMPLATE);
								localStorage.removeItem(TEMPLATE_KEY);
							},
							children: "Reset"
						})]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-xs text-muted-foreground",
					children: buildMessage()
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Cari customer...",
						className: "h-11 rounded-xl pl-10"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border bg-card px-4 text-sm text-muted-foreground hover:border-primary hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-4 w-4" }), " Filter"]
				})]
			}),
			list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid place-items-center rounded-2xl border-2 border-dashed p-12 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-10 w-10 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "Tidak ada piutang."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [filtered.map(([customer, total]) => {
					const initial = customer.trim().charAt(0).toUpperCase() || "?";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/piutang/$customer",
						params: { customer: encodeURIComponent(customer) },
						className: "flex items-center gap-3 rounded-2xl border bg-card p-3 transition hover:border-emerald-500",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `grid h-11 w-11 shrink-0 place-items-center rounded-full text-base font-semibold ${avatarColor(customer)}`,
								children: initial
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate font-semibold",
									children: customer
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Klik untuk lihat rincian"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "whitespace-nowrap font-bold text-amber-600",
								children: fmtIDR(total)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 shrink-0 text-muted-foreground" })
						]
					}, customer);
				}), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-2xl border bg-card p-6 text-center text-sm text-muted-foreground",
					children: "Tidak ada customer cocok."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-2xl border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold",
							children: "Total Piutang"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [list.length, " customer"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-lg font-bold",
							children: fmtIDR(totalAll)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Total keseluruhan"
						})]
					})
				]
			})] })
		]
	});
}
//#endregion
export { PiutangList as component };
