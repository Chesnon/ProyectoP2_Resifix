import { Link, useLocation } from "react-router-dom";
import { Wrench, Users, HardHat, LayoutDashboard, ListChecks } from "lucide-react";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

const nav = [
  { to: "/", label: "Panel", icon: LayoutDashboard },
  { to: "/averias", label: "Averías", icon: Wrench },
  { to: "/residentes", label: "Residentes", icon: Users },
  { to: "/tecnicos", label: "Técnicos", icon: HardHat },
  { to: "/seguimientos", label: "Seguimientos", icon: ListChecks },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-sidebar p-4 text-sidebar-foreground md:flex">
        <div className="mb-8 flex items-center gap-2 px-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Wrench className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight">ResiFix</p>
            <p className="text-xs text-sidebar-foreground/60">Averías residenciales</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <p className="px-2 text-xs text-sidebar-foreground/40">
          Conectado a la API vía VITE_API_URL
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex gap-1 overflow-x-auto border-b border-border bg-card p-2 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
                pathname === item.to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
