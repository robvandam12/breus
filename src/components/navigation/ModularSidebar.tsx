
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  Book,
  Folder,
  Anchor,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  Users,
  Building,
  Network,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useModularSystem } from "@/hooks/useModularSystem";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { toast } from "@/hooks/use-toast";

const BreusLogo = ({ size = 32 }: { size?: number }) => (
  <svg 
    version="1.2" 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 500 305" 
    width={size} 
    height={(size * 305) / 500}
    className="fill-white"
  >
    <path d="m355.2 201.7c-33.7 40.1-84.1 67.3-135.9 73.1-4.5 0.6-8.4 4.5-7.7 9.7 0.6 4.5 4.5 7.8 8.4 7.8h0.6c55.7-5.9 111.3-35 147.5-79 3.2-3.8 2.6-9-1.3-12.2-2.6-3.3-8.4-3.3-11.6 0.6z"/>
    <path d="m276.3 68.5h-0.7l-64-45.3c-2-1.3-4.5-1.9-6.5-1.3-1.9 0.7-4.5 2-5.2 3.9l-19.4 29.7c-77.6 8.5-146.1 62.1-170.1 114.5 0 0.7 0 1.3-0.6 2 0 0.6 0 1.3 0 1.3 0 0.6 0 1.2 0 1.2 0 0.7 0 1.3 0.6 2 16.2 35.6 60.8 80.2 116.5 102.2l9.7-15.6 69.8-103.4c2.6-3.9 1.3-9.7-2.6-12.3-3.9-2.6-9.7-1.3-12.3 2.6l-68.5 103.4-3.3 3.9c-43.9-20-76.3-53-91.1-84 23.9-48.6 88.6-97.1 161.6-101.6l20.1-29.1 18.1 12.9 33 25.3c40.7 14.2 73.7 40.1 93.8 64.6 3.2 3.9 8.4 4.6 12.2 1.3 3.9-3.2 4.6-8.4 1.3-12.3-20.7-25.2-53-51-92.4-65.9z"/>
    <path d="m486.4 84.6c-3.2-3.2-9-3.2-12.2 0l-82.8 82.8c-2 2-2.6 3.9-2.6 5.9 0 2.5 0.6 4.5 2.6 6.4l82.8 82.8c1.9 1.9 3.8 2.6 6.4 2.6 2.6 0 4.6-0.7 6.5-2.6 3.2-3.2 3.2-9.1 0-12.3l-77.6-76.9 76.9-76.4c3.3-3.2 3.3-9 0-12.3z"/>
    <path fillRule="evenodd" d="m112.6 162.3c-8.9 0-16.1-7.3-16.1-16.2 0-9 7.2-16.2 16.1-16.2 9 0 16.2 7.2 16.2 16.2 0 8.9-7.2 16.2-16.2 16.2z"/>
    <path d="m218.1 202.4l28.4-42.7c2.6-3.9 1.3-9.7-2.6-12.3-3.9-2.6-9.7-1.3-12.3 2.6l-0.6 0.6-26.5 41.4-12.3 18.8c-2.6 3.8-1.3 9.7 2.6 12.3 3.8 2.5 9.7 1.2 12.3-2.6l11-18.1c0-0.7 0 0 0 0z"/>
  </svg>
);

interface MenuItem {
  title: string;
  icon: React.ElementType;
  url: string;
  badge?: string;
  module?: string;
}

