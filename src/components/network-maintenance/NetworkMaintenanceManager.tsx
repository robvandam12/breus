import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Network, Settings, Wrench, Activity, Calendar, Users, FileText } from "lucide-react";
import { useMaintenanceNetworks } from '@/hooks/useMaintenanceNetworks';
import { NetworkMaintenanceWizard } from './NetworkMaintenanceWizard';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const NetworkMaintenanceManager = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedFormType, setSelectedFormType] = useState<'mantencion' | 'faena_redes'>('mantencion');
  const [editingForm, setEditingForm] = useState<string | null>(null);

  const {
    maintenanceForms,
    isLoading,
    getFormsByType,
  } = useMaintenanceNetworks();

  const handleCreateNew = (type: 'mantencion' | 'faena_redes') => {
    setSelectedFormType(type);
    setEditingForm(null);
    setShowCreateForm(true);
  };

  const handleEdit = (formId: string) => {
    setEditingForm(formId);
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingForm(null);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'borrador': { label: 'Borrador', variant: 'outline' as const },
      'completado': { label: 'Completado', variant: 'default' as const },
      'firmado': { label: 'Firmado', variant: 'secondary' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.borrador;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const moduleTypes = [
    {
      id: 'mantencion' as const,
      title: 'Mantención de Redes',
      description: 'Formulario completo de mantención preventiva y correctiva',
      icon: Settings,
      color: 'blue',
      features: [
        'Encabezado general y dotación',
        'Equipos de superficie',
        'Faenas de mantención específicas',
        'Sistemas y equipos operacionales',
        'Resumen y firmas digitales'
      ]
    },
    {
      id: 'faena_redes' as const,
      title: 'Faenas de Redes',
      description: 'Registro específico de trabajos en redes de cultivo',
      icon: Wrench,
      color: 'green',
      features: [
        'Matriz de actividades por jaula',
        'Cambios de pecera por buzo',
        'Registro de materiales utilizados',
        'Control de tiempos operativos',
        'Validación de seguridad'
      ]
    }
  ];

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <NetworkMaintenanceWizard
          operationId="temp-operation-id"
          tipoFormulario={selectedFormType}
          onComplete={handleCloseForm}
          onCancel={handleCloseForm}
          editingFormId={editingForm}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
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
                <p className="text-sm text-gray-600">Mantención</p>
                <p className="text-2xl font-bold">
                  {getFormsByType('mantencion').length}
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
                  {getFormsByType('faena_redes').length}
                </p>
              </div>
              <Wrench className="w-8 h-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-2xl font-bold">
                  {maintenanceForms.filter(f => f.estado === 'completado' || f.firmado).length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tipos de Formularios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {moduleTypes.map((moduleType) => (
          <Card key={moduleType.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    moduleType.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <moduleType.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{moduleType.title}</CardTitle>
                  </div>
                </div>
              </div>
              <CardDescription className="mt-2">
                {moduleType.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                {moduleType.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                onClick={() => handleCreateNew(moduleType.id)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear {moduleType.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lista de formularios existentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Formularios de Mantención
          </CardTitle>
          <CardDescription>
            Gestión de formularios de mantención de redes y estructuras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Todos ({maintenanceForms.length})</TabsTrigger>
              <TabsTrigger value="mantencion">Mantención ({getFormsByType('mantencion').length})</TabsTrigger>
              <TabsTrigger value="faena_redes">Faenas ({getFormsByType('faena_redes').length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">Cargando formularios...</div>
                ) : maintenanceForms.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No hay formularios de mantención creados
                  </div>
                ) : (
                  maintenanceForms.map((form) => (
                    <div key={form.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          {form.tipo_formulario === 'mantencion' ? 
                            <Settings className="w-5 h-5 text-blue-600" /> :
                            <Wrench className="w-5 h-5 text-green-600" />
                          }
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {form.codigo} - {form.tipo_formulario === 'mantencion' ? 'Mantención de Redes' : 'Faena de Redes'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {form.lugar_trabajo} - {form.fecha && format(new Date(form.fecha), 'PPP', { locale: es })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(form.estado)}
                        <Button variant="outline" size="sm" onClick={() => handleEdit(form.id)}>
                          Ver/Editar
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="mantencion">
              <div className="space-y-4">
                {getFormsByType('mantencion').map((form) => (
                  <div key={form.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Settings className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{form.codigo} - Mantención de Redes</h4>
                        <p className="text-sm text-gray-600">
                          {form.lugar_trabajo} - {form.fecha && format(new Date(form.fecha), 'PPP', { locale: es })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(form.estado)}
                      <Button variant="outline" size="sm" onClick={() => handleEdit(form.id)}>
                        Ver/Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="faena_redes">
              <div className="space-y-4">
                {getFormsByType('faena_redes').map((form) => (
                  <div key={form.id} className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{form.codigo} - Faena de Redes</h4>
                        <p className="text-sm text-gray-600">
                          {form.lugar_trabajo} - {form.fecha && format(new Date(form.fecha), 'PPP', { locale: es })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(form.estado)}
                      <Button variant="outline" size="sm" onClick={() => handleEdit(form.id)}>
                        Ver/Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
