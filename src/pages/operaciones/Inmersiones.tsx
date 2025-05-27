
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus, Anchor } from "lucide-react";
import { InmersionesManager } from "@/components/inmersiones/InmersionesManager";
import { CreateInmersionFormEnhanced } from "@/components/inmersiones/CreateInmersionFormEnhanced";
import { useInmersiones } from "@/hooks/useInmersiones";
import { useSearchParams } from "react-router-dom";

export default function Inmersiones() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchParams] = useSearchParams();
  const { inmersiones, createInmersion } = useInmersiones();
  
  const operacionId = searchParams.get('operacion');

  const handleCreateInmersion = async (data: any) => {
    await createInmersion(data);
    setShowCreateForm(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Inmersiones" 
            subtitle="Gestión de inmersiones y planificación de buceo" 
            icon={Anchor} 
          >
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Inmersión
            </Button>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <InmersionesManager inmersiones={inmersiones} />

              {showCreateForm && (
                <CreateInmersionFormEnhanced 
                  onSubmit={handleCreateInmersion}
                  onCancel={() => setShowCreateForm(false)}
                  defaultOperacionId={operacionId || undefined}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
