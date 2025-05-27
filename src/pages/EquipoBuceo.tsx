
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { EquipoBuceoManager } from "@/components/equipo-buceo/EquipoBuceoManager";
import { Users } from "lucide-react";

const EquipoBuceo = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Equipo de Buceo" 
            subtitle="Gestión de equipos y miembros de buceo" 
            icon={Users} 
          />
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <EquipoBuceoManager />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EquipoBuceo;
