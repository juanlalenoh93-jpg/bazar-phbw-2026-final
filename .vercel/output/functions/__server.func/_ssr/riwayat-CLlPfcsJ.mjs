import { O as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as ORGANIZATION_NAME } from "./branding-D-EPtLZP.mjs";
import { H as ArrowLeft, p as Share2, v as Printer, w as History } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as fmtDateTime, h as setDB, l as fmtIDR, y as useDB } from "./storage-DHI9muZ1.mjs";
import { i as shareToWhatsApp, t as Button } from "./button-DKCAsAV2.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PinConfirmDelete } from "./bazar.index-DYH4R8ux.mjs";
import { t as Badge } from "./badge-DcWIs7Wy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/riwayat-CLlPfcsJ.js
var import_jsx_runtime = require_jsx_runtime();
function RiwayatPage() {
	const db = useDB();
	const list = [...db.payments].sort((a, b) => a.date - b.date);
	const bazarName = (id) => db.bazars.find((b) => b.id === id)?.name || "?";
	const paymentBreakdown = (p) => {
		const sale = db.sales.find((s) => s.id === p.saleId);
		if (!sale) return {
			totalBefore: p.amount,
			paid: p.amount,
			remainingAfter: 0
		};
		const previousPayments = db.payments.filter((x) => x.saleId === p.saleId && x.date < p.date).reduce((sum, x) => sum + x.amount, 0);
		const totalBefore = Math.max(0, sale.total - sale.paid - previousPayments);
		return {
			totalBefore,
			paid: p.amount,
			remainingAfter: Math.max(0, totalBefore - p.amount)
		};
	};
	const printNota = (p) => {
		const w = window.open("", "_blank", "width=420,height=600");
		if (!w) return;
		const breakdown = paymentBreakdown(p);
		w.document.write(`
      <html><head><title>Nota Pembayaran Piutang - ${p.customer}</title>
      <style>body{font-family:system-ui;padding:16px;max-width:380px;margin:0 auto;color:#111}
      h2{margin:0 0 4px;font-size:18px}.muted{color:#666;font-size:12px}
      .box{margin-top:12px;padding:10px;border:1px dashed #999;border-radius:8px}
      .row{display:flex;justify-content:space-between;padding:4px 0;font-size:13px;gap:12px}
      .paid{font-weight:800;font-size:20px;border-top:2px solid #000;border-bottom:2px solid #000;padding:8px 0;margin:6px 0}</style></head><body>
      <h2>NOTA PEMBAYARAN PIUTANG</h2>
      <div class="muted">PHBW 2026 — ${ORGANIZATION_NAME}</div>
      <hr/>
      <div class="row"><span>Customer</span><b>${p.customer}</b></div>
      <div class="row"><span>Bazar</span><span>${bazarName(p.bazarId)}</span></div>
      <div class="row"><span>Tanggal</span><span>${fmtDateTime(p.date)}</span></div>
      <div class="row"><span>Jenis Metode Pembayaran</span><span>${p.method === "cash" ? "Cash" : "Transfer"}</span></div>
      <div class="box">
        <div class="muted">Untuk pembelian:</div>
        <div>${p.menuName}</div>
      </div>
      <div class="row"><span>Total Piutang</span><b>${fmtIDR(breakdown.totalBefore)}</b></div>
      <div class="row paid"><span>Jumlah Bayar Piutang</span><span>${fmtIDR(breakdown.paid)}</span></div>
      <div class="row"><span>Sisa Piutang</span><b>${fmtIDR(breakdown.remainingAfter)}</b></div>
      <p class="muted" style="text-align:center;margin-top:18px">Terima kasih atas pembayarannya 🙏<br/>Tuhan Memberkati.</p>
      <script>window.print()<\/script></body></html>`);
		w.document.close();
	};
	const shareWA = async (p) => {
		const breakdown = paymentBreakdown(p);
		const result = await shareToWhatsApp(`*NOTA PEMBAYARAN PIUTANG*\n${ORGANIZATION_NAME}\n\nCustomer: *${p.customer}*\nBazar: ${bazarName(p.bazarId)}\nTanggal: ${fmtDateTime(p.date)}\nJenis Metode Pembayaran: ${p.method === "cash" ? "Cash" : "Transfer"}\nUntuk: ${p.menuName}\n\nTotal Piutang: ${fmtIDR(breakdown.totalBefore)}\nJumlah Bayar Piutang: *${fmtIDR(breakdown.paid)}*\nSisa Piutang: ${fmtIDR(breakdown.remainingAfter)}\n\nTerima kasih 🙏 Tuhan Memberkati.`);
		if (!result.opened) if (result.copied) toast.info("Pop-up WhatsApp diblokir browser. Teks nota sudah disalin — tempel manual di WhatsApp.");
		else toast.error("Gagal membuka WhatsApp. Pastikan pop-up tidak diblokir, lalu coba lagi.");
	};
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
				children: "Riwayat Pembayaran Piutang"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Diurutkan dari pembayaran yang paling dulu diinput."
			})] }),
			list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid place-items-center rounded-2xl border-2 border-dashed p-12 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-10 w-10 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "Belum ada pembayaran tercatat."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold",
										children: p.customer
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: fmtDateTime(p.date)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "secondary",
												children: bazarName(p.bazarId)
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: p.menuName
											})
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-primary",
										children: fmtIDR(p.amount)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-muted-foreground",
										children: ["Sisa ", fmtIDR(paymentBreakdown(p).remainingAfter)]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "mt-1 uppercase",
										children: p.method
									})
								]
							})]
						}),
						p.proof && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: p.proof,
							target: "_blank",
							rel: "noreferrer",
							className: "mt-2 inline-block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.proof,
								alt: "bukti",
								className: "h-14 rounded border"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => printNota(p),
									className: "gap-1 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-3.5 w-3.5" }), " Cetak Nota"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => shareWA(p),
									className: "gap-1 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-3.5 w-3.5" }), " Kirim WA"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinConfirmDelete, {
									label: "pembayaran piutang",
									onConfirm: () => {
										setDB((d) => {
											d.payments = d.payments.filter((x) => x.id !== p.id);
										});
										toast.success("Pembayaran piutang dihapus");
									}
								})
							]
						})
					]
				}, p.id))
			})
		]
	});
}
//#endregion
export { RiwayatPage as component };
