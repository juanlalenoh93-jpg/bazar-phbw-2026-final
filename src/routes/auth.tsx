import { createFileRoute } from "@tanstack/react-router";
import { Church, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { APP_TITLE, useOrgName } from "@/lib/branding";
import { setAuthUser, userFromGoogleCredential } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: { client_id: string; callback: (response: { credential?: string }) => void }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

function AuthPage() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const orgName = useOrgName();

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;

    const mountButton = () => {
      if (cancelled || !buttonRef.current || !window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          try {
            if (!response.credential) throw new Error("Credential Google kosong");
            const user = userFromGoogleCredential(response.credential);
            setAuthUser(user);
            toast.success(`Selamat datang, ${user.name}`);
          } catch {
            toast.error("Login Google gagal dibaca");
          }
        },
      });
      buttonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "signin_with",
        shape: "pill",
      });
      setReady(true);
    };

    if (window.google?.accounts?.id) {
      mountButton();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = mountButton;
    script.onerror = () => toast.error("Gagal memuat tombol Login Google");
    document.head.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid min-h-[75vh] place-items-center">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-6 text-center shadow-lg">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white">
          <Church className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-xl font-bold">PHBW 2026</h1>
        <p className="mt-1 text-sm font-medium text-foreground">{APP_TITLE}</p>
        <p className="mt-1 text-xs text-muted-foreground">{orgName}</p>

        <div className="mt-5 rounded-xl bg-muted/50 p-3 text-left text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>Pengguna wajib login memakai akun Google sebelum masuk ke aplikasi.</span>
          </div>
        </div>

        {GOOGLE_CLIENT_ID ? (
          <div className="mt-5 flex justify-center">
            <div ref={buttonRef} />
            {!ready && <Button disabled className="w-full">Memuat Login Google...</Button>}
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-left text-xs text-destructive">
            <b>Google Login belum aktif.</b><br />
            Tambahkan Environment Variable <code>VITE_GOOGLE_CLIENT_ID</code> di Vercel, lalu redeploy.
          </div>
        )}
      </div>
    </div>
  );
}
