
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  BarChart3, 
  Activity, 
  Users, 
  Zap, 
  Shield, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useAdvancedModuleManagement } from "@/hooks/useAdvancedModuleManagement";
import { useAuth } from "@/hooks/useAuth";

export const ModuleManagementDashboard = () => {
  const {
    moduleConfigurations,
    usageStats,
    activationLogs,
    advancedStats,
    isLoading,
    canManageModules,
    configureModule,
    toggleModule,
    isConfiguring,
    isToggling,
  } = useAdvancedModuleManagement();

  const { profile } = useAuth();
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [toggleReason, setToggleReason] = useState('');

  if (!canManageModules) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Acceso Restringido
            </h3>
            <p className="text-gray-600">
              No tienes permisos para acceder al panel de gestión de módulos.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const availableModules = [
    { key: 'planning', name: 'Planificación', icon: BarChart3, description: 'Operaciones, HPT, Anexo Bravo' },
    { key: 'core_operations', name: 'Operaciones Core', icon: Activity, description: 'Inmersiones, Bitácoras básicas' },
    { key: 'network_maintenance', name: 'Mantención de Redes', icon: Settings, description: 'Mantenimiento preventivo y correctivo' },
    { key: 'network_operations', name: 'Faenas de Redes', icon: Zap, description: 'Operaciones de redes marinas' },
    { key: 'reports', name: 'Reportes Avanzados', icon: BarChart3, description: 'Sistema de reportes especializados' },
    { key: 'integrations', name: 'Integraciones', icon: Zep, description: 'APIs externas y sincronización' },
  ];

  const handleToggleModule = async (moduleName: string, enabled: boolean) => {
    const empresaId = profile?.salmonera_id || profile?.servicio_id;
    const companyType = profile?.salmonera_id ? 'salmonera' : 'contratista';
    
    if (!empresaId) return;

    try {
      await toggleModule({
        moduleName,
        companyId: empresaId,
        companyType,
        enabled,
        reason: toggleReason
      });
      setToggleReason('');
    } catch (error) {
      console.error('Error toggling module:', error);
    }
  };

  const getModuleStatus = (moduleName: string) => {
    const config = moduleConfigurations.find(c => c.module_name === moduleName);
    return config?.enabled ?? false;
  };

  const getModuleUsage = (moduleName: string) => {
    const usage = usageStats.filter(s => s.module_name === moduleName);
    return usage.reduce((acc, curr) => acc + curr.usage_count, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Módulos</h1>
          <p className="text-gray-600">Panel de administración y configuración de módulos del sistema</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="modules">Módulos</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Módulos Activos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {moduleConfigurations.filter(m => m.enabled).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Uso Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {advancedStats?.total_usage || 0}
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
                    <p className="text-sm font-medium text-gray-600">Promedio Diario</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(advancedStats?.avg_daily_usage || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Configuraciones</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {moduleConfigurations.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estado rápido de módulos */}
          <Card>
            <CardHeader>
              <CardTitle>Estado de Módulos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableModules.map((module) => {
                  const isEnabled = getModuleStatus(module.key);
                  const usage = getModuleUsage(module.key);
                  
                  return (
                    <div key={module.key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <module.icon className="w-5 h-5" />
                          <h3 className="font-medium">{module.name}</h3>
                        </div>
                        <Badge className={isEnabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {isEnabled ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Uso: {usage}</span>
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={(checked) => handleToggleModule(module.key, checked)}
                          disabled={isToggling}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {availableModules.map((module) => {
              const config = moduleConfigurations.find(c => c.module_name === module.key);
              const usage = getModuleUsage(module.key);
              
              return (
                <Card key={module.key}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <module.icon className="w-6 h-6" />
                          <h3 className="text-lg font-semibold">{module.name}</h3>
                          <Badge className={config?.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {config?.enabled ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{module.description}</p>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>Uso: {usage} operaciones</span>
                          {config && (
                            <span>Configurado: {new Date(config.updated_at).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Settings className="w-4 h-4 mr-1" />
                              Configurar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Configurar {module.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Estado del Módulo</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <Switch
                                    checked={config?.enabled ?? false}
                                    onCheckedChange={(checked) => handleToggleModule(module.key, checked)}
                                    disabled={isToggling}
                                  />
                                  <span className="text-sm">{config?.enabled ? 'Activado' : 'Desactivado'}</span>
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="reason">Razón del cambio (opcional)</Label>
                                <Textarea
                                  id="reason"
                                  value={toggleReason}
                                  onChange={(e) => setToggleReason(e.target.value)}
                                  placeholder="Describe la razón del cambio..."
                                />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Switch
                          checked={config?.enabled ?? false}
                          onCheckedChange={(checked) => handleToggleModule(module.key, checked)}
                          disabled={isToggling}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de Uso</CardTitle>
            </CardHeader>
            <CardContent>
              {advancedStats?.usage_by_module ? (
                <div className="space-y-4">
                  {Object.entries(advancedStats.usage_by_module).map(([moduleName, usage]) => (
                    <div key={moduleName} className="flex justify-between items-center">
                      <span className="font-medium">{moduleName}</span>
                      <Badge>{usage as number} usos</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No hay datos de uso disponibles</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Activaciones</CardTitle>
            </CardHeader>
            <CardContent>
              {activationLogs.length === 0 ? (
                <p className="text-gray-500">No hay logs de activación disponibles</p>
              ) : (
                <div className="space-y-3">
                  {activationLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={
                              log.action === 'activated' ? "bg-green-100 text-green-800" :
                              log.action === 'deactivated' ? "bg-red-100 text-red-800" :
                              "bg-blue-100 text-blue-800"
                            }>
                              {log.action === 'activated' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {log.action === 'deactivated' && <XCircle className="w-3 h-3 mr-1" />}
                              {log.action === 'configured' && <Settings className="w-3 h-3 mr-1" />}
                              {log.action}
                            </Badge>
                            <span className="font-medium">{log.module_name}</span>
                          </div>
                          {log.reason && (
                            <p className="text-sm text-gray-600">{log.reason}</p>
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(log.created_at).toLocaleString()}
                          </div>
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
