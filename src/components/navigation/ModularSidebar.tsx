
import React from 'react';
import { Home, Anchor, FileText, HardHat, Users, Settings, Building2, MapPin, Bell, BarChart3, Shield, Wrench } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AdaptiveNavigationItem } from './AdaptiveNavigationItem';

export const ModularSidebar = () => {
  const { profile } = useAuth();

  if (!profile) return null;

  const getNavigationItems = () => {
    const baseItems = [
      {
        to: "/dashboard",
        icon: Home,
        label: "Dashboard",
        roles: ['superuser', 'admin_salmonera', 'admin_servicio', 'supervisor', 'buzo']
      }
    ];

    // Items específicos por rol
    const roleSpecificItems = {
      superuser: [
        { to: "/operaciones", icon: Anchor, label: "Operaciones" },
        { to: "/inmersiones", icon: Anchor, label: "Inmersiones" },
        { to: "/bitacoras", icon: FileText, label: "Bitácoras" },
        { to: "/anexo-bravo", icon: HardHat, label: "Anexo Bravo" },
        { to: "/hpt", icon: Shield, label: "HPT" },
        { to: "/cuadrillas-de-buceo", icon: Users, label: "Cuadrillas de Buceo" },
        { to: "/empresas/salmoneras", icon: Building2, label: "Salmoneras" },
        { to: "/empresas/contratistas", icon: Building2, label: "Contratistas" },
        { to: "/empresas/centros", icon: MapPin, label: "Centros" },
        { to: "/personal", icon: Users, label: "Personal" },
        { to: "/admin", icon: Settings, label: "Administración" },
        { to: "/reportes", icon: BarChart3, label: "Reportes" },
        { to: "/alertas", icon: Bell, label: "Alertas de Seguridad" }
      ],
      admin_salmonera: [
        { to: "/operaciones", icon: Anchor, label: "Operaciones" },
        { to: "/inmersiones", icon: Anchor, label: "Inmersiones" },
        { to: "/bitacoras", icon: FileText, label: "Bitácoras" },
        { to: "/anexo-bravo", icon: HardHat, label: "Anexo Bravo" },
        { to: "/hpt", icon: Shield, label: "HPT" },
        { to: "/cuadrillas-de-buceo", icon: Users, label: "Cuadrillas de Buceo" },
        { to: "/empresas/contratistas", icon: Building2, label: "Contratistas" },
        { to: "/empresas/centros", icon: MapPin, label: "Centros" },
        { to: "/personal", icon: Users, label: "Personal" },
        { to: "/reportes", icon: BarChart3, label: "Reportes" },
        { to: "/alertas", icon: Bell, label: "Alertas de Seguridad" }
      ],
      admin_servicio: [
        { to: "/operaciones", icon: Anchor, label: "Operaciones" },
        { to: "/inmersiones", icon: Anchor, label: "Inmersiones" },
        { to: "/bitacoras", icon: FileText, label: "Bitácoras" },
        { to: "/anexo-bravo", icon: HardHat, label: "Anexo Bravo" },
        { to: "/hpt", icon: Shield, label: "HPT" },
        { to: "/cuadrillas-de-buceo", icon: Users, label: "Cuadrillas de Buceo" },
        { to: "/personal", icon: Users, label: "Personal" },
        { to: "/reportes", icon: BarChart3, label: "Reportes" }
      ],
      supervisor: [
        { to: "/operaciones", icon: Anchor, label: "Operaciones" },
        { to: "/inmersiones", icon: Anchor, label: "Inmersiones" },
        { to: "/bitacoras", icon: FileText, label: "Bitácoras" },
        { to: "/anexo-bravo", icon: HardHat, label: "Anexo Bravo" },
        { to: "/hpt", icon: Shield, label: "HPT" },
        { to: "/reportes", icon: BarChart3, label: "Reportes" }
      ],
      buzo: [
        { to: "/inmersiones", icon: Anchor, label: "Mis Inmersiones" },
        { to: "/bitacoras/buzo", icon: FileText, label: "Mis Bitácoras" }
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
      to: "/configuracion",
      icon: Settings,
      label: "Configuración",
      roles: ['superuser', 'admin_salmonera', 'admin_servicio', 'supervisor', 'buzo']
    });

    return items;
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="space-y-1 p-4">
      {navigationItems.map((item) => (
        <AdaptiveNavigationItem
          key={item.to}
          to={item.to}
          icon={item.icon}
          label={item.label}
          allowedRoles={item.roles}
        />
      ))}
    </nav>
  );
};
