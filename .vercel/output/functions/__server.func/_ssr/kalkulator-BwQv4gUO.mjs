import { r as __toESM } from "../_runtime.mjs";
import { O as require_jsx_runtime, k as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { H as ArrowLeft, s as Trash2, y as Plus } from "../_libs/lucide-react.mjs";
import { l as fmtIDR } from "./storage-DHI9muZ1.mjs";
import { t as Button } from "./button-DKCAsAV2.mjs";
import { t as Input } from "./input-DLhLYSN_.mjs";
import { t as Label } from "./label-DfxyFUsy.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kalkulator-BwQv4gUO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var rid = () => Math.random().toString(36).slice(2, 9);
function KalkulatorPage() {
	const [rows, setRows] = (0, import_react.useState)([{
		id: rid(),
		name: "",
		price: "",
		cost: "",
		qty: ""
	}]);
	const totalPendapatan = rows.reduce((s, r) => s + (+r.price || 0) * (+r.qty || 0), 0);
	const totalModal = rows.reduce((s, r) => s + (+r.cost || 0) * (+r.qty || 0), 0);
	const totalUntung = totalPendapatan - totalModal;
	const update = (id, k, v) => setRows((rs) => rs.map((r) => r.id === id ? {
		...r,
		[k]: v
	} : r));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Kembali"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-bold",
				children: "Kalkulator Keuntungan"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Simulasi ekspektasi keuntungan bazar berikutnya."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: rows.map((r, idx) => {
					const subPendapatan = (+r.price || 0) * (+r.qty || 0);
					const subModal = (+r.cost || 0) * (+r.qty || 0);
					const subUntung = subPendapatan - subModal;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border bg-card p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "text-xs text-muted-foreground",
									children: ["Menu #", idx + 1]
								}), rows.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									className: "text-destructive",
									onClick: () => setRows((rs) => rs.filter((x) => x.id !== r.id)),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Nama menu",
								value: r.name,
								onChange: (e) => update(r.id, "name", e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 grid grid-cols-3 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Harga jual",
										inputMode: "numeric",
										value: r.price,
										onChange: (e) => update(r.id, "price", e.target.value.replace(/[^\d]/g, ""))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Harga modal",
										inputMode: "numeric",
										value: r.cost,
										onChange: (e) => update(r.id, "cost", e.target.value.replace(/[^\d]/g, ""))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Porsi",
										inputMode: "numeric",
										value: r.qty,
										onChange: (e) => update(r.id, "qty", e.target.value.replace(/[^\d]/g, ""))
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 grid grid-cols-3 gap-2 text-right text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-muted-foreground",
										children: [
											"Omzet",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
												className: "text-foreground",
												children: fmtIDR(subPendapatan)
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-muted-foreground",
										children: [
											"Modal",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
												className: "text-destructive",
												children: fmtIDR(subModal)
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-muted-foreground",
										children: [
											"Untung",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
												className: "text-primary",
												children: fmtIDR(subUntung)
											})
										]
									})
								]
							})
						]
					}, r.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				className: "w-full",
				onClick: () => setRows((rs) => [...rs, {
					id: rid(),
					name: "",
					price: "",
					cost: "",
					qty: ""
				}]),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Tambah Menu"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky bottom-4 space-y-2 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 p-5 text-white shadow-lg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-sm opacity-90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Omzet" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtIDR(totalPendapatan) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-sm opacity-90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Modal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtIDR(totalModal) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-t border-white/20 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs uppercase tracking-wider opacity-90",
							children: "Ekspektasi Keuntungan"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl font-bold",
							children: fmtIDR(totalUntung)
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { KalkulatorPage as component };
