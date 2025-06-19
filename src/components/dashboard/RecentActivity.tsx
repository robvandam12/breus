
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Anchor, AlertTriangle } from "lucide-react";
import { useBitacorasSupervisor } from "@/hooks/useBitacorasSupervisor";
import { useBitacorasBuzo } from "@/hooks/useBitacorasBuzo";

export const RecentActivity = () => {
  const { bitacorasSupervisor } = useBitacorasSupervisor();
  const { bitacorasBuzo } = useBitacorasBuzo();

  // Combine recent activities from bitácoras
  const recentActivities = [
    ...bitacorasSupervisor.slice(0, 2).map(bitacora => ({
      id: bitacora.bitacora_id,
      type: "bitacora_supervisor",
      title: "Bitácora de Supervisor creada",
      description: `${bitacora.supervisor} - ${bitacora.codigo}`,
      time: "Hace 2 horas",
      status: bitacora.firmado ? "completed" : "pending"
    })),
    ...bitacorasBuzo.slice(0, 2).map(bitacora => ({
      id: bitacora.bitacora_id,
      type: "bitacora_buzo",
      title: "Bitácora de Buzo creada",
      description: `${bitacora.buzo} - ${bitacora.codigo}`,
      time: "Hace 4 horas",
      status: bitacora.firmado ? "completed" : "pending"
    })),
    {
      id: "alert1",
      type: "alert",
      title: "Certificación próxima a vencer",
      description: "Carlos Silva - Matrícula vence en 15 días",
      time: "Hace 6 horas",
      status: "warning"
    }
  ].slice(0, 5);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "bitacora_supervisor":
      case "bitacora_buzo":
        return <FileText className="w-4 h-4" />;
      case "inmersion":
        return <Anchor className="w-4 h-4" />;
      case "alert":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">{activity.time}</span>
                  <Badge variant="secondary" className={getStatusColor(activity.status)}>
                    {activity.status === "completed" ? "Completado" : 
                     activity.status === "pending" ? "Pendiente" : "Advertencia"}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
