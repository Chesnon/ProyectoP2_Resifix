import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ClipboardList,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Wand2,
} from "lucide-react";

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
  averiasApi,
  residentesApi,
  tecnicosApi,
  seguimientosApi,
  EstadoAveria,
  PrioridadAveria,
  type Averia,
} from "@/lib/api";
import {
  estadoLabels,
  estadoBadgeClass,
  prioridadLabels,
  prioridadBadgeClass,
  enumOptions,
} from "@/lib/enums";

interface AveriaForm {
  titulo: string;
  descripcion: string;
  areaComun: string;
  prioridad: PrioridadAveria;
  fotoUrl: string;
  residenteId: string;
}

function emptyForm(): AveriaForm {
  return {
    titulo: "",
    descripcion: "",
    areaComun: "",
    prioridad: PrioridadAveria.Media,
    fotoUrl: "",
    residenteId: "",
  };
}

export default function AveriasPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");

  const averias = useQuery({ queryKey: ["Averia"], queryFn: averiasApi.list, retry: false });
  const residentes = useQuery({
    queryKey: ["Residente"],
    queryFn: residentesApi.list,
    retry: false,
  });
  const tecnicos = useQuery({ queryKey: ["Tecnico"], queryFn: tecnicosApi.list, retry: false });

  const residenteName = (id: number) => {
    const r = residentes.data?.find((x) => x.id === id);
    return r ? `${r.nombre} ${r.apellido}` : `#${id}`;
  };
  const tecnicoName = (id?: number | null) => {
    if (!id) return "Sin asignar";
    const t = tecnicos.data?.find((x) => x.id === id);
    return t ? `${t.nombre} ${t.apellido}` : `#${id}`;
  };

  // ---- Crear / editar avería ----
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Averia | null>(null);
  const [form, setForm] = useState<AveriaForm>(emptyForm());

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setFormOpen(true);
  };
  const openEdit = (a: Averia) => {
    setEditing(a);
    setForm({
      titulo: a.titulo,
      descripcion: a.descripcion,
      areaComun: a.areaComun,
      prioridad: a.prioridad,
      fotoUrl: a.fotoUrl ?? "",
      residenteId: String(a.residenteId),
    });
    setFormOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        areaComun: form.areaComun,
        prioridad: Number(form.prioridad),
        fotoUrl: form.fotoUrl || null,
        residenteId: Number(form.residenteId),
      };
      if (editing) await averiasApi.update(editing.id, payload as Partial<Averia>);
      else await averiasApi.create(payload as Partial<Averia>);
    },
    onSuccess: () => {
      toast.success(editing ? "Avería actualizada" : "Avería reportada");
      setFormOpen(false);
      qc.invalidateQueries({ queryKey: ["Averia"] });
    },
    onError: (e: Error) => toast.error(`No se pudo guardar: ${e.message}`),
  });

  // ---- Cambiar estado / asignar técnico ----
  const [estadoTarget, setEstadoTarget] = useState<Averia | null>(null);
  const [estadoValue, setEstadoValue] = useState<EstadoAveria>(EstadoAveria.Reportada);
  const [tecnicoValue, setTecnicoValue] = useState<string>("");

  const openEstado = (a: Averia) => {
    setEstadoTarget(a);
    setEstadoValue(a.estado);
    setTecnicoValue(a.tecnicoId ? String(a.tecnicoId) : "");
  };

  const estadoMutation = useMutation({
    mutationFn: async () => {
      if (!estadoTarget) return;
      await averiasApi.updateEstado(estadoTarget.id, {
        estado: Number(estadoValue),
        tecnicoId: tecnicoValue ? Number(tecnicoValue) : null,
      });
    },
    onSuccess: () => {
      toast.success("Estado actualizado");
      setEstadoTarget(null);
      qc.invalidateQueries({ queryKey: ["Averia"] });
    },
    onError: (e: Error) => toast.error(`No se pudo actualizar el estado: ${e.message}`),
  });

  // ---- Ver seguimientos ----
  const [historyTarget, setHistoryTarget] = useState<Averia | null>(null);
  const history = useQuery({
    queryKey: ["Seguimiento", "porAveria", historyTarget?.id],
    queryFn: () => seguimientosApi.porAveria(historyTarget!.id),
    enabled: !!historyTarget,
  });

  // ---- Eliminar ----
  const [toDelete, setToDelete] = useState<Averia | null>(null);
  const deleteMutation = useMutation({
    mutationFn: (id: number) => averiasApi.remove(id),
    onSuccess: () => {
      toast.success("Avería eliminada");
      setToDelete(null);
      qc.invalidateQueries({ queryKey: ["Averia"] });
    },
    onError: (e: Error) => toast.error(`No se pudo eliminar: ${e.message}`),
  });

  const rows = useMemo(() => {
    const data = averias.data ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter(
      (a) =>
        a.titulo.toLowerCase().includes(term) ||
        a.areaComun.toLowerCase().includes(term) ||
        residenteName(a.residenteId).toLowerCase().includes(term),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [averias.data, search, residentes.data]);

  return (
    <AppShell>
      <div className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Averías</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Reportes de daños en áreas comunes: prioridad, estado y técnico asignado.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => averias.refetch()}>
              <RefreshCw className={`size-4 ${averias.isFetching ? "animate-spin" : ""}`} />
            </Button>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="size-4" /> Reportar avería
            </Button>
          </div>
        </header>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Buscar por título, área o residente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Badge variant="secondary">{rows.length} averías</Badge>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {averias.isLoading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Cargando...
            </div>
          ) : averias.isError ? (
            <div className="p-10 text-center">
              <p className="font-semibold">No se pudieron cargar las averías</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {(averias.error as Error).message}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Verifica que la API esté corriendo y que VITE_API_URL apunte a ella.
              </p>
            </div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              Sin averías reportadas todavía.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left text-xs tracking-wide uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Título</th>
                    <th className="px-4 py-3 font-semibold">Área común</th>
                    <th className="px-4 py-3 font-semibold">Prioridad</th>
                    <th className="px-4 py-3 font-semibold">Estado</th>
                    <th className="px-4 py-3 font-semibold">Residente</th>
                    <th className="px-4 py-3 font-semibold">Técnico</th>
                    <th className="px-4 py-3 font-semibold">Reportada</th>
                    <th className="px-4 py-3 text-right font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a) => (
                    <tr key={a.id} className="border-t border-border hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{a.titulo}</td>
                      <td className="px-4 py-3 text-muted-foreground">{a.areaComun}</td>
                      <td className="px-4 py-3">
                        <Badge className={prioridadBadgeClass[a.prioridad]} variant="outline">
                          {prioridadLabels[a.prioridad]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={estadoBadgeClass[a.estado]} variant="outline">
                          {estadoLabels[a.estado]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{residenteName(a.residenteId)}</td>
                      <td className="px-4 py-3">{tecnicoName(a.tecnicoId)}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {a.fechaReporte ? String(a.fechaReporte).slice(0, 10) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Cambiar estado / asignar técnico"
                            onClick={() => openEstado(a)}
                          >
                            <Wand2 className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Ver seguimientos"
                            onClick={() => setHistoryTarget(a)}
                          >
                            <ClipboardList className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(a)}>
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setToDelete(a)}
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

      {/* Crear / editar avería */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? `Editar avería #${editing.id}` : "Reportar avería"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={form.titulo}
                onChange={(e) => setForm((s) => ({ ...s, titulo: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                value={form.descripcion}
                onChange={(e) => setForm((s) => ({ ...s, descripcion: e.target.value }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Área común</Label>
                <Input
                  value={form.areaComun}
                  onChange={(e) => setForm((s) => ({ ...s, areaComun: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Prioridad</Label>
                <Select
                  value={String(form.prioridad)}
                  onValueChange={(v) => setForm((s) => ({ ...s, prioridad: Number(v) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {enumOptions(PrioridadAveria, prioridadLabels).map((o) => (
                      <SelectItem key={o.value} value={String(o.value)}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Residente que reporta</Label>
                <Select
                  value={form.residenteId}
                  onValueChange={(v) => setForm((s) => ({ ...s, residenteId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un residente" />
                  </SelectTrigger>
                  <SelectContent>
                    {(residentes.data ?? []).map((r) => (
                      <SelectItem key={r.id} value={String(r.id)}>
                        {r.nombre} {r.apellido} — {r.apartamento}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>URL de foto (opcional)</Label>
                <Input
                  value={form.fotoUrl}
                  onChange={(e) => setForm((s) => ({ ...s, fotoUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !form.titulo || !form.residenteId}
            >
              {saveMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cambiar estado / asignar técnico */}
      <Dialog open={!!estadoTarget} onOpenChange={(o) => !o && setEstadoTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar avería #{estadoTarget?.id}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={String(estadoValue)}
                onValueChange={(v) => setEstadoValue(Number(v))}
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
              <Label>Técnico asignado</Label>
              <Select value={tecnicoValue} onValueChange={setTecnicoValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Sin asignar" />
                </SelectTrigger>
                <SelectContent>
                  {(tecnicos.data ?? []).map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.nombre} {t.apellido} — {t.especialidad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEstadoTarget(null)}>
              Cancelar
            </Button>
            <Button onClick={() => estadoMutation.mutate()} disabled={estadoMutation.isPending}>
              {estadoMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Actualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ver seguimientos */}
      <Dialog open={!!historyTarget} onOpenChange={(o) => !o && setHistoryTarget(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Seguimientos de "{historyTarget?.titulo}"</DialogTitle>
          </DialogHeader>
          {history.isLoading ? (
            <div className="flex items-center justify-center gap-2 p-6 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Cargando...
            </div>
          ) : (history.data ?? []).length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              Todavía no hay seguimientos registrados para esta avería.
            </p>
          ) : (
            <ul className="space-y-3">
              {(history.data ?? []).map((s) => (
                <li key={s.id} className="rounded-lg border border-border p-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={estadoBadgeClass[s.estadoAnterior]} variant="outline">
                      {estadoLabels[s.estadoAnterior]}
                    </Badge>
                    <span className="text-muted-foreground">→</span>
                    <Badge className={estadoBadgeClass[s.estadoNuevo]} variant="outline">
                      {estadoLabels[s.estadoNuevo]}
                    </Badge>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {String(s.fecha).slice(0, 10)}
                    </span>
                  </div>
                  <p className="mt-2 text-foreground">{s.comentario}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Técnico: {tecnicoName(s.tecnicoId)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar avería #{toDelete?.id}?</AlertDialogTitle>
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
