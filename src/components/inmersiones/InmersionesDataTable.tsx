
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, Anchor, Calendar, Users, Eye } from "lucide-react";
import { useInmersionesTable } from "@/hooks/useInmersionesTable";
import { InmersionesContextInfo } from "@/components/inmersiones/InmersionesContextInfo";
import { InmersionContextualForm } from "@/components/inmersiones/InmersionContextualForm";
import { InmersionActions } from "@/components/inmersion/InmersionActions";

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
    filteredInmersiones,
    isLoading,
    estadisticas,
    contextInfo,
    hasPlanning,
    handleCreateDirectInmersion,
  } = useInmersionesTable();

  const [selectedTab, setSelectedTab] = useState("all");

  // Filtrar inmersiones según la pestaña seleccionada
  const getFilteredInmersiones = () => {
    switch (selectedTab) {
      case "independent":
        return filteredInmersiones.filter(inmersion => inmersion.is_independent || !inmersion.operacion_id);
      case "planned":
        return filteredInmersiones.filter(inmersion => !inmersion.is_independent && inmersion.operacion_id);
      default:
        return filteredInmersiones;
    }
  };

  const tabInmersiones = getFilteredInmersiones();

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'planificada': return 'bg-blue-100 text-blue-800';
      case 'en_progreso': return 'bg-yellow-100 text-yellow-800';
      case 'completada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateInmersion = async (data: any) => {
    await handleCreateDirectInmersion(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Información contextual */}
      <InmersionesContextInfo contextInfo={contextInfo} />

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Anchor className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{estadisticas.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Planificadas</p>
                  <p className="text-2xl font-bold">{estadisticas.planificadas}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">En Progreso</p>
                  <p className="text-2xl font-bold">{estadisticas.en_progreso}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Completadas</p>
                  <p className="text-2xl font-bold">{estadisticas.completadas}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header con filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Anchor className="w-6 h-6 text-blue-600" />
              Gestión de Inmersiones
            </CardTitle>
            <Button
              onClick={() => setShowNewInmersionDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Inmersión
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
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
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="planificada">Planificada</SelectItem>
                <SelectItem value="en_progreso">En Progreso</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pestañas para tipos de inmersión */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Todas las Inmersiones</TabsTrigger>
              <TabsTrigger value="independent">Inmersiones Independientes</TabsTrigger>
              <TabsTrigger value="planned">Inmersiones Planificadas</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <InmersionesList inmersiones={tabInmersiones} getEstadoBadgeColor={getEstadoBadgeColor} />
            </TabsContent>

            <TabsContent value="independent" className="mt-6">
              <InmersionesList inmersiones={tabInmersiones} getEstadoBadgeColor={getEstadoBadgeColor} />
            </TabsContent>

            <TabsContent value="planned" className="mt-6">
              <InmersionesList inmersiones={tabInmersiones} getEstadoBadgeColor={getEstadoBadgeColor} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog para nueva inmersión */}
      <Dialog open={showNewInmersionDialog} onOpenChange={setShowNewInmersionDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Inmersión</DialogTitle>
          </DialogHeader>
          <InmersionContextualForm
            onSuccess={() => setShowNewInmersionDialog(false)}
            onCancel={() => setShowNewInmersionDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Componente para la lista de inmersiones
const InmersionesList = ({ inmersiones, getEstadoBadgeColor }: {
  inmersiones: any[];
  getEstadoBadgeColor: (estado: string) => string;
}) => {
  if (inmersiones.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Anchor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay inmersiones</h3>
          <p className="text-gray-600">No se encontraron inmersiones que coincidan con los filtros aplicados.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {inmersiones.map((inmersion) => (
        <Card key={inmersion.inmersion_id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-semibold text-lg">{inmersion.codigo}</h3>
                  <Badge className={getEstadoBadgeColor(inmersion.estado)}>
                    {inmersion.estado}
                  </Badge>
                  {inmersion.is_independent && (
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      Independiente
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{inmersion.fecha_inmersion}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{inmersion.buzo_principal}</span>
                  </div>
                  <div>
                    <span className="font-medium">Objetivo:</span> {inmersion.objetivo}
                  </div>
                </div>

                {inmersion.observaciones && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Observaciones:</span> {inmersion.observaciones}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                  <div>Profundidad: {inmersion.profundidad_max}m</div>
                  <div>Temperatura: {inmersion.temperatura_agua}°C</div>
                  <div>Visibilidad: {inmersion.visibilidad}m</div>
                </div>
              </div>

              <div className="ml-4">
                <InmersionActions inmersionId={inmersion.inmersion_id} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
