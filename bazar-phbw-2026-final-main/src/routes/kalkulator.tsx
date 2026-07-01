import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fmtIDR } from "@/lib/storage";

export const Route = createFileRoute("/kalkulator")({
  component: KalkulatorPage,
});

type Row = { id: string; name: string; price: string; cost: string; qty: string };
const rid = () => Math.random().toString(36).slice(2, 9);

function KalkulatorPage() {
  const [rows, setRows] = useState<Row[]>([{ id: rid(), name: "", price: "", cost: "", qty: "" }]);

  const totalPendapatan = rows.reduce((s, r) => s + (+r.price || 0) * (+r.qty || 0), 0);
  const totalModal = rows.reduce((s, r) => s + (+r.cost || 0) * (+r.qty || 0), 0);
  const totalUntung = totalPendapatan - totalModal;

  const update = (id: string, k: keyof Row, v: string) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [k]: v } : r)));

  return (
    <div className="space-y-5">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>
      <div>
        <h2 className="text-2xl font-bold">Kalkulator Keuntungan</h2>
        <p className="text-sm text-muted-foreground">Simulasi ekspektasi keuntungan bazar berikutnya.</p>
      </div>

      <div className="space-y-2">
        {rows.map((r, idx) => {
          const subPendapatan = (+r.price || 0) * (+r.qty || 0);
          const subModal = (+r.cost || 0) * (+r.qty || 0);
          const subUntung = subPendapatan - subModal;
          return (
            <div key={r.id} className="rounded-2xl border bg-card p-3">
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Menu #{idx + 1}</Label>
                {rows.length > 1 && (
                  <Button size="icon" variant="ghost" className="text-destructive"
                    onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Input placeholder="Nama menu" value={r.name} onChange={(e) => update(r.id, "name", e.target.value)} />
              <div className="mt-2 grid grid-cols-3 gap-2">
                <Input placeholder="Harga jual" inputMode="numeric" value={r.price}
                  onChange={(e) => update(r.id, "price", e.target.value.replace(/[^\d]/g, ""))} />
                <Input placeholder="Harga modal" inputMode="numeric" value={r.cost}
                  onChange={(e) => update(r.id, "cost", e.target.value.replace(/[^\d]/g, ""))} />
                <Input placeholder="Porsi" inputMode="numeric" value={r.qty}
                  onChange={(e) => update(r.id, "qty", e.target.value.replace(/[^\d]/g, ""))} />
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-right text-xs">
                <div className="text-muted-foreground">Omzet<br/><b className="text-foreground">{fmtIDR(subPendapatan)}</b></div>
                <div className="text-muted-foreground">Modal<br/><b className="text-destructive">{fmtIDR(subModal)}</b></div>
                <div className="text-muted-foreground">Untung<br/><b className="text-primary">{fmtIDR(subUntung)}</b></div>
              </div>
            </div>
          );
        })}
      </div>

      <Button variant="outline" className="w-full"
        onClick={() => setRows((rs) => [...rs, { id: rid(), name: "", price: "", cost: "", qty: "" }])}>
        <Plus className="h-4 w-4" /> Tambah Menu
      </Button>

      <div className="sticky bottom-4 space-y-2 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 p-5 text-white shadow-lg">
        <div className="flex items-center justify-between text-sm opacity-90">
          <span>Total Omzet</span><span>{fmtIDR(totalPendapatan)}</span>
        </div>
        <div className="flex items-center justify-between text-sm opacity-90">
          <span>Total Modal</span><span>{fmtIDR(totalModal)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-white/20 pt-2">
          <span className="text-xs uppercase tracking-wider opacity-90">Ekspektasi Keuntungan</span>
          <span className="text-2xl font-bold">{fmtIDR(totalUntung)}</span>
        </div>
      </div>
    </div>
  );
}
