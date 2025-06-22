
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useModularSystem } from '@/hooks/useModularSystem';
import {
  Calendar,
  FileText,
  Settings,
  Activity,
  BarChart3,
  Shield,
  Network,
  Plus,
  Anchor,
  Book,
  Building,
  Users,
  LogOut,
  ChevronDown,
  Wrench,
  Globe,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

export const ModularSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuth();
  
  // Obtener datos de módulos con manejo de errores mejorado
  const moduleSystem = useModularSystem();
  const { salmoneras = [] } = useSalmoneras();
  const { contratistas = [] } = useContratistas();
  
  const [operacionesOpen, setOperacionesOpen] = useState(true);
  const [documentosOpen, setDocumentosOpen] = useState(false);
  const [reportesOpen, setReportesOpen] = useState(false);
  const [empresasOpen, setEmpresasOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Verificar roles con fallbacks seguros
  const role = profile?.role || 'buzo';
  const isSuperuser = role === 'superuser';
  const isAdminSalmonera = role === 'admin_salmonera';
  const isAdminServicio = role === 'admin_servicio';
  const isSupervisor = role === 'supervisor';
  const isBuzo = role === 'buzo';
  const isAssigned = Boolean(profile?.salmonera_id || profile?.servicio_id);

  // Para superusers: acceso completo a todo
  // Para otros roles: verificar módulos específicos
  const canPlanOperations = isSuperuser || (moduleSystem.hasModuleAccess ? moduleSystem.hasModuleAccess(moduleSystem.modules?.PLANNING_OPERATIONS || 'planning_operations') : false);
  const canManageNetworks = isSuperuser || (moduleSystem.hasModuleAccess ? moduleSystem.hasModuleAccess(moduleSystem.modules?.MAINTENANCE_NETWORKS || 'maintenance_networks') : false);
  const canAccessReports = isSuperuser || (moduleSystem.hasModuleAccess ? moduleSystem.hasModuleAccess(moduleSystem.modules?.ADVANCED_REPORTING || 'advanced_reporting') : false);
  const canUseIntegrations = isSuperuser || (moduleSystem.hasModuleAccess ? moduleSystem.hasModuleAccess(moduleSystem.modules?.EXTERNAL_INTEGRATIONS || 'external_integrations') : false);

  const navigationItems = [
    // Dashboard - Siempre visible
    {
      title: 'Dashboard',
      icon: Activity,
      path: '/',
      show: true
    },

    // Operaciones
    {
      title: 'Operaciones',
      icon: Calendar,
      isCollapsible: true,
      isOpen: operacionesOpen,
      setOpen: setOperacionesOpen,
      show: !isBuzo || (isBuzo && isAssigned),
      children: [
        {
          title: 'Ver Operaciones',
          path: '/operaciones',
          icon: Calendar,
          show: true
        },
        {
          title: 'Planificar Operaciones',
          path: '/operaciones/planificar',
          icon: Plus,
          show: canPlanOperations && !isBuzo
        },
        {
          title: 'HPT',
          path: '/operaciones/hpt',
          icon: Shield,
          show: !isBuzo || isSupervisor
        },
        {
          title: 'Anexo Bravo',
          path: '/operaciones/anexo-bravo',
          icon: FileText,
          show: !isBuzo || isSupervisor
        },
        {
          title: 'Mantención de Redes',
          path: '/operaciones/network-maintenance',
          icon: Network,
          show: canManageNetworks
        }
      ]
    },

    // Inmersiones - Siempre visible para usuarios asignados
    {
      title: 'Inmersiones',
      icon: Anchor,
      path: '/inmersiones',
      show: !isBuzo || (isBuzo && isAssigned)
    },

    // Bitácoras
    {
      title: 'Bitácoras',
      icon: Book,
      isCollapsible: true,
      isOpen: documentosOpen,
      setOpen: setDocumentosOpen,
      show: !isBuzo || (isBuzo && isAssigned),
      children: [
        {
          title: 'Bitácoras Supervisor',
          path: '/bitacoras/supervisor',
          icon: Shield,
          show: isSupervisor || isAdminServicio || isSuperuser
        },
        {
          title: 'Bitácoras Buzo',
          path: '/bitacoras/buzo',
          icon: Users,
          show: true
        }
      ]
    },

    // Reportes
    {
      title: 'Reportes',
      icon: BarChart3,
      isCollapsible: true,
      isOpen: reportesOpen,
      setOpen: setReportesOpen,
      show: true,
      children: [
        {
          title: 'Reportes Básicos',
          path: '/reportes',
          icon: BarChart3,
          show: true
        },
        {
          title: 'Reportes Avanzados',
          path: '/reportes/avanzados',
          icon: Zap,
          show: canAccessReports
        }
      ]
    },

    // Empresas - Solo admins
    {
      title: 'Empresas',
      icon: Building,
      isCollapsible: true,
      isOpen: empresasOpen,
      setOpen: setEmpresasOpen,
      show: isAdminSalmonera || isAdminServicio || isSuperuser,
      children: [
        {
          title: 'Salmoneras',
          path: '/empresas/salmoneras',
          icon: Building,
          show: isSuperuser
        },
        {
          title: 'Sitios',
          path: '/empresas/sitios',
          icon: Building,
          show: isAdminSalmonera || isSuperuser
        },
        {
          title: 'Contratistas',
          path: '/empresas/contratistas',
          icon: Users,
          show: isAdminSalmonera || isAdminServicio || isSuperuser
        }
      ]
    },

    // Equipo de Buceo
    {
      title: 'Equipo de Buceo',
      icon: Wrench,
      path: '/equipo-de-buceo',
      show: isAdminSalmonera || isAdminServicio || isSupervisor || isSuperuser
    },

    // Integraciones
    {
      title: 'Integraciones',
      icon: Globe,
      path: '/integraciones',
      show: canUseIntegrations && (isSuperuser || isAdminSalmonera || isAdminServicio)
    },

    // Administración
    {
      title: 'Administración',
      icon: Shield,
      isCollapsible: true,
      isOpen: adminOpen,
      setOpen: setAdminOpen,
      show: isSuperuser || isAdminSalmonera || isAdminServicio,
      children: [
        {
          title: 'Gestión de Usuarios',
          path: '/admin/users',
          icon: Users,
          show: isSuperuser || isAdminSalmonera || isAdminServicio
        },
        {
          title: 'Roles y Permisos',
          path: '/admin/roles',
          icon: Shield,
          show: isSuperuser
        },
        {
          title: 'Gestión de Módulos',
          path: '/admin/modules',
          icon: Settings,
          show: isSuperuser
        },
        {
          title: 'Monitoreo del Sistema',
          path: '/admin/system-monitoring',
          icon: Activity,
          show: isSuperuser
        },
        {
          title: 'Configuración',
          path: '/configuracion',
          icon: Settings,
          show: isAdminSalmonera || isAdminServicio || isSuperuser
        }
      ]
    }
  ];

  const renderNavItem = (item: any) => {
    if (!item.show) return null;

    if (item.isCollapsible) {
      return (
        <Collapsible
          key={item.title}
          open={item.isOpen}
          onOpenChange={item.setOpen}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between h-12 px-4 mb-1",
                "hover:bg-blue-50 hover:text-blue-700 transition-colors",
                "text-gray-700 font-medium"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </div>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                item.isOpen && "transform rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {item.children?.map((child: any) => (
              renderNavItem(child)
            ))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        key={item.title}
        variant="ghost"
        className={cn(
          "w-full justify-start h-12 px-4 mb-1",
          "hover:bg-blue-50 hover:text-blue-700 transition-colors",
          "text-gray-700 font-medium",
          isActive(item.path) && "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
        )}
        onClick={() => navigate(item.path)}
      >
        <item.icon className="h-5 w-5 mr-3" />
        <span className="flex-1 text-left">{item.title}</span>
      </Button>
    );
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
      return `${profile.nombre || ''} ${profile.apellido || ''}`.trim() || profile.email || 'Usuario';
    }
    return 'Usuario';
  };

  const getRoleDisplayName = (role?: string) => {
    const roleLabels = {
      superuser: 'Super Usuario',
      admin_salmonera: 'Admin Salmonera',
      admin_servicio: 'Admin Servicio',
      supervisor: 'Supervisor',
      buzo: 'Buzo'
    };
    return roleLabels[role as keyof typeof roleLabels] || 'Usuario';
  };

  const getCompanyName = () => {
    if (profile?.salmonera_id) {
      const salmonera = salmoneras.find(s => s.id === profile.salmonera_id);
      return salmonera?.nombre || 'Empresa no encontrada';
    }
    if (profile?.servicio_id) {
      const contratista = contratistas.find(c => c.id === profile.servicio_id);
      return contratista?.nombre || 'Empresa no encontrada';
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-200">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <BreusLogo size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Breus</h2>
          <p className="text-sm text-gray-600">Sistema Modular</p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigationItems.map(renderNavItem)}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {getUserDisplayName().charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{getUserDisplayName()}</p>
            <p className="text-xs text-gray-500 truncate">{getRoleDisplayName(profile?.role)}</p>
            {getCompanyName() && (
              <p className="text-xs text-blue-600 truncate font-medium">{getCompanyName()}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}  
            className="h-8 w-8 p-0 hover:bg-gray-200"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
