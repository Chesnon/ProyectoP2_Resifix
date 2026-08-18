import { Routes, Route } from "react-router-dom";

import Dashboard from "@/pages/Dashboard";
import AveriasPage from "@/pages/Averias";
import ResidentesPage from "@/pages/Residentes";
import TecnicosPage from "@/pages/Tecnicos";
import SeguimientosPage from "@/pages/Seguimientos";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/averias" element={<AveriasPage />} />
      <Route path="/residentes" element={<ResidentesPage />} />
      <Route path="/tecnicos" element={<TecnicosPage />} />
      <Route path="/seguimientos" element={<SeguimientosPage />} />
    </Routes>
  );
}
