
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Anchor, 
  FileText, 
  Plus, 
  Clock,
  Target,
  Users,
  AlertCircle
} from 'lucide-react';
import { useModularSystem } from '@/hooks/useModularSystem';
import { useNavigate } from 'react-router-dom';

interface ContextualQuickActionsProps {
  className?: string;
}

export const ContextualQuickActions = ({ className = "" }: ContextualQuickActionsProps) => {
  const navigate = useNavigate();
  const { getUserContext, hasModuleAccess, modules, activeModules } = useModularSystem();
  
  const userContext = getUserContext();

  const getAvailableActions = () => {
    const actions = [];

    // Acciones core (siempre disponibles)
    actions.push({
      id: 'create_immersion',
      title: 'Nueva Inmersión',
      description: userContext.isContratista 
        ? 'Crear inmersión independiente o asociada'
        : 'Crear inmersión directa',
      icon: Anchor,
      color: 'bg-blue-500',
      route: '/inmersiones/nueva',
      priority: 1
    });

    // Acciones de planificación (si tiene el módulo)
    if (hasModuleAccess(modules.PLANNING_OPERATIONS)) {
      if (userContext.canCreateOperations) {
        actions.push({
          id: 'create_operation',
          title: 'Nueva Operación',
          description: 'Planificar operación con documentos',
          icon: Calendar,
          color: 'bg-green-500',
          route: '/operaciones/nueva',
          priority: 2
        });

        actions.push({
          id: 'create_hpt',
          title: 'Nuevo HPT',
          description: 'Hoja de Planificación de Trabajo',
          icon: FileText,
          color: 'bg-purple-500',
          route: '/documentos/hpt/nuevo',
          priority: 3
        });
      }

      actions.push({
        id: 'view_operations',
        title: 'Ver Operaciones',
        description: userContext.isContratista 
          ? 'Operaciones disponibles para inmersiones'
          : 'Gestionar operaciones planificadas',
        icon: Calendar,
        color: 'bg-indigo-500',
        route: '/operaciones',
        priority: 2
      });
    }

    // Acciones de mantención de redes (si tiene el módulo)
    if (hasModuleAccess(modules.MAINTENANCE_NETWORKS)) {
      actions.push({
        id: 'network_maintenance',
        title: 'Mantención de Redes',
        description: 'Formularios operativos especializados',
        icon: Target,
        color: 'bg-orange-500',
        route: '/operaciones/network-maintenance',
        priority: 4
      });
    }

    // Gestión de personal (según rol)
    if (userContext.isSalmonera || userContext.isContratista) {
      actions.push({
        id: 'manage_teams',
        title: 'Equipos de Buceo',
        description: 'Gestionar personal operativo',
        icon: Users,
        color: 'bg-teal-500',
        route: '/personal-de-buceo',
        priority: 5
      });
    }

    // Actividad reciente
    actions.push({
      id: 'recent_activity',
      title: 'Actividad Reciente',
      description: 'Timeline de operaciones e inmersiones',
      icon: Clock,
      color: 'bg-gray-500',
      route: '/dashboard',
      priority: 6
    });

    return actions.sort((a, b) => a.priority - b.priority);
  };

  const availableActions = getAvailableActions();

  const getStatusInfo = () => {
    if (userContext.isContratista && !hasModuleAccess(modules.PLANNING_OPERATIONS)) {
      return {
        type: 'info',
        message: 'Modo Independiente: Crea inmersiones con códigos externos',
        icon: AlertCircle,
        color: 'text-blue-600'
      };
    }
    
    if (userContext.isContratista && hasModuleAccess(modules.PLANNING_OPERATIONS)) {
      return {
        type: 'success',
        message: 'Planificación Activa: Puedes asociar a operaciones',
        icon: Calendar,
        color: 'text-green-600'
      };
    }

    if (userContext.isSalmonera && hasModuleAccess(modules.PLANNING_OPERATIONS)) {
      return {
        type: 'success',
        message: 'Control Total: Planificación y ejecución',
        icon: Target,
        color: 'text-purple-600'
      };
    }

    return {
      type: 'default',
      message: 'Operaciones Core Disponibles',
      icon: Anchor,
      color: 'text-gray-600'
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Acciones Rápidas</span>
          <Badge variant="outline" className={statusInfo.color}>
            <statusInfo.icon className="w-3 h-3 mr-1" />
            {statusInfo.message}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableActions.slice(0, 6).map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-gray-50"
              onClick={() => navigate(action.route)}
            >
              <div className="flex items-center gap-2 w-full">
                <div className={`p-2 rounded-md ${action.color} text-white`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-sm">{action.title}</h4>
                </div>
              </div>
              <p className="text-xs text-gray-600 text-left w-full">
                {action.description}
              </p>
            </Button>
          ))}
        </div>

        {/* Módulos activos */}
        <div className="mt-4 pt-4 border-t">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Módulos Activos</h5>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              Core Inmersiones
            </Badge>
            {activeModules.map((module) => (
              <Badge key={module.module_name} variant="secondary" className="text-xs">
                {module.display_name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
