import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Plus, Pencil, Trash2, Store, ShoppingCart, Wallet, TrendingUp, Users, Landmark, Search, Calendar } from "lucide-react";
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
  const [query, setQuery] = useState("");

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
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Daftar Bazar</h2>
            <p className="text-sm text-muted-foreground">Kelola seluruh event bazar.</p>
          </div>
        </div>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full rounded-xl px-5 sm:w-auto" onClick={openCreate}>
                <Plus className="h-5 w-5" /> Bazar Baru
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

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama bazar..."
          className="h-12 rounded-2xl border-border/80 bg-card pl-11 pr-4 text-[15px] shadow-sm"
        />
      </div>

      {bazars.length === 0 ? (
        <EmptyState />
      ) : filteredBazars.length === 0 ? (
        <NoResultState query={query} />
      ) : (
        <div className="grid gap-4">
          {filteredBazars.map((b) => {
            const s = bazarStats(db, b.id);
            return (
              <div
                key={b.id}
                className="rounded-[20px] border bg-card p-5 shadow-[0_2px_10px_rgba(0,0,0,.06)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,.08)] sm:p-6"
              >
                <div className="grid grid-cols-[1fr_auto] items-start gap-4">
                  <Link to="/bazar/$id" params={{ id: b.id }} className="block min-w-0 w-full">
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        <Store className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-lg font-bold text-foreground">{b.name}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {fmtDate(new Date(b.date).getTime())}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-border/70 p-4 sm:p-5">
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ringkasan Keuangan</div>
                      <div className="mt-3 grid w-full grid-cols-2 gap-3 sm:gap-4">
                        <FinanceBox icon={<ShoppingCart className="h-6 w-6" />} tone="emerald" label="Penjualan" value={s.totalSales} />
                        <FinanceBox icon={<Wallet className="h-6 w-6" />} tone="rose" label="Pengeluaran" value={s.totalExpense} />
                        <FinanceBox icon={<Users className="h-6 w-6" />} tone="amber" label="Piutang" value={s.totalPiutang} />
                        <FinanceBox icon={<TrendingUp className="h-6 w-6" />} tone="emerald" label="Keuntungan" value={s.profit} />
                      </div>

                      <div className="mt-5 border-t border-border/70 pt-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Metode Pembayaran</div>
                        <div className="mt-3 grid w-full grid-cols-2 gap-3 sm:gap-4">
                          <FinanceBox icon={<Wallet className="h-6 w-6" />} tone="emerald" label="Cash" value={s.totalCash} coloredValue={false} />
                          <FinanceBox icon={<Landmark className="h-6 w-6" />} tone="blue" label="Transfer" value={s.totalTransfer} coloredValue={false} />
                        </div>
                      </div>
                    </div>
                  </Link>
                  {isAdmin && (
                    <div className="flex shrink-0 gap-1.5">
                      <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl" onClick={() => openEdit(b.id)}>
                        <Pencil className="h-4.5 w-4.5" />
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
  tone,
  label,
  value,
  coloredValue = true,
}: {
  icon: React.ReactNode;
  tone: "emerald" | "rose" | "amber" | "blue";
  label: string;
  value: number;
  coloredValue?: boolean;
}) {
  const toneMap: Record<string, { bg: string; text: string }> = {
    emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
    rose: { bg: "bg-rose-100", text: "text-rose-600" },
    amber: { bg: "bg-amber-100", text: "text-amber-500" },
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
  };
  const t = toneMap[tone];
  return (
    <div className="flex min-h-[92px] w-full items-center gap-3 overflow-hidden rounded-2xl border border-border/70 bg-white p-3.5 sm:min-h-[100px] sm:gap-4 sm:p-5">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${t.bg} ${t.text} sm:h-12 sm:w-12`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="truncate text-xs text-muted-foreground sm:text-sm">{label}</div>
        <div className={`truncate text-base font-bold leading-tight sm:text-xl md:text-2xl ${coloredValue ? t.text : "text-foreground"}`}>
          {fmtIDR(value)}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid place-items-center rounded-[20px] border-2 border-dashed border-border bg-card/50 px-6 py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted">
        <Store className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="mt-4 text-lg font-semibold">Belum ada bazar</p>
      <p className="mt-1 text-sm text-muted-foreground">Klik "Bazar Baru" untuk memulai.</p>
    </div>
  );
}

function NoResultState({ query }: { query: string }) {
  return (
    <div className="grid place-items-center rounded-[20px] border-2 border-dashed border-border bg-card/50 px-6 py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="mt-4 text-lg font-semibold">Tidak ditemukan</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Tidak ada bazar yang cocok dengan "{query}".
      </p>
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
      <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={startDelete}>
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
