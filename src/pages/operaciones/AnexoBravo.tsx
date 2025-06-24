
import { MainLayout } from "@/components/layout/MainLayout";
import { AnexoBravoDataTable } from "@/components/anexo-bravo/AnexoBravoDataTable";
import { FileText } from "lucide-react";

export default function AnexoBravo() {
  return (
    <MainLayout
      title="Anexo Bravo"
      subtitle="Gestión de formularios Anexo Bravo para operaciones de buceo"
      icon={FileText}
    >
      <AnexoBravoDataTable />
    </MainLayout>
  );
}
