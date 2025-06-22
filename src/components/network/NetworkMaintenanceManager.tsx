
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Network, 
  Plus, 
  Settings, 
  FileText, 
  Activity,
  Eye,
  Edit
} from "lucide-react";
import { useMaintenanceNetworks } from "@/hooks/useMaintenanceNetworks";
import { NetworkMaintenanceWizard } from "@/components/network-maintenance/NetworkMaintenanceWizard";
import { NetworkMaintenanceList } from "@/components/network-maintenance/NetworkMaintenanceList";

export const NetworkMaintenanceManager = () => {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedInmersionId, setSelectedInmersionId] = useState<string>('');
  const [editingFormId, setEditingFormId] = useState<string>('');
  const [selectedFormType, setSelectedFormType] = useState<'mantencion' | 'faena'>('mantencion');

  const { canAccessModule, maintenanceForms, isLoading } = useMaintenanceNetworks();

  if (!canAccessModule) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <Network className="w-16 h-16 mx-auto mb-6 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Módulo de Mantención de Redes</h3>
            <p className="text-gray-600 mb-4">
              Este módulo no está disponible para tu organización
            </p>
            <p className="text-sm text-gray-500">
              Contacta al administrador para solicitar acceso a este módulo
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleCreateForm = (type: 'mantencion' | 'faena') => {
    setSelectedFormType(type);
    setActiveView('create');
  };

  const handleEditForm = (formId: string, formData: any) => {
    setEditingFormId(formId);
    setSelectedInmersionId(formData.inmersion_id);
    setSelectedFormType(formData.form_type);
    setActiveView('edit');
  };

  const handleViewForm = (formId: string, formData: any) => {
    // TODO: Implementar vista de solo lectura
    console.log('View form:', formId, formData);
  };

  const handleBackToList = () => {
    setActiveView('list');
    setEditingFormId('');
    setSelectedInmersionId('');
  };

  if (activeView === 'create' || activeView === 'edit') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handleBackToList}
            className="flex items-center gap-2"
          >
            ← Volver a la lista
          </Button>
        </div>
        
        <NetworkMaintenanceWizard
          operacionId={selectedInmersionId}
          tipoFormulario={selectedFormType}
          onComplete={handleBackToList}
          onCancel={handleBackToList}
          editingFormId={editingFormId || undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Network className="w-8 h-8 text-blue-600" />
            Mantención de Redes
          </h1>
          <p className="text-gray-600 mt-1">
            Administra formularios de mantenimiento y faenas de redes marinas
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => handleCreateForm('mantencion')}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Mantención
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => handleCreateForm('faena')}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Faena
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Formularios</p>
                <p className="text-2xl font-bold">{maintenanceForms.length}</p>
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
                  {maintenanceForms.filter(f => f.form_type === 'mantencion').length}
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
                  {maintenanceForms.filter(f => f.form_type === 'faena_redes').length}
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
                  {maintenanceForms.filter(f => f.status === 'completed').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forms Management */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="mantencion">Mantenimientos</TabsTrigger>
          <TabsTrigger value="faenas">Faenas</TabsTrigger>
          <TabsTrigger value="completed">Completados</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <NetworkMaintenanceList
            onEdit={handleEditForm}
            onView={handleViewForm}
          />
        </TabsContent>

        <TabsContent value="mantencion" className="space-y-4">
          <NetworkMaintenanceList
            onEdit={handleEditForm}
            onView={handleViewForm}
          />
        </TabsContent>

        <TabsContent value="faenas" className="space-y-4">
          <NetworkMaintenanceList
            onEdit={handleEditForm}
            onView={handleViewForm}
          />
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <NetworkMaintenanceList
            onEdit={handleEditForm}
            onView={handleViewForm}
          />
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Network className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Módulo de Mantención de Redes
              </h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• <strong>Mantenimientos:</strong> Registra trabajos de mantenimiento preventivo y correctivo</p>
                <p>• <strong>Faenas:</strong> Documenta operaciones específicas en redes de cultivo</p>
                <p>• <strong>Formularios operativos:</strong> Captura datos para análisis y reportes</p>
                <p>• <strong>Trazabilidad completa:</strong> Seguimiento desde planificación hasta ejecución</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
