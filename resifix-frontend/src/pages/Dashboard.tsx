import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { HardHat, ListChecks, Users, Wrench, AlertTriangle } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { averiasApi, residentesApi, tecnicosApi, EstadoAveria } from "@/lib/api";
import { estadoLabels, estadoBadgeClass, prioridadLabels, prioridadBadgeClass } from "@/lib/enums";

function StatCard({
  label,
  value,
  loading,
  icon: Icon,
  to,
}: {
  label: string;
  value: number;
  loading: boolean;
  icon: typeof Users;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <Icon className="size-4 text-primary" />
      </div>
      <p className="mt-3 text-4xl font-bold tabular-nums">{loading ? "—" : value}</p>
    </Link>
  );
}

export default function Dashboard() {
  const residentes = useQuery({
    queryKey: ["Residente"],
    queryFn: residentesApi.list,
    retry: false,
  });
  const tecnicos = useQuery({ queryKey: ["Tecnico"], queryFn: tecnicosApi.list, retry: false });
  const averias = useQuery({ queryKey: ["Averia"], queryFn: averiasApi.list, retry: false });

  const abiertas = (averias.data ?? []).filter(
    (a) => a.estado !== EstadoAveria.Resuelta && a.estado !== EstadoAveria.Cerrada,
  );
  const urgentes = (averias.data ?? []).filter(
    (a) => a.prioridad === 3 && a.estado !== EstadoAveria.Resuelta && a.estado !== EstadoAveria.Cerrada,
  );
  const tecnicosDisponibles = (tecnicos.data ?? []).filter((t) => t.disponible).length;

  const recientes = [...(averias.data ?? [])]
    .sort((a, b) => (a.fechaReporte < b.fechaReporte ? 1 : -1))
    .slice(0, 6);

  return (
    <AppShell>
      <div className="space-y-8">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Sistema de gestión
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Panel de averías</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Visión general de las averías reportadas, residentes y técnicos del residencial.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Averías abiertas"
            value={abiertas.length}
            loading={averias.isLoading}
            icon={Wrench}
            to="/averias"
          />
          <StatCard
            label="Prioridad urgente"
            value={urgentes.length}
            loading={averias.isLoading}
            icon={AlertTriangle}
            to="/averias"
          />
          <StatCard
            label="Residentes"
            value={residentes.data?.length ?? 0}
            loading={residentes.isLoading}
            icon={Users}
            to="/residentes"
          />
          <StatCard
            label="Técnicos disponibles"
            value={tecnicosDisponibles}
            loading={tecnicos.isLoading}
            icon={HardHat}
            to="/tecnicos"
          />
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="flex items-center gap-2 font-semibold">
              <ListChecks className="size-4 text-primary" />
              Averías recientes
            </h2>
            <Link to="/averias" className="text-xs font-medium text-primary hover:underline">
              Ver todas
            </Link>
          </div>
          {averias.isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Cargando...</p>
          ) : recientes.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              Sin averías reportadas todavía. Verifica que la API esté corriendo.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recientes.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center gap-3 p-4">
                  <span className="min-w-0 flex-1 truncate font-medium">{a.titulo}</span>
                  <span className="text-xs text-muted-foreground">{a.areaComun}</span>
                  <Badge className={prioridadBadgeClass[a.prioridad]} variant="outline">
                    {prioridadLabels[a.prioridad]}
                  </Badge>
                  <Badge className={estadoBadgeClass[a.estado]} variant="outline">
                    {estadoLabels[a.estado]}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}
