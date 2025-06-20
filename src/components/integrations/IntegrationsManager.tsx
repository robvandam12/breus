import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Zap, CheckCircle, AlertTriangle, Clock, Play, RefreshCw } from "lucide-react";
import { useIntegrations } from "@/hooks/useIntegrations";
import type { Integration, IntegrationLog } from "@/hooks/useIntegrations";

export const IntegrationsManager = () => {
  const {
    integrations,
    integrationLogs,
    isLoading,
    canAccessIntegrations,
    testIntegration,
    syncIntegration
  } = useIntegrations();

  if (!canAccessIntegrations) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Zap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Módulo de Integraciones
            </h3>
            <p className="text-gray-600">
              Este módulo no está habilitado para tu empresa.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Contacta al administrador para activar este módulo.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activa':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Activa</Badge>;
      case 'inactiva':
        return <Badge className="bg-gray-100 text-gray-800">Inactiva</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Error</Badge>;
      case 'configurando':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Configurando</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'api':
        return <Badge className="bg-blue-100 text-blue-800">API</Badge>;
      case 'webhook':
        return <Badge className="bg-purple-100 text-purple-800">Webhook</Badge>;
      case 'database':
        return <Badge className="bg-green-100 text-green-800">Database</Badge>;
      case 'file_sync':
        return <Badge className="bg-orange-100 text-orange-800">File Sync</Badge>;
      default:
        return <Badge>General</Badge>;
    }
  };

  const getLogStatusBadge = (estado: string) => {
    switch (estado) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge>Info</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Integraciones</h2>
          <p className="text-gray-600">Gestión de APIs externas y sincronización de datos</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Integración
        </Button>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
          <TabsTrigger value="logs">Logs de Actividad</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Activas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {integrations.filter(i => i.estado === 'activa').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Con Errores</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {integrations.filter(i => i.estado === 'error').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Zap className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">APIs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {integrations.filter(i => i.tipo === 'api').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Webhooks</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {integrations.filter(i => i.tipo === 'webhook').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Integraciones */}
          <Card>
            <CardHeader>
              <CardTitle>Integraciones Configuradas</CardTitle>
            </CardHeader>
            <CardContent>
              {!canAccessIntegrations ? (
                <div className="text-center">
                  <Zap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Módulo de Integraciones
                  </h3>
                  <p className="text-gray-600">
                    Este módulo no está habilitado para tu empresa.
                  </p>
                </div>
              ) : isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : integrations.length === 0 ? (
                <div className="text-center py-8">
                  <Zap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No hay integraciones configuradas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {integrations.map((integration) => (
                    <div
                      key={integration.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900">{integration.nombre}</h3>
                            <Badge className={integration.tipo === 'api' ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}>
                              {integration.tipo.toUpperCase()}
                            </Badge>
                            <Badge className={
                              integration.estado === 'activa' ? "bg-green-100 text-green-800" :
                              integration.estado === 'error' ? "bg-red-100 text-red-800" :
                              "bg-gray-100 text-gray-800"
                            }>
                              {integration.estado === 'activa' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {integration.estado === 'error' && <AlertTriangle className="w-3 h-3 mr-1" />}
                              {integration.estado}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{integration.descripcion}</p>
                          {integration.ultima_sincronizacion && (
                            <p className="text-xs text-gray-500">
                              Última sincronización: {new Date(integration.ultima_sincronizacion).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testIntegration(integration.id)}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Test
                          </Button>
                          {integration.estado === 'activa' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => syncIntegration(integration.id)}
                            >
                              <RefreshCw className="w-4 h-4 mr-1" />
                              Sync
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Actividad</CardTitle>
            </CardHeader>
            <CardContent>
              {integrationLogs.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No hay logs de actividad</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {integrationLogs.map((log) => (
                    <div
                      key={log.id}
                      className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">{log.mensaje}</span>
                            <Badge className={
                              log.estado === 'success' ? "bg-green-100 text-green-800" :
                              log.estado === 'error' ? "bg-red-100 text-red-800" :
                              "bg-yellow-100 text-yellow-800"
                            }>
                              {log.estado}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleString()} - {log.tipo}
                          </p>
                          {log.detalles && (
                            <pre className="text-xs text-gray-600 mt-2 bg-gray-100 p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.detalles, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
