
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { ModuleAccessInfo } from '@/hooks/useEnterpriseModuleAccess';

interface EnterpriseModuleIndicatorProps {
  modules: ModuleAccessInfo[];
  requiredModule?: string;
  showAll?: boolean;
  compact?: boolean;
}

export const EnterpriseModuleIndicator: React.FC<EnterpriseModuleIndicatorProps> = ({
  modules,
  requiredModule,
  showAll = false,
  compact = false
}) => {
  const getModuleDisplayName = (moduleName: string) => {
    const moduleMap: Record<string, string> = {
      'core_immersions': 'Inmersiones Core',
      'planning_operations': 'Planificación de Operaciones',
      'maintenance_networks': 'Mantención de Redes',
      'advanced_reporting': 'Reportes Avanzados',
      'external_integrations': 'Integraciones Externas'
    };
    return moduleMap[moduleName] || moduleName;
  };

  const requiredModuleActive = requiredModule 
    ? modules.some(m => m.module_name === requiredModule && m.is_active)
    : true;

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {requiredModule && (
          <div className="flex items-center gap-1">
            {requiredModuleActive ? (
              <CheckCircle className="w-3 h-3 text-green-600" />
            ) : (
              <XCircle className="w-3 h-3 text-red-600" />
            )}
            <span className="text-xs text-muted-foreground">
              {getModuleDisplayName(requiredModule)}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {requiredModule && !requiredModuleActive && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Esta empresa no tiene el módulo "{getModuleDisplayName(requiredModule)}" activo.
            No se pueden realizar operaciones que requieren este módulo.
          </AlertDescription>
        </Alert>
      )}

      {requiredModule && requiredModuleActive && (
        <Alert>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            Módulo "{getModuleDisplayName(requiredModule)}" activo para esta empresa.
          </AlertDescription>
        </Alert>
      )}

      {showAll && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Módulos Activos:</h4>
          <div className="flex flex-wrap gap-1">
            {modules.map((module) => (
              <Badge 
                key={module.module_name}
                variant={module.is_active ? "default" : "secondary"}
                className="text-xs"
              >
                {module.display_name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {modules.length === 1 && modules[0].module_name === 'core_immersions' && (
        <Alert>
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-sm">
            Esta empresa solo tiene funcionalidades core activas. 
            Algunas características avanzadas no estarán disponibles.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
