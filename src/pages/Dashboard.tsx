
import { MainLayout } from "@/components/layout/MainLayout";
import { LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  return (
    <MainLayout
      title="Dashboard"
      subtitle="Panel de control principal"
      icon={LayoutDashboard}
    >
      <div className="space-y-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Bienvenido al Dashboard
          </h2>
          <p className="text-gray-600">
            Este es el panel principal de la aplicación.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
