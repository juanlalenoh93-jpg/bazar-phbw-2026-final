import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Plus, Pencil, Trash2, ShoppingCart, Wallet, TrendingUp, Users, Send, ChevronRight } from "lucide-react";
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
  
  // Urutkan berdasarkan bazar terbaru
  const bazars = useMemo(() => [...db.bazars].sort((a, b) => b.createdAt - a.createdAt), [db.bazars]);
  
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);

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

  // Fungsi simulasi kirim rekapan via WhatsApp/Share biasa
  const handleKirimRekapan = (bazarName: string, stats: any) => {
    const text = `Rekapan Keuangan ${bazarName}:\n\nPenjualan: ${fmtIDR(stats.totalSales)}\nPengeluaran: ${fmtIDR(stats.totalExpense)}\nPiutang: ${fmtIDR(stats.totalPiutang)}\nKeuntungan: ${fmtIDR(stats.profit)}`;
    if (navigator.share) {
      navigator.share({ title: `Rekapan ${bazarName}`, text }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  return (
    <div className="space-y-6 pb-24 bg-slate-50/40 min-h-screen -mx-4 px-4 pt-4">
      {/* Tombol Kembali Atas */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="h-4 w-4 stroke-[2.5]" /> Kembali
        </Link>
      </div>

      {/* Header Utama Judul & Tombol Tambah */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Daftar Bazar</h1>
          <p className="text-sm font-medium text-slate-400 mt-1">Kelola seluruh event bazar.</p>
        </div>

        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#00875A] hover:bg-[#00704a] text-white rounded-xl px-4 py-5 font-bold shadow-sm flex items-center gap-1 active:scale-95 transition-transform text-xs" onClick={openCreate}>
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
                  <Input className="rounded-xl border-slate-200" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Bazar 1" required />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-600">Tanggal Pelaksanaan</Label>
                  <Input type="date" className="rounded-xl border-slate-200" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <DialogFooter className="flex flex-row gap-2 justify-end pt-2">
                  <Button type="button" variant="outline" className="rounded-xl flex-1 sm:flex-none" onClick={() => setOpen(false)}>Batal</Button>
                  <Button type="submit" className="bg-[#00875A] hover:bg-[#00704a] text-white rounded-xl flex-1 sm:flex-none" disabled={saving}>Simpan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Daftar Kartu Komponen Utama per Event */}
      <div className="space-y-6">
        {bazars.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-4 py-16 text-center shadow-sm">
            <p className="text-sm font-bold text-slate-500">Belum ada event bazar.</p>
          </div>
        ) : (
          bazars.map((b) => {
            const stats = bazarStats(db, b.id);
            
            // Perhitungan Kas dan Transfer internal dari data penjualan (sales)
            const cashAmount = db.sales
              .filter((s) => s.bazarId === b.id && s.method === "cash")
              .reduce((acc, curr) => acc + curr.total, 0);
              
            const transferAmount = db.sales
              .filter((s) => s.bazarId === b.id && s.method === "transfer")
              .reduce((acc, curr) => acc + curr.total, 0);

            return (
              <div key={b.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-5">
                
                {/* Bagian Atas: Nama Bazar & Tombol Aksi */}
                <div className="flex items-start justify-between gap-2">
                  <Link 
                    to="/bazar/$id" 
                    params={{ id: b.id }} 
                    className="flex-1 min-w-0 group"
                  >
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-[#00875A] transition-colors truncate">
                        {b.name}
                      </h2>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#00875A] transition-colors shrink-0 mt-0.5" />
                    </div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">
                      {fmtDate(new Date(b.date).getTime())}
                    </div>
                  </Link>
                  
                  {isAdmin && (
                    <div className="flex items-center gap-1 shrink-0">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg" onClick={() => openEdit(b.id)}>
                        <Pencil className="h-4 w-4 text-slate-700 stroke-[2.5]" />
                      </Button>
                      <PinConfirmDelete onConfirm={() => remove(b.id)} label={b.name} requirePin={bazarHasData(b.id)} />
                    </div>
                  )}
                </div>

                {/* Sub-Section 1: Ringkasan Keuangan */}
                <Link to="/bazar/$id" params={{ id: b.id }} className="block space-y-2.5 active:opacity-80">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ringkasan Keuangan</div>
                  <div className="grid grid-cols-2 gap-3">
                    <MiniBox icon={<ShoppingCart className="h-5 w-5" />} tone="emerald" label="Penjualan" value={stats.totalSales} />
                    <MiniBox icon={<Wallet className="h-5 w-5" />} tone="rose" label="Pengeluaran" value={stats.totalExpense} />
                    <MiniBox icon={<Users className="h-5 w-5" />} tone="amber" label="Piutang" value={stats.totalPiutang} />
                    <MiniBox icon={<TrendingUp className="h-5 w-5" />} tone="emerald_bold" label="Keuntungan" value={stats.profit} />
                  </div>
                </Link>

                {/* Garis Pembatas Tipis */}
                <hr className="border-slate-100" />

                {/* Sub-Section 2: Metode Pembayaran */}
                <div className="space-y-2.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Metode Pembayaran</div>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Kotak Cash */}
                    <div className="flex items-center gap-3 rounded-xl border border-slate-50 bg-slate-50/30 p-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EAF7F2] text-[#00875A]">
                        <div className="h-5 w-5 rounded bg-[#00875A] opacity-90 relative flex items-center justify-center">
                          <div className="w-2.5 h-1.5 rounded-sm border border-white"></div>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-medium text-slate-400">Cash</div>
                        <div className="text-xs font-extrabold text-slate-800 mt-0.5 truncate">{fmtIDR(cashAmount)}</div>
                      </div>
                    </div>

                    {/* Kotak Transfer */}
                    <div className="flex items-center gap-3 rounded-xl border border-slate-50 bg-slate-50/30 p-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-medium text-slate-400">Transfer</div>
                        <div className="text-xs font-extrabold text-slate-800 mt-0.5 truncate">{fmtIDR(transferAmount)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bagian Paling Bawah: Tombol Kirim Rekapan */}
                <Button 
                  onClick={() => handleKirimRekapan(b.name, stats)}
                  variant="outline" 
                  className="w-full h-11 bg-[#F7FBF9] hover:bg-[#EAF7F2] border-[#E2EFEA] hover:border-[#BFDFD2] text-[#00875A] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all mt-2"
                >
                  <Send className="h-4 w-4 text-[#00875A] fill-current" />
                  Kirim Rekapan
                </Button>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function MiniBox({
  icon,
  tone,
  label,
  value,
}: {
  icon: React.ReactNode;
  tone: "emerald" | "rose" | "amber" | "emerald_bold";
  label: string;
  value: number;
}) {
  const toneMap: Record<string, { bg: string; text: string; valClass: string }> = {
    emerald: { bg: "bg-[#EAF7F2]", text: "text-[#00875A]", valClass: "text-[#00875A]" },
    rose: { bg: "bg-rose-50", text: "text-rose-600", valClass: "text-rose-600" },
    amber: { bg: "bg-amber-50", text: "text-amber-500", valClass: "text-[#E27D16]" },
    emerald_bold: { bg: "bg-[#EAF7F2]", text: "text-[#00875A]", valClass: "text-[#00875A]" },
  };
  
  const t = toneMap[tone];
  
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-50 bg-slate-50/30 p-3">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${t.bg} ${t.text}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-medium text-slate-400">{label}</div>
        <div className={`text-xs font-extrabold mt-0.5 truncate ${t.valClass}`}>
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
  buttonClassName,
}: {
  onConfirm: () => void;
  label: string;
  requirePin?: boolean;
  canDelete?: () => boolean;
  buttonClassName?: string;
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
      <Button
        size="icon"
        variant="ghost"
        className={buttonClassName || "h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg"}
        onClick={startDelete}
      >
        <Trash2 className="h-4 w-4 text-rose-600 stroke-[2.5]" />
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
