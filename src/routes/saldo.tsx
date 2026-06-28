import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowDownCircle, ArrowUpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useDB, setDB, computeSaldo, fmtIDR, fmtDate } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/saldo")({
  component: SaldoPage,
});

function SaldoPage() {
  const db = useDB();
  const saldo = computeSaldo(db);
  const [modal, setModal] = useState(String(db.modalAwal || 0));
  const [showMasuk, setShowMasuk] = useState(false);
  const [showKeluar, setShowKeluar] = useState(false);

  const totalSales = db.sales.reduce((s, x) => s + x.paid, 0);
  const totalPayments = db.payments.reduce((s, x) => s + x.amount, 0);
  const totalIn = totalSales + totalPayments;
  const totalExpense = db.expenses.reduce((s, x) => s + x.amount, 0);

  // Transaksi Masuk: semua penjualan (paid > 0) + pembayaran piutang
  const transaksiMasuk = [
    ...db.sales
      .filter((s) => s.paid > 0)
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

      {/* Transaksi Masuk - Accordion */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3"
          onClick={() => setShowMasuk((v) => !v)}
        >
          <div className="flex items-center gap-2">
            <ArrowDownCircle className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold text-sm">Transaksi Masuk</span>
            <span className="text-xs text-emerald-600 font-medium">{fmtIDR(transaksiMasuk.reduce((s, t) => s + t.jumlah, 0))}</span>
          </div>
          {showMasuk ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {showMasuk && (
          <div className="border-t px-4 pb-4 pt-3 space-y-2">
            {transaksiMasuk.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-4">Belum ada transaksi masuk</div>
            ) : (
              transaksiMasuk.map((t) => (
                <div key={t.id} className="rounded-xl border bg-background p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] text-muted-foreground">{fmtDate(t.tanggal)} · {t.bazar}</div>
                      <div className="mt-0.5 text-sm font-medium">{t.jenis}</div>
                    </div>
                    <div className="shrink-0 font-semibold text-emerald-600">+{fmtIDR(t.jumlah)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Transaksi Keluar - Accordion */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3"
          onClick={() => setShowKeluar((v) => !v)}
        >
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="h-4 w-4 text-destructive" />
            <span className="font-semibold text-sm">Transaksi Keluar</span>
            <span className="text-xs text-destructive font-medium">{fmtIDR(transaksiKeluar.reduce((s, t) => s + t.jumlah, 0))}</span>
          </div>
          {showKeluar ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {showKeluar && (
          <div className="border-t px-4 pb-4 pt-3 space-y-2">
            {transaksiKeluar.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-4">Belum ada transaksi keluar</div>
            ) : (
              transaksiKeluar.map((t) => (
                <div key={t.id} className="rounded-xl border bg-background p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] text-muted-foreground">{fmtDate(t.tanggal)} · {t.bazar}</div>
                      <div className="mt-0.5 text-sm font-medium">{t.jenis}</div>
                    </div>
                    <div className="shrink-0 font-semibold text-destructive">-{fmtIDR(t.jumlah)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

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
