
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Anchor, Calendar, Users, MapPin, Clock, Eye, Edit, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { useInmersionesContextual } from "@/hooks/useInmersionesContextual";
import { useInmersiones } from "@/hooks/useInmersiones";
import { InmersionWizard } from "@/components/inmersion/InmersionWizard";
import { UniversalConfirmation } from "@/components/ui/universal-confirmation";
import { useUniversalConfirmation } from "@/hooks/useUniversalConfirmation";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const IndependentImmersionManager = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedImmersion, setSelectedImmersion] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'create' | 'edit' | 'view'>('create');
  
  // Use contextual hook for permissions and filtering
  const { 
    inmersiones, 
    isLoading: isLoadingContextual,
    capacidades 
  } = useInmersionesContextual();

  // Use CRUD hook for operations
  const {
    createInmersion,
    updateInmersion,
    deleteInmersion,
    isCreating
  } = useInmersiones();

  const {
    isOpen,
    isLoading,
    options,
    showConfirmation,
    handleConfirm,
    handleCancel,
    setIsOpen
  } = useUniversalConfirmation();

  // Filter only independent immersions (without operation or marked as independent)
  const independentImmersions = inmersiones?.filter(
    inmersion => !inmersion.operacion_id || inmersion.is_independent
  ) || [];

  const handleCreateNew = () => {
    setSelectedImmersion(null);
    setViewMode('create');
    setShowCreateForm(true);
  };

  const handleEdit = (inmersion: any) => {
    setSelectedImmersion(inmersion);
    setViewMode('edit');
    setShowCreateForm(true);
  };

  const handleView = (inmersion: any) => {
    setSelectedImmersion(inmersion);
    setViewMode('view');
    setShowCreateForm(true);
  };

  const handleDelete = (inmersion: any) => {
    showConfirmation({
      title: "Eliminar Inmersión",
      description: `¿Está seguro de que desea eliminar la inmersión "${inmersion.codigo}"? Esta acción no se puede deshacer.`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await deleteInmersion(inmersion.inmersion_id);
          toast({
            title: "Inmersión eliminada",
            description: "La inmersión ha sido eliminada exitosamente.",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "No se pudo eliminar la inmersión.",
            variant: "destructive",
          });
        }
      }
    });
  };

  const handleCreateSubmit = async (data: any) => {
    try {
      await createInmersion({
        ...data,
        is_independent: true,
        contexto_operativo: 'independiente',
        operacion_id: null // Ensure no operation is associated
      });
      setShowCreateForm(false);
      toast({
        title: "Inmersión creada",
        description: "La inmersión independiente ha sido creada exitosamente.",
      });
    } catch (error) {
      console.error('Error creating independent immersion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la inmersión independiente.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSubmit = async (data: any) => {
    if (!selectedImmersion) return;
    
    try {
      await updateInmersion({
        id: selectedImmersion.inmersion_id,
        data: data
      });
      setShowCreateForm(false);
      toast({
        title: "Inmersión actualizada",
        description: "La inmersión ha sido actualizada exitosamente.",
      });
    } catch (error) {
      console.error('Error updating immersion:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la inmersión.",
        variant: "destructive",
      });
    }
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

  if (isLoadingContextual) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Anchor className="w-8 h-8 text-blue-600" />
            Inmersiones Independientes
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona inmersiones que no requieren documentación previa (HPT/Anexo Bravo)
          </p>
        </div>
        
        <Button 
          onClick={handleCreateNew}
          disabled={!capacidades.puedeCrearInmersionesDirectas}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Inmersión Independiente
        </Button>
      </div>

      {/* Alert informativo */}
      {!capacidades.puedeCrearInmersionesDirectas && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-amber-800">
            <strong>Inmersiones independientes no habilitadas:</strong> Tu organización requiere documentación previa para todas las inmersiones.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Independientes</p>
                <p className="text-2xl font-bold">{independentImmersions.length}</p>
              </div>
              <Anchor className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Progreso</p>
                <p className="text-2xl font-bold">
                  {independentImmersions.filter(i => i.estado === 'en_progreso').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-2xl font-bold">
                  {independentImmersions.filter(i => i.estado === 'completada').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Planificadas</p>
                <p className="text-2xl font-bold">
                  {independentImmersions.filter(i => i.estado === 'planificada').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de inmersiones */}
      {independentImmersions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Anchor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay inmersiones independientes
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza creando tu primera inmersión independiente
            </p>
            {capacidades.puedeCrearInmersionesDirectas && (
              <Button onClick={handleCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Inmersión
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {independentImmersions.map((inmersion) => (
            <Card key={inmersion.inmersion_id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{inmersion.codigo}</h3>
                      <Badge className={getEstadoBadgeColor(inmersion.estado)}>
                        {inmersion.estado}
                      </Badge>
                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                        Independiente
                      </Badge>
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
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>Prof. máx: {inmersion.profundidad_max}m</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Objetivo:</span> {inmersion.objetivo}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(inmersion)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(inmersion)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(inmersion)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal para crear/editar inmersión */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewMode === 'create' && 'Nueva Inmersión Independiente'}
              {viewMode === 'edit' && 'Editar Inmersión'}
              {viewMode === 'view' && 'Ver Inmersión'}
            </DialogTitle>
          </DialogHeader>
          <InmersionWizard
            operationId="" // Sin operación para inmersiones independientes
            onComplete={viewMode === 'create' ? handleCreateSubmit : handleUpdateSubmit}
            onCancel={() => setShowCreateForm(false)}
            initialData={viewMode !== 'create' ? selectedImmersion : undefined}
            readOnly={viewMode === 'view'}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación universal */}
      <UniversalConfirmation
        open={isOpen}
        onOpenChange={setIsOpen}
        title={options.title}
        description={options.description}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        variant={options.variant}
        onConfirm={handleConfirm}
        loading={isLoading}
      />
    </div>
  );
};
