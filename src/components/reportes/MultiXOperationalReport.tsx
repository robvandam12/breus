
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
  MapPin,
  Star,
  Award,
  Zap
} from "lucide-react";
import { useReportesMultiX } from '@/hooks/useReportesMultiX';
import { ReportDateRangePicker } from './ReportDateRangePicker';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  ComposedChart,
  Area,
  AreaChart,
  Legend
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B9D', '#4ECDC4'];

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'destructive';
      case 'media': return 'default';
      case 'baja': return 'secondary';
      default: return 'default';
    }
  };

  // Datos para gráficos de comparación
  const contratistasComparison = reportData.contratistas_performance.map(c => ({
    nombre: c.contratista_nombre.split(' ')[0], // Solo primera palabra para mejor visualización
    eficiencia: c.eficiencia_porcentaje,
    tiempo: c.tiempo_promedio_completion,
    completados: c.formularios_completados,
    inmersiones: c.inmersiones_realizadas
  }));

  const buzosComparison = reportData.buzos_performance.map(b => ({
    nombre: `${b.buzo_nombre} ${b.buzo_apellido.charAt(0)}.`,
    participaciones: b.total_participaciones,
    calificacion: b.calificacion_promedio,
    tiempo_total: Math.round(b.tiempo_total_buceo / 60), // convertir a horas
    profundidad: b.profundidad_promedio
  }));

  const eficienciaData = reportData.contratistas_performance.map((c, index) => ({
    nombre: c.contratista_nombre.split(' ')[0],
    eficiencia: c.eficiencia_porcentaje,
    fill: COLORS[index % COLORS.length]
  }));

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Reporte Operativo MultiX - Análisis de Rendimiento
              </CardTitle>
              <CardDescription>
                Comparativa visual de contratistas, buzos y métricas operativas
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

      {/* KPIs Principales Mejorados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total MultiX Periodo</p>
                <p className="text-3xl font-bold text-blue-600">
                  {reportData.estadisticas_generales.total_multix_periodo}
                </p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  <span>+12% vs mes anterior</span>
                </div>
              </div>
              <FileText className="h-12 w-12 text-blue-600 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Eficiencia Operativa</p>
                <p className="text-3xl font-bold text-green-600">
                  {reportData.estadisticas_generales.eficiencia_general}%
                </p>
                <Progress value={reportData.estadisticas_generales.eficiencia_general} className="mt-2 h-2" />
              </div>
              <Target className="h-12 w-12 text-green-600 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recursos Activos</p>
                <p className="text-3xl font-bold text-purple-600">
                  {reportData.estadisticas_generales.contratistas_activos}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {reportData.estadisticas_generales.buzos_activos} buzos | {reportData.estadisticas_generales.sitios_operativos} sitios
                </p>
              </div>
              <Users className="h-12 w-12 text-purple-600 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
                <p className="text-3xl font-bold text-orange-600">
                  {reportData.estadisticas_generales.tiempo_promedio_formulario}h
                </p>
                <div className="flex items-center text-sm text-green-500 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                  <span>-8% mejora en tiempo</span>
                </div>
              </div>
              <Clock className="h-12 w-12 text-orange-600 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="comparativas" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="comparativas">Comparativas</TabsTrigger>
          <TabsTrigger value="champions">Champions</TabsTrigger>
          <TabsTrigger value="contratistas">Contratistas</TabsTrigger>
          <TabsTrigger value="buzos">Buzos</TabsTrigger>
          <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="comparativas" className="space-y-6">
          {/* Gráfico de Eficiencia de Contratistas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Ranking de Eficiencia por Contratista
                </CardTitle>
                <CardDescription>Comparativa visual de rendimiento operativo</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    eficiencia: {
                      label: "Eficiencia %",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={contratistasComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nombre" />
                      <YAxis domain={[80, 100]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="eficiencia" fill="#8884d8" radius={[4, 4, 0, 0]}>
                        {contratistasComparison.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  Tiempo vs Formularios Completados
                </CardTitle>
                <CardDescription>Eficiencia en tiempo de ejecución</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    tiempo: {
                      label: "Tiempo Promedio (h)",
                      color: "hsl(var(--chart-2))",
                    },
                    completados: {
                      label: "Formularios Completados",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={contratistasComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nombre" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar yAxisId="left" dataKey="completados" fill="#00C49F" />
                      <Line yAxisId="right" type="monotone" dataKey="tiempo" stroke="#FF8042" strokeWidth={3} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Performance de Buzos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Top Buzos por Calificación
                </CardTitle>
                <CardDescription>Rendimiento y experiencia de buzos</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    calificacion: {
                      label: "Calificación",
                      color: "hsl(var(--chart-3))",
                    },
                    participaciones: {
                      label: "Participaciones",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={buzosComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nombre" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="calificacion" stackId="1" stroke="#FFBB28" fill="#FFBB28" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="participaciones" stackId="2" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución de Eficiencia</CardTitle>
                <CardDescription>Vista circular del rendimiento general</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    eficiencia: {
                      label: "Eficiencia %",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={eficienciaData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ nombre, eficiencia }) => `${nombre}: ${eficiencia}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="eficiencia"
                      >
                        {eficienciaData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="champions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Champion Contratista */}
            <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-2">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-yellow-700">🏆 Mejor Contratista</CardTitle>
                <CardDescription>Líder en eficiencia operativa</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">AquaTech Diving</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Eficiencia:</span>
                    <span className="font-bold text-green-600">93.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Formularios:</span>
                    <span className="font-bold">42 completados</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tiempo prom:</span>
                    <span className="font-bold text-blue-600">2.5h</span>
                  </div>
                </div>
                <Badge className="mt-3 bg-yellow-400 text-yellow-900">Campeón del Periodo</Badge>
              </CardContent>
            </Card>

            {/* Champion Buzo */}
            <Card className="border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mb-2">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-blue-700">⭐ Mejor Buzo</CardTitle>
                <CardDescription>Excelencia en rendimiento</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Miguel Ramirez</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Calificación:</span>
                    <span className="font-bold text-yellow-600">4.9 ⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Participaciones:</span>
                    <span className="font-bold">22</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Profundidad prom:</span>
                    <span className="font-bold text-blue-600">28.1m</span>
                  </div>
                </div>
                <Badge className="mt-3 bg-blue-400 text-blue-900">Buzo Estrella</Badge>
              </CardContent>
            </Card>

            {/* Champion Eficiencia */}
            <Card className="border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mb-2">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-green-700">⚡ Más Eficiente</CardTitle>
                <CardDescription>Velocidad y calidad</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Oceanic Contractors</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tiempo promedio:</span>
                    <span className="font-bold text-green-600">2.8h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Formularios:</span>
                    <span className="font-bold">26</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Eficiencia:</span>
                    <span className="font-bold text-green-600">89.7%</span>
                  </div>
                </div>
                <Badge className="mt-3 bg-green-400 text-green-900">Velocidad Récord</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Estadísticas Destacadas */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 Estadísticas Destacadas del Periodo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">128</div>
                  <div className="text-sm text-purple-700">Inmersiones Totales</div>
                  <div className="text-xs text-gray-500">Récord mensual</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">5760</div>
                  <div className="text-sm text-orange-700">Horas de Inmersión</div>
                  <div className="text-xs text-gray-500">240 días equivalentes</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-cyan-600">25.3m</div>
                  <div className="text-sm text-cyan-700">Profundidad Promedio</div>
                  <div className="text-xs text-gray-500">Máxima: 35m</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-600">6.2</div>
                  <div className="text-sm text-emerald-700">Dotación Promedio</div>
                  <div className="text-xs text-gray-500">Óptimo: 6-8 personas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contratistas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Detallada de Contratistas</CardTitle>
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
              <CardTitle>Performance Individual de Buzos</CardTitle>
              <CardDescription>Análisis de rendimiento y experiencia</CardDescription>
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
              <CardTitle>Evolución Temporal de Métricas</CardTitle>
              <CardDescription>Tendencias de rendimiento por mes</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  multix_completados: {
                    label: "MultiX Completados",
                    color: "hsl(var(--chart-1))",
                  },
                  buzos_participantes: {
                    label: "Buzos Participantes",
                    color: "hsl(var(--chart-2))",
                  },
                  eficiencia: {
                    label: "Eficiencia %",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData.comparativas_mensuales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="multix_completados" stroke="#8884d8" strokeWidth={3} name="MultiX Completados" />
                    <Line type="monotone" dataKey="buzos_participantes" stroke="#82ca9d" strokeWidth={3} name="Buzos Participantes" />
                    <Line type="monotone" dataKey="eficiencia" stroke="#ffc658" strokeWidth={3} name="Eficiencia %" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Sistema de Alertas Operativas
              </CardTitle>
              <CardDescription>Situaciones que requieren atención inmediata</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.alertas_operativas.map((alerta, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      alerta.prioridad === 'alta' ? 'text-red-500' :
                      alerta.prioridad === 'media' ? 'text-yellow-500' : 'text-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{alerta.tipo}</p>
                        <Badge variant={getPriorityColor(alerta.prioridad) as any}>
                          {alerta.prioridad.toUpperCase()}
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
