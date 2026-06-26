import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Pencil, Printer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDB, fmtIDR, fmtDate, saleOutstanding } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/bazar/$id/rekapan")({
  component: RekapanPage,
  loader: ({ params }) => ({ id: params.id }),
});

const REKAP_TEMPLATE_KEY = "phbw-2026-rekap-template-v1";

const DEFAULT_TEMPLATE =
  `Shallom..
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

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function alphaLabel(i: number) { return ALPHA[i] ?? String(i + 1); }

function computeRekap(db: ReturnType<typeof useDB>, bazarId: string) {
  const bazarOrders = db.orders.filter((o) => o.bazarId === bazarId);
  const bazarSales = db.sales.filter((s) => s.bazarId === bazarId);
  const bazarExpenses = db.expenses.filter((e) => e.bazarId === bazarId);

  const totalPengeluaran = bazarExpenses.reduce((sum, e) => sum + e.amount, 0);

  // PESANAN – aggregate original qty per menu name
  const pesananCustomers = new Set<string>();
  const pesananMenuMap = new Map<string, number>();

  for (const order of bazarOrders) {
    pesananCustomers.add(order.customer.trim().toLowerCase());

    const soldByMenu: Record<string, number> = {};
    for (const sale of db.sales.filter((s) => s.orderId === order.id)) {
      for (const item of sale.items) {
        soldByMenu[item.menuId] = (soldByMenu[item.menuId] || 0) + item.qty;
      }
    }

    const allMenuIds = new Set([
      ...order.items.map((i) => i.menuId),
      ...Object.keys(soldByMenu),
    ]);

    for (const menuId of allMenuIds) {
      const remaining = order.items.find((i) => i.menuId === menuId)?.qty || 0;
      const sold = soldByMenu[menuId] || 0;
      const originalQty = remaining + sold;
      if (originalQty <= 0) continue;
      const menu = db.menus.find((m) => m.id === menuId);
      const name = menu?.name || menuId;
      pesananMenuMap.set(name, (pesananMenuMap.get(name) || 0) + originalQty);
    }
  }

  const dialihkan = bazarOrders
    .filter((o) => o.originalCustomer && o.originalCustomer !== o.customer)
    .map((o) => `${o.originalCustomer} → ${o.customer}`);

  // PENJUALAN – aggregate qty & subtotal per menu name
  const penjualanCustomers = new Set<string>();
  const penjualanMenuMap = new Map<string, { qty: number; total: number }>();

  for (const sale of bazarSales) {
    penjualanCustomers.add(sale.customer.trim().toLowerCase());
    for (const item of sale.items) {
      const prev = penjualanMenuMap.get(item.name) || { qty: 0, total: 0 };
      penjualanMenuMap.set(item.name, {
        qty: prev.qty + item.qty,
        total: prev.total + item.price * item.qty,
      });
    }
  }

  const totalPenjualan = bazarSales.reduce((sum, s) => sum + s.total, 0);
  const totalPiutang = bazarSales.reduce((sum, s) => sum + saleOutstanding(db, s.id), 0);
  const totalLunas = totalPenjualan - totalPiutang;

  const grossProfit = bazarSales.reduce(
    (s, x) => s + x.items.reduce((ss, it) => ss + (it.price - (it.cost || 0)) * it.qty, 0),
    0,
  );
  const keuntungan = grossProfit - totalPengeluaran;

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
    keuntungan,
  };
}

function buildMessage(template: string, data: ReturnType<typeof computeRekap>, bazarName: string, bazarDate: string) {
  const listPesanan = data.pesananMenus.length
    ? data.pesananMenus.map(([name, qty], i) => `${alphaLabel(i)}. ${name} - ${qty}x`).join("\n")
    : "Belum ada pesanan";

  const listPenjualan = data.penjualanMenus.length
    ? data.penjualanMenus.map(([name, { qty, total }], i) =>
        `${alphaLabel(i)}. ${name} - ${qty}x - ${fmtIDR(total)}`,
      ).join("\n")
    : "Belum ada penjualan";

  const dialihkanText = data.dialihkan.length
    ? data.dialihkan.join(", ")
    : "Tidak Ada";

  return template
    .replace(/\{BAZAR_NAME\}/g, bazarName)
    .replace(/\{BAZAR_DATE\}/g, bazarDate)
    .replace(/\{TOTAL_PENGELUARAN\}/g, fmtIDR(data.totalPengeluaran))
    .replace(/\{JUMLAH_CUSTOMER_PESANAN\}/g, String(data.pesananCustomers))
    .replace(/\{LIST_MENU_PESANAN\}/g, listPesanan)
    .replace(/\{DIALIHKAN\}/g, dialihkanText)
    .replace(/\{JUMLAH_CUSTOMER_PENJUALAN\}/g, String(data.penjualanCustomers))
    .replace(/\{LIST_MENU_PENJUALAN\}/g, listPenjualan)
    .replace(/\{TOTAL_PENJUALAN\}/g, fmtIDR(data.totalPenjualan))
    .replace(/\{TOTAL_LUNAS\}/g, fmtIDR(data.totalLunas))
    .replace(/\{TOTAL_PIUTANG\}/g, fmtIDR(data.totalPiutang))
    .replace(/\{KEUNTUNGAN\}/g, fmtIDR(data.keuntungan));
}

function RekapanPage() {
  const { id } = Route.useParams();
  const db = useDB();
  const bazar = db.bazars.find((b) => b.id === id);
  const [editingTpl, setEditingTpl] = useState(false);
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);

  useEffect(() => {
    const saved = localStorage.getItem(REKAP_TEMPLATE_KEY);
    if (saved) setTemplate(saved);
  }, []);

  const data = useMemo(() => computeRekap(db, id), [db, id]);

  if (!bazar) {
    return (
      <div className="space-y-4">
        <Link to="/bazar" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Daftar Bazar
        </Link>
        <p className="text-muted-foreground">Bazar tidak ditemukan.</p>
      </div>
    );
  }

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
    toast.success("Template direset");
  };

  const sendWA = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const printRekap = () => {
    const w = window.open("", "_blank", "width=480,height=700");
    if (!w) return;
    w.document.write(`
      <html><head><title>Rekapan Bazar - ${bazar.name}</title>
      <style>
        body{font-family:system-ui;padding:20px;max-width:440px;margin:0 auto;color:#111;font-size:13px}
        h2{margin:0 0 4px;font-size:16px}
        .muted{color:#666;font-size:11px}
        pre{white-space:pre-wrap;font-family:system-ui;font-size:13px;line-height:1.6;margin:0}
      </style></head><body>
      <pre>${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
      <script>window.print()</script></body></html>
    `);
    w.document.close();
  };

  return (
    <div className="space-y-5">
      <Link
        to="/bazar/$id"
        params={{ id }}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {bazar.name}
      </Link>

      <div>
        <h2 className="text-2xl font-bold">Rekapan Bazar</h2>
        <p className="text-sm text-muted-foreground">
          {bazar.name} · {bazarDate}
        </p>
      </div>

      <Button
        onClick={sendWA}
        className="h-auto w-full justify-start gap-3 rounded-2xl bg-emerald-600 py-4 text-left text-white hover:bg-emerald-700"
      >
        <MessageCircle className="h-6 w-6 shrink-0" />
        <div className="flex-1">
          <div className="text-base font-semibold">Kirim Rekapan ke WA</div>
          <div className="text-xs opacity-90">{bazar.name} · {bazarDate}</div>
        </div>
      </Button>

      <Button
        onClick={printRekap}
        variant="outline"
        className="h-auto w-full justify-start gap-3 rounded-2xl py-4 text-left"
      >
        <Printer className="h-6 w-6 shrink-0" />
        <div className="flex-1">
          <div className="text-base font-semibold">Cetak Rekapan</div>
          <div className="text-xs text-muted-foreground">Buka tampilan cetak browser</div>
        </div>
      </Button>

      <div className="rounded-2xl border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold">Format Pesan Rekapan</div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditingTpl((v) => !v)}
            className="gap-1 text-xs"
          >
            <Pencil className="h-3.5 w-3.5" /> {editingTpl ? "Tutup" : "Edit"}
          </Button>
        </div>

        {editingTpl ? (
          <>
            <p className="mb-2 text-xs text-muted-foreground">
              Token yang tersedia:{" "}
              {[
                "{BAZAR_NAME}", "{BAZAR_DATE}", "{TOTAL_PENGELUARAN}",
                "{JUMLAH_CUSTOMER_PESANAN}", "{LIST_MENU_PESANAN}", "{DIALIHKAN}",
                "{JUMLAH_CUSTOMER_PENJUALAN}", "{LIST_MENU_PENJUALAN}",
                "{TOTAL_PENJUALAN}", "{TOTAL_LUNAS}", "{TOTAL_PIUTANG}", "{KEUNTUNGAN}",
              ].map((t) => (
                <code key={t} className="mr-1 rounded bg-muted px-1">{t}</code>
              ))}
            </p>
            <Textarea
              rows={18}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="font-mono text-xs"
            />
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={saveTemplate}>Simpan</Button>
              <Button size="sm" variant="outline" onClick={resetTemplate}>Reset Default</Button>
            </div>
          </>
        ) : (
          <pre className="whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
            {message}
          </pre>
        )}
      </div>
    </div>
  );
}
