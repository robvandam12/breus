
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Anchor, Building, User, AlertTriangle, FileText, Clock, CheckCircle2, Users } from 'lucide-react';
import { useBuzoNotifications } from '@/hooks/useBuzoNotifications';
import { useSalmoneras } from '@/hooks/useSalmoneras';
import { useContratistas } from '@/hooks/useContratistas';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useBitacoras } from '@/hooks/useBitacoras';
import { useOperaciones } from '@/hooks/useOperaciones';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const BuzoDashboard = () => {
  const { profile, user } = useAuth();
  const { notifications, unreadCount } = useBuzoNotifications();
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  const { inmersiones } = useInmersiones();
  const { bitacorasBuzo } = useBitacoras();
  const { operaciones } = useOperaciones();
  const [stats, setStats] = useState({
    totalOperaciones: 0,
    bitacorasPendientes: 0,
    bitacorasCompletadas: 0,
    inmersionesMes: 0
  });

  // Verificar si el perfil está completo
  const isProfileComplete = () => {
    const requiredFields = ['rut', 'telefono', 'direccion', 'ciudad', 'region', 'nacionalidad'];
    if (!profile?.perfil_buzo) return false;
    
    const perfilBuzo = profile.perfil_buzo as any;
    return requiredFields.every(field => perfilBuzo[field]?.toString().trim());
  };

  const profileComplete = isProfileComplete();
  const estadoBuzo = (profile as any)?.estado_buzo || 'inactivo';

  // Obtener nombre de las empresas
  const getSalmoneraName = () => {
    if (profile?.salmonera_id) {
      const salmonera = salmoneras.find(s => s.id === profile.salmonera_id);
      return salmonera?.nombre || 'Salmonera no encontrada';
    }
    return null;
  };

  const getContratistaName = () => {
    if (profile?.servicio_id) {
      const contratista = contratistas.find(c => c.id === profile.servicio_id);
      return contratista?.nombre || 'Contratista no encontrado';
    }
    return null;
  };

  // Calcular estadísticas específicas del buzo
  useEffect(() => {
    // Filtrar operaciones donde el buzo está asignado
    const buzoBitacoras = bitacorasBuzo.filter(b => b.buzo === `${profile?.nombre} ${profile?.apellido}`);
    const buzoInmersiones = inmersiones.filter(i => 
      i.buzo_principal === `${profile?.nombre} ${profile?.apellido}` ||
      i.buzo_asistente === `${profile?.nombre} ${profile?.apellido}`
    );
    
    // Operaciones donde participa el buzo
    const buzoOperaciones = operaciones.filter(op => {
      // Verificar si hay inmersiones del buzo en esta operación
      return buzoInmersiones.some(inm => inm.operacion_id === op.id);
    });

    // Inmersiones del mes actual
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const inmersionesMes = buzoInmersiones.filter(inm => {
      const inmDate = new Date(inm.fecha_inmersion);
      return inmDate.getMonth() === currentMonth && inmDate.getFullYear() === currentYear;
    }).length;

    setStats({
      totalOperaciones: buzoOperaciones.length,
      bitacorasPendientes: buzoBitacoras.filter(b => !b.firmado).length,
      bitacorasCompletadas: buzoBitacoras.filter(b => b.firmado).length,
      inmersionesMes
    });
  }, [bitacorasBuzo, inmersiones, operaciones, profile]);

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Bienvenido, {profile?.nombre} {profile?.apellido}
            </h1>
            <p className="text-gray-600">
              Dashboard de Buzo Profesional - Gestiona tus inmersiones y bitácoras
            </p>
          </div>
          <div className="text-right">
            <Badge 
              variant={estadoBuzo === 'activo' ? 'default' : 'secondary'}
              className={estadoBuzo === 'activo' ? 'bg-green-600' : ''}
            >
              {estadoBuzo === 'activo' ? '✓ Buzo Activo' : '○ Buzo Inactivo'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Estado del Perfil - Solo mostrar si NO está completo */}
      {!profileComplete && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              Completa tu Perfil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 mb-4">
              Debes completar tu perfil profesional para poder crear bitácoras y participar en operaciones.
            </p>
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <Link to="/profile-setup">
                <User className="w-4 h-4 mr-2" />
                Completar Perfil
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Información de Empresas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              Salmonera Asignada
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getSalmoneraName() ? (
              <div>
                <p className="text-lg font-semibold">{getSalmoneraName()}</p>
                <Badge variant="default">Asignado</Badge>
              </div>
            ) : (
              <div>
                <p className="text-gray-500">Sin salmonera asignada</p>
                <Badge variant="secondary">No asignado</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-teal-600" />
              Empresa de Servicio
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getContratistaName() ? (
              <div>
                <p className="text-lg font-semibold">{getContratistaName()}</p>
                <Badge variant="default">Asignado</Badge>
              </div>
            ) : (
              <div>
                <p className="text-gray-500">Sin empresa de servicio asignada</p>
                <Badge variant="secondary">No asignado</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operaciones</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOperaciones}</div>
            <p className="text-xs text-muted-foreground">
              Total participaciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bitácoras Pendientes</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.bitacorasPendientes}</div>
            <p className="text-xs text-muted-foreground">
              Por completar
            </p>
            {stats.bitacorasPendientes > 0 && (
              <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                <Link to="/bitacoras/buzo">Ver Pendientes</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bitácoras Completadas</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.bitacorasCompletadas}</div>
            <p className="text-xs text-muted-foreground">
              Firmadas este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inmersiones</CardTitle>
            <Anchor className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inmersionesMes}</div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notificaciones Recientes */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Notificaciones Recientes
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historial Reciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.bitacorasCompletadas > 0 || stats.totalOperaciones > 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-600 mb-4">
                Has participado en {stats.totalOperaciones} operaciones y completado {stats.bitacorasCompletadas} bitácoras.
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/operaciones">Ver Historial de Operaciones</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/bitacoras/buzo">Ver Mis Bitácoras</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">Sin actividad registrada</p>
              <p className="text-sm">
                {profileComplete 
                  ? "Cuando seas asignado a operaciones, aparecerán aquí."
                  : "Completa tu perfil para ser asignado a operaciones."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
