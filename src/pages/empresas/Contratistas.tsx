
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
import { toast } from "@/hooks/use-toast";

export default function Contratistas() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteContratista, setDeleteContratista] = useState<{id: string, nombre: string} | null>(null);
  const { deleteContratista: deleteContratistaFn, isDeleting } = useContratistas();

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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Contratistas" 
            subtitle="Gestión de empresas contratistas y servicios de buceo" 
            icon={Building} 
          />
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Contratistas</h1>
                  <p className="text-gray-600">
                    Administra las empresas contratistas y sus servicios
                  </p>
                </div>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Contratista
                </Button>
              </div>

              <ContratistaTableView 
                onEdit={(contratista) => {
                  // Handle edit - could open edit form
                  console.log('Edit contratista:', contratista);
                }}
                onDelete={(contratista) => {
                  setDeleteContratista({
                    id: contratista.id,
                    nombre: contratista.nombre
                  });
                }}
              />

              {/* Create Form Modal */}
              {showCreateForm && (
                <CreateContratistaForm 
                  onClose={() => setShowCreateForm(false)}
                />
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
