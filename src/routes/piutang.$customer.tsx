import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, Upload, CalendarDays, Wallet, CheckCircle2, Store, User } from "lucide-react";
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

export const Route = createFileRoute("/piutang/$customer")({
  component: CustomerDetail,
});

const AVATAR_COLORS = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-teal-500",
  "bg-orange-500",
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

  const sales = db.sales
    .filter((s) => s.customer === customer && saleOutstanding(db, s.id) > 0)
    .sort((a, b) => a.createdAt - b.createdAt);

  const totalOut = sales.reduce((s, x) => s + saleOutstanding(db, x.id), 0);
  const bazarName = (id: string) => db.bazars.find((b) => b.id === id)?.name || "?";
  const initial = customer.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="space-y-4 pb-6">
      {/* Back link */}
      <Link to="/piutang" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" /> Daftar Piutang
      </Link>

      {/* Header hijau */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-5 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className={`grid h-16 w-16 place-items-center rounded-full text-2xl font-black text-white shadow-inner ${avatarColor(customer)} ring-4 ring-white/30`}>
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-wide text-emerald-100/90">Detail Piutang</div>
            <div className="truncate text-xl font-black">{customer}</div>
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
          <div className="text-[11px] uppercase tracking-wide text-emerald-100/90">Total Piutang</div>
          <div className="text-2xl font-black">{fmtIDR(totalOut)}</div>
          <div className="text-[11px] text-emerald-100/80 mt-0.5">{sales.length} transaksi belum lunas</div>
        </div>
      </div>

      {/* List sale */}
      {sales.length === 0 ? (
        <p className="rounded-2xl border bg-white p-6 text-center text-sm text-slate-500">Tidak ada piutang aktif.</p>
      ) : (
        <div className="grid gap-3">
          {sales.map((s) => {
            const out = saleOutstanding(db, s.id);
            const paidSoFar = salePaidTotal(db, s.id);
            const payments = db.payments.filter((p) => p.saleId === s.id).sort((a, b) => a.date - b.date);
            const progress = s.total > 0 ? Math.min(100, Math.round((paidSoFar / s.total) * 100)) : 0;
            return (
              <div key={s.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
                {/* Header sale: bazar + tanggal */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                    <Store className="h-3.5 w-3.5" /> {bazarName(s.bazarId)}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5" /> {fmtDateTime(s.createdAt)}
                  </div>
                </div>

                {/* Items */}
                <div className="mt-3 space-y-1.5">
                  {s.items.map((i, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span className="flex-1 truncate text-slate-700">{i.name} <span className="text-slate-400">×{i.qty}</span></span>
                      <span className="shrink-0 font-bold text-slate-700">{fmtIDR(i.price * i.qty)}</span>
                    </div>
                  ))}
                </div>

                {/* Total Belanja / Sudah Dibayar */}
                <div className="mt-3 space-y-1 rounded-xl bg-slate-50 p-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Belanja</span>
                    <span className="font-bold text-slate-800">{fmtIDR(s.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sudah Dibayar</span>
                    <span className="font-bold text-emerald-600">{fmtIDR(paidSoFar)}</span>
                  </div>
                </div>

                {/* Bar sisa piutang */}
                <div className="mt-3 rounded-xl bg-amber-50 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-700">Sisa Piutang</span>
                    <span className="text-sm font-black text-amber-700">{fmtIDR(out)}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-amber-100">
                    <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="mt-1 text-[10px] font-semibold text-amber-700/80">Progress {progress}%</div>
                </div>

                {/* Riwayat pembayaran */}
                {payments.length > 0 && (
                  <div className="mt-3">
                    <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Riwayat Pembayaran</div>
                    <div className="mt-2 space-y-1.5">
                      {payments.map((p) => (
                        <div key={p.id} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-white px-2.5 py-1.5 text-xs">
                          <div className="grid h-6 w-6 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                            <Wallet className="h-3 w-3" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-semibold text-slate-700">{fmtIDR(p.amount)} · {p.method === "cash" ? "Cash" : "Transfer"}</div>
                            <div className="truncate text-[10px] text-slate-400">{fmtDateTime(p.date)}</div>
                          </div>
                          {p.proof && <a href={p.proof} target="_blank" rel="noreferrer"><img src={p.proof} alt="bukti" className="h-8 w-8 rounded object-cover" /></a>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tombol bayar */}
                {isAdmin && (
                  <div className="mt-4">
                    <BayarDialog saleId={s.id} bazarName={bazarName(s.bazarId)} menuSummary={s.items.map((i) => `${i.name}×${i.qty}`).join(", ")} max={out} customer={customer} bazarId={s.bazarId} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
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
        <Button size="lg" className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md">
          <Wallet className="h-4 w-4 mr-2" /> Bayar / Cicil
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader><DialogTitle>Pembayaran Piutang</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="rounded-lg bg-slate-50 p-3 text-sm">
            <div><b>{customer}</b></div>
            <div className="text-slate-500">{bazarName} — {menuSummary}</div>
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
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0])} />
                {proof && <img src={proof} alt="bukti" className="h-12 w-12 rounded border object-cover" />}
              </div>
            </div>
          )}
          <DialogFooter><Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Simpan Pembayaran</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
