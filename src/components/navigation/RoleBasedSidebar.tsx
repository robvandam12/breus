
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  Anchor,
  FileText,
  Shield,
  Users,
  Building2,
  MapPin,
  Settings,
  LogOut,
  UserPlus,
  Activity,
  Calendar,
  BarChart3,
  Bell,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export function RoleBasedSidebar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (basePath: string) => location.pathname.startsWith(basePath);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const userRole = profile?.rol || 'buzo';
  const isAdmin = userRole === 'superuser' || userRole === 'admin_salmonera' || userRole === 'admin_servicio';
  const isSupervisor = userRole === 'supervisor';
  const isBuzo = userRole === 'buzo';

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
      roles: ['superuser', 'admin_salmonera', 'admin_servicio', 'supervisor', 'buzo']
    },
    {
      title: "Inmersiones",
      icon: Anchor,
      href: "/inmersiones",
      roles: ['superuser', 'admin_salmonera', 'admin_servicio', 'supervisor', 'buzo']
    },
    {
      title: "Operaciones",
      icon: Building2,
      submenu: [
        { title: "Lista de Operaciones", href: "/operaciones", icon: Building2 },
        { title: "Crear Operación", href: "/operaciones/crear", icon: UserPlus },
      ],
      roles: ['superuser', 'admin_salmonera', 'admin_servicio', 'supervisor']
    },
    {
      title: "Formularios",
      icon: FileText,
      submenu: [
        { title: "Hojas de Planificación (HPT)", href: "/formularios/hpt", icon: FileText },
        { title: "Anexos Bravo", href: "/formularios/anexo-bravo", icon: Shield },
      ],
      roles: ['superuser', 'admin_salmonera', 'admin_servicio', 'supervisor', 'buzo']
    },
    {
      title: "Bitácoras",
      icon: Activity,
      submenu: [
        { title: "Bitácora de Buzo", href: "/bitacoras/buzo", icon: Users },
        { title: "Bitácora de Supervisor", href: "/bitacoras/supervisor", icon: Shield },
      ],
      roles: ['superuser', 'admin_salmonera', 'admin_servicio', 'supervisor', 'buzo']
    },
    {
      title: "Gestión",
      icon: Settings,
      submenu: [
        { title: "Equipos de Buceo", href: "/equipos-de-buceo", icon: Users },
        { title: "Personal Disponible", href: "/pool-personal", icon: UserPlus },
        { title: "Salmoneras", href: "/salmoneras", icon: Building2 },
        { title: "Contratistas", href: "/contratistas", icon: Building2 },
        { title: "Sitios", href: "/sitios", icon: MapPin },
      ],
      roles: ['superuser']
    },
    {
      title: "Reportes",
      icon: BarChart3,
      href: "/reportes",
      roles: ['superuser', 'admin_salmonera', 'admin_servicio', 'supervisor']
    },
    {
      title: "Notificaciones",
      icon: Bell,
      href: "/notificaciones",
      roles: ['superuser', 'admin_salmonera', 'admin_servicio', 'supervisor', 'buzo']
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderMenuItem = (item: any, isSubmenu = false) => {
    const Icon = item.icon;
    const hasSubmenu = item.submenu && !isSubmenu;
    const isExpanded = expandedSections.includes(item.title);
    
    if (hasSubmenu) {
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            onClick={() => toggleSection(item.title)}
            className={`w-full justify-between ${isParentActive(item.submenu[0]?.href?.split('/').slice(0, 2).join('/') || '') ? 'bg-blue-100 text-blue-700' : ''}`}
          >
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              <span>{item.title}</span>
            </div>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </SidebarMenuButton>
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {item.submenu.map((subItem: any) => renderMenuItem(subItem, true))}
            </div>
          )}
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={item.href}>
        <SidebarMenuButton
          onClick={() => navigate(item.href)}
          className={`w-full ${isActive(item.href) ? 'bg-blue-100 text-blue-700' : ''} ${isSubmenu ? 'text-sm py-1' : ''}`}
        >
          <div className="flex items-center gap-2">
            <Icon className={`${isSubmenu ? 'w-3 h-3' : 'w-4 h-4'}`} />
            <span>{item.title}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
            <Anchor className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">AquaOps</h2>
            <p className="text-xs text-gray-500">Sistema de Buceo</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {filteredMenuItems.map(item => renderMenuItem(item))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={profile?.email} />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
              {profile?.nombre?.charAt(0)}{profile?.apellido?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile?.nombre} {profile?.apellido}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {userRole === 'superuser' ? 'Super Usuario' :
                 userRole === 'admin_salmonera' ? 'Admin Salmonera' :
                 userRole === 'admin_servicio' ? 'Admin Servicio' :
                 userRole === 'supervisor' ? 'Supervisor' : 'Buzo'}
              </Badge>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
