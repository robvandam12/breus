
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
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { toast } from "@/hooks/use-toast";

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
        url: "/operaciones/inmersiones",
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
        url: "/configuracion",
      }
    ];
  }

  // Supervisor
  if (role === 'supervisor') {
    return [
      {
        title: "Dashboard",
        icon: BarChart3,
        url: "/",
        badge: "5"
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
        url: "/operaciones/inmersiones",
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
      }
    ];
  }

  // Admin Servicio (Contratista)
  if (role === 'admin_servicio') {
    return [
      {
        title: "Dashboard",
        icon: BarChart3,
        url: "/",
        badge: "8"
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
        url: "/operaciones/inmersiones",
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
        title: "Mi Empresa",
        icon: Building,
        items: [
          { title: "Información", url: "/empresas/contratistas" }
        ]
      },
      {
        title: "Configuración",
        icon: Settings,
        url: "/configuracion"
      }
    ];
  }

  // Admin Salmonera
  if (role === 'admin_salmonera') {
    return [
      {
        title: "Dashboard",
        icon: BarChart3,
        url: "/",
        badge: "15"
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
        url: "/operaciones/inmersiones",
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
        title: "Reportes",
        icon: BarChart3,
        url: "/reportes"
      },
      {
        title: "Mi Empresa",
        icon: Building,
        items: [
          { title: "Sitios", url: "/empresas/sitios" },
          { title: "Contratistas", url: "/empresas/contratistas" },
          { title: "Personal Disponible", url: "/admin/salmonera" }
        ]
      },
      {
        title: "Configuración",
        icon: Settings,
        url: "/configuracion"
      }
    ];
  }

  // Superuser
  if (role === 'superuser') {
    return [
      {
        title: "Dashboard",
        icon: BarChart3,
        url: "/",
        badge: "3"
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
        url: "/operaciones/inmersiones",
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
        title: "Empresas",
        icon: Folder,
        items: [
          { title: "Salmoneras", url: "/empresas/salmoneras", roleRequired: "superuser" },
          { title: "Sitios", url: "/empresas/sitios" },
          { title: "Contratistas", url: "/empresas/contratistas" }
        ]
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
          { title: "Gestión de Usuarios", url: "/admin/users", roleRequired: "superuser" },
          { title: "Roles y Permisos", url: "/admin/roles", roleRequired: "superuser" }
        ]
      }
    ];
  }

  return [];
};

export function RoleBasedSidebar() {
  const { profile, signOut } = useAuth();
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();

  // Fix the type error by explicitly converting to boolean
  const isAssigned = Boolean(profile?.salmonera_id || profile?.servicio_id);
  const menuItems = getMenuItemsForRole(profile?.role, isAssigned);

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roleRequired) return true;
    return profile?.role === item.roleRequired;
  }).map(item => ({
    ...item,
    items: item.items?.filter(subItem => {
      if (!subItem.roleRequired) return true;
      return profile?.role === subItem.roleRequired;
    })
  }));

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
    if (profile?.salmonera_id) {
      const salmonera = salmoneras.find(s => s.id === profile.salmonera_id);
      return salmonera?.nombre || 'Empresa no encontrada';
    }
    if (profile?.servicio_id) {
      const contratista = contratistas.find(c => c.id === profile.servicio_id);
      return contratista?.nombre || 'Empresa no encontrada';
    }
    return null;
  };

  return (
    <Sidebar className="border-r border-border/40 font-sans bg-white">
      <SidebarHeader className="border-b border-border/40 p-4 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BreusLogo size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-zinc-900">Breus</h2>
            <p className="text-xs text-zinc-500">Gestión de Buceo</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2 bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider font-medium text-zinc-500 mb-2">
            Navegación Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items && item.items.length > 0 ? (
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
      
      <SidebarFooter className="border-t border-border/40 p-4 bg-white">
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
