import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, Upload, Store, Info, ChevronRight, DollarSign, Receipt, Utensils } from "lucide-react";
import { useDB, setDB, uid, fmtIDR, fmtDateTime, saleOutstanding, salePaidTotal, type PiutangPayment } from "@/lib/storage";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/piutang/")({
  component: CustomerDetail,
});

const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-700",
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-700",
];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function CustomerDetail() {
  const { customer: raw } = Route.useParams();
  const customer = decodeURIComponent(raw);
  const db = useDB();
  const { isAdmin } = useAuth();
  const [showHistory, setShowHistory] = useState(false);

  const sales = db.sales
    .filter((s) => s.customer === customer && saleOutstanding(db, s.id) > 0)
    .sort((a, b) => a.createdAt - b.createdAt);

  const totalOut = sales.reduce((s, x) => s + saleOutstanding(db, x.id), 0);
  const bazarName = (id: string) => db.bazars.find((b) => b.id === id)?.name || "?";
  const initial = customer.trim().charAt(0).toUpperCase() || "?";

  const payments = db.payments.filter((p) => p.customer === customer);

  return (
    <div className="-mx-4 -mt-4 pb-6 sm:mx-0 sm:mt-0">
      {/* Green header */}
      <div className="rounded-b-3xl bg-emerald-700 px-4 pb-8 pt-4 text-white sm:rounded-3xl">
        <Link to="/piutang" className="mb-3 inline-flex items-center gap-2 text-sm text-emerald-50/90 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Detail Piutang
        </Link>
        <div className="flex items-center gap-3">
          <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-bold ${avatarColor(customer)}`}>
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xl font-bold">{customer}</div>
            <div className="mt-0.5 text-xs text-emerald-50/90">Total Piutang</div>
            <div className="text-2xl font-extrabold leading-tight">{fmtIDR(totalOut)}</div>
          </div>
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10">
            <Receipt className="h-7 w-7" />
          </div>
        </div>
      </div>

      <div className="-mt-5 space-y-4 px-4 sm:px-0">
        {sales.length === 0 ? (
          <p className="rounded-2xl border bg-card p-6 text-center text-muted-foreground">
            Tidak ada piutang aktif.
          </p>
        ) : (
          sales.map((s) => {
            const out = saleOutstanding(db, s.id);
            const paidSoFar = salePaidTotal(db, s.id);
            return (
              <div key={s.id} className="space-y-3 rounded-2xl border bg-card p-4 shadow-sm">
                {/* Bazar row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{bazarName(s.bazarId)}</div>
                      <div className="text-xs text-muted-foreground">{fmtDateTime(s.createdAt)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-muted-foreground">Sisa Piutang</div>
                    <div className="font-bold text-amber-600">{fmtIDR(out)}</div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {s.items.map((i, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                        <Utensils className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-sm">
                        <span className="font-medium">{i.name}</span>{" "}
                        <span className="text-muted-foreground">× {i.qty}</span>
                      </div>
                      <div className="text-sm font-medium">{fmtIDR(i.price * i.qty)}</div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-3 text-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">Total Belanja</div>
                      <div className="font-semibold">{fmtIDR(s.total)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Sudah Dibayar</div>
                      <div className="font-semibold text-emerald-600">{fmtIDR(paidSoFar)}</div>
                    </div>
                  </div>
                </div>

                {/* Sisa highlight */}
                <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3">
                  <span className="text-sm font-medium text-amber-700">Sisa Piutang</span>
                  <span className="text-lg font-bold text-amber-600">{fmtIDR(out)}</span>
                </div>

                {/* History link */}
                <button
                  type="button"
                  onClick={() => setShowHistory((v) => !v)}
                  className="flex w-full items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-left transition hover:bg-emerald-50"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-white text-emerald-700">
                    <Info className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Riwayat Pembayaran</div>
                    <div className="text-xs text-muted-foreground">Lihat dan kelola riwayat pembayaran customer.</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>

                {showHistory && (
                  <div className="space-y-1 rounded-xl border bg-muted/30 p-3 text-xs">
                    {payments.filter((p) => p.saleId === s.id).length === 0 ? (
                      <p className="text-muted-foreground">Belum ada pembayaran.</p>
                    ) : (
                      payments.filter((p) => p.saleId === s.id).map((p) => (
                        <div key={p.id} className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            {fmtDateTime(p.date)} · {p.method}
                          </span>
                          <span className="font-medium text-emerald-700">{fmtIDR(p.amount)}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {isAdmin && (
                  <BayarDialog
                    saleId={s.id}
                    bazarName={bazarName(s.bazarId)}
                    menuSummary={s.items.map((i) => `${i.name}×${i.qty}`).join(", ")}
                    max={out}
                    customer={customer}
                    bazarId={s.bazarId}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function BayarDialog({
  saleId, bazarName, menuSummary, max, customer, bazarId,
}: {
  saleId: string; bazarName: string; menuSummary: string; max: number; customer: string; bazarId: string;
}) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"cash" | "transfer">("cash");
  const [proof, setProof] = useState<string | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (f?: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setProof(r.result as string);
    r.readAsDataURL(f);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = +amount || 0;
    if (n <= 0) return toast.error("Nominal harus > 0");
    if (n > max) return toast.error(`Maksimum cicilan ${fmtIDR(max)}`);
    if (method === "transfer" && !proof) return toast.error("Upload bukti transfer");
    const newPayment: PiutangPayment = {
      id: uid(), saleId, bazarId, customer, menuName: menuSummary,
      amount: n, method, proof, date: Date.now(),
    };
    setDB((d) => { d.payments.push(newPayment); });
    toast.success("Pembayaran tercatat");
    setOpen(false); setAmount(""); setProof(undefined); setMethod("cash");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 w-full gap-2 rounded-2xl bg-emerald-700 text-base font-semibold text-white hover:bg-emerald-800">
          <DollarSign className="h-5 w-5" /> Bayar / Cicil Piutang
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Pembayaran Piutang</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <div><b>{customer}</b></div>
            <div className="text-muted-foreground">{bazarName} — {menuSummary}</div>
            <div className="mt-1">Sisa: <b className="text-amber-600">{fmtIDR(max)}</b></div>
          </div>
          <div>
            <Label>Nominal Cicilan</Label>
            <Input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))} placeholder="0" />
          </div>
          <div>
            <Label>Metode</Label>
            <RadioGroup value={method} onValueChange={(v) => setMethod(v as "cash" | "transfer")} className="mt-2 flex gap-4">
              <label className="flex items-center gap-2"><RadioGroupItem value="cash" /> Cash</label>
              <label className="flex items-center gap-2"><RadioGroupItem value="transfer" /> Transfer</label>
            </RadioGroup>
          </div>
          {method === "transfer" && (
            <div>
              <Label>Bukti Transfer</Label>
              <div className="mt-1 flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                  <Upload className="h-4 w-4" /> {proof ? "Ganti" : "Upload / Kamera"}
                </Button>
                <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0])} />
                {proof && <img src={proof} alt="bukti" className="h-12 w-12 rounded border object-cover" />}
              </div>
            </div>
          )}
          <DialogFooter><Button type="submit">Simpan Pembayaran</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
