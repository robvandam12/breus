
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, Filter, Info, Calendar, Zap } from "lucide-react";
import { useInmersionesTable } from '@/hooks/useInmersionesTable';
import { ImmersionCard } from './ImmersionCard';
import { IndependentImmersionForm } from './IndependentImmersionForm';
import { InmersionContextualForm } from './InmersionContextualForm';

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
    contextInfo,
    availableTabs,
    hasPlanning,
    handleCreateDirectInmersion,
    handleCreatePlannedInmersion,
  } = useInmersionesTable();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con información contextual */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inmersiones</h2>
          <p className="text-muted-foreground">
            {contextInfo.message}
          </p>
        </div>
        
        <div className="flex gap-2">
          {/* Botón crear inmersión independiente siempre disponible */}
          <Button onClick={() => setShowNewInmersionDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Inmersión
          </Button>
          
          {/* Botón crear inmersión planificada solo si tiene planning */}
          {hasPlanning && (
            <Button 
              variant="outline"
              onClick={() => setShowPlannedInmersionDialog(true)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Inmersión Planificada
            </Button>
          )}
        </div>
      </div>

      {/* Información contextual */}
      <Alert className={contextInfo.variant === 'destructive' ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {contextInfo.message}
        </AlertDescription>
      </Alert>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por código, objetivo o observaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="planificada">Planificada</SelectItem>
                <SelectItem value="en_proceso">En Proceso</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs dinámicas según módulos activos */}
      <Tabs value={typeFilter} onValueChange={setTypeFilter} className="w-full">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)` }}>
          {availableTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              {tab.id === 'planned' && <Calendar className="w-4 h-4" />}
              {tab.id === 'independent' && <Zap className="w-4 h-4" />}
              {tab.label}
              <Badge variant="secondary" className="ml-1">
                {tab.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {availableTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6">
            {filteredInmersiones.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
                      {tab.id === 'planned' ? <Calendar className="w-full h-full" /> : <Zap className="w-full h-full" />}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No hay {tab.label.toLowerCase()}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {tab.id === 'planned' 
                        ? 'No se encontraron inmersiones planificadas con los filtros aplicados.'
                        : 'No se encontraron inmersiones independientes con los filtros aplicados.'
                      }
                    </p>
                    <Button 
                      onClick={() => tab.id === 'planned' ? setShowPlannedInmersionDialog(true) : setShowNewInmersionDialog(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Crear {tab.id === 'planned' ? 'Inmersión Planificada' : 'Nueva Inmersión'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredInmersiones.map((inmersion) => (
                  <ImmersionCard 
                    key={inmersion.inmersion_id} 
                    inmersion={{
                      id: inmersion.inmersion_id,
                      fecha: inmersion.fecha_inmersion,
                      hora: inmersion.hora_inicio,
                      buzo: inmersion.buzo_principal,
                      supervisor: inmersion.supervisor,
                      estado: inmersion.estado,
                      profundidad: inmersion.profundidad_max,
                      objetivo: inmersion.objetivo,
                      codigo: inmersion.codigo,
                      operacion: inmersion.operacion_id ? `Operación ${inmersion.operacion_id}` : undefined
                    }} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Diálogo para nueva inmersión independiente */}
      <Dialog open={showNewInmersionDialog} onOpenChange={setShowNewInmersionDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Nueva Inmersión Independiente
            </DialogTitle>
            <DialogDescription>
              Crea una inmersión independiente sin operación asociada. Incluye la selección del personal de buceo para la inmersión.
            </DialogDescription>
          </DialogHeader>
          <IndependentImmersionForm 
            onSubmit={handleCreateDirectInmersion}
            onCancel={() => setShowNewInmersionDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo para inmersión planificada (solo si tiene planning) */}
      {hasPlanning && (
        <Dialog open={showPlannedInmersionDialog} onOpenChange={setShowPlannedInmersionDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Nueva Inmersión Planificada
              </DialogTitle>
              <DialogDescription>
                Crea una inmersión asociada a una operación planificada existente.
              </DialogDescription>
            </DialogHeader>
            <InmersionContextualForm 
              onSuccess={() => setShowPlannedInmersionDialog(false)}
              onCancel={() => setShowPlannedInmersionDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
