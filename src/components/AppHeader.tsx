import { Link } from "@tanstack/react-router";
import { Church, Camera, Link as LinkIcon, X } from "lucide-react";
import { useRef, useState } from "react";
import { useLogo, setLogo } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// ====== GANTI URL LOGO KANAN DI BAWAH INI ======
// Ubah string ini dengan URL gambar logo organisasi kanan (mis. logo GPI / Jemaat).
const RIGHT_LOGO_URL: string = "";
// ===============================================

export function AppHeader() {
  const logo = useLogo();

  return (
    <header className="border-b bg-card">
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex items-center gap-2">
          <LogoPicker logo={logo} />
          <Link to="/" className="min-w-0 flex-1 text-center">
            <h1 className="text-sm font-bold leading-tight text-foreground sm:text-base">
              Panitia Hari Besar Wilayah 2026
            </h1>
            <p className="text-[10px] font-medium text-muted-foreground sm:text-xs">
              Kompelsus Pemuda Jemaat Bukit Zaitun Luwuk
            </p>
          </Link>
          {/* === LOGO KANAN — ganti URL di RIGHT_LOGO_URL di atas === */}
          <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border bg-muted">
            {RIGHT_LOGO_URL ? (
              <img src={RIGHT_LOGO_URL} alt="Logo Kanan" className="h-full w-full object-cover" />
            ) : (
              <Church className="h-6 w-6 text-muted-foreground/60" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function LogoPicker({ logo }: { logo: string | null }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (f?: File) => {
    if (!f) return;
    if (f.size > 1_500_000) { toast.error("Maks 1.5MB"); return; }
    const r = new FileReader();
    r.onload = () => { setLogo(r.result as string); toast.success("Logo tersimpan"); setOpen(false); };
    r.readAsDataURL(f);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" aria-label="Atur logo"
          className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border bg-primary/10 text-primary">
          {logo ? <img src={logo} alt="Logo" className="h-full w-full object-cover" /> : <Church className="h-6 w-6" />}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Logo PHBW</DialogTitle></DialogHeader>
        <div className="space-y-4">
          {logo && (
            <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
              <img src={logo} alt="logo" className="h-14 w-14 rounded-full object-cover" />
              <div className="flex-1 text-xs text-muted-foreground">Logo aktif</div>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { setLogo(null); toast.success("Logo dihapus"); }}>
                <X className="h-4 w-4" /> Hapus
              </Button>
            </div>
          )}
          <div className="space-y-2">
            <Label>Upload dari perangkat</Label>
            <Button type="button" variant="outline" className="w-full" onClick={() => fileRef.current?.click()}>
              <Camera className="h-4 w-4" /> Pilih Gambar
            </Button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          </div>
          <div className="space-y-2">
            <Label>Atau pakai URL gambar</Label>
            <div className="flex gap-2">
              <Input placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
              <Button type="button" onClick={() => { if (!url.trim()) return toast.error("Isi URL"); setLogo(url.trim()); toast.success("Logo tersimpan"); setUrl(""); setOpen(false); }}>
                <LinkIcon className="h-4 w-4" /> Pakai
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
