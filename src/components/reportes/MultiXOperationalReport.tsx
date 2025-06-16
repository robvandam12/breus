
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
  Ship
} from "lucide-react";
import { useReportesMultiX } from "@/hooks/useReportesMultiX";

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

  useEffect(() => {
    generateMultiXReport();
  }, [generateMultiXReport]);

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
          <Button onClick={generateMultiXReport} className="mt-4">
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

  return (
    <div className="space-y-6">
      {/* Filtros del Reporte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Reporte Operativo MultiX
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
                className="w-full px-3 py-2 border rounded-md"
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
                className="w-full px-3 py-2 border rounded-md"
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
              <Button onClick={generateMultiXReport} className="flex-1">
                Actualizar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => exportReport('excel')}
                className="px-3"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total MultiX</p>
                <p className="text-3xl font-bold text-blue-600">
                  {reportData.estadisticas_generales.total_multix_periodo}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contratistas Activos</p>
                <p className="text-3xl font-bold text-green-600">
                  {reportData.estadisticas_generales.contratistas_activos}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Buzos Activos</p>
                <p className="text-3xl font-bold text-purple-600">
                  {reportData.estadisticas_generales.buzos_activos}
                </p>
              </div>
              <User className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Eficiencia General</p>
                <p className="text-3xl font-bold text-orange-600">
                  {reportData.estadisticas_generales.eficiencia_general.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs con Reportes Detallados */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="contratistas" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Contratistas
          </TabsTrigger>
          <TabsTrigger value="buzos" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Buzos
          </TabsTrigger>
          <TabsTrigger value="equipos" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Equipos
          </TabsTrigger>
          <TabsTrigger value="operaciones" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Operaciones
          </TabsTrigger>
        </TabsList>

        {/* Tab General */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolución Mensual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.comparativas_mensuales.map((mes, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{mes.mes}</p>
                        <p className="text-sm text-gray-600">{mes.multix_completados} formularios</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{mes.eficiencia.toFixed(1)}%</p>
                        <p className="text-sm text-gray-600">{mes.buzos_participantes} buzos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Contratistas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.top_contratistas.map((contratista, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{contratista.nombre}</p>
                        <p className="text-sm text-gray-600">{contratista.formularios_completados} formularios</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{contratista.eficiencia.toFixed(1)}%</p>
                        <p className="text-sm text-gray-600">{contratista.tiempo_promedio}h promedio</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
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
          <Card>
            <CardHeader>
              <CardTitle>Performance de Contratistas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Contratista</th>
                      <th className="text-center p-3">Total MultiX</th>
                      <th className="text-center p-3">Completados</th>
                      <th className="text-center p-3">Eficiencia</th>
                      <th className="text-center p-3">Tiempo Prom.</th>
                      <th className="text-center p-3">Dotación Prom.</th>
                      <th className="text-center p-3">Inmersiones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.contratistas_performance.map((contratista, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{contratista.contratista_nombre}</p>
                            <p className="text-sm text-gray-600">
                              {contratista.sitios_trabajados.length} sitios activos
                            </p>
                          </div>
                        </td>
                        <td className="text-center p-3">{contratista.total_multix}</td>
                        <td className="text-center p-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {contratista.formularios_completados}
                          </span>
                        </td>
                        <td className="text-center p-3">
                          <span className={`font-bold ${
                            contratista.eficiencia_porcentaje >= 90 ? 'text-green-600' :
                            contratista.eficiencia_porcentaje >= 80 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {contratista.eficiencia_porcentaje.toFixed(1)}%
                          </span>
                        </td>
                        <td className="text-center p-3">{contratista.tiempo_promedio_completion.toFixed(1)}h</td>
                        <td className="text-center p-3">{contratista.dotacion_promedio.toFixed(1)}</td>
                        <td className="text-center p-3">
                          <div className="text-sm">
                            <p>{contratista.inmersiones_realizadas}</p>
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

        {/* Tab Buzos */}
        <TabsContent value="buzos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance de Buzos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Buzo</th>
                      <th className="text-center p-3">Participaciones</th>
                      <th className="text-center p-3">Roles</th>
                      <th className="text-center p-3">Inmersiones</th>
                      <th className="text-center p-3">Tiempo Total</th>
                      <th className="text-center p-3">Prof. Promedio</th>
                      <th className="text-center p-3">Calificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.buzos_performance.map((buzo, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{buzo.buzo_nombre} {buzo.buzo_apellido}</p>
                            <p className="text-sm text-gray-600">
                              {buzo.sitios_trabajados} sitios | {buzo.contratistas_colaborados.length} contratistas
                            </p>
                          </div>
                        </td>
                        <td className="text-center p-3">{buzo.total_participaciones}</td>
                        <td className="text-center p-3">
                          <div className="text-xs">
                            {buzo.roles_desempeniados.map((rol, idx) => (
                              <span key={idx} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-1 mb-1">
                                {rol}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="text-center p-3">{buzo.inmersiones_totales}</td>
                        <td className="text-center p-3">{(buzo.tiempo_total_buceo / 60).toFixed(1)}h</td>
                        <td className="text-center p-3">{buzo.profundidad_promedio.toFixed(1)}m</td>
                        <td className="text-center p-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
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

        {/* Tab Equipos */}
        <TabsContent value="equipos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Análisis de Equipos y Recursos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <Wrench className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                  <h3 className="font-semibold text-lg">Compresores Activos</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">24</p>
                  <p className="text-sm text-gray-600 mt-1">8 Compresor 1, 16 Compresor 2</p>
                </div>
                
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <Ship className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <h3 className="font-semibold text-lg">Embarcaciones</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">18</p>
                  <p className="text-sm text-gray-600 mt-1">Lanchas y barcos de apoyo</p>
                </div>
                
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <Clock className="mx-auto h-12 w-12 text-purple-500 mb-4" />
                  <h3 className="font-semibold text-lg">Horas Equipo</h3>
                  <p className="text-3xl font-bold text-purple-600 mt-2">1,247</p>
                  <p className="text-sm text-gray-600 mt-1">Horas totales de operación</p>
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
                    <div key={index} className="p-4 border rounded-lg">
                      <h5 className="font-medium">{sitio.sitio}</h5>
                      <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-600">Compresores</p>
                          <p className="font-bold text-blue-600">{sitio.compresores}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Embarcaciones</p>
                          <p className="font-bold text-green-600">{sitio.embarcaciones}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Horas Op.</p>
                          <p className="font-bold text-purple-600">{sitio.horas}h</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Operaciones */}
        <TabsContent value="operaciones" className="space-y-6">
          <Card>
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
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span>Mantención de Redes</span>
                      <span className="font-bold text-blue-600">{reportData.estadisticas_generales.formularios_mantencion}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span>Faenas Operativas</span>
                      <span className="font-bold text-green-600">{reportData.estadisticas_generales.formularios_faena}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-4">Métricas de Calidad</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>Tiempo Promedio</span>
                      <span className="font-bold text-gray-600">{reportData.estadisticas_generales.tiempo_promedio_formulario}h</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span>Sitios Operativos</span>
                      <span className="font-bold text-yellow-600">{reportData.estadisticas_generales.sitios_operativos}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold text-lg mb-4">Estado de Formularios</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-3" />
                    <h5 className="font-medium">Completados</h5>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {reportData.contratistas_performance.reduce((sum, c) => sum + c.formularios_completados, 0)}
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-yellow-50 rounded-lg">
                    <Clock className="mx-auto h-8 w-8 text-yellow-500 mb-3" />
                    <h5 className="font-medium">En Proceso</h5>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">
                      {reportData.contratistas_performance.reduce((sum, c) => sum + c.formularios_pendientes, 0)}
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <FileText className="mx-auto h-8 w-8 text-blue-500 mb-3" />
                    <h5 className="font-medium">Total Periodo</h5>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
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
