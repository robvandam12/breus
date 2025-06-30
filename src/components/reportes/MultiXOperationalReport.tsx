
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart3, 
  Download, 
  Filter, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Users,
  Clock,
  Target,
  Building2,
  MapPin,
  Anchor
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useReportesMultiX } from '@/hooks/useReportesMultiX';

export const MultiXOperationalReport = () => {
  const [filters, setFilters] = useState({
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0]
    },
    tipoFormulario: undefined as 'mantencion' | 'faena' | undefined,
    contratistaId: undefined as string | undefined,
    sitioId: undefined as string | undefined
  });

  const { reportData, isLoading, error, generateMultiXReport, exportReport } = useReportesMultiX(filters);

  useEffect(() => {
    generateMultiXReport();
  }, [generateMultiXReport]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDateRangeChange = (field: 'from' | 'to', value: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Reporte Operativo</h2>
            <p className="text-muted-foreground">Cargando datos del reporte...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-100 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">Error al cargar el reporte</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!reportData) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay datos disponibles</h3>
          <p className="text-muted-foreground">Selecciona un rango de fechas para generar el reporte.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Reporte Operativo</h2>
          <p className="text-muted-foreground">
            Análisis integral de rendimiento operacional y métricas de contratistas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => exportReport('excel')}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Excel
          </Button>
          <Button
            variant="outline"
            onClick={() => exportReport('pdf')}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            PDF
          </Button>
          <Button
            onClick={generateMultiXReport}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Inicio</label>
              <Input
                type="date"
                value={filters.dateRange.from}
                onChange={(e) => handleDateRangeChange('from', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Fin</label>
              <Input
                type="date"
                value={filters.dateRange.to}
                onChange={(e) => handleDateRangeChange('to', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo Formulario</label>
              <Select
                value={filters.tipoFormulario || ""}
                onValueChange={(value) => handleFilterChange('tipoFormulario', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los tipos</SelectItem>
                  <SelectItem value="mantencion">Mantención</SelectItem>
                  <SelectItem value="faena">Faena</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contratista</label>
              <Select
                value={filters.contratistaId || ""}
                onValueChange={(value) => handleFilterChange('contratistaId', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los contratistas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los contratistas</SelectItem>
                  {reportData.contratistas_performance.map((contratista) => (
                    <SelectItem key={contratista.contratista_id} value={contratista.contratista_id}>
                      {contratista.contratista_nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
        <h3 className="flex items-center gap-2 text-blue-900">
          <BarChart3 className="w-6 h-6" />
          Reporte Operativo
        </h3>
        <p className="text-blue-700 mt-2">
          Período: {new Date(filters.dateRange.from).toLocaleDateString()} - {new Date(filters.dateRange.to).toLocaleDateString()}
        </p>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Formularios</p>
                <p className="text-2xl font-bold">{reportData.estadisticas_generales.total_multix_periodo}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="secondary">
                {reportData.estadisticas_generales.formularios_mantencion} Mantención
              </Badge>
              <Badge variant="outline">
                {reportData.estadisticas_generales.formularios_faena} Faena
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contratistas Activos</p>
                <p className="text-2xl font-bold">{reportData.estadisticas_generales.contratistas_activos}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                {reportData.estadisticas_generales.buzos_activos} buzos participantes
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Eficiencia General</p>
                <p className="text-2xl font-bold">{reportData.estadisticas_generales.eficiencia_general}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+2.3% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tiempo Promedio</p>
                <p className="text-2xl font-bold">{reportData.estadisticas_generales.tiempo_promedio_formulario}h</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Por formulario completado
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de contenido */}
      <Tabs defaultValue="contratistas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contratistas">Contratistas</TabsTrigger>
          <TabsTrigger value="buzos">Buzos</TabsTrigger>
          <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="contratistas" className="space-y-6">
          {/* Performance de Contratistas */}
          <Card>
            <CardHeader>
              <CardTitle>Performance de Contratistas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contratista</TableHead>
                    <TableHead>Formularios</TableHead>
                    <TableHead>Eficiencia</TableHead>
                    <TableHead>Tiempo Promedio</TableHead>
                    <TableHead>Inmersiones</TableHead>
                    <TableHead>Sitios</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.contratistas_performance.map((contratista) => (
                    <TableRow key={contratista.contratista_id}>
                      <TableCell className="font-medium">
                        {contratista.contratista_nombre}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>{contratista.formularios_completados} completados</div>
                          <div className="text-sm text-muted-foreground">
                            {contratista.formularios_pendientes} pendientes
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={contratista.eficiencia_porcentaje >= 90 ? "default" : "secondary"}
                          className={contratista.eficiencia_porcentaje >= 90 ? "bg-green-500" : "bg-yellow-500"}
                        >
                          {contratista.eficiencia_porcentaje}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {contratista.tiempo_promedio_completion}h
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>{contratista.inmersiones_realizadas} realizadas</div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round(contratista.tiempo_total_inmersiones / 60)}h total
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {contratista.sitios_trabajados.slice(0, 2).map((sitio, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {sitio}
                            </Badge>
                          ))}
                          {contratista.sitios_trabajados.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{contratista.sitios_trabajados.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buzos" className="space-y-6">
          {/* Performance de Buzos */}
          <Card>
            <CardHeader>
              <CardTitle>Performance de Buzos</CardTitle>
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
                    <TableHead>Calificación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.buzos_performance.map((buzo, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {buzo.buzo_nombre} {buzo.buzo_apellido}
                      </TableCell>
                      <TableCell>{buzo.total_participaciones}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {buzo.roles_desempeniados.slice(0, 2).map((rol, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {rol}
                            </Badge>
                          ))}
                          {buzo.roles_desempeniados.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{buzo.roles_desempeniados.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>{buzo.inmersiones_totales}</div>
                          <div className="text-sm text-muted-foreground">
                            {buzo.profundidad_promedio}m prom
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {Math.round(buzo.tiempo_total_buceo / 60)}h
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={buzo.calificacion_promedio >= 4.5 ? "default" : "secondary"}
                            className={buzo.calificacion_promedio >= 4.5 ? "bg-green-500" : "bg-yellow-500"}
                          >
                            {buzo.calificacion_promedio}/5
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tendencias" className="space-y-6">
          {/* Gráfico de Tendencias Mensuales */}
          <Card>
            <CardHeader>
              <CardTitle>Tendencias Mensuales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData.comparativas_mensuales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="multix_completados" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      name="Formularios Completados"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="eficiencia" 
                      stroke="#16a34a" 
                      strokeWidth={2}
                      name="Eficiencia (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Contratistas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Contratistas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.top_contratistas.map((contratista, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{contratista.nombre}</p>
                        <p className="text-sm text-muted-foreground">
                          {contratista.formularios_completados} formularios
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="default" className="bg-green-500">
                          {contratista.eficiencia}%
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {contratista.tiempo_promedio}h prom
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Buzos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.top_buzos.map((buzo, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{buzo.nombre}</p>
                        <p className="text-sm text-muted-foreground">
                          {buzo.participaciones} participaciones
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="default" className="bg-blue-500">
                          {buzo.calificacion}/5
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {Math.round(buzo.tiempo_total / 60)}h total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-6">
          {/* Alertas Operativas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Alertas Operativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.alertas_operativas.map((alerta, idx) => (
                  <div 
                    key={idx} 
                    className={`border rounded-lg p-4 ${
                      alerta.prioridad === 'alta' ? 'border-red-200 bg-red-50' :
                      alerta.prioridad === 'media' ? 'border-yellow-200 bg-yellow-50' :
                      'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant={
                              alerta.prioridad === 'alta' ? 'destructive' :
                              alerta.prioridad === 'media' ? 'default' : 'secondary'
                            }
                          >
                            {alerta.prioridad.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{alerta.tipo}</span>
                        </div>
                        <p className="text-muted-foreground">{alerta.descripcion}</p>
                        {(alerta.contratista || alerta.sitio) && (
                          <div className="flex items-center gap-4 mt-2">
                            {alerta.contratista && (
                              <div className="flex items-center gap-1 text-sm">
                                <Building2 className="w-4 h-4" />
                                {alerta.contratista}
                              </div>
                            )}
                            {alerta.sitio && (
                              <div className="flex items-center gap-1 text-sm">
                                <MapPin className="w-4 h-4" />
                                {alerta.sitio}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <AlertTriangle className={`w-5 h-5 ${
                        alerta.prioridad === 'alta' ? 'text-red-500' :
                        alerta.prioridad === 'media' ? 'text-yellow-500' :
                        'text-gray-500'
                      }`} />
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
