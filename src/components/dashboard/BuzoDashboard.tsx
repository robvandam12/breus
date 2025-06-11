
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Anchor, Clock, FileText, Shield, Calendar, Activity, Users, AlertTriangle, Building, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const BuzoDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const isAssigned = profile?.salmonera_id || profile?.servicio_id;
  const isProfileComplete = profile?.perfil_completado;

  return (
    <div className="space-y-6">
      {/* Header con información del buzo */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile?.perfil_buzo?.foto_url} />
              <AvatarFallback className="text-lg">
                {profile?.nombre?.[0]}{profile?.apellido?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">
                {profile?.nombre} {profile?.apellido}
              </h2>
              <p className="text-gray-600">Buzo Profesional</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={isAssigned ? "default" : "secondary"}>
                  {isAssigned ? 'Asignado' : 'Sin asignar'}
                </Badge>
                <Badge variant={isProfileComplete ? "default" : "destructive"}>
                  {isProfileComplete ? 'Perfil completo' : 'Perfil incompleto'}
                </Badge>
              </div>
            </div>
            {!isProfileComplete && (
              <Button onClick={() => navigate('/profile-setup')}>
                Completar Perfil
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estado de asignación */}
      {!isAssigned && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              Pendiente de Asignación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 mb-4">
              Para acceder a todas las funcionalidades, necesitas ser asignado a una empresa.
              Un administrador debe agregarte a una salmonera o servicio de buceo.
            </p>
            <div className="text-sm text-orange-600">
              <p><strong>Mientras tanto puedes:</strong></p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Completar tu perfil profesional</li>
                <li>Revisar la información de la plataforma</li>
                <li>Contactar a un administrador para ser asignado</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas del buzo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Anchor className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Inmersiones</p>
                <p className="text-2xl font-bold">{isAssigned ? '0' : '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Horas Total</p>
                <p className="text-2xl font-bold">{isAssigned ? '0' : '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Bitácoras</p>
                <p className="text-2xl font-bold">{isAssigned ? '0' : '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Prof. Máx</p>
                <p className="text-2xl font-bold">{isAssigned ? '0m' : '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Empresa asignada */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Empresa Asignada
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAssigned ? (
              <div className="space-y-3">
                <p className="font-semibold text-green-700">
                  ✓ Asignado a empresa
                </p>
                <div className="text-sm space-y-1">
                  <p><strong>Tipo:</strong> {profile?.salmonera_id ? 'Salmonera' : 'Servicio de Buceo'}</p>
                  <p><strong>Estado:</strong> Activo</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Sin empresa asignada</p>
                <p className="text-sm text-gray-500 mt-1">
                  Espera ser asignado por un administrador
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Próximas inmersiones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Próximas Inmersiones
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAssigned ? (
              <div className="text-center py-6">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No hay inmersiones programadas</p>
                <p className="text-sm text-gray-500 mt-1">
                  Las inmersiones aparecerán aquí cuando seas asignado a una operación
                </p>
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto mb-2" />
                <p className="text-orange-600">Requiere asignación a empresa</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bitácoras pendientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Bitácoras Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAssigned && isProfileComplete ? (
              <div className="text-center py-6">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No hay bitácoras pendientes</p>
                <p className="text-sm text-gray-500 mt-1">
                  Las bitácoras aparecerán cuando el supervisor complete su bitácora
                </p>
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto mb-2" />
                <p className="text-orange-600">
                  {!isProfileComplete ? 'Perfil incompleto' : 'Sin empresa asignada'}
                </p>
                <p className="text-sm text-orange-500 mt-1">
                  {!isProfileComplete ? 'Completa tu perfil para crear bitácoras' : 'Requiere asignación a empresa'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Acciones rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/profile-setup')}
            >
              <Shield className="w-4 h-4 mr-2" />
              {isProfileComplete ? 'Editar Perfil' : 'Completar Perfil'}
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              disabled={!isAssigned || !isProfileComplete}
            >
              <FileText className="w-4 h-4 mr-2" />
              Ver Mis Bitácoras
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              disabled={!isAssigned}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Ver Operaciones
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              disabled={!isAssigned}
            >
              <Users className="w-4 h-4 mr-2" />
              Mi Equipo de Buceo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
