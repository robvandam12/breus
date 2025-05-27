
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { OperacionesManager } from "@/components/operaciones/OperacionesManager";
import { CreateOperacionForm } from "@/components/operaciones/CreateOperacionForm";

export default function Operaciones() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Operaciones" 
            subtitle="Gestión de operaciones de buceo y documentos asociados" 
            icon={Calendar} 
          >
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo
            </Button>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <OperacionesManager />

              {/* Create Form Modal */}
              {showCreateForm && (
                <CreateOperacionForm 
                  onClose={() => setShowCreateForm(false)}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
