import { r as __toESM } from "../_runtime.mjs";
import { O as require_jsx_runtime, k as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as ORGANIZATION_NAME, s as useWorkspaceHeader } from "./branding-D-EPtLZP.mjs";
import { H as ArrowLeft, M as ClipboardList, P as Church, R as Check, U as Funnel, W as CircleCheck, _ as Receipt, a as Upload, b as Pencil, d as ShoppingBag, h as Search, i as UserCog, j as Clock, k as Copy, n as Wallet, u as ShoppingCart, v as Printer, x as MessageCircle, y as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as useLogo, c as fmtDateTime, h as setDB, l as fmtIDR, n as allCustomersGlobal, p as saleOutstanding, r as bazarMenuSummary, s as fmtDate, t as addCustomerToMaster, u as menuStats, v as uid, y as useDB } from "./storage-DHI9muZ1.mjs";
import { o as useAuth } from "./auth-Q8aXDp4D.mjs";
import { r as cn, t as Button } from "./button-DKCAsAV2.mjs";
import { t as Input } from "./input-DLhLYSN_.mjs";
import { t as Label } from "./label-DfxyFUsy.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PinConfirmDelete } from "./bazar.index-DYH4R8ux.mjs";
import { t as Route } from "./bazar._id-3cnj9n48.mjs";
import { t as Textarea } from "./textarea-Bb1LXzHR.mjs";
import { t as Badge } from "./badge-DcWIs7Wy.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-BSp8No6r.mjs";
import { n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as RadioGroupItem, t as RadioGroup } from "./radio-group-C04m0iRK.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bazar._id-BHiI6_qA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
var TAB_LIST = [
	"menu",
	"pesanan",
	"penjualan",
	"pengeluaran",
	"rekapan"
];
function BazarDetail() {
	const { id } = Route.useParams();
	const db = useDB();
	const logo = useLogo();
	const workspaceHeader = useWorkspaceHeader();
	const { isAdmin } = useAuth();
	const [tab, setTab] = (0, import_react.useState)("menu");
	const touchStartX = (0, import_react.useRef)(0);
	const touchStartY = (0, import_react.useRef)(0);
	const swipeActive = (0, import_react.useRef)(false);
	const handleTouchStart = (0, import_react.useCallback)((e) => {
		if (e.target.closest("input,textarea,select,button,[role=button],[role=checkbox]")) {
			swipeActive.current = false;
			return;
		}
		swipeActive.current = true;
		touchStartX.current = e.touches[0].clientX;
		touchStartY.current = e.touches[0].clientY;
	}, []);
	const handleTouchEnd = (0, import_react.useCallback)((e) => {
		if (!swipeActive.current) return;
		swipeActive.current = false;
		const dx = e.changedTouches[0].clientX - touchStartX.current;
		const dy = e.changedTouches[0].clientY - touchStartY.current;
		if (Math.abs(dx) < 60 || Math.abs(dx) <= Math.abs(dy) * 1.5) return;
		const idx = TAB_LIST.indexOf(tab);
		if (dx < 0 && idx < TAB_LIST.length - 1) setTab(TAB_LIST[idx + 1]);
		else if (dx > 0 && idx > 0) setTab(TAB_LIST[idx - 1]);
	}, [tab]);
	const bazar = db.bazars.find((b) => b.id === id);
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
	const menus = (0, import_react.useMemo)(() => db.menus.filter((m) => m.bazarId === id).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)), [db.menus, id]);
	const orders = (0, import_react.useMemo)(() => db.orders.filter((o) => o.bazarId === id).sort((a, b) => a.createdAt - b.createdAt), [db.orders, id]);
	const sales = (0, import_react.useMemo)(() => db.sales.filter((s) => s.bazarId === id).sort((a, b) => a.createdAt - b.createdAt), [db.sales, id]);
	const expenses = (0, import_react.useMemo)(() => db.expenses.filter((e) => e.bazarId === id).sort((a, b) => a.createdAt - b.createdAt), [db.expenses, id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/bazar",
				className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Daftar Bazar"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "truncate text-2xl font-bold",
						children: bazar.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: fmtDate(new Date(bazar.date).getTime())
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center gap-2 rounded-full border bg-card px-2.5 py-1.5 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-8 w-8 place-items-center overflow-hidden rounded-full border bg-primary/10 text-primary",
						children: logo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: logo,
							alt: "Logo Wilayah IV",
							className: "h-full w-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Church, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold text-foreground",
						children: workspaceHeader
					})]
				})]
			}),
			!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-700",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Mode Viewer" }), " — Anda hanya dapat melihat data. Hubungi Admin untuk melakukan perubahan."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				onTouchStart: handleTouchStart,
				onTouchEnd: handleTouchEnd,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					value: tab,
					onValueChange: (v) => setTab(v),
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
							className: "grid h-11 w-full grid-cols-5 rounded-xl bg-muted/60 p-1",
							children: [
								"menu",
								"pesanan",
								"penjualan",
								"pengeluaran",
								"rekapan"
							].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: k,
								className: "relative truncate whitespace-nowrap rounded-lg bg-transparent px-1 text-[11px] font-medium text-muted-foreground shadow-none data-[state=active]:bg-transparent data-[state=active]:text-emerald-700 data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:inset-x-3 data-[state=active]:after:-bottom-0.5 data-[state=active]:after:h-[3px] data-[state=active]:after:rounded-full data-[state=active]:after:bg-emerald-600 sm:text-xs",
								children: k === "menu" ? "Menu" : k === "pesanan" ? "Pesanan" : k === "penjualan" ? "Penjualan" : k === "pengeluaran" ? "Pengeluaran" : "Rekapan"
							}, k))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuTab, {
								bazarId: id,
								menus,
								isAdmin
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "pesanan",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PesananTab, {
								bazarId: id,
								menus,
								orders,
								isAdmin
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "penjualan",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenjualanTab, {
								sales,
								bazarName: bazar.name,
								isAdmin
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "pengeluaran",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PengeluaranTab, {
								bazarId: id,
								expenses,
								isAdmin
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "rekapan",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RekapanTab, {
								bazarId: id,
								bazarName: bazar.name,
								bazarDate: bazar.date
							})
						})
					]
				})
			})
		]
	});
}
function MenuTab({ bazarId, menus, isAdmin }) {
	const db = useDB();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [price, setPrice] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const reset = () => {
		setEditId(null);
		setName("");
		setPrice("");
	};
	const openEdit = (m) => {
		setEditId(m.id);
		setName(m.name);
		setPrice(String(m.price));
		setOpen(true);
	};
	const submit = (e) => {
		e.preventDefault();
		if (!name.trim()) return toast.error("Nama menu wajib");
		if (saving) return;
		setSaving(true);
		const newMenu = {
			id: uid(),
			bazarId,
			name: name.trim(),
			price: +price || 0,
			cost: 0,
			qty: 0,
			createdAt: Date.now()
		};
		setDB((d) => {
			if (editId) {
				const m = d.menus.find((x) => x.id === editId);
				if (m) {
					m.name = name.trim();
					m.price = +price || 0;
				}
			} else d.menus.push(newMenu);
		});
		toast.success("Tersimpan");
		setOpen(false);
		reset();
		setSaving(false);
	};
	const filteredMenus = (0, import_react.useMemo)(() => menus.filter((m) => m.name.toLowerCase().includes(search.trim().toLowerCase())), [menus, search]);
	const summary = (0, import_react.useMemo)(() => bazarMenuSummary(db, bazarId), [db, bazarId]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open,
					onOpenChange: (o) => {
						setOpen(o);
						if (!o) reset();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							className: "gap-1 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Menu Baru"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [editId ? "Edit" : "Tambah", " Menu"] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nama Menu" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Harga Jual" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "numeric",
								value: price,
								onChange: (e) => setPrice(e.target.value.replace(/[^\d]/g, ""))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								size: "sm",
								disabled: saving,
								children: "Simpan"
							}) })
						]
					})] })]
				})
			}),
			menus.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: search,
					onChange: (e) => setSearch(e.target.value),
					placeholder: "Cari menu...",
					className: "pl-9"
				})]
			}),
			menus.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-emerald-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold",
						children: "Statistik menu dihitung otomatis"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-emerald-700/80",
						children: "Berdasarkan data pesanan dan penjualan pada bazar ini."
					})]
				})]
			}),
			menus.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Belum ada menu untuk bazar ini." }) : filteredMenus.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Tidak ada menu dengan nama itu." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: filteredMenus.map((m) => {
					const stat = menuStats(db, m.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[16px] border bg-card p-2.5 shadow-[0_2px_8px_rgba(0,0,0,.06)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate font-medium",
									children: m.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-muted-foreground",
									children: fmtIDR(m.price)
								})]
							}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => openEdit(m),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinConfirmDelete, {
									label: m.name,
									requirePin: stat.pesanan > 0 || stat.terjual > 0,
									onConfirm: () => {
										setDB((d) => {
											d.menus = d.menus.filter((x) => x.id !== m.id);
										});
										toast.success("Menu dihapus");
									}
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 grid grid-cols-3 gap-2 border-t pt-2 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuStatItem, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-3.5 w-3.5" }),
									label: "Pesanan",
									value: stat.pesanan
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuStatItem, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-3.5 w-3.5" }),
									label: "Terjual",
									value: stat.terjual,
									tone: "good"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuStatItem, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }),
									label: "Belum diambil",
									value: stat.belumDiambil,
									tone: "warn"
								})
							]
						})]
					}, m.id);
				})
			}),
			menus.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[16px] border bg-gradient-to-br from-emerald-50/60 to-card p-3.5 shadow-[0_2px_8px_rgba(0,0,0,.06)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-4.5 w-4.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold",
							children: "Ringkasan Menu"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Total semua menu"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryStat, {
							label: "Pesanan",
							value: summary.pesanan
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryStat, {
							label: "Terjual",
							value: summary.terjual,
							tone: "good"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryStat, {
							label: "Belum diambil",
							value: summary.belumDiambil,
							tone: "warn"
						})
					]
				})]
			})
		]
	});
}
function MenuStatItem({ icon, label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex items-center justify-center gap-1 text-[11px] text-muted-foreground`,
		children: [
			icon,
			" ",
			label
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `text-base font-bold ${tone === "good" ? "text-emerald-700" : tone === "warn" ? "text-amber-600" : "text-foreground"}`,
		children: value
	})] });
}
function SummaryStat({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-[11px] text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `text-base font-bold ${tone === "good" ? "text-emerald-700" : tone === "warn" ? "text-amber-600" : "text-foreground"}`,
		children: value
	})] });
}
function PesananTab({ bazarId, menus, orders, isAdmin }) {
	const db = useDB();
	const customerNames = allCustomersGlobal(db);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [customer, setCustomer] = (0, import_react.useState)("");
	const [picks, setPicks] = (0, import_react.useState)({});
	const [searchCustomer, setSearchCustomer] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const filteredOrders = (0, import_react.useMemo)(() => {
		return orders.filter((o) => {
			if (!o.customer.toLowerCase().includes(searchCustomer.trim().toLowerCase())) return false;
			if (statusFilter === "all") return true;
			const status = orderStatusInfo(db, o);
			if (statusFilter === "unprocessed") return !status.fullSold && !status.partialSold;
			if (statusFilter === "partial") return status.partialSold;
			if (statusFilter === "sold") return status.fullSold;
			return true;
		});
	}, [
		orders,
		searchCustomer,
		statusFilter,
		db
	]);
	const submit = (e) => {
		e.preventDefault();
		if (saving) return;
		const trimmed = customer.trim();
		if (!trimmed) return toast.error("Nama customer wajib");
		const items = Object.entries(picks).map(([menuId, q]) => ({
			menuId,
			qty: +q || 0
		})).filter((i) => i.qty > 0);
		if (items.length === 0) return toast.error("Pilih minimal 1 menu");
		if (db.orders.some((o) => o.bazarId === bazarId && !o.soldAt && o.items.some((i) => i.qty > 0) && o.customer.trim().toLowerCase() === trimmed.toLowerCase())) {
			if (!window.confirm("Customer ini sudah melakukan pesanan, apakah anda yakin mau membuat pesanan baru?")) return;
		}
		setSaving(true);
		const newOrder = {
			id: uid(),
			bazarId,
			customer: trimmed,
			items,
			createdAt: Date.now()
		};
		setDB((d) => {
			d.orders.push(newOrder);
		});
		addCustomerToMaster(trimmed);
		toast.success("Pesanan ditambahkan");
		setOpen(false);
		setCustomer("");
		setPicks({});
		setSaving(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open,
					onOpenChange: setOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							disabled: menus.length === 0,
							className: "gap-1.5 rounded-xl border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Pesanan"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Tambah Pesanan" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nama Customer" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: customer,
									onChange: (e) => setCustomer(e.target.value),
									placeholder: "Ketik nama customer...",
									autoComplete: "off"
								}),
								customerNames.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
									value: "",
									onChange: (e) => {
										if (e.target.value) setCustomer(e.target.value);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Pilih Customer"
									}), customerNames.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: n,
										children: n
									}, n))]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Menu & Qty Pesan" }), menus.map((m) => {
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-lg border p-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex-1 text-sm min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-medium truncate",
													children: m.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted-foreground",
													children: fmtIDR(m.price)
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												className: "w-20",
												inputMode: "numeric",
												placeholder: "0",
												value: picks[m.id] || "",
												onChange: (e) => {
													const num = +e.target.value.replace(/[^\d]/g, "") || 0;
													setPicks((p) => ({
														...p,
														[m.id]: num ? String(num) : ""
													}));
												}
											})]
										})
									}, m.id);
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: saving,
								children: "Simpan Pesanan"
							}) })
						]
					})] })]
				})
			}),
			menus.length > 0 && orders.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: searchCustomer,
							onChange: (e) => setSearchCustomer(e.target.value),
							placeholder: "Cari nama customer...",
							className: "h-11 rounded-xl pl-9"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl border bg-card text-muted-foreground hover:text-foreground",
						"aria-label": "Filter",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 overflow-x-auto pb-0.5 scrollbar-none",
					children: [
						{
							key: "all",
							label: "Semua"
						},
						{
							key: "unprocessed",
							label: "Belum di proses"
						},
						{
							key: "partial",
							label: "Sebagian Terjual"
						},
						{
							key: "sold",
							label: "Terjual"
						}
					].map(({ key, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setStatusFilter(key),
						className: `inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${statusFilter === key ? "border-emerald-600 bg-emerald-600 text-white shadow-sm" : "border-border bg-card text-muted-foreground hover:border-emerald-300 hover:text-foreground"}`,
						children: [key !== "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3 w-3" }), label]
					}, key))
				})]
			}),
			menus.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Tambahkan menu terlebih dahulu di tab Menu." }),
			menus.length > 0 && orders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Belum ada pesanan." }),
			menus.length > 0 && orders.length > 0 && filteredOrders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Tidak ada pesanan yang sesuai filter." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: filteredOrders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderCard, {
					order: o,
					menus,
					bazarId,
					isAdmin
				}, o.id))
			})
		]
	});
}
function orderSoldQtyByMenu(db, orderId) {
	const sold = {};
	for (const sale of db.sales.filter((item) => item.orderId === orderId)) for (const item of sale.items) sold[item.menuId] = (sold[item.menuId] || 0) + item.qty;
	return sold;
}
function orderDisplayItems(db, order, menus) {
	const sold = orderSoldQtyByMenu(db, order.id);
	const ids = /* @__PURE__ */ new Set();
	order.items.forEach((item) => ids.add(item.menuId));
	Object.keys(sold).forEach((id) => ids.add(id));
	return Array.from(ids).map((menuId) => {
		const remainingQty = order.items.find((item) => item.menuId === menuId)?.qty || 0;
		const soldQty = sold[menuId] || 0;
		const originalQty = remainingQty + soldQty;
		const menu = menus.find((m) => m.id === menuId);
		const saleItem = db.sales.flatMap((sale) => sale.items).find((item) => item.menuId === menuId);
		return {
			menuId,
			name: menu?.name || saleItem?.name || "?",
			price: menu?.price || saleItem?.price || 0,
			remainingQty,
			soldQty,
			originalQty
		};
	}).filter((item) => item.originalQty > 0);
}
function orderStatusInfo(db, order) {
	const soldQty = db.sales.filter((sale) => sale.orderId === order.id).flatMap((sale) => sale.items).reduce((sum, item) => sum + item.qty, 0);
	const remainingQty = order.items.reduce((sum, item) => sum + item.qty, 0);
	if (soldQty === 0) return {
		label: "Belum di proses",
		fullSold: false,
		partialSold: false
	};
	if (remainingQty === 0) return {
		label: "Terjual",
		fullSold: true,
		partialSold: false
	};
	return {
		label: "Sebagian Terjual",
		fullSold: false,
		partialSold: true
	};
}
function OrderCard({ order, menus, bazarId, isAdmin }) {
	const db = useDB();
	const displayItems = (0, import_react.useMemo)(() => orderDisplayItems(db, order, menus), [
		db,
		order,
		menus
	]);
	const status = (0, import_react.useMemo)(() => orderStatusInfo(db, order), [db, order]);
	const totalItem = displayItems.reduce((s, i) => s + i.originalQty, 0);
	const totalPesanan = displayItems.reduce((s, i) => s + i.price * i.originalQty, 0);
	const initial = order.customer.trim().charAt(0).toUpperCase() || "?";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-[16px] border p-3.5 shadow-[0_2px_8px_rgba(0,0,0,.06)] ${status.fullSold ? "border-emerald-200 bg-emerald-50/40" : status.partialSold ? "border-amber-200 bg-amber-50/40" : "bg-card"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-base font-semibold text-primary",
						children: initial
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold truncate",
							children: order.customer
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: fmtDateTime(order.createdAt)
						})]
					})]
				}), status.fullSold ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					className: "shrink-0 gap-1 bg-emerald-600 text-white",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }),
						" ",
						status.label
					]
				}) : status.partialSold ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					className: "shrink-0 bg-amber-500 text-white",
					children: status.label
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					className: "shrink-0 bg-slate-200 text-slate-700 hover:bg-slate-200",
					children: status.label
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2.5 list-disc space-y-1 pl-4 text-sm marker:text-muted-foreground/60",
				children: displayItems.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between gap-2 py-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 truncate",
						children: [
							i.name,
							" × ",
							i.originalQty
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 whitespace-nowrap text-muted-foreground",
						children: fmtIDR(i.price * i.originalQty)
					})]
				}, i.menuId))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid grid-cols-3 gap-2 border-t border-dashed pt-3 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-1 text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-3 w-3" }), " Total Item"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-sm font-bold",
						children: totalItem
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-1 text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-3 w-3" }), " Total Pesanan"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 whitespace-nowrap text-sm font-bold",
						children: fmtIDR(totalPesanan)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-1 text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Status"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `mt-0.5 truncate text-xs font-semibold ${status.fullSold ? "text-emerald-600" : status.partialSold ? "text-amber-600" : "text-amber-600"}`,
						children: status.label
					})] })
				]
			}),
			isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2.5",
				children: db.sales.some((sale) => sale.orderId === order.id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinConfirmDelete, {
					label: "pesanan",
					requirePin: false,
					canDelete: () => {
						toast.error("Pesanan ini sudah memiliki riwayat penjualan. Hapus penjualan terkait terlebih dahulu sebelum menghapus pesanan.");
						return false;
					},
					onConfirm: () => {}
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JualDialog, {
						order,
						menus,
						bazarId
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditOrderDialog, {
						order,
						menus
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GantiCustomerDialog, {
						order,
						menus
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinConfirmDelete, {
						label: "pesanan",
						requirePin: true,
						onConfirm: () => {
							setDB((d) => {
								d.orders = d.orders.filter((x) => x.id !== order.id);
							});
							toast.success("Pesanan dihapus");
						}
					})
				] })
			})
		]
	});
}
function EditOrderDialog({ order, menus }) {
	useDB();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [picks, setPicks] = (0, import_react.useState)(() => Object.fromEntries(order.items.map((i) => [i.menuId, String(i.qty)])));
	const [saving, setSaving] = (0, import_react.useState)(false);
	const submit = (e) => {
		e.preventDefault();
		if (saving) return;
		const items = menus.map((m) => ({
			menuId: m.id,
			qty: +(picks[m.id] || 0) || 0
		})).filter((i) => i.qty > 0);
		if (items.length === 0) return toast.error("Minimal 1 menu");
		setSaving(true);
		setDB((d) => {
			const o = d.orders.find((x) => x.id === order.id);
			if (o) o.items = items;
		});
		toast.success("Pesanan diperbarui");
		setOpen(false);
		setSaving(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				className: "h-10 gap-1.5 rounded-xl px-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" }), " Edit"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Edit Pesanan — ", order.customer] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: menus.map((m) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg border p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 text-sm min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium truncate",
									children: m.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: fmtIDR(m.price)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "w-20",
								inputMode: "numeric",
								placeholder: "0",
								value: picks[m.id] || "",
								onChange: (e) => {
									const num = +e.target.value.replace(/[^\d]/g, "") || 0;
									setPicks((p) => ({
										...p,
										[m.id]: num ? String(num) : ""
									}));
								}
							})]
						})
					}, m.id);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: saving,
				children: "Simpan"
			}) })]
		})] })]
	});
}
function JualDialog({ order, menus, bazarId }) {
	useDB();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [checked, setChecked] = (0, import_react.useState)({});
	const [qtys, setQtys] = (0, import_react.useState)({});
	const [method, setMethod] = (0, import_react.useState)("cash");
	const [paid, setPaid] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [proof, setProof] = (0, import_react.useState)();
	const [saving, setSaving] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	const menuOf = (0, import_react.useCallback)((id) => menus.find((m) => m.id === id), [menus]);
	const selectedItems = (0, import_react.useMemo)(() => order.items.filter((i) => i.qty > 0 && checked[i.menuId]).map((i) => ({
		...i,
		takeQty: Math.min(+(qtys[i.menuId] || i.qty) || 0, i.qty)
	})).filter((i) => i.takeQty > 0), [
		order,
		checked,
		qtys
	]);
	const total = (0, import_react.useMemo)(() => selectedItems.reduce((s, i) => s + i.takeQty * (menuOf(i.menuId)?.price || 0), 0), [selectedItems, menuOf]);
	const onFile = (f) => {
		if (!f) return;
		const r = new FileReader();
		r.onload = () => setProof(r.result);
		r.readAsDataURL(f);
	};
	const reset = () => {
		setChecked({});
		setQtys({});
		setMethod("cash");
		setPaid("");
		setNote("");
		setProof(void 0);
		setSaving(false);
	};
	const submit = (e) => {
		e.preventDefault();
		if (saving) return;
		if (selectedItems.length === 0) return toast.error("Centang minimal 1 menu");
		const paidNum = +paid || 0;
		if (paidNum > total) return toast.error("Nominal bayar > total");
		if (method === "transfer" && paidNum > 0 && !proof) return toast.error("Upload bukti transfer dahulu");
		setSaving(true);
		const saleItems = selectedItems.map((i) => {
			const m = menuOf(i.menuId);
			return {
				menuId: i.menuId,
				name: m.name,
				price: m.price,
				cost: m.cost || 0,
				qty: i.takeQty
			};
		});
		const newSale = {
			id: uid(),
			bazarId,
			orderId: order.id,
			customer: order.customer,
			items: saleItems,
			total,
			method,
			paid: paidNum,
			proof,
			createdAt: Date.now(),
			note: note.trim() || order.note || void 0
		};
		setDB((d) => {
			const o = d.orders.find((x) => x.id === order.id);
			if (o) {
				for (const it of selectedItems) {
					const oi = o.items.find((x) => x.menuId === it.menuId);
					if (oi) oi.qty = Math.max(0, oi.qty - it.takeQty);
				}
				if (o.items.reduce((s, x) => s + x.qty, 0) === 0) {
					o.soldAt = Date.now();
					o.saleId = newSale.id;
				}
			}
			d.sales.push(newSale);
		});
		addCustomerToMaster(order.customer);
		toast.success(paidNum >= total ? "Penjualan LUNAS tersimpan" : paidNum > 0 ? "Pembayaran sebagian tersimpan" : "Tercatat sebagai PIUTANG");
		setOpen(false);
		reset();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: (o) => {
			setOpen(o);
			if (!o) reset();
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				className: "h-10 gap-1.5 rounded-xl bg-emerald-600 px-3.5 text-white hover:bg-emerald-700",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4" }), " Jual"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Konfirmasi Penjualan — ", order.customer] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Centang menu yang diambil & atur Qty parsial. Sisa pesanan tetap aktif." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2 rounded-lg border p-2",
					children: order.items.filter((i) => i.qty > 0).map((i) => {
						const m = menuOf(i.menuId);
						const isChecked = !!checked[i.menuId];
						const cur = +(qtys[i.menuId] || (isChecked ? i.qty : 0));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: isChecked,
									onCheckedChange: (v) => {
										setChecked((p) => ({
											...p,
											[i.menuId]: !!v
										}));
										if (v && !qtys[i.menuId]) setQtys((p) => ({
											...p,
											[i.menuId]: String(i.qty)
										}));
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 text-sm min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium truncate",
										children: m?.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											fmtIDR(m?.price || 0),
											" · Sisa pesanan ",
											i.qty
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "w-16",
									inputMode: "numeric",
									disabled: !isChecked,
									value: qtys[i.menuId] || "",
									onChange: (e) => {
										const raw = e.target.value.replace(/[^\d]/g, "");
										const num = Math.min(+raw || 0, i.qty);
										setQtys((p) => ({
											...p,
											[i.menuId]: num ? String(num) : ""
										}));
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-20 text-right text-xs text-muted-foreground",
									children: fmtIDR((m?.price || 0) * (isChecked ? cur : 0))
								})
							]
						}, i.menuId);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-muted/50 px-3 py-2 text-sm flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Tagihan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: fmtIDR(total) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Metode Pembayaran" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioGroup, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nominal Bayar (0 = Piutang)" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						inputMode: "numeric",
						value: paid,
						onChange: (e) => setPaid(e.target.value.replace(/[^\d]/g, "")),
						placeholder: "0"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: ["Status: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: (+paid || 0) >= total && total > 0 ? "LUNAS" : "PIUTANG" })]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Keterangan (opsional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: note,
					onChange: (e) => setNote(e.target.value),
					placeholder: "cth: diambil oleh Si B"
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
					disabled: total === 0 || saving,
					children: "Simpan Penjualan"
				}) })
			]
		})] })]
	});
}
function GantiCustomerDialog({ order, menus }) {
	const customerNames = allCustomersGlobal(useDB());
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [checked, setChecked] = (0, import_react.useState)({});
	const [qtys, setQtys] = (0, import_react.useState)({});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const menuOf = (id) => menus.find((m) => m.id === id);
	const submit = (e) => {
		e.preventDefault();
		if (saving) return;
		const trimmed = name.trim();
		if (!trimmed) return toast.error("Nama customer baru wajib");
		const moves = order.items.filter((i) => i.qty > 0 && checked[i.menuId]).map((i) => ({
			menuId: i.menuId,
			takeQty: Math.min(+(qtys[i.menuId] || i.qty) || 0, i.qty)
		})).filter((i) => i.takeQty > 0);
		if (moves.length === 0) return toast.error("Pilih minimal 1 item");
		setSaving(true);
		setDB((d) => {
			const o = d.orders.find((x) => x.id === order.id);
			if (!o) return;
			if (moves.every((m) => {
				const oi = o.items.find((x) => x.menuId === m.menuId);
				return oi && oi.qty === m.takeQty;
			}) && o.items.filter((i) => i.qty > 0).length === moves.length) {
				if (!o.originalCustomer) o.originalCustomer = o.customer;
				o.customer = trimmed;
			} else {
				const newItems = [];
				for (const mv of moves) {
					const oi = o.items.find((x) => x.menuId === mv.menuId);
					if (oi) {
						oi.qty -= mv.takeQty;
						newItems.push({
							menuId: mv.menuId,
							qty: mv.takeQty
						});
					}
				}
				d.orders.push({
					id: uid(),
					bazarId: o.bazarId,
					customer: trimmed,
					items: newItems,
					createdAt: Date.now(),
					originalCustomer: o.customer
				});
			}
		});
		addCustomerToMaster(trimmed);
		toast.success("Pesanan dialihkan");
		setOpen(false);
		setName("");
		setChecked({});
		setQtys({});
		setSaving(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				className: "h-10 gap-1.5 rounded-xl px-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "h-4 w-4" }), " Ganti"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Alihkan Pesanan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Pilih item & qty yang dialihkan. Jika tidak semua, sisanya tetap di customer lama." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nama Customer Baru" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Ketik nama...",
						autoComplete: "off"
					}),
					customerNames.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
						value: "",
						onChange: (e) => {
							if (e.target.value) setName(e.target.value);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Pilih Customer"
						}), customerNames.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: n,
							children: n
						}, n))]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 rounded-lg border p-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Item yang dialihkan"
					}), order.items.filter((i) => i.qty > 0).map((i) => {
						const m = menuOf(i.menuId);
						const isChecked = !!checked[i.menuId];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: isChecked,
									onCheckedChange: (v) => {
										setChecked((p) => ({
											...p,
											[i.menuId]: !!v
										}));
										if (v && !qtys[i.menuId]) setQtys((p) => ({
											...p,
											[i.menuId]: String(i.qty)
										}));
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 text-sm min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium truncate",
										children: m?.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: ["Sisa pesanan ", i.qty]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "w-16",
									inputMode: "numeric",
									disabled: !isChecked,
									value: qtys[i.menuId] || "",
									onChange: (e) => {
										const raw = e.target.value.replace(/[^\d]/g, "");
										const num = Math.min(+raw || 0, i.qty);
										setQtys((p) => ({
											...p,
											[i.menuId]: num ? String(num) : ""
										}));
									}
								})
							]
						}, i.menuId);
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: saving,
					children: "Alihkan"
				}) })
			]
		})] })]
	});
}
function PenjualanTab({ sales, bazarName, isAdmin }) {
	const db = useDB();
	const [searchCustomer, setSearchCustomer] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const filteredSales = (0, import_react.useMemo)(() => sales.filter((s) => {
		if (!s.customer.toLowerCase().includes(searchCustomer.trim().toLowerCase())) return false;
		if (statusFilter === "all") return true;
		const isPiutang = saleOutstanding(db, s.id) > 0;
		if (statusFilter === "piutang") return isPiutang;
		if (statusFilter === "lunas") return !isPiutang;
		return true;
	}), [
		sales,
		searchCustomer,
		statusFilter,
		db
	]);
	const filterButtons = [
		{
			key: "all",
			label: "Semua"
		},
		{
			key: "lunas",
			label: "Lunas"
		},
		{
			key: "piutang",
			label: "Piutang"
		}
	];
	if (sales.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Belum ada penjualan." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: searchCustomer,
						onChange: (e) => setSearchCustomer(e.target.value),
						placeholder: "Cari nama customer...",
						className: "h-11 rounded-xl pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl border bg-card text-muted-foreground hover:text-foreground",
					"aria-label": "Filter",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 overflow-x-auto pb-0.5 scrollbar-none",
				children: filterButtons.map(({ key, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setStatusFilter(key),
					className: `inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${statusFilter === key ? "border-emerald-600 bg-emerald-600 text-white shadow-sm" : "border-border bg-card text-muted-foreground hover:border-emerald-300 hover:text-foreground"}`,
					children: [key !== "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3 w-3" }), label]
				}, key))
			})]
		}), filteredSales.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Tidak ada penjualan yang sesuai filter." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3",
			children: filteredSales.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaleCard, {
				sale: s,
				bazarName,
				isAdmin
			}, s.id))
		})]
	});
}
function StatGroupItem({ icon, tone, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5 first:pl-0 last:pr-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `grid h-9 w-9 shrink-0 place-items-center rounded-full ${{
				emerald: "bg-emerald-100 text-emerald-700",
				blue: "bg-blue-100 text-blue-700",
				violet: "bg-violet-100 text-violet-700",
				amber: "bg-amber-100 text-amber-700",
				rose: "bg-rose-100 text-rose-700"
			}[tone]}`,
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "truncate text-sm font-bold",
				children: value
			})]
		})]
	});
}
function SaleCard({ sale, bazarName, isAdmin }) {
	const db = useDB();
	const outstanding = saleOutstanding(db, sale.id);
	const status = outstanding > 0 ? "PIUTANG" : "LUNAS";
	const doDelete = () => {
		setDB((d) => {
			if (sale.orderId) {
				let o = d.orders.find((x) => x.id === sale.orderId);
				if (!o) {
					o = {
						id: sale.orderId,
						bazarId: sale.bazarId,
						customer: sale.customer,
						items: [],
						createdAt: Date.now()
					};
					d.orders.push(o);
				}
				for (const it of sale.items) {
					const oi = o.items.find((x) => x.menuId === it.menuId);
					if (oi) oi.qty += it.qty;
					else o.items.push({
						menuId: it.menuId,
						qty: it.qty
					});
				}
				delete o.soldAt;
				delete o.saleId;
			}
			d.sales = d.sales.filter((x) => x.id !== sale.id);
		});
		toast.success("Penjualan dihapus & qty pesanan dikembalikan (terbuka kembali)");
	};
	const hasPiutangPayments = db.payments.some((p) => p.saleId === sale.id);
	const canDeleteSale = () => {
		if (hasPiutangPayments) {
			toast.error("Penjualan ini sudah memiliki pembayaran piutang. Hapus pembayaran piutang terkait terlebih dahulu.");
			return false;
		}
		return true;
	};
	const printNota = () => {
		const w = window.open("", "_blank", "width=420,height=600");
		if (!w) return;
		const rows = sale.items.map((i) => `<tr><td>${i.name}</td><td style="text-align:center">${i.qty}</td><td style="text-align:right">${fmtIDR(i.price)}</td><td style="text-align:right">${fmtIDR(i.price * i.qty)}</td></tr>`).join("");
		w.document.write(`<html><head><title>Nota - ${sale.customer}</title>
      <style>body{font-family:system-ui;padding:16px;max-width:380px;margin:0 auto;color:#111}
      h2{margin:0 0 4px;font-size:18px}.muted{color:#666;font-size:12px}
      table{width:100%;border-collapse:collapse;margin-top:12px;font-size:13px}
      th,td{padding:6px 4px;border-bottom:1px dashed #ddd}
      .tot{font-weight:700;border-top:2px solid #000}</style></head><body>
      <h2>PHBW 2026 — ${bazarName}</h2>
      <div class="muted">${ORGANIZATION_NAME}</div><hr/>
      <div><b>Customer:</b> ${sale.customer}</div>
      <div><b>Jenis Metode Pembayaran:</b> ${sale.method === "cash" ? "Cash" : "Transfer"}</div>
      <div class="muted">${fmtDateTime(sale.createdAt)}</div>
      <table><thead><tr><th align="left">Menu</th><th>Qty</th><th align="right">Harga</th><th align="right">Subtotal</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr class="tot"><td colspan="3" align="right">Total</td><td align="right">${fmtIDR(sale.total)}</td></tr>
      <tr><td colspan="3" align="right">Bayar</td><td align="right">${fmtIDR(sale.paid)}</td></tr>
      <tr><td colspan="3" align="right">Status</td><td align="right">${status}</td></tr></tfoot></table>
      <p class="muted" style="text-align:center;margin-top:18px">Terima kasih — Tuhan Memberkati 🙏</p>
      <script>window.print()<\/script></body></html>`);
		w.document.close();
	};
	const initial = sale.customer.trim().charAt(0).toUpperCase() || "?";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[16px] border bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,.06)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `grid h-10 w-10 shrink-0 place-items-center rounded-full text-base font-semibold ${status === "LUNAS" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`,
						children: initial
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate font-semibold",
							children: sale.customer
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: fmtDateTime(sale.createdAt)
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					className: `shrink-0 ${status === "LUNAS" ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"}`,
					children: status
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 list-disc space-y-1 pl-4 text-sm marker:text-muted-foreground/60",
				children: sale.items.map((i, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between gap-2 py-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 truncate",
						children: [
							i.name,
							" × ",
							i.qty
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 whitespace-nowrap",
						children: fmtIDR(i.price * i.qty)
					})]
				}, idx))
			}),
			status === "LUNAS" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex divide-x rounded-xl border bg-muted/30 px-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatGroupItem, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-4 w-4" }),
						tone: "emerald",
						label: "Total",
						value: fmtIDR(sale.total)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatGroupItem, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }),
						tone: "blue",
						label: "Bayar",
						value: fmtIDR(sale.paid)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatGroupItem, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }),
						tone: "violet",
						label: "Metode",
						value: sale.method === "cash" ? "Cash" : "Transfer"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex divide-x rounded-xl border border-amber-200 bg-amber-50/50 px-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatGroupItem, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-4 w-4" }),
						tone: "emerald",
						label: "Total",
						value: fmtIDR(sale.total)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatGroupItem, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }),
						tone: "blue",
						label: "Bayar",
						value: fmtIDR(sale.paid)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatGroupItem, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "h-4 w-4" }),
						tone: "amber",
						label: "Sisa",
						value: fmtIDR(outstanding)
					})
				]
			}),
			sale.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-800",
				children: ["📝 ", sale.note]
			}),
			sale.proof && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: sale.proof,
				target: "_blank",
				rel: "noreferrer",
				className: "mt-2 inline-block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: sale.proof,
					alt: "bukti",
					className: "h-16 rounded border"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: printNota,
					className: "h-10 gap-1.5 rounded-xl border-emerald-500 px-4 text-emerald-700 hover:bg-emerald-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-4 w-4" }), " Nota"]
				}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinConfirmDelete, {
					label: "penjualan",
					requirePin: true,
					canDelete: canDeleteSale,
					onConfirm: doDelete
				})]
			})
		]
	});
}
function PengeluaranTab({ bazarId, expenses, isAdmin }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [qty, setQty] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [searchName, setSearchName] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const filteredExpenses = (0, import_react.useMemo)(() => expenses.filter((e) => e.name.toLowerCase().includes(searchName.trim().toLowerCase())), [expenses, searchName]);
	const reset = () => {
		setEditId(null);
		setName("");
		setQty("");
		setAmount("");
	};
	const submit = (e) => {
		e.preventDefault();
		if (!name.trim()) return toast.error("Nama wajib");
		if (saving) return;
		setSaving(true);
		const newExpense = {
			id: editId || uid(),
			bazarId,
			name: name.trim(),
			qty: +qty || 1,
			amount: +amount || 0,
			createdAt: Date.now()
		};
		setDB((d) => {
			if (editId) {
				const x = d.expenses.find((y) => y.id === editId);
				if (x) {
					x.name = newExpense.name;
					x.qty = newExpense.qty;
					x.amount = newExpense.amount;
				}
			} else d.expenses.push(newExpense);
		});
		toast.success("Tersimpan");
		setOpen(false);
		reset();
		setSaving(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open,
					onOpenChange: (o) => {
						setOpen(o);
						if (!o) reset();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							className: "gap-1.5 rounded-xl border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Pengeluaran"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [editId ? "Edit" : "Tambah", " Pengeluaran"] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nama Pengeluaran" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Qty" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									inputMode: "numeric",
									placeholder: "1",
									value: qty,
									onChange: (e) => setQty(e.target.value.replace(/[^\d]/g, ""))
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nominal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									inputMode: "numeric",
									placeholder: "Total",
									value: amount,
									onChange: (e) => setAmount(e.target.value.replace(/[^\d]/g, ""))
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								size: "sm",
								disabled: saving,
								children: "Simpan"
							}) })
						]
					})] })]
				})
			}),
			expenses.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: searchName,
						onChange: (e) => setSearchName(e.target.value),
						placeholder: "Cari nama belanjaan...",
						className: "h-11 rounded-xl pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl border bg-card text-muted-foreground hover:text-foreground",
					"aria-label": "Filter",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4" })
				})]
			}),
			expenses.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,.06)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-12 w-12 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold text-foreground",
								children: "Ringkasan Pengeluaran"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 text-[11px] text-muted-foreground",
								children: "Total Pengeluaran"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "whitespace-nowrap text-lg font-bold text-destructive",
								children: fmtIDR(expenses.reduce((s, e) => s + e.amount, 0))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 w-px shrink-0 bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "whitespace-nowrap text-[11px] text-muted-foreground",
							children: "Jumlah Transaksi"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-lg font-bold",
							children: expenses.length
						})] })]
					})
				]
			}),
			expenses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Belum ada pengeluaran." }) : filteredExpenses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Tidak ada pengeluaran dengan nama belanjaan itu." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: filteredExpenses.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,.06)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate font-semibold",
									children: e.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-center gap-1.5 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }),
										" ",
										fmtDate(e.createdAt)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 text-xs text-muted-foreground",
									children: ["• Qty ", e.qty || 1]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "whitespace-nowrap text-base font-bold text-destructive",
							children: fmtIDR(e.amount)
						})]
					}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							className: "h-10 gap-1.5 rounded-xl px-3.5",
							onClick: () => {
								setEditId(e.id);
								setName(e.name);
								setQty(String(e.qty || 1));
								setAmount(String(e.amount));
								setOpen(true);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" }), " Edit"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinConfirmDelete, {
							label: e.name,
							requirePin: (e.amount || 0) > 0,
							onConfirm: () => {
								setDB((d) => {
									d.expenses = d.expenses.filter((x) => x.id !== e.id);
								});
								toast.success("Pengeluaran dihapus");
							}
						})]
					})]
				}, e.id))
			}),
			expenses.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-emerald-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold",
						children: "Catatan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-emerald-700/80",
						children: "Pengeluaran digunakan untuk mencatat semua biaya dan belanjaan bazar."
					})]
				})]
			})
		]
	});
}
function Empty({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border-2 border-dashed bg-muted/30 p-8 text-center text-sm text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "mx-auto mb-2 h-6 w-6" }), text]
	});
}
var REKAP_TEMPLATE_KEY = "phbw-2026-rekap-template-v1";
var DEFAULT_TEMPLATE = `Shallom..\nBerikut kami sampaikan Rekapan {BAZAR_NAME} PHBW 2026 ({BAZAR_DATE}):\n\nPENGELUARAN\nTotal Pengeluaran : {TOTAL_PENGELUARAN}\n\nPESANAN\nJumlah Customer : {JUMLAH_CUSTOMER_PESANAN} orang\n\nJumlah Menu Pesanan:\n{LIST_MENU_PESANAN}\n\nPesanan Dialihkan : {DIALIHKAN}\n\nPENJUALAN\nJumlah Customer : {JUMLAH_CUSTOMER_PENJUALAN} orang\n\nJumlah Menu Penjualan:\n{LIST_MENU_PENJUALAN}\n\nJumlah Pendapatan Penjualan : {TOTAL_PENJUALAN}\nLunas : {TOTAL_LUNAS}\nPiutang : {TOTAL_PIUTANG}\n\nKEUNTUNGAN BERSIH\n{KEUNTUNGAN}\n\nDemikian rekapan {BAZAR_NAME} PHBW 2026 ({BAZAR_DATE}) yang dapat kami sampaikan.\nTuhan Yesus Memberkati...`;
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
function RekapanTab({ bazarId, bazarName, bazarDate }) {
	const db = useDB();
	const { isAdmin } = useAuth();
	const [editingTpl, setEditingTpl] = (0, import_react.useState)(false);
	const [template, setTemplate] = (0, import_react.useState)(DEFAULT_TEMPLATE);
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem(REKAP_TEMPLATE_KEY);
		if (saved) setTemplate(saved);
	}, []);
	const data = (0, import_react.useMemo)(() => computeRekap(db, bazarId), [db, bazarId]);
	const bazarDateFmt = fmtDate(new Date(bazarDate).getTime());
	const message = buildMessage(template, data, bazarName, bazarDateFmt);
	const copyMessage = async () => {
		try {
			await navigator.clipboard.writeText(message);
			toast.success("Teks rekapan disalin");
		} catch {
			toast.error("Gagal menyalin teks");
		}
	};
	const handleSendRekap = () => {
		navigator.clipboard?.writeText(message).catch(() => void 0);
		window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
	};
	const saveTemplate = () => {
		localStorage.setItem(REKAP_TEMPLATE_KEY, template);
		setEditingTpl(false);
		toast.success("Template disimpan");
	};
	const resetTemplate = () => {
		setTemplate(DEFAULT_TEMPLATE);
		localStorage.removeItem(REKAP_TEMPLATE_KEY);
		toast.success("Template direset");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: handleSendRekap,
				className: "flex w-full items-center gap-4 rounded-2xl bg-emerald-600 p-5 text-left text-white shadow-lg transition hover:bg-emerald-700 active:scale-[0.98]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-6 w-6" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-base font-semibold",
						children: "Kirim Rekapan ke WA"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-emerald-100/90",
						children: [
							bazarName,
							" · ",
							bazarDateFmt
						]
					})]
				})]
			}),
			isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				className: "w-full gap-2",
				onClick: copyMessage,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" }), " Salin Teks Rekapan"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[16px] border bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,.06)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
				}), editingTpl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 16,
						value: template,
						onChange: (e) => setTemplate(e.target.value),
						className: "font-mono text-xs"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "whitespace-pre-wrap rounded-xl bg-muted/50 p-4 text-xs leading-relaxed text-foreground/80",
					children: message
				})]
			})
		]
	});
}
//#endregion
export { BazarDetail as component };
