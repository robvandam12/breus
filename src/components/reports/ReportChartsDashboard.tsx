
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Anchor, 
  Shield, 
  Clock,
  Users,
  Activity
} from "lucide-react";

interface ReportChartsDashboardProps {
  filters: any;
}

export const ReportChartsDashboard = ({ filters }: ReportChartsDashboardProps) => {
  // Datos mock para los gráficos
  const operationalData = [
    { mes: 'Ene', inmersiones: 65, horas: 260, eficiencia: 87 },
    { mes: 'Feb', inmersiones: 78, horas: 312, eficiencia: 91 },
    { mes: 'Mar', inmersiones: 82, horas: 328, eficiencia: 89 },
    { mes: 'Abr', inmersiones: 94, horas: 376, eficiencia: 93 },
    { mes: 'May', inmersiones: 86, horas: 344, eficiencia: 88 },
    { mes: 'Jun', inmersiones: 72, horas: 288, eficiencia: 85 }
  ];

  const securityData = [
    { mes: 'Ene', alertas: 3, incidentes: 1, resueltos: 4 },
    { mes: 'Feb', alertas: 2, incidentes: 0, resueltos: 2 },
    { mes: 'Mar', alertas: 5, incidentes: 2, resueltos: 6 },
    { mes: 'Abr', alertas: 1, incidentes: 0, resueltos: 1 },
    { mes: 'May', alertas: 4, incidentes: 1, resueltos: 4 },
    { mes: 'Jun', alertas: 2, incidentes: 0, resueltos: 2 }
  ];

  const performanceData = [
    { sitio: 'Alpha', eficiencia: 94, inmersiones: 145 },
    { sitio: 'Beta', eficiencia: 87, inmersiones: 128 },
    { sitio: 'Gamma', eficiencia: 91, inmersiones: 156 },
    { sitio: 'Delta', eficiencia: 83, inmersiones: 98 }
  ];

  const workTypeData = [
    { name: 'Mantención', value: 45, color: '#3B82F6' },
    { name: 'Inspección', value: 32, color: '#10B981' },
    { name: 'Reparación', value: 18, color: '#F59E0B' },
    { name: 'Emergencia', value: 5, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inmersiones Totales</p>
                <p className="text-2xl font-bold">477</p>
                <p className="text-xs text-green-600">+12% vs mes anterior</p>
              </div>
              <Anchor className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Horas de Buceo</p>
                <p className="text-2xl font-bold">1,908</p>
                <p className="text-xs text-green-600">+8% vs mes anterior</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Eficiencia Promedio</p>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-xs text-red-600">-2% vs mes anterior</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alertas de Seguridad</p>
                <p className="text-2xl font-bold">17</p>
                <p className="text-xs text-green-600">-23% vs mes anterior</p>
              </div>
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales */}
      <Tabs defaultValue="operational" className="space-y-4">
        <TabsList>
          <TabsTrigger value="operational">Operacional</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="worktype">Tipos de Trabajo</TabsTrigger>
        </TabsList>

        <TabsContent value="operational" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inmersiones por Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={operationalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="inmersiones" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Eficiencia Operacional</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={operationalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="eficiencia" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas e Incidentes de Seguridad</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={securityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="alertas" fill="#F59E0B" name="Alertas" />
                  <Bar dataKey="incidentes" fill="#EF4444" name="Incidentes" />
                  <Bar dataKey="resueltos" fill="#10B981" name="Resueltos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Sitio</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sitio" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="eficiencia" fill="#3B82F6" name="Eficiencia %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="worktype" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Tipos de Trabajo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={workTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {workTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
