/**
 * Cliente HTTP para la API de AveriasResidenciales (.NET)
 * Controladores: /api/Residente, /api/Tecnico, /api/Averia, /api/Seguimiento
 *
 * La URL base NUNCA se hardcodea: se lee de la variable de entorno
 * VITE_API_URL (definida en .env / .env.example). Así el mismo build
 * sirve para desarrollo, staging o producción sin tocar el código.
 */

const BASE_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:5100";

export function getApiUrl(): string {
  return BASE_URL;
}

// ----------------------------- Enums del dominio -----------------------------

export enum EstadoAveria {
  Reportada = 0,
  EnRevision = 1,
  EnProceso = 2,
  Resuelta = 3,
  Cerrada = 4,
}

export enum PrioridadAveria {
  Baja = 0,
  Media = 1,
  Alta = 2,
  Urgente = 3,
}

// ------------------------------ Tipos de datos ------------------------------

export interface BasePersona {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
}

export interface Residente extends BasePersona {
  apartamento: string;
  fechaRegistro: string;
  activo: boolean;
}

export interface Tecnico extends BasePersona {
  especialidad: string;
  disponible: boolean;
}

export interface Averia {
  id: number;
  titulo: string;
  descripcion: string;
  areaComun: string;
  prioridad: PrioridadAveria;
  estado: EstadoAveria;
  fotoUrl?: string | null;
  residenteId: number;
  tecnicoId?: number | null;
  fechaReporte: string;
  fechaResolucion?: string | null;
}

export interface Seguimiento {
  id: number;
  averiaId: number;
  tecnicoId: number;
  comentario: string;
  estadoAnterior: EstadoAveria;
  estadoNuevo: EstadoAveria;
  fecha: string;
}

// -------------------------------- Petición base --------------------------------

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getApiUrl()}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`);
  }
  if (res.status === 204) return undefined as T;
  const body = await res.text();
  return (body ? JSON.parse(body) : undefined) as T;
}

/** CRUD genérico sobre un controlador de la API */
function createResourceApi<T extends { id: number }>(controller: string) {
  return {
    list: () => request<T[]>(`/api/${controller}`),
    get: (id: number) => request<T>(`/api/${controller}/${id}`),
    create: (data: Partial<T>) =>
      request<void>(`/api/${controller}`, { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<T>) =>
      request<void>(`/api/${controller}/${id}`, {
        method: "PUT",
        body: JSON.stringify({ ...data, id }),
      }),
    remove: (id: number) => request<void>(`/api/${controller}/${id}`, { method: "DELETE" }),
  };
}

export const residentesApi = createResourceApi<Residente>("Residente");
export const tecnicosApi = createResourceApi<Tecnico>("Tecnico");
export const averiasApi = {
  ...createResourceApi<Averia>("Averia"),
  updateEstado: (id: number, data: { estado: EstadoAveria; tecnicoId?: number | null }) =>
    request<void>(`/api/Averia/${id}/estado`, { method: "PATCH", body: JSON.stringify(data) }),
};
export const seguimientosApi = {
  ...createResourceApi<Seguimiento>("Seguimiento"),
  porAveria: (averiaId: number) =>
    request<Seguimiento[]>(`/api/Seguimiento/porAveria/${averiaId}`),
};
