
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Calendar,
  FileText,
  Users,
  Settings,
  Building,
  Shield,
  Database,
  ChevronRight,
  LogOut,
  User,
  Bell,
  Wrench,
  UserCheck,
  ClipboardList,
  Activity,
  Anchor,
  UserPlus,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const RoleBasedSidebar = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (!profile) return null;

  const getMenuItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        icon: Home,
        path: "/dashboard",
        roles: ["superuser", "admin_salmonera", "admin_servicio", "supervisor", "buzo"]
      }
    ];

    const operacionesItems = [
      {
        title: "Operaciones",
        icon: Calendar,
        path: "/operaciones",
        roles: ["superuser", "admin_salmonera", "admin_servicio", "supervisor"]
      }
    ];

    const formulariosItems = [
      {
        title: "Formularios",
        icon: FileText,
        group: "formularios",
        roles: ["superuser", "admin_salmonera", "admin_servicio", "supervisor", "buzo"],
        subItems: [
          {
            title: "HPT",
            path: "/formularios/hpt",
            roles: ["superuser", "admin_salmonera", "admin_servicio", "supervisor"]
          },
          {
            title: "Anexo Bravo",
            path: "/formularios/anexo-bravo",
            roles: ["superuser", "admin_salmonera", "admin_servicio", "supervisor"]
          },
          {
            title: "Bitácoras",
            path: "/formularios/bitacoras",
            roles: ["superuser", "admin_salmonera", "admin_servicio", "supervisor", "buzo"]
          },
          {
            title: "Inmersiones",
            path: "/formularios/inmersiones",
            roles: ["superuser", "admin_salmonera", "admin_servicio", "supervisor", "buzo"]
          },
          {
            title: "Equipo de Buceo",
            path: "/equipo-de-buceo",
            roles: ["superuser", "admin_salmonera", "admin_servicio", "supervisor"]
          },
          {
            title: "Usuarios",
            path: "/usuarios",
            roles: ["superuser", "admin_salmonera", "admin_servicio"]
          }
        ]
      }
    ];

    const adminItems = [
      {
        title: "Gestión",
        icon: Settings,
        group: "gestion",
        roles: ["superuser", "admin_salmonera", "admin_servicio"],
        subItems: [
          {
            title: "Usuarios",
            path: "/usuarios",
            roles: ["superuser", "admin_salmonera", "admin_servicio"]
          },
          {
            title: "Salmoneras",
            path: "/salmoneras",
            roles: ["superuser"]
          },
          {
            title: "Contratistas",
            path: "/contratistas",
            roles: ["superuser", "admin_salmonera"]
          },
          {
            title: "Sitios",
            path: "/sitios",
            roles: ["superuser", "admin_salmonera"]
          }
        ]
      }
    ];

    const superuserItems = [
      {
        title: "Administración",
        icon: Shield,
        group: "admin",
        roles: ["superuser"],
        subItems: [
          {
            title: "Personal Pool",
            path: "/personal-pool-admin",
            roles: ["superuser"]
          },
          {
            title: "Sistema",
            path: "/admin/sistema",
            roles: ["superuser"]
          },
          {
            title: "Configuración",
            path: "/configuracion",
            roles: ["superuser"]
          }
        ]
      }
    ];

    return [...baseItems, ...operacionesItems, ...formulariosItems, ...adminItems, ...superuserItems];
  };

  const menuItems = getMenuItems();
  const filteredItems = menuItems.filter(item => 
    item.roles.includes(profile.role as any)
  );

  const isActive = (path: string) => location.pathname === path;
  const isGroupActive = (subItems: any[]) => 
    subItems.some(item => location.pathname === item.path);

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Anchor className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">AquaOps</h2>
            <p className="text-xs text-gray-500">Gestión de Buceo</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarMenu>
            {filteredItems.map((item) => {
              if (item.group && item.subItems) {
                const hasActiveSubItem = isGroupActive(item.subItems.filter(subItem => 
                  subItem.roles.includes(profile.role as any)
                ));
                
                return (
                  <Collapsible
                    key={item.group}
                    open={openGroups[item.group] || hasActiveSubItem}
                    onOpenChange={() => toggleGroup(item.group)}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={`w-full justify-between ${
                            hasActiveSubItem ? 'bg-blue-50 text-blue-700' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                          </div>
                          <ChevronRight className={`w-4 h-4 transition-transform ${
                            openGroups[item.group] || hasActiveSubItem ? 'rotate-90' : ''
                          }`} />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems
                            .filter(subItem => subItem.roles.includes(profile.role as any))
                            .map((subItem) => (
                              <SidebarMenuSubItem key={subItem.path}>
                                <SidebarMenuSubButton
                                  onClick={() => navigate(subItem.path)}
                                  className={isActive(subItem.path) ? 'bg-blue-100 text-blue-700' : ''}
                                >
                                  {subItem.title}
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))
                          }
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path!)}
                    className={isActive(item.path!) ? 'bg-blue-100 text-blue-700' : ''}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 h-auto p-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {profile.nombre?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{profile.nombre} {profile.apellido}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {profile.role}
                  </Badge>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuItem onClick={() => navigate('/perfil')}>
              <User className="w-4 h-4 mr-2" />
              Mi Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/configuracion')}>
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
