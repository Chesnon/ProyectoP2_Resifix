import { AppShell } from "@/components/layout/AppShell";
import { ResourceManager, type FieldDef } from "@/components/shared/ResourceManager";
import { residentesApi, type Residente } from "@/lib/api";

const fields: FieldDef<Residente>[] = [
  { key: "nombre", label: "Nombre", type: "text" },
  { key: "apellido", label: "Apellido", type: "text" },
  { key: "apartamento", label: "Apartamento", type: "text" },
  { key: "telefono", label: "Teléfono", type: "text" },
  { key: "email", label: "Email", type: "email" },
  { key: "fechaRegistro", label: "Fecha de registro", type: "date" },
  { key: "activo", label: "Activo", type: "boolean" },
];

export default function ResidentesPage() {
  return (
    <AppShell>
      <ResourceManager<Residente>
        title="Residentes"
        description="Personas registradas en el residencial que pueden reportar averías."
        queryKey="Residente"
        api={residentesApi}
        fields={fields}
        searchKeys={["nombre", "apellido", "apartamento", "email"]}
      />
    </AppShell>
  );
}
