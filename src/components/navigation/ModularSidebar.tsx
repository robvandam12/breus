
import React from 'react';
import { 
  Calendar, 
  ChevronRight, 
  FileText, 
  Book,
  Folder,
  Anchor,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  Users,
  Building,
  Menu,
  X
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { toast } from "@/hooks/use-toast";
import { useSidebar } from "@/components/ui/sidebar";

const BreusLogo = ({ size = 32 }: { size?: number }) => (
  <svg 
    version="1.2" 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 500 305" 
    width={size} 
    height={(size * 305) / 500}
    className="fill-white"
  >
    <path d="m355.2 201.7c-33.7 40.1-84.1 67.3-135.9 73.1-4.5 0.6-8.4 4.5-7.7 9.7 0.6 4.5 4.5 7.8 8.4 7.8h0.6c55.7-5.9 111.3-35 147.5-79 3.2-3.8 2.6-9-1.3-12.2-2.6-3.3-8.4-3.3-11.6 0.6z"/>
    <path d="m276.3 68.5h-0.7l-64-45.3c-2-1.3-4.5-1.9-6.5-1.3-1.9 0.7-4.5 2-5.2 3.9l-19.4 29.7c-77.6 8.5-146.1 62.1-170.1 114.5 0 0.7 0 1.3-0.6 2 0 0.6 0 1.3 0 1.3 0 0.6 0 1.2 0 1.2 0 0.7 0 1.3 0.6 2 16.2 35.6 60.8 80.2 116.5 102.2l9.7-15.6 69.8-103.4c2.6-3.9 1.3-9.7-2.6-12.3-3.9-2.6-9.7-1.3-12.3 2.6l-68.5 103.4-3.3 3.9c-43.9-20-76.3-53-91.1-84 23.9-48.6 88.6-97.1 161.6-101.6l20.1-29.1 18.1 12.9 33 25.3c40.7 14.2 73.7 40.1 93.8 64.6 3.2 3.9 8.4 4.6 12.2 1.3 3.9-3.2 4.6-8.4 1.3-12.3-20.7-25.2-53-51-92.4-65.9z"/>
    <path d="m486.4 84.6c-3.2-3.2-9-3.2-12.2 0l-82.8 82.8c-2 2-2.6 3.9-2.6 5.9 0 2.5 0.6 4.5 2.6 6.4l82.8 82.8c1.9 1.9 3.8 2.6 6.4 2.6 2.6 0 4.6-0.7 6.5-2.6 3.2-3.2 3.2-9.1 0-12.3l-77.6-76.9 76.9-76.4c3.3-3.2 3.3-9 0-12.3z"/>
    <path fillRule="evenodd" d="m112.6 162.3c-8.9 0-16.1-7.3-16.1-16.2 0-9 7.2-16.2 16.1-16.2 9 0 16.2 7.2 16.2 16.2 0 8.9-7.2 16.2-16.2 16.2z"/>
    <path d="m218.1 202.4l28.4-42.7c2.6-3.9 1.3-9.7-2.6-12.3-3.9-2.6-9.7-1.3-12.3 2.6l-0.6 0.6-26.5 41.4-12.3 18.8c-2.6 3.8-1.3 9.7 2.6 12.3 3.8 2.5 9.7 1.2 12.3-2.6l11-18.1c0-0.7 0 0 0 0z"/>
  </svg>
);

interface MenuSubItem {
  title: string;
  url: string;
  roleRequired?: string;
}

interface MenuItem {
  title: string;
  icon: React.ElementType;
  url?: string;
  badge?: string;
  items?: MenuSubItem[];
  roleRequired?: string;
}

const getMenuItemsForRole = (role?: string, isAssigned?: boolean): MenuItem[] => {
  // Buzo sin empresa asignada - navegación muy limitada
  if (role === 'buzo' && !isAssigned) {
    return [
      {
        title: "Dashboard",
        icon: BarChart3,
        url: "/",
      },
      {
        title: "Mi Perfil",
        icon: Users,
        url: "/profile-setup",
      }
    ];
  }

  // Buzo con empresa asignada
  if (role === 'buzo' && isAssigned) {
    return [
      {
        title: "Dashboard",
        icon: BarChart3,
        url: "/",
        badge: "3"
      },
      {
        title: "Personal de Buceo",
        icon: Users,
        url: "/personal-de-buceo"
      },
      {
        title: "Operaciones",
        icon: Calendar,
        url: "/operaciones",
        badge: "12"
      },
      {
        title: "Formularios",
        icon: FileText,
        items: [
          { title: "HPT", url: "/operaciones/hpt" },
          { title: "Anexo Bravo", url: "/operaciones/anexo-bravo" }
        ]
      },
      {
        title: "Inmersiones",
        icon: Anchor,
        url: "/inmersiones"
      }
    ];
  }

  // Supervisor y roles superiores
  return [
    {
      title: "Dashboard",
      icon: BarChart3,
      url: "/",
      badge: "3"
    },
    {
      title: "Empresas",
      icon: Building,
      items: [
        { title: "Salmoneras", url: "/empresas/salmoneras", roleRequired: "superuser" },
        { title: "Sitios", url: "/empresas/sitios" },
        { title: "Contratistas", url: "/empresas/contratistas" }
      ]
    },
    {
      title: "Personal de Buceo",
      icon: Users,
      url: "/personal-de-buceo"
    },
    {
      title: "Operaciones",
      icon: Calendar,
      items: [
        { title: "Planificar", url: "/operaciones" },
        { title: "HPT", url: "/operaciones/hpt" },
        { title: "Anexo Bravo", url: "/operaciones/anexo-bravo" },
        { title: "Mantención Redes", url: "/operaciones/network-maintenance" }
      ]
    },
    {
      title: "Inmersiones",
      icon: Anchor,
      url: "/inmersiones"
    },
    {
      title: "Bitácoras",
      icon: Book,
      items: [
        { title: "Supervisor", url: "/bitacoras/supervisor" },
        { title: "Buzo", url: "/bitacoras/buzo" }
      ]
    },
    {
      title: "Reportes",
      icon: BarChart3,
      url: "/reportes"
    },
    {
      title: "Configuración",
      icon: Settings,
      url: "/configuracion"
    },
    {
      title: "Administración",
      icon: Shield,
      items: [
        { title: "Usuarios", url: "/admin/users" },
        { title: "Roles", url: "/admin/roles", roleRequired: "superuser" },
        { title: "Módulos", url: "/admin/modules", roleRequired: "superuser" },
        { title: "Monitoreo", url: "/admin/system-monitoring", roleRequired: "superuser" }
      ],
      roleRequired: "supervisor"
    }
  ];
};

export const ModularSidebar = () => {
  const { user, signOut } = useAuth();
  const { isMobile } = useSidebar();
  
  const userRole = user?.user_metadata?.role;
  const isAssigned = user?.user_metadata?.empresa_id;
  
  const menuItems = getMenuItemsForRole(userRole, isAssigned);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión.",
        variant: "destructive",
      });
    }
  };

  const hasPermission = (requiredRole?: string) => {
    if (!requiredRole) return true;
    if (requiredRole === 'superuser') return userRole === 'superuser';
    if (requiredRole === 'supervisor') return ['supervisor', 'admin_salmonera', 'superuser'].includes(userRole);
    return true;
  };

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BreusLogo size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-zinc-900">BREUS</span>
              <span className="text-xs text-zinc-500">Sistema de Gestión</span>
            </div>
          </div>
          {isMobile && <SidebarTrigger className="md:hidden" />}
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                if (!hasPermission(item.roleRequired)) return null;

                if (item.items) {
                  return (
                    <Collapsible key={item.title} asChild defaultOpen>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title} className="py-2">
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="ml-4 space-y-1">
                            {item.items.map((subItem) => {
                              if (!hasPermission(subItem.roleRequired)) return null;
                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild className="py-1">
                                    <Link to={subItem.url} className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                                      <span className="text-sm">{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} className="py-2">
                      <Link to={item.url!} className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0.5">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-zinc-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 truncate">
              {user?.user_metadata?.nombre_completo || user?.email}
            </p>
            <p className="text-xs text-zinc-500 capitalize">
              {userRole?.replace('_', ' ') || 'Usuario'}
            </p>
          </div>
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
      </SidebarFooter>
    </Sidebar>
  );
};
