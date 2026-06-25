import { createFileRoute, Link } from "@tanstack/react-router";
import { Church } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-6 text-center shadow-lg">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white">
          <Church className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-xl font-bold">PHBW 2026</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Login Supabase dinonaktifkan. Aplikasi berjalan sebagai personal app.
        </p>
        <Button asChild className="mt-5 w-full" size="lg">
          <Link to="/">Masuk ke Aplikasi</Link>
        </Button>
      </div>
    </div>
  );
}
