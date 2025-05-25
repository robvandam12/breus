
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Activity } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useAlertas } from "@/hooks/useAlertas";

export const StatsChart = () => {
  const { stats } = useDashboardData();
  const { alertasPorPrioridad } = useAlertas();

  // Datos para el gráfico de barras
  const barData = [
    {
      name: 'Bitácoras',
      total: stats.totalBitacoras,
      firmadas: stats.bitacorasFirmadas,
      pendientes: stats.totalBitacoras - stats.bitacorasFirmadas
    },
    {
      name: 'Inmersiones',
      total: stats.inmersionesHoy,
      completadas: Math.floor(stats.inmersionesHoy * 0.8),
      pendientes: Math.ceil(stats.inmersionesHoy * 0.2)
    },
    {
      name: 'Operaciones',
      total: stats.operacionesActivas,
      activas: stats.operacionesActivas,
      pendientes: 0
    }
  ];

  // Datos para el gráfico circular de alertas
  const pieData = [
    { name: 'Alta', value: alertasPorPrioridad.alta.length, color: '#ef4444' },
    { name: 'Media', value: alertasPorPrioridad.media.length, color: '#f59e0b' },
    { name: 'Baja', value: alertasPorPrioridad.baja.length, color: '#10b981' }
  ].filter(item => item.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Barras - Estado de Actividades */}
      <Card className="ios-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Estado de Actividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgb(255 255 255 / 0.95)',
                    border: '1px solid rgb(226 232 240)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="completadas" 
                  stackId="a" 
                  fill="#10b981" 
                  name="Completadas"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="activas" 
                  stackId="a" 
                  fill="#3b82f6" 
                  name="Activas"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="pendientes" 
                  stackId="a" 
                  fill="#f59e0b" 
                  name="Pendientes"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico Circular - Distribución de Alertas */}
      <Card className="ios-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            Distribución de Alertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgb(255 255 255 / 0.95)',
                      border: '1px solid rgb(226 232 240)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto text-green-500 mb-4" />
                <p className="text-zinc-600 dark:text-zinc-400">
                  No hay alertas activas
                </p>
                <p className="text-sm text-zinc-500 mt-2">
                  El sistema está funcionando correctamente
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
