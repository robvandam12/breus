
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, Calendar } from "lucide-react";
import { OperacionesManager } from "@/components/operaciones/OperacionesManager";
import { CreateOperacionForm } from "@/components/operaciones/CreateOperacionForm";

export default function Operaciones() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleOpenCreateForm = () => {
    console.log('Opening create form dialog');
    setShowCreateForm(true);
  };

  const handleCloseCreateForm = () => {
    console.log('Closing create form dialog');
    setShowCreateForm(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col bg-white">
          <Header 
            title="Operaciones" 
            subtitle="Gestión de operaciones de buceo y documentos asociados" 
            icon={Calendar} 
          >
            <Button onClick={handleOpenCreateForm}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo
            </Button>
          </Header>
          
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-6">
              <OperacionesManager />

              {/* Create Form Modal */}
              <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <CreateOperacionForm 
                    onClose={handleCloseCreateForm}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
