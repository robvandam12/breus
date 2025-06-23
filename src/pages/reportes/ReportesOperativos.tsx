
import React, { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertTriangle, Download, Filter } from "lucide-react";
import { useInmersiones } from '@/hooks/useInmersiones';
import { useBitacoras } from '@/hooks/useBitacoras';
import { useAuth } from '@/hooks/useAuth';
import { DateRange } from "react-day-picker";
import { addDays, format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function ReportesOperativos() {
  const { profile } = useAuth();
  const { inmersiones = [] } = useInmersiones();
  const { bitacoras = [] } = useBitacoras();
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [selectedCenter, setSelectedCenter] = useState<string>('all');
  const [selectedContractor, setSelectedContractor] = useState<string>('all');

  // Métricas calculadas
  const operationalMetrics = useMemo(() => {
    const filteredInmersiones = inmersiones.filter(inmersion => {
      if (!dateRange?.from || !dateRange?.to) return true;
      const inmersionDate = new Date(inmersion.fecha_inmersion);
      return inmersionDate >= dateRange.from && inmersionDate <= dateRange.to;
    });

    const filteredBitacoras = bitacoras.filter(bitacora => {
      if (!dateRange?.from || !dateRange?.to) return true;
      const bitacoraDate = new Date(bitacora.fecha);
      return bitacoraDate >= dateRange.from && bitacoraDate <= dateRange.to;
    });

    // Métricas básicas
    const totalInmersiones = filteredInmersiones.length;
    const inmersionesCompletadas = filteredInmersiones.filter(i => i.estado === 'completada').length;
    const inmersionesEnProgreso = filteredInmersiones.filter(i => i.estado === 'en_progreso').length;
    const inmersionesPlanificadas = filteredInmersiones.filter(i => i.estado === 'planificada').length;

    // Métricas de tiempo
    const inmersionesConDuracion = filteredInmersiones.filter(i => i.duracion_estimada);
    const tiempoPromedioInmersion = inmersionesConDuracion.length > 0 
      ? inmersionesConDuracion.reduce((sum, i) => sum + (i.duracion_estimada || 0), 0) / inmersionesConDuracion.length 
      : 0;

    // Eficiencia operativa
    const eficienciaOperativa = totalInmersiones > 0 ? (inmersionesCompletadas / totalInmersiones) * 100 : 0;

    // Distribución por profundidad
    const profundidadPromedio = filteredInmersiones.length > 0
      ? filteredInmersiones.reduce((sum, i) => sum + (i.profundidad_maxima || 0), 0) / filteredInmersiones.length
      : 0;

    return {
      totalInmersiones,
      inmersionesCompletadas,
      inmersionesEnProgreso,
      inmersionesPlanificadas,
      tiempoPromedioInmersion,
      eficienciaOperativa,
      profundidadPromedio,
      totalBitacoras: filteredBitacoras.length
    };
  }, [inmersiones, bitacoras, dateRange]);

  // Datos para gráficos
  const chartData = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return [];
    
    const days = [];
    const currentDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);

    while (currentDate <= endDate) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const dayInmersiones = inmersiones.filter(i => 
        format(new Date(i.fecha_inmersion), 'yyyy-MM-dd') === dateStr
      );

      days.push({
        date: format(currentDate, 'dd/MM', { locale: es }),
        inmersiones: dayInmersiones.length,
        completadas: dayInmersiones.filter(i => i.estado === 'completada').length,
        enProgreso: dayInmersiones.filter(i => i.estado === 'en_progreso').length
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }, [inmersiones, dateRange]);

  const distributionData = [
    { name: 'Completadas', value: operationalMetrics.inmersionesCompletadas, color: '#22c55e' },
    { name: 'En Progreso', value: operationalMetrics.inmersionesEnProgreso, color: '#f59e0b' },
    { name: 'Planificadas', value: operationalMetrics.inmersionesPlanificadas, color: '#3b82f6' }
  ];

  return (
    <MainLayout
      title="Reportes Operativos"
      subtitle="Métricas contextuales y análisis de rendimiento operativo"
      icon={BarChart3}
      headerChildren={
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros de Análisis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rango de Fechas</label>
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Centro de Cultivo</label>
                <Select value={selectedCenter} onValueChange={setSelectedCenter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar centro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los centros</SelectItem>
                    <SelectItem value="centro1">Centro Norte</SelectItem>
                    <SelectItem value="centro2">Centro Sur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contratista</label>
                <Select value={selectedContractor} onValueChange={setSelectedContractor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar contratista" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los contratistas</SelectItem>
                    <SelectItem value="contractor1">Buceo Austral</SelectItem>
                    <SelectItem value="contractor2">Servicios Marinos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Inmersiones</p>
                  <p className="text-3xl font-bold text-gray-900">{operationalMetrics.totalInmersiones}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12% vs período anterior
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Eficiencia Operativa</p>
                  <p className="text-3xl font-bold text-gray-900">{operationalMetrics.eficienciaOperativa.toFixed(1)}%</p>
                  <div className="mt-2">
                    <Progress value={operationalMetrics.eficienciaOperativa} className="h-2" />
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
                  <p className="text-3xl font-bold text-gray-900">{operationalMetrics.tiempoPromedioInmersion.toFixed(1)}h</p>
                  <p className="text-sm text-gray-500 mt-1">Por inmersión</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profundidad Promedio</p>
                  <p className="text-3xl font-bold text-gray-900">{operationalMetrics.profundidadPromedio.toFixed(1)}m</p>
                  <p className="text-sm text-gray-500 mt-1">Operaciones</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos y análisis */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trends">Tendencias</TabsTrigger>
            <TabsTrigger value="distribution">Distribución</TabsTrigger>
            <TabsTrigger value="comparison">Comparativas</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Inmersiones</CardTitle>
                <CardDescription>Evolución diaria de inmersiones por estado</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="inmersiones" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="completadas" stroke="#22c55e" strokeWidth={2} />
                    <Line type="monotone" dataKey="enProgreso" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Estado</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento por Día</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completadas" stackId="a" fill="#22c55e" />
                      <Bar dataKey="enProgreso" stackId="a" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Comparativa entre Centros/Contratistas</CardTitle>
                <CardDescription>Análisis comparativo de rendimiento operativo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Ranking por Eficiencia</h4>
                    <div className="space-y-3">
                      {[
                        { name: 'Centro Norte', efficiency: 92, inmersiones: 45 },
                        { name: 'Centro Sur', efficiency: 88, inmersiones: 38 },
                        { name: 'Centro Este', efficiency: 85, inmersiones: 32 }
                      ].map((center, index) => (
                        <div key={center.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="w-8 h-8 p-0 flex items-center justify-center">
                              {index + 1}
                            </Badge>
                            <div>
                              <p className="font-medium">{center.name}</p>
                              <p className="text-sm text-gray-600">{center.inmersiones} inmersiones</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{center.efficiency}%</p>
                            <p className="text-xs text-gray-500">eficiencia</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Indicadores Clave</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Tiempo Promedio</span>
                          <span className="text-blue-600 font-bold">3.2h</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>

                      <div className="p-4 bg-green-50 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Tasa de Completitud</span>
                          <span className="text-green-600 font-bold">94%</span>
                        </div>
                        <Progress value={94} className="h-2" />
                      </div>

                      <div className="p-4 bg-orange-50 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Seguridad Operativa</span>
                          <span className="text-orange-600 font-bold">98%</span>
                        </div>
                        <Progress value={98} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
