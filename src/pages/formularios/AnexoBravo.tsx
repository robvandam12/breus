
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowLeft, Plus } from "lucide-react";
import { AnexoBravoWizard } from "@/components/anexo-bravo/AnexoBravoWizard";
import { useRouter } from "@/hooks/useRouter";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function AnexoBravo() {
  const [showWizard, setShowWizard] = useState(false);
  const [anexoType, setAnexoType] = useState<'simple' | 'completo'>('simple');
  const [searchParams] = useSearchParams();
  const { navigateTo } = useRouter();
  
  const operacionId = searchParams.get('operacion');

  React.useEffect(() => {
    if (operacionId) {
      setShowWizard(true);
    }
  }, [operacionId]);

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

  const handleNewAnexo = (type: 'simple' | 'completo') => {
    setAnexoType(type);
    setShowWizard(true);
  };

  if (showWizard) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-white">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-white">
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
            
            <div className="flex-1 overflow-auto bg-white">
              <div className="p-6">
                <AnexoBravoWizard
                  onSubmit={handleCreateAnexo}
                  onCancel={handleCancel}
                  defaultOperacionId={operacionId || undefined}
                  type={anexoType}
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
            title="Anexo Bravo" 
            subtitle="Lista de chequeo para faenas de buceo" 
            icon={FileText} 
          >
            <div className="flex gap-3">
              <Button onClick={() => handleNewAnexo('simple')}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Anexo Bravo
              </Button>
              <Button variant="outline" onClick={() => handleNewAnexo('completo')}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Anexo Bravo Completo
              </Button>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNewAnexo('simple')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Anexo Bravo Básico
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    <div className="space-y-4">
                      <FileText className="w-16 h-16 text-blue-600 mx-auto" />
                      <h3 className="text-lg font-semibold">Formulario Básico</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Cree un Anexo Bravo con los campos esenciales para la verificación de seguridad.
                      </p>
                      <Button size="lg">
                        <Plus className="w-5 h-5 mr-2" />
                        Crear Anexo Básico
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNewAnexo('completo')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      Anexo Bravo Completo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    <div className="space-y-4">
                      <FileText className="w-16 h-16 text-green-600 mx-auto" />
                      <h3 className="text-lg font-semibold">Formulario Completo</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Cree un Anexo Bravo completo con todos los campos y verificaciones detalladas.
                      </p>
                      <Button variant="outline" size="lg">
                        <Plus className="w-5 h-5 mr-2" />
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
