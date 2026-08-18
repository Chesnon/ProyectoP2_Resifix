import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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

export type FieldType = "text" | "email" | "number" | "date" | "boolean";

export interface FieldDef<T> {
  key: keyof T & string;
  label: string;
  type: FieldType;
  hideInTable?: boolean;
  renderCell?: (row: T) => ReactNode;
}

export interface ResourceApi<T> {
  list: () => Promise<T[]>;
  create: (data: Partial<T>) => Promise<void>;
  update: (id: number, data: Partial<T>) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

interface Props<T extends { id: number }> {
  title: string;
  description: string;
  queryKey: string;
  api: ResourceApi<T>;
  fields: FieldDef<T>[];
  searchKeys: (keyof T & string)[];
}

function emptyValues<T>(fields: FieldDef<T>[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    out[f.key] =
      f.type === "boolean"
        ? true
        : f.type === "number"
          ? 0
          : f.type === "date"
            ? new Date().toISOString().slice(0, 10)
            : "";
  }
  return out;
}

function formatCell(value: unknown, type: FieldType) {
  if (value === null || value === undefined || value === "") return "—";
  if (type === "date") return String(value).slice(0, 10);
  return String(value);
}

export function ResourceManager<T extends { id: number }>({
  title,
  description,
  queryKey,
  api,
  fields,
  searchKeys,
}: Props<T>) {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>(() => emptyValues(fields));
  const [toDelete, setToDelete] = useState<T | null>(null);

  const query = useQuery({ queryKey: [queryKey], queryFn: api.list, retry: false });
  const invalidate = () => qc.invalidateQueries({ queryKey: [queryKey] });

  const saveMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      if (editing) await api.update(editing.id, payload as Partial<T>);
      else await api.create(payload as Partial<T>);
    },
    onSuccess: () => {
      toast.success(editing ? "Registro actualizado" : "Registro creado");
      setFormOpen(false);
      invalidate();
    },
    onError: (e: Error) => toast.error(`No se pudo guardar: ${e.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.remove(id),
    onSuccess: () => {
      toast.success("Registro eliminado");
      setToDelete(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(`No se pudo eliminar: ${e.message}`),
  });

  const rows = useMemo(() => {
    const data = query.data ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter((row) =>
      searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(term)),
    );
  }, [query.data, search, searchKeys]);

  const openCreate = () => {
    setEditing(null);
    setValues(emptyValues(fields));
    setFormOpen(true);
  };

  const openEdit = (row: T) => {
    setEditing(row);
    const next: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = row[f.key] as unknown;
      next[f.key] = f.type === "date" && raw ? String(raw).slice(0, 10) : (raw ?? "");
    }
    setValues(next);
    setFormOpen(true);
  };

  const submit = () => {
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const v = values[f.key];
      if (f.type === "number") payload[f.key] = Number(v) || 0;
      else if (f.type === "boolean") payload[f.key] = Boolean(v);
      else if (f.type === "date") payload[f.key] = new Date(String(v)).toISOString();
      else payload[f.key] = String(v ?? "");
    }
    saveMutation.mutate(payload);
  };

  const tableFields = fields.filter((f) => !f.hideInTable);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => query.refetch()}>
            <RefreshCw className={`size-4 ${query.isFetching ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="size-4" /> Nuevo
          </Button>
        </div>
      </header>

      <div className="flex items-center gap-3">
        <Input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Badge variant="secondary">{rows.length} registros</Badge>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {query.isLoading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Cargando...
          </div>
        ) : query.isError ? (
          <div className="p-10 text-center">
            <p className="font-semibold">No se pudieron cargar los datos</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {(query.error as Error).message}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Verifica que la API esté corriendo y que VITE_API_URL apunte a ella.
            </p>
          </div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            Sin registros todavía.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs tracking-wide uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  {tableFields.map((f) => (
                    <th key={f.key} className="px-4 py-3 font-semibold">
                      {f.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {row.id}
                    </td>
                    {tableFields.map((f) => (
                      <td key={f.key} className="px-4 py-3">
                        {f.renderCell ? (
                          f.renderCell(row)
                        ) : f.type === "boolean" ? (
                          <Badge variant={row[f.key] ? "default" : "outline"}>
                            {row[f.key] ? "Sí" : "No"}
                          </Badge>
                        ) : (
                          formatCell(row[f.key], f.type)
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(row)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setToDelete(row)}
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

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Editar registro #${editing.id}` : `Nuevo registro`}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.type === "boolean" ? "sm:col-span-2" : ""}>
                {f.type === "boolean" ? (
                  <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <Label htmlFor={f.key}>{f.label}</Label>
                    <Switch
                      id={f.key}
                      checked={Boolean(values[f.key])}
                      onCheckedChange={(v) => setValues((s) => ({ ...s, [f.key]: v }))}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor={f.key}>{f.label}</Label>
                    <Input
                      id={f.key}
                      type={
                        f.type === "email"
                          ? "email"
                          : f.type === "number"
                            ? "number"
                            : f.type === "date"
                              ? "date"
                              : "text"
                      }
                      value={String(values[f.key] ?? "")}
                      onChange={(e) => setValues((s) => ({ ...s, [f.key]: e.target.value }))}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={submit} disabled={saveMutation.isPending}>
              {saveMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar registro #{toDelete?.id}?</AlertDialogTitle>
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
    </div>
  );
}
