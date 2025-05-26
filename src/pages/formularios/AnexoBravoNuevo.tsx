
import { useNavigate, useParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { AnexoBravoWizard } from "@/components/anexo-bravo/AnexoBravoWizard";

const AnexoBravoNuevo = () => {
  const navigate = useNavigate();
  const { anexoId } = useParams();

  const handleComplete = (finalAnexoId: string) => {
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
                onClick={() => navigate('/formularios/anexo-bravo')}
                className="mr-4 touch-target ios-button"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>

              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">
                    {anexoId ? 'Editar Anexo Bravo' : 'Nuevo Anexo Bravo'}
                  </h1>
                  <p className="text-sm text-zinc-500">
                    {anexoId ? 'Modificar Anexo de verificación' : 'Crear nuevo Anexo Bravo'}
                  </p>
                </div>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              <Card className="min-h-[600px]">
                <CardContent className="p-0">
                  <AnexoBravoWizard
                    anexoId={anexoId}
                    onComplete={handleComplete}
                    onCancel={handleCancel}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AnexoBravoNuevo;
