
import { useModuleAccess } from "@/hooks/useModuleAccess";
import { 
  Calendar, 
  FileText, 
  Anchor,
  Settings,
  BarChart3,
  Wrench,
  Network,
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
    if (isModuleActive(modules.PLANNING)) {
      items.push(
        {
          title: "Operaciones",
          icon: Calendar,
          url: "/operaciones",
          moduleRequired: modules.PLANNING,
        },
        {
          title: "Documentos",
          icon: FileText,
          url: "/documentos",
          moduleRequired: modules.PLANNING,
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
    if (isModuleActive(modules.NETWORK_MAINTENANCE)) {
      items.push({
        title: "Mantención de Redes",
        icon: Wrench,
        url: "/mantencion-redes",
        moduleRequired: modules.NETWORK_MAINTENANCE,
      });
    }

    if (isModuleActive(modules.NETWORK_OPERATIONS)) {
      items.push({
        title: "Faenas de Redes",
        icon: Network,
        url: "/faenas-redes",
        moduleRequired: modules.NETWORK_OPERATIONS,
      });
    }

    // Reportes
    if (isModuleActive(modules.REPORTS)) {
      items.push({
        title: "Reportes",
        icon: BarChart3,
        url: "/reportes",
        moduleRequired: modules.REPORTS,
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
      if (item.roleRequired && userRole !== item.roleRequired) {
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
