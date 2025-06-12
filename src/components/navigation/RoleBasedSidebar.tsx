
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LogOut, 
  User, 
  LayoutDashboard, 
  Users, 
  Building, 
  Factory, 
  Settings, 
  Webhook,
  Calendar,
  BarChart3,
  MapPin,
  Box,
  Anchor,
  FileText,
  ClipboardCheck,
  ClipboardList
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthRoles } from '@/hooks/useAuthRoles';

const iconMap = {
  'layout-dashboard': LayoutDashboard,
  'users': Users,
  'building': Building,
  'factory': Factory,
  'settings': Settings,
  'webhook': Webhook,
  'calendar': Calendar,
  'bar-chart-3': BarChart3,
  'map-pin': MapPin,
  'box': Box,
  'anchor': Anchor,
  'file-text': FileText,
  'clipboard-check': ClipboardCheck,
  'clipboard-list': ClipboardList,
  'user': User
};

const roleMenus = {
  superuser: [
    {
      title: "Administración",
      items: [
        { title: "Dashboard", url: "/", icon: "layout-dashboard" },
        { title: "Usuarios", url: "/usuarios", icon: "users" },
        { title: "Salmoneras", url: "/salmoneras", icon: "building" },
        { title: "Contratistas", url: "/contratistas", icon: "factory" },
        { title: "Configuración", url: "/configuracion", icon: "settings" },
        { title: "Webhooks", url: "/webhooks", icon: "webhook" },
      ]
    },
    {
      title: "Operaciones",
      items: [
        { title: "Operaciones", url: "/operaciones", icon: "calendar" },
        { title: "Reportes", url: "/reportes", icon: "bar-chart-3" },
      ]
    }
  ],
  admin_salmonera: [
    {
      title: "Administración",
      items: [
        { title: "Dashboard", url: "/", icon: "layout-dashboard" },
        { title: "Sitios", url: "/sitios", icon: "map-pin" },
        { title: "Contratistas", url: "/contratistas", icon: "factory" },
        { title: "Configuración", url: "/configuracion", icon: "settings" },
      ]
    },
    {
      title: "Operaciones",
      items: [
        { title: "Operaciones", url: "/operaciones", icon: "calendar" },
        { title: "Reportes", url: "/reportes", icon: "bar-chart-3" },
      ]
    }
  ],
  admin_servicio: [
    {
      title: "Administración",
      items: [
        { title: "Dashboard", url: "/", icon: "layout-dashboard" },
        { title: "Equipos", url: "/equipos", icon: "box" },
        { title: "Configuración", url: "/configuracion", icon: "settings" },
      ]
    },
    {
      title: "Operaciones",
      items: [
        { title: "Operaciones", url: "/operaciones", icon: "calendar" },
        { title: "Reportes", url: "/reportes", icon: "bar-chart-3" },
      ]
    }
  ],
  supervisor: [
    {
      title: "Operaciones",
      items: [
        { title: "Dashboard", url: "/", icon: "layout-dashboard" },
        { title: "Operaciones", url: "/operaciones", icon: "calendar" },
        { title: "Inmersiones", url: "/inmersiones", icon: "anchor" },
        { title: "Bitácoras", url: "/bitacoras", icon: "file-text" },
        { title: "Reportes", url: "/reportes", icon: "bar-chart-3" },
      ]
    },
    {
      title: "Formularios",
      items: [
        { title: "HPT", url: "/formularios/hpt", icon: "clipboard-check" },
        { title: "Anexo Bravo", url: "/formularios/anexo-bravo", icon: "clipboard-list" },
      ]
    }
  ],
  buzo: [
    {
      title: "Dashboard",
      items: [
        { title: "Inicio", url: "/", icon: "layout-dashboard" },
      ]
    },
    {
      title: "Mi Actividad",
      items: [
        { title: "Mis Operaciones", url: "/buzo/operaciones", icon: "calendar" },
        { title: "Mis Inmersiones", url: "/buzo/inmersiones", icon: "anchor" },
        { title: "Mis Bitácoras", url: "/bitacoras/buzo", icon: "file-text" },
      ]
    },
    {
      title: "Análisis",
      items: [
        { title: "Reportes", url: "/buzo/reportes", icon: "bar-chart-3" },
      ]
    },
    {
      title: "Perfil",
      items: [
        { title: "Completar Perfil", url: "/profile-setup", icon: "user" },
      ]
    }
  ]
};

export const RoleBasedSidebar = () => {
  const { profile, signOut } = useAuth();
  const { getRoleLabel, getRoleBadgeColor } = useAuthRoles();
  const location = useLocation();

  const currentRole = profile?.role || 'buzo';
  const menu = roleMenus[currentRole] || roleMenus['buzo'];

  return (
    <Sidebar className="bg-zinc-50">
      <SidebarContent>
        <SidebarHeader>
          <Link to="/" className="flex items-center gap-4 px-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.perfil_buzo?.foto_perfil || `/avatars/${profile?.nombre}.png`} alt={profile?.nombre} />
              <AvatarFallback>{profile?.nombre?.charAt(0)}{profile?.apellido?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-bold">{profile?.nombre} {profile?.apellido}</span>
              <Badge className={getRoleBadgeColor(currentRole)} variant="secondary">
                {getRoleLabel(currentRole)}
              </Badge>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarMenu>
          {menu.map((group, index) => (
            <SidebarGroup key={index}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                {group.items.map((item, i) => {
                  const IconComponent = iconMap[item.icon as keyof typeof iconMap] || LayoutDashboard;
                  return (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location.pathname === item.url}
                      >
                        <Link to={item.url} className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
