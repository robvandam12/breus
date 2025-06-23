
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Play, 
  RefreshCw, 
  Pause,
  Settings,
  Trash2,
  ExternalLink,
  Activity,
  Database,
  Webhook,
  Globe,
  FolderSync,
  Eye,
  AlertCircle,
  TrendingUp,
  Search
} from "lucide-react";
import { useIntegrations } from "@/hooks/useIntegrations";
import type { Integration, IntegrationLog, IntegrationTemplate } from "@/hooks/useIntegrations";

export const IntegrationsManager = () => {
  const {
    integrations,
    integrationLogs,
    integrationTemplates,
    isLoading,
    canAccessIntegrations,
    testIntegration,
    syncIntegration,
    pauseIntegration,
    resumeIntegration,
    deleteIntegration,
    createIntegration,
    isTesting
  } = useIntegrations();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);

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
      case 'testing':
        return <Badge className="bg-blue-100 text-blue-800"><Play className="w-3 h-3 mr-1" />Testing</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'api':
        return <Globe className="w-4 h-4" />;
      case 'webhook':
        return <Webhook className="w-4 h-4" />;
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'file_sync':
        return <FolderSync className="w-4 h-4" />;
      case 'saas':
        return <Zap className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
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
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const filteredIntegrations = integrations.filter(integration =>
    integration.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    integration.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    integration.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLogs = integrationLogs.filter(log => 
    log.mensaje.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateFromTemplate = async (template: IntegrationTemplate) => {
    try {
      await createIntegration({
        nombre: template.nombre,
        tipo: template.tipo as any,
        descripcion: template.descripcion,
        estado: 'configurando',
        configuracion: template.configuracion_default,
        ultima_sincronizacion: null,
        proxima_sincronizacion: null
      });
      setShowTemplatesDialog(false);
    } catch (error) {
      console.error('Error creating integration:', error);
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
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => setShowTemplatesDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Desde Plantilla
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Integración
          </Button>
        </div>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
          <TabsTrigger value="logs">Logs de Actividad</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
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
                  <Activity className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Sincronizaciones Hoy</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {integrationLogs.filter(log => 
                        log.tipo === 'sync' && 
                        new Date(log.timestamp).toDateString() === new Date().toDateString()
                      ).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Uptime Promedio</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {integrations.length > 0 
                        ? Math.round(integrations.reduce((acc, i) => acc + (i.metricas?.uptime_percentage || 0), 0) / integrations.length)
                        : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar integraciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Lista de Integraciones */}
          <Card>
            <CardHeader>
              <CardTitle>Integraciones Configuradas</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ) : filteredIntegrations.length === 0 ? (
                <div className="text-center py-8">
                  <Zap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No hay integraciones configuradas</p>
                  <Button 
                    onClick={() => setShowTemplatesDialog(true)}
                    className="mt-4"
                    variant="outline"
                  >
                    Explorar Plantillas
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Integración</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Última Sync</TableHead>
                        <TableHead>Uptime</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredIntegrations.map((integration) => (
                        <TableRow key={integration.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900">{integration.nombre}</div>
                              <div className="text-sm text-gray-500 max-w-64 truncate">
                                {integration.descripcion}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTipoIcon(integration.tipo)}
                              <span className="capitalize">{integration.tipo}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getEstadoBadge(integration.estado)}
                          </TableCell>
                          <TableCell>
                            {integration.ultima_sincronizacion ? (
                              <div>
                                <div className="text-sm">
                                  {new Date(integration.ultima_sincronizacion).toLocaleDateString('es-CL')}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(integration.ultima_sincronizacion).toLocaleTimeString('es-CL')}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">Nunca</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={integration.metricas?.uptime_percentage || 0} 
                                className="w-16 h-2"
                              />
                              <span className="text-sm font-mono">
                                {integration.metricas?.uptime_percentage?.toFixed(1) || 0}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedIntegration(integration);
                                  setShowDetailDialog(true);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => testIntegration(integration.id)}
                                disabled={isTesting}
                              >
                                <Play className="w-4 h-4" />
                              </Button>
                              {integration.estado === 'activa' ? (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => syncIntegration(integration.id)}
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => pauseIntegration(integration.id)}
                                  >
                                    <Pause className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => resumeIntegration(integration.id)}
                                >
                                  <Play className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                              >
                                <Settings className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Integración</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Mensaje</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Duración</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div>
                            <div className="text-sm">
                              {new Date(log.timestamp).toLocaleDateString('es-CL')}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(log.timestamp).toLocaleTimeString('es-CL')}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {integrations.find(i => i.id === log.integration_id)?.nombre || 'Desconocida'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {log.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-64 truncate">{log.mensaje}</div>
                        </TableCell>
                        <TableCell>
                          {getLogStatusBadge(log.estado)}
                        </TableCell>
                        <TableCell>
                          {log.duracion_ms ? (
                            <span className="text-sm font-mono">
                              {log.duracion_ms < 1000 
                                ? `${log.duracion_ms}ms`
                                : `${(log.duracion_ms / 1000).toFixed(1)}s`
                              }
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plantillas de Integración</CardTitle>
              <p className="text-sm text-gray-600">
                Configura rápidamente integraciones populares usando estas plantillas
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrationTemplates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-2xl">{template.icono}</div>
                        <Badge variant="outline" className="text-xs">
                          {template.categoria}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{template.nombre}</h3>
                      <p className="text-sm text-gray-600 mb-3">{template.descripcion}</p>
                      <div className="text-xs text-gray-500 mb-4">
                        Por {template.proveedor}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleCreateFromTemplate(template)}
                        >
                          Usar Plantilla
                        </Button>
                        {template.documentacion_url && (
                          <Button size="sm" variant="outline">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento General</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Requests Exitosos</span>
                      <span className="font-mono">
                        {integrations.reduce((acc, i) => acc + (i.metricas?.successful_requests || 0), 0).toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={85} 
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Tiempo Respuesta Promedio</span>
                      <span className="font-mono">
                        {integrations.length > 0 
                          ? Math.round(integrations.reduce((acc, i) => acc + (i.metricas?.avg_response_time || 0), 0) / integrations.length)
                          : 0}ms
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Total Requests</span>
                      <span className="font-mono">
                        {integrations.reduce((acc, i) => acc + (i.metricas?.total_requests || 0), 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {integrationLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                      <div className={`w-2 h-2 rounded-full ${
                        log.estado === 'success' ? 'bg-green-500' :
                        log.estado === 'error' ? 'bg-red-500' :
                        log.estado === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{log.mensaje}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString('es-CL')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog de detalle de integración */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detalle de Integración: {selectedIntegration?.nombre}
            </DialogTitle>
          </DialogHeader>
          {selectedIntegration && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Información General</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Tipo:</strong> {selectedIntegration.tipo}</div>
                    <div><strong>Estado:</strong> {selectedIntegration.estado}</div>
                    <div><strong>Última Sync:</strong> {
                      selectedIntegration.ultima_sincronizacion 
                        ? new Date(selectedIntegration.ultima_sincronizacion).toLocaleString('es-CL')
                        : 'Nunca'
                    }</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Métricas</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Uptime:</strong> {selectedIntegration.metricas?.uptime_percentage?.toFixed(1)}%</div>
                    <div><strong>Total Requests:</strong> {selectedIntegration.metricas?.total_requests?.toLocaleString()}</div>
                    <div><strong>Tiempo Promedio:</strong> {selectedIntegration.metricas?.avg_response_time}ms</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Configuración</h4>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify(selectedIntegration.configuracion, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de plantillas */}
      <Dialog open={showTemplatesDialog} onOpenChange={setShowTemplatesDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Plantillas de Integración</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {integrationTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleCreateFromTemplate(template)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{template.icono}</span>
                    <div>
                      <h3 className="font-semibold">{template.nombre}</h3>
                      <p className="text-xs text-gray-500">{template.proveedor}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{template.descripcion}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
