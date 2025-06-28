
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
  Clock,
  Search
} from "lucide-react";
import { useModuleManagementDashboard } from "@/hooks/useModuleManagementDashboard";

export const SuperuserModuleManager = () => {
  const {
    companiesWithModules,
    moduleStats,
    isLoading,
    isSuperuser,
    toggleModule,
    isToggling,
  } = useModuleManagementDashboard();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyType, setSelectedCompanyType] = useState<'all' | 'salmonera' | 'contratista'>('all');

  if (!isSuperuser) {
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

  const filteredCompanies = companiesWithModules.filter(company => {
    const matchesSearch = company.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.rut.includes(searchTerm);
    const matchesType = selectedCompanyType === 'all' || company.type === selectedCompanyType;
    return matchesSearch && matchesType;
  });

  const handleToggleModule = async (companyId: string, companyType: 'salmonera' | 'contratista', moduleName: string, currentStatus: boolean) => {
    await toggleModule({
      companyId,
      companyType,
      moduleName,
      isActive: !currentStatus
    });
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Módulos Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {moduleStats?.total_modules || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activaciones Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {moduleStats?.active_activations || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Empresas con Módulos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {moduleStats?.companies_with_modules || 0}
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
                <p className="text-sm font-medium text-gray-600">Empresas Registradas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {companiesWithModules.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="companies" className="space-y-6">
        <TabsList>
          <TabsTrigger value="companies">Gestión por Empresa</TabsTrigger>
          <TabsTrigger value="modules">Vista por Módulos</TabsTrigger>
          <TabsTrigger value="logs">Actividad Reciente</TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros de Búsqueda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar empresa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={selectedCompanyType}
                    onChange={(e) => setSelectedCompanyType(e.target.value as any)}
                  >
                    <option value="all">Todas las empresas</option>
                    <option value="salmonera">Solo Salmoneras</option>
                    <option value="contratista">Solo Contratistas</option>
                  </select>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  {filteredCompanies.length} empresa{filteredCompanies.length !== 1 ? 's' : ''} encontrada{filteredCompanies.length !== 1 ? 's' : ''}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de empresas */}
          <div className="space-y-4">
            {filteredCompanies.map((company) => (
              <Card key={`${company.type}-${company.id}`}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header de la empresa */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{company.nombre}</h3>
                          <Badge variant={company.type === 'salmonera' ? 'default' : 'secondary'}>
                            {company.type === 'salmonera' ? 'Salmonera' : 'Contratista'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {company.rut}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Estado: <span className="font-medium">{company.estado}</span>
                        </p>
                      </div>
                    </div>

                    {/* Módulos de la empresa */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Módulos Disponibles:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {company.modules.map((module) => (
                          <div key={module.module_name} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{module.display_name}</span>
                                <Badge className={module.is_core ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                                  {module.is_core ? 'Core' : 'Opcional'}
                                </Badge>
                              </div>
                              {module.description && (
                                <p className="text-xs text-gray-600">{module.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {module.is_core ? (
                                <div className="flex items-center gap-1 text-sm text-blue-600">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Siempre Activo</span>
                                </div>
                              ) : (
                                <Switch
                                  checked={module.is_active}
                                  onCheckedChange={() => 
                                    handleToggleModule(company.id, company.type, module.module_name, module.is_active)
                                  }
                                  disabled={isToggling}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCompanies.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No se encontraron empresas
                </h3>
                <p className="text-gray-600">
                  Ajusta los filtros de búsqueda para encontrar las empresas deseadas.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Uso por Módulo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {moduleStats?.usage_by_module && Object.entries(moduleStats.usage_by_module).map(([module, usage]) => (
                  <div key={module} className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">{module}</span>
                    <Badge variant="outline">{usage} empresa{usage !== 1 ? 's' : ''}</Badge>
                  </div>
                ))}
                {(!moduleStats?.usage_by_module || Object.keys(moduleStats.usage_by_module).length === 0) && (
                  <p className="text-gray-500 text-center py-8">No hay datos de uso disponibles</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {moduleStats?.recent_activations?.map((log) => (
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
                      <p>Empresa: {log.company_id} ({log.company_type})</p>
                      {log.reason && <p>Razón: {log.reason}</p>}
                    </div>
                  </div>
                ))}
                {(!moduleStats?.recent_activations || moduleStats.recent_activations.length === 0) && (
                  <p className="text-gray-500 text-center py-8">No hay actividad reciente</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
