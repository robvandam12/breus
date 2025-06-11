
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, FileText, User, Settings, LogOut, Anchor, Bell, Building } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "react-router-dom";

export const BuzoNavigation = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  
  const isAssigned = profile?.salmonera_id || profile?.servicio_id;
  const isProfileComplete = true; // profile?.perfil_completado

  const navigationItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      url: "/",
      enabled: true
    },
    {
      title: "Mis Bitácoras",
      icon: FileText,
      url: "/bitacoras/buzo",
      enabled: isAssigned && isProfileComplete,
      badge: 2 // Número de bitácoras pendientes
    },
    {
      title: "Mis Inmersiones",
      icon: Anchor,
      url: "/inmersiones/buzo",
      enabled: isAssigned && isProfileComplete
    },
    {
      title: "Mi Perfil",
      icon: User,
      url: "/profile-setup",
      enabled: true,
      badge: !isProfileComplete ? "!" : undefined
    },
    {
      title: "Notificaciones",
      icon: Bell,
      url: "/notifications",
      enabled: true,
      badge: 3 // Número de notificaciones no leídas
    }
  ];

  const empresaInfo = isAssigned ? {
    nombre: profile?.salmonera_id ? 'Salmonera Pacific' : 'Servicios Submarinos',
    tipo: profile?.salmonera_id ? 'Salmonera' : 'Contratista'
  } : null;

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Breus</h2>
            <p className="text-xs text-gray-500">Buzo Professional</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Información de la empresa */}
        {empresaInfo && (
          <SidebarGroup>
            <SidebarGroupLabel>Mi Empresa</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-2 py-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    {empresaInfo.nombre}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {empresaInfo.tipo}
                </Badge>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Navegación principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    disabled={!item.enabled}
                    className={`${
                      location.pathname === item.url 
                        ? 'bg-blue-100 text-blue-900 border-blue-200' 
                        : ''
                    } ${!item.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Link to={item.enabled ? item.url : '#'} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge 
                          variant={item.badge === "!" ? "destructive" : "secondary"} 
                          className="ml-auto text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Estado del perfil */}
        {!isProfileComplete && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="px-2 py-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800 font-medium mb-2">
                  Completa tu perfil
                </p>
                <p className="text-xs text-yellow-600 mb-3">
                  Para acceder a todas las funciones, completa tu información profesional.
                </p>
                <Button size="sm" className="w-full text-xs" asChild>
                  <Link to="/profile-setup">
                    Completar Perfil
                  </Link>
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Estado de asignación */}
        {!isAssigned && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="px-2 py-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-xs text-orange-800 font-medium mb-2">
                  Pendiente de asignación
                </p>
                <p className="text-xs text-orange-600">
                  Un administrador debe asignarte a una empresa para comenzar a trabajar.
                </p>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
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
