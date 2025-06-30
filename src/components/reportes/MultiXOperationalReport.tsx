
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { 
  Activity, TrendingUp, Users, Clock, AlertTriangle, 
  Download, RefreshCw, Calendar, Building, MapPin,
  Award, Timer, Waves
} from "lucide-react";
import { useReportesMultiX } from "@/hooks/useReportesMultiX";
import { addDays } from "date-fns";

export const MultiXOperationalReport = () => {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  
  const [filters, setFilters] = useState({
    tipoFormulario: 'todos' as 'mantencion' | 'faena' | 'todos',
    contratistaId: '',
    sitioId: ''
  });

  const { 
    reportData, 
    isLoading, 
    error, 
    generateMultiXReport, 
    exportReport 
  } = useReportesMultiX({
    dateRange,
    tipoFormulario: filters.tipoFormulario === 'todos' ? undefined : filters.tipoFormulario,
    contratistaId: filters.contratistaId || undefined,
    sitioId: filters.sitioId || undefined
  });

  const handleGenerateReport = () => {
    generateMultiXReport();
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    exportReport(format);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-red-600">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-medium">Error al cargar el reporte</p>
            <p className="text-sm text-gray-600 mt-2">{error}</p>
            <Button onClick={handleGenerateReport} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Reporte Operativo
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Análisis completo de rendimiento operacional y estadísticas de contratistas
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleGenerateReport} 
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Actualizar
              </Button>
              <Button 
                onClick={() => handleExport('excel')} 
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Período</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                />
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo Formulario</label>
              <Select 
                value={filters.tipoFormulario} 
                onValueChange={(value: any) => setFilters(prev => ({ ...prev, tipoFormulario: value }))}
              >
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
              <label className="text-sm font-medium mb-2 block">Contratista</label>
              <Select 
                value={filters.contratistaId} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, contratistaId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los contratistas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="1">AquaTech Diving</SelectItem>
                  <SelectItem value="2">Marine Services Ltd</SelectItem>
                  <SelectItem value="3">Deep Sea Solutions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sitio</label>
              <Select 
                value={filters.sitioId} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, sitioId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los sitios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="1">Sitio Alpha</SelectItem>
                  <SelectItem value="2">Sitio Beta</SelectItem>
                  <SelectItem value="3">Sitio Gamma</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-lg font-medium">Generando Reporte Operativo...</p>
              <p className="text-sm text-gray-600">Procesando datos de contratistas y buzos</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Content */}
      {!isLoading && reportData && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Formularios</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {reportData.estadisticas_generales.total_multix_periodo}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
                <div className="mt-2">
                  <Progress 
                    value={reportData.estadisticas_generales.eficiencia_general} 
                    className="h-2" 
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {reportData.estadisticas_generales.eficiencia_general}% eficiencia general
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Contratistas Activos</p>
                    <p className="text-2xl font-bold text-green-600">
                      {reportData.estadisticas_generales.contratistas_activos}
                    </p>
                  </div>
                  <Building className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {reportData.estadisticas_generales.sitios_operativos} sitios operativos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Buzos Activos</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {reportData.estadisticas_generales.buzos_activos}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Personal de buceo operativo
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tiempo Promedio</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {reportData.estadisticas_generales.tiempo_promedio_formulario}h
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Por formulario completado
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="contratistas" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="contratistas">Contratistas</TabsTrigger>
              <TabsTrigger value="buzos">Buzos</TabsTrigger>
              <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
              <TabsTrigger value="alertas">Alertas</TabsTrigger>
            </TabsList>

            {/* Contratistas Performance */}
            <TabsContent value="contratistas" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Eficiencia por Contratista</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={reportData.contratistas_performance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="contratista_nombre" 
                          angle={-45} 
                          textAnchor="end" 
                          height={80}
                          fontSize={12}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="eficiencia_porcentaje" fill="#3b82f6" name="Eficiencia %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Top Contractors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Contratistas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportData.top_contratistas.map((contratista, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium">{contratista.nombre}</p>
                              <p className="text-sm text-gray-600">
                                {contratista.formularios_completados} formularios
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-1">
                              {contratista.eficiencia}%
                            </Badge>
                            <p className="text-xs text-gray-500">
                              {contratista.tiempo_promedio}h promedio
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalle de Contratistas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Contratista</th>
                          <th className="text-right p-2">Formularios</th>
                          <th className="text-right p-2">Pendientes</th>
                          <th className="text-right p-2">Eficiencia</th>
                          <th className="text-right p-2">Dotación Prom.</th>
                          <th className="text-right p-2">Inmersiones</th>
                          <th className="text-right p-2">Tiempo Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.contratistas_performance.map((contratista) => (
                          <tr key={contratista.contratista_id} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{contratista.contratista_nombre}</td>
                            <td className="p-2 text-right">{contratista.formularios_completados}</td>
                            <td className="p-2 text-right">
                              <Badge variant={contratista.formularios_pendientes > 0 ? "destructive" : "secondary"}>
                                {contratista.formularios_pendientes}
                              </Badge>
                            </td>
                            <td className="p-2 text-right">
                              <Badge variant={contratista.eficiencia_porcentaje >= 90 ? "default" : "secondary"}>
                                {contratista.eficiencia_porcentaje}%
                              </Badge>
                            </td>
                            <td className="p-2 text-right">{contratista.dotacion_promedio}</td>
                            <td className="p-2 text-right">{contratista.inmersiones_realizadas}</td>
                            <td className="p-2 text-right">{(contratista.tiempo_total_inmersiones / 60).toFixed(1)}h</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Buzos Performance */}
            <TabsContent value="buzos" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Buzos Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Buzos por Participaciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={reportData.top_buzos}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="nombre" 
                          angle={-45} 
                          textAnchor="end" 
                          height={80}
                          fontSize={12}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="participaciones" fill="#10b981" name="Participaciones" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Buzos Performance Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Distribución de Calificaciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Excelente (4.5+)', value: reportData.buzos_performance.filter(b => b.calificacion_promedio >= 4.5).length, fill: '#10b981' },
                            { name: 'Bueno (4.0-4.5)', value: reportData.buzos_performance.filter(b => b.calificacion_promedio >= 4.0 && b.calificacion_promedio < 4.5).length, fill: '#3b82f6' },
                            { name: 'Regular (<4.0)', value: reportData.buzos_performance.filter(b => b.calificacion_promedio < 4.0).length, fill: '#f59e0b' }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Buzos Detail Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalle de Performance de Buzos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Buzo</th>
                          <th className="text-right p-2">Participaciones</th>
                          <th className="text-left p-2">Roles</th>
                          <th className="text-right p-2">Inmersiones</th>
                          <th className="text-right p-2">Tiempo Total</th>
                          <th className="text-right p-2">Prof. Prom.</th>
                          <th className="text-right p-2">Calificación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.buzos_performance.map((buzo, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{buzo.buzo_nombre} {buzo.buzo_apellido}</td>
                            <td className="p-2 text-right">{buzo.total_participaciones}</td>
                            <td className="p-2">
                              <div className="flex flex-wrap gap-1">
                                {buzo.roles_desempeniados.map((rol, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {rol}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                            <td className="p-2 text-right">{buzo.inmersiones_totales}</td>
                            <td className="p-2 text-right">{(buzo.tiempo_total_buceo / 60).toFixed(1)}h</td>
                            <td className="p-2 text-right">{buzo.profundidad_promedio}m</td>
                            <td className="p-2 text-right">
                              <Badge variant={buzo.calificacion_promedio >= 4.5 ? "default" : buzo.calificacion_promedio >= 4.0 ? "secondary" : "destructive"}>
                                ⭐ {buzo.calificacion_promedio}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tendencias */}
            <TabsContent value="tendencias" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tendencias Mensuales</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={reportData.comparativas_mensuales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="multix_completados" stroke="#3b82f6" name="Formularios Completados" />
                      <Line type="monotone" dataKey="contratistas_activos" stroke="#10b981" name="Contratistas Activos" />
                      <Line type="monotone" dataKey="buzos_participantes" stroke="#f59e0b" name="Buzos Participantes" />
                      <Line type="monotone" dataKey="eficiencia" stroke="#ef4444" name="Eficiencia %" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Alertas */}
            <TabsContent value="alertas" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {reportData.alertas_operativas.map((alerta, index) => (
                  <Card key={index} className={`border-l-4 ${
                    alerta.prioridad === 'alta' ? 'border-l-red-500' : 
                    alerta.prioridad === 'media' ? 'border-l-yellow-500' : 
                    'border-l-blue-500'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className={`w-5 h-5 ${
                              alerta.prioridad === 'alta' ? 'text-red-500' : 
                              alerta.prioridad === 'media' ? 'text-yellow-500' : 
                              'text-blue-500'
                            }`} />
                            <h4 className="font-medium">{alerta.tipo}</h4>
                            <Badge variant={
                              alerta.prioridad === 'alta' ? 'destructive' : 
                              alerta.prioridad === 'media' ? 'default' : 
                              'secondary'
                            }>
                              {alerta.prioridad}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{alerta.descripcion}</p>
                          {alerta.contratista && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Building className="w-3 h-3" />
                              <span>Contratista: {alerta.contratista}</span>
                            </div>
                          )}
                          {alerta.sitio && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              <span>Sitio: {alerta.sitio}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Empty State */}
      {!isLoading && !reportData && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-600">No hay datos disponibles</p>
              <p className="text-sm text-gray-500 mb-4">
                Genera un reporte para ver las estadísticas operacionales
              </p>
              <Button onClick={handleGenerateReport}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generar Reporte
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
