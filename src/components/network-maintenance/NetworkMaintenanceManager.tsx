
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Eye, Edit, Trash2, FileText, Settings, Network, Activity } from "lucide-react";
import { NetworkMaintenanceWizard } from "./NetworkMaintenanceWizard";
import { useNetworkMaintenance } from "@/hooks/useNetworkMaintenance";

export const NetworkMaintenanceManager = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedFormType, setSelectedFormType] = useState<'mantencion' | 'faena_redes'>('mantencion');

  const { 
    networkMaintenanceForms, 
    loading, 
    createNetworkMaintenance,
    updateNetworkMaintenance,
    deleteNetworkMaintenance,
    refetch 
  } = useNetworkMaintenance();

  const handleCreateForm = (type: 'mantencion' | 'faena_redes') => {
    setSelectedFormType(type);
    setDialogMode('create');
    setSelectedForm(null);
    setShowDialog(true);
  };

  const handleEditForm = (form: any) => {
    setSelectedForm(form);
    setSelectedFormType(form.tipo_formulario);
    setDialogMode('edit');
    setShowDialog(true);
  };

  const handleViewForm = (form: any) => {
    setSelectedForm(form);
    setSelectedFormType(form.tipo_formulario);
    setDialogMode('view');
    setShowDialog(true);
  };

  const handleFormComplete = async (formData: any) => {
    try {
      if (dialogMode === 'create') {
        await createNetworkMaintenance({
          ...formData,
          codigo: `MANT-${Date.now()}`,
          tipo_formulario: selectedFormType,
          multix_data: formData,
          estado: 'borrador',
          progreso: 0,
          firmado: false,
          user_id: 'current-user-id',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      } else if (dialogMode === 'edit' && selectedForm) {
        await updateNetworkMaintenance(selectedForm.id, {
          multix_data: formData,
          updated_at: new Date().toISOString()
        });
      }
      
      setShowDialog(false);
      await refetch();
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedForm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Formularios</p>
                <p className="text-2xl font-bold">{networkMaintenanceForms.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mantenimientos</p>
                <p className="text-2xl font-bold">
                  {networkMaintenanceForms.filter(f => f.tipo_formulario === 'mantencion').length}
                </p>
              </div>
              <Settings className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Faenas</p>
                <p className="text-2xl font-bold">
                  {networkMaintenanceForms.filter(f => f.tipo_formulario === 'faena_redes').length}
                </p>
              </div>
              <Network className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-2xl font-bold">
                  {networkMaintenanceForms.filter(f => f.estado === 'completado').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles principales */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              Mantención de Redes
            </CardTitle>
            <div className="flex items-center gap-3">
              <Button onClick={() => handleCreateForm('mantencion')}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Mantención
              </Button>
              
              <Button variant="outline" onClick={() => handleCreateForm('faena_redes')}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Faena
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando formularios...</div>
          ) : (
            <div className="space-y-4">
              {networkMaintenanceForms.map((form) => (
                <div key={form.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{form.codigo}</h3>
                      <Badge variant="outline">{form.tipo_formulario}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{form.lugar_trabajo}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewForm(form)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditForm(form)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' && 'Crear Formulario'}
              {dialogMode === 'edit' && 'Editar Formulario'}
              {dialogMode === 'view' && 'Ver Formulario'}
            </DialogTitle>
          </DialogHeader>
          <NetworkMaintenanceWizard
            operationId={selectedForm?.operacion_id || 'temp-operation-id'}
            tipoFormulario={selectedFormType}
            onComplete={handleFormComplete}
            onCancel={handleCloseDialog}
            readOnly={dialogMode === 'view'}
            initialData={selectedForm?.multix_data}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
