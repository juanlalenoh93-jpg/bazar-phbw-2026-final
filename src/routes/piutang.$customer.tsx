import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { useDB, setDB, uid, fmtIDR, fmtDateTime, saleOutstanding, salePaidTotal, type PiutangPayment } from "@/lib/storage";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/piutang/$customer")({
  component: CustomerDetail,
});

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

  return (
    <div className="space-y-5">
      <Link to="/piutang" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Daftar Piutang
      </Link>

      <div>
        <h2 className="text-2xl font-bold">{customer}</h2>
        <p className="text-sm">Total piutang: <b className="text-warning">{fmtIDR(totalOut)}</b></p>
      </div>

      {sales.length === 0 ? (
        <p className="rounded-xl border bg-card p-6 text-center text-muted-foreground">Tidak ada piutang aktif.</p>
      ) : (
        <div className="grid gap-3">
          {sales.map((s) => {
            const out = saleOutstanding(db, s.id);
            const paidSoFar = salePaidTotal(db, s.id);
            return (
              <div key={s.id} className="rounded-2xl border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge variant="secondary">{bazarName(s.bazarId)}</Badge>
                    <div className="mt-1 text-xs text-muted-foreground">{fmtDateTime(s.createdAt)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Sisa</div>
                    <div className="font-bold text-warning">{fmtIDR(out)}</div>
                  </div>
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  {s.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between rounded bg-muted/50 px-2 py-1">
                      <span>{i.name} × {i.qty}</span>
                      <span>{fmtIDR(i.price * i.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Total {fmtIDR(s.total)} · Sudah dibayar {fmtIDR(paidSoFar)}
                </div>
                {isAdmin && <div className="mt-3">
                  <BayarDialog saleId={s.id} bazarName={bazarName(s.bazarId)} menuSummary={s.items.map((i) => `${i.name}×${i.qty}`).join(", ")} max={out} customer={customer} bazarId={s.bazarId} />
                </div>}
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
    setDB((d) => {
      d.payments.push(newPayment);
    });
    toast.success("Pembayaran tercatat");
    setOpen(false); setAmount(""); setProof(undefined); setMethod("cash");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full">Bayar / Cicil</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Pembayaran Piutang</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <div><b>{customer}</b></div>
            <div className="text-muted-foreground">{bazarName} — {menuSummary}</div>
            <div className="mt-1">Sisa: <b className="text-warning">{fmtIDR(max)}</b></div>
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
