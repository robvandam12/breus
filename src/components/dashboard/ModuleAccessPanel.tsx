
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  FileText, 
  Settings2, 
  BarChart3, 
  Plug,
  Shield,
  ExternalLink
} from "lucide-react";
import { useModularSystem } from "@/hooks/useModularSystem";
import { useNavigate } from "react-router-dom";

const getModuleIcon = (moduleName: string) => {
  switch (moduleName) {
    case 'core_immersions':
      return <Settings2 className="w-5 h-5 text-green-500" />;
    case 'planning_operations':
      return <FileText className="w-5 h-5 text-blue-500" />;
    case 'maintenance_networks':
      return <Package className="w-5 h-5 text-orange-500" />;
    case 'advanced_reporting':
      return <BarChart3 className="w-5 h-5 text-purple-500" />;
    case 'external_integrations':
      return <Plug className="w-5 h-5 text-red-500" />;
    default:
      return <Package className="w-5 h-5 text-gray-500" />;
  }
};

const getModuleRoute = (moduleName: string) => {
  switch (moduleName) {
    case 'core_immersions':
      return '/inmersiones';
    case 'planning_operations':
      return '/operaciones';
    case 'maintenance_networks':
      return '/operaciones/mantencion-redes';
    case 'advanced_reporting':
      return '/reportes/avanzados';
    case 'external_integrations':
      return '/integraciones';
    default:
      return '/';
  }
};

export const ModuleAccessPanel = () => {
  const { activeModules, isLoading } = useModularSystem();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Módulos Activos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Módulos Activos
          <Badge variant="outline">{activeModules.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeModules.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No tienes módulos activos</p>
            </div>
          ) : (
            activeModules.map((module) => (
              <div key={module.module_name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  {getModuleIcon(module.module_name)}
                  <div>
                    <h4 className="font-medium text-sm">{module.display_name}</h4>
                    <p className="text-xs text-gray-600">{module.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      module.category === 'planning' ? 'border-blue-200 text-blue-700' :
                      module.category === 'operational' ? 'border-green-200 text-green-700' :
                      module.category === 'reporting' ? 'border-purple-200 text-purple-700' :
                      'border-orange-200 text-orange-700'
                    }`}
                  >
                    {module.category === 'planning' && 'Planificación'}
                    {module.category === 'operational' && 'Operacional'}
                    {module.category === 'reporting' && 'Reportes'}
                    {module.category === 'integration' && 'Integración'}
                  </Badge>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(getModuleRoute(module.module_name))}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {activeModules.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500 text-center">
              Tienes acceso a {activeModules.length} módulo{activeModules.length !== 1 ? 's' : ''} del sistema
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
