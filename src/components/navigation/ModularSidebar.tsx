
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { 
  BarChart3, 
  Anchor, 
  FileText, 
  Settings, 
  Users, 
  Building, 
  Map,
  Shield,
  LogOut,
  Bell
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { EnhancedNotificationButton } from "@/components/layout/EnhancedNotificationButton";
import { supabase } from "@/integrations/supabase/client";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
    roles: ["superuser", "admin_salmonera", "admin_servicio", "supervisor", "buzo"]
  },
  {
    title: "Inmersiones",
    url: "/inmersiones",
    icon: Anchor,
    roles: ["superuser", "admin_salmonera", "admin_servicio", "supervisor", "buzo"]
  },
  {
    title: "Bitácoras",
    icon: FileText,
    roles: ["superuser", "admin_salmonera", "admin_servicio", "supervisor", "buzo"],
    subItems: [
      {
        title: "Bitácoras Supervisor",
        url: "/bitacoras/supervisor",
        roles: ["superuser", "admin_salmonera", "admin_servicio", "supervisor"]
      },
      {
        title: "Bitácoras Buzo",
        url: "/bitacoras/buzo",
        roles: ["superuser", "admin_salmonera", "admin_servicio", "supervisor", "buzo"]
      }
    ]
  },
  {
    title: "Empresas",
    icon: Building,
    roles: ["superuser", "admin_salmonera"],
    subItems: [
      {
        title: "Salmoneras",
        url: "/empresas/salmoneras",
        roles: ["superuser"]
      },
      {
        title: "Sitios",
        url: "/empresas/sitios",
        roles: ["superuser", "admin_salmonera"]
      },
      {
        title: "Contratistas",
        url: "/empresas/contratistas",
        roles: ["superuser", "admin_salmonera"]
      },
      {
        title: "Usuarios",
        url: "/empresas/usuarios",
        roles: ["superuser", "admin_salmonera", "admin_servicio"]
      }
    ]
  },
  {
    title: "Personal",
    icon: Users,
    roles: ["superuser", "admin_salmonera", "admin_servicio", "supervisor"],
    subItems: [
      {
        title: "Personal de Buceo",
        url: "/personal-de-buceo",
        roles: ["superuser", "admin_salmonera", "admin_servicio", "supervisor"]
      },
      {
        title: "Pool de Personal",
        url: "/company-personnel",
        roles: ["superuser", "admin_salmonera", "admin_servicio"]
      }
    ]
  },
  {
    title: "Administración",
    icon: Shield,
    roles: ["superuser"],
    subItems: [
      {
        title: "Gestión de Usuarios",
        url: "/admin/users",
        roles: ["superuser"]
      },
      {
        title: "Roles y Permisos",
        url: "/admin/roles",
        roles: ["superuser"]
      },
      {
        title: "Módulos del Sistema",
        url: "/admin/modules",
        roles: ["superuser"]
      },
      {
        title: "Monitoreo del Sistema",
        url: "/admin/system-monitoring",
        roles: ["superuser"]
      }
    ]
  },
  {
    title: "Reportes",
    url: "/reportes",
    icon: BarChart3,
    roles: ["superuser", "admin_salmonera", "admin_servicio", "supervisor"]
  },
  {
    title: "Configuración",
    url: "/configuracion",
    icon: Settings,
    roles: ["superuser", "admin_salmonera", "admin_servicio", "supervisor", "buzo"]
  }
];

export const ModularSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const hasAccess = (roles: string[]) => {
    return roles.includes(profile?.rol || 'buzo');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (url: string) => {
    return location.pathname === url;
  };

  const isGroupActive = (item: any) => {
    if (item.url) return isActive(item.url);
    if (item.subItems) {
      return item.subItems.some((subItem: any) => isActive(subItem.url));
    }
    return false;
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Anchor className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">AquaSystem</h2>
              <p className="text-xs text-gray-500">{profile?.rol || 'Usuario'}</p>
            </div>
          </div>
          <EnhancedNotificationButton />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel>Navegación Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                if (!hasAccess(item.roles)) return null;

                if (item.subItems) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <div className="mb-2">
                        <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-gray-700">
                          <item.icon className="w-4 h-4" />
                          {item.title}
                        </div>
                        <div className="ml-6 space-y-1">
                          {item.subItems.map((subItem) => {
                            if (!hasAccess(subItem.roles)) return null;
                            return (
                              <SidebarMenuButton
                                key={subItem.url}
                                onClick={() => navigate(subItem.url)}
                                className={cn(
                                  "text-sm",
                                  isActive(subItem.url) && "bg-blue-100 text-blue-700"
                                )}
                              >
                                {subItem.title}
                              </SidebarMenuButton>
                            );
                          })}
                        </div>
                      </div>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.url!)}
                      className={cn(
                        "flex items-center gap-2",
                        isActive(item.url!) && "bg-blue-100 text-blue-700"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <div className="text-xs text-gray-500">
            Conectado como: {profile?.nombre} {profile?.apellido}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
