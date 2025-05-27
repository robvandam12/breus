import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus, Building } from "lucide-react";
import { ContratistaTableView } from "@/components/contratistas/ContratistaTableView";
import { CreateContratistaForm } from "@/components/contratistas/CreateContratistaForm";
import { DeleteContratistaDialog } from "@/components/contratistas/DeleteContratistaDialog";
import { useContratistas } from "@/hooks/useContratistas";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function Contratistas() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteContratista, setDeleteContratista] = useState<{id: string, nombre: string} | null>(null);
  const { contratistas, deleteContratista: deleteContratistaFn, createContratista, isDeleting } = useContratistas();
  const { profile } = useAuth();

  const handleDelete = async () => {
    if (!deleteContratista) return;
    
    try {
      await deleteContratistaFn(deleteContratista.id);
      toast({
        title: "Contratista eliminado",
        description: "El contratista ha sido eliminado exitosamente.",
      });
      setDeleteContratista(null);
    } catch (error) {
      console.error('Error deleting contratista:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el contratista.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteContratista = async (id: string) => {
    const contratista = contratistas.find(c => c.id === id);
    if (contratista) {
      setDeleteContratista({
        id: contratista.id,
        nombre: contratista.nombre
      });
    }
  };

  const handleCreateContratista = async (data: any) => {
    try {
      // Crear el contratista
      const newContratista = await createContratista(data);
      
      // Si el usuario es admin de salmonera, asociar automáticamente
      if (profile?.role === 'admin_salmonera' && profile?.salmonera_id && newContratista) {
        const { error: associationError } = await supabase
          .from('salmonera_contratista')
          .insert({
            salmonera_id: profile.salmonera_id,
            contratista_id: newContratista.id,
            estado: 'activa'
          });
          
        if (associationError) {
          console.error('Error associating contratista:', associationError);
        }
      }
      
      toast({
        title: "Contratista creado",
        description: "El contratista ha sido creado y asociado exitosamente.",
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating contratista:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el contratista.",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Contratistas" 
            subtitle="Gestión de empresas contratistas y servicios de buceo" 
            icon={Building}
          >
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Contratista
            </Button>
          </Header>
          <div className="flex-1 overflow-auto">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Contratistas</h1>
                  <p className="text-gray-600">
                    Administra las empresas contratistas y sus servicios
                  </p>
                </div>
              </div>

              <ContratistaTableView 
                contratistas={contratistas}
                onEdit={(contratista) => {
                  // Handle edit - could open edit form
                  console.log('Edit contratista:', contratista);
                }}
                onDelete={handleDeleteContratista}
                onSelect={(contratista) => {
                  // Handle select - could open details view
                  console.log('Select contratista:', contratista);
                }}
              />

              {/* Create Form - aparece abajo del listado */}
              {showCreateForm && (
                <div className="border-t pt-6">
                  <CreateContratistaForm 
                    onSubmit={handleCreateContratista}
                    onCancel={() => setShowCreateForm(false)}
                  />
                </div>
              )}

              {/* Delete Confirmation Dialog */}
              <DeleteContratistaDialog
                isOpen={!!deleteContratista}
                onClose={() => setDeleteContratista(null)}
                onConfirm={handleDelete}
                contratistaNombre={deleteContratista?.nombre || ''}
                isDeleting={isDeleting}
              />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
