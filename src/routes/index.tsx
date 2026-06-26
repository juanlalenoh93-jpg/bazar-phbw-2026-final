import { createFileRoute, Link } from "@tanstack/react-router";
import { Store, Wallet, History, Calculator, Eye, EyeOff, Settings, RefreshCw, LogOut, Camera, X } from "lucide-react";
import { SheetSyncSettings } from "@/components/SheetSyncSettings";
import { useEffect, useRef, useState } from "react";
import { useDB, computeSaldo, fmtIDR, useLogo, useRightLogo, setLogo, setRightLogo } from "@/lib/storage";
import { exportAll, useSheetUrl } from "@/lib/sync";
import { signOut, useAuth } from "@/lib/auth";
import { APP_TITLE, WORKSPACE_ORG_LABEL, setMainHeader, setWorkspaceHeader, useMainHeader, useWorkspaceHeader } from "@/lib/branding";
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
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">{greeting(displayName)}</p>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" aria-label="Keluar" onClick={() => signOut()}><LogOut className="h-4 w-4" /></Button>
          <AppSettings />
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

function AppSettings() {
  const [open, setOpen] = useState(false);
  const [pin, setPinInput] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const currentMainHeader = useMainHeader();
  const currentWorkspaceHeader = useWorkspaceHeader();
  const [mainHeaderText, setMainHeaderText] = useState(currentMainHeader);
  const [workspaceHeaderText, setWorkspaceHeaderText] = useState(currentWorkspaceHeader);
  const leftLogo = useLogo();
  const rightLogo = useRightLogo();
  const leftFileRef = useRef<HTMLInputElement>(null);
  const rightFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setMainHeaderText(currentMainHeader);
      setWorkspaceHeaderText(currentWorkspaceHeader);
    }
  }, [open, currentMainHeader, currentWorkspaceHeader]);

  const requirePin = () => {
    if (!verifyPin(pin)) {
      toast.error("PIN salah");
      return false;
    }
    return true;
  };

  const savePin = () => {
    if (!requirePin()) return;
    if (next.length < 4) return toast.error("PIN baru minimal 4 karakter");
    if (next !== confirm) return toast.error("Konfirmasi PIN tidak cocok");
    setPin(next);
    setNext("");
    setConfirm("");
    setPinInput("");
    toast.success("PIN berhasil diubah");
  };

  const saveHeaders = () => {
    if (!requirePin()) return;
    setMainHeader(mainHeaderText || APP_TITLE);
    setWorkspaceHeader(workspaceHeaderText || WORKSPACE_ORG_LABEL);
    toast.success("Header berhasil disimpan");
  };

  const handleLogoFile = (side: "left" | "right", file?: File) => {
    if (!file) return;
    if (!requirePin()) return;
    if (!file.type.startsWith("image/")) return toast.error("File harus berupa gambar");
    if (file.size > 2_500_000) return toast.error("Maks 2.5MB");
    const reader = new FileReader();
    reader.onerror = () => toast.error("Gagal membaca gambar");
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result.startsWith("data:image/")) return toast.error("Format gambar tidak valid");
      if (side === "left") {
        setLogo(result);
        if (leftFileRef.current) leftFileRef.current.value = "";
        toast.success("Logo kiri berhasil disimpan");
      } else {
        setRightLogo(result);
        if (rightFileRef.current) rightFileRef.current.value = "";
        toast.success("Logo kanan berhasil disimpan");
      }
    };
    reader.readAsDataURL(file);
  };

  const clearLogo = (side: "left" | "right") => {
    if (!requirePin()) return;
    if (side === "left") setLogo(null);
    else setRightLogo(null);
    toast.success(side === "left" ? "Logo kiri dihapus" : "Logo kanan dihapus");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) { setPinInput(""); setNext(""); setConfirm(""); } }}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Pengaturan"><Settings className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Pengaturan Aplikasi</DialogTitle></DialogHeader>
        <div className="space-y-5">
          <div className="rounded-lg border bg-muted/30 p-3">
            <Label>PIN Pengaturan</Label>
            <Input className="mt-1" type="password" value={pin} onChange={(e) => setPinInput(e.target.value)} placeholder="Masukkan PIN untuk mengubah pengaturan" />
            <p className="mt-1 text-[10px] text-muted-foreground">Default awal: <b>PHBW2026</b>. Semua perubahan di bawah wajib memakai PIN.</p>
          </div>

          <div className="space-y-2 rounded-lg border p-3">
            <div className="text-sm font-semibold">Ganti PIN</div>
            <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="PIN baru" />
            <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Konfirmasi PIN baru" />
            <Button type="button" size="sm" onClick={savePin}>Simpan PIN Baru</Button>
          </div>

          <div className="space-y-3 rounded-lg border p-3">
            <div className="text-sm font-semibold">Logo Aplikasi</div>
            <div className="grid gap-3 sm:grid-cols-2">
              <LogoSettingCard
                title="Ganti Logo Kiri"
                logo={leftLogo}
                onPick={() => leftFileRef.current?.click()}
                onClear={() => clearLogo("left")}
              />
              <LogoSettingCard
                title="Ganti Logo Kanan"
                logo={rightLogo}
                onPick={() => rightFileRef.current?.click()}
                onClear={() => clearLogo("right")}
              />
            </div>
            <input ref={leftFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoFile("left", e.target.files?.[0])} />
            <input ref={rightFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoFile("right", e.target.files?.[0])} />
          </div>

          <div className="space-y-3 rounded-lg border p-3">
            <div className="text-sm font-semibold">Header</div>
            <div>
              <Label>Ubah Header Utama</Label>
              <Input value={mainHeaderText} onChange={(e) => setMainHeaderText(e.target.value)} placeholder={APP_TITLE} />
            </div>
            <div>
              <Label>Ubah Header Dalam Bazar</Label>
              <Input value={workspaceHeaderText} onChange={(e) => setWorkspaceHeaderText(e.target.value)} placeholder={WORKSPACE_ORG_LABEL} />
            </div>
            <Button type="button" size="sm" onClick={saveHeaders}>Simpan Header</Button>
          </div>
        </div>
        <DialogFooter />
        <p className="text-[10px] text-muted-foreground">PIN aktif sekarang: {"•".repeat(getPin().length)}</p>
      </DialogContent>
    </Dialog>
  );
}

function LogoSettingCard({ title, logo, onPick, onClear }: { title: string; logo: string | null; onPick: () => void; onClear: () => void }) {
  return (
    <div className="rounded-lg bg-muted/40 p-3">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-full border bg-background">
          {logo ? <img src={logo} alt={title} className="h-full w-full object-cover" /> : <Camera className="h-5 w-5 text-muted-foreground" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium">{title}</div>
          <div className="text-[10px] text-muted-foreground">Upload gambar tersimpan permanen di perangkat ini.</div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Button type="button" size="sm" variant="outline" onClick={onPick} className="flex-1 gap-1"><Camera className="h-3.5 w-3.5" /> Pilih</Button>
        {logo && <Button type="button" size="sm" variant="ghost" onClick={onClear} className="text-destructive"><X className="h-3.5 w-3.5" /></Button>}
      </div>
    </div>
  );
}
