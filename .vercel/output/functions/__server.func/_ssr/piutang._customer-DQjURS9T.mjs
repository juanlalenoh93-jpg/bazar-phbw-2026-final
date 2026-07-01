import { r as __toESM } from "../_runtime.mjs";
import { O as require_jsx_runtime, k as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { H as ArrowLeft, a as Upload } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as fmtDateTime, h as setDB, l as fmtIDR, m as salePaidTotal, p as saleOutstanding, v as uid, y as useDB } from "./storage-DHI9muZ1.mjs";
import { o as useAuth } from "./auth-Q8aXDp4D.mjs";
import { t as Button } from "./button-DKCAsAV2.mjs";
import { t as Input } from "./input-DLhLYSN_.mjs";
import { t as Label } from "./label-DfxyFUsy.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Badge } from "./badge-DcWIs7Wy.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-BSp8No6r.mjs";
import { n as RadioGroupItem, t as RadioGroup } from "./radio-group-C04m0iRK.mjs";
import { t as Route } from "./piutang._customer-zqgWm1JW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/piutang._customer-DQjURS9T.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomerDetail() {
	const { customer: raw } = Route.useParams();
	const customer = decodeURIComponent(raw);
	const db = useDB();
	const { isAdmin } = useAuth();
	const sales = db.sales.filter((s) => s.customer === customer && saleOutstanding(db, s.id) > 0).sort((a, b) => a.createdAt - b.createdAt);
	const totalOut = sales.reduce((s, x) => s + saleOutstanding(db, x.id), 0);
	const bazarName = (id) => db.bazars.find((b) => b.id === id)?.name || "?";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/piutang",
				className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Daftar Piutang"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-bold",
				children: customer
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm",
				children: ["Total piutang: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
					className: "text-warning",
					children: fmtIDR(totalOut)
				})]
			})] }),
			sales.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl border bg-card p-6 text-center text-muted-foreground",
				children: "Tidak ada piutang aktif."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: sales.map((s) => {
					const out = saleOutstanding(db, s.id);
					const paidSoFar = salePaidTotal(db, s.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									children: bazarName(s.bazarId)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-xs text-muted-foreground",
									children: fmtDateTime(s.createdAt)
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "Sisa"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-warning",
										children: fmtIDR(out)
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 space-y-1 text-sm",
								children: s.items.map((i, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between rounded bg-muted/50 px-2 py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										i.name,
										" × ",
										i.qty
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtIDR(i.price * i.qty) })]
								}, idx))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-xs text-muted-foreground",
								children: [
									"Total ",
									fmtIDR(s.total),
									" · Sudah dibayar ",
									fmtIDR(paidSoFar)
								]
							}),
							isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BayarDialog, {
									saleId: s.id,
									bazarName: bazarName(s.bazarId),
									menuSummary: s.items.map((i) => `${i.name}×${i.qty}`).join(", "),
									max: out,
									customer,
									bazarId: s.bazarId
								})
							})
						]
					}, s.id);
				})
			})
		]
	});
}
function BayarDialog({ saleId, bazarName, menuSummary, max, customer, bazarId }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [amount, setAmount] = (0, import_react.useState)("");
	const [method, setMethod] = (0, import_react.useState)("cash");
	const [proof, setProof] = (0, import_react.useState)();
	const fileRef = (0, import_react.useRef)(null);
	const onFile = (f) => {
		if (!f) return;
		const r = new FileReader();
		r.onload = () => setProof(r.result);
		r.readAsDataURL(f);
	};
	const submit = (e) => {
		e.preventDefault();
		const n = +amount || 0;
		if (n <= 0) return toast.error("Nominal harus > 0");
		if (n > max) return toast.error(`Maksimum cicilan ${fmtIDR(max)}`);
		if (method === "transfer" && !proof) return toast.error("Upload bukti transfer");
		const newPayment = {
			id: uid(),
			saleId,
			bazarId,
			customer,
			menuName: menuSummary,
			amount: n,
			method,
			proof,
			date: Date.now()
		};
		setDB((d) => {
			d.payments.push(newPayment);
		});
		toast.success("Pembayaran tercatat");
		setOpen(false);
		setAmount("");
		setProof(void 0);
		setMethod("cash");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				className: "w-full",
				children: "Bayar / Cicil"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Pembayaran Piutang" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-muted/50 p-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: customer }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-muted-foreground",
							children: [
								bazarName,
								" — ",
								menuSummary
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1",
							children: ["Sisa: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								className: "text-warning",
								children: fmtIDR(max)
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nominal Cicilan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					inputMode: "numeric",
					value: amount,
					onChange: (e) => setAmount(e.target.value.replace(/[^\d]/g, "")),
					placeholder: "0"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Metode" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioGroup, {
					value: method,
					onValueChange: (v) => setMethod(v),
					className: "mt-2 flex gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, { value: "cash" }), " Cash"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, { value: "transfer" }), " Transfer"]
					})]
				})] }),
				method === "transfer" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bukti Transfer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							onClick: () => fileRef.current?.click(),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }),
								" ",
								proof ? "Ganti" : "Upload / Kamera"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "image/*",
							capture: "environment",
							className: "hidden",
							onChange: (e) => onFile(e.target.files?.[0])
						}),
						proof && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: proof,
							alt: "bukti",
							className: "h-12 w-12 rounded border object-cover"
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Simpan Pembayaran"
				}) })
			]
		})] })]
	});
}
//#endregion
export { CustomerDetail as component };
