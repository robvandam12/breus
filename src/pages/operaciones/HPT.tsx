
import { MainLayout } from "@/components/layout/MainLayout";
import { HPTDataTable } from "@/components/hpt/HPTDataTable";
import { FileText } from "lucide-react";

export default function HPT() {
  return (
    <MainLayout
      title="HPT - Hoja de Planificación de Trabajo"
      subtitle="Gestión de Hojas de Planificación de Trabajo para operaciones de buceo"
      icon={FileText}
    >
      <HPTDataTable />
    </MainLayout>
  );
}
