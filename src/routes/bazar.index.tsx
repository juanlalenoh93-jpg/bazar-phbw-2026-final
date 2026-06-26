import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Plus, Pencil, Trash2, Store, ClipboardList } from "lucide-react";
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
                <div className="mb-1 flex items-center justify-between gap-3">
                  <span className="font-semibold text-foreground">{b.name}</span>
                  <div className="flex shrink-0 items-center gap-1">
                    {isAdmin && (
                      <>
                        <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); openEdit(b.id); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <PinConfirmDelete onConfirm={() => remove(b.id)} label={b.name} requirePin={bazarHasData(b.id)} />
                      </>
                    )}
                    <Link
                      to="/bazar/$id/rekapan"
                      params={{ id: b.id }}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-medium text-emerald-700 transition hover:bg-emerald-100"
                    >
                      <ClipboardList className="h-3.5 w-3.5" />
                      Kirim Rekapan
                    </Link>
                  </div>
                </div>
                <Link to="/bazar/$id" params={{ id: b.id }} className="block">
                  <div className="text-xs text-muted-foreground">{fmtDate(new Date(b.date).getTime())}</div>
                  <div className="mt-3 rounded-xl bg-muted/40 p-3 text-xs">
                    <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
                      <FinanceLine label="Penjualan" value={s.totalSales} />
                      <FinanceLine label="Pengeluaran" value={s.totalExpense} tone="bad" />
                      <FinanceLine label="Piutang" value={s.totalPiutang} tone="warn" />
                      <FinanceLine label="Keuntungan" value={s.profit} tone="good" />
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 border-t pt-2 sm:grid-cols-2">
                      <FinanceLine label="Cash" value={s.totalCash} />
                      <FinanceLine label="Transfer" value={s.totalTransfer} />
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FinanceLine({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "good" | "bad" | "warn";
}) {
  const cls = tone === "good" ? "text-primary" : tone === "bad" ? "text-destructive" : tone === "warn" ? "text-warning" : "text-foreground";
  return (
    <div className="grid grid-cols-[88px_8px_1fr] items-center gap-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-muted-foreground">:</span>
      <b className={`text-right ${cls}`}>{fmtIDR(value)}</b>
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
