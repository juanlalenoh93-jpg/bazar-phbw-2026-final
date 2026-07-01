import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Plus, Pencil, Trash2, Store, ShoppingCart, Wallet, TrendingUp, Users, Search, Calendar, ChevronRight } from "lucide-react";
import { useDB, setDB, uid, fmtDate, fmtIDR, bazarStats } from "@/lib/storage";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { verifyPin } from "@/lib/pin";

export const Route = createFileRoute("/bazar/")({
  component: BazarList,
});

function BazarList() {
  const db = useDB();
  const { isAdmin } = useAuth();
  
  // Mengurutkan dari event terbaru ke terlama agar lebih efisien saat di-scroll di HP
  const bazars = useMemo(() => [...db.bazars].sort((a, b) => b.createdAt - a.createdAt), [db.bazars]);
  
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  // Menghitung statistik akumulasi total global untuk 4 kotak atas sesuai foto komparasi
  const globalStats = useMemo(() => {
    let totalSales = 0;
    let totalExpense = 0;
    let totalPiutang = 0;
    let profit = 0;

    db.bazars.forEach((b) => {
      const s = bazarStats(db, b.id);
      totalSales += s.totalSales || 0;
      totalExpense += s.totalExpense || 0;
      totalPiutang += s.totalPiutang || 0;
      profit += s.profit || 0;
    });

    return { totalSales, totalExpense, totalPiutang, profit };
  }, [db]);

  const filteredBazars = useMemo(
    () => bazars.filter((b) => b.name.toLowerCase().includes(query.trim().toLowerCase())),
    [bazars, query],
  );

  const openCreate = () => {
    setEditId(null);
    setName("");
    setDate(new Date().toISOString().slice(0, 10));
    setOpen(true);
  };

  const openEdit = (id: string) => {
    const b = db.bazars.find((x) => x.id === id);
    if (!b) return;
    setEditId(id);
    setName(b.name);
    setDate(b.date);
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Nama bazar wajib diisi");
    if (saving) return;
    setSaving(true);
    
    setDB((d) => {
      if (editId) {
        const b = d.bazars.find((x) => x.id === editId);
        if (b) {
          b.name = name.trim();
          b.date = date;
        }
      } else {
        d.bazars.push({ id: uid(), name: name.trim(), date, createdAt: Date.now() });
      }
    });
    
    toast.success(editId ? "Bazar diperbarui" : "Bazar ditambahkan");
    setOpen(false);
    setSaving(false);
  };

  const bazarHasData = (id: string) =>
    db.menus.some((x) => x.bazarId === id) ||
    db.orders.some((x) => x.bazarId === id) ||
    db.sales.some((x) => x.bazarId === id) ||
    db.expenses.some((x) => x.bazarId === id) ||
    db.payments.some((x) => x.bazarId === id);

  const remove = (id: string) => {
    setDB((d) => {
      d.bazars = d.bazars.filter((x) => x.id !== id);
      d.menus = d.menus.filter((x) => x.bazarId !== id);
      d.orders = d.orders.filter((x) => x.bazarId !== id);
      const saleIds = d.sales.filter((s) => s.bazarId === id).map((s) => s.id);
      d.sales = d.sales.filter((x) => x.bazarId !== id);
      d.expenses = d.expenses.filter((x) => x.bazarId !== id);
      d.payments = d.payments.filter((p) => !saleIds.includes(p.saleId));
    });
    toast.success("Bazar dihapus");
  };

  return (
    <div className="space-y-5 pb-24 bg-slate-50/50 min-h-screen -mx-4 px-4 pt-2">
      {/* Top Header Section */}
      <div className="flex items-center justify-between gap-2 pt-2">
        <div className="flex items-center gap-2.5">
          <Link to="/" className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm text-slate-600 active:scale-95 transition-transform">
            <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Daftar Bazar</h1>
            <p className="text-xs font-medium text-slate-400">Kelola seluruh event bazar</p>
          </div>
        </div>

        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl px-4 py-4.5 font-bold shadow-sm flex items-center gap-1 active:scale-95 transition-transform text-xs" onClick={openCreate}>
                <Plus className="h-4 w-4 stroke-[3]" /> Bazar Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl max-w-[90vw] sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-bold text-slate-900">{editId ? "Edit Bazar" : "Tambah Bazar"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={submit} className="space-y-4 pt-1">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-600">Nama Bazar</Label>
                  <Input className="rounded-xl border-slate-200" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Bazar Wilayah IV" required />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-600">Tanggal Pelaksanaan</Label>
                  <Input type="date" className="rounded-xl border-slate-200" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <DialogFooter className="flex flex-row gap-2 justify-end pt-2">
                  <Button type="button" variant="outline" className="rounded-xl flex-1 sm:flex-none" onClick={() => setOpen(false)}>Batal</Button>
                  <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl flex-1 sm:flex-none" disabled={saving}>Simpan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Ringkasan Keuangan Global Grid (Sama Persis Seperti Foto Komparasi Anda) */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-0.5">Ringkasan Keuangan</div>
        <div className="grid grid-cols-2 gap-3">
          <FinanceBox icon={<ShoppingCart className="h-5 w-5" />} tone="emerald" label="Penjualan" value={globalStats.totalSales} />
          <FinanceBox icon={<Wallet className="h-5 w-5" />} tone="rose" label="Pengeluaran" value={globalStats.totalExpense} />
          <FinanceBox icon={<Users className="h-5 w-5" />} tone="amber" label="Piutang" value={globalStats.totalPiutang} />
          <FinanceBox icon={<TrendingUp className="h-5 w-5" />} tone="emerald_profit" label="Keuntungan" value={globalStats.profit} />
        </div>
      </div>

      {/* Search Input Bar Element */}
      <div className="relative mt-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama bazar..."
          className="h-11 rounded-2xl border-slate-100 bg-white pl-10 pr-4 text-sm shadow-[0_2px_8px_rgba(0,0,0,0.015)] placeholder:text-slate-400 focus-visible:ring-emerald-600"
        />
      </div>

      {/* List Rentetan Acara Bazar */}
      <div className="space-y-2.5">
        {bazars.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-4 py-16 text-center shadow-sm">
            <Store className="h-8 w-8 text-slate-300 stroke-[1.5]" />
            <p className="mt-3 text-sm font-bold text-slate-700">Belum ada bazar</p>
            <p className="text-xs text-slate-400 mt-0.5">Klik "Bazar Baru" untuk memulai pencatatan.</p>
          </div>
        ) : filteredBazars.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-4 py-16 text-center shadow-sm">
            <Search className="h-8 w-8 text-slate-300 stroke-[1.5]" />
            <p className="mt-3 text-sm font-bold text-slate-700">Tidak ditemukan</p>
            <p className="text-xs text-slate-400 mt-0.5">Tidak ada acara bernama "{query}".</p>
          </div>
        ) : (
          filteredBazars.map((b) => (
            <div key={b.id} className="group bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-emerald-100 transition-all">
              <Link to="/bazar/$id" params={{ id: b.id }} className="flex-1 flex items-center gap-3 min-w-0">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Store className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate group-hover:text-emerald-800 transition-colors">{b.name}</h3>
                  <div className="flex items-center gap-1 text-slate-400 text-[11px] mt-0.5 font-medium">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                    <span>{fmtDate(new Date(b.date).getTime())}</span>
                  </div>
                </div>
              </Link>
              
              <div className="flex items-center gap-1 shrink-0 ml-1">
                {isAdmin && (
                  <>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-emerald-700 hover:bg-slate-50 rounded-lg" onClick={() => openEdit(b.id)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <PinConfirmDelete onConfirm={() => remove(b.id)} label={b.name} requirePin={bazarHasData(b.id)} />
                  </>
                )}
                <Link to="/bazar/$id" params={{ id: b.id }} className="p-1 text-slate-300 hover:text-slate-600 transition-colors">
                  <ChevronRight className="h-4 w-4 stroke-[3]" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function FinanceBox({
  icon,
  tone,
  label,
  value,
}: {
  icon: React.ReactNode;
  tone: "emerald" | "rose" | "amber" | "emerald_profit";
  label: string;
  value: number;
}) {
  const toneMap: Record<string, { bg: string; text: string; valText?: string }> = {
    emerald: { bg: "bg-emerald-50/70", text: "text-emerald-700" },
    rose: { bg: "bg-rose-50/70", text: "text-rose-600" },
    amber: { bg: "bg-amber-50/70", text: "text-amber-600" },
    emerald_profit: { bg: "bg-blue-50/70", text: "text-blue-600", valText: "text-emerald-700" },
  };
  
  const t = toneMap[tone];
  
  return (
    <div className="flex flex-col justify-between min-h-[96px] w-full rounded-2xl border border-slate-100 bg-white p-3.5 shadow-[0_2px_6px_rgba(0,0,0,0.01)]">
      <div className="flex items-center justify-between w-full">
        <span className="text-[11px] font-semibold text-slate-400">{label}</span>
        <div className={`grid h-8 w-8 place-items-center rounded-xl ${t.bg} ${t.text}`}>
          {icon}
        </div>
      </div>
      <div className="mt-2.5">
        <div className={`text-[15px] font-extrabold leading-tight tracking-tight truncate ${t.valText || "text-slate-800"}`}>
          {fmtIDR(value)}
        </div>
      </div>
    </div>
  );
}

export function PinConfirmDelete({
  onConfirm,
  label,
  requirePin = true,
  canDelete,
}: {
  onConfirm: () => void;
  label: string;
  requirePin?: boolean;
  canDelete?: () => boolean;
}) {
  const [pin, setPin] = useState("");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"confirm" | "pin">("confirm");

  const reset = () => {
    setOpen(false);
    setStep("confirm");
    setPin("");
  };

  const startDelete = () => {
    if (canDelete && !canDelete()) return;
    setStep("confirm");
    setOpen(true);
  };

  const proceed = (e: React.MouseEvent) => {
    e.preventDefault();
    if (requirePin) {
      setStep("pin");
      return;
    }
    onConfirm();
    reset();
  };

  const confirmWithPin = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!verifyPin(pin)) {
      toast.error("PIN salah");
      return;
    }
    onConfirm();
    reset();
  };

  return (
    <>
      <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg" onClick={startDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
      <AlertDialog open={open} onOpenChange={(v) => { if (!v) reset(); else setOpen(true); }}>
        <AlertDialogContent className="rounded-3xl max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-slate-900">{step === "confirm" ? `Hapus ${label}?` : "Masukkan PIN Keamanan"}</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 text-xs">
              {step === "confirm"
                ? "Tindakan ini permanen dan akan melenyapkan data. Anda yakin?"
                : "Silakan input PIN otorisasi Admin Anda untuk melakukan aksi ini."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {step === "pin" && (
            <div className="space-y-1 py-1">
              <Label className="text-xs font-semibold text-slate-600">PIN Konfirmasi</Label>
              <Input type="password" inputMode="numeric" autoFocus value={pin} onChange={(e) => setPin(e.target.value)} placeholder="• • • •" className="rounded-xl border-slate-200 text-center tracking-widest text-base" />
            </div>
          )}
          <AlertDialogFooter className="flex flex-row gap-2 justify-end pt-1">
            <AlertDialogCancel className="rounded-xl flex-1 sm:flex-none mt-0 text-xs" onClick={reset}>Batal</AlertDialogCancel>
            {step === "confirm" ? (
              <AlertDialogAction className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl flex-1 sm:flex-none text-xs" onClick={proceed}>Ya, Hapus</AlertDialogAction>
            ) : (
              <AlertDialogAction className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl flex-1 sm:flex-none text-xs" onClick={confirmWithPin}>Konfirmasi</AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
