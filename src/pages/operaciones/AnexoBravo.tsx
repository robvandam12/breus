
import { MainLayout } from "@/components/layout/MainLayout";
import { FullAnexoBravoForm } from "@/components/anexo-bravo/FullAnexoBravoForm";
import { FileText } from "lucide-react";

export default function AnexoBravo() {
  const handleSubmit = async (data: any) => {
    console.log('Anexo Bravo submitted:', data);
    // Aquí iría la lógica para guardar
  };

  const handleCancel = () => {
    console.log('Anexo Bravo cancelled');
    // Aquí iría la lógica para cancelar
  };

  return (
    <MainLayout
      title="Anexo Bravo"
      subtitle="Formulario de Anexo Bravo para operaciones de buceo"
      icon={FileText}
      className="bg-white"
      contentClassName="bg-white"
    >
      <FullAnexoBravoForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </MainLayout>
  );
}
