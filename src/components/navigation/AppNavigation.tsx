
import { useAdaptiveNavigation } from "./AdaptiveNavigation";
import { useAuth } from "@/hooks/useAuth";
import { useModularSystem } from "@/hooks/useModularSystem";
import { 
  Calendar, 
  FileText, 
  Anchor,
  Settings,
  BarChart3,
  Users,
  Shield,
  Building2,
  Wrench
} from "lucide-react";

interface NavigationItem {
  title: string;
  icon: React.ElementType;
  url: string;
  badge?: string;
  moduleRequired?: string;
  roleRequired?: string[];
}

export const useAppNavigation = () => {
  const { profile } = useAuth();
  const { hasModuleAccess, modules, getUserContext } = useModularSystem();
  
  const userContext = getUserContext();
  
  // Calculate if user is assigned to a company
  const isAssigned = Boolean(profile?.salmonera_id || profile?.servicio_id);

  const getNavigationItems = (): NavigationItem[] => {
    const items: NavigationItem[] = [
      {
        title: "Dashboard",
        icon: BarChart3,
        url: "/",
      }
    ];

    // Cuadrillas de Buceo - disponible para roles operativos
    if (profile?.role !== 'buzo' || isAssigned) {
      items.push({
        title: "Cuadrillas de Buceo",
        icon: Users,
        url: "/cuadrillas-de-buceo",
        badge: userContext.isContratista ? "Operativo" : undefined
      });
    }

    // Personal Global - solo superuser
    if (profile?.role === 'superuser') {
      items.push({
        title: "Personal Global",
        icon: Users,
        url: "/company-personnel",
        roleRequired: ['superuser'],
      });
    }

    // Módulo de Planificación (Operaciones, HPT, Anexo Bravo)
    if (hasModuleAccess(modules.PLANNING_OPERATIONS)) {
      items.push(
        {
          title: "Operaciones",
          icon: Calendar,
          url: "/operaciones",
          moduleRequired: modules.PLANNING_OPERATIONS,
          badge: userContext.isContratista ? "Asociar" : undefined
        }
      );
    }

    // Core Operations (siempre disponible)
    items.push({
      title: "Inmersiones",
      icon: Anchor,
      url: "/inmersiones",
      badge: userContext.isContratista && !hasModuleAccess(modules.PLANNING_OPERATIONS) ? "Independientes" : undefined
    });

    // Gestión de Personal - Diferenciado por rol
    if (profile?.role === 'superuser') {
      items.push({
        title: "Global User Management",
        icon: Shield,
        url: "/admin/users",
        roleRequired: ['superuser'],
      });
    }

    if (profile?.role === 'admin_salmonera' || profile?.role === 'admin_servicio') {
      items.push({
        title: "Company Personnel",
        icon: Users,
        url: "/empresas/usuarios",
        roleRequired: ['admin_salmonera', 'admin_servicio'],
      });
    }

    // Gestión de Empresas (solo superuser)
    if (profile?.role === 'superuser') {
      items.push({
        title: "Salmoneras",
        icon: Building2,
        url: "/empresas/salmoneras",
        roleRequired: ['superuser'],
      });
    }

    // Reportes
    items.push({
      title: "Reportes",
      icon: BarChart3,
      url: "/reportes",
    });

    // Configuración (siempre disponible)
    items.push({
      title: "Configuración",
      icon: Settings,
      url: "/configuracion",
    });

    return items.filter(item => {
      // Filtrar por módulo requerido
      if (item.moduleRequired && !hasModuleAccess(item.moduleRequired)) {
        return false;
      }
      
      // Filtrar por rol si es necesario
      if (item.roleRequired && profile?.role && !item.roleRequired.includes(profile.role)) {
        return false;
      }
      
      return true;
    });
  };

  return {
    navigationItems: getNavigationItems(),
    hasModuleAccess,
    modules,
    userContext,
  };
};
