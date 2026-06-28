import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useDB, setDB, computeSaldo, fmtIDR, fmtDate, saleOutstanding } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/saldo")({
  component: SaldoPage,
});

function SaldoPage() {
  const db = useDB();
  const saldo = computeSaldo(db);
  const [modal, setModal] = useState(String(db.modalAwal || 0));

  const totalSales = db.sales.reduce((s, x) => s + x.paid, 0);
  const totalPayments = db.payments.reduce((s, x) => s + x.amount, 0);
  const totalIn = totalSales + totalPayments;
  const totalExpense = db.expenses.reduce((s, x) => s + x.amount, 0);

  const transaksiMasuk = [
    ...db.sales
      .filter((s) => saleOutstanding(db, s.id) === 0 && s.paid > 0)
      .map((s) => {
        const bazar = db.bazars.find((b) => b.id === s.bazarId);
        return { id: s.id, tanggal: s.createdAt, jenis: `Penjualan Bazar (${s.customer})`, bazar: bazar?.name || "-", jumlah: s.paid };
      }),
    ...db.payments.map((p) => {
      const bazar = db.bazars.find((b) => b.id === p.bazarId);
      return { id: p.id, tanggal: p.date, jenis: `Pembayaran Piutang (${p.customer})`, bazar: bazar?.name || "-", jumlah: p.amount };
    }),
  ].sort((a, b) => b.tanggal - a.tanggal);

  const transaksiKeluar = db.expenses
    .map((e) => {
      const bazar = db.bazars.find((b) => b.id === e.bazarId);
      return { id: e.id, tanggal: e.createdAt, jenis: `Belanja (${e.name})`, bazar: bazar?.name || "-", jumlah: e.amount };
    })
    .sort((a, b) => b.tanggal - a.tanggal);

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>
      <div>
        <h2 className="text-2xl font-bold">Rincian Saldo Kas</h2>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-primary to-emerald-600 p-6 text-primary-foreground shadow-lg">
        <div className="text-xs uppercase tracking-wider opacity-90">Saldo Saat Ini</div>
        <div className="mt-1 text-4xl font-bold">{fmtIDR(saldo)}</div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Row label="Modal Awal" value={db.modalAwal} />
        <Row label="Total Uang Masuk" value={totalIn} />
        <Row label="Total Pengeluaran" value={totalExpense} negative />
      </div>
      <Tabs defaultValue="masuk" className="space-y-4">
        <TabsList className="grid h-10 w-full grid-cols-2">
          <TabsTrigger value="masuk" className="gap-1.5 text-xs font-medium">
            <ArrowDownCircle className="h-3.5 w-3.5 text-emerald-600" /> Transaksi Masuk
          </TabsTrigger>
          <TabsTrigger value="keluar" className="gap-1.5 text-xs font-medium">
            <ArrowUpCircle className="h-3.5 w-3.5 text-destructive" /> Transaksi Keluar
          </TabsTrigger>
        </TabsList>
        <TabsContent value="masuk">
          {transaksiMasuk.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed p-8 text-center text-sm text-muted-foreground">Belum ada transaksi masuk</div>
          ) : (
            <div className="grid gap-2">
              {transaksiMasuk.map((t) => (
                <div key={t.id} className="rounded-2xl border bg-card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] text-muted-foreground">{fmtDate(t.tanggal)} · {t.bazar}</div>
                      <div className="mt-0.5 text-sm font-medium">{t.jenis}</div>
                    </div>
                    <div className="shrink-0 font-semibold text-emerald-600">+{fmtIDR(t.jumlah)}</div>
                  </div>
                </div>
              ))}
              <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                Total Masuk: {fmtIDR(transaksiMasuk.reduce((s, t) => s + t.jumlah, 0))}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="keluar">
          {transaksiKeluar.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed p-8 text-center text-sm text-muted-foreground">Belum ada transaksi keluar</div>
          ) : (
            <div className="grid gap-2">
              {transaksiKeluar.map((t) => (
                <div key={t.id} className="rounded-2xl border bg-card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] text-muted-foreground">{fmtDate(t.tanggal)} · {t.bazar}</div>
                      <div className="mt-0.5 text-sm font-medium">{t.jenis}</div>
                    </div>
                    <div className="shrink-0 font-semibold text-destructive">-{fmtIDR(t.jumlah)}</div>
                  </div>
                </div>
              ))}
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-destructive">
                Total Keluar: {fmtIDR(transaksiKeluar.reduce((s, t) => s + t.jumlah, 0))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      <form
        className="rounded-2xl border bg-card p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const n = Number(modal) || 0;
          setDB((d) => { d.modalAwal = n; });
          toast.success("Modal awal diperbarui");
        }}
      >
        <Label htmlFor="modal" className="font-semibold">Isi / Edit Modal Awal</Label>
        <div className="mt-2 flex gap-2">
          <Input id="modal" inputMode="numeric" value={modal} onChange={(e) => setModal(e.target.value.replace(/[^\d]/g, ""))} />
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </div>
  );
}

function Row({ label, value, negative }: { label: string; value: number; negative?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`font-semibold ${negative ? "text-destructive" : "text-foreground"}`}>{fmtIDR(value)}</span>
    </div>
  );
}
