
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowLeft, Plus, FileCheck } from "lucide-react";
import { AnexoBravoWizard } from "@/components/anexo-bravo/AnexoBravoWizard";
import { useRouter } from "@/hooks/useRouter";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function AnexoBravo() {
  const [showWizard, setShowWizard] = useState(false);
  const [wizardType, setWizardType] = useState<'simple' | 'complete'>('simple');
  const [searchParams] = useSearchParams();
  const { navigateTo } = useRouter();
  
  const operacionId = searchParams.get('operacion');

  const handleCreateAnexo = async (data: any) => {
    try {
      const anexoData = {
        ...data,
        operacion_id: operacionId || data.operacion_id
      };
      
      const { error } = await supabase.from('anexo_bravo').insert([anexoData]);
      if (error) throw error;
      
      toast({
        title: "Anexo Bravo creado",
        description: "El Anexo Bravo ha sido creado exitosamente.",
      });
      
      navigateTo('/operaciones');
    } catch (error) {
      console.error('Error creating Anexo Bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el Anexo Bravo.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setShowWizard(false);
    if (operacionId) {
      navigateTo('/operaciones');
    }
  };

  const handleCreateSimple = () => {
    setWizardType('simple');
    setShowWizard(true);
  };

  const handleCreateComplete = () => {
    setWizardType('complete');
    setShowWizard(true);
  };

  if (showWizard) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-white">
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
                <AnexoBravoWizard
                  onSubmit={handleCreateAnexo}
                  onCancel={handleCancel}
                  defaultOperacionId={operacionId || undefined}
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
        <main className="flex-1 flex flex-col">
          <Header 
            title="Anexo Bravo" 
            subtitle="Lista de chequeo para faenas de buceo" 
            icon={FileText} 
          />
          
          <div className="flex-1 overflow-auto bg-gray-50">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-orange-600" />
                      Nuevo Anexo Bravo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    <div className="space-y-4">
                      <FileText className="w-16 h-16 text-orange-600 mx-auto" />
                      <h3 className="text-lg font-semibold">Anexo Bravo Estándar</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Cree un Anexo Bravo con los elementos básicos requeridos para faenas de buceo estándar.
                      </p>
                      <Button onClick={handleCreateSimple} size="lg" className="bg-orange-600 hover:bg-orange-700">
                        <Plus className="w-5 h-5 mr-2" />
                        Crear Anexo Bravo
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-green-600" />
                      Nuevo Anexo Bravo Completo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    <div className="space-y-4">
                      <FileCheck className="w-16 h-16 text-green-600 mx-auto" />
                      <h3 className="text-lg font-semibold">Anexo Bravo Completo</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Cree un Anexo Bravo con todos los elementos extendidos para faenas de buceo complejas.
                      </p>
                      <Button onClick={handleCreateComplete} size="lg" className="bg-green-600 hover:bg-green-700">
                        <FileCheck className="w-5 h-5 mr-2" />
                        Crear Anexo Completo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
