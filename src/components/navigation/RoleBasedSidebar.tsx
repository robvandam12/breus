
import React from "react";
import { useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Waves,
  BookOpen,
  Briefcase,
  FileText,
  Settings,
  AlertTriangle,
  Users,
  Wrench,
  Network
} from "lucide-react";
import { useModules } from "@/hooks/useModules";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  iconColor?: string;
  isActive: boolean;
}

export const RoleBasedSidebar = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const { isModuleActive } = useModules();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      toast({
        title: "Error al cerrar sesión",
        description: "No se pudo cerrar la sesión. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName ? firstName.charAt(0) : ''}${lastName ? lastName.charAt(0) : ''}`.toUpperCase();
  };

  const getNavItems = () => {
    if (!profile) return [];

    const baseItems = [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: location.pathname === "/dashboard",
      }
    ];

    const coreItems = [
      {
        title: "Inmersiones",
        url: "/inmersiones",
        icon: Waves,
        iconColor: "text-blue-600",
        isActive: location.pathname.startsWith("/inmersiones"),
      },
      {
        title: "Bitácoras",
        url: "/bitacoras",
        icon: BookOpen,
        iconColor: "text-green-600",
        isActive: location.pathname.startsWith("/bitacoras"),
      }
    ];

    const planningItems = isModuleActive('planificacion') ? [
      {
        title: "Operaciones",
        url: "/operaciones",
        icon: Briefcase,
        iconColor: "text-purple-600",
        isActive: location.pathname.startsWith("/operaciones"),
      },
      {
        title: "Documentos",
        url: "/documentos",
        icon: FileText,
        iconColor: "text-orange-600",
        isActive: location.pathname.startsWith("/documentos"),
      }
    ] : [];

    const moduleItems = [];
    
    if (isModuleActive('mantencion_redes')) {
      moduleItems.push({
        title: "Mantención de Redes",
        url: "/mantencion-redes",
        icon: Wrench,
        iconColor: "text-yellow-600",
        isActive: location.pathname.startsWith("/mantencion-redes"),
      });
    }

    if (isModuleActive('faena_redes')) {
      moduleItems.push({
        title: "Faena de Redes",
        url: "/faena-redes",
        icon: Network,
        iconColor: "text-cyan-600",
        isActive: location.pathname.startsWith("/faena-redes"),
      });
    }

    const adminItems = (profile.role === 'superuser' || profile.role === 'admin_salmonera') ? [
      {
        title: "Admin",
        url: "/admin",
        icon: Settings,
        isActive: location.pathname.startsWith("/admin"),
      },
      {
        title: "Usuarios",
        url: "/usuarios",
        icon: Users,
        isActive: location.pathname.startsWith("/usuarios"),
      }
    ] : [];

    const reportItems = (profile.role === 'superuser' || profile.role === 'admin_salmonera') ? [
      {
        title: "Reportes",
        url: "/reportes",
        icon: AlertTriangle,
        isActive: location.pathname.startsWith("/reportes"),
      }
    ] : [];

    return [
      ...baseItems,
      ...coreItems,
      ...planningItems,
      ...moduleItems,
      ...adminItems,
      ...reportItems
    ].filter(Boolean);
  };

  const navItems = getNavItems();

  return (
    <Sidebar className="bg-gray-50 border-r">
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <a href="/dashboard" className="flex items-center space-x-2 font-semibold">
            <Settings className="h-6 w-6" />
            <span>BuceoApp</span>
          </a>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={item.isActive}>
                <a href={item.url} className="flex items-center space-x-2">
                  <item.icon className={`h-4 w-4 ${item.iconColor || ''}`} />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-full rounded-md p-0 data-[state=open]:bg-muted">
              <Avatar className="mr-2 h-6 w-6">
                <AvatarImage src={""} alt={profile?.nombre || "User"} />
                <AvatarFallback>{profile && profile.nombre && profile.apellido ? getInitials(profile.nombre, profile.apellido) : "UN"}</AvatarFallback>
              </Avatar>
              <span>{profile?.nombre || "Usuario"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
