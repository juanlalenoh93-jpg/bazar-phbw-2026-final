#!/usr/bin/env python3
"""
perbaikan.py
============
Jalankan script ini di root folder project bazar-phbw di Codespaces:

    python perbaikan.py

Script ini akan otomatis:
  1. Fix bug "Something Wrong" di halaman Daftar Piutang
  2. Fix data inputan tidak langsung muncul
  3. Pindahkan edit Modal Awal ke Pengaturan (pakai PIN)
  4. Hapus form Modal Awal dari halaman Saldo
  5. Push semua perubahan ke GitHub → Vercel auto-deploy
"""

import subprocess
import sys
from pathlib import Path

# Warna terminal
G    = "\033[92m"
Y    = "\033[93m"
R    = "\033[91m"
B    = "\033[94m"
BOLD = "\033[1m"
RST  = "\033[0m"

def ok(msg):   print(f"{G}  ✅ {msg}{RST}")
def info(msg): print(f"{B}  ➜  {msg}{RST}")
def err(msg):  print(f"{R}  ❌ {msg}{RST}"); sys.exit(1)
def hdr(msg):  print(f"\n{BOLD}{msg}{RST}")


# ─────────────────────────────────────────────────────────────────────────────
# HELPER
# ─────────────────────────────────────────────────────────────────────────────

def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")

def write(path: Path, content: str):
    path.write_text(content, encoding="utf-8")

def patch(path: Path, old: str, new: str, label: str):
    """Ganti old → new di dalam file. Berhenti jika tidak ketemu."""
    content = read(path)
    if old not in content:
        err(f"[{label}] Teks target tidak ditemukan di {path}\n"
            f"  Kemungkinan file sudah dipatch atau versi berbeda.")
    write(path, content.replace(old, new, 1))
    ok(label)

def check_file(path: Path, label: str):
    if not path.exists():
        err(f"File tidak ditemukan: {path}\n"
            f"  Pastikan kamu menjalankan script ini dari ROOT project bazar-phbw.")
    info(f"Ditemukan: {path}  ({label})")


# ─────────────────────────────────────────────────────────────────────────────
# CEK LOKASI
# ─────────────────────────────────────────────────────────────────────────────

def cek_lokasi():
    hdr("=" * 55)
    hdr("  BAZAR PHBW 2026 — Script Perbaikan Otomatis")
    hdr("=" * 55)

    hdr("\n[0/4] Memeriksa lokasi project ...")

    # Harus ada package.json dan src/
    if not Path("package.json").exists() or not Path("src").exists():
        err("Tidak menemukan package.json atau folder src/.\n"
            "  Pastikan kamu menjalankan script ini dari ROOT folder project bazar-phbw:\n"
            "  cd /workspaces/bazar-phbw-2026   ← sesuaikan nama folder\n"
            "  python perbaikan.py")

    ok("Lokasi project benar")

    # Tentukan path file yang akan diedit
    routes = Path("src/routes")
    lib    = Path("src/lib")

    f_piutang = routes / "piutang.$customer.tsx"
    f_storage = lib    / "storage.ts"
    f_index   = routes / "index.tsx"
    f_saldo   = routes / "saldo.tsx"

    check_file(f_piutang, "halaman detail piutang")
    check_file(f_storage, "storage / database lokal")
    check_file(f_index,   "dashboard + pengaturan")
    check_file(f_saldo,   "halaman saldo kas")

    return f_piutang, f_storage, f_index, f_saldo


# ─────────────────────────────────────────────────────────────────────────────
# FIX 1 — piutang.$customer.tsx
# Tambahkan `const { isAdmin } = useAuth();` di dalam CustomerDetail()
# ─────────────────────────────────────────────────────────────────────────────

def fix_piutang(f_piutang: Path):
    hdr("\n[1/4] Fix bug 'Something Wrong' di Daftar Piutang ...")
    info("Menambahkan deklarasi isAdmin yang hilang ...")

    patch(
        f_piutang,
        # ── CARI ──
        "function CustomerDetail() {\n"
        "  const { customer: raw } = Route.useParams();\n"
        "  const customer = decodeURIComponent(raw);\n"
        "  const db = useDB();\n"
        "\n"
        "  const sales = db.sales",
        # ── GANTI ──
        "function CustomerDetail() {\n"
        "  const { customer: raw } = Route.useParams();\n"
        "  const customer = decodeURIComponent(raw);\n"
        "  const db = useDB();\n"
        "  const { isAdmin } = useAuth();\n"
        "\n"
        "  const sales = db.sales",
        "isAdmin ditambahkan di CustomerDetail()",
    )


