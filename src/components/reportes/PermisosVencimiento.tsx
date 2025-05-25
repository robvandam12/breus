
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, CheckCircle } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";

interface PermisoData {
  permisos_proximos_vencer: Array<{
    tipo: string;
    documento: string;
    fecha_vencimiento: string;
    dias_restantes: number;
    responsable: string;
  }>;
}

interface PermisosVencimientoProps {
  data?: PermisoData;
}

export const PermisosVencimiento = ({ data }: PermisosVencimientoProps) => {
  if (!data || !data.permisos_proximos_vencer.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Permisos y Vencimientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <div className="text-lg font-medium text-green-700">
              ¡Todos los permisos están vigentes!
            </div>
            <div className="text-sm text-zinc-500">
              No hay permisos próximos a vencer en los próximos 30 días
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeverityBadge = (diasRestantes: number) => {
    if (diasRestantes <= 7) {
      return { 
        className: "bg-red-100 text-red-700", 
        label: "Crítico", 
        icon: AlertTriangle 
      };
    } else if (diasRestantes <= 15) {
      return { 
        className: "bg-amber-100 text-amber-700", 
        label: "Urgente", 
        icon: AlertTriangle 
      };
    } else {
      return { 
        className: "bg-blue-100 text-blue-700", 
        label: "Próximo", 
        icon: Calendar 
      };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM, yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  // Agrupar por criticidad
  const criticos = data.permisos_proximos_vencer.filter(p => p.dias_restantes <= 7);
  const urgentes = data.permisos_proximos_vencer.filter(p => p.dias_restantes > 7 && p.dias_restantes <= 15);
  const proximos = data.permisos_proximos_vencer.filter(p => p.dias_restantes > 15);

  return (
    <div className="space-y-6">
      {/* Resumen de Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{criticos.length}</div>
            <div className="text-sm text-red-600">Críticos (≤7 días)</div>
          </CardContent>
        </Card>
        <Card className="border-amber-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{urgentes.length}</div>
            <div className="text-sm text-amber-600">Urgentes (8-15 días)</div>
          </CardContent>
        </Card>
        <Card className="border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{proximos.length}</div>
            <div className="text-sm text-blue-600">Próximos (16-30 días)</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Permisos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Permisos Próximos a Vencer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.permisos_proximos_vencer
              .sort((a, b) => a.dias_restantes - b.dias_restantes)
              .map((permiso, index) => {
                const severity = getSeverityBadge(permiso.dias_restantes);
                const IconComponent = severity.icon;
                
                return (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        permiso.dias_restantes <= 7 ? 'bg-red-100' :
                        permiso.dias_restantes <= 15 ? 'bg-amber-100' : 'bg-blue-100'
                      }`}>
                        <IconComponent className={`w-5 h-5 ${
                          permiso.dias_restantes <= 7 ? 'text-red-600' :
                          permiso.dias_restantes <= 15 ? 'text-amber-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <div className="font-medium">{permiso.documento}</div>
                        <div className="text-sm text-zinc-500">
                          {permiso.tipo} • Responsable: {permiso.responsable}
                        </div>
                        <div className="text-sm text-zinc-600">
                          Vence: {formatDate(permiso.fecha_vencimiento)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className={severity.className}>
                        {severity.label}
                      </Badge>
                      <div className="text-sm text-zinc-500 mt-1">
                        {permiso.dias_restantes === 0 ? 'Vence hoy' :
                         permiso.dias_restantes === 1 ? 'Vence mañana' :
                         `${permiso.dias_restantes} días`}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Tabla Detallada */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Vencimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Documento</th>
                  <th className="text-left py-2">Tipo</th>
                  <th className="text-left py-2">Responsable</th>
                  <th className="text-center py-2">Fecha Vencimiento</th>
                  <th className="text-center py-2">Días Restantes</th>
                  <th className="text-center py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {data.permisos_proximos_vencer
                  .sort((a, b) => a.dias_restantes - b.dias_restantes)
                  .map((permiso, index) => {
                    const severity = getSeverityBadge(permiso.dias_restantes);
                    return (
                      <tr key={index} className="border-b">
                        <td className="py-2 font-medium">{permiso.documento}</td>
                        <td className="py-2">{permiso.tipo}</td>
                        <td className="py-2">{permiso.responsable}</td>
                        <td className="py-2 text-center">{formatDate(permiso.fecha_vencimiento)}</td>
                        <td className="py-2 text-center">{permiso.dias_restantes}</td>
                        <td className="py-2 text-center">
                          <Badge variant="secondary" className={severity.className}>
                            {severity.label}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
