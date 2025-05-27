
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, FileText, Anchor } from "lucide-react";
import { OperacionesManager } from "@/components/operaciones/OperacionesManager";
import { CreateOperacionForm } from "@/components/operaciones/CreateOperacionForm";
import { useNavigate } from "react-router-dom";

export default function Operaciones() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Operaciones" 
            subtitle="Gestión de operaciones de buceo y documentos asociados" 
            icon={Calendar} 
          />
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Operaciones</h1>
                  <p className="text-gray-600">
                    Administra operaciones de buceo, HPT, Anexo Bravo e inmersiones
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/formularios/hpt')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    + Nuevo HPT
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/formularios/anexo-bravo')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    + Nuevo Anexo
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/inmersiones')}
                  >
                    <Anchor className="w-4 h-4 mr-2" />
                    + Nueva Inmersión
                  </Button>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    + Nuevo
                  </Button>
                </div>
              </div>

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
