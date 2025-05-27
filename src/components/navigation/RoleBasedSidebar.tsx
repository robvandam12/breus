
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
  User,
  Building
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
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface MenuSubItem {
  title: string;
  url: string;
  roleRequired?: string[];
}

interface MenuItem {
  title: string;
  icon: React.ElementType;
  url?: string;
  badge?: string;
  items?: MenuSubItem[];
  roleRequired?: string[];
}

export function RoleBasedSidebar() {
  const { profile, signOut } = useAuth();

  const getMenuItemsForRole = (): MenuItem[] => {
    const isAssigned = profile?.salmonera_id || profile?.servicio_id;

    // Buzo sin empresa asignada - navegación muy limitada
    if (profile?.role === 'buzo' && !isAssigned) {
      return [
        {
          title: "Inicio",
          icon: BarChart3,
          url: "/",
        },
        {
          title: "Mi Perfil",
          icon: User,
          url: "/profile-setup",
        }
      ];
    }

    // Buzo con empresa asignada
    if (profile?.role === 'buzo' && isAssigned) {
      return [
        {
          title: "Dashboard",
          icon: BarChart3,
          url: "/",
          badge: "3"
        },
        {
          title: "Mis Inmersiones",
          icon: Anchor,
          url: "/inmersiones",
        },
        {
          title: "Mis Bitácoras",
          icon: Book,
          url: "/bitacoras/buzo",
        },
        {
          title: "Equipo de Buceo",
          icon: Users,
          url: "/equipo-de-buceo"
        },
        {
          title: "Mi Perfil",
          icon: User,
          url: "/profile-setup",
        }
      ];
    }

    // Supervisor
    if (profile?.role === 'supervisor') {
      return [
        {
          title: "Dashboard",
          icon: BarChart3,
          url: "/",
          badge: "5"
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
            { title: "HPT", url: "/formularios/hpt" },
            { title: "Anexo Bravo", url: "/formularios/anexo-bravo" }
          ]
        },
        {
          title: "Inmersiones",
          icon: Anchor,
          url: "/inmersiones",
          badge: "7"
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
          title: "Equipo de Buceo",
          icon: Users,
          url: "/equipo-de-buceo"
        },
        {
          title: "Reportes",
          icon: BarChart3,
          url: "/reportes"
        }
      ];
    }

    // Admin Servicio (Contratista)
    if (profile?.role === 'admin_servicio') {
      return [
        {
          title: "Dashboard",
          icon: BarChart3,
          url: "/",
          badge: "8"
        },
        {
          title: "Mi Empresa",
          icon: Building,
          items: [
            { title: "Información", url: "/empresas/contratistas" },
            { title: "Usuarios", url: "/admin/users" }
          ]
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
            { title: "HPT", url: "/formularios/hpt" },
            { title: "Anexo Bravo", url: "/formularios/anexo-bravo" }
          ]
        },
        {
          title: "Inmersiones",
          icon: Anchor,
          url: "/inmersiones",
          badge: "7"
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
          title: "Equipo de Buceo",
          icon: Users,
          url: "/equipo-de-buceo"
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
        }
      ];
    }

    // Admin Salmonera - NAVEGACIÓN ESTANDARIZADA
    if (profile?.role === 'admin_salmonera') {
      return [
        {
          title: "Dashboard",
          icon: BarChart3,
          url: "/",
          badge: "15"
        },
        {
          title: "Mi Empresa",
          icon: Building,
          items: [
            { title: "Sitios", url: "/empresas/sitios" },
            { title: "Contratistas", url: "/empresas/contratistas" },
            { title: "Usuarios", url: "/admin/users" }
          ]
        },
        {
          title: "Operaciones",
          icon: Calendar,
          url: "/operaciones",
          badge: "25"
        },
        {
          title: "Formularios",
          icon: FileText,
          items: [
            { title: "HPT", url: "/formularios/hpt" },
            { title: "Anexo Bravo", url: "/formularios/anexo-bravo" }
          ]
        },
        {
          title: "Inmersiones",
          icon: Anchor,
          url: "/inmersiones",
          badge: "18"
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
          title: "Equipo de Buceo",
          icon: Users,
          url: "/equipo-de-buceo"
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
        }
      ];
    }

    // Superuser
    if (profile?.role === 'superuser') {
      return [
        {
          title: "Dashboard",
          icon: BarChart3,
          url: "/",
          badge: "3"
        },
        {
          title: "Empresas",
          icon: Folder,
          items: [
            { title: "Salmoneras", url: "/empresas/salmoneras" },
            { title: "Sitios", url: "/empresas/sitios" },
            { title: "Contratistas", url: "/empresas/contratistas" }
          ]
        },
        {
          title: "Equipo de Buceo",
          icon: Users,
          url: "/equipo-de-buceo"
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
            { title: "HPT", url: "/formularios/hpt" },
            { title: "Anexo Bravo", url: "/formularios/anexo-bravo" }
          ]
        },
        {
          title: "Inmersiones",
          icon: Anchor,
          url: "/inmersiones",
          badge: "7"
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
          title: "Admin",
          icon: Shield,
          items: [
            { title: "Gestión de Usuarios", url: "/admin/users" },
            { title: "Roles y Permisos", url: "/admin/roles" }
          ]
        }
      ];
    }

    return [];
  };

  const menuItems = getMenuItemsForRole();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error",
        description: "Error al cerrar sesión.",
        variant: "destructive",
      });
    }
  };

  const getUserDisplayName = () => {
    if (profile) {
      return `${profile.nombre} ${profile.apellido}`.trim() || profile.email;
    }
    return 'Usuario';
  };

  const getRoleDisplayName = (role?: string) => {
    switch (role) {
      case 'superuser':
        return 'Super Usuario';
      case 'admin_salmonera':
        return 'Admin Salmonera';
      case 'admin_servicio':
        return 'Admin Servicio';
      case 'supervisor':
        return 'Supervisor';
      case 'buzo':
        return 'Buzo';
      default:
        return 'Usuario';
    }
  };

  const getCompanyName = () => {
    // TODO: Obtener el nombre real de la empresa desde la base de datos
    if (profile?.role === 'admin_salmonera' && profile?.salmonera_id) {
      return 'Salmonera Blumar'; // Placeholder - debería venir de la BD
    }
    if (profile?.role === 'admin_servicio' && profile?.servicio_id) {
      return 'Servicio Buceo Corp'; // Placeholder - debería venir de la BD
    }
    return null;
  };

  return (
    <Sidebar className="border-r border-border/40 font-sans">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg">Breus</h2>
            <p className="text-xs text-zinc-500">Gestión de Buceo</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider font-medium text-zinc-500 mb-2">
            Navegación Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible defaultOpen className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full">
                          <item.icon className="w-4 h-4" />
                          <span className="flex-1">{item.title}</span>
                          <ChevronRight className="w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link to={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link to={item.url!} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </div>
                        {item.badge && (
                          <Badge variant="secondary" className="h-5 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border/40 p-4">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-100">
          <div className="w-8 h-8 bg-zinc-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {getUserDisplayName().charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{getUserDisplayName()}</p>
            <p className="text-xs text-zinc-500 truncate">{getRoleDisplayName(profile?.role)}</p>
            {getCompanyName() && (
              <p className="text-xs text-blue-600 truncate font-medium">{getCompanyName()}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-8 w-8 p-0"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
