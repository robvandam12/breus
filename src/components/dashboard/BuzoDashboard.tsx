
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Anchor, Clock, FileText, Building, Calendar, Activity, Users, AlertTriangle, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const BuzoDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  // Mock data - en la implementación real vendría de hooks/API
  const isAssigned = profile?.salmonera_id || profile?.servicio_id;
  const isProfileComplete = true; // profile?.perfil_completado
  const hasProfilePhoto = false; // profile?.perfil_buzo?.foto

  const stats = {
    inmersionesMes: 8,
    horasBuceo: 67,
    bitacorasCreadas: 12,
    profundidadMaxima: 42
  };

  const proximasInmersiones = [
    {
      id: '1',
      sitio: 'Centro de Cultivo Norte',
      fecha: '2024-12-15',
      hora: '08:00',
      tipo: 'Mantenimiento de redes',
      rol: 'Buzo Principal',
      supervisor: 'Carlos Mendoza'
    },
    {
      id: '2',
      sitio: 'Centro de Cultivo Sur',
      fecha: '2024-12-17',
      hora: '09:30',
      tipo: 'Inspección estructural',
      rol: 'Buzo Asistente',
      supervisor: 'Ana Rodriguez'
    }
  ];

  const bitacorasPendientes = [
    {
      id: '1',
      codigo: 'BIT-2024-001',
      fecha: '2024-12-10',
      sitio: 'Centro Norte',
      supervisor: 'Carlos Mendoza'
    }
  ];

  const empresaInfo = {
    nombre: isAssigned ? 'Servicios Submarinos Ltda.' : 'Sin asignar',
    tipo: profile?.salmonera_id ? 'Salmonera' : profile?.servicio_id ? 'Contratista' : 'No asignado',
    fechaAsignacion: '2024-01-15'
  };

  if (!isAssigned) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Perfil incompleto:</strong> Para acceder a todas las funcionalidades, 
            completa tu perfil y espera ser asignado a una empresa.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Tu Perfil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm">
                  <strong>Estado:</strong> 
                  <Badge variant={isProfileComplete ? "default" : "outline"} className="ml-2">
                    {isProfileComplete ? 'Completo' : 'Incompleto'}
                  </Badge>
                </p>
                <p className="text-sm">
                  <strong>Empresa:</strong> Sin asignar
                </p>
                <Button 
                  onClick={() => navigate('/profile-setup')}
                  className="w-full"
                  variant={isProfileComplete ? "outline" : "default"}
                >
                  {isProfileComplete ? 'Editar Perfil' : 'Completar Perfil'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-purple-600" />
                Estado de Asignación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-4">
                  Pendiente de asignación a empresa. Un administrador debe asignarte 
                  a una salmonera o empresa de servicios.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Anchor className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Inmersiones Mes</p>
                <p className="text-2xl font-bold">{stats.inmersionesMes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Horas de Buceo</p>
                <p className="text-2xl font-bold">{stats.horasBuceo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Bitácoras Creadas</p>
                <p className="text-2xl font-bold">{stats.bitacorasCreadas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Profundidad Máx</p>
                <p className="text-2xl font-bold">{stats.profundidadMaxima}m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información de empresa y bitácoras pendientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Mi Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Empresa</p>
                <p className="font-semibold">{empresaInfo.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo</p>
                <Badge variant="outline">{empresaInfo.tipo}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de asignación</p>
                <p className="text-sm">{empresaInfo.fechaAsignacion}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Bitácoras Pendientes
              {bitacorasPendientes.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {bitacorasPendientes.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bitacorasPendientes.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No tienes bitácoras pendientes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bitacorasPendientes.map((bitacora) => (
                  <div key={bitacora.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm">{bitacora.codigo}</p>
                        <p className="text-xs text-gray-600">{bitacora.sitio}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {bitacora.fecha}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Supervisor: {bitacora.supervisor}
                    </p>
                    <Button size="sm" className="w-full">
                      Crear Bitácora
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Próximas inmersiones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Próximas Inmersiones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {proximasInmersiones.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tienes inmersiones programadas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {proximasInmersiones.map((inmersion) => (
                <div key={inmersion.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{inmersion.tipo}</p>
                      <p className="text-sm text-gray-600">{inmersion.sitio}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{inmersion.fecha}</p>
                      <p className="text-sm text-gray-600">{inmersion.hora}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <Badge variant="outline" className="text-xs">
                      {inmersion.rol}
                    </Badge>
                    <span>Supervisor: {inmersion.supervisor}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
