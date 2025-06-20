import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings2, 
  Package, 
  Building2, 
  Users, 
  BarChart3,
  Network,
  FileText,
  Plug,
  Shield
} from "lucide-react";
import { useModularSystem } from "@/hooks/useModularSystem";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'planning':
      return <FileText className="w-4 h-4 text-blue-500" />;
    case 'operational':
      return <Settings2 className="w-4 h-4 text-green-500" />;
    case 'reporting':
      return <BarChart3 className="w-4 h-4 text-purple-500" />;
    case 'integration':
      return <Plug className="w-4 h-4 text-orange-500" />;
    default:
      return <Package className="w-4 h-4 text-gray-500" />;
  }
};

const getCategoryBadgeColor = (category: string) => {
  switch (category) {
    case 'planning':
      return 'bg-blue-100 text-blue-800';
    case 'operational':
      return 'bg-green-100 text-green-800';
    case 'reporting':
      return 'bg-purple-100 text-purple-800';
    case 'integration':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const ModularSystemManager = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedCompanyType, setSelectedCompanyType] = useState<'salmonera' | 'contratista'>('salmonera');
  
  const { 
    systemModules, 
    activeModules, 
    isLoading, 
    toggleModule, 
    isToggling 
  } = useModularSystem();
  
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();

  const handleToggleModule = async (moduleName: string, isActive: boolean) => {
    if (!selectedCompany) return;

    try {
      await toggleModule({
        companyId: selectedCompany,
        companyType: selectedCompanyType,
        moduleName,
        isActive: !isActive
      });
    } catch (error) {
      console.error('Error toggling module:', error);
    }
  };

  const isModuleActiveForCompany = (moduleName: string) => {
    return activeModules.some(module => module.module_name === moduleName);
  };

  const companies = selectedCompanyType === 'salmonera' ? salmoneras : contratistas;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
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
      {/* Header y controles */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Módulos</h2>
          <p className="text-gray-600">Configurar acceso a módulos por empresa</p>
        </div>
      </div>

      {/* Selección de empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Seleccionar Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Tipo de Empresa</label>
              <Select value={selectedCompanyType} onValueChange={(value: 'salmonera' | 'contratista') => {
                setSelectedCompanyType(value);
                setSelectedCompany("");
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salmonera">Salmonera</SelectItem>
                  <SelectItem value="contratista">Contratista</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Empresa</label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empresa..." />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de módulos */}
      {selectedCompany && (
        <div className="grid gap-4">
          {Object.entries(
            systemModules.reduce((acc, module) => {
              const category = module.category;
              if (!acc[category]) acc[category] = [];
              acc[category].push(module);
              return acc;
            }, {} as Record<string, typeof systemModules>)
          ).map(([category, modules]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {getCategoryIcon(category)}
                  <span className="capitalize">
                    {category === 'planning' && 'Planificación'}
                    {category === 'operational' && 'Operacional'}
                    {category === 'reporting' && 'Reportes'}
                    {category === 'integration' && 'Integraciones'}
                  </span>
                  <Badge className={getCategoryBadgeColor(category)}>
                    {modules.length} módulo{modules.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {modules.map((module) => {
                  const isActive = isModuleActiveForCompany(module.name);
                  const isCore = module.is_core;
                  
                  return (
                    <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{module.display_name}</h4>
                          {isCore && (
                            <Badge variant="outline" className="text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              Core
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {module.description}
                        </p>
                        {module.dependencies.length > 0 && (
                          <p className="text-xs text-gray-500 mt-2">
                            Dependencias: {module.dependencies.join(', ')}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge variant={isActive ? "default" : "secondary"}>
                          {isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                        
                        {!isCore && (
                          <Switch
                            checked={isActive}
                            onCheckedChange={() => handleToggleModule(module.name, isActive)}
                            disabled={isToggling}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!selectedCompany && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Selecciona una empresa</p>
              <p className="text-sm">Selecciona una empresa para configurar sus módulos</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
