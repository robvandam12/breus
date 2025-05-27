
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, ArrowLeft } from "lucide-react";
import { HPTWizard } from "@/components/hpt/HPTWizard";
import { useRouter } from "@/hooks/useRouter";
import { useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function HPT() {
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

  const handleCreateHPT = async (hptId: string) => {
    toast({
      title: "HPT creado",
      description: "La Hoja de Planificación de Tarea ha sido creada exitosamente.",
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
        <div className="min-h-screen flex w-full bg-white">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-white">
            <Header 
              title="Crear HPT" 
              subtitle="Hoja de Planificación de Tarea" 
              icon={FileText} 
            >
              <Button variant="outline" onClick={handleCancel}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Header>
            
            <div className="flex-1 overflow-auto bg-white">
              <div className="p-6">
                <HPTWizard
                  operacionId={operacionId || undefined}
                  onComplete={handleCreateHPT}
                  onCancel={handleCancel}
                />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col bg-white">
          <Header 
            title="HPT" 
            subtitle="Hoja de Planificación de Tarea" 
            icon={FileText} 
          >
            <Button onClick={() => setShowWizard(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo HPT
            </Button>
          </Header>
          
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Crear Nueva HPT
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <div className="space-y-4">
                    <FileText className="w-16 h-16 text-blue-600 mx-auto" />
                    <h3 className="text-lg font-semibold">Hoja de Planificación de Tarea</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Cree una nueva HPT utilizando nuestro asistente paso a paso. 
                      Planifique y documente todos los aspectos de seguridad para la tarea.
                    </p>
                    <Button onClick={() => setShowWizard(true)} size="lg">
                      <Plus className="w-5 h-5 mr-2" />
                      Crear HPT
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
