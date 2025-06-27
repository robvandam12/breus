
import { MainLayout } from "@/components/layout/MainLayout";
import { Home } from "lucide-react";

const Dashboard = () => {
  return (
    <MainLayout
      title="Dashboard"
      subtitle="Resumen general del sistema"
      icon={Home}
    >
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Bienvenido al Dashboard</h2>
        <p className="text-gray-600">
          Esta es la página principal del sistema. Aquí puedes ver un resumen de todas las actividades.
        </p>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
