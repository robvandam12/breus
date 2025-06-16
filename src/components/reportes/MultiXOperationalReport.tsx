
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download, 
  TrendingUp, 
  Users, 
  Settings, 
  Fish, 
  Clock,
  Anchor,
  Activity,
  AlertTriangle,
  CheckCircle,
  Calendar,
  MapPin,
  Gauge
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useReportesMultiX } from '@/hooks/useReportesMultiX';

export const MultiXOperationalReport = () => {
  const [dateFrom, setDateFrom] = useState<Date>(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [dateTo, setDateTo] = useState<Date>(new Date());
  const [tipoFormulario, setTipoFormulario] = useState<'mantencion' | 'faena' | 'todos'>('todos');
  const [contratistaId, setContratistaId] = useState<string>('');
  const [sitioId, setSitioId] = useState<string>('');

  const { reportData, isLoading, generateMultiXReport, exportReport } = useReportesMultiX({
    dateRange: {
      from: dateFrom.toISOString().split('T')[0],
      to: dateTo.toISOString().split('T')[0]
    },
    tipoFormulario: tipoFormulario === 'todos' ? undefined : tipoFormulario,
    contratistaId: contratistaId || undefined,
    sitioId: sitioId || undefined
  });

  useEffect(() => {
    generateMultiXReport();
  }, [dateFrom, dateTo, tipoFormulario, contratistaId, sitioId]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Generando reporte MultiX...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!reportData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No hay datos disponibles para el reporte MultiX</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Reporte Operativo MultiX
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium">Fecha Desde</label>
              <DatePicker
                date={dateFrom}
                onDateChange={(date) => date && setDateFrom(date)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Fecha Hasta</label>
              <DatePicker
                date={dateTo}
                onDateChange={(date) => date && setDateTo(date)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tipo Formulario</label>
              <Select value={tipoFormulario} onValueChange={(value: any) => setTipoFormulario(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="mantencion">Mantención</SelectItem>
                  <SelectItem value="faena">Faena</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Contratista</label>
              <Select value={contratistaId} onValueChange={setContratistaId}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="1">AquaTech Diving</SelectItem>
                  <SelectItem value="2">Marine Services Ltd</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={() => exportReport('excel')} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button onClick={() => exportReport('pdf')} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Fish className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">MultiX Completados</p>
                <p className="text-2xl font-bold">{reportData.estadisticas_generales.total_multix_periodo}</p>
                <p className="text-xs text-green-600">↑ 12% vs mes anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Buzos Activos</p>
                <p className="text-2xl font-bold">{reportData.estadisticas_generales.buzos_activos}</p>
                <p className="text-xs text-blue-600">En {reportData.estadisticas_generales.sitios_operativos} sitios</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tiempo Promedio</p>
                <p className="text-2xl font-bold">{reportData.estadisticas_generales.tiempo_promedio_formulario}h</p>
                <p className="text-xs text-gray-600">Por formulario</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Eficiencia General</p>
                <p className="text-2xl font-bold">{reportData.estadisticas_generales.eficiencia_general}%</p>
                <p className="text-xs text-green-600">↑ 2.3% optimización</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contratistas">Contratistas</TabsTrigger>
          <TabsTrigger value="buzos">Buzos</TabsTrigger>
          <TabsTrigger value="equipos">Equipos</TabsTrigger>
          <TabsTrigger value="operaciones">Operaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tendencia Mensual */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tendencia Mensual MultiX</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.comparativas_mensuales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="multix_completados" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="eficiencia" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribución por Tipo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribución por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Mantención', value: reportData.estadisticas_generales.formularios_mantencion },
                        { name: 'Faena', value: reportData.estadisticas_generales.formularios_faena }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {[0, 1].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Alertas Operativas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Alertas y Recomendaciones Operativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.alertas_operativas.map((alerta, index) => (
                  <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${
                    alerta.prioridad === 'alta' ? 'bg-red-50 border border-red-200' :
                    alerta.prioridad === 'media' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}>
                    {alerta.prioridad === 'alta' ? (
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{alerta.tipo}</p>
                      <p className="text-sm text-gray-600">{alerta.descripcion}</p>
                      {(alerta.contratista || alerta.sitio) && (
                        <div className="flex gap-2 mt-1">
                          {alerta.contratista && (
                            <Badge variant="outline" className="text-xs">
                              <Users className="w-3 h-3 mr-1" />
                              {alerta.contratista}
                            </Badge>
                          )}
                          {alerta.sitio && (
                            <Badge variant="outline" className="text-xs">
                              <MapPin className="w-3 h-3 mr-1" />
                              {alerta.sitio}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contratistas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance de Contratistas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.contratistas_performance.map((contratista, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold">{contratista.contratista_nombre}</h4>
                        <p className="text-sm text-gray-600">{contratista.sitios_trabajados.length} sitios activos</p>
                      </div>
                      <Badge variant={contratista.eficiencia_porcentaje >= 90 ? "default" : "secondary"}>
                        {contratista.eficiencia_porcentaje}% eficiencia
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">MultiX Completados</span>
                        <p className="font-bold text-lg">{contratista.formularios_completados}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Dotación Promedio</span>
                        <p className="font-bold text-lg">{contratista.dotacion_promedio}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Inmersiones</span>
                        <p className="font-bold text-lg">{contratista.inmersiones_realizadas}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Tiempo Total</span>
                        <p className="font-bold text-lg">{Math.round(contratista.tiempo_total_inmersiones / 60)}h</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Tiempo Promedio</span>
                        <p className="font-bold text-lg">{contratista.tiempo_promedio_completion}h</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-sm text-gray-600">Sitios trabajados:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {contratista.sitios_trabajados.map((sitio, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {sitio}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buzos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance de Buzos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportData.buzos_performance.map((buzo, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{buzo.buzo_nombre} {buzo.buzo_apellido}</h4>
                        <div className="flex gap-1 mt-1">
                          {buzo.roles_desempeniados.map((rol, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {rol}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <span className="text-2xl">⭐</span>
                          <span className="font-bold">{buzo.calificacion_promedio}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Participaciones</span>
                        <p className="font-bold">{buzo.total_participaciones}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Inmersiones</span>
                        <p className="font-bold">{buzo.inmersiones_totales}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Tiempo Total</span>
                        <p className="font-bold">{Math.round(buzo.tiempo_total_buceo / 60)}h</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Prof. Promedio</span>
                        <p className="font-bold">{buzo.profundidad_promedio}m</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-sm text-gray-600">Contratistas colaborados:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {buzo.contratistas_colaborados.map((contratista, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {contratista}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Análisis de Equipos y Compresores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Utilización de Compresores */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold">Compresores</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Compresor 1</span>
                      <Badge variant="default">85% uso</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Compresor 2</span>
                      <Badge variant="secondary">72% uso</Badge>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">Promedio: 1,247h trabajo</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Equipos de Buceo */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Anchor className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold">Equipos Buceo</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Equipos Livianos</span>
                      <Badge variant="default">18 equipos</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Equipos Medianos</span>
                      <Badge variant="secondary">14 equipos</Badge>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="text-sm text-gray-600">
                        Mantención próxima: 6 equipos
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Eficiencia Operativa */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold">Eficiencia</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tiempo medio setup</span>
                      <span className="font-bold">45min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Inmersiones/día</span>
                      <span className="font-bold">8.3</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="text-sm text-green-600">
                        ↑ 12% mejora vs período anterior
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operaciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Análisis Operacional Detallado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tipos de Faenas */}
                <Card className="p-4">
                  <h4 className="font-semibold mb-4">Tipos de Faenas Realizadas</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Fish className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Mantención Redes</span>
                      </div>
                      <Badge variant="default">124 faenas</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Fish className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Mantención Loberas</span>
                      </div>
                      <Badge variant="secondary">89 faenas</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Fish className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">Mantención Peceras</span>
                      </div>
                      <Badge variant="outline">67 faenas</Badge>
                    </div>
                  </div>
                </Card>

                {/* Indicadores de Calidad */}
                <Card className="p-4">
                  <h4 className="font-semibold mb-4">Indicadores de Calidad</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Formularios sin observaciones</span>
                      <Badge variant="default">87%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cumplimiento horarios</span>
                      <Badge variant="default">94%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Incidentes reportados</span>
                      <Badge variant="destructive">3</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tiempo promedio inmersión</span>
                      <span className="font-bold">47min</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Cronograma de Actividades */}
              <Card className="p-4 mt-6">
                <h4 className="font-semibold mb-4">Distribución de Actividades por Día</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.comparativas_mensuales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="multix_completados" fill="#8884d8" name="MultiX Completados" />
                    <Bar dataKey="buzos_participantes" fill="#82ca9d" name="Buzos Participantes" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
