
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Edit, Trash2, Plus, Settings, Network, Activity } from "lucide-react";
import { FishingNetworkMaintenanceForm } from "@/components/fishing-networks/FishingNetworkMaintenanceForm";
import { NetworkInstallationForm } from "@/components/fishing-networks/NetworkInstallationForm";
import { NetworkOperationsForm } from "@/components/fishing-networks/NetworkOperationsForm";
import { useNetworkMaintenance } from "@/hooks/useNetworkMaintenance";

export const NetworkMaintenanceDataTable = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedFormType, setSelectedFormType] = useState<'mantencion_redes' | 'instalacion_cambio_redes' | 'faenas_redes'>('mantencion_redes');

  const { 
    networkMaintenanceForms, 
    loading, 
    createNetworkMaintenance,
    updateNetworkMaintenance,
    deleteNetworkMaintenance,
    refetch 
  } = useNetworkMaintenance();

  const handleCreateForm = (type: 'mantencion_redes' | 'instalacion_cambio_redes' | 'faenas_redes') => {
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
          codigo: `${getFormTypeCode(selectedFormType)}-${Date.now()}`,
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

  const getFormTypeCode = (type: string) => {
    switch (type) {
      case 'mantencion_redes': return 'MANT';
      case 'instalacion_cambio_redes': return 'INST';
      case 'faenas_redes': return 'FAENA';
      default: return 'FORM';
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

  const getFormTypeBadge = (type: string) => {
    switch (type) {
      case 'mantencion_redes':
        return <Badge variant="outline" className="text-blue-700 border-blue-200">Mantención</Badge>;
      case 'instalacion_cambio_redes':
        return <Badge variant="outline" className="text-purple-700 border-purple-200">Instalación/Cambio</Badge>;
      case 'faenas_redes':
        return <Badge variant="outline" className="text-green-700 border-green-200">Faenas</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const mantencionForms = networkMaintenanceForms.filter(f => f.tipo_formulario === 'mantencion_redes');
  const instalacionForms = networkMaintenanceForms.filter(f => f.tipo_formulario === 'instalacion_cambio_redes');
  const faenaForms = networkMaintenanceForms.filter(f => f.tipo_formulario === 'faenas_redes');

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
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mantención</p>
                <p className="text-2xl font-bold">{mantencionForms.length}</p>
              </div>
              <Settings className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Instalación/Cambio</p>
                <p className="text-2xl font-bold">{instalacionForms.length}</p>
              </div>
              <Network className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Faenas</p>
                <p className="text-2xl font-bold">{faenaForms.length}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Formularios del Módulo de Redes</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => handleCreateForm('mantencion_redes')} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Mantención de Redes
              </Button>
              <Button variant="outline" onClick={() => handleCreateForm('instalacion_cambio_redes')} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Instalación/Cambio
              </Button>
              <Button variant="outline" onClick={() => handleCreateForm('faenas_redes')} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Faenas de Redes
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
                      {getFormTypeBadge(form.tipo_formulario)}
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
              {dialogMode === 'create' && `Crear ${getFormTitle(selectedFormType)}`}
              {dialogMode === 'edit' && 'Editar Formulario'}
              {dialogMode === 'view' && 'Ver Formulario'}
            </DialogTitle>
          </DialogHeader>
          {renderForm()}
        </DialogContent>
      </Dialog>
    </div>
  );

  function getFormTitle(type: string) {
    switch (type) {
      case 'mantencion_redes': return 'Mantención de Redes';
      case 'instalacion_cambio_redes': return 'Instalación/Cambio de Redes';
      case 'faenas_redes': return 'Faenas de Redes';
      default: return 'Formulario';
    }
  }

  function renderForm() {
    if (selectedFormType === 'mantencion_redes') {
      return (
        <FishingNetworkMaintenanceForm
          onComplete={handleFormComplete}
          onCancel={handleCloseDialog}
          readOnly={dialogMode === 'view'}
          initialData={selectedForm?.multix_data}
        />
      );
    } else if (selectedFormType === 'instalacion_cambio_redes') {
      return (
        <NetworkInstallationForm
          onComplete={handleFormComplete}
          onCancel={handleCloseDialog}
          readOnly={dialogMode === 'view'}
          initialData={selectedForm?.multix_data}
        />
      );
    } else if (selectedFormType === 'faenas_redes') {
      return (
        <NetworkOperationsForm
          onComplete={handleFormComplete}
          onCancel={handleCloseDialog}
          readOnly={dialogMode === 'view'}
          initialData={selectedForm?.multix_data}
        />
      );
    }
    return null;
  }
};

