
import {
  LayoutDashboard,
  Settings,
  Building,
  MapPin,
  Users,
  FileText,
  Waves,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAuthRoles } from '@/hooks/useAuthRoles';
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
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function AppSidebar() {
  const { profile, signOut } = useAuth();
  const { permissions, currentRole } = useAuthRoles();
  const location = useLocation();
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 font-semibold px-2 py-1">
          <Waves className="w-6 h-6 text-blue-600" />
          <span>Breus</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActiveRoute('/dashboard')}>
                  <Link to="/dashboard">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {currentRole === 'admin_salmonera' && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActiveRoute('/admin/salmonera')}>
                    <Link to="/admin/salmonera">
                      <Building className="w-4 h-4" />
                      <span>Panel Administrador</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {(permissions.manage_salmoneras || permissions.manage_sitios || permissions.manage_contratistas) && (
                <Collapsible>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <Building className="w-4 h-4" />
                        <span>Empresas</span>
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {permissions.manage_salmoneras && (
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={isActiveRoute('/empresas/salmoneras')}>
                              <Link to="/empresas/salmoneras">Salmoneras</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )}
                        {permissions.manage_sitios && (
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={isActiveRoute('/empresas/sitios')}>
                              <Link to="/empresas/sitios">Sitios</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )}
                        {permissions.manage_contratistas && (
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={isActiveRoute('/empresas/contratistas')}>
                              <Link to="/empresas/contratistas">Contratistas</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )}

              {permissions.view_all_operaciones && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActiveRoute('/operaciones/operaciones')}>
                    <Link to="/operaciones/operaciones">
                      <Settings className="w-4 h-4" />
                      <span>Operaciones</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {permissions.create_inmersion && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActiveRoute('/operaciones/inmersiones')}>
                    <Link to="/operaciones/inmersiones">
                      <Waves className="w-4 h-4" />
                      <span>Inmersiones</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {(permissions.create_bitacora_supervisor || permissions.create_bitacora_buzo) && (
                <Collapsible>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <FileText className="w-4 h-4" />
                        <span>Bitácoras</span>
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {permissions.create_bitacora_supervisor && (
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={isActiveRoute('/operaciones/bitacoras-supervisor')}>
                              <Link to="/operaciones/bitacoras-supervisor">Supervisor</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )}
                        {permissions.create_bitacora_buzo && (
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={isActiveRoute('/operaciones/bitacoras-buzo')}>
                              <Link to="/operaciones/bitacoras-buzo">Buzo</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActiveRoute('/reportes')}>
                  <Link to="/reportes">
                    <Clock className="w-4 h-4" />
                    <span>Reportes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActiveRoute('/configuracion')}>
                  <Link to="/configuracion">
                    <Settings className="w-4 h-4" />
                    <span>Configuración</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Imagen de perfil" />
                    <AvatarFallback>
                      {profile?.nombre?.[0]}{profile?.apellido?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {profile?.nombre} {profile?.apellido}
                    </span>
                    <span className="truncate text-xs">{profile?.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" align="start" side="top">
                <DropdownMenuItem>
                  <Link to="/profile" className="w-full flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
