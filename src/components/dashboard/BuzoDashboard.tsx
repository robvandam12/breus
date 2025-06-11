
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Anchor, Building, User, AlertTriangle, FileText } from 'lucide-react';
import { useBuzoNotifications } from '@/hooks/useBuzoNotifications';
import { Link } from 'react-router-dom';

export const BuzoDashboard = () => {
  const { profile, user } = useAuth();
  const { notifications, unreadCount } = useBuzoNotifications();

  // Verificar si el perfil está completo
  const isProfileComplete = () => {
    const requiredFields = ['rut', 'telefono', 'direccion', 'ciudad', 'region', 'nacionalidad'];
    if (!profile?.perfil_buzo) return false;
    
    const perfilBuzo = profile.perfil_buzo as any;
    return requiredFields.every(field => perfilBuzo[field]?.toString().trim());
  };

  const profileComplete = isProfileComplete();

  // Obtener nombre de la empresa
  const getCompanyName = () => {
    if (profile?.salmonera_id) {
      return "Salmonera Asignada";
    } else if (profile?.servicio_id) {
      return "Servicio Asignado";
    }
    return "Sin empresa asignada";
  };

  const getCompanyStatus = () => {
    if (profile?.salmonera_id || profile?.servicio_id) {
      return "success";
    }
    return "warning";
  };

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-lg border">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenido, {profile?.nombre} {profile?.apellido}
        </h1>
        <p className="text-gray-600">
          Dashboard de Buzo Profesional - Gestiona tus inmersiones y bitácoras
        </p>
      </div>

      {/* Estado del Perfil */}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Estado de Empresa */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado de Empresa</CardTitle>
            <Building className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg font-semibold">{getCompanyName()}</p>
              <Badge variant={getCompanyStatus() === 'success' ? 'default' : 'secondary'}>
                {profile?.salmonera_id || profile?.servicio_id ? 'Asignado' : 'Sin asignar'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">
                Notificaciones sin leer
              </p>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" className="w-full">
                  Ver Notificaciones
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bitácoras Pendientes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bitácoras</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Bitácoras pendientes
              </p>
              {profileComplete ? (
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/bitacoras/buzo">Ver Bitácoras</Link>
                </Button>
              ) : (
                <p className="text-xs text-orange-600">
                  Completa tu perfil para crear bitácoras
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operaciones Recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Anchor className="w-5 h-5" />
            Historial de Operaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Anchor className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">No hay operaciones registradas</p>
            <p className="text-sm">
              {profileComplete 
                ? "Cuando seas asignado a operaciones, aparecerán aquí."
                : "Completa tu perfil para ser asignado a operaciones."
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notificaciones Recientes */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Notificaciones Recientes
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
    </div>
  );
};