# ─────────────────────────────────────────────────────────────────────────────
# FIX 2 — storage.ts
# Deep-copy array agar useMemo mendeteksi perubahan → data langsung muncul
# ─────────────────────────────────────────────────────────────────────────────

def fix_storage(f_storage: Path):
    hdr("\n[2/4] Fix data inputan tidak langsung muncul ...")
    info("Memperbaiki fungsi setDB() di storage.ts ...")

    patch(
        f_storage,
        # ── CARI ──
        "export function setDB(updater: (d: DB) => DB | void) {\n"
        "  load();\n"
        "  const next = updater(db);\n"
        "  if (next) db = next;\n"
        "  db = { ...db };\n"
        "  dbSnapshot = db;\n"
        "  if (typeof window !== \"undefined\") {\n"
        "    localStorage.setItem(KEY, JSON.stringify(db));\n"
        "  }\n"
        "  listeners.forEach((l) => l());\n"
        "}",
        # ── GANTI ──
        "export function setDB(updater: (d: DB) => DB | void) {\n"
        "  load();\n"
        "  const next = updater(db);\n"
        "  if (next) db = next;\n"
        "  // Deep-copy semua array agar useMemo mendeteksi perubahan\n"
        "  db = {\n"
        "    ...db,\n"
        "    bazars:   [...db.bazars],\n"
        "    menus:    [...db.menus],\n"
        "    orders:   [...db.orders],\n"
        "    sales:    [...db.sales],\n"
        "    expenses: [...db.expenses],\n"
        "    payments: [...db.payments],\n"
        "  };\n"
        "  dbSnapshot = db;\n"
        "  if (typeof window !== \"undefined\") {\n"
        "    localStorage.setItem(KEY, JSON.stringify(db));\n"
        "  }\n"
        "  listeners.forEach((l) => l());\n"
        "}",
        "setDB() diperbaiki — array di-copy agar data langsung muncul",
    )


# ─────────────────────────────────────────────────────────────────────────────
# FIX 3 — index.tsx
# Tambahkan "Edit Modal Awal" ke menu Pengaturan (dengan PIN)
# ─────────────────────────────────────────────────────────────────────────────

