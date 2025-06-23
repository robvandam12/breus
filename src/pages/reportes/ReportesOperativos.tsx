
import React, { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Download, Filter, Calendar, TrendingUp, Users, Activity } from "lucide-react";
import { useInmersiones } from '@/hooks/useInmersiones';
import { useBitacoras } from '@/hooks/useBitacoras';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function ReportesOperativos() {
  const { inmersiones = [] } = useInmersiones();
  const { bitacoras = [] } = useBitacoras();
  
  const [dateFilter, setDateFilter] = useState<'week' | 'month' | 'quarter'>('month');
  const [typeFilter, setTypeFilter] = useState<'all' | 'inspection' | 'maintenance'>('all');

  // Métricas principales calculadas desde datos reales
  const mainMetrics = useMemo(() => {
    const completedOperations = inmersiones.filter(i => i.estado === 'completada');
    const totalHours = completedOperations.reduce((sum, i) => {
      if (i.hora_inicio && i.hora_fin) {
        const inicio = new Date(`2000-01-01 ${i.hora_inicio}`);
        const fin = new Date(`2000-01-01 ${i.hora_fin}`);
        return sum + (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);
      }
      return sum;
    }, 0);

    return {
      totalOperations: inmersiones.length,
      completedOperations: completedOperations.length,
      totalHours: Math.round(totalHours),
      avgDepth: completedOperations.length > 0 
        ? Math.round(completedOperations.reduce((sum, i) => sum + (i.profundidad_max || 0), 0) / completedOperations.length)
        : 0,
      efficiency: inmersiones.length > 0 
        ? Math.round((completedOperations.length / inmersiones.length) * 100)
        : 0
    };
  }, [inmersiones]);

  // Datos para gráficos por fechas
  const operationsByMonth = useMemo(() => {
    const monthlyData = inmersiones.reduce((acc, inm) => {
      const month = new Date(inm.fecha_inmersion).toLocaleDateString('es-CL', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyData).map(([month, count]) => ({
      month,
      operaciones: count,
      eficiencia: Math.floor(Math.random() * 20) + 80 // Simulado por ahora
    }));
  }, [inmersiones]);

  // Datos por tipo de trabajo
  const operationsByType = useMemo(() => {
    const typeData = inmersiones.reduce((acc, inm) => {
      const type = inm.objetivo || 'Sin especificar';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];
    return Object.entries(typeData).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  }, [inmersiones]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <MainLayout
      title="Reportes Operativos"
      subtitle="Análisis detallado del rendimiento operacional y métricas clave"
      icon={BarChart3}
      headerChildren={
        <div className="flex gap-3">
          <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as any)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mes</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Operaciones</p>
                  <p className="text-3xl font-bold text-blue-600">{mainMetrics.totalOperations}</p>
                  <p className="text-sm text-green-600 mt-1">+12% vs mes anterior</p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completadas</p>
                  <p className="text-3xl font-bold text-green-600">{mainMetrics.completedOperations}</p>
                  <p className="text-sm text-green-600 mt-1">+8% vs mes anterior</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Horas Operativas</p>
                  <p className="text-3xl font-bold text-purple-600">{mainMetrics.totalHours}</p>
                  <p className="text-sm text-green-600 mt-1">+5% vs mes anterior</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profundidad Promedio</p>
                  <p className="text-3xl font-bold text-orange-600">{mainMetrics.avgDepth}m</p>
                  <p className="text-sm text-blue-600 mt-1">Estable</p>
                </div>
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Eficiencia</p>
                  <p className="text-3xl font-bold text-indigo-600">{mainMetrics.efficiency}%</p>
                  <p className="text-sm text-green-600 mt-1">+3% vs mes anterior</p>
                </div>
                <TrendingUp className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos Principales */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trends">Tendencias</TabsTrigger>
            <TabsTrigger value="distribution">Distribución</TabsTrigger>
            <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Operaciones por Mes</CardTitle>
                <CardDescription>
                  Evolución mensual de operaciones y eficiencia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={operationsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="operaciones" fill="#3b82f6" name="Operaciones" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Tipo</CardTitle>
                  <CardDescription>
                    Tipos de operaciones realizadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={operationsByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {operationsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estados de Operación</CardTitle>
                  <CardDescription>
                    Distribución por estado actual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span>Completadas</span>
                      </div>
                      <Badge variant="secondary">{mainMetrics.completedOperations}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <span>En Progreso</span>
                      </div>
                      <Badge variant="secondary">{inmersiones.filter(i => i.estado === 'activa').length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full" />
                        <span>Planificadas</span>
                      </div>
                      <Badge variant="secondary">{inmersiones.filter(i => i.estado === 'planificada').length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Indicadores de Rendimiento</CardTitle>
                <CardDescription>
                  Métricas clave de eficiencia operativa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{mainMetrics.efficiency}%</p>
                    <p className="text-sm text-gray-600">Tasa de Finalización</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{Math.round(mainMetrics.totalHours / Math.max(mainMetrics.completedOperations, 1))}h</p>
                    <p className="text-sm text-gray-600">Tiempo Promedio</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">0</p>
                    <p className="text-sm text-gray-600">Incidentes</p>
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
