
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Waves, Clock, Thermometer } from 'lucide-react';
import { useInmersiones, type Inmersion } from '@/hooks/useInmersiones';

export const BuzoReports = () => {
  const { inmersiones, isLoading } = useInmersiones();

  if (isLoading) {
    return <div>Cargando reportes...</div>;
  }

  // Filter immersions for current user (this would need proper user context)
  const myImmersions = inmersiones.filter(i => i.estado === 'completada');

  // Calculate statistics
  const totalImmersions = myImmersions.length;
  const totalDepth = myImmersions.reduce((sum, i) => sum + (i.profundidad_max || 0), 0);
  const avgDepth = totalImmersions > 0 ? totalDepth / totalImmersions : 0;

  // Depth distribution data
  const depthRanges = [
    { range: '0-10m', count: myImmersions.filter(i => (i.profundidad_max || 0) <= 10).length },
    { range: '10-20m', count: myImmersions.filter(i => (i.profundidad_max || 0) > 10 && (i.profundidad_max || 0) <= 20).length },
    { range: '20-30m', count: myImmersions.filter(i => (i.profundidad_max || 0) > 20 && (i.profundidad_max || 0) <= 30).length },
    { range: '30m+', count: myImmersions.filter(i => (i.profundidad_max || 0) > 30).length },
  ];

  // Recent immersions
  const recentImmersions = myImmersions
    .sort((a, b) => new Date(b.fecha_inmersion).getTime() - new Date(a.fecha_inmersion).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalImmersions}</p>
                <p className="text-xs text-muted-foreground">Total Inmersiones</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Waves className="h-8 w-8 text-cyan-600" />
              <div>
                <p className="text-2xl font-bold">{avgDepth.toFixed(1)}m</p>
                <p className="text-xs text-muted-foreground">Profundidad Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Thermometer className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{Math.max(...myImmersions.map(i => i.profundidad_max || 0)).toFixed(1)}m</p>
                <p className="text-xs text-muted-foreground">Máxima Profundidad</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {myImmersions.filter(i => 
                    new Date(i.fecha_inmersion).getMonth() === new Date().getMonth()
                  ).length}
                </p>
                <p className="text-xs text-muted-foreground">Este Mes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Depth Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución por Profundidad</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={depthRanges}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Immersions */}
      <Card>
        <CardHeader>
          <CardTitle>Inmersiones Recientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentImmersions.map((inmersion) => (
            <div key={inmersion.inmersion_id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">{inmersion.codigo}</h4>
                <p className="text-sm text-muted-foreground">{inmersion.objetivo}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}
                </p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-1">
                  {inmersion.profundidad_max}m
                </Badge>
                <p className="text-xs text-muted-foreground">{inmersion.supervisor}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
