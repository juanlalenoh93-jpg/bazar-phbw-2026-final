import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Wallet, MessageCircle, Pencil } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDB, fmtIDR, saleOutstanding } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/piutang/")({
  component: PiutangList,
});

const TEMPLATE_KEY = "phbw-wa-piutang-template-v1";
const DEFAULT_TEMPLATE =
  "*Rekap Piutang Bazar PHBW 2026*\n\n{LIST}\n\nTotal: {TOTAL}\n\nMohon segera dilunasi ya 🙏\nTerima kasih — Tuhan Memberkati.";

function PiutangList() {
  const db = useDB();
  const [editingTpl, setEditingTpl] = useState(false);
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);

  useEffect(() => {
    const saved = localStorage.getItem(TEMPLATE_KEY);
    if (saved) setTemplate(saved);
  }, []);

  const { list, totalAll } = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of db.sales) {
      const out = saleOutstanding(db, s.id);
      if (out > 0) map.set(s.customer, (map.get(s.customer) || 0) + out);
    }
    const list = [...map.entries()].sort((a, b) => b[1] - a[1]);
    const totalAll = list.reduce((s, [, v]) => s + v, 0);
    return { list, totalAll };
  }, [db]);

  const buildMessage = () => {
    const lines = list.map(([c, v], i) => `${i + 1}. ${c}: ${fmtIDR(v)}`).join("\n");
    return template.replace(/\{LIST\}/g, lines).replace(/\{TOTAL\}/g, fmtIDR(totalAll));
  };

  const sendWA = () => {
    if (list.length === 0) return;
    const url = `https://wa.me/?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, "_blank");
  };

  const saveTemplate = () => {
    localStorage.setItem(TEMPLATE_KEY, template);
    setEditingTpl(false);
  };

  return (
    <div className="space-y-5">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>
      <div>
        <h2 className="text-2xl font-bold">Daftar Piutang</h2>
        <p className="text-sm text-muted-foreground">Akumulasi piutang per customer dari seluruh bazar.</p>
      </div>

      {list.length > 0 && (
        <>
          <Button
            onClick={sendWA}
            className="h-auto w-full justify-start gap-3 rounded-2xl bg-emerald-600 py-4 text-left text-white hover:bg-emerald-700"
          >
            <MessageCircle className="h-6 w-6 shrink-0" />
            <div className="flex-1">
              <div className="text-base font-semibold">Kirim Rekap Semua Piutang ke WA</div>
              <div className="text-xs opacity-90">
                {list.length} customer · Total {fmtIDR(totalAll)}
              </div>
            </div>
          </Button>

          <div className="rounded-2xl border bg-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold">Format Pesan WA</div>
              <Button size="sm" variant="ghost" onClick={() => setEditingTpl((v) => !v)} className="gap-1 text-xs">
                <Pencil className="h-3.5 w-3.5" /> {editingTpl ? "Tutup" : "Edit"}
              </Button>
            </div>
            {editingTpl ? (
              <>
                <p className="mb-2 text-xs text-muted-foreground">
                  Gunakan <code className="bg-muted px-1">{"{LIST}"}</code> untuk daftar piutang dan <code className="bg-muted px-1">{"{TOTAL}"}</code> untuk total.
                </p>
                <Textarea rows={7} value={template} onChange={(e) => setTemplate(e.target.value)} className="text-xs" />
                <div className="mt-2 flex gap-2">
                  <Button size="sm" onClick={saveTemplate}>Simpan</Button>
                  <Button size="sm" variant="outline" onClick={() => { setTemplate(DEFAULT_TEMPLATE); localStorage.removeItem(TEMPLATE_KEY); }}>Reset</Button>
                </div>
              </>
            ) : (
              <pre className="whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                {buildMessage()}
              </pre>
            )}
          </div>
        </>
      )}

      {list.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border-2 border-dashed p-12 text-center">
          <Wallet className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Tidak ada piutang. </p>
        </div>
      ) : (
        <div className="grid gap-2">
          {list.map(([customer, total]) => (
            <Link key={customer} to="/piutang/$customer" params={{ customer: encodeURIComponent(customer) }}
              className="flex items-center justify-between rounded-2xl border bg-card p-4 transition hover:border-primary">
              <div>
                <div className="font-semibold">{customer}</div>
                <div className="text-xs text-muted-foreground">Klik untuk rincian & bayar</div>
              </div>
              <span className="font-bold text-warning">{fmtIDR(total)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
