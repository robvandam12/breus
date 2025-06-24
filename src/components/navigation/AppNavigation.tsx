
import { useAdaptiveNavigation } from "./AdaptiveNavigation";
import { useAuth } from "@/hooks/useAuth";
import { 
  Calendar, 
  FileText, 
  Anchor,
  Settings,
  BarChart3,
  Users,
  Shield,
  Building2,
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
  const { isModuleActive, modules } = useAdaptiveNavigation(profile?.role);

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

    // Gestión de Personal - Diferenciado por rol
    if (profile?.role === 'superuser') {
      items.push({
        title: "Gestión Global de Usuarios",
        icon: Shield,
        url: "/admin/users",
        roleRequired: ['superuser'],
      });
    }

    if (profile?.role === 'admin_salmonera' || profile?.role === 'admin_servicio') {
      items.push({
        title: "Personal de la Empresa",
        icon: Users,
        url: "/personal-pool",
        roleRequired: ['admin_salmonera', 'admin_servicio'],
      });
    }

    // Personal de Buceo (equipos operativos) - Disponible para roles operativos
    if (profile?.role === 'admin_salmonera' || profile?.role === 'admin_servicio' || profile?.role === 'supervisor') {
      items.push({
        title: "Equipos de Buceo",
        icon: Users,
        url: "/personal-de-buceo",
        roleRequired: ['admin_salmonera', 'admin_servicio', 'supervisor'],
      });
    }

    // Gestión de Empresas (solo superuser)
    if (profile?.role === 'superuser') {
      items.push({
        title: "Salmoneras",
        icon: Building2,
        url: "/salmoneras",
        roleRequired: ['superuser'],
      });
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
      if (item.roleRequired && profile?.role && !item.roleRequired.includes(profile.role)) {
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
