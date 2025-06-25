
import { MainLayout } from "@/components/layout/MainLayout";
import { User } from "lucide-react";

const Profile = () => {
  return (
    <MainLayout
      title="Perfil"
      subtitle="Configuración del perfil de usuario"
      icon={User}
    >
      <div className="space-y-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Perfil de Usuario
          </h2>
          <p className="text-gray-600">
            Administra tu información personal y configuraciones.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
