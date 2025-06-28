
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle, Package } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ModuleInfo {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

interface EnterpriseModuleIndicatorProps {
  modules: ModuleInfo[];
  requiredModule?: string;
  showAll?: boolean;
  compact?: boolean;
  showCard?: boolean;
}

const MODULE_NAMES = {
  'planning_operations': 'Planificación de Operaciones',
  'maintenance_networks': 'Mantención de Redes',
  'advanced_reporting': 'Reportes Avanzados',
  'external_integrations': 'Integraciones Externas'
};

export const EnterpriseModuleIndicator: React.FC<EnterpriseModuleIndicatorProps> = ({
  modules,
  requiredModule,
  showAll = false,
  compact = false,
  showCard = true
}) => {
  const activeModules = modules.filter(m => m.is_active);
  const inactiveModules = modules.filter(m => !m.is_active);
  
  // Si hay un módulo requerido, verificar su estado
  const requiredModuleInfo = requiredModule 
    ? modules.find(m => m.id === requiredModule)
    : null;

  const getModuleDisplayName = (moduleId: string) => {
    return MODULE_NAMES[moduleId as keyof typeof MODULE_NAMES] || moduleId;
  };

  const renderModuleBadge = (module: ModuleInfo, isActive: boolean) => (
    <Badge
      key={module.id}
      variant={isActive ? "default" : "secondary"}
      className={`${compact ? 'text-xs' : ''} ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
      }`}
    >
      {isActive ? (
        <CheckCircle className="w-3 h-3 mr-1" />
      ) : (
        <XCircle className="w-3 h-3 mr-1" />
      )}
      {getModuleDisplayName(module.id)}
    </Badge>
  );

  const content = (
    <div className="space-y-3">
      {/* Solo mostrar alerta si hay un módulo requerido y está inactivo */}
      {requiredModule && requiredModuleInfo && !requiredModuleInfo.is_active && (
        <Alert variant="destructive" className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Módulo Requerido:</strong> {getModuleDisplayName(requiredModule)} no está disponible
          </AlertDescription>
        </Alert>
      )}

      {/* Módulos activos */}
      {activeModules.length > 0 && (
        <div>
          {!compact && <h4 className="text-sm font-medium mb-2">Módulos Disponibles</h4>}
          <div className="flex flex-wrap gap-2">
            {activeModules.map(module => renderModuleBadge(module, true))}
          </div>
        </div>
      )}

      {/* Módulos inactivos - solo mostrar si showAll es true y no es compact */}
      {showAll && !compact && inactiveModules.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-600">Módulos No Disponibles</h4>
          <div className="flex flex-wrap gap-2">
            {inactiveModules.map(module => renderModuleBadge(module, false))}
          </div>
        </div>
      )}
    </div>
  );

  if (!showCard || compact) {
    return content;
  }

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Package className="w-4 h-4 text-blue-600" />
          Módulos Empresariales
        </CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};
