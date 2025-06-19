
import React, { useState, useEffect, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Anchor, LayoutGrid, LayoutList, Edit, Eye } from "lucide-react";
import { InmersionWizard } from "@/components/inmersion/InmersionWizard";
import { useInmersiones } from "@/hooks/useInmersiones";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useRouter } from "@/hooks/useRouter";
import { useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { InmersionDetailModal } from '@/components/inmersiones/InmersionDetailModal';
import { InmersionesAdvancedFilters } from '@/components/inmersiones/InmersionesAdvancedFilters';
import { VirtualizedInmersionsList } from '@/components/inmersiones/VirtualizedInmersionsList';
import { VirtualizedInmersionsTable } from '@/components/inmersiones/VirtualizedInmersionsTable';
import { useInmersionesFiltersAdvanced } from '@/hooks/useInmersionesFiltersAdvanced';
import type { Inmersion } from '@/types/inmersion';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Inmersiones() {
  const isMobile = useIsMobile();
  const [showWizard, setShowWizard] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>(isMobile ? 'cards' : 'cards');
  const [selectedInmersion, setSelectedInmersion] = useState<Inmersion | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchParams] = useSearchParams();
  const { navigateTo } = useRouter();
  const { inmersiones, isLoading, createInmersion, updateInmersion, refreshInmersiones } = useInmersiones();
  const { operaciones } = useOperaciones();
  
  const operacionId = searchParams.get('operacion');

  // Usamos los filtros avanzados
  const {
    filters,
    updateFilter,
    clearFilters,
    filteredAndSortedInmersiones,
    filterOptions,
    hasActiveFilters,
  } = useInmersionesFiltersAdvanced(inmersiones);

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

  const handleUpdateInmersion = async (data: any) => {
    if (!selectedInmersion) return;
    
    try {
      await updateInmersion({ id: selectedInmersion.inmersion_id, data });
      toast({
        title: "Inmersión actualizada",
        description: "La inmersión ha sido actualizada exitosamente.",
      });
      setShowEditDialog(false);
      setSelectedInmersion(null);
      refreshInmersiones();
    } catch (error) {
      console.error('Error updating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la inmersión.",
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

  const getOperacionData = useCallback((operacionId: string) => {
    return operaciones.find(op => op.id === operacionId);
  }, [operaciones]);

  const getEstadoBadgeColor = useCallback((estado: string) => {
    switch (estado) {
      case 'planificada': return 'bg-blue-100 text-blue-800';
      case 'en_progreso': return 'bg-yellow-100 text-yellow-800';
      case 'completada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const handleViewInmersion = useCallback((inmersion: Inmersion) => {
    setSelectedInmersion(inmersion);
    setShowDetailModal(true);
  }, []);

  const handleEditInmersion = useCallback((inmersion: Inmersion) => {
    setSelectedInmersion(inmersion);
    setShowEditDialog(true);
  }, []);

  // Funciones de acción para las inmersiones
  const inmersionActions = [
    {
      label: "Ver Detalle",
      icon: <Eye className="w-4 h-4" />,
      onClick: handleViewInmersion,
      variant: "default" as const
    },
    {
      label: "Editar",
      icon: <Edit className="w-4 h-4" />,
      onClick: handleEditInmersion,
      variant: "outline" as const
    }
  ];

  if (showWizard) {
    return (
      <MainLayout
        title="Nueva Inmersión"
        subtitle="Crear inmersión de buceo"
        icon={Anchor}
      >
        <InmersionWizard
          operationId={operacionId || undefined}
          onComplete={handleCreateInmersion}
          onCancel={handleCancelWizard}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Inmersiones"
      subtitle="Gestión de inmersiones de buceo"
      icon={Anchor}
      headerChildren={
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center bg-zinc-100 rounded-lg p-1">
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
      }
    >
      <div className="space-y-6">
        {/* Filtros avanzados */}
        <InmersionesAdvancedFilters
          filters={filters}
          updateFilter={updateFilter}
          clearFilters={clearFilters}
          filterOptions={filterOptions}
          hasActiveFilters={hasActiveFilters}
          totalResults={filteredAndSortedInmersiones.length}
        />

        {/* Lista de inmersiones */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando inmersiones...</p>
          </div>
        ) : (
          <>
            {viewMode === 'cards' ? (
              <VirtualizedInmersionsList
                inmersiones={filteredAndSortedInmersiones}
                getOperacionData={getOperacionData}
                getEstadoBadgeColor={getEstadoBadgeColor}
                onViewInmersion={handleViewInmersion}
                onNewInmersion={() => setShowWizard(true)}
                containerHeight={650}
                actions={inmersionActions}
              />
            ) : (
              <VirtualizedInmersionsTable
                inmersiones={filteredAndSortedInmersiones}
                getOperacionData={getOperacionData}
                getEstadoBadgeColor={getEstadoBadgeColor}
                onViewInmersion={handleViewInmersion}
                containerHeight={650}
                actions={inmersionActions}
              />
            )}
          </>
        )}
      </div>

      {/* Modal de Detalle */}
      <InmersionDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        inmersion={selectedInmersion}
        operacion={selectedInmersion ? getOperacionData(selectedInmersion.operacion_id) : undefined}
        getEstadoBadgeColor={getEstadoBadgeColor}
      />

      {/* Modal de Edición */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Inmersión</DialogTitle>
          </DialogHeader>
          {selectedInmersion && (
            <InmersionWizard
              operationId={selectedInmersion.operacion_id}
              onComplete={handleUpdateInmersion}
              onCancel={() => setShowEditDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
