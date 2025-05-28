
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Calendar,
  Anchor,
  FileText,
  Shield,
  Users,
  Building2,
  Settings,
  MapPin,
  UserPlus,
  Bell,
  Home,
  Activity,
  ChevronDown,
  ChevronRight,
  Waves,
  UserCheck,
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { LogoutButton } from './LogoutButton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function RoleBasedSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [operacionesOpen, setOperacionesOpen] = useState(false);
  const [formularioOpen, setFormularioOpen] = useState(false);
  const [bitacorasOpen, setBitacorasOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  
  const isSupervisor = profile?.rol === 'supervisor' || profile?.rol === 'admin' || profile?.rol === 'superuser';
  const isAdmin = profile?.rol === 'admin' || profile?.rol === 'superuser';

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/dashboard",
      roles: ['all']
    },
    {
      title: "Operaciones",
      icon: Calendar,
      roles: ['all'],
      submenu: [
        { title: "Ver Operaciones", path: "/operaciones", icon: Calendar },
        { title: "Equipos de Buceo", path: "/equipos-de-buceo", icon: Users },
        { title: "Inmersiones", path: "/inmersiones", icon: Anchor },
      ]
    },
    {
      title: "Formularios",
      icon: FileText,
      roles: ['supervisor', 'admin', 'superuser'],
      submenu: [
        { title: "HPT", path: "/formularios/hpt", icon: FileText },
        { title: "Anexo Bravo", path: "/formularios/anexo-bravo", icon: Shield },
      ]
    },
    {
      title: "Bitácoras",
      icon: Activity,
      roles: ['all'],
      submenu: [
        { title: "Bitácora Supervisor", path: "/bitacoras/supervisor", icon: UserCheck },
        { title: "Bitácora Buzo", path: "/bitacoras/buzo", icon: Waves },
      ]
    },
  ];

  const adminMenuItems = [
    { title: "Salmoneras", path: "/admin/salmonera", icon: Building2 },
    { title: "Contratistas", path: "/admin/contratistas", icon: Building2 },
    { title: "Sitios", path: "/admin/sitios", icon: MapPin },
    { title: "Personal Disponible", path: "/admin/salmonera", icon: UserPlus, tab: "personal-disponible" },
    { title: "Notificaciones", path: "/admin/notifications", icon: Bell },
    { title: "Configuración", path: "/admin/settings", icon: Settings },
  ];

  const handleNavigation = (path: string, tab?: string) => {
    if (tab) {
      navigate(`${path}?tab=${tab}`);
    } else {
      navigate(path);
    }
  };

  return (
    <Sidebar className="w-72">
      <SidebarHeader className="border-b border-border/50 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">AquaOps</h2>
            <p className="text-xs text-muted-foreground">Sistema de Buceo</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                if (item.roles[0] !== 'all' && !item.roles.includes(profile?.rol || '')) {
                  return null;
                }

                if (item.submenu) {
                  const isSubmenuActive = item.submenu.some(subItem => isActive(subItem.path));
                  const isOpen = item.title === "Operaciones" ? operacionesOpen : 
                               item.title === "Formularios" ? formularioOpen :
                               item.title === "Bitácoras" ? bitacorasOpen : false;
                  const setOpen = item.title === "Operaciones" ? setOperacionesOpen : 
                                item.title === "Formularios" ? setFormularioOpen :
                                item.title === "Bitácoras" ? setBitacorasOpen : () => {};

                  return (
                    <SidebarMenuItem key={item.title}>
                      <Collapsible open={isOpen} onOpenChange={setOpen}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={cn(
                              "w-full justify-between hover:bg-accent hover:text-accent-foreground transition-colors",
                              isSubmenuActive && "bg-accent text-accent-foreground"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="w-4 h-4" />
                              <span className="font-medium">{item.title}</span>
                            </div>
                            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="ml-4 mt-2 space-y-1">
                            {item.submenu.map((subItem) => (
                              <SidebarMenuButton
                                key={subItem.path}
                                onClick={() => navigate(subItem.path)}
                                className={cn(
                                  "w-full justify-start pl-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                                  isActive(subItem.path) && "bg-accent text-accent-foreground font-medium"
                                )}
                              >
                                <subItem.icon className="w-4 h-4 mr-2" />
                                {subItem.title}
                              </SidebarMenuButton>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "w-full justify-start hover:bg-accent hover:text-accent-foreground transition-colors",
                        isActive(item.path) && "bg-accent text-accent-foreground font-medium"
                      )}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      <span className="font-medium">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <>
            <Separator className="my-4" />
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-2 mb-2">
                Administración
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <Collapsible open={adminOpen} onOpenChange={setAdminOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between h-9 px-2 font-normal hover:bg-accent hover:text-accent-foreground"
                    >
                      <div className="flex items-center gap-3">
                        <Settings className="w-4 h-4" />
                        <span>Admin</span>
                      </div>
                      {adminOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenu className="ml-4 mt-2">
                      {adminMenuItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            onClick={() => handleNavigation(item.path, item.tab)}
                            className={cn(
                              "w-full justify-start pl-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                              isActive(item.path) && "bg-accent text-accent-foreground font-medium"
                            )}
                          >
                            <item.icon className="w-4 h-4 mr-2" />
                            {item.title}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">
              {profile?.nombre?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {profile?.nombre} {profile?.apellido}
            </p>
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="text-xs">
                {profile?.rol || 'buzo'}
              </Badge>
            </div>
          </div>
        </div>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
