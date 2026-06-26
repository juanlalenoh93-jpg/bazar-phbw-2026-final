import { Link } from "@tanstack/react-router";
import { Church, Camera, Link as LinkIcon, X } from "lucide-react";
import { useRef, useState } from "react";
import { useLogo, setLogo, useRightLogo, setRightLogo } from "@/lib/storage";
import { APP_TITLE, ORGANIZATION_NAME } from "@/lib/branding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function AppHeader() {
  const logo = useLogo();
  const rightLogo = useRightLogo();

  return (
    <header className="border-b bg-card">
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex items-center gap-2">
          <LogoPicker title="Logo Kiri" logo={logo} onSave={setLogo} />
          <Link to="/" className="min-w-0 flex-1 text-center">
            <h1 className="text-sm font-bold leading-tight text-foreground sm:text-base">
              {APP_TITLE}
            </h1>
            <p className="text-[10px] font-medium text-muted-foreground sm:text-xs">
              {ORGANIZATION_NAME}
            </p>
          </Link>
          <LogoPicker title="Logo Kanan" logo={rightLogo} onSave={setRightLogo} />
        </div>
      </div>
    </header>
  );
}

function LogoPicker({
  title,
  logo,
  onSave,
}: {
  title: string;
  logo: string | null;
  onSave: (value: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }
    if (f.size > 2_500_000) {
      toast.error("Maks 2.5MB");
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => toast.error("Gagal membaca gambar");
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result.startsWith("data:image/")) {
        toast.error("Format gambar tidak valid");
        return;
      }
      onSave(result);
      toast.success(`${title} tersimpan`);
      setOpen(false);
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.readAsDataURL(f);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" aria-label={`Atur ${title}`}
          className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border bg-primary/10 text-primary">
          {logo ? <img src={logo} alt={title} className="h-full w-full object-cover" /> : <Church className="h-6 w-6" />}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          {logo && (
            <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
              <img src={logo} alt={title} className="h-14 w-14 rounded-full object-cover" />
              <div className="flex-1 text-xs text-muted-foreground">Logo aktif dan tersimpan permanen di perangkat ini.</div>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { onSave(null); toast.success(`${title} dihapus`); }}>
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
              <Button type="button" onClick={() => {
                if (!url.trim()) return toast.error("Isi URL");
                onSave(url.trim());
                toast.success(`${title} tersimpan`);
                setUrl("");
                setOpen(false);
              }}>
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
