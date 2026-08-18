import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  seguimientosApi,
  averiasApi,
  tecnicosApi,
  EstadoAveria,
  type Seguimiento,
} from "@/lib/api";
import { estadoLabels, estadoBadgeClass, enumOptions } from "@/lib/enums";

interface SeguimientoForm {
  averiaId: string;
  tecnicoId: string;
  comentario: string;
  estadoAnterior: EstadoAveria;
  estadoNuevo: EstadoAveria;
}

function emptyForm(): SeguimientoForm {
  return {
    averiaId: "",
    tecnicoId: "",
    comentario: "",
    estadoAnterior: EstadoAveria.Reportada,
    estadoNuevo: EstadoAveria.EnRevision,
  };
}

export default function SeguimientosPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");

  const seguimientos = useQuery({
    queryKey: ["Seguimiento"],
    queryFn: seguimientosApi.list,
    retry: false,
  });
  const averias = useQuery({ queryKey: ["Averia"], queryFn: averiasApi.list, retry: false });
  const tecnicos = useQuery({ queryKey: ["Tecnico"], queryFn: tecnicosApi.list, retry: false });

  const averiaTitulo = (id: number) => averias.data?.find((a) => a.id === id)?.titulo ?? `#${id}`;
  const tecnicoName = (id: number) => {
    const t = tecnicos.data?.find((x) => x.id === id);
    return t ? `${t.nombre} ${t.apellido}` : `#${id}`;
  };

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<SeguimientoForm>(emptyForm());

  const openCreate = () => {
    setForm(emptyForm());
    setFormOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      await seguimientosApi.create({
        averiaId: Number(form.averiaId),
        tecnicoId: Number(form.tecnicoId),
        comentario: form.comentario,
        estadoAnterior: Number(form.estadoAnterior),
        estadoNuevo: Number(form.estadoNuevo),
      } as Partial<Seguimiento>);
    },
    onSuccess: () => {
      toast.success("Seguimiento registrado");
      setFormOpen(false);
      qc.invalidateQueries({ queryKey: ["Seguimiento"] });
    },
    onError: (e: Error) => toast.error(`No se pudo guardar: ${e.message}`),
  });

  const [toDelete, setToDelete] = useState<Seguimiento | null>(null);
  const deleteMutation = useMutation({
    mutationFn: (id: number) => seguimientosApi.remove(id),
    onSuccess: () => {
      toast.success("Seguimiento eliminado");
      setToDelete(null);
      qc.invalidateQueries({ queryKey: ["Seguimiento"] });
    },
    onError: (e: Error) => toast.error(`No se pudo eliminar: ${e.message}`),
  });

  const rows = useMemo(() => {
    const data = seguimientos.data ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter(
      (s) =>
        s.comentario.toLowerCase().includes(term) ||
        averiaTitulo(s.averiaId).toLowerCase().includes(term),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seguimientos.data, search, averias.data]);

  return (
    <AppShell>
      <div className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Seguimientos</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Historial de avances y cambios de estado registrados por los técnicos.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => seguimientos.refetch()}>
              <RefreshCw className={`size-4 ${seguimientos.isFetching ? "animate-spin" : ""}`} />
            </Button>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="size-4" /> Nuevo seguimiento
            </Button>
          </div>
        </header>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Buscar por avería o comentario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Badge variant="secondary">{rows.length} registros</Badge>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {seguimientos.isLoading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Cargando...
            </div>
          ) : seguimientos.isError ? (
            <div className="p-10 text-center">
              <p className="font-semibold">No se pudieron cargar los seguimientos</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {(seguimientos.error as Error).message}
              </p>
            </div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              Sin seguimientos todavía.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left text-xs tracking-wide uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Avería</th>
                    <th className="px-4 py-3 font-semibold">Técnico</th>
                    <th className="px-4 py-3 font-semibold">Cambio de estado</th>
                    <th className="px-4 py-3 font-semibold">Comentario</th>
                    <th className="px-4 py-3 font-semibold">Fecha</th>
                    <th className="px-4 py-3 text-right font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => (
                    <tr key={s.id} className="border-t border-border hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{averiaTitulo(s.averiaId)}</td>
                      <td className="px-4 py-3">{tecnicoName(s.tecnicoId)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Badge className={estadoBadgeClass[s.estadoAnterior]} variant="outline">
                            {estadoLabels[s.estadoAnterior]}
                          </Badge>
                          <span className="text-muted-foreground">→</span>
                          <Badge className={estadoBadgeClass[s.estadoNuevo]} variant="outline">
                            {estadoLabels[s.estadoNuevo]}
                          </Badge>
                        </div>
                      </td>
                      <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                        {s.comentario}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {String(s.fecha).slice(0, 10)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setToDelete(s)}
                            className="text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuevo seguimiento</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Avería</Label>
              <Select
                value={form.averiaId}
                onValueChange={(v) => setForm((s) => ({ ...s, averiaId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una avería" />
                </SelectTrigger>
                <SelectContent>
                  {(averias.data ?? []).map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Técnico</Label>
              <Select
                value={form.tecnicoId}
                onValueChange={(v) => setForm((s) => ({ ...s, tecnicoId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un técnico" />
                </SelectTrigger>
                <SelectContent>
                  {(tecnicos.data ?? []).map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.nombre} {t.apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Estado anterior</Label>
                <Select
                  value={String(form.estadoAnterior)}
                  onValueChange={(v) => setForm((s) => ({ ...s, estadoAnterior: Number(v) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {enumOptions(EstadoAveria, estadoLabels).map((o) => (
                      <SelectItem key={o.value} value={String(o.value)}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Estado nuevo</Label>
                <Select
                  value={String(form.estadoNuevo)}
                  onValueChange={(v) => setForm((s) => ({ ...s, estadoNuevo: Number(v) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {enumOptions(EstadoAveria, estadoLabels).map((o) => (
                      <SelectItem key={o.value} value={String(o.value)}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Comentario</Label>
              <Textarea
                value={form.comentario}
                onChange={(e) => setForm((s) => ({ ...s, comentario: e.target.value }))}
                placeholder="Ej: Se revisó la bomba de agua, se pidió repuesto..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !form.averiaId || !form.tecnicoId}
            >
              {saveMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este seguimiento?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => toDelete && deleteMutation.mutate(toDelete.id)}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
