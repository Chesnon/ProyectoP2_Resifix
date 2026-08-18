# ResiFix — Frontend de Gestión de Averías Residenciales

Panel web para reportar, asignar y dar seguimiento a averías en áreas comunes de un
residencial. Consume la API **AveriasResidenciales** (.NET).

## Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4 (paleta propia: azul petróleo + ámbar)
- React Router (rutas del lado del cliente)
- TanStack Query (datos remotos, caché, invalidación)
- Radix UI (diálogos, select, switch) + componentes propios estilo shadcn
- lucide-react (iconos) y sonner (notificaciones)

## Configuración de la API

**La URL de la API nunca está escrita en el código.** Se lee desde una variable de
entorno en tiempo de build/desarrollo:

1. Copia `.env.example` a `.env`
2. Ajusta el valor según dónde corra tu backend:

   ```
   VITE_API_URL=http://localhost:5100
   ```

3. Si despliegas el frontend en otro entorno (staging, producción), define
   `VITE_API_URL` con la URL pública de tu API antes de correr `npm run build`
   (por ejemplo, como variable de entorno en Vercel/Netlify/Docker), sin tocar
   el código fuente.

> Asegúrate de que el backend tenga habilitado CORS para el origen desde el que
> sirvas este frontend (el proyecto de referencia ya trae una política `AllowFrontend`
> abierta para desarrollo).

## Instalación y ejecución

```bash
npm install
npm run dev
```

Esto levanta el frontend en `http://localhost:5173`.

## Build de producción

```bash
npm run build
npm run preview   # sirve el build localmente para verificarlo
```

Los archivos listos para desplegar quedan en `dist/`.

## Estructura

```
src/
  lib/
    api.ts        Cliente HTTP tipado (Residente, Tecnico, Averia, Seguimiento)
    enums.ts       Etiquetas y colores para EstadoAveria / PrioridadAveria
    utils.ts       Helper cn() para clases de Tailwind
  components/
    layout/AppShell.tsx      Barra lateral y layout general
    shared/ResourceManager.tsx  Tabla CRUD genérica (usada en Residentes/Técnicos)
    ui/            Componentes base (Button, Input, Dialog, Select, etc.)
  pages/
    Dashboard.tsx       Panel con estadísticas
    Averias.tsx         Reportar/editar averías, cambiar estado, ver seguimientos
    Residentes.tsx      CRUD de residentes
    Tecnicos.tsx        CRUD de técnicos
    Seguimientos.tsx    Historial de cambios de estado por avería
```

## Endpoints que consume

| Recurso     | Endpoints                                                                 |
|-------------|-----------------------------------------------------------------------------|
| Residente   | `GET/POST /api/Residente`, `GET/PUT/DELETE /api/Residente/{id}`             |
| Tecnico     | `GET/POST /api/Tecnico`, `GET/PUT/DELETE /api/Tecnico/{id}`                 |
| Averia      | `GET/POST /api/Averia`, `GET/PUT/DELETE /api/Averia/{id}`, `PATCH /api/Averia/{id}/estado` |
| Seguimiento | `GET/POST /api/Seguimiento`, `GET/PUT/DELETE /api/Seguimiento/{id}`, `GET /api/Seguimiento/porAveria/{averiaId}` |
