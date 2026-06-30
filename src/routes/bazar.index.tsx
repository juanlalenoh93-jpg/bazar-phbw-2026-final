import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Plus, Pencil, Trash2, Store, ShoppingCart, Wallet, Users, TrendingUp, Landmark } from "lucide-react";
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
  const bazars = [...db.bazars].sort((a, b) => a.createdAt - b.createdAt);
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
    const newBazar = { id: uid(), name: name.trim(), date, createdAt: Date.now() };
    setDB((d) => {
      if (editId) {
        const b = d.bazars.find((x) => x.id === editId);
        if (b) {
          b.name = name.trim();
          b.date = date;
        }
      } else {
        d.bazars.push(newBazar);
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
    <div className="space-y-5">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Daftar Bazar</h2>
          <p className="text-sm text-muted-foreground">Kelola seluruh event bazar.</p>
        </div>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4" /> Bazar Baru
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editId ? "Edit Bazar" : "Tambah Bazar"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={submit} className="space-y-3">
                <div>
                  <Label>Nama Bazar</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Bazar Natal 2026" />
                </div>
                <div>
                  <Label>Tanggal</Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={saving}>Simpan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {bazars.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-3">
          {bazars.map((b) => {
            const s = bazarStats(db, b.id);
            return (
              <div key={b.id} className="rounded-2xl border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link to="/bazar/$id" params={{ id: b.id }} className="min-w-0 flex-1">
                    <div className="font-bold text-lg text-foreground">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{fmtDate(new Date(b.date).getTime())}</div>
                    <div className="mt-3 rounded-xl border bg-muted/20 p-3">
                      <div className="mb-2 text-[11px] font-semibold tracking-wide text-muted-foreground">RINGKASAN KEUANGAN</div>
                      <div className="grid grid-cols-2 gap-2">
                        <FinanceBox icon={<ShoppingCart className="h-4 w-4" />} label="Penjualan" value={fmtIDR(s.totalSales)} tone="green" />
                        <FinanceBox icon={<Wallet className="h-4 w-4" />} label="Pengeluaran" value={fmtIDR(s.totalExpense)} tone="red" />
                        <FinanceBox icon={<Users className="h-4 w-4" />} label="Piutang" value={fmtIDR(s.totalPiutang)} tone="orange" />
                        <FinanceBox icon={<TrendingUp className="h-4 w-4" />} label="Keuntungan" value={fmtIDR(s.profit)} tone="green" />
                      </div>
                      <div className="my-3 border-t" />
                      <div className="mb-2 text-[11px] font-semibold tracking-wide text-muted-foreground">METODE PEMBAYARAN</div>
                      <div className="grid grid-cols-2 gap-2">
                        <FinanceBox icon={<Wallet className="h-4 w-4" />} label="Cash" value={fmtIDR(s.totalCash)} tone="green" />
                        <FinanceBox icon={<Landmark className="h-4 w-4" />} label="Transfer" value={fmtIDR(s.totalTransfer)} tone="blue" />
                      </div>
                    </div>
                  </Link>
                  {isAdmin && (
                    <div className="flex shrink-0 gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(b.id)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <PinConfirmDelete onConfirm={() => remove(b.id)} label={b.name} requirePin={bazarHasData(b.id)} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FinanceBox({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "green" | "red" | "orange" | "blue";
}) {
  const toneClasses: Record<typeof tone, string> = {
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-rose-50 text-rose-700",
    orange: "bg-orange-50 text-orange-700",
    blue: "bg-blue-50 text-blue-700",
  };
  const valueClasses: Record<typeof tone, string> = {
    green: "text-emerald-700",
    red: "text-rose-600",
    orange: "text-orange-600",
    blue: "text-blue-700",
  };
  return (
    <div className="flex items-center gap-2 rounded-xl border bg-card p-2.5">
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${toneClasses[tone]}`}>{icon}</div>
      <div className="min-w-0 text-left">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className={`truncate text-sm font-bold ${valueClasses[tone]}`}>{value}</div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid place-items-center rounded-2xl border-2 border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <Store className="h-10 w-10 text-muted-foreground" />
      <p className="mt-3 font-medium">Belum ada bazar</p>
      <p className="text-sm text-muted-foreground">Klik "Bazar Baru" untuk memulai.</p>
    </div>
  );
}

export function ConfirmDelete({ onConfirm, label }: { onConfirm: () => void; label: string }) {
  return (
    <AlertDialog>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus {label}?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Hapus</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
      <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={startDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
      <AlertDialog open={open} onOpenChange={(v) => { if (!v) reset(); else setOpen(true); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{step === "confirm" ? `Hapus ${label}?` : "Masukkan PIN"}</AlertDialogTitle>
            <AlertDialogDescription>
              {step === "confirm"
                ? "Tindakan ini tidak dapat dibatalkan. Lanjutkan menghapus data ini?"
                : "Masukkan PIN aktif untuk melanjutkan penghapusan."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {step === "pin" && (
            <div className="space-y-2">
              <Label>PIN</Label>
              <Input type="password" autoFocus value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Masukkan PIN" />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            {step === "confirm" ? (
              <AlertDialogAction onClick={proceed}>Ya, Hapus</AlertDialogAction>
            ) : (
              <AlertDialogAction onClick={confirmWithPin}>Hapus</AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
