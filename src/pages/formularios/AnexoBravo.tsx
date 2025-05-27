
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft } from "lucide-react";
import { AnexoBravoWizard } from "@/components/anexo-bravo/AnexoBravoWizard";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useRouter } from "@/hooks/useRouter";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function AnexoBravo() {
  const [searchParams] = useSearchParams();
  const { navigateTo } = useRouter();
  const { operaciones } = useOperaciones();
  
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
    if (operacionId) {
      navigateTo('/operaciones');
    } else {
      navigateTo('/operaciones');
    }
  };

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
