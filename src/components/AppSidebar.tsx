import React, { useEffect, useState } from "react";
import { useRouter } from "@/hooks/useRouter";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/ui/logo";
import {
  Home,
  Calendar,
  FileText,
  ClipboardCheck,
  FileCheck,
  Building,
  Users,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Waves,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NotificationItem } from "@/components/notifications/NotificationItem";

export function AppSidebar() {
  const { profile, logout } = useAuth();
  const { location, navigateTo } = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const isUsersSectionVisible = profile?.rol === 'superuser';

  useEffect(() => {
    if (profile?.id) {
      fetchNotifications();
    }
  }, [profile?.id]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', profile?.id)
        .eq('read', false);

      fetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigateTo('/login');
  };

  return (
    <Sidebar className="border-r border-border/20">
      <SidebarHeader className="border-b border-border/20 p-4">
        <div className="flex items-center gap-3">
          <Logo width={100} height={18} />
          <span className="text-sm font-medium text-zinc-600">AquaTech</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigateTo('/')}
                isActive={location.pathname === '/'}
                className="ios-button"
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Operaciones */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigateTo('/operaciones')}
                  isActive={location.pathname === '/operaciones'}
                  className="ios-button"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Operaciones</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigateTo('/inmersiones')}
                  isActive={location.pathname === '/inmersiones'}
                  className="ios-button"
                >
                  <Waves className="w-5 h-5" />
                  <span>Inmersiones</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigateTo('/equipo-de-buceo')}
                  isActive={location.pathname === '/equipo-de-buceo'}
                  className="ios-button"
                >
                  <Users className="w-5 h-5" />
                  <span>Equipos de Buceo</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Formularios */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigateTo('/formularios/hpt')}
                  isActive={location.pathname === '/formularios/hpt'}
                  className="ios-button"
                >
                  <FileText className="w-5 h-5" />
                  <span>HPT</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigateTo('/formularios/anexo-bravo')}
                  isActive={location.pathname === '/formularios/anexo-bravo'}
                  className="ios-button"
                >
                  <FileCheck className="w-5 h-5" />
                  <span>Anexo Bravo</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bitácoras */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigateTo('/bitacoras/supervisor')}
                  isActive={location.pathname === '/bitacoras/supervisor'}
                  className="ios-button"
                >
                  <ClipboardCheck className="w-5 h-5" />
                  <span>Bitácoras Supervisor</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigateTo('/bitacoras/buzo')}
                  isActive={location.pathname === '/bitacoras/buzo'}
                  className="ios-button"
                >
                  <FileText className="w-5 h-5" />
                  <span>Bitácoras Buzo</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Gestión de Empresas */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigateTo('/empresas')}
                  isActive={location.pathname === '/empresas'}
                  className="ios-button"
                >
                  <Building className="w-5 h-5" />
                  <span>Empresas</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Usuarios - Only for superuser */}
        {isUsersSectionVisible && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => navigateTo('/usuarios')}
                    isActive={location.pathname === '/usuarios'}
                    className="ios-button"
                  >
                    <Users className="w-5 h-5" />
                    <span>Usuarios</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Reportes */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigateTo('/reportes')}
                  isActive={location.pathname === '/reportes'}
                  className="ios-button"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Reportes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Configuración */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigateTo('/configuracion')}
                  isActive={location.pathname === '/configuracion'}
                  className="ios-button"
                >
                  <Settings className="w-5 h-5" />
                  <span>Configuración</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="bg-zinc-200 text-zinc-800">
                {profile?.nombre?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-zinc-900">
                {profile?.nombre} {profile?.apellido}
              </p>
              <p className="text-xs text-zinc-500">{profile?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Popover open={showNotifications} onOpenChange={setShowNotifications}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full h-8 w-8 ios-button"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white"
                      variant="destructive"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-3 border-b border-border/20 flex items-center justify-between">
                  <h3 className="font-medium">Notificaciones</h3>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs h-7"
                    >
                      Marcar todas como leídas
                    </Button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-zinc-500 text-sm">
                      No hay notificaciones
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                      />
                    ))
                  )}
                </div>
                <div className="p-2 border-t border-border/20">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => navigateTo('/notificaciones')}
                  >
                    Ver todas
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="rounded-full h-8 w-8 ios-button"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
