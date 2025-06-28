
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, 
  Shield, 
  Building2,
  Users,
  Search,
  Plus
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface SystemModule {
  name: string;
  display_name: string;
  description: string;
  category: string;
}

interface Company {
  id: string;
  nombre: string;
  tipo: 'salmonera' | 'contratista';
}

interface CompanyModule {
  id: string;
  company_id: string;
  company_type: 'salmonera' | 'contratista';
  module_name: string;
  is_active: boolean;
  company_name?: string;
}

export const SimpleModuleManager = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyType, setSelectedCompanyType] = useState<'all' | 'salmonera' | 'contratista'>('all');

  // Solo superuser puede gestionar módulos
  if (profile?.role !== 'superuser') {
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

  // Obtener módulos del sistema
  const { data: systemModules = [] } = useQuery({
    queryKey: ['system-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_modules')
        .select('*')
        .order('display_name');
      
      if (error) throw error;
      return data as SystemModule[];
    },
  });

  // Obtener empresas
  const { data: companies = [] } = useQuery({
    queryKey: ['companies-for-modules'],
    queryFn: async () => {
      const [salmoneras, contratistas] = await Promise.all([
        supabase.from('salmoneras').select('id, nombre').order('nombre'),
        supabase.from('contratistas').select('id, nombre').order('nombre')
      ]);

      const allCompanies: Company[] = [];
      
      if (salmoneras.data) {
        allCompanies.push(...salmoneras.data.map(s => ({ ...s, tipo: 'salmonera' as const })));
      }
      
      if (contratistas.data) {
        allCompanies.push(...contratistas.data.map(c => ({ ...c, tipo: 'contratista' as const })));
      }

      return allCompanies;
    },
  });

  // Obtener módulos de empresas
  const { data: companyModules = [], isLoading } = useQuery({
    queryKey: ['company-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_modules')
        .select('*')
        .order('company_id');
      
      if (error) throw error;
      
      // Enriquecer con nombres de empresas
      const enrichedData = data.map(cm => {
        const company = companies.find(c => c.id === cm.company_id && c.tipo === cm.company_type);
        return {
          ...cm,
          company_name: company?.nombre || 'Empresa no encontrada'
        };
      });

      return enrichedData as CompanyModule[];
    },
    enabled: companies.length > 0,
  });

  // Mutation para activar/desactivar módulos
  const toggleModuleMutation = useMutation({
    mutationFn: async ({ 
      companyId, 
      companyType, 
      moduleName, 
      isActive 
    }: { 
      companyId: string; 
      companyType: 'salmonera' | 'contratista'; 
      moduleName: string; 
      isActive: boolean; 
    }) => {
      if (isActive) {
        // Activar módulo
        const { data, error } = await supabase
          .from('company_modules')
          .upsert({
            company_id: companyId,
            company_type: companyType,
            module_name: moduleName,
            is_active: true
          }, {
            onConflict: 'company_id,company_type,module_name'
          });
        
        if (error) throw error;
        return data;
      } else {
        // Desactivar módulo
        const { error } = await supabase
          .from('company_modules')
          .delete()
          .eq('company_id', companyId)
          .eq('company_type', companyType)
          .eq('module_name', moduleName);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-modules'] });
      toast({
        title: 'Módulo actualizado',
        description: 'El estado del módulo se ha actualizado correctamente.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el módulo.',
        variant: 'destructive',
      });
    },
  });

  const filteredCompanyModules = companyModules.filter(cm => {
    const matchesSearch = cm.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cm.module_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedCompanyType === 'all' || cm.company_type === selectedCompanyType;
    return matchesSearch && matchesType;
  });

  // Agrupar datos para las estadísticas
  const stats = {
    totalModules: systemModules.length,
    activeCompanies: new Set(companyModules.map(cm => cm.company_id)).size,
    totalActivations: companyModules.length,
    salmoneras: companyModules.filter(cm => cm.company_type === 'salmonera').length,
    contratistas: companyModules.filter(cm => cm.company_type === 'contratista').length
  };

  const isModuleActive = (companyId: string, companyType: string, moduleName: string) => {
    return companyModules.some(cm => 
      cm.company_id === companyId && 
      cm.company_type === companyType && 
      cm.module_name === moduleName &&
      cm.is_active
    );
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Módulos</h1>
          <p className="text-gray-600">Administra los módulos activos para cada empresa</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Módulos Sistema</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalModules}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Empresas Activas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeCompanies}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Activaciones</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalActivations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Salmoneras</p>
                <p className="text-2xl font-bold text-gray-900">{stats.salmoneras}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Contratistas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.contratistas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="companies" className="space-y-6">
        <TabsList>
          <TabsTrigger value="companies">Por Empresa</TabsTrigger>
          <TabsTrigger value="modules">Por Módulo</TabsTrigger>
          <TabsTrigger value="matrix">Matriz Completa</TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar empresas o módulos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCompanyType} onValueChange={(value: any) => setSelectedCompanyType(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las empresas</SelectItem>
                <SelectItem value="salmonera">Salmoneras</SelectItem>
                <SelectItem value="contratista">Contratistas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {companies
              .filter(company => selectedCompanyType === 'all' || company.tipo === selectedCompanyType)
              .filter(company => company.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((company) => (
              <Card key={`${company.id}-${company.tipo}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {company.tipo === 'salmonera' ? (
                        <Building2 className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Users className="w-5 h-5 text-orange-600" />
                      )}
                      <span>{company.nombre}</span>
                      <Badge variant="outline">
                        {company.tipo === 'salmonera' ? 'Salmonera' : 'Contratista'}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {systemModules.map((module) => {
                      const isActive = isModuleActive(company.id, company.tipo, module.name);
                      return (
                        <div key={module.name} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{module.display_name}</div>
                            <div className="text-sm text-gray-500">{module.description}</div>
                          </div>
                          <Switch
                            checked={isActive}
                            onCheckedChange={(checked) => 
                              toggleModuleMutation.mutate({
                                companyId: company.id,
                                companyType: company.tipo,
                                moduleName: module.name,
                                isActive: checked
                              })
                            }
                            disabled={toggleModuleMutation.isPending}
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="space-y-4">
            {systemModules.map((module) => {
              const moduleActivations = companyModules.filter(cm => cm.module_name === module.name);
              return (
                <Card key={module.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-purple-600" />
                        <span>{module.display_name}</span>
                        <Badge variant="outline">
                          {moduleActivations.length} activaciones
                        </Badge>
                      </div>
                    </CardTitle>
                    <p className="text-gray-600">{module.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {moduleActivations.map((activation) => (
                        <div key={`${activation.company_id}-${activation.company_type}`} 
                             className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            {activation.company_type === 'salmonera' ? (
                              <Building2 className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Users className="w-4 h-4 text-orange-600" />
                            )}
                            <span>{activation.company_name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {activation.company_type}
                            </Badge>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Activo</Badge>
                        </div>
                      ))}
                      {moduleActivations.length === 0 && (
                        <p className="text-gray-500 text-center py-4">
                          No hay empresas con este módulo activo
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="matrix" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Matriz de Módulos por Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Empresa</th>
                      <th className="text-left p-2">Tipo</th>
                      {systemModules.map((module) => (
                        <th key={module.name} className="text-center p-2 min-w-24">
                          {module.display_name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map((company) => (
                      <tr key={`${company.id}-${company.tipo}`} className="border-b">
                        <td className="p-2 font-medium">{company.nombre}</td>
                        <td className="p-2">
                          <Badge variant="outline" className="text-xs">
                            {company.tipo}
                          </Badge>
                        </td>
                        {systemModules.map((module) => {
                          const isActive = isModuleActive(company.id, company.tipo, module.name);
                          return (
                            <td key={module.name} className="p-2 text-center">
                              <Switch
                                checked={isActive}
                                onCheckedChange={(checked) => 
                                  toggleModuleMutation.mutate({
                                    companyId: company.id,
                                    companyType: company.tipo,
                                    moduleName: module.name,
                                    isActive: checked
                                  })
                                }
                                disabled={toggleModuleMutation.isPending}
                                size="sm"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
