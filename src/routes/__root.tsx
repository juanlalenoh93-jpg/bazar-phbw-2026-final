import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouterState,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { AppHeader } from "@/components/AppHeader";
import { Toaster } from "@/components/ui/sonner";
import { useAuth, getAuthUser } from "@/lib/auth";
import { ORGANIZATION_NAME } from "@/lib/branding";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PHBW 2026" },
      {
        name: "description",
        content: `Aplikasi manajemen keuangan bazar Panitia Hari Besar Wilayah 2026, ${ORGANIZATION_NAME}.`,
      },
      { property: "og:title", content: "PHBW 2026" },
      { name: "twitter:title", content: "PHBW 2026" },
      { property: "og:description", content: "Aplikasi Bazar PHBW 2026" },
      { name: "twitter:description", content: "Aplikasi Bazar PHBW 2026" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#047857" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "PHBW 2026" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="text-3xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">Halaman tidak ditemukan.</p>
        <a href="/" className="mt-4 inline-block text-primary underline">
          Kembali ke beranda
        </a>
      </div>
    </div>
  ),
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAuthPage = pathname === "/auth";
  const showHeader = pathname === "/" && !!user;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedUser = getAuthUser();
    if (!storedUser && !isAuthPage) {
      navigate({ to: "/auth", replace: true });
    } else if (storedUser && isAuthPage) {
      navigate({ to: "/", replace: true });
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    const register = () => navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        {showHeader && <AppHeader />}
        <main className="mx-auto max-w-5xl px-4 py-6">
          <Outlet />
        </main>
        <Toaster richColors closeButton position="bottom-center" />
      </div>
    </QueryClientProvider>
  );
}
