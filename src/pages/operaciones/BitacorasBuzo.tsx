
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus, Book } from "lucide-react";
import { BitacorasBuzoManager } from "@/components/bitacoras/BitacorasBuzoManager";
import { CreateBitacoraBuzoForm } from "@/components/bitacoras/CreateBitacoraBuzoForm";
import { useBitacorasBuzo } from "@/hooks/useBitacorasBuzo";

export default function BitacorasBuzo() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { bitacoras, createBitacora } = useBitacorasBuzo();

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
            title="Bitácoras de Buzo" 
            subtitle="Registro de actividades y observaciones de buceo" 
            icon={Book} 
          >
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Bitácora
            </Button>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <BitacorasBuzoManager bitacoras={bitacoras} />

              {showCreateForm && (
                <CreateBitacoraBuzoForm 
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
