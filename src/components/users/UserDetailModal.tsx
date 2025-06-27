

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Mail, Building, Calendar, FileText, Shield, Users, Clock, Activity, History } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useUserActivity } from "@/hooks/useUserActivity";
import { UserActivityStats } from "./UserActivityStats";
import { UserAssignmentCard } from "./UserAssignmentCard";
import { UserTimelineItem } from "./UserTimelineItem";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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
  const [activeTab, setActiveTab] = useState("general");
  const { activity, isLoading: activityLoading } = useUserActivity(user?.usuario_id);

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

  const getProximasInmersiones = () => {
    if (!activity) return [];
    
    const hoy = new Date();
    const todasInmersiones = [
      ...activity.inmersiones.como_supervisor,
      ...activity.inmersiones.como_buzo_principal,
      ...activity.inmersiones.como_buzo_asistente,
      ...activity.inmersiones.como_miembro_equipo.map(m => m.inmersion).filter(Boolean)
    ];
    
    return todasInmersiones
      .filter(inmersion => {
        const fechaInmersion = new Date(inmersion.fecha_inmersion);
        return fechaInmersion >= hoy && inmersion.estado !== 'cancelada';
      })
      .sort((a, b) => new Date(a.fecha_inmersion).getTime() - new Date(b.fecha_inmersion).getTime())
      .slice(0, 5);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Detalle del Usuario
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="asignaciones" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Asignaciones
            </TabsTrigger>
            <TabsTrigger value="actividad" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Actividad
            </TabsTrigger>
            <TabsTrigger value="historial" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Historial
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 flex-1 overflow-hidden">
            <TabsContent value="general" className="space-y-6 m-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-6 pr-4">
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

                  {/* Estadísticas Mejoradas */}
                  {activity && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Estadísticas de Actividad</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <UserActivityStats activity={activity} />
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
              </ScrollArea>
            </TabsContent>

            <TabsContent value="asignaciones" className="space-y-6 m-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-4 pr-4">
                  {activityLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <LoadingSpinner text="Cargando asignaciones..." />
                    </div>
                  ) : activity ? (
                    <>
                      {/* Próximas Inmersiones */}
                      <UserAssignmentCard
                        title="Próximas Inmersiones"
                        assignments={getProximasInmersiones()}
                        type="inmersion"
                      />

                      {/* Cuadrilla Actual */}
                      <UserAssignmentCard
                        title="Cuadrilla Actual"
                        assignments={activity.cuadrillas.actual ? [activity.cuadrillas.actual] : []}
                        type="cuadrilla"
                      />

                      {/* Bitácoras Pendientes */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Bitácoras Pendientes
                            <Badge variant="secondary" className="text-xs">
                              {activity.bitacoras.buzo.pendientes.length + activity.bitacoras.supervisor.pendientes.length}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {activity.bitacoras.buzo.pendientes.length === 0 && 
                           activity.bitacoras.supervisor.pendientes.length === 0 ? (
                            <p className="text-sm text-gray-500">No hay bitácoras pendientes</p>
                          ) : (
                            <div className="space-y-2">
                              {[...activity.bitacoras.buzo.pendientes, ...activity.bitacoras.supervisor.pendientes]
                                .slice(0, 5)
                                .map((bitacora, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                                  <div>
                                    <p className="font-medium text-sm">{bitacora.codigo}</p>
                                    <p className="text-xs text-gray-600">
                                      {bitacora.inmersion?.codigo || 'Sin inmersión'}
                                    </p>
                                  </div>
                                  <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Pendiente
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <p className="text-center text-gray-500 py-8">No se pudieron cargar las asignaciones</p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="actividad" className="space-y-6 m-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-4 pr-4">
                  {activityLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <LoadingSpinner text="Cargando actividad..." />
                    </div>
                  ) : activity ? (
                    <>
                      {/* Resumen de Actividad por Tipo */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {activity.inmersiones.como_supervisor.length}
                              </div>
                              <div className="text-sm text-gray-600">Como Supervisor</div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {activity.inmersiones.como_buzo_principal.length}
                              </div>
                              <div className="text-sm text-gray-600">Como Buzo Principal</div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600">
                                {activity.documentos.hpts.length + activity.documentos.anexos_bravo.length}
                              </div>
                              <div className="text-sm text-gray-600">Documentos Creados</div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Actividad Reciente (últimos 10 eventos) */}
                      <div>
                        <h3 className="font-medium mb-3">Actividad Reciente</h3>
                        {activity.timeline.slice(0, 10).map((event) => (
                          <UserTimelineItem key={event.id} event={event} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-center text-gray-500 py-8">No se pudo cargar la actividad</p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="historial" className="space-y-6 m-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-4 pr-4">
                  {activityLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <LoadingSpinner text="Cargando historial..." />
                    </div>
                  ) : activity ? (
                    <>
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Historial Completo</h3>
                        <Badge variant="outline" className="text-xs">
                          {activity.timeline.length} eventos
                        </Badge>
                      </div>
                      
                      {activity.timeline.map((event) => (
                        <UserTimelineItem key={event.id} event={event} />
                      ))}
                      
                      {activity.timeline.length === 0 && (
                        <p className="text-center text-gray-500 py-8">
                          No hay actividad registrada para este usuario
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-center text-gray-500 py-8">No se pudo cargar el historial</p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
