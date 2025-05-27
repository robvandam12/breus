
import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "@/hooks/useRouter";
import { 
  Building2, 
  Calendar, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  User,
  Ship,
  MapPin,
  Waves,
  ClipboardList,
  Shield,
  Home,
  Anchor
} from "lucide-react";

interface MenuItemType {
  title: string;
  url?: string;
  icon: React.ComponentType<any>;
  roles: string[];
  submenu?: Array<{
    title: string;
    url: string;
    icon: React.ComponentType<any>;
    roles: string[];
  }>;
}

export function RoleBasedSidebar() {
  const { profile, user, signOut } = useAuth();
  const { navigateTo } = useRouter();
  
  // Get current path from window.location
  const currentPath = window.location.pathname;

  const handleLogout = async () => {
    try {
      await signOut();
      navigateTo('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Determinar el rol del usuario
  const getUserRole = () => {
    if (!profile) return 'guest';
    
    if (profile.rol === 'superuser') return 'superuser';
    if (profile.rol === 'admin_salmonera') return 'admin_salmonera';
    if (profile.rol === 'admin_servicio') return 'admin_servicio';
    if (profile.rol === 'supervisor') return 'supervisor';
    if (profile.rol === 'buzo') return 'buzo';
    
    return 'guest';
  };

  const userRole = getUserRole();

  // Configuración de menú basada en roles
  const getMenuItems = (): MenuItemType[] => {
    const baseItems = [
      {
        title: "Inicio",
        url: "/",
        icon: Home,
        roles: ['superuser', 'admin_salmonera', 'admin_servicio', 'supervisor', 'buzo']
      }
    ];

    const menuItems: MenuItemType[] = [
      ...baseItems,
      {
        title: "Empresas",
        url: "/empresas",
        icon: Building2,
        roles: ['superuser']
      },
      {
        title: "Salmoneras",
        url: "/empresas/salmoneras",
        icon: Building2,
        roles: ['superuser']
      },
      {
        title: "Servicios",
        url: "/empresas/servicios",
        icon: Ship,
        roles: ['superuser']
      },
      {
        title: "Sitios",
        url: "/empresas/sitios",
        icon: MapPin,
        roles: ['superuser', 'admin_salmonera', 'admin_servicio']
      },
      {
        title: "Contratistas",
        url: "/empresas/contratistas",
        icon: Users,
        roles: ['superuser', 'admin_salmonera', 'admin_servicio']
      },
      {
        title: "Equipos de Buceo",
        url: "/empresas/equipos-buceo",
        icon: Anchor,
        roles: ['superuser', 'admin_salmonera', 'admin_servicio']
      },
      {
        title: "Operaciones",
        url: "/operaciones",
        icon: Calendar,
        roles: ['superuser', 'admin_salmonera', 'admin_servicio', 'supervisor']
      },
      {
        title: "Inmersiones",
        url: "/inmersiones",
        icon: Waves,
        roles: ['superuser', 'admin_salmonera', 'admin_servicio', 'supervisor', 'buzo']
      },
      {
        title: "Formularios",
        icon: FileText,
        roles: ['superuser', 'admin_salmonera', 'admin_servicio', 'supervisor'],
        submenu: [
          {
            title: "HPT",
            url: "/formularios/hpt",
            icon: ClipboardList,
            roles: ['superuser', 'admin_salmonera', 'admin_servicio', 'supervisor']
          },
          {
            title: "Anexo Bravo",
            url: "/formularios/anexo-bravo",
            icon: Shield,
            roles: ['superuser', 'admin_salmonera', 'admin_servicio', 'supervisor']
          }
        ]
      }
    ];

    // Solo mostrar usuarios para superuser
    if (userRole === 'superuser') {
      menuItems.push({
        title: "Usuarios",
        url: "/usuarios",
        icon: Users,
        roles: ['superuser']
      });
    }

    menuItems.push({
      title: "Configuración",
      url: "/configuracion",
      icon: Settings,
      roles: ['superuser', 'admin_salmonera', 'admin_servicio', 'supervisor', 'buzo']
    });

    return menuItems.filter(item => item.roles.includes(userRole));
  };

  const menuItems = getMenuItems();

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'superuser':
        return { label: 'Super Usuario', color: 'bg-purple-100 text-purple-800' };
      case 'admin_salmonera':
        return { label: 'Admin Salmonera', color: 'bg-blue-100 text-blue-800' };
      case 'admin_servicio':
        return { label: 'Admin Servicio', color: 'bg-green-100 text-green-800' };
      case 'supervisor':
        return { label: 'Supervisor', color: 'bg-orange-100 text-orange-800' };
      case 'buzo':
        return { label: 'Buzo', color: 'bg-teal-100 text-teal-800' };
      default:
        return { label: 'Usuario', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const roleDisplay = getRoleDisplay(userRole);

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Waves className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">AquaSafe</h1>
            <p className="text-sm text-gray-500">Sistema de Buceo</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarMenu className="px-3 py-4">
          {menuItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              {item.submenu ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm font-medium text-gray-700 flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.title}
                  </div>
                  <div className="ml-8 space-y-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <SidebarMenuButton
                        key={subIndex}
                        onClick={() => navigateTo(subItem.url)}
                        className={`w-full justify-start text-left ${
                          currentPath === subItem.url
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <subItem.icon className="w-4 h-4" />
                        {subItem.title}
                      </SidebarMenuButton>
                    ))}
                  </div>
                </div>
              ) : (
                <SidebarMenuButton
                  onClick={() => item.url && navigateTo(item.url)}
                  className={`w-full justify-start text-left ${
                    currentPath === item.url
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.title}
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-100 bg-gray-50">
        {profile && (
          <div className="space-y-3">
            {/* Información de la empresa */}
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">
                {profile.salmonera_id ? 'Salmonera' : profile.servicio_id ? 'Servicio' : 'Sin empresa asignada'}
              </p>
            </div>

            {/* Información del usuario */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-sm font-semibold">
                  {profile.nombre?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile.nombre} {profile.apellido}
                </p>
                <Badge className={`text-xs ${roleDisplay.color}`}>
                  {roleDisplay.label}
                </Badge>
              </div>
            </div>

            {/* Botón de logout */}
            <SidebarMenuButton
              onClick={handleLogout}
              className="w-full justify-start text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </SidebarMenuButton>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
