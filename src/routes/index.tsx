import { createFileRoute, Link } from "@tanstack/react-router";
import { Store, Wallet, History, Calculator, Eye, EyeOff, Settings, RefreshCw, LogOut } from "lucide-react";
import { SheetSyncSettings } from "@/components/SheetSyncSettings";
import { useState } from "react";
import { useDB, computeSaldo, fmtIDR } from "@/lib/storage";
import { exportAll, useSheetUrl } from "@/lib/sync";
import { signOut, useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { getPin, setPin, verifyPin } from "@/lib/pin";
import { toast } from "sonner";

export const Route = createFileRoute("/")({ component: Dashboard });

const menus = [
  { to: "/bazar", label: "Daftar Bazar", desc: "Kelola event, menu, pesanan, penjualan & pengeluaran.", Icon: Store },
  { to: "/piutang", label: "Daftar Piutang", desc: "Akumulasi piutang per customer dari semua bazar.", Icon: Wallet },
  { to: "/riwayat", label: "Riwayat Pembayaran Piutang", desc: "Log cicilan & pelunasan, terbaru di atas.", Icon: History },
  { to: "/kalkulator", label: "Kalkulator Keuntungan", desc: "Simulasi ekspektasi pendapatan bazar berikutnya.", Icon: Calculator },
] as const;

function greeting(name: string): string {
  const h = new Date().getHours();
  const m = new Date().getMinutes();
  const mins = h * 60 + m;
  let salam = "Selamat Malam";
  if (mins < 11 * 60) salam = "Selamat Pagi";
  else if (mins < 15 * 60) salam = "Selamat Siang";
  else if (mins < 18 * 60 + 30) salam = "Selamat Sore";
  return `${salam}, ${name}`;
}

function Dashboard() {
  const db = useDB();
  const saldo = computeSaldo(db);
  const sheetUrl = useSheetUrl();
  const { displayName } = useAuth();
  // Default selalu tersembunyi tiap refresh
  const [hideSaldo, setHideSaldo] = useState(true);
  const [exporting, setExporting] = useState(false);

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
    <div className="space-y-4">
      {/* Gear */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">{greeting(displayName)}</p>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" aria-label="Keluar" onClick={() => signOut()}><LogOut className="h-4 w-4" /></Button>
          <PinSettings />
        </div>
      </div>

      <Link
        to="/saldo"
        className="block rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 p-5 text-white shadow-lg shadow-emerald-900/20 transition hover:shadow-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-emerald-100/90">Saldo Kas PHBW</p>
            <p className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              {hideSaldo ? "Rp ••••••" : fmtIDR(saldo)}
            </p>
            <p className="mt-1 text-xs text-emerald-100/80">Ketuk untuk rincian →</p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-full p-2 text-white transition-colors hover:bg-white/15"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setHideSaldo((v) => !v); }}
            aria-label={hideSaldo ? "Tampilkan saldo" : "Sembunyikan saldo"}
          >
            {hideSaldo ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </Link>

      <div className="grid gap-3 sm:grid-cols-2">
        {menus.map(({ to, label, desc, Icon }) => (
          <Link key={to} to={to} className="group rounded-2xl border bg-card p-5 transition hover:border-primary hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-foreground">{label}</div>
                <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-4">
        <div className="mb-2 text-sm font-semibold">Sinkron Google Sheets</div>
        <p className="mb-3 text-xs text-muted-foreground">Atur URL Apps Script, lalu ekspor seluruh data aplikasi ke Google Sheets dari halaman utama ini.</p>
        <div className="space-y-2">
          <SheetSyncSettings fullWidth />
          <Button
            type="button"
            className="w-full gap-2"
            onClick={handleExport}
            disabled={exporting || !sheetUrl}
          >
            <RefreshCw className={`h-4 w-4 ${exporting ? "animate-spin" : ""}`} />
            {exporting ? "Mengirim..." : "🔄 Ekspor Semua Data ke Google Sheets"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function PinSettings() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyPin(current)) return toast.error("PIN saat ini salah");
    if (next.length < 4) return toast.error("PIN baru minimal 4 karakter");
    if (next !== confirm) return toast.error("Konfirmasi PIN tidak cocok");
    setPin(next);
    toast.success("PIN berhasil diubah");
    setOpen(false); setCurrent(""); setNext(""); setConfirm("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Pengaturan"><Settings className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Pengaturan Keamanan (PIN)</DialogTitle></DialogHeader>
        <p className="text-xs text-muted-foreground">PIN dipakai untuk konfirmasi hapus penjualan. Default awal: <b>PHBW2026</b>. PIN aktif disimpan permanen di perangkat ini.</p>
        <form onSubmit={submit} className="space-y-3">
          <div><Label>PIN Saat Ini</Label><Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} /></div>
          <div><Label>PIN Baru</Label><Input type="password" value={next} onChange={(e) => setNext(e.target.value)} /></div>
          <div><Label>Konfirmasi PIN Baru</Label><Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></div>
          <DialogFooter><Button type="submit">Simpan PIN</Button></DialogFooter>
        </form>
        <p className="text-[10px] text-muted-foreground">PIN aktif sekarang: {"•".repeat(getPin().length)}</p>
      </DialogContent>
    </Dialog>
  );
}
