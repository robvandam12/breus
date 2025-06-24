
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Anchor, Plus, Eye, Edit, Trash2, Calendar, User, AlertTriangle } from 'lucide-react';
import { InmersionWizard } from '@/components/inmersion/InmersionWizard';
import { Badge } from '@/components/ui/badge';
import { useInmersiones } from '@/hooks/useInmersiones';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Inmersiones() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInmersion, setSelectedInmersion] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'create' | 'edit' | 'view'>('create');

  const { inmersiones, isLoading, createInmersion, updateInmersion, deleteInmersion } = useInmersiones();

  const handleCreateNew = () => {
    setSelectedInmersion(null);
    setViewMode('create');
    setShowCreateModal(true);
  };

  const handleEdit = (inmersion: any) => {
    setSelectedInmersion(inmersion);
    setViewMode('edit');
    setShowCreateModal(true);
  };

  const handleView = (inmersion: any) => {
    setSelectedInmersion(inmersion);
    setViewMode('view');
    setShowCreateModal(true);
  };

  const handleComplete = async (data: any) => {
    try {
      if (viewMode === 'edit') {
        await updateInmersion({ id: selectedInmersion.inmersion_id, ...data });
      } else {
        await createInmersion(data);
      }
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error saving immersion:', error);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'planificada': 'outline',
      'en_progreso': 'secondary',
      'completada': 'default',
      'cancelada': 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[estado as keyof typeof variants] || 'outline'}>
        {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <MainLayout title="Inmersiones" subtitle="Gestión de inmersiones" icon={Anchor}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Inmersiones"
      subtitle="Gestión y seguimiento de inmersiones"
      icon={Anchor}
    >
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Anchor className="w-5 h-5 text-blue-600" />
                  Gestión de Inmersiones
                </CardTitle>
                <CardDescription>
                  Crea y administra inmersiones independientes o asociadas a operaciones
                </CardDescription>
              </div>
              <Button onClick={handleCreateNew} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nueva Inmersión
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Anchor className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Inmersiones</p>
                  <p className="text-2xl font-bold">{inmersiones.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Planificadas</p>
                  <p className="text-2xl font-bold">
                    {inmersiones.filter(i => i.estado === 'planificada').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">En Progreso</p>
                  <p className="text-2xl font-bold">
                    {inmersiones.filter(i => i.estado === 'en_progreso').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Completadas</p>
                  <p className="text-2xl font-bold">
                    {inmersiones.filter(i => i.estado === 'completada').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inmersiones List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Inmersiones</CardTitle>
            <CardDescription>
              {inmersiones.length} inmersión(es) registrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inmersiones.length === 0 ? (
              <div className="text-center py-12">
                <Anchor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay inmersiones registradas
                </h3>
                <p className="text-gray-600 mb-6">
                  Comienza creando tu primera inmersión
                </p>
                <Button onClick={handleCreateNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Inmersión
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inmersiones.map((inmersion) => (
                  <Card key={inmersion.inmersion_id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{inmersion.codigo}</CardTitle>
                        {getEstadoBadge(inmersion.estado)}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {inmersion.objetivo}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>
                            {format(new Date(inmersion.fecha_inmersion), 'dd/MM/yyyy', { locale: es })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>{inmersion.buzo_principal}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Anchor className="w-4 h-4 text-gray-400" />
                          <span>{inmersion.profundidad_max}m</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end gap-2 mt-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(inmersion)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {inmersion.estado !== 'completada' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(inmersion)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal para crear/editar inmersión */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {viewMode === 'create' && 'Nueva Inmersión'}
                {viewMode === 'edit' && 'Editar Inmersión'}
                {viewMode === 'view' && 'Ver Inmersión'}
              </DialogTitle>
            </DialogHeader>
            <InmersionWizard
              onComplete={handleComplete}
              onCancel={() => setShowCreateModal(false)}
              initialData={viewMode !== 'create' ? selectedInmersion : undefined}
              readOnly={viewMode === 'view'}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
