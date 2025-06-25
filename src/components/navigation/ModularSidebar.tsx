
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOperationalContext } from '@/hooks/useOperationalContext';
import { useModularSystem } from '@/hooks/useModularSystem';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Anchor, 
  Calendar, 
  FileText, 
  Settings,
  Users,
  Building2,
  Shield,
  Wrench,
  Network,
  Zap,
  Bell
} from "lucide-react";

interface NavigationItem {
  title: string;
  icon: React.ElementType;
  url: string;
  badge?: string;
  moduleRequired?: string;
  roleRequired?: string[];
  isCore?: boolean;
}

export const ModularSidebar = () => {
  const { profile } = useAuth();
  const location = useLocation();
  const { canCreateOperations, canCreateMaintenanceForms, getWorkflowType } = useOperationalContext();
  const { hasModuleAccess, modules, canAccessAdvancedReports, canUseIntegrations } = useModularSystem();

  const getNavigationItems = (): NavigationItem[] => {
    const items: NavigationItem[] = [
      {
        title: "Dashboard",
        icon: BarChart3,
        url: "/",
        isCore: true,
      }
    ];

    // CORE OPERATIONS - Siempre disponibles
    items.push({
      title: "Inmersiones",
      icon: Anchor,
      url: "/inmersiones",
      isCore: true,
      badge: getWorkflowType() === 'direct' ? 'Directo' : undefined,
    });

    // MÓDULOS OPCIONALES - Solo si están activos
    if (canCreateOperations()) {
      items.push(
        {
          title: "Operaciones",
          icon: Calendar,
          url: "/operaciones",
          moduleRequired: modules.PLANNING_OPERATIONS,
          badge: 'Planificación',
        },
        {
          title: "Documentos",
          icon: FileText,
          url: "/documentos",
          moduleRequired: modules.PLANNING_OPERATIONS,
        }
      );
    }

    // Módulo de Mantención de Redes
    if (canCreateMaintenanceForms()) {
      items.push(
        {
          title: "Mantención de Redes",
          icon: Wrench,
          url: "/mantencion-redes",
          moduleRequired: modules.MAINTENANCE_NETWORKS,
        },
        {
          title: "Faenas de Redes",
          icon: Network,
          url: "/faenas-redes",
          moduleRequired: modules.MAINTENANCE_NETWORKS,
        }
      );
    }

    // Reportes Avanzados
    if (canAccessAdvancedReports()) {
      items.push({
        title: "Reportes Avanzados",
        icon: BarChart3,
        url: "/reportes-avanzados",
        moduleRequired: modules.ADVANCED_REPORTING,
      });
    }

    // Integraciones
    if (canUseIntegrations()) {
      items.push({
        title: "Integraciones",
        icon: Zap,
        url: "/integraciones",
        moduleRequired: modules.EXTERNAL_INTEGRATIONS,
      });
    }

    // GESTIÓN DE PERSONAL - Diferenciado por rol y contexto
    if (profile?.role === 'superuser') {
      items.push({
        title: "Gestión Global",
        icon: Shield,
        url: "/admin/users",
        roleRequired: ['superuser'],
        isCore: true,
      });
    }

    if (profile?.role === 'admin_salmonera' || profile?.role === 'admin_servicio') {
      items.push({
        title: "Personal Empresa",
        icon: Users,
        url: "/company-personnel",
        roleRequired: ['admin_salmonera', 'admin_servicio'],
        isCore: true,
      });
    }

    if (profile?.role === 'admin_salmonera' || profile?.role === 'admin_servicio' || profile?.role === 'supervisor') {
      items.push({
        title: "Equipos de Buceo",
        icon: Users,
        url: "/personal-de-buceo",
        roleRequired: ['admin_salmonera', 'admin_servicio', 'supervisor'],
        isCore: true,
      });
    }

    // Gestión de Empresas (solo superuser)
    if (profile?.role === 'superuser') {
      items.push({
        title: "Salmoneras",
        icon: Building2,
        url: "/salmoneras",
        roleRequired: ['superuser'],
        isCore: true,
      });
    }

    // Gestión para administradores
    if (profile?.role === 'superuser' || profile?.role === 'admin_salmonera' || profile?.role === 'admin_servicio') {
      items.push({
        title: "Gestión de Módulos",
        icon: Shield,
        url: "/admin/module-management",
        roleRequired: ['superuser', 'admin_salmonera', 'admin_servicio'],
        isCore: true,
      });
    }

    // Configuración (siempre disponible)
    items.push({
      title: "Configuración",
      icon: Settings,
      url: "/configuracion",
      isCore: true,
    });

    return items.filter(item => {
      // Filtrar por rol si es necesario
      if (item.roleRequired && profile?.role && !item.roleRequired.includes(profile.role)) {
        return false;
      }
      
      return true;
    });
  };

  const navigationItems = getNavigationItems();
  const coreItems = navigationItems.filter(item => item.isCore);
  const moduleItems = navigationItems.filter(item => !item.isCore);

  const isActive = (url: string) => {
    if (url === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(url);
  };

  const getItemBadgeVariant = (item: NavigationItem) => {
    if (item.isCore) return 'secondary';
    if (item.moduleRequired) return 'default';
    return 'outline';
  };

  const renderMenuItem = (item: NavigationItem) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild isActive={isActive(item.url)}>
        <Link to={item.url} className="flex items-center gap-3">
          <item.icon className="w-4 h-4" />
          <span className="flex-1">{item.title}</span>
          {item.badge && (
            <Badge variant={getItemBadgeVariant(item)} className="text-xs">
              {item.badge}
            </Badge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <Anchor className="w-6 h-6 text-blue-600" />
          <span className="font-semibold text-lg">AquaOps</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Modo: {getWorkflowType() === 'direct' ? 'Operación Directa' : 
                getWorkflowType() === 'planned' ? 'Planificación' : 'Mixto'}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* FUNCIONALIDADES CORE */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-green-700">
            Funcionalidades Core
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {coreItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* MÓDULOS OPCIONALES */}
        {moduleItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-blue-700">
              Módulos Activos
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {moduleItems.map(renderMenuItem)}
              </SidebarMenu>
            </SidebarGroupContent>
            <div className="px-3 py-2 text-xs text-muted-foreground">
              {moduleItems.length} módulo{moduleItems.length !== 1 ? 's' : ''} activo{moduleItems.length !== 1 ? 's' : ''}
            </div>
          </SidebarGroup>
        )}

        {/* INFORMACIÓN CONTEXTUAL */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-600">
            Estado del Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-2 space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Inmersiones:</span>
                <Badge variant="secondary" className="text-xs">Siempre activo</Badge>
              </div>
              <div className="flex justify-between">
                <span>Planificación:</span>
                <Badge variant={canCreateOperations() ? "default" : "outline"} className="text-xs">
                  {canCreateOperations() ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Mantención:</span>
                <Badge variant={canCreateMaintenanceForms() ? "default" : "outline"} className="text-xs">
                  {canCreateMaintenanceForms() ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-4">
        <div className="text-xs text-muted-foreground">
          {profile?.nombre} {profile?.apellido}
        </div>
        <div className="text-xs text-muted-foreground">
          {profile?.role === 'superuser' ? 'Superusuario' :
           profile?.role === 'admin_salmonera' ? 'Admin Salmonera' :
           profile?.role === 'admin_servicio' ? 'Admin Servicio' :
           profile?.role === 'supervisor' ? 'Supervisor' :
           profile?.role === 'buzo' ? 'Buzo' : 'Usuario'}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
