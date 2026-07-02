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
                
                {/* Bagian Atas: Nama Bazar & Tombol Aksi (Sekarang Bisa Diklik untuk Masuk Detail) */}
                <div className="flex items-start justify-between gap-2">
                  <Link 
                    to="/
