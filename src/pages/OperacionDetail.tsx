
import { useParams } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Briefcase } from "lucide-react";

const OperacionDetail = () => {
  const { id } = useParams();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col bg-white">
          <Header 
            title="Detalle de Operación" 
            subtitle={`Operación ID: ${id}`}
            icon={Briefcase} 
          />
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              <p>Detalle de la operación {id}</p>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default OperacionDetail;
