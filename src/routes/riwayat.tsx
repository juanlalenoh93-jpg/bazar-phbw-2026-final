import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, History, Printer, Share2 } from "lucide-react";
import { useDB, setDB, fmtIDR, fmtDateTime } from "@/lib/storage";
import { shareToWhatsApp } from "@/lib/utils";
import { getOrgName } from "@/lib/branding";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PinConfirmDelete } from "./bazar.index";
import { toast } from "sonner";

export const Route = createFileRoute("/riwayat")({
  component: RiwayatPage,
});

function RiwayatPage() {
  const db = useDB();
  const list = [...db.payments].sort((a, b) => a.date - b.date);
  const bazarName = (id: string) => db.bazars.find((b) => b.id === id)?.name || "?";
  const paymentBreakdown = (p: typeof list[number]) => {
    const sale = db.sales.find((s) => s.id === p.saleId);
    if (!sale) return { totalBefore: p.amount, paid: p.amount, remainingAfter: 0 };
    const previousPayments = db.payments
      .filter((x) => x.saleId === p.saleId && x.date < p.date)
      .reduce((sum, x) => sum + x.amount, 0);
    const totalBefore = Math.max(0, sale.total - sale.paid - previousPayments);
    return {
      totalBefore,
      paid: p.amount,
      remainingAfter: Math.max(0, totalBefore - p.amount),
    };
  };

  const printNota = (p: typeof list[number]) => {
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
      <div class="muted">PHBW 2026 — ${getOrgName()}</div>
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
      <script>window.print()</script></body></html>`);
    w.document.close();
  };

  const shareWA = async (p: typeof list[number]) => {
    const breakdown = paymentBreakdown(p);
    const text =
      `*NOTA PEMBAYARAN PIUTANG*\n` +
      `${getOrgName()}\n\n` +
      `Customer: *${p.customer}*\n` +
      `Bazar: ${bazarName(p.bazarId)}\n` +
      `Tanggal: ${fmtDateTime(p.date)}\n` +
      `Jenis Metode Pembayaran: ${p.method === "cash" ? "Cash" : "Transfer"}\n` +
      `Untuk: ${p.menuName}\n\n` +
      `Total Piutang: ${fmtIDR(breakdown.totalBefore)}\n` +
      `Jumlah Bayar Piutang: *${fmtIDR(breakdown.paid)}*\n` +
      `Sisa Piutang: ${fmtIDR(breakdown.remainingAfter)}\n\n` +
      `Terima kasih 🙏 Tuhan Memberkati.`;
    const result = await shareToWhatsApp(text);
    if (!result.opened) {
      if (result.copied) {
        toast.info("Pop-up WhatsApp diblokir browser. Teks nota sudah disalin — tempel manual di WhatsApp.");
      } else {
        toast.error("Gagal membuka WhatsApp. Pastikan pop-up tidak diblokir, lalu coba lagi.");
      }
    }
  };

  return (
    <div className="space-y-5">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>
      <div>
        <h2 className="text-2xl font-bold">Riwayat Pembayaran Piutang</h2>
        <p className="text-sm text-muted-foreground">Diurutkan dari pembayaran yang paling dulu diinput.</p>
      </div>

      {list.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border-2 border-dashed p-12 text-center">
          <History className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Belum ada pembayaran tercatat.</p>
        </div>
      ) : (
        <div className="grid gap-2">
          {list.map((p) => (
            <div key={p.id} className="rounded-2xl border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold">{p.customer}</div>
                  <div className="text-xs text-muted-foreground">{fmtDateTime(p.date)}</div>
                  <div className="mt-1 text-xs">
                    <Badge variant="secondary">{bazarName(p.bazarId)}</Badge>{" "}
                    <span className="text-muted-foreground">{p.menuName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{fmtIDR(p.amount)}</div>
                  <div className="text-[10px] text-muted-foreground">Sisa {fmtIDR(paymentBreakdown(p).remainingAfter)}</div>
                  <Badge variant="outline" className="mt-1 uppercase">{p.method}</Badge>
                </div>
              </div>
              {p.proof && (
                <a href={p.proof} target="_blank" rel="noreferrer" className="mt-2 inline-block">
                  <img src={p.proof} alt="bukti" className="h-14 rounded border" />
                </a>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => printNota(p)} className="gap-1 text-xs">
                  <Printer className="h-3.5 w-3.5" /> Cetak Nota
                </Button>
                <Button size="sm" variant="outline" onClick={() => shareWA(p)} className="gap-1 text-xs">
                  <Share2 className="h-3.5 w-3.5" /> Kirim WA
                </Button>
                <PinConfirmDelete
                  label="pembayaran piutang"
                  onConfirm={() => {
                    setDB((d) => { d.payments = d.payments.filter((x) => x.id !== p.id); });
                    toast.success("Pembayaran piutang dihapus");
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