def fix_index(f_index: Path):
    hdr("\n[3/4] Pindahkan Edit Modal Awal ke Pengaturan Aplikasi ...")

    # 3a. Tambah import setDB
    info("Menambahkan setDB ke import storage ...")
    patch(
        f_index,
        'import { useDB, computeSaldo, fmtIDR, useLogo, useRightLogo, setLogo, setRightLogo, '
        'allCustomersGlobal, removeCustomerFromMaster, saleOutstanding, downloadBackup, restoreFromBackup } from "@/lib/storage";',
        'import { useDB, setDB, computeSaldo, fmtIDR, useLogo, useRightLogo, setLogo, setRightLogo, '
        'allCustomersGlobal, removeCustomerFromMaster, saleOutstanding, downloadBackup, restoreFromBackup } from "@/lib/storage";',
        "setDB ditambahkan ke import",
    )

    # 3b. Tambah "modal-awal" ke SettingsAction type
    info('Menambahkan "modal-awal" ke SettingsAction type ...')
    patch(
        f_index,
        'type SettingsAction =\n'
        '  | "pin"\n'
        '  | "left-logo"',
        'type SettingsAction =\n'
        '  | "pin"\n'
        '  | "modal-awal"\n'
        '  | "left-logo"',
        '"modal-awal" ditambahkan ke SettingsAction',
    )

    # 3c. Tambah label
    info('Menambahkan label "Edit Modal Awal" ...')
    patch(
        f_index,
        'const settingsLabels: Record<SettingsAction, string> = {\n'
        '  "pin": "Ganti PIN",',
        'const settingsLabels: Record<SettingsAction, string> = {\n'
        '  "pin": "Ganti PIN",\n'
        '  "modal-awal": "Edit Modal Awal",',
        'Label "Edit Modal Awal" ditambahkan',
    )

    # 3d. Tambah state modalAwalInput
    info("Menambahkan state modalAwalInput ...")
    patch(
        f_index,
        '  const [restoring, setRestoring] = useState(false);',
        '  const [restoring, setRestoring] = useState(false);\n'
        '  const [modalAwalInput, setModalAwalInput] = useState("");',
        "State modalAwalInput ditambahkan",
    )

    # 3e. Inisialisasi modalAwalInput saat modal-awal dibuka
    info("Menambahkan inisialisasi saat menu dibuka ...")
    patch(
        f_index,
        '  const openAction = (action: SettingsAction) => {\n'
        '    setActive(action);\n'
        '    setPinInput("");',
        '  const openAction = (action: SettingsAction) => {\n'
        '    setActive(action);\n'
        '    setPinInput("");\n'
        '    if (action === "modal-awal") setModalAwalInput(String(db.modalAwal || 0));',
        "Inisialisasi modalAwalInput ditambahkan",
    )

    # 3f. Tambah handler renderActionContent untuk modal-awal
    info("Menambahkan panel Edit Modal Awal di renderActionContent ...")
    patch(
        f_index,
        '    if (active === "left-logo" || active === "right-logo") {',
        '    if (active === "modal-awal") {\n'
        '      return (\n'
        '        <div className="space-y-3 rounded-xl border p-4">\n'
        '          <div>\n'
        '            <div className="text-sm font-semibold">Edit Modal Awal</div>\n'
        '            <p className="mt-1 text-xs text-muted-foreground">\n'
        '              Modal awal saat ini: <b>{fmtIDR(db.modalAwal)}</b>\n'
        '            </p>\n'
        '          </div>\n'
        '          <div>\n'
        '            <Label>Nominal Modal Awal</Label>\n'
        '            <Input\n'
        '              inputMode="numeric"\n'
        '              value={modalAwalInput}\n'
        '              onChange={(e) => setModalAwalInput(e.target.value.replace(/[^\\d]/g, ""))}\n'
        '              placeholder="0"\n'
        '            />\n'
        '          </div>\n'
        '          <DialogFooter className="gap-2 sm:gap-0">\n'
        '            <Button type="button" variant="outline" onClick={resetAction}>Batal</Button>\n'
        '            <Button\n'
        '              type="button"\n'
        '              onClick={() => {\n'
        '                const n = Number(modalAwalInput) || 0;\n'
        '                setDB((d) => { d.modalAwal = n; });\n'
        '                toast.success("Modal awal diperbarui");\n'
        '                resetAction();\n'
        '              }}\n'
        '            >\n'
        '              Simpan\n'
        '            </Button>\n'
        '          </DialogFooter>\n'
        '        </div>\n'
        '      );\n'
        '    }\n'
        '\n'
        '    if (active === "left-logo" || active === "right-logo") {',
        'Panel Edit Modal Awal ditambahkan di renderActionContent',
    )

    # 3g. Tambah menu "modal-awal" ke menuItems (setelah "pin")
    info('Menambahkan "modal-awal" ke daftar menu Pengaturan ...')
    patch(
        f_index,
        '  const menuItems: { action: SettingsAction; icon?: ReactNode; adminOnly?: boolean }[] = [\n'
        '    { action: "pin", adminOnly: true },\n'
        '    { action: "left-logo", adminOnly: true },',
        '  const menuItems: { action: SettingsAction; icon?: ReactNode; adminOnly?: boolean }[] = [\n'
        '    { action: "pin", adminOnly: true },\n'
        '    { action: "modal-awal", adminOnly: true },\n'
        '    { action: "left-logo", adminOnly: true },',
        '"modal-awal" ditambahkan ke menuItems Pengaturan',
    )


# ─────────────────────────────────────────────────────────────────────────────
# FIX 4 — saldo.tsx
# Hapus form edit modal awal, ganti dengan teks petunjuk
# ─────────────────────────────────────────────────────────────────────────────

