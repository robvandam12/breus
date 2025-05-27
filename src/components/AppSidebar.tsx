
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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

interface NotificationItemProps {
  notification: any;
  onMarkAsRead?: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
  return (
    <div className="p-3 border-b border-border/20 cursor-pointer hover:bg-gray-50" 
         onClick={() => onMarkAsRead?.(notification.id)}>
      <div className="font-medium text-sm">{notification.title}</div>
      <div className="text-xs text-gray-500">{notification.message}</div>
    </div>
  );
};

export function AppSidebar() {
  const { profile, signOut } = useAuth();
  const { navigateTo } = useRouter();
  const location = useLocation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const isUsersSectionVisible = profile?.role === 'superuser';

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
    await signOut();
    navigateTo('/login');
  };

  return (
    <Sidebar className="border-r border-border/20">
      <SidebarHeader className="border-b border-border/20 p-4">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 370 65.89" className="text-[#64d7d6]">
            <g transform="matrix(1.348163072271423,0,0,1.348163072271423,-17.25648886792441,-33.63938972663369)" fill="currentColor">
              <g>
                <path d="M66.2,56.5c-5.2,6.2-13,10.4-21,11.3c-0.7,0.1-1.3,0.7-1.2,1.5c0.1,0.7,0.7,1.2,1.3,1.2c0,0,0.1,0,0.1,0   c8.6-0.9,17.2-5.4,22.8-12.2c0.5-0.6,0.4-1.4-0.2-1.9C67.6,55.9,66.7,55.9,66.2,56.5z"/>
                <path d="M54,35.9c0,0-0.1,0-0.1,0L44,28.9c-0.3-0.2-0.7-0.3-1-0.2c-0.3,0.1-0.7,0.3-0.8,0.6l-3,4.6c-12,1.3-22.6,9.6-26.3,17.7   c0,0,0,0,0,0c0,0.1,0,0.2-0.1,0.3c0,0.1,0,0.2,0,0.2c0,0.1,0,0.2,0,0.2c0,0.1,0,0.2,0.1,0.3c0,0,0,0,0,0c2.5,5.5,9.4,12.4,18,15.8   l1.5-2.4l0,0L43.2,50c0.4-0.6,0.2-1.5-0.4-1.9c-0.6-0.4-1.5-0.2-1.9,0.4l-10.6,16l-0.5,0.6c-6.8-3.1-11.8-8.2-14.1-13   c3.7-7.5,13.7-15,25-15.7l0,0l3.1-4.5l2.8,2l5.1,3.9C58,40,63.1,44,66.2,47.8c0.5,0.6,1.3,0.7,1.9,0.2c0.6-0.5,0.7-1.3,0.2-1.9   C65.1,42.2,60.1,38.2,54,35.9z"/>
                <path d="M86.5,38.4c-0.5-0.5-1.4-0.5-1.9,0L71.8,51.2c-0.3,0.3-0.4,0.6-0.4,0.9c0,0.4,0.1,0.7,0.4,1l12.8,12.8   c0.3,0.3,0.6,0.4,1,0.4s0.7-0.1,1-0.4c0.5-0.5,0.5-1.4,0-1.9L74.6,52.1l11.9-11.8C87,39.8,87,38.9,86.5,38.4z"/>
                <ellipse cx="28.7" cy="47.9" rx="2.5" ry="2.5"/>
                <path d="M45,56.6l4.4-6.6c0.4-0.6,0.2-1.5-0.4-1.9c-0.6-0.4-1.5-0.2-1.9,0.4l-0.1,0.1c0,0,0,0,0,0L42.9,55l-1.9,2.9   c-0.4,0.6-0.2,1.5,0.4,1.9c0.6,0.4,1.5,0.2,1.9-0.4h0L45,56.6C45,56.5,45,56.6,45,56.6z"/>
              </g>
            </g>
          </svg>
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
                isActive={location?.pathname === '/'}
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
                  isActive={location?.pathname === '/operaciones'}
                  className="ios-button"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Operaciones</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigateTo('/inmersiones')}
                  isActive={location?.pathname === '/inmersiones'}
                  className="ios-button"
                >
                  <Waves className="w-5 h-5" />
                  <span>Inmersiones</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigateTo('/equipo-de-buceo')}
                  isActive={location?.pathname === '/equipo-de-buceo'}
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
                  isActive={location?.pathname === '/formularios/hpt'}
                  className="ios-button"
                >
                  <FileText className="w-5 h-5" />
                  <span>HPT</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigateTo('/formularios/anexo-bravo')}
                  isActive={location?.pathname === '/formularios/anexo-bravo'}
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
                  isActive={location?.pathname === '/bitacoras/supervisor'}
                  className="ios-button"
                >
                  <ClipboardCheck className="w-5 h-5" />
                  <span>Bitácoras Supervisor</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigateTo('/bitacoras/buzo')}
                  isActive={location?.pathname === '/bitacoras/buzo'}
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
                  isActive={location?.pathname === '/empresas'}
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
                    isActive={location?.pathname === '/usuarios'}
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
                  isActive={location?.pathname === '/reportes'}
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
                  isActive={location?.pathname === '/configuracion'}
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
              <AvatarImage src={''} />
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
