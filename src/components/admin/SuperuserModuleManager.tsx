
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Activity, 
  BarChart3, 
  Shield, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useAdvancedModuleManagement } from "@/hooks/useAdvancedModuleManagement";

export const SuperuserModuleManager = () => {
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

  const [searchTerm, setSearchTerm] = useState('');

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
              Solo los superusuarios pueden acceder a este panel.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
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

  const filteredConfigurations = moduleConfigurations.filter(config =>
    config.module_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.company_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión Avanzada de Módulos</h1>
          <p className="text-gray-600">Panel de administración completo para superusuarios</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
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
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Empresas Activas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {advancedStats?.active_companies || 0}
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
                  {advancedStats?.avg_daily_usage || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tasa Adopción</p>
                <p className="text-2xl font-bold text-gray-900">
                  {advancedStats?.module_adoption_rate || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="configurations">Configuraciones</TabsTrigger>
          <TabsTrigger value="usage">Estadísticas</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Uso por módulo */}
            <Card>
              <CardHeader>
                <CardTitle>Uso por Módulo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {advancedStats?.usage_by_module && Object.entries(advancedStats.usage_by_module).map(([module, usage]) => (
                    <div key={module} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{module}</span>
                      <Badge variant="outline">{usage} usos</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Logs recientes */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activationLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {log.action === 'activated' && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {log.action === 'deactivated' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        {log.action === 'configured' && <Settings className="w-4 h-4 text-blue-500" />}
                        <span>{log.module_name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-3 h-3" />
                        {new Date(log.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configurations" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Buscar módulos o empresas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="space-y-4">
            {filteredConfigurations.map((config) => (
              <Card key={config.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{config.module_name}</h3>
                      <p className="text-sm text-gray-600">
                        {config.company_type}: {config.company_id}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className={config.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {config.enabled ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Actualizado: {new Date(config.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Switch
                      checked={config.enabled}
                      onCheckedChange={(checked) => 
                        toggleModule({
                          moduleName: config.module_name,
                          companyId: config.company_id,
                          companyType: config.company_type,
                          enabled: checked,
                        })
                      }
                      disabled={isToggling}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de Uso Detalladas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Módulo</th>
                      <th className="text-left p-2">Empresa</th>
                      <th className="text-left p-2">Tipo</th>
                      <th className="text-left p-2">Uso</th>
                      <th className="text-left p-2">Usuarios</th>
                      <th className="text-left p-2">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usageStats.slice(0, 20).map((stat) => (
                      <tr key={stat.id} className="border-b">
                        <td className="p-2 font-medium">{stat.module_name}</td>
                        <td className="p-2">{stat.company_id.slice(0, 8)}...</td>
                        <td className="p-2">
                          <Badge variant="outline" className="text-xs">
                            {stat.company_type}
                          </Badge>
                        </td>
                        <td className="p-2">{stat.usage_count}</td>
                        <td className="p-2">{stat.active_users}</td>
                        <td className="p-2">{new Date(stat.date_recorded).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Activaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activationLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={
                          log.action === 'activated' ? "bg-green-100 text-green-800" :
                          log.action === 'deactivated' ? "bg-red-100 text-red-800" :
                          "bg-blue-100 text-blue-800"
                        }>
                          {log.action}
                        </Badge>
                        <span className="font-medium">{log.module_name}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Empresa: {log.company_id.slice(0, 8)}... ({log.company_type})</p>
                      {log.reason && <p>Razón: {log.reason}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
