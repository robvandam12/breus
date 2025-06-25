
import { MainLayout } from "@/components/layout/MainLayout";
import { Settings } from "lucide-react";

const Mantenedores = () => {
  return (
    <MainLayout
      title="Mantenedores"
      subtitle="Gestión de datos maestros del sistema"
      icon={Settings}
    >
      <div className="space-y-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Mantenedores del Sistema
          </h2>
          <p className="text-gray-600">
            Administra los datos maestros y configuraciones del sistema.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Mantenedores;
