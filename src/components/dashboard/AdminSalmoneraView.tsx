
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Users, 
  MapPin, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  Anchor,
  Clock,
  Activity,
  CheckCircle,
  Timer,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AdminSalmoneraView = () => {
  const navigate = useNavigate();

  // Datos mock - en producción vendrían de la API
  const dashboardData = {
    buzosActivos: 24,
    hptCompletadosHoy: 3,
    anexoBravoCompletadosHoy: 2,
    operacionesActivas: 8,
    sitiosActivos: 5,
    tiempoPromedioInmersion: "45 min",
    estadoPuerto: "Operativo",
    alertas: 2
  };

  const operacionesRecientes = [
    { id: 1, nombre: "Inspección Red Sitio A", sitio: "Sitio A", estado: "activa", buzos: 3 },
    { id: 2, nombre: "Mantenimiento Anclas", sitio: "Sitio B", estado: "pausada", buzos: 2 },
    { id: 3, nombre: "Limpieza Estructuras", sitio: "Sitio C", estado: "completada", buzos: 4 }
  ];

  const distribucionBuzos = [
    { sitio: "Sitio A", buzos: 8, supervisores: 2 },
    { sitio: "Sitio B", buzos: 6, supervisores: 1 },
    { sitio: "Sitio C", buzos: 10, supervisores: 3 }
  ];

  return (
    <div className="space-y-6">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Buzos Activos</p>
                <p className="text-2xl font-bold">{dashboardData.buzosActivos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">HPT Completados Hoy</p>
                <p className="text-2xl font-bold">{dashboardData.hptCompletadosHoy}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Anexo Bravo Hoy</p>
                <p className="text-2xl font-bold">{dashboardData.anexoBravoCompletadosHoy}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Alertas</p>
                <p className="text-2xl font-bold text-red-600">{dashboardData.alertas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPIs Secundarios */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Operaciones Activas</p>
                <p className="text-xl font-semibold">{dashboardData.operacionesActivas}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sitios Activos</p>
                <p className="text-xl font-semibold">{dashboardData.sitiosActivos}</p>
              </div>
              <MapPin className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tiempo Prom. Inmersión</p>
                <p className="text-xl font-semibold">{dashboardData.tiempoPromedioInmersion}</p>
              </div>
              <Timer className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estado Puerto</p>
                <p className="text-xl font-semibold text-green-600">{dashboardData.estadoPuerto}</p>
              </div>
              <Anchor className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operaciones Recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Operaciones Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {operacionesRecientes.map((operacion) => (
                <div key={operacion.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{operacion.nombre}</p>
                    <p className="text-sm text-gray-600">{operacion.sitio}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={operacion.estado === 'activa' ? 'default' : operacion.estado === 'pausada' ? 'secondary' : 'outline'}>
                      {operacion.estado}
                    </Badge>
                    <span className="text-sm text-gray-500">{operacion.buzos} buzos</span>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/operaciones')}
            >
              Ver Todas las Operaciones
            </Button>
          </CardContent>
        </Card>

        {/* Distribución de Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Distribución de Personal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {distribucionBuzos.map((sitio, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{sitio.sitio}</p>
                    <p className="text-sm text-gray-600">
                      {sitio.buzos} buzos • {sitio.supervisores} supervisores
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{sitio.buzos + sitio.supervisores}</p>
                    <p className="text-xs text-gray-500">total</p>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/equipo-de-buceo')}
            >
              Ver Equipo Completo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            className="justify-start h-auto p-4" 
            variant="outline"
            onClick={() => navigate('/operaciones')}
          >
            <div className="text-left">
              <Calendar className="w-5 h-5 mb-2" />
              <p className="font-medium">Nueva Operación</p>
              <p className="text-xs text-gray-500">Crear operación</p>
            </div>
          </Button>
          
          <Button 
            className="justify-start h-auto p-4" 
            variant="outline"
            onClick={() => navigate('/formularios/hpt')}
          >
            <div className="text-left">
              <FileText className="w-5 h-5 mb-2" />
              <p className="font-medium">Nuevo HPT</p>
              <p className="text-xs text-gray-500">Crear HPT</p>
            </div>
          </Button>

          <Button 
            className="justify-start h-auto p-4" 
            variant="outline"
            onClick={() => navigate('/formularios/anexo-bravo')}
          >
            <div className="text-left">
              <CheckCircle className="w-5 h-5 mb-2" />
              <p className="font-medium">Anexo Bravo</p>
              <p className="text-xs text-gray-500">Crear anexo</p>
            </div>
          </Button>

          <Button 
            className="justify-start h-auto p-4" 
            variant="outline"
            onClick={() => navigate('/inmersiones')}
          >
            <div className="text-left">
              <Anchor className="w-5 h-5 mb-2" />
              <p className="font-medium">Nueva Inmersión</p>
              <p className="text-xs text-gray-500">Registrar inmersión</p>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
