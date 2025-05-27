
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { EquipoBuceoManager } from "@/components/equipo-buceo/EquipoBuceoManager";
import { CreateEquipoBuceoForm } from "@/components/equipo-buceo/CreateEquipoBuceoForm";
import { useEquiposBuceo } from "@/hooks/useEquiposBuceo";

export default function EquipoBuceo() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { equipos, createEquipo, updateEquipo, deleteEquipo } = useEquiposBuceo();

  const handleCreateEquipo = async (data: any) => {
    await createEquipo(data);
    setShowCreateForm(false);
  };

  const handleUpdateEquipo = async (id: string, data: any) => {
    await updateEquipo({ id, data });
  };

  const handleDeleteEquipo = async (id: string) => {
    await deleteEquipo(id);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Equipo de Buceo" 
            subtitle="Gestión de equipos y miembros de buceo" 
            icon={Users} 
          >
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Equipo
            </Button>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <EquipoBuceoManager
                equipos={equipos}
                onUpdate={handleUpdateEquipo}
                onDelete={handleDeleteEquipo}
              />

              {showCreateForm && (
                <CreateEquipoBuceoForm 
                  onSubmit={handleCreateEquipo}
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
