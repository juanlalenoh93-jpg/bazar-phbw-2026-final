import { Link } from "@tanstack/react-router";
import { Church } from "lucide-react";
import { useLogo, useRightLogo } from "@/lib/storage";
import { ORGANIZATION_NAME, useMainHeader } from "@/lib/branding";

export function AppHeader() {
  const logo = useLogo();
  const rightLogo = useRightLogo();
  const mainHeader = useMainHeader();

  return (
    <header className="border-b bg-card">
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex items-center gap-2">
          <LogoDisplay title="Logo Kiri" logo={logo} />
          <Link to="/" className="min-w-0 flex-1 text-center">
            <h1 className="text-sm font-bold leading-tight text-foreground sm:text-base">
              {mainHeader}
            </h1>
            <p className="text-[10px] font-medium text-muted-foreground sm:text-xs">
              {ORGANIZATION_NAME}
            </p>
          </Link>
          <LogoDisplay title="Logo Kanan" logo={rightLogo} />
        </div>
      </div>
    </header>
  );
}

function LogoDisplay({ title, logo }: { title: string; logo: string | null }) {
  return (
    <div
      aria-label={title}
      className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border bg-primary/10 text-primary"
    >
      {logo ? <img src={logo} alt={title} className="h-full w-full object-cover" /> : <Church className="h-6 w-6" />}
    </div>
  );
}
