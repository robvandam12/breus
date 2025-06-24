
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Building, Calendar, FileText, Shield, Users, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface UserDetailModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  userStats?: {
    hpts_created: number;
    anexos_created: number;
    inmersiones: number;
    bitacoras: number;
    last_activity: string;
  };
}

export const UserDetailModal = ({ user, isOpen, onClose, userStats }: UserDetailModalProps) => {
  const getRoleBadgeColor = (rol: string) => {
    switch (rol) {
      case 'superuser':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'admin_salmonera':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'admin_servicio':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'supervisor':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'buzo':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadgeColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactivo':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Detalle del Usuario
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nombre Completo</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{user.nombre} {user.apellido}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Rol</label>
                  <div className="mt-1">
                    <Badge className={getRoleBadgeColor(user.rol)}>
                      <Shield className="w-3 h-3 mr-1" />
                      {user.rol.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Estado</label>
                  <div className="mt-1">
                    <Badge className={getStatusBadgeColor(user.estado)}>
                      {user.estado.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Empresa</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span>{user.empresa_nombre}</span>
                    <Badge variant="outline" className="text-xs">
                      {user.empresa_tipo}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha Registro</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>
                      {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: es })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas de Actividad */}
          {userStats && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas de Actividad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold">{userStats.hpts_created}</div>
                    <div className="text-sm text-gray-600">HPTs Creadas</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold">{userStats.anexos_created}</div>
                    <div className="text-sm text-gray-600">Anexos Bravo</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-lg mx-auto mb-2">
                      <Users className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="text-2xl font-bold">{userStats.inmersiones}</div>
                    <div className="text-sm text-gray-600">Inmersiones</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold">{userStats.bitacoras}</div>
                    <div className="text-sm text-gray-600">Bitácoras</div>
                  </div>
                </div>
                
                {userStats.last_activity && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      Última actividad: {format(new Date(userStats.last_activity), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Información Específica del Buzo */}
          {user.rol === 'buzo' && user.perfil_buzo && Object.keys(user.perfil_buzo).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Perfil de Buzo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.perfil_buzo.certificaciones && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Certificaciones</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.perfil_buzo.certificaciones.map((cert: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {user.perfil_buzo.experiencia && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Años de Experiencia</label>
                      <div className="mt-1">{user.perfil_buzo.experiencia} años</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
