
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, Eye, Edit, FileText, Calendar, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useInmersionesContextual } from '@/hooks/useInmersionesContextual';
import { useModularSystem } from '@/hooks/useModularSystem';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useOperaciones } from '@/hooks/useOperaciones';
import { InmersionWizard } from '@/components/inmersion/InmersionWizard';
import { toast } from '@/hooks/use-toast';

export const InmersionesDataTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showNewInmersionDialog, setShowNewInmersionDialog] = useState(false);
  const [showPlannedInmersionDialog, setShowPlannedInmersionDialog] = useState(false);
  
  const { 
    inmersiones, 
    isLoading, 
    estadisticas, 
    capacidades,
    operationalContext 
  } = useInmersionesContextual();
  
  const { hasModuleAccess, modules } = useModularSystem();
  const { createInmersion } = useInmersiones();
  const { operaciones } = useOperaciones();

  const filteredInmersiones = inmersiones.filter(inmersion => {
    const matchesSearch = inmersion.objetivo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inmersion.observaciones?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inmersion.codigo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || inmersion.estado === statusFilter;
    
    const matchesType = typeFilter === 'all' || 
                       (typeFilter === 'planned' && inmersion.operacion_id && !inmersion.is_independent) ||
                       (typeFilter === 'independent' && (!inmersion.operacion_id || inmersion.is_independent));
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Manejar creación de inmersión directa (CORE)
  const handleCreateDirectInmersion = async (data: any) => {
    try {
      const inmersionData = {
        ...data,
        is_independent: true,
        operacion_id: null, // Inmersión independiente
      };
      
      await createInmersion(inmersionData);
      toast({
        title: "Inmersión creada",
        description: "La inmersión independiente ha sido creada exitosamente.",
      });
      setShowNewInmersionDialog(false);
    } catch (error) {
      console.error('Error creating direct inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la inmersión independiente.",
        variant: "destructive",
      });
    }
  };

  // Manejar creación de inmersión planificada (PLANNING)
  const handleCreatePlannedInmersion = async (data: any) => {
    try {
      const inmersionData = {
        ...data,
        is_independent: false,
        // operacion_id viene del formulario
      };
      
      await createInmersion(inmersionData);
      toast({
        title: "Inmersión creada",
        description: "La inmersión planificada ha sido creada exitosamente.",
      });
      setShowPlannedInmersionDialog(false);
    } catch (error) {
      console.error('Error creating planned inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la inmersión planificada.",
        variant: "destructive",
      });
    }
  };

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

  const getContextInfo = () => {
    const hasPlanning = hasModuleAccess(modules.PLANNING_OPERATIONS);
    const canCreateDirect = capacidades.puedeCrearInmersionesDirectas;

    if (hasPlanning && canCreateDirect) {
      return {
        type: 'mixed',
        message: 'Puedes crear inmersiones planificadas (con operación) o independientes',
        variant: 'default' as const
      };
    } else if (hasPlanning && !canCreateDirect) {
      return {
        type: 'planned-only',
        message: 'Solo puedes crear inmersiones asociadas a operaciones planificadas',
        variant: 'default' as const
      };
    } else if (!hasPlanning && canCreateDirect) {
      return {
        type: 'direct-only',
        message: 'Inmersiones directas disponibles. El módulo de planificación no está activo',
        variant: 'default' as const
      };
    } else {
      return {
        type: 'restricted',
        message: 'Funcionalidad de inmersiones limitada. Contacta a tu administrador',
        variant: 'destructive' as const
      };
    }
  };

  const contextInfo = getContextInfo();

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
      <Alert variant={contextInfo.variant}>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {contextInfo.message}
        </AlertDescription>
      </Alert>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{estadisticas.total}</div>
              <div className="text-sm text-gray-600">Total Inmersiones</div>
            </div>
          </CardContent>
        </Card>
        
        {hasModuleAccess(modules.PLANNING_OPERATIONS) && (
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{estadisticas.planificadas}</div>
                <div className="text-sm text-gray-600">Planificadas</div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{estadisticas.independientes}</div>
              <div className="text-sm text-gray-600">Independientes</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{estadisticas.completadas}</div>
              <div className="text-sm text-gray-600">Completadas</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Inmersiones ({filteredInmersiones.length})
            </CardTitle>
            <div className="flex gap-2">
              {/* CORE: Siempre mostrar botón de nueva inmersión directa */}
              {capacidades.puedeCrearInmersionesDirectas && (
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => setShowNewInmersionDialog(true)}
                >
                  <Plus className="w-4 h-4" />
                  Nueva Inmersión
                </Button>
              )}
              {/* PLANNING: Solo mostrar si módulo está activo */}
              {capacidades.puedeCrearOperaciones && (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => setShowPlannedInmersionDialog(true)}
                >
                  <Calendar className="w-4 h-4" />
                  Desde Operación
                </Button>
              )}
            </div>
          </div>
          
          {/* Filtros */}
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar inmersiones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="min-w-[150px]">
              <Label htmlFor="status-filter">Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="planificada">Planificada</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasModuleAccess(modules.PLANNING_OPERATIONS) && (
              <div className="min-w-[150px]">
                <Label htmlFor="type-filter">Tipo</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="planned">Planificadas</SelectItem>
                    <SelectItem value="independent">Independientes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
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
            <div className="space-y-4">
              {filteredInmersiones.map((inmersion) => (
                <div key={inmersion.inmersion_id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">
                        {inmersion.objetivo || inmersion.codigo || `Inmersión ${inmersion.inmersion_id?.slice(0, 8)}`}
                      </h3>
                      {getStatusBadge(inmersion.estado)}
                      
                      {/* Indicadores de tipo */}
                      {inmersion.operacion_id && !inmersion.is_independent && (
                        <Badge variant="outline" className="text-blue-600 border-blue-300">
                          <Calendar className="w-3 h-3 mr-1" />
                          Planificada
                        </Badge>
                      )}
                      
                      {(!inmersion.operacion_id || inmersion.is_independent) && (
                        <Badge variant="outline" className="text-purple-600 border-purple-300">
                          Independiente
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      {inmersion.observaciones && (
                        <p>{inmersion.observaciones}</p>
                      )}
                      
                      {inmersion.operacion && (
                        <p className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Operación: {inmersion.operacion.nombre}
                        </p>
                      )}
                      
                      <p>Fecha: {inmersion.fecha_inmersion ? new Date(inmersion.fecha_inmersion).toLocaleDateString() : 'No programada'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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
