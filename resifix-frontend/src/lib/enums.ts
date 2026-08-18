import { EstadoAveria, PrioridadAveria } from "@/lib/api";

export const estadoLabels: Record<EstadoAveria, string> = {
  [EstadoAveria.Reportada]: "Reportada",
  [EstadoAveria.EnRevision]: "En revisión",
  [EstadoAveria.EnProceso]: "En proceso",
  [EstadoAveria.Resuelta]: "Resuelta",
  [EstadoAveria.Cerrada]: "Cerrada",
};

export const estadoBadgeClass: Record<EstadoAveria, string> = {
  [EstadoAveria.Reportada]: "bg-slate-100 text-slate-700 border-slate-200",
  [EstadoAveria.EnRevision]: "bg-amber-100 text-amber-800 border-amber-200",
  [EstadoAveria.EnProceso]: "bg-sky-100 text-sky-800 border-sky-200",
  [EstadoAveria.Resuelta]: "bg-emerald-100 text-emerald-800 border-emerald-200",
  [EstadoAveria.Cerrada]: "bg-zinc-200 text-zinc-700 border-zinc-300",
};

export const prioridadLabels: Record<PrioridadAveria, string> = {
  [PrioridadAveria.Baja]: "Baja",
  [PrioridadAveria.Media]: "Media",
  [PrioridadAveria.Alta]: "Alta",
  [PrioridadAveria.Urgente]: "Urgente",
};

export const prioridadBadgeClass: Record<PrioridadAveria, string> = {
  [PrioridadAveria.Baja]: "bg-emerald-100 text-emerald-800 border-emerald-200",
  [PrioridadAveria.Media]: "bg-sky-100 text-sky-800 border-sky-200",
  [PrioridadAveria.Alta]: "bg-orange-100 text-orange-800 border-orange-200",
  [PrioridadAveria.Urgente]: "bg-red-100 text-red-800 border-red-200",
};

export function enumOptions<T extends Record<string, string | number>>(
  e: T,
  labels: Record<number, string>,
) {
  return Object.values(e)
    .filter((v): v is number => typeof v === "number")
    .map((value) => ({ value, label: labels[value] ?? String(value) }));
}
