import { createFileRoute, Link } from "@tanstack/react-router";
import { Store, Wallet, History, Calculator, Eye, EyeOff, Settings, RefreshCw, Camera, X, Users, ChevronRight, LogOut, Download, Upload, Database, ShieldCheck } from "lucide-react";
import { SheetSyncSettings } from "@/components/SheetSyncSettings";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useDB, setDB, computeSaldo, fmtIDR, useLogo, useRightLogo, setLogo, setRightLogo, allCustomersGlobal, removeCustomerFromMaster, saleOutstanding, downloadBackup, restoreFromBackup } from "@/lib/storage";
import { exportAll, useSheetUrl } from "@/lib/sync";
import { signOut, useAuth, useAdminList, addAdmin, removeAdmin } from "@/lib/auth";
import { APP_TITLE, WORKSPACE_ORG_LABEL, setMainHeader, setWorkspaceHeader, useMainHeader, useWorkspaceHeader } from "@/lib/branding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { getPin, setPin, verifyPin } from "@/lib/pin";
import { toast } from "sonner";
import { PinConfirmDelete } from "./bazar.index";

export const Route = createFileRoute("/")({ component: Dashboard });

const menus = [
  { to: "/bazar", label: "Daftar Bazar", desc: "Kelola event, menu, pesanan, penjualan & pengeluaran.", Icon: Store, adminOnly: false },
  { to: "/piutang", label: "Daftar Piutang", desc: "Akumulasi piutang per customer dari semua bazar.", Icon: Wallet, adminOnly: false },
  { to: "/riwayat", label: "Riwayat Pembayaran Piutang", desc: "Log cicilan & pelunasan, terbaru di atas.", Icon: History, adminOnly: false },
  { to: "/kalkulator", label: "Kalkulator Keuntungan", desc: "Simulasi ekspektasi pendapatan bazar berikutnya.", Icon: Calculator, adminOnly: true },
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
  const { displayName, isAdmin } = useAuth();
  const [hideSaldo, setHideSaldo] = useState(true);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!sheetUrl) {
      toast.error("Tempel URL Google Sheets terlebih dahulu");
      return;
    }
    setExporting(true);
    const result = await exportAll(db);
    setExporting(false);
    if (result.ok) toast.success(result.message || "Seluruh data dikirim ke Google Sheets");
    else toast.error(result.message || "Gagal mengirim — cek URL Apps Script", { duration: 8000 });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">{greeting(displayName)}</p>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${isAdmin ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
              {isAdmin ? "ADMIN" : "VIEWER"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
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
        {menus.filter((m) => !m.adminOnly || isAdmin).map(({ to, label, desc, Icon }) => (
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

      {isAdmin && <div className="rounded-2xl border bg-card p-4">
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
            {exporting ? "Mengirim data ke Sheets..." : "🔄 Ekspor Semua Data ke Google Sheets"}
          </Button>
        </div>
      </div>}

      <p className="text-center text-[10px] text-muted-foreground">App created by : JJ</p>
    </div>
  );
}

type SettingsAction =
  | "pin"
  | "modal-awal"
  | "left-logo"
  | "right-logo"
  | "main-header"
  | "workspace-header"
  | "customers"
  | "backup-restore"
  | "admin-list";

const settingsLabels: Record<SettingsAction, string> = {
  "pin": "Ganti PIN",
  "modal-awal": "Edit Modal Awal",
  "left-logo": "Ganti Logo Kiri",
  "right-logo": "Ganti Logo Kanan",
  "main-header": "Ubah Header Utama",
  "workspace-header": "Ubah Header Dalam Bazar",
  "customers": "Kelola Customer Terdaftar",
  "backup-restore": "Backup & Restore Data",
  "admin-list": "Kelola Admin",
};

function AppSettings() {
  const db = useDB();
  const customers = allCustomersGlobal(db);
  const adminListData = useAdminList();
  const { isAdmin } = useAuth();

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<SettingsAction | null>(null);
  const [pin, setPinInput] = useState("");
  const [verified, setVerified] = useState(false);
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [modalAwalInput, setModalAwalInput] = useState("");

  const currentMainHeader = useMainHeader();
  const currentWorkspaceHeader = useWorkspaceHeader();
  const [mainHeaderText, setMainHeaderText] = useState(currentMainHeader);
  const [workspaceHeaderText, setWorkspaceHeaderText] = useState(currentWorkspaceHeader);
  const leftLogo = useLogo();
  const rightLogo = useRightLogo();
  const leftFileRef = useRef<HTMLInputElement>(null);
  const rightFileRef = useRef<HTMLInputElement>(null);
  const restoreFileRef = useRef<HTMLInputElement>(null);

  const resetAction = () => {
    setActive(null);
    setPinInput("");
    setVerified(false);
    if (action === "modal-awal") setModalAwalInput(String(db.modalAwal || 0));
    setNext("");
    setConfirm("");
    setNewAdminEmail("");
  };

  useEffect(() => {
    if (open) {
      setMainHeaderText(currentMainHeader);
      setWorkspaceHeaderText(currentWorkspaceHeader);
    }
  }, [open, currentMainHeader, currentWorkspaceHeader]);

  const openAction = (action: SettingsAction) => {
    setActive(action);
    setPinInput("");
    setVerified(false);
    setNext("");
    setConfirm("");
    setNewAdminEmail("");
  };

  const submitPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyPin(pin)) {
      toast.error("PIN salah");
      return;
    }
    setVerified(true);
    setPinInput("");
  };

  const savePin = () => {
    if (next.length < 4) return toast.error("PIN baru minimal 4 karakter");
    if (next !== confirm) return toast.error("Konfirmasi PIN tidak cocok");
    setPin(next);
    toast.success("PIN berhasil diubah");
    resetAction();
  };

  const saveMainHeader = () => {
    setMainHeader(mainHeaderText || APP_TITLE);
    toast.success("Header utama berhasil disimpan");
    resetAction();
  };

  const saveWorkspaceHeader = () => {
    setWorkspaceHeader(workspaceHeaderText || WORKSPACE_ORG_LABEL);
    toast.success("Header dalam bazar berhasil disimpan");
    resetAction();
  };

  const handleLogoFile = (side: "left" | "right", file?: File) => {
    if (!file) return;
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
      resetAction();
    };
    reader.readAsDataURL(file);
  };

  const clearLogo = (side: "left" | "right") => {
    if (side === "left") setLogo(null);
    else setRightLogo(null);
    toast.success(side === "left" ? "Logo kiri dihapus" : "Logo kanan dihapus");
    resetAction();
  };

  const deleteCustomer = (name: string) => {
    const key = name.trim().toLowerCase();
    const hasActivePiutang = db.sales.some((s) => s.customer.trim().toLowerCase() === key && saleOutstanding(db, s.id) > 0);
    if (hasActivePiutang) {
      toast.error("Customer masih punya piutang aktif. Lunasi atau hapus pembayaran terkait dulu.");
      return;
    }
    removeCustomerFromMaster(name);
    toast.success("Customer dihapus dari daftar");
  };

  const handleAddAdmin = () => {
    const email = newAdminEmail.trim().toLowerCase();
    if (!email || !email.includes("@")) return toast.error("Masukkan alamat email yang valid");
    addAdmin(email);
    toast.success(`${email} ditambahkan sebagai Admin`);
    setNewAdminEmail("");
  };

  const handleRemoveAdmin = (email: string) => {
    removeAdmin(email);
    toast.success(`${email} dihapus dari daftar Admin`);
  };

  const handleBackup = () => {
    downloadBackup();
    toast.success("File backup sedang diunduh...");
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ok = window.confirm("⚠️ Restore akan MENGGANTIKAN semua data yang ada sekarang dengan data dari file backup. Lanjutkan?");
    if (!ok) { e.target.value = ""; return; }
    setRestoring(true);
    try {
      await restoreFromBackup(file);
      toast.success("Data berhasil dipulihkan! Halaman akan diperbarui.");
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memulihkan data");
    } finally {
      setRestoring(false);
      if (restoreFileRef.current) restoreFileRef.current.value = "";
    }
  };

  const logout = () => {
    const ok = window.confirm("Yakin ingin keluar dari akun ini?");
    if (!ok) return;
    setOpen(false);
    signOut();
  };

  const renderActionContent = () => {
    if (!active) return null;

    // backup-restore doesn't need PIN
    if (active === "backup-restore") {
      return (
        <div className="space-y-3 rounded-xl border p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Database className="h-4 w-4" /> Backup & Restore Data
          </div>
          <p className="text-[10px] text-muted-foreground">
            Backup menyimpan seluruh data ke file .json. Restore memuat ulang dari file backup. Gunakan sebelum pindah perangkat atau clear cache.
          </p>
          <Button type="button" className="w-full gap-2" onClick={handleBackup}>
            <Download className="h-4 w-4" /> Backup Data (Download .json)
          </Button>
          <div className="space-y-1">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              disabled={restoring}
              onClick={() => restoreFileRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              {restoring ? "Memulihkan data..." : "Restore Data (Upload .json)"}
            </Button>
            <p className="text-[10px] text-amber-600">⚠️ Restore akan menggantikan semua data yang ada sekarang.</p>
            <input
              ref={restoreFileRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleRestore}
            />
          </div>
          <DialogFooter><Button type="button" variant="outline" onClick={resetAction}>Kembali</Button></DialogFooter>
        </div>
      );
    }

    if (!verified) {
      return (
        <form onSubmit={submitPin} className="space-y-4 rounded-xl border bg-muted/20 p-4">
          <div>
            <div className="text-sm font-semibold">{settingsLabels[active]}</div>
            <p className="mt-1 text-xs text-muted-foreground">Masukkan PIN aktif untuk membuka pengaturan ini.</p>
          </div>
          <Input type="password" autoFocus value={pin} onChange={(e) => setPinInput(e.target.value)} placeholder="Masukkan PIN" />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={resetAction}>Batal</Button>
            <Button type="submit">Lanjut</Button>
          </DialogFooter>
        </form>
      );
    }

    if (active === "pin") {
      return (
        <div className="space-y-3 rounded-xl border p-4">
          <div>
            <div className="text-sm font-semibold">Ganti PIN</div>
            <p className="mt-1 text-xs text-muted-foreground">PIN baru minimal 4 karakter.</p>
          </div>
          <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="PIN baru" />
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Konfirmasi PIN baru" />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={resetAction}>Batal</Button>
            <Button type="button" onClick={savePin}>Simpan PIN</Button>
          </DialogFooter>
        </div>
      );
    }

    if (active === "modal-awal") {
      return (
        <div className="space-y-3 rounded-xl border p-4">
          <div className="text-sm font-semibold">Edit Modal Awal</div>
          <p className="mt-1 text-xs text-muted-foreground">Saat ini: <b>{fmtIDR(db.modalAwal)}</b></p>
          <Label>Nominal</Label>
          <Input inputMode="numeric" value={modalAwalInput} onChange={(e)=>setModalAwalInput(e.target.value.replace(/[^\d]/g,""))} placeholder="0"/>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={resetAction}>Batal</Button>
            <Button type="button" onClick={()=>{setDB((d)=>{d.modalAwal=Number(modalAwalInput)||0;});toast.success("Modal awal diperbarui");resetAction();}}>Simpan</Button>
          </DialogFooter>
        </div>
      );
    }

    if (active === "left-logo" || active === "right-logo") {
      const side = active === "left-logo" ? "left" : "right";
      const logo = side === "left" ? leftLogo : rightLogo;
      const ref = side === "left" ? leftFileRef : rightFileRef;
      return (
        <div className="space-y-3 rounded-xl border p-4">
          <LogoSettingCard
            title={settingsLabels[active]}
            logo={logo}
            onPick={() => ref.current?.click()}
            onClear={() => clearLogo(side)}
          />
          <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoFile(side, e.target.files?.[0])} />
          <DialogFooter><Button type="button" variant="outline" onClick={resetAction}>Batal</Button></DialogFooter>
        </div>
      );
    }

    if (active === "main-header") {
      return (
        <div className="space-y-3 rounded-xl border p-4">
          <div>
            <Label>Header Utama</Label>
            <Input value={mainHeaderText} onChange={(e) => setMainHeaderText(e.target.value)} placeholder={APP_TITLE} />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={resetAction}>Batal</Button>
            <Button type="button" onClick={saveMainHeader}>Simpan</Button>
          </DialogFooter>
        </div>
      );
    }

    if (active === "workspace-header") {
      return (
        <div className="space-y-3 rounded-xl border p-4">
          <div>
            <Label>Header Dalam Bazar</Label>
            <Input value={workspaceHeaderText} onChange={(e) => setWorkspaceHeaderText(e.target.value)} placeholder={WORKSPACE_ORG_LABEL} />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={resetAction}>Batal</Button>
            <Button type="button" onClick={saveWorkspaceHeader}>Simpan</Button>
          </DialogFooter>
        </div>
      );
    }

    if (active === "customers") {
      return (
        <div className="space-y-3 rounded-xl border p-4">
          <div className="flex items-center gap-2 text-sm font-semibold"><Users className="h-4 w-4" /> Kelola Customer Terdaftar</div>
          <p className="text-[10px] text-muted-foreground">
            Hapus customer hanya dari daftar pilihan/dropdown. Riwayat pesanan, penjualan, dan pembayaran lama tetap tersimpan.
          </p>
          {customers.length === 0 ? (
            <div className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">Belum ada customer terdaftar.</div>
          ) : (
            <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
              {customers.map((name) => {
                const hasActivePiutang = db.sales.some((s) => s.customer.trim().toLowerCase() === name.trim().toLowerCase() && saleOutstanding(db, s.id) > 0);
                return (
                  <div key={name} className="flex items-center justify-between gap-2 rounded-md border bg-background px-3 py-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{name}</div>
                      {hasActivePiutang && <div className="text-[10px] text-warning">Masih punya piutang aktif</div>}
                    </div>
                    <PinConfirmDelete
                      label={name}
                      requirePin
                      canDelete={() => {
                        if (hasActivePiutang) {
                          toast.error("Customer masih punya piutang aktif. Lunasi atau hapus pembayaran terkait dulu.");
                          return false;
                        }
                        return true;
                      }}
                      onConfirm={() => deleteCustomer(name)}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <DialogFooter><Button type="button" variant="outline" onClick={resetAction}>Kembali</Button></DialogFooter>
        </div>
      );
    }

    if (active === "admin-list") {
      return (
        <div className="space-y-3 rounded-xl border p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="h-4 w-4" /> Kelola Admin
          </div>
          <p className="text-[10px] text-muted-foreground">
            Admin punya akses penuh (tambah/edit/hapus). Viewer hanya bisa melihat data. Jika daftar kosong, semua pengguna adalah Admin.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="email@gmail.com"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddAdmin(); } }}
              className="text-xs"
            />
            <Button size="sm" type="button" onClick={handleAddAdmin}>Tambah</Button>
          </div>
          {adminListData.length === 0 ? (
            <div className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
              Daftar kosong — semua pengguna saat ini adalah Admin.
            </div>
          ) : (
            <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
              {adminListData.map((email) => (
                <div key={email} className="flex items-center justify-between gap-2 rounded-md border bg-background px-3 py-2">
                  <div className="truncate text-sm">{email}</div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleRemoveAdmin(email)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <DialogFooter><Button type="button" variant="outline" onClick={resetAction}>Kembali</Button></DialogFooter>
        </div>
      );
    }
  };

  const menuItems: { action: SettingsAction; icon?: ReactNode; adminOnly?: boolean }[] = [
    { action: "pin", adminOnly: true },
    { action: "modal-awal", adminOnly: true },
    { action: "left-logo", adminOnly: true },
    { action: "right-logo", adminOnly: true },
    { action: "main-header", adminOnly: true },
    { action: "workspace-header", adminOnly: true },
    { action: "customers", icon: <Users className="h-4 w-4" />, adminOnly: true },
    { action: "backup-restore", icon: <Database className="h-4 w-4" />, adminOnly: true },
    { action: "admin-list", icon: <ShieldCheck className="h-4 w-4" />, adminOnly: true },
  ];

  const visibleMenuItems = menuItems.filter((m) => !m.adminOnly || isAdmin);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) resetAction(); }}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Pengaturan"><Settings className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Pengaturan Aplikasi</DialogTitle></DialogHeader>
        <div className="space-y-3">
          {!active ? (
            <div className="space-y-2">
              {visibleMenuItems.map(({ action, icon }) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => openAction(action)}
                  className="flex w-full items-center justify-between rounded-xl border bg-card px-4 py-3 text-left text-sm font-medium transition hover:bg-muted/50"
                >
                  <span className="flex items-center gap-2">{icon}{settingsLabels[action]}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center justify-between rounded-xl border bg-card px-4 py-3 text-left text-sm font-medium text-destructive transition hover:bg-destructive/5"
              >
                <span className="flex items-center gap-2"><LogOut className="h-4 w-4" /> Log Out</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
              <p className="pt-1 text-[10px] text-muted-foreground">PIN aktif sekarang: {"•".repeat(getPin().length)}</p>
            </div>
          ) : renderActionContent()}
        </div>
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
