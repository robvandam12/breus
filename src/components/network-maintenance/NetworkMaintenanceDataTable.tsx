import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Edit, Trash2, Plus, Settings, Network, Activity } from "lucide-react";
import { NetworkMaintenanceWizard } from "./NetworkMaintenanceWizard";
import { useNetworkMaintenance } from "@/hooks/useNetworkMaintenance";

export const NetworkMaintenanceList = () => {
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

  const handleDeleteForm = async (formId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este formulario?')) {
      try {
        await deleteNetworkMaintenance(formId);
        await refetch();
      } catch (error) {
        console.error('Error deleting form:', error);
      }
    }
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completado':
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>;
      case 'en_progreso':
        return <Badge className="bg-blue-100 text-blue-800">En Progreso</Badge>;
      case 'borrador':
        return <Badge className="bg-gray-100 text-gray-800">Borrador</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Formularios de Mantención</CardTitle>
            <div className="flex gap-2">
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
          ) : networkMaintenanceForms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay formularios registrados
            </div>
          ) : (
            <div className="space-y-4">
              {networkMaintenanceForms.map((form) => (
                <div key={form.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{form.codigo}</h3>
                      {getStatusBadge(form.estado)}
                    </div>
                    <p className="text-sm text-gray-600">{form.lugar_trabajo}</p>
                    <p className="text-sm text-gray-500">{form.fecha}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewForm(form)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditForm(form)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteForm(form.id)}>
                      <Trash2 className="w-4 h-4" />
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
