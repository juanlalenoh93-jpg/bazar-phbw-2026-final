import { r as __toESM } from "../_runtime.mjs";
import { O as require_jsx_runtime, k as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { B as Calendar, C as Landmark, H as ArrowLeft, b as Pencil, c as Store, h as Search, n as Wallet, o as TrendingUp, r as Users, s as Trash2, u as ShoppingCart, y as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { h as setDB, i as bazarStats, l as fmtIDR, s as fmtDate, v as uid, y as useDB } from "./storage-DHI9muZ1.mjs";
import { o as useAuth } from "./auth-Q8aXDp4D.mjs";
import { t as Button } from "./button-DKCAsAV2.mjs";
import { t as Input } from "./input-DLhLYSN_.mjs";
import { t as Label } from "./label-DfxyFUsy.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, d as verifyPin, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./pin-DM1ztchA.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-BSp8No6r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bazar.index-R1lSX8Rb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BazarList() {
	const db = useDB();
	const { isAdmin } = useAuth();
	const bazars = [...db.bazars].sort((a, b) => a.createdAt - b.createdAt);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const filteredBazars = (0, import_react.useMemo)(() => bazars.filter((b) => b.name.toLowerCase().includes(query.trim().toLowerCase())), [bazars, query]);
	const openCreate = () => {
		setEditId(null);
		setName("");
		setDate((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
		setOpen(true);
	};
	const openEdit = (id) => {
		const b = db.bazars.find((x) => x.id === id);
		if (!b) return;
		setEditId(id);
		setName(b.name);
		setDate(b.date);
		setOpen(true);
	};
	const submit = (e) => {
		e.preventDefault();
		if (!name.trim()) return toast.error("Nama bazar wajib diisi");
		if (saving) return;
		setSaving(true);
		const newBazar = {
			id: uid(),
			name: name.trim(),
			date,
			createdAt: Date.now()
		};
		setDB((d) => {
			if (editId) {
				const b = d.bazars.find((x) => x.id === editId);
				if (b) {
					b.name = name.trim();
					b.date = date;
				}
			} else d.bazars.push(newBazar);
		});
		toast.success(editId ? "Bazar diperbarui" : "Bazar ditambahkan");
		setOpen(false);
		setSaving(false);
	};
	const bazarHasData = (id) => db.menus.some((x) => x.bazarId === id) || db.orders.some((x) => x.bazarId === id) || db.sales.some((x) => x.bazarId === id) || db.expenses.some((x) => x.bazarId === id) || db.payments.some((x) => x.bazarId === id);
	const remove = (id) => {
		setDB((d) => {
			d.bazars = d.bazars.filter((x) => x.id !== id);
			d.menus = d.menus.filter((x) => x.bazarId !== id);
			d.orders = d.orders.filter((x) => x.bazarId !== id);
			const saleIds = d.sales.filter((s) => s.bazarId === id).map((s) => s.id);
			d.sales = d.sales.filter((x) => x.bazarId !== id);
			d.expenses = d.expenses.filter((x) => x.bazarId !== id);
			d.payments = d.payments.filter((p) => !saleIds.includes(p.saleId));
		});
		toast.success("Bazar dihapus");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Kembali"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-6 w-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold tracking-tight sm:text-3xl",
						children: "Daftar Bazar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Kelola seluruh event bazar."
					})] })]
				}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open,
					onOpenChange: setOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							className: "w-full rounded-xl px-5 sm:w-auto",
							onClick: openCreate,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-5 w-5" }), " Bazar Baru"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editId ? "Edit Bazar" : "Tambah Bazar" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nama Bazar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Bazar Natal 2026"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tanggal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: date,
								onChange: (e) => setDate(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: saving,
								children: "Simpan"
							}) })
						]
					})] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Cari nama bazar...",
					className: "h-12 rounded-2xl border-border/80 bg-card pl-11 pr-4 text-[15px] shadow-sm"
				})]
			}),
			bazars.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {}) : filteredBazars.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoResultState, { query }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4",
				children: filteredBazars.map((b) => {
					const s = bazarStats(db, b.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-[20px] border bg-card p-4 shadow-[0_2px_10px_rgba(0,0,0,.06)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,.08)] sm:p-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[1fr_auto] items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/bazar/$id",
								params: { id: b.id },
								className: "block min-w-0 w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-lg font-bold text-foreground",
											children: b.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1 text-xs text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5" }), fmtDate(new Date(b.date).getTime())]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 rounded-2xl border border-border/70 p-3 sm:p-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
											children: "Ringkasan Keuangan"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 grid w-full grid-cols-2 gap-2.5 sm:gap-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinanceBox, {
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-6 w-6" }),
													tone: "emerald",
													label: "Penjualan",
													value: s.totalSales
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinanceBox, {
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-6 w-6" }),
													tone: "rose",
													label: "Pengeluaran",
													value: s.totalExpense
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinanceBox, {
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-6 w-6" }),
													tone: "amber",
													label: "Piutang",
													value: s.totalPiutang
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinanceBox, {
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-6 w-6" }),
													tone: "emerald",
													label: "Keuntungan",
													value: s.profit
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-5 border-t border-border/70 pt-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
												children: "Metode Pembayaran"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 grid w-full grid-cols-2 gap-2.5 sm:gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinanceBox, {
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-6 w-6" }),
													tone: "emerald",
													label: "Cash",
													value: s.totalCash,
													coloredValue: false
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinanceBox, {
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "h-6 w-6" }),
													tone: "blue",
													label: "Transfer",
													value: s.totalTransfer,
													coloredValue: false
												})]
											})]
										})
									]
								})]
							}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									className: "h-10 w-10 rounded-xl",
									onClick: () => openEdit(b.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4.5 w-4.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinConfirmDelete, {
									onConfirm: () => remove(b.id),
									label: b.name,
									requirePin: bazarHasData(b.id)
								})]
							})]
						})
					}, b.id);
				})
			})
		]
	});
}
function FinanceBox({ icon, tone, label, value, coloredValue = true }) {
	const t = {
		emerald: {
			bg: "bg-emerald-100",
			text: "text-emerald-600"
		},
		rose: {
			bg: "bg-rose-100",
			text: "text-rose-600"
		},
		amber: {
			bg: "bg-amber-100",
			text: "text-amber-500"
		},
		blue: {
			bg: "bg-blue-100",
			text: "text-blue-600"
		}
	}[tone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex w-full items-center gap-2.5 rounded-2xl border border-border/70 bg-white p-3 sm:gap-4 sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `grid h-9 w-9 shrink-0 place-items-center rounded-full ${t.bg} ${t.text} sm:h-12 sm:w-12`,
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "break-words text-xs text-muted-foreground sm:text-sm",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `break-words text-sm font-bold leading-tight sm:text-xl md:text-2xl ${coloredValue ? t.text : "text-foreground"}`,
				children: fmtIDR(value)
			})]
		})]
	});
}
function EmptyState() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid place-items-center rounded-[20px] border-2 border-dashed border-border bg-card/50 px-6 py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-16 w-16 place-items-center rounded-2xl bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-8 w-8 text-muted-foreground" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-lg font-semibold",
				children: "Belum ada bazar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Klik \"Bazar Baru\" untuk memulai."
			})
		]
	});
}
function NoResultState({ query }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid place-items-center rounded-[20px] border-2 border-dashed border-border bg-card/50 px-6 py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-16 w-16 place-items-center rounded-2xl bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-8 w-8 text-muted-foreground" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-lg font-semibold",
				children: "Tidak ditemukan"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [
					"Tidak ada bazar yang cocok dengan \"",
					query,
					"\"."
				]
			})
		]
	});
}
function ConfirmDelete({ onConfirm, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
		"Hapus ",
		label,
		"?"
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Tindakan ini tidak dapat dibatalkan." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Batal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
		onClick: onConfirm,
		children: "Hapus"
	})] })] }) });
}
function PinConfirmDelete({ onConfirm, label, requirePin = true, canDelete }) {
	const [pin, setPin] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [step, setStep] = (0, import_react.useState)("confirm");
	const reset = () => {
		setOpen(false);
		setStep("confirm");
		setPin("");
	};
	const startDelete = () => {
		if (canDelete && !canDelete()) return;
		setStep("confirm");
		setOpen(true);
	};
	const proceed = (e) => {
		e.preventDefault();
		if (requirePin) {
			setStep("pin");
			return;
		}
		onConfirm();
		reset();
	};
	const confirmWithPin = (e) => {
		e.preventDefault();
		if (!verifyPin(pin)) {
			toast.error("PIN salah");
			return;
		}
		onConfirm();
		reset();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		size: "icon",
		variant: "ghost",
		className: "h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive",
		onClick: startDelete,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
		open,
		onOpenChange: (v) => {
			if (!v) reset();
			else setOpen(true);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: step === "confirm" ? `Hapus ${label}?` : "Masukkan PIN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: step === "confirm" ? "Tindakan ini tidak dapat dibatalkan. Lanjutkan menghapus data ini?" : "Masukkan PIN aktif untuk melanjutkan penghapusan." })] }),
			step === "pin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PIN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "password",
					autoFocus: true,
					value: pin,
					onChange: (e) => setPin(e.target.value),
					placeholder: "Masukkan PIN"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Batal" }), step === "confirm" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				onClick: proceed,
				children: "Ya, Hapus"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				onClick: confirmWithPin,
				children: "Hapus"
			})] })
		] })
	})] });
}
//#endregion
export { ConfirmDelete, PinConfirmDelete, BazarList as component };
