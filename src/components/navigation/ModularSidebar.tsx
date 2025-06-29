
import React from 'react';
import { Home, Anchor, FileText, HardHat, Users, Settings, Building2, MapPin, Bell, BarChart3, Shield, Wrench } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdaptiveNavigationItem } from './AdaptiveNavigationItem';

export const ModularSidebar = () => {
  const { profile } = useAuth();
  const location = useLocation();

  if (!profile) return null;

  const getNavigationItems = () => {
    const baseItems = [
      {
        path: "/dashboard",
        icon: Home,
        title: "Dashboard",
        roles: ['superuser', 'admin_salmonera', 'admin_servicio', 'supervisor', 'buzo']
      }
    ];

    // Items específicos por rol
    const roleSpecificItems = {
      superuser: [
        { path: "/operaciones", icon: Anchor, title: "Operaciones" },
        { path: "/inmersiones", icon: Anchor, title: "Inmersiones" },
        { path: "/bitacoras", icon: FileText, title: "Bitácoras" },
        { path: "/anexo-bravo", icon: HardHat, title: "Anexo Bravo" },
        { path: "/hpt", icon: Shield, title: "HPT" },
        { path: "/cuadrillas-de-buceo", icon: Users, title: "Cuadrillas de Buceo" },
        { path: "/empresas/salmoneras", icon: Building2, title: "Salmoneras" },
        { path: "/empresas/contratistas", icon: Building2, title: "Contratistas" },
        { path: "/empresas/centros", icon: MapPin, title: "Centros" },
        { path: "/personal", icon: Users, title: "Personal" },
        { path: "/admin", icon: Settings, title: "Administración" },
        { path: "/reportes", icon: BarChart3, title: "Reportes" },
        { path: "/alertas", icon: Bell, title: "Alertas de Seguridad" }
      ],
      admin_salmonera: [
        { path: "/operaciones", icon: Anchor, title: "Operaciones" },
        { path: "/inmersiones", icon: Anchor, title: "Inmersiones" },
        { path: "/bitacoras", icon: FileText, title: "Bitácoras" },
        { path: "/anexo-bravo", icon: HardHat, title: "Anexo Bravo" },
        { path: "/hpt", icon: Shield, title: "HPT" },
        { path: "/cuadrillas-de-buceo", icon: Users, title: "Cuadrillas de Buceo" },
        { path: "/empresas/contratistas", icon: Building2, title: "Contratistas" },
        { path: "/empresas/centros", icon: MapPin, title: "Centros" },
        { path: "/personal", icon: Users, title: "Personal" },
        { path: "/reportes", icon: BarChart3, title: "Reportes" },
        { path: "/alertas", icon: Bell, title: "Alertas de Seguridad" }
      ],
      admin_servicio: [
        { path: "/operaciones", icon: Anchor, title: "Operaciones" },
        { path: "/inmersiones", icon: Anchor, title: "Inmersiones" },
        { path: "/bitacoras", icon: FileText, title: "Bitácoras" },
        { path: "/anexo-bravo", icon: HardHat, title: "Anexo Bravo" },
        { path: "/hpt", icon: Shield, title: "HPT" },
        { path: "/cuadrillas-de-buceo", icon: Users, title: "Cuadrillas de Buceo" },
        { path: "/personal", icon: Users, title: "Personal" },
        { path: "/reportes", icon: BarChart3, title: "Reportes" }
      ],
      supervisor: [
        { path: "/operaciones", icon: Anchor, title: "Operaciones" },
        { path: "/inmersiones", icon: Anchor, title: "Inmersiones" },
        { path: "/bitacoras", icon: FileText, title: "Bitácoras" },
        { path: "/anexo-bravo", icon: HardHat, title: "Anexo Bravo" },
        { path: "/hpt", icon: Shield, title: "HPT" },
        { path: "/reportes", icon: BarChart3, title: "Reportes" }
      ],
      buzo: [
        { path: "/inmersiones", icon: Anchor, title: "Mis Inmersiones" },
        { path: "/bitacoras/buzo", icon: FileText, title: "Mis Bitácoras" }
      ]
    };

    const items = [...baseItems];
    
    // Añadir items específicos del rol
    const userRoleItems = roleSpecificItems[profile.role as keyof typeof roleSpecificItems] || [];
    items.push(...userRoleItems.map(item => ({
      ...item,
      roles: [profile.role]
    })));

    // Item de configuración para todos
    items.push({
      path: "/configuracion",
      icon: Settings,
      title: "Configuración",
      roles: ['superuser', 'admin_salmonera', 'admin_servicio', 'supervisor', 'buzo']
    });

    return items;
  };

  const navigationItems = getNavigationItems();

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  return (
    <nav className="space-y-1 p-4">
      {navigationItems.map((item) => (
        <AdaptiveNavigationItem
          key={item.path}
          path={item.path}
          icon={item.icon}
          title={item.title}
          isActive={location.pathname === item.path}
          onClick={() => handleNavigation(item.path)}
        />
      ))}
    </nav>
  );
};
