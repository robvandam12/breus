
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FileText, Waves, BookOpen, CheckCircle, Clock, User } from "lucide-react";
import { getOperacionCompleta, getOperacionSummary } from "@/data/mockup";

export const OperacionCompletaViewer = () => {
  const [activeTab, setActiveTab] = useState("resumen");
  const data = getOperacionCompleta();
  const summary = getOperacionSummary();

  const getStatusBadge = (estado: string, firmado?: boolean) => {
    if (firmado) return <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />Firmado</Badge>;
    if (estado === 'completada') return <Badge className="bg-blue-100 text-blue-700">Completada</Badge>;
    if (estado === 'activa') return <Badge className="bg-green-100 text-green-700">Activa</Badge>;
    return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operación Completa - Mockup Data</h1>
          <p className="text-gray-600">Visualización de una operación completa con todos sus componentes</p>
        </div>
        {getStatusBadge(data.operacion.estado)}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="operacion">Operación</TabsTrigger>
          <TabsTrigger value="equipo">Equipo</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="inmersiones">Inmersiones</TabsTrigger>
          <TabsTrigger value="bitacoras">Bitácoras</TabsTrigger>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Operación</p>
                    <p className="font-semibold">{summary.operacion.codigo}</p>
                    <p className="text-xs text-gray-500">{summary.operacion.fechas}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Equipo</p>
                    <p className="font-semibold">{summary.equipo.miembros_total} miembros</p>
                    <p className="text-xs text-gray-500">1 supervisor + {summary.equipo.buzos} buzos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Waves className="w-8 h-8 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600">Inmersiones</p>
                    <p className="font-semibold">{summary.inmersiones.total} inmersiones</p>
                    <p className="text-xs text-gray-500">{summary.inmersiones.completadas} completadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Bitácoras</p>
                    <p className="font-semibold">{summary.bitacoras.total_firmadas} firmadas</p>
                    <p className="text-xs text-gray-500">{summary.bitacoras.supervisor} sup + {summary.bitacoras.buzo} buzo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Estado de Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">HPT - {summary.documentos.hpt.codigo}</p>
                    <p className="text-sm text-gray-600">Hoja de Planificación de Tareas</p>
                  </div>
                  {getStatusBadge(summary.documentos.hpt.estado, summary.documentos.hpt.firmado)}
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Anexo Bravo - {summary.documentos.anexo_bravo.codigo}</p>
                    <p className="text-sm text-gray-600">Documento de Seguridad</p>
                  </div>
                  {getStatusBadge(summary.documentos.anexo_bravo.estado, summary.documentos.anexo_bravo.firmado)}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operacion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Operación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Código</label>
                    <p className="font-mono text-lg">{data.operacion.codigo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nombre</label>
                    <p className="text-lg">{data.operacion.nombre}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tareas</label>
                    <p className="text-gray-700">{data.operacion.tareas}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Salmonera</label>
                    <p>{data.operacion.salmoneras?.nombre}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Sitio</label>
                    <p>{data.operacion.sitios?.nombre}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Contratista</label>
                    <p>{data.operacion.contratistas?.nombre}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Período</label>
                    <p>{data.operacion.fecha_inicio} - {data.operacion.fecha_fin}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {data.equipoBuceo.nombre}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{data.equipoBuceo.descripcion}</p>
              <div className="space-y-3">
                {data.equipoBuceo.miembros?.map((miembro) => (
                  <div key={miembro.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{miembro.usuario?.nombre} {miembro.usuario?.apellido}</p>
                        <p className="text-sm text-gray-600">{miembro.usuario?.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{miembro.rol_equipo.replace('_', ' ')}</Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {miembro.disponible ? 'Disponible' : 'No disponible'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentos" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  HPT - {data.hpt.codigo}
                  {getStatusBadge(data.hpt.estado, data.hpt.firmado)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Supervisor</label>
                  <p>{data.hpt.supervisor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Plan de Trabajo</label>
                  <p className="text-sm text-gray-700">{data.hpt.plan_trabajo}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Profundidad Máx.</label>
                    <p>{data.hpt.profundidad_maxima}m</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Temperatura</label>
                    <p>{data.hpt.temperatura}°C</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Observaciones</label>
                  <p className="text-sm text-gray-700">{data.hpt.observaciones}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Anexo Bravo - {data.anexoBravo.codigo}
                  {getStatusBadge(data.anexoBravo.estado, data.anexoBravo.firmado)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Lugar de Faena</label>
                  <p>{data.anexoBravo.lugar_faena}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Empresa</label>
                  <p>{data.anexoBravo.empresa_nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Supervisor Servicio</label>
                  <p>{data.anexoBravo.supervisor_servicio_nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Supervisor Mandante</label>
                  <p>{data.anexoBravo.supervisor_mandante_nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Trabajadores</label>
                  <p className="text-sm">{data.anexoBravo.anexo_bravo_trabajadores?.length} trabajadores registrados</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inmersiones" className="space-y-6">
          <div className="grid gap-4">
            {data.inmersiones.map((inmersion, index) => (
              <Card key={inmersion.inmersion_id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Waves className="w-5 h-5" />
                      {inmersion.codigo} - {inmersion.objetivo}
                    </span>
                    {getStatusBadge(inmersion.estado)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Fecha y Hora</label>
                      <p>{inmersion.fecha_inmersion}</p>
                      <p className="text-sm text-gray-600">{inmersion.hora_inicio} - {inmersion.hora_fin}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Equipo</label>
                      <p className="text-sm">Supervisor: {inmersion.supervisor}</p>
                      <p className="text-sm">Buzo Principal: {inmersion.buzo_principal}</p>
                      {inmersion.buzo_asistente && (
                        <p className="text-sm">Buzo Asistente: {inmersion.buzo_asistente}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Condiciones</label>
                      <p className="text-sm">Profundidad: {inmersion.profundidad_max}m</p>
                      <p className="text-sm">Temperatura: {inmersion.temperatura_agua}°C</p>
                      <p className="text-sm">Visibilidad: {inmersion.visibilidad}m</p>
                      <p className="text-sm">Corriente: {inmersion.corriente}</p>
                    </div>
                  </div>
                  {inmersion.observaciones && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-600">Observaciones</label>
                      <p className="text-sm text-gray-700">{inmersion.observaciones}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bitacoras" className="space-y-6">
          <Tabs defaultValue="supervisor">
            <TabsList>
              <TabsTrigger value="supervisor">Bitácoras Supervisor ({data.bitacorasSupervisor.length})</TabsTrigger>
              <TabsTrigger value="buzo">Bitácoras Buzo ({data.bitacorasBuzo.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="supervisor" className="space-y-4">
              {data.bitacorasSupervisor.map((bitacora) => (
                <Card key={bitacora.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{bitacora.codigo} - {bitacora.supervisor}</span>
                      {getStatusBadge('', bitacora.firmado)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Desarrollo de la Inmersión</label>
                      <p className="text-sm text-gray-700">{bitacora.desarrollo_inmersion}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Incidentes</label>
                      <p className="text-sm text-gray-700">{bitacora.incidentes}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Evaluación General</label>
                      <p className="text-sm text-gray-700">{bitacora.evaluacion_general}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="buzo" className="space-y-4">
              {data.bitacorasBuzo.map((bitacora) => (
                <Card key={bitacora.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{bitacora.codigo} - {bitacora.buzo}</span>
                      {getStatusBadge('', bitacora.firmado)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Trabajos Realizados</label>
                        <p className="text-sm text-gray-700">{bitacora.trabajos_realizados}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Estado Físico Post</label>
                        <p className="text-sm text-gray-700">{bitacora.estado_fisico_post}</p>
                        <p className="text-xs text-gray-500 mt-1">Profundidad máx: {bitacora.profundidad_maxima}m</p>
                      </div>
                    </div>
                    {bitacora.observaciones_tecnicas && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Observaciones Técnicas</label>
                        <p className="text-sm text-gray-700">{bitacora.observaciones_tecnicas}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-6">
          <div className="grid gap-4">
            {data.usuarios.map((usuario) => (
              <Card key={usuario.usuario_id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{usuario.nombre} {usuario.apellido}</p>
                        <p className="text-sm text-gray-600">{usuario.email}</p>
                        <p className="text-xs text-gray-500">{usuario.empresa_nombre}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{usuario.rol.replace('_', ' ')}</Badge>
                      {usuario.perfil_buzo?.matricula && (
                        <p className="text-xs text-gray-500 mt-1">
                          Matrícula: {usuario.perfil_buzo.matricula}
                        </p>
                      )}
                    </div>
                  </div>
                  {usuario.perfil_buzo && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="font-medium text-gray-600">Especialidades</label>
                          <p className="text-gray-700">
                            {usuario.perfil_buzo.especialidades?.join(', ') || 'No especificadas'}
                          </p>
                        </div>
                        <div>
                          <label className="font-medium text-gray-600">Experiencia</label>
                          <p className="text-gray-700">
                            {usuario.perfil_buzo.anos_experiencia} años - {usuario.perfil_buzo.inmersiones_registradas} inmersiones
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
