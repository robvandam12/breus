
import { MainLayout } from "@/components/layout/MainLayout";
import { FileText } from "lucide-react";

const Bitacoras = () => {
  return (
    <MainLayout
      title="Bitácoras"
      subtitle="Gestión de bitácoras de buceo"
      icon={FileText}
    >
      <div className="space-y-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Bitácoras de Buceo
          </h2>
          <p className="text-gray-600">
            Gestiona las bitácoras de buzo y supervisor.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Bitacoras;
