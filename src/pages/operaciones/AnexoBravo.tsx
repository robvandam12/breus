
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { FullAnexoBravoForm } from "@/components/anexo-bravo/FullAnexoBravoForm";
import { FileText } from "lucide-react";

export default function AnexoBravo() {
  const handleSubmit = async (data: any) => {
    console.log('Anexo Bravo submitted:', data);
    // Aquí iría la lógica para guardar
  };

  const handleCancel = () => {
    console.log('Anexo Bravo cancelled');
    // Aquí iría la lógica para cancelar
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col bg-white">
          <Header 
            title="Anexo Bravo" 
            subtitle="Formulario de Anexo Bravo para operaciones de buceo" 
            icon={FileText} 
          />
          
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-6">
              <FullAnexoBravoForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
