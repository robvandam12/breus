
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Calendar, MapPin, Users, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { useInmersiones, type Inmersion } from '@/hooks/useInmersiones';
import { UnifiedInmersionForm } from './UnifiedInmersionForm';

export const IndependentImmersionManager = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingInmersion, setEditingInmersion] = useState<Inmersion | null>(null);
  
  const {
    inmersiones,
    isLoading,
    createInmersion,
    updateInmersion,
    deleteInmersion
  } = useInmersiones();

  // Filter independent immersions
  const independentImmersions = inmersiones.filter(i => i.is_independent || !i.operacion_id);
  const completedImmersions = independentImmersions.filter(i => i.estado === 'completada').length;
  const inProgressImmersions = independentImmersions.filter(i => i.estado === 'en_progreso').length;
  const plannedImmersions = independentImmersions.filter(i => i.estado === 'planificada').length;

  const handleCreate = async (data: any) => {
    try {
      await createInmersion({
        ...data,
        is_independent: true,
        operacion_id: null
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating independent immersion:', error);
    }
  };

  const handleEdit = (inmersion: Inmersion) => {
    setEditingInmersion(inmersion);
  };

  const handleUpdate = async (data: any) => {
    if (!editingInmersion) return;
    
    try {
      await updateInmersion(editingInmersion.inmersion_id, data);
      setEditingInmersion(null);
    } catch (error) {
      console.error('Error updating immersion:', error);
    }
  };

  const handleDelete = async (inmersionId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta inmersión?')) {
      try {
        await deleteInmersion(inmersionId);
      } catch (error) {
        console.error('Error deleting immersion:', error);
      }
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "planificada":
        return "bg-blue-100 text-blue-700";
      case "en_progreso":
        return "bg-amber-100 text-amber-700";
      case "completada":
        return "bg-emerald-100 text-emerald-700";
      case "cancelada":
        return "bg-red-100 text-red-700";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "completada":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "en_progreso":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Calendar className="w-4 h-4 text-blue-600" />;
    }
  };

  if (showCreateForm) {
    return (
      <UnifiedInmersionForm
        onSubmit={handleCreate}
        onCancel={() => setShowCreateForm(false)}
      />
    );
  }

  if (editingInmersion) {
    return (
      <UnifiedInmersionForm
        initialData={editingInmersion}
        onSubmit={handleUpdate}
        onCancel={() => setEditingInmersion(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inmersiones Independientes</h2>
          <p className="text-gray-600">Gestiona inmersiones que no requieren operación planificada</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Inmersión
        </Button>
      </div>

      {/* Información sobre Inmersiones Independientes */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="w-4 h-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Inmersiones Independientes:</strong> Son inmersiones que no forman parte de una operación planificada 
          específica. Ideal para trabajos menores, inspecciones rápidas o inmersiones de emergencia.
        </AlertDescription>
      </Alert>

      {/* Estadísticas */}
      {independentImmersions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{independentImmersions.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{plannedImmersions}</div>
              <div className="text-sm text-gray-600">Planificadas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{inProgressImmersions}</div>
              <div className="text-sm text-gray-600">En Progreso</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{completedImmersions}</div>
              <div className="text-sm text-gray-600">Completadas</div>
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando inmersiones...</p>
        </div>
      ) : independentImmersions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay inmersiones independientes</h3>
            <p className="text-gray-500 mb-4">
              Crea tu primera inmersión independiente para comenzar
            </p>
            <Button onClick={() => setShowCreateForm(true)} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Crear Primera Inmersión
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {independentImmersions.map((inmersion) => (
            <Card key={inmersion.inmersion_id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getEstadoIcon(inmersion.estado)}
                    {inmersion.codigo}
                  </CardTitle>
                  <Badge className={getEstadoBadge(inmersion.estado)}>
                    {inmersion.estado}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  Profundidad: {inmersion.profundidad_max}m
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  {inmersion.buzo_principal}
                </div>
                
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600">
                    <strong>Objetivo:</strong> {inmersion.objetivo}
                  </p>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(inmersion)}
                    disabled={inmersion.estado === 'completada'}
                    className="flex-1"
                  >
                    {inmersion.estado === 'completada' ? 'Ver' : 'Editar'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(inmersion.inmersion_id)}
                    disabled={inmersion.estado === 'completada'}
                    className="text-red-600 hover:text-red-700"
                  >
                    {inmersion.estado === 'completada' ? 'Archivar' : 'Eliminar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
