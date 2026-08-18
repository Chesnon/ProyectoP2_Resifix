import { AppShell } from "@/components/layout/AppShell";
import { ResourceManager, type FieldDef } from "@/components/shared/ResourceManager";
import { tecnicosApi, type Tecnico } from "@/lib/api";

const fields: FieldDef<Tecnico>[] = [
  { key: "nombre", label: "Nombre", type: "text" },
  { key: "apellido", label: "Apellido", type: "text" },
  { key: "especialidad", label: "Especialidad", type: "text" },
  { key: "telefono", label: "Teléfono", type: "text" },
  { key: "email", label: "Email", type: "email" },
  { key: "disponible", label: "Disponible", type: "boolean" },
];

export default function TecnicosPage() {
  return (
    <AppShell>
      <ResourceManager<Tecnico>
        title="Técnicos"
        description="Personal técnico disponible para atender averías."
        queryKey="Tecnico"
        api={tecnicosApi}
        fields={fields}
        searchKeys={["nombre", "apellido", "especialidad", "email"]}
      />
    </AppShell>
  );
}