export const ModularSidebar = () => {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const { hasModuleAccess, modules } = useModularSystem();
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();

  const getUserRole = () => {
    return profile?.role || 'buzo';
  };

  const isAssigned = Boolean(profile?.salmonera_id || profile?.servicio_id);

  const getMenuItems = (): MenuItem[] => {
    const role = getUserRole();
    const baseItems: MenuItem[] = [
      {
        title: "Dashboard",
        icon: BarChart3,
        url: "/",
      }
    ];

    // Si el usuario no está asignado a una empresa, solo mostrar perfil
    if (role === 'buzo' && !isAssigned) {
      return [
        ...baseItems,
        {
          title: "Mi Perfil",
          icon: Users,
          url: "/profile-setup",
        }
      ];
    }

    // Items principales para usuarios asignados
    const mainItems: MenuItem[] = [
      ...baseItems,
      {
        title: "Equipo de Buceo",
        icon: Users,
        url: "/equipo-de-buceo"
      },
      {
        title: "Operaciones",
        icon: Calendar,
        url: "/operaciones",
        badge: "12"
      },
      {
        title: "Inmersiones",
        icon: Anchor,
        url: "/inmersiones",
        badge: "7"
      }
    ];

    // Formularios modulares
    const formItems: MenuItem[] = [];
    
    if (hasModuleAccess(modules.HPT)) {
      formItems.push({
        title: "HPT",
        icon: FileText,
        url: "/formularios/hpt",
        module: modules.HPT
      });
    }

    if (hasModuleAccess(modules.ANEXO_BRAVO)) {
      formItems.push({
        title: "Anexo Bravo",
        icon: FileText,
        url: "/formularios/anexo-bravo",
        module: modules.ANEXO_BRAVO
      });
    }

    if (hasModuleAccess(modules.MAINTENANCE_NETWORKS)) {
      formItems.push({
        title: "Mantención de Redes",
        icon: Network,
        url: "/operaciones/network-maintenance",
        module: modules.MAINTENANCE_NETWORKS
      });
    }

    // Bitácoras
    const bitacoraItems: MenuItem[] = [
      {
        title: "Bitácora Supervisor",
        icon: Book,
        url: "/bitacoras/supervisor"
      },
      {
        title: "Bitácora Buzo",
        icon: Book,
        url: "/bitacoras/buzo"
      }
    ];

    // Items adicionales según rol
    const additionalItems: MenuItem[] = [
      {
        title: "Reportes",
        icon: BarChart3,
        url: "/reportes"
      }
    ];

    // Items de empresa según rol
    const companyItems: MenuItem[] = [];
    
    if (role === 'admin_salmonera') {
      companyItems.push(
        {
          title: "Sitios",
          icon: Building,
          url: "/empresas/sitios"
        },
        {
          title: "Contratistas",
          icon: Building,
          url: "/empresas/contratistas"
        }
      );
    } else if (role === 'admin_servicio') {
      companyItems.push({
        title: "Mi Empresa",
        icon: Building,
        url: "/empresas/contratistas"
      });
    }

    // Items de admin para superuser
    const adminItems: MenuItem[] = [];
    if (role === 'superuser') {
      adminItems.push(
        {
          title: "Salmoneras",
          icon: Folder,
          url: "/empresas/salmoneras"
        },
        {
          title: "Usuarios",
          icon: Shield,
          url: "/admin/users"
        }
      );
    }

    return [
      ...mainItems,
      ...formItems,
      ...bitacoraItems,
      ...additionalItems,
      ...companyItems,
      ...adminItems,
      {
        title: "Configuración",
        icon: Settings,
        url: "/configuracion"
      }
    ];
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error",
        description: "Error al cerrar sesión.",
        variant: "destructive",
      });
    }
  };

  const getUserDisplayName = () => {
    if (profile) {
      return `${profile.nombre} ${profile.apellido}`.trim() || profile.email;
    }
    return 'Usuario';
  };

  const getRoleDisplayName = (role?: string) => {
    switch (role) {
      case 'superuser':
        return 'Super Usuario';
      case 'admin_salmonera':
        return 'Admin Salmonera';
      case 'admin_servicio':
        return 'Admin Servicio';
      case 'supervisor':
        return 'Supervisor';
      case 'buzo':
        return 'Buzo';
      default:
        return 'Usuario';
    }
  };

  const getCompanyName = () => {
    if (profile?.salmonera_id) {
      return salmoneras.find(salmonera => salmonera.id === profile?.salmonera_id)?.nombre;
    } else if (profile?.servicio_id) {
      return contratistas.find(contratista => contratista.id === profile?.servicio_id)?.nombre;
    }
    return null;
  };

  const menuItems = getMenuItems();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center ios-icon">
            <BreusLogo size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-white">Breus</h2>
            <p className="text-xs text-slate-300">Gestión de Buceo</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
        <div className="sidebar-group-label">Navegación Principal</div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.title}
                to={item.url}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="h-5 text-xs bg-slate-600 text-slate-200">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* User Info */}
      <div className="p-4 border-t border-slate-700/30">
        <div className="sidebar-user-info">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center ios-avatar">
              <span className="text-white font-medium text-sm">
                {getUserDisplayName().charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{getUserDisplayName()}</p>
              <p className="text-xs text-slate-300 truncate">{getRoleDisplayName(getUserRole())}</p>
              {getCompanyName() && (
                <p className="text-xs text-blue-400 truncate font-medium">{getCompanyName()}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
