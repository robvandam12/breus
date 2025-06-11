
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Building, 
  MapPin, 
  Anchor, 
  Shield, 
  UserCheck, 
  Calendar,
  Wrench,
  BookOpen,
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  Database
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import { BuzoNavigation } from "./BuzoNavigation";

export const RoleBasedSidebar = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  // Si es buzo, usar la navegación específica para buzos
  if (profile?.role === 'buzo') {
    return <BuzoNavigation />;
  }

  const navigationItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      url: "/",
      enabled: true
    },
    {
      title: "Empresas",
      icon: Building,
      url: "#",
      enabled: true,
      items: [
        { title: "Salmoneras", url: "/empresas/salmoneras" },
        { title: "Sitios", url: "/empresas/sitios" },
        { title: "Contratistas", url: "/empresas/contratistas" }
      ]
    },
    {
      title: "Operaciones",
      icon: Anchor,
      url: "#",
      enabled: true,
      items: [
        { title: "Gestión", url: "/operaciones" },
        { title: "HPT", url: "/operaciones/hpt" },
        { title: "Anexo Bravo", url: "/operaciones/anexo-bravo" },
        { title: "Inmersiones", url: "/inmersiones" }
      ]
    },
    {
      title: "Bitácoras",
      icon: FileText,
      url: "#",
      enabled: true,
      items: [
        { title: "Supervisor", url: "/bitacoras/supervisor" },
        { title: "Buzo", url: "/bitacoras/buzo" }
      ]
    },
    {
      title: "Equipo de Buceo",
      icon: Users,
      url: "/equipo-de-buceo",
      enabled: true
    },
    {
      title: "Formularios",
      icon: ClipboardList,
      url: "#",
      enabled: true,
      items: [
        { title: "HPT", url: "/formularios/hpt" },
        { title: "Anexo Bravo", url: "/formularios/anexo-bravo" }
      ]
    },
    {
      title: "Reportes",
      icon: TrendingUp,
      url: "/reportes",
      enabled: true
    }
  ];

  const adminItems = [
    {
      title: "Admin Roles",
      icon: Shield,
      url: "/admin/roles",
      enabled: profile?.role === 'superuser'
    },
    {
      title: "Gestión Usuarios",
      icon: UserCheck,
      url: "/admin/users",
      enabled: true
    },
    {
      title: "Admin Salmonera",
      icon: Database,
      url: "/admin/salmonera",
      enabled: profile?.role === 'admin_salmonera'
    }
  ];

  const renderNavigationItems = () => {
    return navigationItems.map((item) => {
      if (item.items) {
        return (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="flex items-center gap-2">
              <item.icon className="w-4 h-4" />
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton
                      asChild
                      className={location.pathname === subItem.url ? 'bg-blue-100 text-blue-900' : ''}
                    >
                      <Link to={subItem.url}>
                        {subItem.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      }

      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            disabled={!item.enabled}
            className={location.pathname === item.url ? 'bg-blue-100 text-blue-900' : ''}
          >
            <Link to={item.enabled ? item.url : '#'} className="flex items-center gap-2">
              <item.icon className="w-4 h-4" />
              {item.title}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Breus</h2>
            <p className="text-xs text-gray-500 capitalize">{profile?.role || 'Usuario'}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderNavigationItems()}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Administración */}
        <SidebarGroup>
          <SidebarGroupLabel>Administración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    disabled={!item.enabled}
                    className={`${location.pathname === item.url ? 'bg-blue-100 text-blue-900' : ''} ${!item.enabled ? 'opacity-50' : ''}`}
                  >
                    <Link to={item.enabled ? item.url : '#'} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-4">
        <div className="space-y-2">
          <div className="text-xs text-gray-500">
            {profile?.nombre} {profile?.apellido}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link to="/configuracion">
                <Settings className="w-3 h-3 mr-1" />
                Config
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
