
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AnexoBravoWizard } from "@/components/anexo-bravo/AnexoBravoWizard";
import { useRouter } from "@/hooks/useRouter";
import { useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function AnexoBravo() {
  const [showWizard, setShowWizard] = useState(false);
  const [searchParams] = useSearchParams();
  const { navigateTo } = useRouter();
  
  const operacionId = searchParams.get('operacion');

  useEffect(() => {
    // Si viene con operacionId, mostrar wizard directamente
    if (operacionId) {
      setShowWizard(true);
    }
  }, [operacionId]);

  const handleCreateAnexo = async (anexoId: string) => {
    toast({
      title: "Anexo Bravo creado",
      description: "El Anexo Bravo ha sido creado exitosamente como borrador.",
    });
    
    setShowWizard(false);
    navigateTo('/operaciones');
  };

  const handleCancel = () => {
    setShowWizard(false);
    if (operacionId) {
      navigateTo('/operaciones');
    }
  };

  if (showWizard) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col">
            <Header 
              title="Crear Anexo Bravo" 
              subtitle="Lista de chequeo para faenas de buceo" 
              icon={FileText} 
            >
              <Button variant="outline" onClick={handleCancel}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Header>
            
            <div className="flex-1 overflow-auto">
              <div className="p-6">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <AnexoBravoWizard
                      operacionId={operacionId || undefined}
                      onComplete={handleCreateAnexo}
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
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Anexo Bravo" 
            subtitle="Lista de chequeo para faenas de buceo" 
            icon={FileText} 
          >
            <Button onClick={() => setShowWizard(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Anexo Bravo
            </Button>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Crear Nuevo Anexo Bravo
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <div className="space-y-4">
                    <FileText className="w-16 h-16 text-green-600 mx-auto" />
                    <h3 className="text-lg font-semibold">Lista de Chequeo para Faenas de Buceo</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Cree un nuevo Anexo Bravo utilizando nuestro asistente paso a paso. 
                      Verifique todos los equipos y personal necesario para la faena.
                    </p>
                    <Button onClick={() => setShowWizard(true)} size="lg">
                      <Plus className="w-5 h-5 mr-2" />
                      Crear Anexo Bravo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Dialog open={showWizard} onOpenChange={setShowWizard}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
              <AnexoBravoWizard
                onComplete={handleCreateAnexo}
                onCancel={() => setShowWizard(false)}
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
}
