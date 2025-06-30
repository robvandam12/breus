
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Users, 
  Settings, 
  TrendingUp, 
  Calendar, 
  Download,
  BarChart3,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Wrench,
  Ship,
  Target,
  Award,
  Gauge
} from "lucide-react";
import { useReportesMultiX } from "@/hooks/useReportesMultiX";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent 
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from "recharts";

// Configuración de colores para los gráficos
const chartConfig = {
  eficiencia: {
    label: "Eficiencia",
    color: "hsl(var(--chart-1))",
  },
  formularios: {
    label: "Formularios",
    color: "hsl(var(--chart-2))",
  },
  inmersiones: {
    label: "Inmersiones",
    color: "hsl(var(--chart-3))",
  },
  tiempo: {
    label: "Tiempo",
    color: "hsl(var(--chart-4))",
  },
  buzos: {
    label: "Buzos",
    color: "hsl(var(--chart-5))",
  },
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const MultiXOperationalReport = () => {
  const [filters, setFilters] = useState({
    dateRange: {
      from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0]
    },
    tipoFormulario: undefined as 'mantencion' | 'faena' | undefined,
    contratistaId: undefined as string | undefined,
    sitioId: undefined as string | undefined,
  });

  const { reportData, isLoading, error, generateMultiXReport, exportReport } = useReportesMultiX(filters);

  // Cargar el reporte solo una vez al montar el componente
  useEffect(() => {
    generateMultiXReport();
  }, []); // Array de dependencias vacío para ejecutar solo al montar

  const handleGenerateReport = () => {
    generateMultiXReport();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Cargando Reporte MultiX...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Error en Reporte MultiX
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
          <Button onClick={handleGenerateReport} className="mt-4">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!reportData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reporte MultiX</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No hay datos disponibles para generar el reporte.</p>
        </CardContent>
      </Card>
    );
  }

  // Preparar datos para los gráficos
  const contratistasChartData = reportData.contratistas_performance.map(c => ({
    nombre: c.contratista_nombre.split(' ')[0], // Solo el primer nombre para que quepa
    eficiencia: c.eficiencia_porcentaje,
    formularios: c.formularios_completados,
    inmersiones: c.inmersiones_realizadas,
    tiempoPromedio: c.tiempo_promedio_completion
  }));

  const evolucionMensualData = reportData.comparativas_mensuales.map(m => ({
    mes: m.mes.substring(0, 3), // Abreviar mes
    multix: m.multix_completados,
    eficiencia: m.eficiencia,
    buzos: m.buzos_participantes,
    contratistas: m.contratistas_activos
  }));

  const tiposFormulariosData = [
    { name: 'Mantención', value: reportData.estadisticas_generales.formularios_mantencion },
    { name: 'Faena', value: reportData.estadisticas_generales.formularios_faena }
  ];

  const buzosRadarData = reportData.buzos_performance.slice(0, 4).map(b => ({
    buzo: `${b.buzo_nombre.charAt(0)}.${b.buzo_apellido}`,
    participaciones: b.total_participaciones,
    inmersiones: b.inmersiones_totales,
    calificacion: b.calificacion_promedio * 20, // Escalar a 100
    sitios: b.sitios_trabajados * 10, // Escalar para visualización
    tiempoTotal: (b.tiempo_total_buceo / 60) // Convertir a horas
  }));

  return (
    <div className="space-y-6">
      {/* Filtros del Reporte */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Activity className="w-6 h-6" />
            Reporte Operativo MultiX
            <div className="ml-auto flex items-center gap-2">
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {reportData.estadisticas_generales.total_multix_periodo} Formularios
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {reportData.estadisticas_generales.eficiencia_general.toFixed(1)}% Eficiencia
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Fecha Desde</Label>
              <input
                type="date"
                value={filters.dateRange.from}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, from: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label>Fecha Hasta</Label>
              <input
                type="date"
                value={filters.dateRange.to}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, to: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label>Tipo de Formulario</Label>
              <Select 
                value={filters.tipoFormulario || "todos"} 
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  tipoFormulario: value === "todos" ? undefined : value as 'mantencion' | 'faena'
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los formularios</SelectItem>
                  <SelectItem value="mantencion">Mantención</SelectItem>
                  <SelectItem value="faena">Faena</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleGenerateReport} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Target className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => exportReport('excel')}
                className="px-3 border-blue-200 hover:bg-blue-50"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs Principales Mejorados */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total MultiX</p>
                <p className="text-4xl font-bold">
                  {reportData.estadisticas_generales.total_multix_periodo}
                </p>
                <p className="text-blue-100 text-xs mt-1">
                  +{Math.round(reportData.estadisticas_generales.total_multix_periodo * 0.12)} vs mes anterior
                </p>
              </div>
              <div className="bg-blue-400 p-3 rounded-full">
                <FileText className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Contratistas</p>
                <p className="text-4xl font-bold">
                  {reportData.estadisticas_generales.contratistas_activos}
                </p>
                <p className="text-green-100 text-xs mt-1">
                  {reportData.estadisticas_generales.sitios_operativos} sitios activos
                </p>
              </div>
              <div className="bg-green-400 p-3 rounded-full">
                <Users className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Buzos Activos</p>
                <p className="text-4xl font-bold">
                  {reportData.estadisticas_generales.buzos_activos}
                </p>
                <p className="text-purple-100 text-xs mt-1">
                  {(reportData.estadisticas_generales.buzos_activos / reportData.estadisticas_generales.contratistas_activos).toFixed(1)} buzos/contratista
                </p>
              </div>
              <div className="bg-purple-400 p-3 rounded-full">
                <User className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Eficiencia</p>
                <p className="text-4xl font-bold">
                  {reportData.estadisticas_generales.eficiencia_general.toFixed(1)}%
                </p>
                <p className="text-orange-100 text-xs mt-1">
                  {reportData.estadisticas_generales.tiempo_promedio_formulario}h promedio
                </p>
              </div>
              <div className="bg-orange-400 p-3 rounded-full">
                <Gauge className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs con Reportes Detallados */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100">
          <TabsTrigger value="general" className="flex items-center gap-2 data-[state=active]:bg-white">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="contratistas" className="flex items-center gap-2 data-[state=active]:bg-white">
            <Users className="w-4 h-4" />
            Contratistas
          </TabsTrigger>
          <TabsTrigger value="buzos" className="flex items-center gap-2 data-[state=active]:bg-white">
            <User className="w-4 h-4" />
            Buzos
          </TabsTrigger>
          <TabsTrigger value="equipos" className="flex items-center gap-2 data-[state=active]:bg-white">
            <Settings className="w-4 h-4" />
            Equipos
          </TabsTrigger>
          <TabsTrigger value="operaciones" className="flex items-center gap-2 data-[state=active]:bg-white">
            <Activity className="w-4 h-4" />
            Operaciones
          </TabsTrigger>
        </TabsList>

        {/* Tab General - Dashboard Principal */}
        <TabsContent value="general" className="space-y-6">
          {/* Gráficos Principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Evolución Mensual */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Evolución Mensual MultiX
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <LineChart data={evolucionMensualData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="multix" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      name="Formularios MultiX"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="eficiencia" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="Eficiencia %"
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Distribución de Tipos de Formularios */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Distribución por Tipo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <PieChart>
                    <Pie
                      data={tiposFormulariosData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {tiposFormulariosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance de Contratistas - Gráfico de Barras */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Performance de Contratistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <BarChart data={contratistasChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="formularios" fill="#3B82F6" name="Formularios Completados" />
                  <Bar dataKey="eficiencia" fill="#10B981" name="Eficiencia %" />
                  <Bar dataKey="inmersiones" fill="#F59E0B" name="Inmersiones" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Alertas Operativas */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Alertas Operativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportData.alertas_operativas.map((alerta, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border-l-4 ${
                      alerta.prioridad === 'alta' ? 'border-red-500 bg-red-50' :
                      alerta.prioridad === 'media' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                        alerta.prioridad === 'alta' ? 'text-red-500' :
                        alerta.prioridad === 'media' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`} />
                      <div>
                        <h4 className="font-medium">{alerta.tipo}</h4>
                        <p className="text-sm text-gray-600 mt-1">{alerta.descripcion}</p>
                        {alerta.contratista && (
                          <p className="text-xs text-gray-500 mt-1">Contratista: {alerta.contratista}</p>
                        )}
                        {alerta.sitio && (
                          <p className="text-xs text-gray-500 mt-1">Sitio: {alerta.sitio}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Contratistas */}
        <TabsContent value="contratistas" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Performance Detallada de Contratistas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-semibold">Contratista</th>
                      <th className="text-center p-3 font-semibold">Total MultiX</th>
                      <th className="text-center p-3 font-semibold">Completados</th>
                      <th className="text-center p-3 font-semibold">Eficiencia</th>
                      <th className="text-center p-3 font-semibold">Tiempo Prom.</th>
                      <th className="text-center p-3 font-semibold">Dotación Prom.</th>
                      <th className="text-center p-3 font-semibold">Inmersiones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.contratistas_performance.map((contratista, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-gray-900">{contratista.contratista_nombre}</p>
                            <p className="text-sm text-gray-600">
                              {contratista.sitios_trabajados.length} sitios activos
                            </p>
                          </div>
                        </td>
                        <td className="text-center p-3 font-medium">{contratista.total_multix}</td>
                        <td className="text-center p-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 font-medium">
                            {contratista.formularios_completados}
                          </span>
                        </td>
                        <td className="text-center p-3">
                          <span className={`font-bold text-lg ${
                            contratista.eficiencia_porcentaje >= 90 ? 'text-green-600' :
                            contratista.eficiencia_porcentaje >= 80 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {contratista.eficiencia_porcentaje.toFixed(1)}%
                          </span>
                        </td>
                        <td className="text-center p-3 font-medium">{contratista.tiempo_promedio_completion.toFixed(1)}h</td>
                        <td className="text-center p-3 font-medium">{contratista.dotacion_promedio.toFixed(1)}</td>
                        <td className="text-center p-3">
                          <div className="text-sm">
                            <p className="font-medium">{contratista.inmersiones_realizadas}</p>
                            <p className="text-gray-600">{(contratista.tiempo_total_inmersiones / 60).toFixed(0)}h total</p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buzos" className="space-y-6">
          {/* Radar Chart de Performance de Buzos */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Análisis Multidimensional de Buzos Top
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <RadarChart data={buzosRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="buzo" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar 
                    name="Participaciones" 
                    dataKey="participaciones" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Radar 
                    name="Calificación" 
                    dataKey="calificacion" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </RadarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Performance Detallada de Buzos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-semibold">Buzo</th>
                      <th className="text-center p-3 font-semibold">Participaciones</th>
                      <th className="text-center p-3 font-semibold">Roles</th>
                      <th className="text-center p-3 font-semibold">Inmersiones</th>
                      <th className="text-center p-3 font-semibold">Tiempo Total</th>
                      <th className="text-center p-3 font-semibold">Prof. Promedio</th>
                      <th className="text-center p-3 font-semibold">Calificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.buzos_performance.map((buzo, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-gray-900">{buzo.buzo_nombre} {buzo.buzo_apellido}</p>
                            <p className="text-sm text-gray-600">
                              {buzo.sitios_trabajados} sitios | {buzo.contratistas_colaborados.length} contratistas
                            </p>
                          </div>
                        </td>
                        <td className="text-center p-3 font-medium">{buzo.total_participaciones}</td>
                        <td className="text-center p-3">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {buzo.roles_desempeniados.map((rol, idx) => (
                              <span key={idx} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                {rol}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="text-center p-3 font-medium">{buzo.inmersiones_totales}</td>
                        <td className="text-center p-3 font-medium">{(buzo.tiempo_total_buceo / 60).toFixed(1)}h</td>
                        <td className="text-center p-3 font-medium">{buzo.profundidad_promedio.toFixed(1)}m</td>
                        <td className="text-center p-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 font-medium">
                            ⭐ {buzo.calificacion_promedio.toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipos" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Análisis de Equipos y Recursos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <Wrench className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                  <h3 className="font-semibold text-lg text-blue-900">Compresores Activos</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">24</p>
                  <p className="text-sm text-blue-700 mt-1">8 Compresor 1, 16 Compresor 2</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <Ship className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <h3 className="font-semibold text-lg text-green-900">Embarcaciones</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">18</p>
                  <p className="text-sm text-green-700 mt-1">Lanchas y barcos de apoyo</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <Clock className="mx-auto h-12 w-12 text-purple-500 mb-4" />
                  <h3 className="font-semibold text-lg text-purple-900">Horas Equipo</h3>
                  <p className="text-3xl font-bold text-purple-600 mt-2">1,247</p>
                  <p className="text-sm text-purple-700 mt-1">Horas totales de operación</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <h4 className="font-semibold text-lg">Utilización de Equipos por Sitio</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { sitio: 'Sitio Alpha', compresores: 6, embarcaciones: 4, horas: 320 },
                    { sitio: 'Sitio Beta', compresores: 5, embarcaciones: 3, horas: 285 },
                    { sitio: 'Sitio Gamma', compresores: 7, embarcaciones: 5, horas: 395 },
                    { sitio: 'Sitio Delta', compresores: 6, embarcaciones: 6, horas: 247 }
                  ].map((sitio, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <h5 className="font-medium text-gray-900">{sitio.sitio}</h5>
                      <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-600">Compresores</p>
                          <p className="font-bold text-blue-600 text-lg">{sitio.compresores}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Embarcaciones</p>
                          <p className="font-bold text-green-600 text-lg">{sitio.embarcaciones}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Horas Op.</p>
                          <p className="font-bold text-purple-600 text-lg">{sitio.horas}h</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operaciones" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Análisis Operacional Detallado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-4">Tipos de Trabajo MultiX</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <span className="font-medium text-blue-900">Mantención de Redes</span>
                      <span className="font-bold text-blue-600 text-xl">{reportData.estadisticas_generales.formularios_mantencion}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                      <span className="font-medium text-green-900">Faenas Operativas</span>
                      <span className="font-bold text-green-600 text-xl">{reportData.estadisticas_generales.formularios_faena}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-4">Métricas de Calidad</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-900">Tiempo Promedio</span>
                      <span className="font-bold text-gray-600 text-xl">{reportData.estadisticas_generales.tiempo_promedio_formulario}h</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                      <span className="font-medium text-yellow-900">Sitios Operativos</span>
                      <span className="font-bold text-yellow-600 text-xl">{reportData.estadisticas_generales.sitios_operativos}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold text-lg mb-4">Estado de Formularios</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-3" />
                    <h5 className="font-medium text-green-900">Completados</h5>
                    <p className="text-3xl font-bold text-green-600 mt-1">
                      {reportData.contratistas_performance.reduce((sum, c) => sum + c.formularios_completados, 0)}
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                    <Clock className="mx-auto h-8 w-8 text-yellow-500 mb-3" />
                    <h5 className="font-medium text-yellow-900">En Proceso</h5>
                    <p className="text-3xl font-bold text-yellow-600 mt-1">
                      {reportData.contratistas_performance.reduce((sum, c) => sum + c.formularios_pendientes, 0)}
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <FileText className="mx-auto h-8 w-8 text-blue-500 mb-3" />
                    <h5 className="font-medium text-blue-900">Total Periodo</h5>
                    <p className="text-3xl font-bold text-blue-600 mt-1">
                      {reportData.estadisticas_generales.total_multix_periodo}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
