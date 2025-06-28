
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, 
  Users, 
  Building2, 
  BarChart3, 
  Activity, 
  Shield, 
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { useModularSystem } from "@/hooks/useModularSystem";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CompanyModuleManager } from "./CompanyModuleManager";
import { ModuleStatsPanel } from "./ModuleStatsPanel";
import { SuperuserModuleManager } from "./SuperuserModuleManager";
import { useModuleSystemInitializer } from "@/hooks/useModuleSystemInitializer";

export const ModuleManagementDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyType, setSelectedCompanyType] = useState<'all' | 'salmonera' | 'contratista'>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('');

  // Inicializar módulos del sistema
  useModuleSystemInitializer();

  const { systemModules, isSuperuser, isLoading: loadingModules } = useModularSystem();

  // Obtener empresas (salmoneras y contratistas)
  const { data: companies = [], isLoading: loadingCompanies } = useQuery({
    queryKey: ['companies-for-modules'],
    queryFn: async () => {
      const [salmoneras, contratistas] = await Promise.all([
        supabase.from('salmoneras').select('id, nombre, rut, estado').eq('estado', 'activa'),
        supabase.from('contratistas').select('id, nombre, rut, estado').eq('estado', 'activo')
      ]);

      const allCompanies = [
        ...(salmoneras.data || []).map(s => ({ ...s, type: 'salmonera' as const })),
        ...(contratistas.data || []).map(c => ({ ...c, type: 'contratista' as const }))
      ];

      return allCompanies.sort((a, b) => a.nombre.localeCompare(b.nombre));
    },
    enabled: isSuperuser,
  });

  // Obtener estadísticas de módulos
  const { data: moduleStats } = useQuery({
    queryKey: ['module-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_modules')
        .select('module_name, company_type, is_active, company_id');

      if (error) throw error;

      const stats = {
        totalModules: systemModules.length,
        activeActivations: 0,
        companiesWithModules: new Set(),
        moduleUsage: {} as Record<string, number>
      };

      data?.forEach(module => {
        if (module.is_active) {
          stats.activeActivations++;
          stats.companiesWithModules.add(module.company_id);
          stats.moduleUsage[module.module_name] = (stats.moduleUsage[module.module_name] || 0) + 1;
        }
      });

      return {
        ...stats,
        companiesWithModules: stats.companiesWithModules.size
      };
    },
    enabled: isSuperuser && systemModules.length > 0,
  });

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.rut.includes(searchTerm);
    const matchesType = selectedCompanyType === 'all' || company.type === selectedCompanyType;
    return matchesSearch && matchesType;
  });

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
              No tienes permisos para acceder al panel de gestión de módulos.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loadingModules || loadingCompanies) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Módulos Disponibles</p>
                <p className="text-2xl font-bold text-gray-900">{moduleStats?.totalModules || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activaciones Totales</p>
                <p className="text-2xl font-bold text-gray-900">{moduleStats?.activeActivations || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Empresas Registradas</p>
                <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Empresas con Módulos</p>
                <p className="text-2xl font-bold text-gray-900">{moduleStats?.companiesWithModules || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="companies" className="space-y-6">
        <TabsList>
          <TabsTrigger value="companies">Gestión por Empresa</TabsTrigger>
          <TabsTrigger value="modules">Vista por Módulos</TabsTrigger>
          <TabsTrigger value="advanced">Panel Avanzado</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas y Reportes</TabsTrigger>
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
                  <Label htmlFor="search">Buscar Empresa</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Nombre o RUT..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="type">Tipo de Empresa</Label>
                  <Select value={selectedCompanyType} onValueChange={(value: any) => setSelectedCompanyType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="salmonera">Salmoneras</SelectItem>
                      <SelectItem value="contratista">Contratistas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <div className="text-sm text-gray-500">
                    {filteredCompanies.length} empresa{filteredCompanies.length !== 1 ? 's' : ''} encontrada{filteredCompanies.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de empresas */}
          <div className="grid grid-cols-1 gap-4">
            {filteredCompanies.map((company) => (
              <Card key={`${company.type}-${company.id}`} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{company.nombre}</h3>
                        <Badge variant={company.type === 'salmonera' ? 'default' : 'secondary'}>
                          {company.type === 'salmonera' ? 'Salmonera' : 'Contratista'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {company.rut}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Estado: <span className="font-medium">{company.estado}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCompany(`${company.type}-${company.id}`)}
                      className="ml-4"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Gestionar Módulos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCompanies.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {companies.length === 0 ? 'No hay empresas registradas' : 'No se encontraron empresas'}
                </h3>
                <p className="text-gray-600">
                  {companies.length === 0 
                    ? 'Primero debe registrar empresas en el sistema para poder gestionar sus módulos.'
                    : 'Ajusta los filtros de búsqueda para encontrar las empresas deseadas.'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {systemModules.map((module) => (
              <Card key={module.name}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{module.display_name}</h3>
                        <Badge className={module.is_core ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                          {module.is_core ? 'Core' : 'Opcional'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {module.category}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{module.description}</p>
                      <div className="text-sm text-gray-500">
                        <span>Uso: {moduleStats?.moduleUsage[module.name] || 0} empresas</span>
                        {module.dependencies && module.dependencies.length > 0 && (
                          <span className="ml-4">
                            Dependencias: {module.dependencies.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <SuperuserModuleManager />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <ModuleStatsPanel />
        </TabsContent>
      </Tabs>

      {/* Modal para gestión específica de empresa */}
      {selectedCompany && (
        <CompanyModuleManager
          companyId={selectedCompany.split('-')[1]}
          companyType={selectedCompany.split('-')[0] as 'salmonera' | 'contratista'}
          onClose={() => setSelectedCompany('')}
        />
      )}
    </div>
  );
};
