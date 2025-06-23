
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
    createMaintenanceForm,
    getFormsByType,
    isCreating,
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
      'draft': { label: 'Borrador', variant: 'outline' as const },
      'completed': { label: 'Completado', variant: 'default' as const },
      'approved': { label: 'Aprobado', variant: 'secondary' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.draft;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  // FASE 3: Módulo de Mantención - Sistema extensible
  const moduleTypes = [
    {
      id: 'mantencion',
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
      id: 'faena_redes',
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
    },
    {
      id: 'inspeccion',
      title: 'Inspección de Estructuras',
      description: 'Evaluación de estado de infraestructura marina',
      icon: Activity,
      color: 'orange',
      features: [
        'Evaluación visual estructural',
        'Medición de desgaste',
        'Registro fotográfico',
        'Recomendaciones técnicas',
        'Planificación de reparaciones'
      ],
      coming_soon: true
    },
    {
      id: 'emergencia',
      title: 'Respuesta a Emergencias',
      description: 'Protocolo de respuesta rápida para incidentes',
      icon: FileText,
      color: 'red',
      features: [
        'Evaluación inicial de daños',
        'Acciones correctivas inmediatas',
        'Coordinación con equipos',
        'Registro de recursos utilizados',
        'Informe post-incidente'
      ],
      coming_soon: true
    }
  ];

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <NetworkMaintenanceWizard
          operacionId="temp-operation-id"
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
      {/* FASE 3: Tipos de Formularios Extensibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {moduleTypes.map((moduleType) => (
          <Card key={moduleType.id} className={`relative ${moduleType.coming_soon ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    moduleType.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    moduleType.color === 'green' ? 'bg-green-100 text-green-600' :
                    moduleType.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    <moduleType.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{moduleType.title}</CardTitle>
                    {moduleType.coming_soon && (
                      <Badge variant="outline" className="mt-1">Próximamente</Badge>
                    )}
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
                onClick={() => handleCreateNew(moduleType.id as any)}
                disabled={moduleType.coming_soon}
                variant={moduleType.coming_soon ? "outline" : "default"}
              >
                <Plus className="w-4 h-4 mr-2" />
                {moduleType.coming_soon ? 'Próximamente' : `Crear ${moduleType.title}`}
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
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="mantencion">Mantención</TabsTrigger>
              <TabsTrigger value="faena_redes">Faenas</TabsTrigger>
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
                          {form.form_type === 'mantencion' ? 
                            <Settings className="w-5 h-5 text-blue-600" /> :
                            <Wrench className="w-5 h-5 text-green-600" />
                          }
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {form.form_type === 'mantencion' ? 'Mantención de Redes' : 'Faena de Redes'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {form.created_at && format(new Date(form.created_at), 'PPP', { locale: es })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(form.status)}
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
                        <h4 className="font-medium">Mantención de Redes</h4>
                        <p className="text-sm text-gray-600">
                          {form.created_at && format(new Date(form.created_at), 'PPP', { locale: es })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(form.status)}
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
                        <h4 className="font-medium">Faena de Redes</h4>
                        <p className="text-sm text-gray-600">
                          {form.created_at && format(new Date(form.created_at), 'PPP', { locale: es })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(form.status)}
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
