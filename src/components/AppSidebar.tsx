
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
  Building2,
  MapPin
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuthRoles } from "@/hooks/useAuthRoles";

interface MenuItem {
  title: string;
  icon: any;
  url?: string;
  badge?: string;
  items?: { title: string; url: string }[];
}

export function AppSidebar() {
  const { currentRole, permissions, canAccessPage } = useAuthRoles();

  const getMenuItemsForRole = (): MenuItem[] => {
    const baseItems: MenuItem[] = [
      {
        title: "Dashboard",
        icon: BarChart3,
        url: "/",
        badge: "3"
      }
    ];

    // Items específicos por rol
    if (currentRole === 'superuser') {
      return [
        ...baseItems,
        {
          title: "Administración",
          icon: Shield,
          items: [
            { title: "Salmoneras", url: "/admin/salmoneras" },
            { title: "Contratistas", url: "/admin/contratistas" },
            { title: "Usuarios", url: "/admin/usuarios" },
            { title: "Sistema", url: "/admin/sistema" }
          ]
        },
        {
          title: "Empresas",
          icon: Building2,
          items: [
            { title: "Salmoneras", url: "/empresas/salmoneras" },
            { title: "Sitios", url: "/empresas/sitios" },
            { title: "Contratistas", url: "/empresas/contratistas" }
          ]
        },
        {
          title: "Pool de Usuarios",
          icon: Users,
          url: "/pool-usuarios",
          badge: "12"
        },
        {
          title: "Operaciones",
          icon: Calendar,
          url: "/operaciones",
          badge: "7"
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
          badge: "5"
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
        }
      ];
    }

    if (currentRole === 'admin_salmonera') {
      return [
        ...baseItems,
        {
          title: "Mi Salmonera",
          icon: Building2,
          items: [
            { title: "Sitios", url: "/empresas/sitios" },
            { title: "Contratistas", url: "/empresas/contratistas" }
          ]
        },
        {
          title: "Pool de Usuarios",
          icon: Users,
          url: "/pool-usuarios",
          badge: "12"
        },
        {
          title: "Operaciones",
          icon: Calendar,
          url: "/operaciones",
          badge: "7"
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
          badge: "5"
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
        }
      ];
    }

    if (currentRole === 'admin_servicio') {
      return [
        ...baseItems,
        {
          title: "Mi Empresa",
          icon: Building2,
          items: [
            { title: "Equipos", url: "/empresa/equipos" },
            { title: "Usuarios", url: "/empresa/usuarios" }
          ]
        },
        {
          title: "Operaciones",
          icon: Calendar,
          url: "/operaciones"
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
        }
      ];
    }

    if (currentRole === 'supervisor') {
      return [
        ...baseItems,
        {
          title: "Mis Operaciones",
          icon: Calendar,
          url: "/operaciones"
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
          url: "/inmersiones"
        },
        {
          title: "Mi Bitácora",
          icon: Book,
          url: "/bitacoras/supervisor"
        }
      ];
    }

    if (currentRole === 'buzo') {
      return [
        ...baseItems,
        {
          title: "Mis Inmersiones",
          icon: Anchor,
          url: "/inmersiones"
        },
        {
          title: "Mi Bitácora",
          icon: Book,
          url: "/bitacoras/buzo"
        }
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItemsForRole();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
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

  return (
    <Sidebar className="border-r border-border/40">
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
              {currentRole === 'superuser' ? 'SU' : 
               currentRole === 'admin_salmonera' ? 'AS' :
               currentRole === 'admin_servicio' ? 'AE' :
               currentRole === 'supervisor' ? 'SV' : 'BU'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Usuario {currentRole}</p>
            <p className="text-xs text-zinc-500 truncate">{currentRole}@breus.cl</p>
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
