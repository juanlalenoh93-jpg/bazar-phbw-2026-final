import { useState } from "react";
import { Cloud, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { setSheetUrl, useSheetUrl } from "@/lib/sync";
import { toast } from "sonner";

export function SheetSyncSettings({
  variant = "outline",
  size = "sm",
  fullWidth = false,
}: {
  variant?: "outline" | "default" | "ghost";
  size?: "sm" | "default";
  fullWidth?: boolean;
}) {
  const current = useSheetUrl();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(current);

  const connected = !!current;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) setValue(current);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`gap-2 ${fullWidth ? "w-full" : ""}`}
        >
          {connected ? (
            <CheckCircle2 className="h-4 w-4 text-primary" />
          ) : (
            <Cloud className="h-4 w-4" />
          )}
          {connected ? "Sinkron Sheets Aktif" : "Hubungkan Google Sheets"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sinkron ke Google Sheets</DialogTitle>
          <DialogDescription>
            Tempel URL Deployment Google Apps Script (Web App). Setiap Pesanan,
            Penjualan, dan Pengeluaran baru akan otomatis terkirim.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSheetUrl(value);
            toast.success(
              value.trim() ? "URL Sheets tersimpan" : "URL Sheets dihapus",
            );
            setOpen(false);
          }}
          className="space-y-3"
        >
          <div>
            <Label htmlFor="sheet-url">URL Deployment Apps Script</Label>
            <Input
              id="sheet-url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Pastikan Web App di-deploy dengan akses{" "}
              <b>Anyone / Siapa saja</b>.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            {connected && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setSheetUrl("");
                  setValue("");
                  toast.success("URL Sheets dihapus");
                  setOpen(false);
                }}
              >
                Hapus
              </Button>
            )}
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
