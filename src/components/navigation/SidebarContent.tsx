
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useModularSystem } from '@/hooks/useModularSystem';
import {
  Calendar,
  FileText,
  Settings,
  Users,
  Activity,
  BarChart3,
  Shield,
  Network,
  Wrench,
  Globe,
  ChevronDown,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const SidebarContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const { hasModuleAccess, modules } = useModularSystem();
  
  const [operacionesOpen, setOperacionesOpen] = useState(true);
  const [documentosOpen, setDocumentosOpen] = useState(false);
  const [reportesOpen, setReportesOpen] = useState(false);

  // Verificar acceso a módulos
  const canPlanOperations = hasModuleAccess(modules.PLANNING_OPERATIONS);
  const canManageNetworks = hasModuleAccess(modules.MAINTENANCE_NETWORKS);
  const canAccessReports = hasModuleAccess(modules.ADVANCED_REPORTING);
  const canUseIntegrations = hasModuleAccess(modules.EXTERNAL_INTEGRATIONS);

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    {
      title: 'Dashboard',
      icon: Activity,
      path: '/dashboard',
      show: true
    },
    {
      title: 'Operaciones',
      icon: Calendar,
      isCollapsible: true,
      isOpen: operacionesOpen,
      setOpen: setOperacionesOpen,
      show: true,
      children: [
        {
          title: 'Planificar Operaciones',
          path: '/operaciones/planificar',
          icon: Plus,
          show: canPlanOperations && profile?.role !== 'buzo',
          badge: 'Opcional'
        },
        {
          title: 'Inmersiones',
          path: '/inmersiones',
          icon: Activity,
          show: true
        },
        {
          title: 'Mantención de Redes',
          path: '/operaciones/mantencion-redes',
          icon: Network,
          show: canManageNetworks,
          badge: 'Módulo'
        },
        {
          title: 'Faenas de Redes',
          path: '/operaciones/faenas-redes',
          icon: Wrench,
          show: canManageNetworks,
          badge: 'Módulo'
        }
      ]
    },
    {
      title: 'Documentos',
      icon: FileText,
      isCollapsible: true,
      isOpen: documentosOpen,
      setOpen: setDocumentosOpen,
      show: canPlanOperations && profile?.role !== 'buzo',
      children: [
        {
          title: 'HPT',
          path: '/hpt',
          icon: Shield,
          show: true
        },
        {
          title: 'Anexo Bravo',
          path: '/anexo-bravo',
          icon: FileText,
          show: true
        }
      ]
    },
    {
      title: 'Bitácoras',
      icon: FileText,
      path: '/bitacoras',
      show: true
    },
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
          title: 'Reportes Operativos',
          path: '/reportes/operativos',
          icon: Network,
          show: canAccessReports,
          badge: 'Avanzado'
        }
      ]
    },
    {
      title: 'Administración',
      icon: Settings,
      path: '/admin',
      show: profile?.role === 'superuser' || profile?.role === 'admin_salmonera' || profile?.role === 'admin_servicio'
    },
    {
      title: 'Integraciones',
      icon: Globe,
      path: '/integraciones',
      show: canUseIntegrations && (profile?.role === 'superuser' || profile?.role === 'admin_salmonera'),
      badge: 'API'
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
                "w-full justify-between h-12 px-4",
                "hover:bg-gray-100 transition-colors"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-gray-600" />
                <span className="font-medium">{item.title}</span>
              </div>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                item.isOpen && "transform rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 space-y-1">
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
          "w-full justify-start h-12 px-4",
          "hover:bg-gray-100 transition-colors",
          isActive(item.path) && "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
        )}
        onClick={() => navigate(item.path)}
      >
        <item.icon className="h-5 w-5 mr-3 text-gray-600" />
        <span className="flex-1 text-left">{item.title}</span>
        {item.badge && (
          <Badge variant="secondary" className="text-xs">
            {item.badge}
          </Badge>
        )}
      </Button>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Breus</h2>
        <p className="text-sm text-gray-600">Sistema de Buceo</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigationItems.map(renderNavItem)}
      </nav>

      {/* Module Status */}
      <div className="p-4 border-t bg-gray-50">
        <div className="text-xs text-gray-500 mb-2">Módulos Activos:</div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">Core</Badge>
          {canPlanOperations && <Badge variant="outline" className="text-xs">Planificación</Badge>}
          {canManageNetworks && <Badge variant="outline" className="text-xs">Redes</Badge>}
          {canAccessReports && <Badge variant="outline" className="text-xs">Reportes+</Badge>}
          {canUseIntegrations && <Badge variant="outline" className="text-xs">API</Badge>}
        </div>
      </div>
    </div>
  );
};
