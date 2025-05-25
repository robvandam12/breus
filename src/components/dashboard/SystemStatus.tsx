
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, Database, Shield, Zap, Server } from "lucide-react";

export const SystemStatus = () => {
  const systemComponents = [
    {
      name: "Conectividad",
      status: "online",
      icon: Wifi,
      lastCheck: "Hace 1 min",
      uptime: "99.9%"
    },
    {
      name: "Base de Datos",
      status: "online",
      icon: Database,
      lastCheck: "Hace 30 seg",
      uptime: "99.8%"
    },
    {
      name: "Seguridad",
      status: "online",
      icon: Shield,
      lastCheck: "Hace 2 min",
      uptime: "100%"
    },
    {
      name: "Rendimiento",
      status: "warning",
      icon: Zap,
      lastCheck: "Hace 5 min",
      uptime: "98.5%"
    },
    {
      name: "Servicios",
      status: "online",
      icon: Server,
      lastCheck: "Hace 1 min",
      uptime: "99.7%"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'warning':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      case 'offline':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'En Línea';
      case 'warning':
        return 'Advertencia';
      case 'offline':
        return 'Fuera de Línea';
      default:
        return 'Desconocido';
    }
  };

  const overallStatus = systemComponents.every(comp => comp.status === 'online') ? 'online' : 
                      systemComponents.some(comp => comp.status === 'offline') ? 'offline' : 'warning';

  return (
    <Card className="ios-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Estado del Sistema</CardTitle>
          <Badge variant="outline" className={`text-xs ${getStatusColor(overallStatus)}`}>
            {getStatusText(overallStatus)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {systemComponents.map((component, index) => {
            const Icon = component.icon;
            return (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    component.status === 'online' ? 'bg-green-100 dark:bg-green-900/20' :
                    component.status === 'warning' ? 'bg-amber-100 dark:bg-amber-900/20' :
                    'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      component.status === 'online' ? 'text-green-600 dark:text-green-400' :
                      component.status === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                      'text-red-600 dark:text-red-400'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                      {component.name}
                    </h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-500">
                      {component.lastCheck}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline" 
                    className={`text-xs mb-1 ${getStatusColor(component.status)}`}
                  >
                    {getStatusText(component.status)}
                  </Badge>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    Uptime: {component.uptime}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