def fix_saldo(f_saldo: Path):
    hdr("\n[4/4] Hapus form edit Modal Awal dari halaman Saldo ...")

    # 4a. Hapus state `modal`
    info("Menghapus state modal yang tidak terpakai ...")
    patch(
        f_saldo,
        '  const [modal, setModal] = useState(String(db.modalAwal || 0));\n'
        '  const [showMasuk, setShowMasuk] = useState(false);\n'
        '  const [showKeluar, setShowKeluar] = useState(false);',
        '  const [showMasuk, setShowMasuk] = useState(false);\n'
        '  const [showKeluar, setShowKeluar] = useState(false);',
        "State modal dihapus",
    )

    # 4b. Hapus form, ganti teks petunjuk
    info("Mengganti form dengan teks petunjuk ...")
    patch(
        f_saldo,
        '      <form\n'
        '        className="rounded-2xl border bg-card p-5"\n'
        '        onSubmit={(e) => {\n'
        '          e.preventDefault();\n'
        '          const n = Number(modal) || 0;\n'
        '          setDB((d) => { d.modalAwal = n; });\n'
        '          toast.success("Modal awal diperbarui");\n'
        '        }}\n'
        '      >\n'
        '        <Label htmlFor="modal" className="font-semibold">Isi / Edit Modal Awal</Label>\n'
        '        <div className="mt-2 flex gap-2">\n'
        '          <Input id="modal" inputMode="numeric" value={modal} onChange={(e) => setModal(e.target.value.replace(/[^\\d]/g, ""))} />\n'
        '          <Button type="submit">Simpan</Button>\n'
        '        </div>\n'
        '      </form>',
        '      <div className="rounded-2xl border bg-card p-5">\n'
        '        <p className="text-sm text-muted-foreground">\n'
        '          Untuk mengubah <b>Modal Awal</b>, buka{" "}\n'
        '          <b>Pengaturan Aplikasi</b> (ikon ⚙️ di halaman utama){" "}\n'
        '          → <b>Edit Modal Awal</b>.\n'
        '        </p>\n'
        '      </div>',
        "Form Modal Awal diganti teks petunjuk",
    )

    # 4c. Hapus import yang tidak terpakai (setDB, Label, Input, Button, toast)
    info("Membersihkan import yang tidak terpakai ...")
    patch(
        f_saldo,
        'import { useDB, setDB, computeSaldo, fmtIDR, fmtDate } from "@/lib/storage";',
        'import { useDB, computeSaldo, fmtIDR, fmtDate } from "@/lib/storage";',
        "Import setDB dihapus dari saldo.tsx",
    )
    patch(
        f_saldo,
        'import { Button } from "@/components/ui/button";\n'
        'import { Input } from "@/components/ui/input";\n'
        'import { Label } from "@/components/ui/label";\n'
        'import { toast } from "sonner";',
        '',
        "Import Button/Input/Label/toast dihapus dari saldo.tsx",
    )


# ─────────────────────────────────────────────────────────────────────────────
# GIT PUSH
# ─────────────────────────────────────────────────────────────────────────────

def git_push():
    hdr("\n[5/5] Push ke GitHub → Vercel auto-deploy ...")

    # Cek ada perubahan
    result = subprocess.run(
        ["git", "status", "--porcelain"],
        capture_output=True, text=True
    )
    if not result.stdout.strip():
        info("Tidak ada perubahan yang perlu di-push (sudah up-to-date).")
        return

    info("File yang akan di-commit:")
    for line in result.stdout.splitlines():
        print(f"    {line}")

    subprocess.run(["git", "add", "-A"], check=True)
    subprocess.run(
        ["git", "commit", "-m",
         "fix: bug piutang + data realtime + modal awal pindah ke settings"],
        check=True
    )

    push = subprocess.run(["git", "push"])
    if push.returncode == 0:
        ok("Push berhasil!")
        print(f"\n  {B}➜  Vercel sedang deploy otomatis.")
        print(f"  ➜  Pantau di: https://vercel.com/dashboard{RST}\n")
    else:
        print(f"\n{R}  ❌ Push gagal.{RST}")
        print("     Kemungkinan penyebab:")
        print("     • Belum login git: git config user.email 'email@kamu.com'")
        print("     • Perlu pull dulu: git pull origin main")
        sys.exit(1)


# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────

def main():
    f_piutang, f_storage, f_index, f_saldo = cek_lokasi()

    fix_piutang(f_piutang)
    fix_storage(f_storage)
    fix_index(f_index)
    fix_saldo(f_saldo)

    git_push()

    hdr("=" * 55)
    ok("Semua perbaikan berhasil diterapkan!")
    hdr("=" * 55)
    print()


if __name__ == "__main__":
    main()
