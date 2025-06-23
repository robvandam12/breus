
import React, { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Network, Wrench, Calendar, Users, Clock, Eye, Edit, Trash2 } from "lucide-react";
import { NetworkMaintenanceWizard } from "@/components/network-maintenance/NetworkMaintenanceWizard";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useNetworkMaintenance } from "@/hooks/useNetworkMaintenance";
import { useUniversalConfirmation } from "@/hooks/useUniversalConfirmation";
import { UniversalConfirmation } from "@/components/ui/universal-confirmation";
import { toast } from "@/hooks/use-toast";

export default function NetworkMaintenance() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<string>('');
  const [formType, setFormType] = useState<'mantencion' | 'faena_redes'>('mantencion');
  const [editingForm, setEditingForm] = useState<any>(null);
  
  const { operaciones } = useOperaciones();
  const { 
    networkMaintenanceForms, 
    loading, 
    deleteNetworkMaintenance 
  } = useNetworkMaintenance();

  const {
    isOpen,
    isLoading,
    options,
    showConfirmation,
    handleConfirm,
    handleCancel,
    setIsOpen
  } = useUniversalConfirmation();

  const handleCreateNew = (type: 'mantencion' | 'faena_redes') => {
    setFormType(type);
    setEditingForm(null);
    setShowCreateForm(true);
  };

  const handleEdit = (form: any) => {
    setEditingForm(form);
    setFormType(form.tipo_formulario);
    setShowCreateForm(true);
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
          toast({
            title: "Formulario eliminado",
            description: "El formulario ha sido eliminado exitosamente.",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "No se pudo eliminar el formulario.",
            variant: "destructive",
          });
        }
      }
    });
  };

  const handleFormComplete = () => {
    setShowCreateForm(false);
    setEditingForm(null);
    toast({
      title: "Formulario completado",
      description: "El formulario ha sido guardado exitosamente.",
    });
  };

  const getStatusBadgeColor = (estado: string) => {
    switch (estado) {
      case 'borrador': return 'bg-gray-100 text-gray-800';
      case 'completado': return 'bg-green-100 text-green-800';
      case 'aprobado': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (tipo: string) => {
    return tipo === 'mantencion' ? 'Mantención' : 'Faenas de Redes';
  };

  const maintenanceForms = networkMaintenanceForms.filter(f => f.tipo_formulario === 'mantencion');
  const faenaForms = networkMaintenanceForms.filter(f => f.tipo_formulario === 'faena_redes');

  return (
    <MainLayout
      title="Mantención de Redes"
      subtitle="Gestiona formularios de mantención y faenas de redes"
      icon={Network}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Formularios</p>
                  <p className="text-2xl font-bold">{networkMaintenanceForms.length}</p>
                </div>
                <Network className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Mantenciones</p>
                  <p className="text-2xl font-bold">{maintenanceForms.length}</p>
                </div>
                <Wrench className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Faenas de Redes</p>
                  <p className="text-2xl font-bold">{faenaForms.length}</p>
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
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="mantencion" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="mantencion" className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Mantención
              </TabsTrigger>
              <TabsTrigger value="faenas" className="flex items-center gap-2">
                <Network className="w-4 h-4" />
                Faenas de Redes
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button 
                onClick={() => handleCreateNew('mantencion')}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nueva Mantención
              </Button>
              <Button 
                onClick={() => handleCreateNew('faena_redes')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nueva Faena
              </Button>
            </div>
          </div>

          <TabsContent value="mantencion">
            <div className="space-y-4">
              {maintenanceForms.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No hay formularios de mantención
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Comienza creando tu primer formulario de mantención
                    </p>
                    <Button onClick={() => handleCreateNew('mantencion')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Primer Formulario
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                maintenanceForms.map((form) => (
                  <Card key={form.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{form.codigo}</h3>
                            <Badge className={getStatusBadgeColor(form.estado)}>
                              {form.estado}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{form.fecha || 'Sin fecha'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>Dotación: {form.multix_data?.dotacion?.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>Progreso: {form.multix_data?.progreso || 0}%</span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Lugar:</span> {form.lugar_trabajo || 'No especificado'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(form)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
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
                            onClick={() => handleDelete(form)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="faenas">
            <div className="space-y-4">
              {faenaForms.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Network className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No hay formularios de faenas
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Comienza creando tu primer formulario de faenas de redes
                    </p>
                    <Button onClick={() => handleCreateNew('faena_redes')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Primer Formulario
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                faenaForms.map((form) => (
                  <Card key={form.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{form.codigo}</h3>
                            <Badge className={getStatusBadgeColor(form.estado)}>
                              {form.estado}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{form.fecha || 'Sin fecha'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>Dotación: {form.multix_data?.dotacion?.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>Progreso: {form.multix_data?.progreso || 0}%</span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Lugar:</span> {form.lugar_trabajo || 'No especificado'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(form)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
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
                            onClick={() => handleDelete(form)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal para crear/editar formulario */}
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                {editingForm ? 'Editar' : 'Nuevo'} {getTypeLabel(formType)}
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <NetworkMaintenanceWizard
                operacionId={selectedOperation}
                tipoFormulario={formType}
                onComplete={handleFormComplete}
                onCancel={() => setShowCreateForm(false)}
                editingFormId={editingForm?.id}
              />
            </div>
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
    </MainLayout>
  );
}
