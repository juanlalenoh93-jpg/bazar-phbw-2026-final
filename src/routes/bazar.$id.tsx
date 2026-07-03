import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Plus, Pencil, ShoppingCart, Receipt, Printer, Upload, UserCog, CheckCircle2, Church, Search, Filter, ClipboardList, MessageCircle, Copy, Clock, Wallet, ShoppingBag } from "lucide-react";
import {
  useDB, setDB, uid, fmtIDR, fmtDate, fmtDateTime, saleOutstanding,
  allCustomersGlobal, addCustomerToMaster, menuStats, bazarMenuSummary, useLogo,
  type MenuItem, type Order, type Sale,
} from "@/lib/storage";
import { ORGANIZATION_NAME, useWorkspaceHeader } from "@/lib/branding";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PinConfirmDelete } from "./bazar.index";
import { toast } from "sonner";

export const Route = createFileRoute("/bazar/$id")({
  component: BazarDetail,
  notFoundComponent: () => <div className="p-6">Bazar tidak ditemukan.</div>,
  loader: ({ params }) => ({ id: params.id }),
});

const TAB_LIST = ["menu", "pesanan", "penjualan", "pengeluaran", "rekapan"] as const;
type TabKey = (typeof TAB_LIST)[number];

function BazarDetail() {
  const { id } = Route.useParams();
  const db = useDB();
  const logo = useLogo();
  const workspaceHeader = useWorkspaceHeader();
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState<TabKey>("menu");

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const swipeActive = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("input,textarea,select,button,[role=button],[role=checkbox]")) {
      swipeActive.current = false;
      return;
    }
    swipeActive.current = true;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!swipeActive.current) return;
    swipeActive.current = false;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < 60 || Math.abs(dx) <= Math.abs(dy) * 1.5) return;
    const idx = TAB_LIST.indexOf(tab);
    if (dx < 0 && idx < TAB_LIST.length - 1) setTab(TAB_LIST[idx + 1]);
    else if (dx > 0 && idx > 0) setTab(TAB_LIST[idx - 1]);
  }, [tab]);

  const bazar = db.bazars.find((b) => b.id === id);
  if (!bazar) {
    return (
      <div className="space-y-4">
        <Link to="/bazar" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Daftar Bazar
        </Link>
        <p className="text-muted-foreground">Bazar tidak ditemukan.</p>
      </div>
    );
  }

  const menus = useMemo(
    () => db.menus.filter((m) => m.bazarId === id).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)),
    [db.menus, id],
  );
  const orders = useMemo(
    () => db.orders.filter((o) => o.bazarId === id).sort((a, b) => a.createdAt - b.createdAt),
    [db.orders, id],
  );
  const sales = useMemo(
    () => db.sales.filter((s) => s.bazarId === id).sort((a, b) => a.createdAt - b.createdAt),
    [db.sales, id],
  );
  const expenses = useMemo(
    () => db.expenses.filter((e) => e.bazarId === id).sort((a, b) => a.createdAt - b.createdAt),
    [db.expenses, id],
  );

  return (
    <div className="space-y-5">
      <Link to="/bazar" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Daftar Bazar
      </Link>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-2xl font-bold">{bazar.name}</h2>
          <p className="text-sm text-muted-foreground">{fmtDate(new Date(bazar.date).getTime())}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-full border bg-card px-2.5 py-1.5 shadow-sm">
          <div className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border bg-primary/10 text-primary">
            {logo ? <img src={logo} alt="Logo Wilayah IV" className="h-full w-full object-cover" /> : <Church className="h-4 w-4" />}
          </div>
          <span className="text-sm font-semibold text-foreground">{workspaceHeader}</span>
        </div>
      </div>

      {!isAdmin && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          <b>Mode Viewer</b> — Anda hanya dapat melihat data. Hubungi Admin untuk melakukan perubahan.
        </div>
      )}

      <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="space-y-4">
          {/* ==========================================
              1. TABS LIST NAVIGASI (Garis Hijau Tipis Sesuai Gambar)
             ========================================== */}
          <TabsList className="flex gap-1 overflow-x-auto bg-transparent border-b border-slate-100 rounded-none h-auto p-0 scrollbar-none justify-start mb-2">
            {(["menu", "pesanan", "penjualan", "pengeluaran", "rekapan"] as const).map((k) => (
              <TabsTrigger
                key={k}
                value={k}
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#15803d] data-[state=active]:text-[#15803d] data-[state=active]:font-extrabold text-slate-400 font-bold text-xs rounded-none shadow-none px-5 py-2.5 transition-all bg-transparent border-b-2 border-transparent"
              >
                {k === "menu" ? "Menu" : k === "pesanan" ? "Pesanan" : k === "penjualan" ? "Penjualan" : k === "pengeluaran" ? "Pengeluaran" : "Rekapan"}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ==========================================
              2. TAB CONTENT MENU (Sesuai tab menu.jpg dengan 3 Kotak Atas)
             ========================================== */}
          <TabsContent value="menu" className="space-y-4">
            {/* 3 Kotak Ringkasan Statistik Atas */}
            <div className="grid grid-cols-3 gap-3 my-2">
              <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <div className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">Total Pesanan</div>
                <div className="text-lg font-black text-slate-800 mt-1">
                  {orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0)} pcs
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <div className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">Total Terjual</div>
                <div className="text-lg font-black text-[#15803d] mt-1">
                  {sales.reduce((sum, s) => sum + s.items.reduce((s, i) => s + i.qty, 0), 0)} pcs
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <div className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">Belum Diambil</div>
                <div className="text-lg font-black text-amber-600 mt-1">
                  {Math.max(
                    0,
                    orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0) -
                      sales.reduce((sum, s) => sum + s.items.reduce((s, i) => s + i.qty, 0), 0)
                  )} pcs
                </div>
              </div>
            </div>

            <MenuTab bazarId={id} menus={menus} isAdmin={isAdmin} />
          </TabsContent>

          {/* ==========================================
              3. TAB CONTENT LAINNYA (Tetap Mengakses Sub-Tab Anda)
             ========================================== */}
          <TabsContent value="pesanan">
            <PesananTab bazarId={id} menus={menus} orders={orders} isAdmin={isAdmin} />
          </TabsContent>
          <TabsContent value="penjualan">
            <PenjualanTab sales={sales} bazarName={bazar.name} isAdmin={isAdmin} />
          </TabsContent>
          <TabsContent value="pengeluaran">
            <PengeluaranTab bazarId={id} expenses={expenses} isAdmin={isAdmin} />
          </TabsContent>
          <TabsContent value="rekapan">
            <RekapanTab bazarId={id} bazarName={bazar.name} bazarDate={bazar.date} />
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
}
/* ============ MENU TAB ============ */
function MenuTab({ bazarId, menus, isAdmin }: { bazarId: string; menus: MenuItem[]; isAdmin: boolean }) {
  const db = useDB();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const reset = () => { setEditId(null); setName(""); setPrice(""); };
  const openEdit = (m: MenuItem) => { setEditId(m.id); setName(m.name); setPrice(String(m.price)); setOpen(true); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Nama menu wajib");
    if (saving) return;
    setSaving(true);
    const newMenu: MenuItem = { id: uid(), bazarId, name: name.trim(), price: +price || 0, cost: 0, qty: 0, createdAt: Date.now() };
    setDB((d) => {
      if (editId) {
        const m = d.menus.find((x) => x.id === editId);
        if (m) { m.name = name.trim(); m.price = +price || 0; }
      } else {
        d.menus.push(newMenu);
      }
    });
    toast.success("Tersimpan");
    setOpen(false); reset();
    setSaving(false);
  };

  const filteredMenus = useMemo(
    () => menus.filter((m) => m.name.toLowerCase().includes(search.trim().toLowerCase())),
    [menus, search],
  );

  const summary = useMemo(() => bazarMenuSummary(db, bazarId), [db, bazarId]);

  return (
    <div className="space-y-4">
      {/* 1. KOTAK RINGKASAN ATAS */}
      {menus.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">Total Pesanan</div>
            <div className="text-lg font-black text-slate-800 mt-1">{summary.pesanan} pcs</div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">Total Terjual</div>
            <div className="text-lg font-black text-[#15803d] mt-1">{summary.terjual} pcs</div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">Belum Diambil</div>
            <div className="text-lg font-black text-amber-600 mt-1">{summary.belumDiambil} pcs</div>
          </div>
        </div>
      )}

      {/* 2. PENCARIAN & TOMBOL TAMBAH */}
      <div className="flex items-center gap-2">
        {menus.length > 0 && (
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari menu..."
              className="pl-9 h-10 rounded-xl border-slate-200 text-xs bg-white"
            />
          </div>
        )}
        
        {isAdmin && (
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-10 gap-1 text-xs rounded-xl border-[#15803d] text-[#15803d] bg-white hover:bg-slate-50 shadow-sm font-bold px-4">
                <Plus className="h-4 w-4" /> Menu Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader><DialogTitle className="text-sm font-bold">{editId ? "Edit" : "Tambah"} Menu</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-3 py-2">
                <div>
                  <Label className="text-xs">Nama Menu</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl mt-1 text-xs" />
                </div>
                <div>
                  <Label className="text-xs">Harga Jual</Label>
                  <Input inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))} className="rounded-xl mt-1 text-xs" />
                </div>
                <DialogFooter>
                  <Button type="submit" size="sm" disabled={saving} className="rounded-xl bg-[#15803d] hover:bg-[#116631] text-white text-xs">Simpan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* 3. DAFTAR MENU */}
      {menus.length === 0 ? <Empty text="Belum ada menu untuk bazar ini." /> : filteredMenus.length === 0 ? <Empty text="Tidak ada menu dengan nama itu." /> : (
        <div className="grid gap-3">
          {filteredMenus.map((m) => {
            const stat = menuStats(db, m.id);
            return (
              <div key={m.id} className="p-3 border border-slate-100 rounded-2xl shadow-sm bg-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <span className="text-xl">🍲</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 truncate">{m.name}</h3>
                    <p className="text-xs font-extrabold text-[#15803d] mt-0.5">{fmtIDR(m.price)}</p>
                    
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md w-max">
                      <span>Pesan: <strong className="text-slate-700">{stat.pesanan}</strong></span>
                      <span>•</span>
                      <span>Jual: <strong className="text-[#15803d]">{stat.terjual}</strong></span>
                      <span>•</span>
                      <span>Sisa: <strong className="text-amber-600">{stat.belumDiambil}</strong></span>
                    </div>
                  </div>
                </div>
                
                {isAdmin && (
                  <div className="flex shrink-0 items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 rounded-xl hover:text-slate-600" onClick={() => openEdit(m)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <PinConfirmDelete label={m.name} requirePin={stat.pesanan > 0 || stat.terjual > 0} onConfirm={() => { setDB((d) => { d.menus = d.menus.filter((x) => x.id !== m.id); }); toast.success("Menu dihapus"); }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

function MenuStatItem({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone?: "good" | "warn" }) {
  const cls = tone === "good" ? "text-emerald-700" : tone === "warn" ? "text-amber-600" : "text-foreground";
  return (
    <div>
      <div className={`flex items-center justify-center gap-1 text-[11px] text-muted-foreground`}>{icon} {label}</div>
      <div className={`text-base font-bold ${cls}`}>{value}</div>
    </div>
  );
}

function SummaryStat({ label, value, tone }: { label: string; value: number; tone?: "good" | "warn" }) {
  const cls = tone === "good" ? "text-emerald-700" : tone === "warn" ? "text-amber-600" : "text-foreground";
  return (
    <div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={`text-base font-bold ${cls}`}>{value}</div>
    </div>
  );
}

/* ============ PESANAN TAB ============ */
type StatusFilter = "all" | "unprocessed" | "partial" | "sold";

function PesananTab({ bazarId, menus, orders, isAdmin }: { bazarId: string; menus: MenuItem[]; orders: Order[]; isAdmin: boolean }) {
  const db = useDB();
  const customerNames = allCustomersGlobal(db);
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [searchCustomer, setSearchCustomer] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [saving, setSaving] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const nameMatch = o.customer.toLowerCase().includes(searchCustomer.trim().toLowerCase());
      if (!nameMatch) return false;
      if (statusFilter === "all") return true;
      const status = orderStatusInfo(db, o);
      if (statusFilter === "unprocessed") return !status.fullSold && !status.partialSold;
      if (statusFilter === "partial") return status.partialSold;
      if (statusFilter === "sold") return status.fullSold;
      return true;
    });
  }, [orders, searchCustomer, statusFilter, db]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const trimmed = customer.trim();
    if (!trimmed) return toast.error("Nama customer wajib");
    const items = Object.entries(picks)
      .map(([menuId, q]) => ({ menuId, qty: +q || 0 }))
      .filter((i) => i.qty > 0);
    if (items.length === 0) return toast.error("Pilih minimal 1 menu");
    const dup = db.orders.some((o) =>
      o.bazarId === bazarId && !o.soldAt && o.items.some((i) => i.qty > 0)
      && o.customer.trim().toLowerCase() === trimmed.toLowerCase());
    if (dup) {
      const ok = window.confirm("Customer ini sudah melakukan pesanan, apakah anda yakin mau membuat pesanan baru?");
      if (!ok) return;
    }
    setSaving(true);
    const newOrder: Order = { id: uid(), bazarId, customer: trimmed, items, createdAt: Date.now() };
    setDB((d) => { d.orders.push(newOrder); });
    addCustomerToMaster(trimmed);
    toast.success("Pesanan ditambahkan");
    setOpen(false); setCustomer(""); setPicks({});
    setSaving(false);
  };

  const filterButtons: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "unprocessed", label: "Belum di proses" },
    { key: "partial", label: "Sebagian Terjual" },
    { key: "sold", label: "Terjual" },
  ];

  return (
    <div className="space-y-4">
      {/* 1. TOMBOL PESANAN BARU (Hanya Admin) */}
      {isAdmin && (
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" disabled={menus.length === 0} className="h-10 gap-1.5 rounded-xl border-[#15803d] px-4 py-2 text-xs font-bold text-[#15803d] bg-white hover:bg-slate-50 shadow-sm">
                <Plus className="h-4 w-4" /> Pesanan Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader><DialogTitle className="text-sm font-bold">Tambah Pesanan</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-3 py-2">
                <div>
                  <Label className="text-xs">Nama Customer</Label>
                  <Input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Ketik nama..." autoComplete="off" className="rounded-xl mt-1 text-xs" />
                  {customerNames.length > 0 && (
                    <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                      value="" onChange={(e) => { if (e.target.value) setCustomer(e.target.value); }}>
                      <option value="">Pilih Customer</option>
                      {customerNames.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  )}
                </div>
                <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                  <Label className="text-xs">Menu & Qty Pesan</Label>
                  {menus.map((m) => (
                    <div key={m.id} className="rounded-xl border border-slate-100 p-2 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 text-xs min-w-0">
                          <div className="font-bold truncate text-slate-800">{m.name}</div>
                          <div className="text-[10px] text-slate-500">{fmtIDR(m.price)}</div>
                        </div>
                        <Input className="w-16 h-8 text-xs rounded-lg border-slate-200" inputMode="numeric" placeholder="0" value={picks[m.id] || ""}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^\d]/g, "");
                            const num = +raw || 0;
                            setPicks((p) => ({ ...p, [m.id]: num ? String(num) : "" }));
                          }} />
                      </div>
                    </div>
                  ))}
                </div>
                <DialogFooter><Button type="submit" disabled={saving} className="rounded-xl bg-[#15803d] hover:bg-[#116631] text-xs w-full text-white">Simpan Pesanan</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* 2. PENCARIAN & FILTER */}
      {menus.length > 0 && orders.length > 0 && (
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
                placeholder="Cari nama customer..."
                className="h-10 rounded-xl pl-9 bg-white border-slate-200 text-xs"
              />
            </div>
            <button type="button" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-600 shadow-sm" aria-label="Filter">
              <Filter className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filterButtons.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setStatusFilter(key)}
                className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-[10px] font-bold transition-colors ${statusFilter === key ? "border-[#15803d] bg-[#15803d] text-white shadow-sm" : "border-slate-200 bg-white text-slate-500 hover:border-[#15803d] hover:text-slate-700"}`}
              >
                {key !== "all" && <Filter className="h-3 w-3" />}
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. KONDISI KOSONG */}
      {menus.length === 0 && <Empty text="Tambahkan menu terlebih dahulu di tab Menu." />}
      {menus.length > 0 && orders.length === 0 && <Empty text="Belum ada pesanan." />}
      {menus.length > 0 && orders.length > 0 && filteredOrders.length === 0 && <Empty text="Tidak ada pesanan yang sesuai filter." />}
      
      {/* 4. DAFTAR KARTU PESANAN */}
      <div className="grid gap-3">
        {filteredOrders.map((o) => <OrderCard key={o.id} order={o} menus={menus} bazarId={bazarId} isAdmin={isAdmin} />)}
      </div>
    </div>
  );

function orderSoldQtyByMenu(db: ReturnType<typeof useDB>, orderId: string): Record<string, number> {
  const sold: Record<string, number> = {};
  for (const sale of db.sales.filter((item) => item.orderId === orderId)) {
    for (const item of sale.items) {
      sold[item.menuId] = (sold[item.menuId] || 0) + item.qty;
    }
  }
  return sold;
}

function orderDisplayItems(db: ReturnType<typeof useDB>, order: Order, menus: MenuItem[]) {
  const sold = orderSoldQtyByMenu(db, order.id);
  const ids = new Set<string>();
  order.items.forEach((item) => ids.add(item.menuId));
  Object.keys(sold).forEach((id) => ids.add(id));

  return Array.from(ids).map((menuId) => {
    const remainingQty = order.items.find((item) => item.menuId === menuId)?.qty || 0;
    const soldQty = sold[menuId] || 0;
    const originalQty = remainingQty + soldQty;
    const menu = menus.find((m) => m.id === menuId);
    const saleItem = db.sales.flatMap((sale) => sale.items).find((item) => item.menuId === menuId);
    return {
      menuId,
      name: menu?.name || saleItem?.name || "?",
      price: menu?.price || saleItem?.price || 0,
      remainingQty,
      soldQty,
      originalQty,
    };
  }).filter((item) => item.originalQty > 0);
}

function orderStatusInfo(db: ReturnType<typeof useDB>, order: Order) {
  const soldQty = db.sales
    .filter((sale) => sale.orderId === order.id)
    .flatMap((sale) => sale.items)
    .reduce((sum, item) => sum + item.qty, 0);
  const remainingQty = order.items.reduce((sum, item) => sum + item.qty, 0);

  if (soldQty === 0) return { label: "Belum di proses", fullSold: false, partialSold: false };
  if (remainingQty === 0) return { label: "Terjual", fullSold: true, partialSold: false };
  return { label: "Sebagian Terjual", fullSold: false, partialSold: true };
}

function OrderCard({ order, menus, bazarId, isAdmin }: { order: Order; menus: MenuItem[]; bazarId: string; isAdmin: boolean }) {
  const db = useDB();
  const displayItems = useMemo(() => orderDisplayItems(db, order, menus), [db, order, menus]);
  const status = useMemo(() => orderStatusInfo(db, order), [db, order]);
  const totalItem = displayItems.reduce((s, i) => s + i.originalQty, 0);
  const totalPesanan = displayItems.reduce((s, i) => s + i.price * i.originalQty, 0);
  const initial = order.customer.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="p-4 border border-slate-100 rounded-2xl shadow-sm bg-white">
      {/* Baris Atas: Tanggal & Badge Status */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-50 pb-2 mb-3">
        <span className="text-[10px] font-bold text-slate-400">{fmtDateTime(order.createdAt)}</span>
        <Badge className={`rounded-full text-[10px] px-2.5 py-0.5 border-none font-bold shadow-none uppercase tracking-wide ${
          status.fullSold ? "bg-emerald-50 text-[#15803d]" : status.partialSold ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"
        }`}>
          {status.label}
        </Badge>
      </div>

      {/* Baris Tengah: Nama Pembeli */}
      <div className="flex items-center gap-3 text-slate-900 font-black text-sm">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-50 border border-slate-100 text-slate-500 shrink-0">
          {/* Pastikan icon User dari lucide-react sudah di-import di atas ya */}
          <User className="h-4 w-4" />
        </div>
        <span className="truncate">{order.customer}</span>
      </div>

      {/* Baris Bawah: List Menu Menjorok */}
      <div className="mt-3 space-y-1.5 pl-4 border-l-2 border-slate-100 ml-4">
        {displayItems.map((i) => (
          <div key={i.menuId} className="text-xs font-medium flex justify-between items-center gap-2">
            <span className="truncate text-slate-500">{i.name}</span>
            <span className="font-bold text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded-md shrink-0">x{i.originalQty}</span>
          </div>
        ))}
      </div>

      {/* Tombol Aksi Bawaan */}
      {isAdmin && (
        <div className="mt-4 pt-3 border-t border-slate-50 flex flex-wrap gap-2 justify-end">
          {db.sales.some((sale) => sale.orderId === order.id) ? (
            <PinConfirmDelete
              label="pesanan"
              requirePin={false}
              canDelete={() => {
                toast.error("Pesanan ini sudah memiliki riwayat penjualan.");
                return false;
              }}
              onConfirm={() => {}}
            />
          ) : (
            <>
              <JualDialog order={order} menus={menus} bazarId={bazarId} />
              <EditOrderDialog order={order} menus={menus} />
              <GantiCustomerDialog order={order} menus={menus} />
              <PinConfirmDelete
                label="pesanan"
                requirePin
                onConfirm={() => {
                  setDB((d) => {
                    d.orders = d.orders.filter((x) => x.id !== order.id);
                  });
                  toast.success("Pesanan dihapus");
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function EditOrderDialog({ order, menus }: { order: Order; menus: MenuItem[] }) {
  const db = useDB();
  const [open, setOpen] = useState(false);
  const [picks, setPicks] = useState<Record<string, string>>(() =>
    Object.fromEntries(order.items.map((i) => [i.menuId, String(i.qty)])),
  );
  const [saving, setSaving] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const items = menus.map((m) => ({ menuId: m.id, qty: +(picks[m.id] || 0) || 0 })).filter((i) => i.qty > 0);
    if (items.length === 0) return toast.error("Minimal 1 menu");
    setSaving(true);
    setDB((d) => { const o = d.orders.find((x) => x.id === order.id); if (o) o.items = items; });
    toast.success("Pesanan diperbarui");
    setOpen(false);
    setSaving(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm" variant="outline" className="h-10 gap-1.5 rounded-xl px-3.5"><Pencil className="h-4 w-4" /> Edit</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Pesanan — {order.customer}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-2">
            {menus.map((m) => {
              return (
                <div key={m.id} className="rounded-lg border p-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 text-sm min-w-0">
                      <div className="font-medium truncate">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{fmtIDR(m.price)}</div>
                    </div>
                    <Input className="w-20" inputMode="numeric" placeholder="0" value={picks[m.id] || ""}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^\d]/g, "");
                        const num = +raw || 0;
                        setPicks((p) => ({ ...p, [m.id]: num ? String(num) : "" }));
                      }} />
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter><Button type="submit" disabled={saving}>Simpan</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ============ JUAL DIALOG ============ */
function JualDialog({ order, menus, bazarId }: { order: Order; menus: MenuItem[]; bazarId: string }) {
  const db = useDB();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [qtys, setQtys] = useState<Record<string, string>>({});
  const [method, setMethod] = useState<"cash" | "transfer">("cash");
  const [paid, setPaid] = useState("");
  const [note, setNote] = useState("");
  const [proof, setProof] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const menuOf = useCallback((id: string) => menus.find((m) => m.id === id), [menus]);

  const selectedItems = useMemo(() =>
    order.items.filter((i) => i.qty > 0 && checked[i.menuId])
      .map((i) => ({ ...i, takeQty: Math.min(+(qtys[i.menuId] || i.qty) || 0, i.qty) }))
      .filter((i) => i.takeQty > 0),
    [order, checked, qtys]);

  const total = useMemo(() =>
    selectedItems.reduce((s, i) => s + i.takeQty * (menuOf(i.menuId)?.price || 0), 0),
    [selectedItems, menuOf]);

  const onFile = (f?: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setProof(r.result as string);
    r.readAsDataURL(f);
  };

  const reset = () => { setChecked({}); setQtys({}); setMethod("cash"); setPaid(""); setNote(""); setProof(undefined); setSaving(false); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (selectedItems.length === 0) return toast.error("Centang minimal 1 menu");
    const paidNum = +paid || 0;
    if (paidNum > total) return toast.error("Nominal bayar > total");
    if (method === "transfer" && paidNum > 0 && !proof) return toast.error("Upload bukti transfer dahulu");

    setSaving(true);
    const saleItems = selectedItems.map((i) => {
      const m = menuOf(i.menuId)!;
      return { menuId: i.menuId, name: m.name, price: m.price, cost: m.cost || 0, qty: i.takeQty };
    });

    const newSale: Sale = {
      id: uid(), bazarId, orderId: order.id, customer: order.customer,
      items: saleItems, total, method, paid: paidNum, proof, createdAt: Date.now(),
      note: note.trim() || order.note || undefined,
    };

    setDB((d) => {
      const o = d.orders.find((x) => x.id === order.id);
      if (o) {
        for (const it of selectedItems) {
          const oi = o.items.find((x) => x.menuId === it.menuId);
          if (oi) oi.qty = Math.max(0, oi.qty - it.takeQty);
        }
        const remaining = o.items.reduce((s, x) => s + x.qty, 0);
        if (remaining === 0) { o.soldAt = Date.now(); o.saleId = newSale.id; }
      }
      d.sales.push(newSale);
    });
    addCustomerToMaster(order.customer);
    toast.success(paidNum >= total ? "Penjualan LUNAS tersimpan" : paidNum > 0 ? "Pembayaran sebagian tersimpan" : "Tercatat sebagai PIUTANG");
    setOpen(false); reset();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild><Button size="sm" className="h-10 gap-1.5 rounded-xl bg-emerald-600 px-3.5 text-white hover:bg-emerald-700"><ShoppingCart className="h-4 w-4" /> Jual</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Penjualan — {order.customer}</DialogTitle>
          <DialogDescription>Centang menu yang diambil & atur Qty parsial. Sisa pesanan tetap aktif.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-2 rounded-lg border p-2">
            {order.items.filter((i) => i.qty > 0).map((i) => {
              const m = menuOf(i.menuId);
              const isChecked = !!checked[i.menuId];
              const cur = +(qtys[i.menuId] || (isChecked ? i.qty : 0));
              return (
                <div key={i.menuId} className="flex items-center gap-2">
                  <Checkbox checked={isChecked} onCheckedChange={(v) => {
                    setChecked((p) => ({ ...p, [i.menuId]: !!v }));
                    if (v && !qtys[i.menuId]) setQtys((p) => ({ ...p, [i.menuId]: String(i.qty) }));
                  }} />
                  <div className="flex-1 text-sm min-w-0">
                    <div className="font-medium truncate">{m?.name}</div>
                    <div className="text-xs text-muted-foreground">{fmtIDR(m?.price || 0)} · Sisa pesanan {i.qty}</div>
                  </div>
                  <Input className="w-16" inputMode="numeric" disabled={!isChecked} value={qtys[i.menuId] || ""}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d]/g, "");
                      const num = Math.min(+raw || 0, i.qty);
                      setQtys((p) => ({ ...p, [i.menuId]: num ? String(num) : "" }));
                    }} />
                  <span className="w-20 text-right text-xs text-muted-foreground">{fmtIDR((m?.price || 0) * (isChecked ? cur : 0))}</span>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm flex justify-between">
            <span>Total Tagihan</span><b>{fmtIDR(total)}</b>
          </div>

          <div>
            <Label>Metode Pembayaran</Label>
            <RadioGroup value={method} onValueChange={(v) => setMethod(v as "cash" | "transfer")} className="mt-2 flex gap-4">
              <label className="flex items-center gap-2"><RadioGroupItem value="cash" /> Cash</label>
              <label className="flex items-center gap-2"><RadioGroupItem value="transfer" /> Transfer</label>
            </RadioGroup>
          </div>
          <div>
            <Label>Nominal Bayar (0 = Piutang)</Label>
            <Input inputMode="numeric" value={paid} onChange={(e) => setPaid(e.target.value.replace(/[^\d]/g, ""))} placeholder="0" />
            <p className="mt-1 text-xs text-muted-foreground">Status: <b>{(+paid || 0) >= total && total > 0 ? "LUNAS" : "PIUTANG"}</b></p>
          </div>
          <div>
            <Label>Keterangan (opsional)</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="cth: diambil oleh Si B" />
          </div>
          {method === "transfer" && (
            <div>
              <Label>Bukti Transfer</Label>
              <div className="mt-1 flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                  <Upload className="h-4 w-4" /> {proof ? "Ganti" : "Upload / Kamera"}
                </Button>
                <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
                {proof && <img src={proof} alt="bukti" className="h-12 w-12 rounded border object-cover" />}
              </div>
            </div>
          )}
          <DialogFooter><Button type="submit" disabled={total === 0 || saving}>Simpan Penjualan</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ============ GANTI / ALIHKAN ============ */
function GantiCustomerDialog({ order, menus }: { order: Order; menus: MenuItem[] }) {
  const db = useDB();
  const customerNames = allCustomersGlobal(db);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [qtys, setQtys] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const menuOf = (id: string) => menus.find((m) => m.id === id);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const trimmed = name.trim();
    if (!trimmed) return toast.error("Nama customer baru wajib");
    const moves = order.items.filter((i) => i.qty > 0 && checked[i.menuId])
      .map((i) => ({ menuId: i.menuId, takeQty: Math.min(+(qtys[i.menuId] || i.qty) || 0, i.qty) }))
      .filter((i) => i.takeQty > 0);
    if (moves.length === 0) return toast.error("Pilih minimal 1 item");

    setSaving(true);
    setDB((d) => {
      const o = d.orders.find((x) => x.id === order.id);
      if (!o) return;
      const allFull = moves.every((m) => {
        const oi = o.items.find((x) => x.menuId === m.menuId);
        return oi && oi.qty === m.takeQty;
      }) && o.items.filter((i) => i.qty > 0).length === moves.length;

      if (allFull) {
        if (!o.originalCustomer) o.originalCustomer = o.customer;
        o.customer = trimmed;
      } else {
        const newItems: { menuId: string; qty: number }[] = [];
        for (const mv of moves) {
          const oi = o.items.find((x) => x.menuId === mv.menuId);
          if (oi) { oi.qty -= mv.takeQty; newItems.push({ menuId: mv.menuId, qty: mv.takeQty }); }
        }
        d.orders.push({
          id: uid(), bazarId: o.bazarId, customer: trimmed, items: newItems,
          createdAt: Date.now(), originalCustomer: o.customer,
        });
      }
    });
    addCustomerToMaster(trimmed);
    toast.success("Pesanan dialihkan");
    setOpen(false); setName(""); setChecked({}); setQtys({});
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm" variant="outline" className="h-10 gap-1.5 rounded-xl px-3.5"><UserCog className="h-4 w-4" /> Ganti</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alihkan Pesanan</DialogTitle>
          <DialogDescription>Pilih item & qty yang dialihkan. Jika tidak semua, sisanya tetap di customer lama.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <Label>Nama Customer Baru</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ketik nama..." autoComplete="off" />
            {customerNames.length > 0 && (
              <select className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value="" onChange={(e) => { if (e.target.value) setName(e.target.value); }}>
                <option value="">Pilih Customer</option>
                {customerNames.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            )}
          </div>
          <div className="space-y-2 rounded-lg border p-2">
            <Label className="text-xs">Item yang dialihkan</Label>
            {order.items.filter((i) => i.qty > 0).map((i) => {
              const m = menuOf(i.menuId);
              const isChecked = !!checked[i.menuId];
              return (
                <div key={i.menuId} className="flex items-center gap-2">
                  <Checkbox checked={isChecked} onCheckedChange={(v) => {
                    setChecked((p) => ({ ...p, [i.menuId]: !!v }));
                    if (v && !qtys[i.menuId]) setQtys((p) => ({ ...p, [i.menuId]: String(i.qty) }));
                  }} />
                  <div className="flex-1 text-sm min-w-0">
                    <div className="font-medium truncate">{m?.name}</div>
                    <div className="text-xs text-muted-foreground">Sisa pesanan {i.qty}</div>
                  </div>
                  <Input className="w-16" inputMode="numeric" disabled={!isChecked} value={qtys[i.menuId] || ""}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d]/g, "");
                      const num = Math.min(+raw || 0, i.qty);
                      setQtys((p) => ({ ...p, [i.menuId]: num ? String(num) : "" }));
                    }} />
                </div>
              );
            })}
          </div>
          <DialogFooter><Button type="submit" disabled={saving}>Alihkan</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ============ PENJUALAN TAB ============ */
type SaleStatusFilter = "all" | "lunas" | "piutang";

function PenjualanTab({ sales, bazarName, isAdmin }: { sales: Sale[]; bazarName: string; isAdmin: boolean }) {
  const db = useDB();
  const [searchCustomer, setSearchCustomer] = useState("");
  const [statusFilter, setStatusFilter] = useState<SaleStatusFilter>("all");

  const filteredSales = useMemo(() =>
    sales.filter((s) => {
      const nameMatch = s.customer.toLowerCase().includes(searchCustomer.trim().toLowerCase());
      if (!nameMatch) return false;
      if (statusFilter === "all") return true;
      const isPiutang = saleOutstanding(db, s.id) > 0;
      if (statusFilter === "piutang") return isPiutang;
      if (statusFilter === "lunas") return !isPiutang;
      return true;
    }),
    [sales, searchCustomer, statusFilter, db],
  );

  const filterButtons: { key: SaleStatusFilter; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "lunas", label: "Lunas" },
    { key: "piutang", label: "Piutang" },
  ];

  if (sales.length === 0) return <Empty text="Belum ada penjualan." />;
  return (
    <div className="space-y-4">
      {/* 1. PENCARIAN & FILTER */}
      <div className="space-y-3">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
              placeholder="Cari nama customer..."
              className="h-10 rounded-xl pl-9 bg-white border-slate-200 text-xs"
            />
          </div>
          <button type="button" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-600 shadow-sm" aria-label="Filter">
            <Filter className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterButtons.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatusFilter(key)}
              className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-[10px] font-bold transition-colors ${statusFilter === key ? "border-[#15803d] bg-[#15803d] text-white shadow-sm" : "border-slate-200 bg-white text-slate-500 hover:border-[#15803d] hover:text-slate-700"}`}
            >
              {key !== "all" && <Filter className="h-3 w-3" />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. KONDISI KOSONG & DAFTAR PENJUALAN */}
      {filteredSales.length === 0 ? (
        <Empty text="Tidak ada penjualan yang sesuai filter." />
      ) : (
        <div className="grid gap-3 mt-2">
          {filteredSales.map((s) => <SaleCard key={s.id} sale={s} bazarName={bazarName} isAdmin={isAdmin} />)}
        </div>
      )}
    </div>
  );
}

function StatGroupItem({ icon, tone, label, value }: { icon: React.ReactNode; tone: "emerald" | "blue" | "violet" | "amber" | "rose"; label: string; value: string }) {
  const toneMap: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    violet: "bg-violet-100 text-violet-700",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-700",
  };
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5 first:pl-0 last:pr-0">
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${toneMap[tone]}`}>{icon}</div>
      <div className="min-w-0">
        <div className="text-[11px] text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-bold">{value}</div>
      </div>
    </div>
  );
}

function SaleCard({ sale, bazarName, isAdmin }: { sale: Sale; bazarName: string; isAdmin: boolean }) {
  const db = useDB();
  const outstanding = saleOutstanding(db, sale.id);
  const status = outstanding > 0 ? "PIUTANG" : "LUNAS";

  const doDelete = () => {
    setDB((d) => {
      if (sale.orderId) {
        let o = d.orders.find((x) => x.id === sale.orderId);
        if (!o) {
          o = { id: sale.orderId, bazarId: sale.bazarId, customer: sale.customer, items: [], createdAt: Date.now() };
          d.orders.push(o);
        }
        for (const it of sale.items) {
          const oi = o.items.find((x) => x.menuId === it.menuId);
          if (oi) oi.qty += it.qty;
          else o.items.push({ menuId: it.menuId, qty: it.qty });
        }
        delete o.soldAt;
        delete o.saleId;
      }
      d.sales = d.sales.filter((x) => x.id !== sale.id);
    });
    toast.success("Penjualan dihapus & qty pesanan dikembalikan (terbuka kembali)");
  };

  const hasPiutangPayments = db.payments.some((p) => p.saleId === sale.id);
  const canDeleteSale = () => {
    if (hasPiutangPayments) {
      toast.error("Penjualan ini sudah memiliki pembayaran piutang. Hapus pembayaran piutang terkait terlebih dahulu.");
      return false;
    }
    return true;
  };

  const printNota = () => {
    const w = window.open("", "_blank", "width=420,height=600");
    if (!w) return;
    const rows = sale.items.map((i) =>
      `<tr><td>${i.name}</td><td style="text-align:center">${i.qty}</td><td style="text-align:right">${fmtIDR(i.price)}</td><td style="text-align:right">${fmtIDR(i.price * i.qty)}</td></tr>`
    ).join("");
    w.document.write(`<html><head><title>Nota - ${sale.customer}</title>
      <style>body{font-family:system-ui;padding:16px;max-width:380px;margin:0 auto;color:#111}
      h2{margin:0 0 4px;font-size:18px}.muted{color:#666;font-size:12px}
      table{width:100%;border-collapse:collapse;margin-top:12px;font-size:13px}
      th,td{padding:6px 4px;border-bottom:1px dashed #ddd}
      .tot{font-weight:700;border-top:2px solid #000}</style></head><body>
      <h2>PHBW 2026 — ${bazarName}</h2>
      <div class="muted">${ORGANIZATION_NAME}</div><hr/>
      <div><b>Customer:</b> ${sale.customer}</div>
      <div><b>Jenis Metode Pembayaran:</b> ${sale.method === "cash" ? "Cash" : "Transfer"}</div>
      <div class="muted">${fmtDateTime(sale.createdAt)}</div>
      <table><thead><tr><th align="left">Menu</th><th>Qty</th><th align="right">Harga</th><th align="right">Subtotal</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr class="tot"><td colspan="3" align="right">Total</td><td align="right">${fmtIDR(sale.total)}</td></tr>
      <tr><td colspan="3" align="right">Bayar</td><td align="right">${fmtIDR(sale.paid)}</td></tr>
      <tr><td colspan="3" align="right">Status</td><td align="right">${status}</td></tr></tfoot></table>
      <p class="muted" style="text-align:center;margin-top:18px">Terima kasih — Tuhan Memberkati 🙏</p>
      <script>window.print()</script></body></html>`);
    w.document.close();
  };

  const initial = sale.customer.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="p-4 border border-slate-100 rounded-2xl shadow-sm bg-white">
      {/* Baris Atas: Header & Status */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-50 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="text-[10px] font-bold text-slate-400">{fmtDateTime(sale.createdAt)}</div>
        </div>
        <Badge className={`rounded-full text-[10px] px-2.5 py-0.5 border-none font-bold shadow-none uppercase tracking-wide ${
          status === "LUNAS" ? "bg-emerald-50 text-[#15803d]" : "bg-amber-50 text-amber-600"
        }`}>
          {status}
        </Badge>
      </div>

      {/* Baris Tengah: Info Customer */}
      <div className="flex items-center gap-3 text-slate-900 font-black text-sm mb-3">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-50 border border-slate-100 text-slate-500 shrink-0">
          <User className="h-4 w-4" />
        </div>
        <span className="truncate">{sale.customer}</span>
      </div>

      {/* List Menu */}
      <div className="space-y-1.5 pl-4 border-l-2 border-slate-100 ml-4 mb-4">
        {sale.items.map((i, idx) => (
          <div key={idx} className="text-xs font-medium flex justify-between items-center gap-2">
            <span className="truncate text-slate-500">{i.name}</span>
            <span className="font-bold text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded-md shrink-0">x{i.qty}</span>
          </div>
        ))}
      </div>

      {/* Grid Informasi (Total/Bayar/Sisa) */}
      <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-xl">
        <div className="text-center">
          <div className="text-[9px] text-slate-400 font-bold uppercase">Total</div>
          <div className="text-xs font-black text-slate-700">{fmtIDR(sale.total)}</div>
        </div>
        <div className="text-center border-l border-slate-200">
          <div className="text-[9px] text-slate-400 font-bold uppercase">Bayar</div>
          <div className="text-xs font-black text-emerald-600">{fmtIDR(sale.paid)}</div>
        </div>
        <div className="text-center border-l border-slate-200">
          <div className="text-[9px] text-slate-400 font-bold uppercase">{status === "LUNAS" ? "Metode" : "Sisa"}</div>
          <div className="text-xs font-black text-slate-700">
            {status === "LUNAS" ? (sale.method === "cash" ? "Cash" : "Transfer") : fmtIDR(outstanding)}
          </div>
        </div>
      </div>

      {/* Note & Proof */}
      {sale.note && <div className="mt-3 text-[10px] bg-amber-50 text-amber-700 p-2 rounded-lg italic">"{sale.note}"</div>}
      {sale.proof && (
        <a href={sale.proof} target="_blank" rel="noreferrer" className="mt-3 block">
          <img src={sale.proof} alt="bukti" className="h-20 w-full object-cover rounded-xl border border-slate-100" />
        </a>
      )}

      {/* Tombol Aksi */}
      <div className="mt-4 pt-3 border-t border-slate-50 flex gap-2 justify-end">
        <Button size="sm" variant="outline" onClick={printNota} className="h-9 rounded-xl border-slate-200 px-4 text-xs font-bold text-slate-600 hover:bg-slate-50">
          <Printer className="h-4 w-4 mr-1.5" /> Nota
        </Button>
        {isAdmin && <PinConfirmDelete label="penjualan" requirePin canDelete={canDeleteSale} onConfirm={doDelete} />}
      </div>
    </div>
  );
}

/* ============ PENGELUARAN TAB ============ */
function PengeluaranTab({ bazarId, expenses, isAdmin }: { bazarId: string; expenses: ReturnType<typeof useDB>["expenses"]; isAdmin: boolean }) {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [amount, setAmount] = useState("");
  const [searchName, setSearchName] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredExpenses = useMemo(() =>
    expenses.filter((e) => e.name.toLowerCase().includes(searchName.trim().toLowerCase())),
    [expenses, searchName],
  );

  const reset = () => { setEditId(null); setName(""); setQty(""); setAmount(""); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Nama wajib");
    if (saving) return;
    setSaving(true);
    const newExpense = { id: editId || uid(), bazarId, name: name.trim(), qty: +qty || 1, amount: +amount || 0, createdAt: Date.now() };
    setDB((d) => {
      if (editId) {
        const x = d.expenses.find((y) => y.id === editId);
        if (x) { x.name = newExpense.name; x.qty = newExpense.qty; x.amount = newExpense.amount; }
      } else { d.expenses.push(newExpense); }
    });
    toast.success("Tersimpan");
    setOpen(false); reset();
    setSaving(false);
  };

  return (
    <div className="space-y-3">
      {isAdmin && (
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1.5 rounded-xl border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
                <Plus className="h-4 w-4" /> Pengeluaran
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? "Edit" : "Tambah"} Pengeluaran</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-3">
                <div><Label>Nama Pengeluaran</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Qty</Label><Input inputMode="numeric" placeholder="1" value={qty} onChange={(e) => setQty(e.target.value.replace(/[^\d]/g, ""))} /></div>
                  <div><Label>Nominal</Label><Input inputMode="numeric" placeholder="Total" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))} /></div>
                </div>
                <DialogFooter><Button type="submit" size="sm" disabled={saving}>Simpan</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {expenses.length > 0 && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Cari nama belanjaan..."
              className="h-11 rounded-xl pl-9"
            />
          </div>
          <button type="button" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border bg-card text-muted-foreground hover:text-foreground" aria-label="Filter">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      )}

      {expenses.length > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,.06)]">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-foreground">Ringkasan Pengeluaran</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">Total Pengeluaran</div>
            <div className="whitespace-nowrap text-lg font-bold text-destructive">{fmtIDR(expenses.reduce((s, e) => s + e.amount, 0))}</div>
          </div>
          <div className="h-12 w-px shrink-0 bg-border" />
          <div className="flex shrink-0 items-center gap-2">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="whitespace-nowrap text-[11px] text-muted-foreground">Jumlah Transaksi</div>
              <div className="text-lg font-bold">{expenses.length}</div>
            </div>
          </div>
        </div>
      )}

      {expenses.length === 0 ? <Empty text="Belum ada pengeluaran." /> : filteredExpenses.length === 0 ? <Empty text="Tidak ada pengeluaran dengan nama belanjaan itu." /> : (
        <div className="grid gap-2">
          {filteredExpenses.map((e) => (
            <div key={e.id} className="rounded-2xl border bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,.06)]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{e.name}</div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {fmtDate(e.createdAt)}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">• Qty {e.qty || 1}</div>
                </div>
                <div className="whitespace-nowrap text-base font-bold text-destructive">{fmtIDR(e.amount)}</div>
              </div>
              {isAdmin && (
                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                  <Button size="sm" variant="outline" className="h-10 gap-1.5 rounded-xl px-3.5" onClick={() => { setEditId(e.id); setName(e.name); setQty(String(e.qty || 1)); setAmount(String(e.amount)); setOpen(true); }}>
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                  <PinConfirmDelete label={e.name} requirePin={(e.amount || 0) > 0} onConfirm={() => { setDB((d) => { d.expenses = d.expenses.filter((x) => x.id !== e.id); }); toast.success("Pengeluaran dihapus"); }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {expenses.length > 0 && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-emerald-800">
          <ClipboardList className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="text-xs">
            <div className="font-semibold">Catatan</div>
            <div className="text-emerald-700/80">Pengeluaran digunakan untuk mencatat semua biaya dan belanjaan bazar.</div>
          </div>
        </div>
      )}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-xl border-2 border-dashed bg-muted/30 p-8 text-center text-sm text-muted-foreground">
      <Receipt className="mx-auto mb-2 h-6 w-6" />
      {text}
    </div>
  );
}

const REKAP_TEMPLATE_KEY = "phbw-2026-rekap-template-v1";
const DEFAULT_TEMPLATE = `Shallom..\nBerikut kami sampaikan Rekapan {BAZAR_NAME} PHBW 2026 ({BAZAR_DATE}):\n\nPENGELUARAN\nTotal Pengeluaran : {TOTAL_PENGELUARAN}\n\nPESANAN\nJumlah Customer : {JUMLAH_CUSTOMER_PESANAN} orang\n\nJumlah Menu Pesanan:\n{LIST_MENU_PESANAN}\n\nPesanan Dialihkan : {DIALIHKAN}\n\nPENJUALAN\nJumlah Customer : {JUMLAH_CUSTOMER_PENJUALAN} orang\n\nJumlah Menu Penjualan:\n{LIST_MENU_PENJUALAN}\n\nJumlah Pendapatan Penjualan : {TOTAL_PENJUALAN}\nLunas : {TOTAL_LUNAS}\nPiutang : {TOTAL_PIUTANG}\n\nKEUNTUNGAN BERSIH\n{KEUNTUNGAN}\n\nDemikian rekapan {BAZAR_NAME} PHBW 2026 ({BAZAR_DATE}) yang dapat kami sampaikan.\nTuhan Yesus Memberkati...`;
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function alphaLabel(i: number) { return ALPHA[i] ?? String(i + 1); }
function computeRekap(db: ReturnType<typeof useDB>, bazarId: string) {
  const bazarOrders = db.orders.filter((o) => o.bazarId === bazarId);
  const bazarSales = db.sales.filter((s) => s.bazarId === bazarId);
  const bazarExpenses = db.expenses.filter((e) => e.bazarId === bazarId);
  const totalPengeluaran = bazarExpenses.reduce((sum, e) => sum + e.amount, 0);
  const pesananCustomers = new Set<string>();
  const pesananMenuMap = new Map<string, number>();
  for (const order of bazarOrders) {
    pesananCustomers.add(order.customer.trim().toLowerCase());
    const soldByMenu: Record<string, number> = {};
    for (const sale of db.sales.filter((s) => s.orderId === order.id)) {
      for (const item of sale.items) { soldByMenu[item.menuId] = (soldByMenu[item.menuId] || 0) + item.qty; }
    }
    const allMenuIds = new Set([...order.items.map((i) => i.menuId), ...Object.keys(soldByMenu)]);
    for (const menuId of allMenuIds) {
      const remaining = order.items.find((i) => i.menuId === menuId)?.qty || 0;
      const sold = soldByMenu[menuId] || 0;
      const originalQty = remaining + sold;
      if (originalQty <= 0) continue;
      const menu = db.menus.find((m) => m.id === menuId);
      const name = menu?.name || menuId;
      pesananMenuMap.set(name, (pesananMenuMap.get(name) || 0) + originalQty);
    }
  }
  const dialihkan = bazarOrders.filter((o) => o.originalCustomer && o.originalCustomer !== o.customer).map((o) => `${o.originalCustomer} → ${o.customer}`);
  const penjualanCustomers = new Set<string>();
  const penjualanMenuMap = new Map<string, { qty: number; total: number }>();
  for (const sale of bazarSales) {
    penjualanCustomers.add(sale.customer.trim().toLowerCase());
    for (const item of sale.items) {
      const prev = penjualanMenuMap.get(item.name) || { qty: 0, total: 0 };
      penjualanMenuMap.set(item.name, { qty: prev.qty + item.qty, total: prev.total + item.price * item.qty });
    }
  }
  const totalPenjualan = bazarSales.reduce((sum, s) => sum + s.total, 0);
  const totalPiutang = bazarSales.reduce((sum, s) => sum + saleOutstanding(db, s.id), 0);
  const totalLunas = totalPenjualan - totalPiutang;
  const grossProfit = bazarSales.reduce((s, x) => s + x.items.reduce((ss, it) => ss + (it.price - (it.cost || 0)) * it.qty, 0), 0);
  const keuntungan = grossProfit - totalPengeluaran;
  return { totalPengeluaran, pesananCustomers: pesananCustomers.size, pesananMenus: Array.from(pesananMenuMap.entries()), dialihkan, penjualanCustomers: penjualanCustomers.size, penjualanMenus: Array.from(penjualanMenuMap.entries()), totalPenjualan, totalLunas, totalPiutang, keuntungan };
}
function buildMessage(template: string, data: ReturnType<typeof computeRekap>, bazarName: string, bazarDate: string) {
  const listPesanan = data.pesananMenus.length ? data.pesananMenus.map(([name, qty], i) => `${alphaLabel(i)}. ${name} - ${qty}x`).join("\n") : "Belum ada pesanan";
  const listPenjualan = data.penjualanMenus.length ? data.penjualanMenus.map(([name, { qty, total }], i) => `${alphaLabel(i)}. ${name} - ${qty}x - ${fmtIDR(total)}`).join("\n") : "Belum ada penjualan";
  const dialihkanText = data.dialihkan.length ? data.dialihkan.join(", ") : "Tidak Ada";
  return template.replace(/\{BAZAR_NAME\}/g, bazarName).replace(/\{BAZAR_DATE\}/g, bazarDate).replace(/\{TOTAL_PENGELUARAN\}/g, fmtIDR(data.totalPengeluaran)).replace(/\{JUMLAH_CUSTOMER_PESANAN\}/g, String(data.pesananCustomers)).replace(/\{LIST_MENU_PESANAN\}/g, listPesanan).replace(/\{DIALIHKAN\}/g, dialihkanText).replace(/\{JUMLAH_CUSTOMER_PENJUALAN\}/g, String(data.penjualanCustomers)).replace(/\{LIST_MENU_PENJUALAN\}/g, listPenjualan).replace(/\{TOTAL_PENJUALAN\}/g, fmtIDR(data.totalPenjualan)).replace(/\{TOTAL_LUNAS\}/g, fmtIDR(data.totalLunas)).replace(/\{TOTAL_PIUTANG\}/g, fmtIDR(data.totalPiutang)).replace(/\{KEUNTUNGAN\}/g, fmtIDR(data.keuntungan));
}
function RekapanTab({ bazarId, bazarName, bazarDate }: { bazarId: string; bazarName: string; bazarDate: string }) {
  const db = useDB();
  const { isAdmin } = useAuth();
  const [editingTpl, setEditingTpl] = useState(false);
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  useEffect(() => { const saved = localStorage.getItem(REKAP_TEMPLATE_KEY); if (saved) setTemplate(saved); }, []);
  const data = useMemo(() => computeRekap(db, bazarId), [db, bazarId]);
  const bazarDateFmt = fmtDate(new Date(bazarDate).getTime());
  const message = buildMessage(template, data, bazarName, bazarDateFmt);
  const copyMessage = async () => { try { await navigator.clipboard.writeText(message); toast.success("Teks rekapan disalin"); } catch { toast.error("Gagal menyalin teks"); } };
  const handleSendRekap = () => { navigator.clipboard?.writeText(message).catch(() => undefined); window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank"); };
  const saveTemplate = () => { localStorage.setItem(REKAP_TEMPLATE_KEY, template); setEditingTpl(false); toast.success("Template disimpan"); };
  const resetTemplate = () => { setTemplate(DEFAULT_TEMPLATE); localStorage.removeItem(REKAP_TEMPLATE_KEY); toast.success("Template direset"); };
  return (
    <div className="space-y-4">
      {isAdmin && <button type="button" onClick={handleSendRekap} className="flex w-full items-center gap-4 rounded-2xl bg-emerald-600 p-5 text-left text-white shadow-lg transition hover:bg-emerald-700 active:scale-[0.98]">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/20"><MessageCircle className="h-6 w-6" /></div>
        <div className="min-w-0 flex-1"><div className="text-base font-semibold">Kirim Rekapan ke WA</div><div className="text-xs text-emerald-100/90">{bazarName} · {bazarDateFmt}</div></div>
      </button>}
      {isAdmin && <Button variant="outline" className="w-full gap-2" onClick={copyMessage}><Copy className="h-4 w-4" /> Salin Teks Rekapan</Button>}
      <div className="rounded-[16px] border bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,.06)]">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold">Format Pesan WA</div>
          {isAdmin && <Button size="sm" variant="ghost" onClick={() => setEditingTpl((v) => !v)} className="gap-1 text-xs"><Pencil className="h-3.5 w-3.5" /> {editingTpl ? "Tutup" : "Edit"}</Button>}
        </div>
        {editingTpl ? (
          <div className="space-y-2">
            <Textarea rows={16} value={template} onChange={(e) => setTemplate(e.target.value)} className="font-mono text-xs" />
            <div className="flex gap-2"><Button size="sm" onClick={saveTemplate}>Simpan</Button><Button size="sm" variant="outline" onClick={resetTemplate}>Reset Default</Button></div>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap rounded-xl bg-muted/50 p-4 text-xs leading-relaxed text-foreground/80">{message}</pre>
        )}
      </div>
    </div>
  );
}
