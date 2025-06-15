
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus, Anchor, LayoutGrid, LayoutList } from "lucide-react";
import { InmersionWizard } from "@/components/inmersion/InmersionWizard";
import { useInmersiones } from "@/hooks/useInmersiones";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useRouter } from "@/hooks/useRouter";
import { useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import InmersionesList from '@/components/inmersiones/InmersionesList';
import { InmersionDetailModal } from '@/components/inmersiones/InmersionDetailModal';
import type { Inmersion } from '@/types/inmersion';

export default function Inmersiones() {
  const [showWizard, setShowWizard] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedInmersion, setSelectedInmersion] = useState<Inmersion | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchParams] = useSearchParams();
  const { navigateTo } = useRouter();
  const { inmersiones, isLoading, createInmersion, refreshInmersiones } = useInmersiones();
  const { operaciones } = useOperaciones();
  
  const operacionId = searchParams.get('operacion');

  useEffect(() => {
    if (operacionId) {
      setShowWizard(true);
    }
  }, [operacionId]);

  const handleCreateInmersion = async (data: any) => {
    try {
      await createInmersion(data);
      toast({
        title: "Inmersión creada",
        description: "La inmersión ha sido creada exitosamente.",
      });
      setShowWizard(false);
      
      if (operacionId) {
        navigateTo('/operaciones');
      }
    } catch (error) {
      console.error('Error creating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la inmersión.",
        variant: "destructive",
      });
    }
  };

  const handleCancelWizard = () => {
    setShowWizard(false);
    if (operacionId) {
      navigateTo('/operaciones');
    }
  };

  const getOperacionData = (operacionId: string) => {
    return operaciones.find(op => op.id === operacionId);
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'planificada': return 'bg-blue-100 text-blue-800';
      case 'en_progreso': return 'bg-yellow-100 text-yellow-800';
      case 'completada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewInmersion = (inmersion: Inmersion) => {
    setSelectedInmersion(inmersion);
    setShowDetailModal(true);
  };

  if (showWizard) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-white">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-white">
            <Header title="Nueva Inmersión" subtitle="Crear inmersión de buceo" icon={Anchor} />
            <div className="flex-1 overflow-auto bg-white p-6">
              <InmersionWizard
                operationId={operacionId || undefined}
                onComplete={handleCreateInmersion}
                onCancel={handleCancelWizard}
              />
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col bg-white">
          <Header 
            title="Inmersiones" 
            subtitle="Gestión de inmersiones de buceo" 
            icon={Anchor} 
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-zinc-100 rounded-lg p-1">
                <Button variant={viewMode === 'cards' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('cards')} className="h-8 px-3">
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button variant={viewMode === 'table' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('table')} className="h-8 px-3">
                  <LayoutList className="w-4 h-4" />
                </Button>
              </div>
              <Button onClick={() => setShowWizard(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Inmersión
              </Button>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto bg-white p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando inmersiones...</p>
              </div>
            ) : (
              <InmersionesList
                viewMode={viewMode}
                inmersiones={inmersiones}
                operaciones={operaciones}
                getOperacionData={getOperacionData}
                getEstadoBadgeColor={getEstadoBadgeColor}
                onViewInmersion={handleViewInmersion}
                onNewInmersion={() => setShowWizard(true)}
              />
            )}
          </div>

          <InmersionDetailModal
            isOpen={showDetailModal}
            onClose={() => setShowDetailModal(false)}
            inmersion={selectedInmersion}
            operacion={selectedInmersion ? getOperacionData(selectedInmersion.operacion_id) : undefined}
            getEstadoBadgeColor={getEstadoBadgeColor}
          />
        </main>
      </div>
    </SidebarProvider>
  );
}
