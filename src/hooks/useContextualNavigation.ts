
import { useModularSystem } from './useModularSystem';
import { useAuth } from './useAuth';

interface NavigationItem {
  id: string;
  title: string;
  url: string;
  icon: string;
  isVisible: boolean;
  isDisabled: boolean;
  reason?: string;
  moduleRequired?: string;
  badge?: string;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export const useContextualNavigation = () => {
  const { hasModuleAccess, modules } = useModularSystem();
  const { profile } = useAuth();

  const isAssigned = Boolean(profile?.salmonera_id || profile?.servicio_id);

  // Obtener items de navegación contextuales
  const getNavigationItems = (): NavigationSection[] => {
    // CORE: Siempre disponible
    const coreItems: NavigationItem[] = [
      {
        id: 'dashboard',
        title: 'Dashboard',
        url: '/',
        icon: 'BarChart3',
        isVisible: true,
        isDisabled: false
      },
      {
        id: 'personal',
        title: 'Personal de Buceo',
        url: '/personal-de-buceo',
        icon: 'Users',
        isVisible: true,
        isDisabled: false
      },
      {
        id: 'inmersiones',
        title: 'Inmersiones',
        url: '/inmersiones',
        icon: 'Anchor',
        isVisible: true,
        isDisabled: false
      },
      {
        id: 'bitacoras',
        title: 'Bitácoras',
        url: '/bitacoras',
        icon: 'Book',
        isVisible: true,
        isDisabled: false
      }
    ];

    // PLANNING: Solo si módulo está activo
    const planningItems: NavigationItem[] = [
      {
        id: 'operaciones',
        title: 'Operaciones',
        url: '/operaciones',
        icon: 'Calendar',
        isVisible: hasModuleAccess(modules.PLANNING_OPERATIONS),
        isDisabled: !hasModuleAccess(modules.PLANNING_OPERATIONS),
        reason: !hasModuleAccess(modules.PLANNING_OPERATIONS) ? 'Módulo de planificación no activo' : undefined,
        moduleRequired: modules.PLANNING_OPERATIONS
      },
      {
        id: 'hpt',
        title: 'HPT',
        url: '/operaciones/hpt',
        icon: 'FileText',
        isVisible: hasModuleAccess(modules.PLANNING_OPERATIONS),
        isDisabled: !hasModuleAccess(modules.PLANNING_OPERATIONS),
        reason: !hasModuleAccess(modules.PLANNING_OPERATIONS) ? 'Módulo de planificación no activo' : undefined,
        moduleRequired: modules.PLANNING_OPERATIONS
      },
      {
        id: 'anexo-bravo',
        title: 'Anexo Bravo',
        url: '/operaciones/anexo-bravo',
        icon: 'Shield',
        isVisible: hasModuleAccess(modules.PLANNING_OPERATIONS),
        isDisabled: !hasModuleAccess(modules.PLANNING_OPERATIONS),
        reason: !hasModuleAccess(modules.PLANNING_OPERATIONS) ? 'Módulo de planificación no activo' : undefined,
        moduleRequired: modules.PLANNING_OPERATIONS
      }
    ];

    // MAINTENANCE: Solo si módulo está activo
    const maintenanceItems: NavigationItem[] = [
      {
        id: 'network-maintenance',
        title: 'Mantención de Redes',
        url: '/operaciones/network-maintenance',
        icon: 'Wrench',
        isVisible: hasModuleAccess(modules.MAINTENANCE_NETWORKS),
        isDisabled: !hasModuleAccess(modules.MAINTENANCE_NETWORKS),
        reason: !hasModuleAccess(modules.MAINTENANCE_NETWORKS) ? 'Módulo de mantención no activo' : undefined,
        moduleRequired: modules.MAINTENANCE_NETWORKS
      }
    ];

    // REPORTING: Solo si módulo está activo
    const reportingItems: NavigationItem[] = [
      {
        id: 'reports',
        title: 'Reportes',
        url: '/reportes',
        icon: 'BarChart3',
        isVisible: true, // Reportes básicos siempre disponibles
        isDisabled: false
      },
      {
        id: 'advanced-reports',
        title: 'Reportes Avanzados',
        url: '/reportes/avanzados',
        icon: 'TrendingUp',
        isVisible: hasModuleAccess(modules.ADVANCED_REPORTING),
        isDisabled: !hasModuleAccess(modules.ADVANCED_REPORTING),
        reason: !hasModuleAccess(modules.ADVANCED_REPORTING) ? 'Módulo de reportes avanzados no activo' : undefined,
        moduleRequired: modules.ADVANCED_REPORTING
      }
    ];

    // MANAGEMENT: Según rol
    const managementItems: NavigationItem[] = [];
    
    if (profile?.role === 'admin_salmonera' || profile?.role === 'superuser') {
      managementItems.push(
        {
          id: 'empresas',
          title: 'Mi Empresa',
          url: '/empresas',
          icon: 'Building',
          isVisible: true,
          isDisabled: false
        },
        {
          id: 'configuracion',
          title: 'Configuración',
          url: '/configuracion',
          icon: 'Settings',
          isVisible: true,
          isDisabled: false
        }
      );
    }

    // INTEGRATIONS: Solo si módulo está activo y rol apropiado
    if ((profile?.role === 'admin_salmonera' || profile?.role === 'admin_servicio' || profile?.role === 'superuser') &&
        hasModuleAccess(modules.EXTERNAL_INTEGRATIONS)) {
      managementItems.push({
        id: 'integrations',
        title: 'Integraciones',
        url: '/integraciones',
        icon: 'Link',
        isVisible: true,
        isDisabled: false
      });
    }

    // ADMIN: Solo superuser
    const adminItems: NavigationItem[] = [];
    if (profile?.role === 'superuser') {
      adminItems.push(
        {
          id: 'admin-users',
          title: 'Gestión de Usuarios',
          url: '/admin/users',
          icon: 'UserCog',
          isVisible: true,
          isDisabled: false
        },
        {
          id: 'admin-modules',
          title: 'Módulos del Sistema',
          url: '/admin/modules',
          icon: 'Package',
          isVisible: true,
          isDisabled: false
        },
        {
          id: 'admin-monitoring',
          title: 'Monitoreo',
          url: '/admin/system-monitoring',
          icon: 'Activity',
          isVisible: true,
          isDisabled: false
        }
      );
    }

    return [
      {
        title: 'Navegación Principal',
        items: coreItems
      },
      {
        title: 'Planificación',
        items: planningItems.filter(item => item.isVisible)
      },
      {
        title: 'Operaciones Especializadas',
        items: maintenanceItems.filter(item => item.isVisible)
      },
      {
        title: 'Análisis',
        items: reportingItems.filter(item => item.isVisible)
      },
      {
        title: 'Gestión',
        items: managementItems.filter(item => item.isVisible)
      },
      {
        title: 'Administración',
        items: adminItems.filter(item => item.isVisible)
      }
    ].filter(section => section.items.length > 0);
  };

  // Verificar si una ruta es accesible
  const isRouteAccessible = (path: string): { accessible: boolean; reason?: string; moduleRequired?: string } => {
    const routeModuleMap: Record<string, string> = {
      '/operaciones': modules.PLANNING_OPERATIONS,
      '/operaciones/hpt': modules.PLANNING_OPERATIONS,
      '/operaciones/anexo-bravo': modules.PLANNING_OPERATIONS,
      '/operaciones/network-maintenance': modules.MAINTENANCE_NETWORKS,
      '/reportes/avanzados': modules.ADVANCED_REPORTING,
      '/integraciones': modules.EXTERNAL_INTEGRATIONS,
    };

    const requiredModule = routeModuleMap[path];
    
    if (!requiredModule) {
      // Ruta core o no requiere módulo específico
      return { accessible: true };
    }

    if (!hasModuleAccess(requiredModule)) {
      return { 
        accessible: false, 
        reason: `Módulo requerido no activo`,
        moduleRequired: requiredModule
      };
    }

    return { accessible: true };
  };

  // Obtener contexto de navegación
  const getNavigationContext = () => {
    return {
      hasPlanning: hasModuleAccess(modules.PLANNING_OPERATIONS),
      hasMaintenance: hasModuleAccess(modules.MAINTENANCE_NETWORKS),
      hasAdvancedReporting: hasModuleAccess(modules.ADVANCED_REPORTING),
      hasIntegrations: hasModuleAccess(modules.EXTERNAL_INTEGRATIONS),
      userRole: profile?.role,
      isAssigned,
      capabilities: {
        canCreateDirectImmersions: true, // Core siempre
        canCreatePlannedImmersions: hasModuleAccess(modules.PLANNING_OPERATIONS),
        canCreateOperations: hasModuleAccess(modules.PLANNING_OPERATIONS),
        canCreateDocuments: hasModuleAccess(modules.PLANNING_OPERATIONS),
        canManageNetworks: hasModuleAccess(modules.MAINTENANCE_NETWORKS),
        canAccessAdvancedReports: hasModuleAccess(modules.ADVANCED_REPORTING),
        canUseIntegrations: hasModuleAccess(modules.EXTERNAL_INTEGRATIONS),
      }
    };
  };

  return {
    getNavigationItems,
    isRouteAccessible,
    getNavigationContext,
  };
};
