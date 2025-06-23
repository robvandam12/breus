
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, FileText, Calendar, MapPin, Eye, Edit, Trash2 } from 'lucide-react';
import { useNetworkMaintenance } from '@/hooks/useNetworkMaintenance';
import { NetworkMaintenanceWizard } from './NetworkMaintenanceWizard';
import { UniversalConfirmation } from '@/components/ui/universal-confirmation';
import { useUniversalConfirmation } from '@/hooks/useUniversalConfirmation';
import { toast } from '@/hooks/use-toast';

interface NetworkMaintenanceListProps {
  operacionId?: string;
  onEdit?: (formId: string, formData: any) => void;
  onView?: (formId: string, formData: any) => void;
}

export const NetworkMaintenanceList: React.FC<NetworkMaintenanceListProps> = ({ 
  operacionId,
  onEdit: onEditProp,
  onView: onViewProp
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'create' | 'edit' | 'view'>('create');
  
  const { 
    getAllNetworkMaintenance,
    getNetworkMaintenanceByOperacion,
    updateNetworkMaintenance,
    completeNetworkMaintenance,
    deleteNetworkMaintenance,
    loading 
  } = useNetworkMaintenance(operacionId);

  const {
    isOpen,
    isLoading,
    options,
    showConfirmation,
    handleConfirm,
    handleCancel,
    setIsOpen
  } = useUniversalConfirmation();

  // Obtener formularios según contexto
  const forms = operacionId 
    ? getNetworkMaintenanceByOperacion(operacionId)
    : getAllNetworkMaintenance();

  const handleCreateNew = () => {
    setSelectedForm(null);
    setViewMode('create');
    setShowCreateForm(true);
  };

  const handleEdit = (form: any) => {
    if (onEditProp) {
      onEditProp(form.id, form);
    } else {
      setSelectedForm(form);
      setViewMode('edit');
      setShowCreateForm(true);
    }
  };

  const handleView = (form: any) => {
    if (onViewProp) {
      onViewProp(form.id, form);
    } else {
      setSelectedForm(form);
      setViewMode('view');
      setShowCreateForm(true);
    }
  };

  const handleDelete = (form: any) => {
    showConfirmation({
      title: "Eliminar Formulario",
      description: `¿Está seguro de que desea eliminar el formulario "${form.codigo}"? Esta acción no se puede deshacer.`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await deleteNetworkMaintenance(form.id);
        } catch (error) {
          console.error('Error deleting form:', error);
        }
      }
    });
  };

  const handleComplete = (form: any) => {
    showConfirmation({
      title: "Completar Formulario",
      description: `¿Está seguro de que desea marcar como completado el formulario "${form.codigo}"? Esta acción no se puede deshacer.`,
      confirmText: "Completar",
      cancelText: "Cancelar",
      onConfirm: async () => {
        try {
          await completeNetworkMaintenance(form.id);
        } catch (error) {
          console.error('Error completing form:', error);
        }
      }
    });
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'borrador': return 'bg-gray-100 text-gray-800';
      case 'en_revision': return 'bg-yellow-100 text-yellow-800';
      case 'completado': return 'bg-green-100 text-green-800';
      case 'rechazado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoFormularioLabel = (tipo: string) => {
    switch (tipo) {
      case 'mantencion': return 'Mantención';
      case 'faena_redes': return 'Faena de Redes';
      default: return tipo;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Formularios de Mantención de Redes
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {operacionId 
              ? 'Formularios asociados a esta operación'
              : 'Todos los formularios de mantención de redes'
            }
          </p>
        </div>
        
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Formulario
        </Button>
      </div>

      {/* Lista de formularios */}
      {forms.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay formularios
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza creando tu primer formulario de mantención de redes
            </p>
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Formulario
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {forms.map((form) => (
            <Card key={form.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">{form.codigo}</h4>
                      <Badge className={getEstadoBadgeColor(form.estado)}>
                        {form.estado}
                      </Badge>
                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                        {getTipoFormularioLabel(form.tipo_formulario)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{form.fecha}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{form.lugar_trabajo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{form.nave_maniobras || 'Sin especificar'}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Progreso:</span> {form.multix_data?.progreso || 0}%
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(form)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {form.estado !== 'completado' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(form)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleComplete(form)}
                          className="text-green-600 hover:text-green-700"
                        >
                          Completar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(form)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal para crear/editar formulario - solo se muestra si no hay callbacks externos */}
      {!onEditProp && !onViewProp && (
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {viewMode === 'create' && 'Nuevo Formulario de Mantención'}
                {viewMode === 'edit' && 'Editar Formulario'}
                {viewMode === 'view' && 'Ver Formulario'}
              </DialogTitle>
            </DialogHeader>
            <NetworkMaintenanceWizard
              operacionId={operacionId}
              tipoFormulario="mantencion"
              onComplete={() => setShowCreateForm(false)}
              onCancel={() => setShowCreateForm(false)}
              editingFormId={viewMode !== 'create' ? selectedForm?.id : undefined}
              readOnly={viewMode === 'view'}
            />
          </DialogContent>
        </Dialog>
      )}

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
