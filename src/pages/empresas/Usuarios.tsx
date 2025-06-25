
import { MainLayout } from "@/components/layout/MainLayout";
import { Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Usuarios() {
  const { profile } = useAuth();
  
  return (
    <MainLayout
      title="Usuarios de Empresa"
      subtitle="Gestión de usuarios de la empresa"
      icon={Users}
    >
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Página de Usuarios - Test</h2>
          <p className="text-gray-600">
            Esta es una página de prueba para verificar la navegación.
          </p>
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p className="text-sm">
              <strong>Usuario actual:</strong> {profile?.nombre} {profile?.apellido}
            </p>
            <p className="text-sm">
              <strong>Rol:</strong> {profile?.role}
            </p>
            <p className="text-sm">
              <strong>Email:</strong> {profile?.email}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
