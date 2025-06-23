
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Users, 
  Building2, 
  Waves, 
  ClipboardList, 
  FileText, 
  Settings, 
  BarChart3,
  Network,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useContextualOperations } from '@/hooks/useContextualOperations';
import { Button } from '@/components/ui/button';

interface NavigationItem {
  id: string;
  title: string;
  icon: any;
  path: string;
  roles: string[];
  moduleRequired?: string;
  badge?: string;
}

export const ModularSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { profile } = useAuth();
  const { 
    canAccessNetworkMaintenance,
    canPlanOperations,
    canAccessAdvancedReports,
    operationalContext
  } = useContextualOperations();

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: Home,
      path: '/',
      roles: ['superuser', 'salmonera', 'contratista', 'supervisor', 'buzo']
    },
    {
      id: 'operaciones',
      title: 'Operaciones',
      icon: ClipboardList,
      path: '/operaciones',
      roles: ['superuser', 'salmonera', 'contratista'],
      moduleRequired: 'planning_operations',
      badge: canPlanOperations ? 'PRO' : undefined
    },
    {
      id: 'inmersiones',
      title: 'Inmersiones',
      icon: Waves,
      path: '/inmersiones',
      roles: ['superuser', 'salmonera', 'contratista', 'supervisor']
    },
    {
      id: 'maintenance-networks',
      title: 'Mantención Redes',
      icon: Network,
      path: '/operaciones/mantencion-redes',
      roles: ['superuser', 'salmonera', 'contratista', 'supervisor'],
      moduleRequired: 'maintenance_networks',
      badge: canAccessNetworkMaintenance ? 'MOD' : undefined
    },
    {
      id: 'bitacoras',
      title: 'Bitácoras',
      icon: FileText,
      path: '/bitacoras',
      roles: ['superuser', 'salmonera', 'contratista', 'supervisor', 'buzo']
    },
    {
      id: 'personal',
      title: 'Personal',
      icon: Users,
      path: '/personal',
      roles: ['superuser', 'salmonera', 'contratista']
    },
    {
      id: 'empresas',
      title: 'Empresas',
      icon: Building2,
      path: '/empresas',
      roles: ['superuser']
    },
    {
      id: 'reportes',
      title: 'Reportes',
      icon: BarChart3,
      path: '/reportes',
      roles: ['superuser', 'salmonera', 'contratista'],
      badge: canAccessAdvancedReports ? 'ADV' : undefined
    },
    {
      id: 'configuracion',
      title: 'Configuración',
      icon: Settings,
      path: '/configuracion',
      roles: ['superuser', 'salmonera', 'contratista']
    }
  ];

  const hasAccess = (item: NavigationItem): boolean => {
    if (!profile?.rol) return false;
    
    // Check role access
    if (!item.roles.includes(profile.rol)) return false;
    
    // Check module access
    if (item.moduleRequired) {
      switch (item.moduleRequired) {
        case 'planning_operations':
          return canPlanOperations;
        case 'maintenance_networks':
          return canAccessNetworkMaintenance;
        case 'advanced_reports':
          return canAccessAdvancedReports;
        default:
          return false;
      }
    }
    
    return true;
  };

  const filteredNavigation = navigationItems.filter(hasAccess);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getContextualInfo = () => {
    if (!operationalContext) return null;
    
    const contextInfo = {
      'planned': { label: 'Planificado', color: 'bg-blue-500' },
      'direct': { label: 'Directo', color: 'bg-green-500' },
      'mixed': { label: 'Mixto', color: 'bg-purple-500' }
    };
    
    return contextInfo[operationalContext.context_type] || null;
  };

  const contextInfo = getContextualInfo();

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-50 h-full transition-all duration-300 ease-in-out ios-sidebar",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg ios-icon">
              <Waves className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg">Breus</h1>
              <p className="text-xs text-gray-500">Sistema Acuicultura</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0 ios-nav-button rounded-lg"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-700" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-700" />
          )}
        </Button>
      </div>

      {/* Context Indicator */}
      {!isCollapsed && contextInfo && (
        <div className="px-4 py-2 mb-2">
          <div className="flex items-center gap-2 text-xs bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className={cn("w-2 h-2 rounded-full", contextInfo.color)} />
            <span className="text-gray-700 font-medium">Contexto: {contextInfo.label}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                "relative group overflow-hidden ios-nav-button",
                active 
                  ? "ios-nav-button-active" 
                  : "hover:bg-white/10",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110",
                active ? "text-blue-700" : "text-gray-600"
              )} />
              
              {!isCollapsed && (
                <>
                  <span className={cn(
                    "font-medium flex-1 truncate transition-colors",
                    active ? "text-blue-700" : "text-gray-700"
                  )}>
                    {item.title}
                  </span>
                  
                  {item.badge && (
                    <span className={cn(
                      "px-2 py-1 text-xs font-semibold rounded-lg backdrop-blur-sm",
                      active 
                        ? "bg-blue-100/80 text-blue-700" 
                        : "bg-white/20 text-gray-600"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      {!isCollapsed && profile && (
        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center ios-avatar">
              <span className="text-white text-sm font-semibold">
                {profile.nombres?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile.nombres} {profile.apellidos}
              </p>
              <p className="text-xs text-gray-600 capitalize truncate">
                {profile.rol}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
