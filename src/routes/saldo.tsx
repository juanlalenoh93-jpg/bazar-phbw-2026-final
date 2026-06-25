import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useDB, setDB, computeSaldo, fmtIDR } from "@/lib/storage";
import { exportAll, useSheetUrl } from "@/lib/sync";
import { SheetSyncSettings } from "@/components/SheetSyncSettings";
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
  const sheetUrl = useSheetUrl();
  const [modal, setModal] = useState(String(db.modalAwal || 0));
  const [exporting, setExporting] = useState(false);

  const totalSales = db.sales.reduce((s, x) => s + x.paid, 0);
  const totalPayments = db.payments.reduce((s, x) => s + x.amount, 0);
  const totalIn = totalSales + totalPayments;
  const totalExpense = db.expenses.reduce((s, x) => s + x.amount, 0);

  const handleExport = async () => {
    if (!sheetUrl) {
      toast.error("Tempel URL Google Sheets terlebih dahulu");
      return;
    }
    setExporting(true);
    const ok = await exportAll(db);
    setExporting(false);
    if (ok) toast.success("Seluruh data dikirim ke Google Sheets");
    else toast.error("Gagal mengirim — cek URL Apps Script");
  };


  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <div>
        <h2 className="text-2xl font-bold">Rincian Saldo Kas</h2>
        <p className="text-sm text-muted-foreground">
          Modal Awal + Total Uang Masuk − Pengeluaran
        </p>
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

      <div className="space-y-3 rounded-2xl border bg-card p-5">
        <div>
          <div className="font-semibold">Sinkron Google Sheets</div>
          <p className="text-xs text-muted-foreground">
            Setiap Pesanan, Penjualan & Pengeluaran baru otomatis terkirim. Gunakan
            tombol di bawah untuk mengunggah seluruh data sekaligus.
          </p>
        </div>
        <SheetSyncSettings fullWidth />
        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={handleExport}
          disabled={exporting || !sheetUrl}
        >
          <RefreshCw className={`h-4 w-4 ${exporting ? "animate-spin" : ""}`} />
          {exporting ? "Mengirim..." : "🔄 Ekspor Semua Data ke Google Sheets"}
        </Button>
      </div>

      <form
        className="rounded-2xl border bg-card p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const n = Number(modal) || 0;
          setDB((d) => {
            d.modalAwal = n;
          });
          toast.success("Modal awal diperbarui");
        }}
      >
        <Label htmlFor="modal" className="font-semibold">
          Isi / Edit Modal Awal
        </Label>
        <div className="mt-2 flex gap-2">
          <Input
            id="modal"
            inputMode="numeric"
            value={modal}
            onChange={(e) => setModal(e.target.value.replace(/[^\d]/g, ""))}
          />
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
      <span className={`font-semibold ${negative ? "text-destructive" : "text-foreground"}`}>
        {fmtIDR(value)}
      </span>
    </div>
  );
}
