import subprocess, sys
from pathlib import Path

G="\033[92m"; R="\033[91m"; B="\033[94m"; BOLD="\033[1m"; RST="\033[0m"
def ok(m): print(f"{G}  ✅ {m}{RST}")
def info(m): print(f"{B}  ➜  {m}{RST}")
def err(m): print(f"{R}  ❌ {m}{RST}"); sys.exit(1)
def hdr(m): print(f"\n{BOLD}{m}{RST}")

def patch(path, old, new, label):
    c = path.read_text(encoding="utf-8")
    if old not in c: err(f"[{label}] Teks tidak ditemukan di {path}")
    path.write_text(c.replace(old, new, 1), encoding="utf-8")
    ok(label)

hdr("=" * 50)
hdr("  BAZAR PHBW 2026 — Perbaikan Otomatis")
hdr("=" * 50)

r = Path("src/routes"); l = Path("src/lib")
fp = r / "piutang.$customer.tsx"
fs = l / "storage.ts"
fi = r / "index.tsx"
fd = r / "saldo.tsx"

for f,n in [(fp,"piutang"),(fs,"storage"),(fi,"index"),(fd,"saldo")]:
    if not f.exists(): err(f"File tidak ditemukan: {f}")
    info(f"OK: {f}")

hdr("\n[1/4] Fix bug Something Wrong di Piutang ...")
patch(fp,
"  const db = useDB();\n\n  const sales = db.sales",
"  const db = useDB();\n  const { isAdmin } = useAuth();\n\n  const sales = db.sales",
"isAdmin ditambahkan")

hdr("\n[2/4] Fix data tidak langsung muncul ...")
patch(fs,
"  db = { ...db };\n  dbSnapshot = db;",
"  db = {\n    ...db,\n    bazars:[...db.bazars],\n    menus:[...db.menus],\n    orders:[...db.orders],\n    sales:[...db.sales],\n    expenses:[...db.expenses],\n    payments:[...db.payments],\n  };\n  dbSnapshot = db;",
"setDB diperbaiki")

hdr("\n[3/4] Modal Awal pindah ke Pengaturan ...")
patch(fi,
'import { useDB, computeSaldo,',
'import { useDB, setDB, computeSaldo,',
"setDB diimport")
patch(fi,
'  | "pin"\n  | "left-logo"',
'  | "pin"\n  | "modal-awal"\n  | "left-logo"',
"modal-awal type ditambahkan")
patch(fi,
'  "pin": "Ganti PIN",',
'  "pin": "Ganti PIN",\n  "modal-awal": "Edit Modal Awal",',
"label ditambahkan")
patch(fi,
'  const [restoring, setRestoring] = useState(false);',
'  const [restoring, setRestoring] = useState(false);\n  const [modalAwalInput, setModalAwalInput] = useState("");',
"state ditambahkan")
patch(fi,
'    setPinInput("");\n    setVerified(false);',
'    setPinInput("");\n    setVerified(false);\n    if (action === "modal-awal") setModalAwalInput(String(db.modalAwal || 0));',
"init ditambahkan")
patch(fi,
'    if (active === "left-logo" || active === "right-logo") {',
'    if (active === "modal-awal") {\n      return (\n        <div className="space-y-3 rounded-xl border p-4">\n          <div className="text-sm font-semibold">Edit Modal Awal</div>\n          <p className="mt-1 text-xs text-muted-foreground">Saat ini: <b>{fmtIDR(db.modalAwal)}</b></p>\n          <Label>Nominal</Label>\n          <Input inputMode="numeric" value={modalAwalInput} onChange={(e)=>setModalAwalInput(e.target.value.replace(/[^\\d]/g,""))} placeholder="0"/>\n          <DialogFooter className="gap-2 sm:gap-0">\n            <Button type="button" variant="outline" onClick={resetAction}>Batal</Button>\n            <Button type="button" onClick={()=>{setDB((d)=>{d.modalAwal=Number(modalAwalInput)||0;});toast.success("Modal awal diperbarui");resetAction();}}>Simpan</Button>\n          </DialogFooter>\n        </div>\n      );\n    }\n\n    if (active === "left-logo" || active === "right-logo") {',
"panel modal-awal ditambahkan")
patch(fi,
'    { action: "pin", adminOnly: true },\n    { action: "left-logo"',
'    { action: "pin", adminOnly: true },\n    { action: "modal-awal", adminOnly: true },\n    { action: "left-logo"',
"menu modal-awal ditambahkan")

hdr("\n[4/4] Hapus form Modal Awal dari Saldo ...")
patch(fd,
'  const [modal, setModal] = useState(String(db.modalAwal || 0));\n  const [showMasuk',
'  const [showMasuk',
"state modal dihapus")
patch(fd,
'      <form\n        className="rounded-2xl border bg-card p-5"\n        onSubmit={(e) => {\n          e.preventDefault();\n          const n = Number(modal) || 0;\n          setDB((d) => { d.modalAwal = n; });\n          toast.success("Modal awal diperbarui");\n        }}\n      >\n        <Label htmlFor="modal" className="font-semibold">Isi / Edit Modal Awal</Label>\n        <div className="mt-2 flex gap-2">\n          <Input id="modal" inputMode="numeric" value={modal} onChange={(e) => setModal(e.target.value.replace(/[^\\d]/g, ""))} />\n          <Button type="submit">Simpan</Button>\n        </div>\n      </form>',
'      <div className="rounded-2xl border bg-card p-5">\n        <p className="text-sm text-muted-foreground">Untuk ubah <b>Modal Awal</b>, buka <b>Pengaturan ⚙️</b> → <b>Edit Modal Awal</b>.</p>\n      </div>',
"form diganti petunjuk")

hdr("\n[5/5] Push ke GitHub ...")
subprocess.run(["git","add","-A"],check=True)
r2=subprocess.run(["git","status","--porcelain"],capture_output=True,text=True)
if not r2.stdout.strip(): info("Tidak ada perubahan.")
else:
    subprocess.run(["git","commit","-m","fix: piutang + realtime + modal awal ke settings"],check=True)
    p=subprocess.run(["git","push"])
    if p.returncode==0: ok("Push berhasil! Vercel auto-deploy dimulai.")
    else: err("Push gagal. Coba: git pull dulu lalu ulang.")

hdr("=" * 50)
ok("SELESAI! Semua perbaikan berhasil.")
hdr("=" * 50)
