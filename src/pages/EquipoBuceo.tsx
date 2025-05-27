
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { EquipoBuceoManager } from "@/components/equipos/EquipoBuceoManager";

export default function EquipoBuceo() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Equipo de Buceo" 
            subtitle="Gestión de equipos y personal de buceo" 
            icon={Users} 
          >
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Equipo
            </Button>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <EquipoBuceoManager />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
