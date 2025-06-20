
import { useModuleAccess } from "@/hooks/useModuleAccess";
import { 
  Calendar, 
  FileText, 
  Anchor,
  Settings,
  BarChart3,
  Wrench,
  Network,
  Zap,
  Shield,
  Bell,
} from "lucide-react";

interface NavigationItem {
  title: string;
  icon: React.ElementType;
  url: string;
  badge?: string;
  moduleRequired?: string;
  roleRequired?: string;
}

export const useAdaptiveNavigation = (userRole?: string) => {
  const { isModuleActive, modules } = useModuleAccess();

  const getNavigationItems = (): NavigationItem[] => {
    const items: NavigationItem[] = [
      {
        title: "Dashboard",
        icon: BarChart3,
        url: "/",
      }
    ];

    // Módulo de Planificación (Operaciones, HPT, Anexo Bravo)
    if (isModuleActive(modules.PLANNING_OPERATIONS)) {
      items.push(
        {
          title: "Operaciones",
          icon: Calendar,
          url: "/operaciones",
          moduleRequired: modules.PLANNING_OPERATIONS,
        },
        {
          title: "Documentos",
          icon: FileText,
          url: "/documentos",
          moduleRequired: modules.PLANNING_OPERATIONS,
        }
      );
    }

    // Core Operations (siempre disponible)
    items.push({
      title: "Inmersiones",
      icon: Anchor,
      url: "/inmersiones",
    });

    // Módulos Operativos
    if (isModuleActive(modules.MAINTENANCE_NETWORKS)) {
      items.push({
        title: "Mantención de Redes",
        icon: Wrench,
        url: "/mantencion-redes",
        moduleRequired: modules.MAINTENANCE_NETWORKS,
      });
    }

    if (isModuleActive(modules.MAINTENANCE_NETWORKS)) {
      items.push({
        title: "Faenas de Redes",
        icon: Network,
        url: "/faenas-redes",
        moduleRequired: modules.MAINTENANCE_NETWORKS,
      });
    }

    // Reportes Avanzados
    if (isModuleActive(modules.ADVANCED_REPORTING)) {
      items.push({
        title: "Reportes Avanzados",
        icon: BarChart3,
        url: "/reportes-avanzados",
        moduleRequired: modules.ADVANCED_REPORTING,
      });
    }

    // Integraciones
    if (isModuleActive(modules.EXTERNAL_INTEGRATIONS)) {
      items.push({
        title: "Integraciones",
        icon: Zap,
        url: "/integraciones",
        moduleRequired: modules.EXTERNAL_INTEGRATIONS,
      });
    }

    // Gestión para administradores
    if (userRole === 'superuser' || userRole === 'admin_salmonera' || userRole === 'admin_servicio') {
      items.push(
        {
          title: "Gestión de Módulos",
          icon: Shield,
          url: "/admin/module-management",
          roleRequired: 'admin',
        },
        {
          title: "Notificaciones",
          icon: Bell,
          url: "/admin/notifications",
          roleRequired: 'admin',
        }
      );
    }

    // Configuración (siempre disponible)
    items.push({
      title: "Configuración",
      icon: Settings,
      url: "/configuracion",
    });

    return items.filter(item => {
      // Filtrar por módulo requerido
      if (item.moduleRequired && !isModuleActive(item.moduleRequired)) {
        return false;
      }
      
      // Filtrar por rol si es necesario
      if (item.roleRequired === 'admin' && 
          userRole !== 'superuser' && 
          userRole !== 'admin_salmonera' && 
          userRole !== 'admin_servicio') {
        return false;
      }
      
      return true;
    });
  };

  return {
    navigationItems: getNavigationItems(),
    isModuleActive,
    modules,
  };
};
