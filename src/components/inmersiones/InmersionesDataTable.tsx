
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InmersionWizard } from '@/components/inmersion/InmersionWizard';
import { useInmersionesTable } from '@/hooks/useInmersionesTable';

// Componentes refactorizados
import { InmersionesStats } from './InmersionesStats';
import { InmersionesFilters } from './InmersionesFilters';
import { InmersionesContextInfo } from './InmersionesContextInfo';
import { InmersionesActions } from './InmersionesActions';
import { InmersionesList } from './InmersionesList';

export const InmersionesDataTable = () => {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    showNewInmersionDialog,
    setShowNewInmersionDialog,
    showPlannedInmersionDialog,
    setShowPlannedInmersionDialog,
    filteredInmersiones,
    isLoading,
    estadisticas,
    capacidades,
    contextInfo,
    hasPlanning,
    handleCreateDirectInmersion,
    handleCreatePlannedInmersion,
  } = useInmersionesTable();

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'planificada':
        return <Badge className="bg-blue-100 text-blue-800">Planificada</Badge>;
      case 'en_proceso':
        return <Badge className="bg-yellow-100 text-yellow-800">En Proceso</Badge>;
      case 'completada':
        return <Badge className="bg-green-100 text-green-800">Completada</Badge>;
      case 'cancelada':
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">Cargando inmersiones...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Información contextual */}
      <InmersionesContextInfo contextInfo={contextInfo} />

      {/* Estadísticas */}
      <InmersionesStats estadisticas={estadisticas} hasPlanning={hasPlanning} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Inmersiones ({filteredInmersiones.length})
            </CardTitle>
            <InmersionesActions
              canCreateDirect={capacidades.puedeCrearInmersionesDirectas}
              canCreatePlanned={capacidades.puedeCrearOperaciones}
              onCreateDirect={() => setShowNewInmersionDialog(true)}
              onCreatePlanned={() => setShowPlannedInmersionDialog(true)}
            />
          </div>
          
          {/* Filtros */}
          <InmersionesFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            hasPlanning={hasPlanning}
          />
        </CardHeader>
        
        <CardContent>
          {filteredInmersiones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'No se encontraron inmersiones con los filtros aplicados'
                : 'No hay inmersiones registradas'
              }
            </div>
          ) : (
            <InmersionesList
              inmersiones={filteredInmersiones}
              getStatusBadge={getStatusBadge}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear inmersión directa (CORE) */}
      <Dialog open={showNewInmersionDialog} onOpenChange={setShowNewInmersionDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Inmersión Independiente</DialogTitle>
          </DialogHeader>
          <InmersionWizard
            onComplete={handleCreateDirectInmersion}
            onCancel={() => setShowNewInmersionDialog(false)}
            showOperationSelector={false}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog para crear inmersión planificada (PLANNING) */}
      <Dialog open={showPlannedInmersionDialog} onOpenChange={setShowPlannedInmersionDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Inmersión desde Operación</DialogTitle>
          </DialogHeader>
          <InmersionWizard
            onComplete={handleCreatePlannedInmersion}
            onCancel={() => setShowPlannedInmersionDialog(false)}
            showOperationSelector={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
