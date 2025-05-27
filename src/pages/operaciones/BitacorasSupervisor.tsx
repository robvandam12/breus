
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus, Book } from "lucide-react";
import { BitacorasSupervisorManager } from "@/components/bitacoras/BitacorasSupervisorManager";
import { CreateBitacoraSupervisorFormEnhanced } from "@/components/bitacoras/CreateBitacoraSupervisorFormEnhanced";
import { useBitacorasSupervisor } from "@/hooks/useBitacorasSupervisor";

export default function BitacorasSupervisor() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { bitacoras, createBitacora } = useBitacorasSupervisor();

  const handleCreateBitacora = async (data: any) => {
    await createBitacora(data);
    setShowCreateForm(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Bitácoras de Supervisor" 
            subtitle="Registro y seguimiento de bitácoras de supervisión" 
            icon={Book} 
          >
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Bitácora
            </Button>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <BitacorasSupervisorManager bitacoras={bitacoras} />

              {showCreateForm && (
                <CreateBitacoraSupervisorFormEnhanced 
                  onSubmit={handleCreateBitacora}
                  onCancel={() => setShowCreateForm(false)}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
