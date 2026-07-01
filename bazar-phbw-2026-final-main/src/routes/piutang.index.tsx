import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Pencil, ChevronRight, Search, SlidersHorizontal, BarChart3, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDB, fmtIDR, saleOutstanding } from "@/lib/storage";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { shareToWhatsApp } from "@/lib/utils";

export const Route = createFileRoute("/piutang/")({
  component: PiutangList,
});

const TEMPLATE_KEY = "phbw-wa-piutang-template-v1";
const DEFAULT_TEMPLATE =
  "*Rekap Piutang Bazar PHBW 2026*\n\n{LIST}\n\nTotal: {TOTAL}\n\nMohon segera dilunasi ya 🙏\nTerima kasih — Tuhan Memberkati.";

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

function PiutangList() {
  const db = useDB();
  const { isAdmin } = useAuth();
  const [editingTpl, setEditingTpl] = useState(false);
  const [showFormat, setShowFormat] = useState(false);
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [q, setQ] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(TEMPLATE_KEY);
    if (saved) setTemplate(saved);
  }, []);

  const { list, totalAll } = useMemo(() => {
    const map = new Map<string, number>();
    const firstInput = new Map<string, number>();
    for (const s of db.sales) {
      const out = saleOutstanding(db, s.id);
      if (out > 0) {
        map.set(s.customer, (map.get(s.customer) || 0) + out);
        firstInput.set(s.customer, Math.min(firstInput.get(s.customer) || s.createdAt, s.createdAt));
      }
    }
    const list = [...map.entries()].sort((a, b) => (firstInput.get(a[0]) || 0) - (firstInput.get(b[0]) || 0));
    const totalAll = list.reduce((s, [, v]) => s + v, 0);
    return { list, totalAll };
  }, [db]);

  const filtered = useMemo(
    () => list.filter(([c]) => c.toLowerCase().includes(q.trim().toLowerCase())),
    [list, q],
  );

  const buildMessage = () => {
    const lines = list.map(([c, v], i) => `${i + 1}. ${c}: ${fmtIDR(v)}`).join("\n");
    return template.replace(/\{LIST\}/g, lines).replace(/\{TOTAL\}/g, fmtIDR(totalAll));
  };

  const sendWA = async () => {
    if (list.length === 0) return;
    const result = await shareToWhatsApp(buildMessage());
    if (!result.opened) {
      if (result.copied) toast.info("Pop-up WhatsApp diblokir. Teks rekap sudah disalin.");
      else toast.error("Gagal membuka WhatsApp.");
    }
  };

  const saveTemplate = () => {
    localStorage.setItem(TEMPLATE_KEY, template);
    setEditingTpl(false);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <Link to="/" className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h2 className="text-2xl font-bold">Daftar Piutang</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Akumulasi piutang per customer dari seluruh bazar.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowFormat((v) => !v)}
          className="mt-8 grid h-10 w-10 place-items-center rounded-full border bg-card text-muted-foreground hover:border-primary hover:text-foreground"
          aria-label="Filter"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* WA Card */}
      {isAdmin && list.length > 0 && (
        <button
          type="button"
          onClick={sendWA}
          className="flex w-full items-center gap-3 rounded-2xl bg-emerald-600 p-4 text-left text-white shadow-sm transition hover:bg-emerald-700"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-500/40">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-semibold leading-tight">Kirim Rekap Semua Piutang ke WA</div>
            <div className="mt-1 text-xs opacity-90">
              {list.length} customer &nbsp;·&nbsp; Total Piutang
            </div>
            <div className="text-lg font-bold leading-tight">{fmtIDR(totalAll)}</div>
          </div>
          <ChevronRight className="h-5 w-5 opacity-90" />
        </button>
      )}

      {/* Format template (collapsible) */}
      {showFormat && list.length > 0 && (
        <div className="rounded-2xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">Format Pesan WA</span>
            {isAdmin && (
              <Button size="sm" variant="ghost" onClick={() => setEditingTpl((v) => !v)} className="gap-1 text-xs">
                <Pencil className="h-3.5 w-3.5" /> {editingTpl ? "Tutup" : "Edit"}
              </Button>
            )}
          </div>
          {editingTpl ? (
            <>
              <p className="mb-2 text-xs text-muted-foreground">
                Gunakan <code className="bg-muted px-1">{"{LIST}"}</code> dan{" "}
                <code className="bg-muted px-1">{"{TOTAL}"}</code>.
              </p>
              <Textarea rows={7} value={template} onChange={(e) => setTemplate(e.target.value)} className="text-xs" />
              <div className="mt-2 flex gap-2">
                <Button size="sm" onClick={saveTemplate}>Simpan</Button>
                <Button size="sm" variant="outline"
                  onClick={() => { setTemplate(DEFAULT_TEMPLATE); localStorage.removeItem(TEMPLATE_KEY); }}>
                  Reset
                </Button>
              </div>
            </>
          ) : (
            <pre className="whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
              {buildMessage()}
            </pre>
          )}
        </div>
      )}

      {/* Search + filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari customer..."
            className="h-11 rounded-xl pl-10"
          />
        </div>
        <button
          type="button"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border bg-card px-4 text-sm text-muted-foreground hover:border-primary hover:text-foreground"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filter
        </button>
      </div>

      {/* List */}
      {list.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border-2 border-dashed p-12 text-center">
          <Wallet className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Tidak ada piutang.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-2">
            {filtered.map(([customer, total]) => {
              const initial = customer.trim().charAt(0).toUpperCase() || "?";
              return (
                <Link
                  key={customer}
                  to="/piutang/$customer"
                  params={{ customer: encodeURIComponent(customer) }}
                  className="flex items-center gap-3 rounded-2xl border bg-card p-3 transition hover:border-emerald-500"
                >
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-base font-semibold ${avatarColor(customer)}`}>
                    {initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{customer}</div>
                    <div className="text-xs text-muted-foreground">Klik untuk lihat rincian</div>
                  </div>
                  <span className="whitespace-nowrap font-bold text-amber-600">{fmtIDR(total)}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              );
            })}
            {filtered.length === 0 && (
              <p className="rounded-2xl border bg-card p-6 text-center text-sm text-muted-foreground">
                Tidak ada customer cocok.
              </p>
            )}
          </div>

          {/* Total footer card */}
          <div className="flex items-center gap-3 rounded-2xl border bg-card p-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Total Piutang</div>
              <div className="text-xs text-muted-foreground">{list.length} customer</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{fmtIDR(totalAll)}</div>
              <div className="text-xs text-muted-foreground">Total keseluruhan</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
