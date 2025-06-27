
import { MainLayout } from "@/components/layout/MainLayout";
import { Building2 } from "lucide-react";

const Empresas = () => {
  return (
    <MainLayout
      title="Empresas"
      subtitle="Gestión de salmoneras y contratistas"
      icon={Building2}
    >
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Gestión de Empresas</h2>
        <p className="text-gray-600">
          Aquí puedes gestionar salmoneras y empresas contratistas.
        </p>
      </div>
    </MainLayout>
  );
};

export default Empresas;
