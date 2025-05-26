
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AnexoBravoWizard } from "@/components/anexo-bravo/AnexoBravoWizard";
import { Anchor, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AnexoBravoNuevo = () => {
  const navigate = useNavigate();

  const handleComplete = (anexoId: string) => {
    navigate('/formularios/anexo-bravo');
  };

  const handleCancel = () => {
    navigate('/formularios/anexo-bravo');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/formularios/anexo-bravo')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Anexo Bravo
              </Button>
              <div className="flex items-center gap-3">
                <Anchor className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Nuevo Anexo Bravo</h1>
                  <p className="text-sm text-zinc-500">Crear Anexo Bravo Completo</p>
                </div>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              <AnexoBravoWizard
                onComplete={handleComplete}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AnexoBravoNuevo;
