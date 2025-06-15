
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Download, 
  TrendingUp, 
  Users, 
  FileText, 
  Clock, 
  AlertTriangle,
  Trophy,
  Target,
  Activity,
  MapPin
} from "lucide-react";
import { useReportesMultiX } from '@/hooks/useReportesMultiX';
import { ReportDateRangePicker } from './ReportDateRangePicker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import type { DateRange } from "react-day-picker";

export const MultiXOperationalReport = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });

  const { reportData, isLoading, exportReport } = useReportesMultiX({ 
    dateRange: {
      from: dateRange.from?.toISOString().split('T')[0] || '',
      to: dateRange.to?.toISOString().split('T')[0] || ''
    }
  });

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    if (newDateRange) {
      setDateRange(newDateRange);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Generando reporte operativo MultiX...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!reportData) return null;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'destructive';
      case 'media': return 'default';
      case 'baja': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Reporte Operativo MultiX
              </CardTitle>
              <CardDescription>
                Análisis comparativo de contratistas, buzos y rendimiento operativo
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <ReportDateRangePicker
                dateRange={dateRange}
                onDateChange={handleDateRangeChange}
              />
              <Button variant="outline" onClick={() => exportReport('excel')}>
                <Download className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" onClick={() => exportReport('pdf')}>
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total MultiX</p>
                <p className="text-2xl font-bold text-blue-600">
                  {reportData.estadisticas_generales.total_multix_periodo}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-sm text-gray-600">
                <span>Mantención: {reportData.estadisticas_generales.formularios_mantencion}</span>
                <span className="mx-2">•</span>
                <span>Faena: {reportData.estadisticas_generales.formularios_faena}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Eficiencia General</p>
                <p className="text-2xl font-bold text-green-600">
                  {reportData.estadisticas_generales.eficiencia_general}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <Progress value={reportData.estadisticas_generales.eficiencia_general} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contratistas Activos</p>
                <p className="text-2xl font-bold text-purple-600">
                  {reportData.estadisticas_generales.contratistas_activos}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {reportData.estadisticas_generales.buzos_activos} buzos participantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
                <p className="text-2xl font-bold text-orange-600">
                  {reportData.estadisticas_generales.tiempo_promedio_formulario}h
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600 mt-2">Por formulario completado</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contratistas" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="contratistas">Contratistas</TabsTrigger>
          <TabsTrigger value="buzos">Buzos</TabsTrigger>
          <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="contratistas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance de Contratistas</CardTitle>
              <CardDescription>Análisis comparativo de rendimiento por contratista</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contratista</TableHead>
                    <TableHead>MultiX Completados</TableHead>
                    <TableHead>Eficiencia</TableHead>
                    <TableHead>Tiempo Promedio</TableHead>
                    <TableHead>Inmersiones</TableHead>
                    <TableHead>Sitios</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.contratistas_performance.map((contratista) => (
                    <TableRow key={contratista.contratista_id}>
                      <TableCell className="font-medium">{contratista.contratista_nombre}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{contratista.formularios_completados}</span>
                          <Badge variant="outline">
                            {contratista.formularios_pendientes} pendientes
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={contratista.eficiencia_porcentaje} className="w-16" />
                          <span className="text-sm">{contratista.eficiencia_porcentaje}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{contratista.tiempo_promedio_completion}h</TableCell>
                      <TableCell>{contratista.inmersiones_realizadas}</TableCell>
                      <TableCell>{contratista.sitios_trabajados.length}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buzos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance de Buzos</CardTitle>
              <CardDescription>Análisis de rendimiento individual de buzos</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Buzo</TableHead>
                    <TableHead>Participaciones</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Inmersiones</TableHead>
                    <TableHead>Tiempo Total</TableHead>
                    <TableHead>Profundidad Prom.</TableHead>
                    <TableHead>Calificación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.buzos_performance.map((buzo, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {buzo.buzo_nombre} {buzo.buzo_apellido}
                      </TableCell>
                      <TableCell>{buzo.total_participaciones}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {buzo.roles_desempeniados.map((rol, i) => (
                            <Badge key={i} variant="secondary">
                              {rol}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{buzo.inmersiones_totales}</TableCell>
                      <TableCell>{Math.round(buzo.tiempo_total_buceo / 60)}h</TableCell>
                      <TableCell>{buzo.profundidad_promedio}m</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{buzo.calificacion_promedio}</span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tendencias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencias Mensuales</CardTitle>
              <CardDescription>Evolución de métricas clave por mes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportData.comparativas_mensuales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="multix_completados" stroke="#8884d8" name="MultiX Completados" />
                  <Line type="monotone" dataKey="buzos_participantes" stroke="#82ca9d" name="Buzos Participantes" />
                  <Line type="monotone" dataKey="eficiencia" stroke="#ffc658" name="Eficiencia %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rankings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Contratistas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.top_contratistas.map((contratista, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          #{index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium">{contratista.nombre}</p>
                          <p className="text-sm text-gray-600">{contratista.formularios_completados} formularios</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{contratista.eficiencia}%</p>
                        <p className="text-sm text-gray-600">{contratista.tiempo_promedio}h prom.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Top Buzos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.top_buzos.map((buzo, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          #{index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium">{buzo.nombre}</p>
                          <p className="text-sm text-gray-600">{buzo.participaciones} participaciones</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-yellow-600">{buzo.calificacion} ★</p>
                        <p className="text-sm text-gray-600">{Math.round(buzo.tiempo_total / 60)}h total</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Alertas Operativas
              </CardTitle>
              <CardDescription>Situaciones que requieren atención</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.alertas_operativas.map((alerta, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      alerta.prioridad === 'alta' ? 'text-red-500' :
                      alerta.prioridad === 'media' ? 'text-yellow-500' : 'text-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{alerta.tipo}</p>
                        <Badge variant={getPriorityColor(alerta.prioridad) as any}>
                          {alerta.prioridad}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{alerta.descripcion}</p>
                      {(alerta.contratista || alerta.sitio) && (
                        <div className="flex items-center gap-2 mt-2">
                          {alerta.contratista && (
                            <Badge variant="outline">
                              <Users className="h-3 w-3 mr-1" />
                              {alerta.contratista}
                            </Badge>
                          )}
                          {alerta.sitio && (
                            <Badge variant="outline">
                              <MapPin className="h-3 w-3 mr-1" />
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
      </Tabs>
    </div>
  );
};
