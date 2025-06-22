
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Cpu, 
  Database, 
  Globe, 
  Heart,
  Shield,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { useSystemMonitoring } from "@/hooks/useSystemMonitoring";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const SystemMonitoringDashboard = () => {
  const {
    systemAlerts,
    systemMetrics,
    monitoringStats,
    isLoading,
    canMonitorSystem,
    resolveAlert,
    createAlert,
    isResolvingAlert,
  } = useSystemMonitoring();

  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [newAlertForm, setNewAlertForm] = useState({
    type: 'system',
    severity: 'medium',
    title: '',
    message: '',
    source: 'manual',
  });

  if (!canMonitorSystem) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Acceso Restringido
            </h3>
            <p className="text-gray-600">
              Solo los superusuarios pueden acceder al monitoreo del sistema.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CL');
  };

  const handleResolveAlert = () => {
    if (selectedAlert) {
      resolveAlert({ 
        alertId: selectedAlert.id, 
        notes: resolutionNotes 
      });
      setSelectedAlert(null);
      setResolutionNotes('');
    }
  };

  const handleCreateAlert = () => {
    createAlert({
      ...newAlertForm,
      metadata: { manual_creation: true }
    });
    setNewAlertForm({
      type: 'system',
      severity: 'medium',
      title: '',
      message: '',
      source: 'manual',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monitoreo del Sistema</h1>
          <p className="text-gray-600">Supervisión en tiempo real y gestión de alertas</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Nueva Alerta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Alerta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Tipo</Label>
                <Select value={newAlertForm.type} onValueChange={(value) => 
                  setNewAlertForm(prev => ({ ...prev, type: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">Sistema</SelectItem>
                    <SelectItem value="security">Seguridad</SelectItem>
                    <SelectItem value="performance">Rendimiento</SelectItem>
                    <SelectItem value="user_activity">Actividad Usuario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Severidad</Label>
                <Select value={newAlertForm.severity} onValueChange={(value) => 
                  setNewAlertForm(prev => ({ ...prev, severity: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Título</Label>
                <Input 
                  value={newAlertForm.title}
                  onChange={(e) => setNewAlertForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título de la alerta"
                />
              </div>
              <div>
                <Label>Mensaje</Label>
                <Textarea 
                  value={newAlertForm.message}
                  onChange={(e) => setNewAlertForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Descripción detallada"
                  rows={3}
                />
              </div>
              <Button onClick={handleCreateAlert} className="w-full">
                Crear Alerta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPIs de Salud del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Salud del Sistema</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getHealthColor(monitoringStats?.system_health || 'good')}>
                    {monitoringStats?.system_health || 'good'}
                  </Badge>
                  <Heart className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {monitoringStats?.system_uptime || 99.8}%
                </p>
                <p className="text-xs text-gray-500">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Alertas Activas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {monitoringStats?.active_alerts || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tiempo Respuesta</p>
                <p className="text-2xl font-bold text-gray-900">
                  {monitoringStats?.avg_response_time || 150}ms
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Operaciones Hoy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {monitoringStats?.total_operations_today || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alertas del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <span className="font-medium">{alert.title}</span>
                          {alert.resolved && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(alert.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Fuente: {alert.source}
                        </span>
                        {!alert.resolved && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedAlert(alert)}
                              >
                                Resolver
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Resolver Alerta</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Notas de Resolución</Label>
                                  <Textarea 
                                    value={resolutionNotes}
                                    onChange={(e) => setResolutionNotes(e.target.value)}
                                    placeholder="Describe cómo se resolvió la alerta..."
                                    rows={3}
                                  />
                                </div>
                                <Button 
                                  onClick={handleResolveAlert}
                                  disabled={isResolvingAlert}
                                  className="w-full"
                                >
                                  {isResolvingAlert ? 'Resolviendo...' : 'Marcar como Resuelta'}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  CPU y Memoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>CPU Usage:</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory:</span>
                    <span className="font-medium">2.1GB / 8GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Load Avg:</span>
                    <span className="font-medium">0.75</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Base de Datos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Conexiones:</span>
                    <span className="font-medium">47 / 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Query Time:</span>
                    <span className="font-medium">1.2ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cache Hit:</span>
                    <span className="font-medium">94.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Red y Tráfico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Requests/min:</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Rate:</span>
                    <span className="font-medium">{monitoringStats?.error_rate_24h}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bandwidth:</span>
                    <span className="font-medium">45.2 MB/s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Indicadores de Rendimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Métricas de Aplicación</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tiempo de respuesta promedio:</span>
                      <span>{monitoringStats?.avg_response_time}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tasa de error 24h:</span>
                      <span>{monitoringStats?.error_rate_24h}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Puntuación actividad usuarios:</span>
                      <span>{monitoringStats?.user_activity_score}/100</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Operaciones Procesadas</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Hoy:</span>
                      <span>{monitoringStats?.total_operations_today}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Alertas resueltas 24h:</span>
                      <span>{monitoringStats?.resolved_alerts_24h}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uptime del sistema:</span>
                      <span>{monitoringStats?.system_uptime}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
