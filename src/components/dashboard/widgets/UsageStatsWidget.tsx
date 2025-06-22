
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Users, Activity } from 'lucide-react';

interface UsageData {
  date: string;
  operations: number;
  users: number;
  immersions: number;
}

const UsageStatsWidget = () => {
  const { data: usageData, isLoading } = useQuery({
    queryKey: ['usage-stats'],
    queryFn: async (): Promise<UsageData[]> => {
      // Obtener datos de los últimos 7 días
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const usageData = await Promise.all(
        dates.map(async (date) => {
          const [operationsResult, usersResult, immersionsResult] = await Promise.all([
            supabase
              .from('operacion')
              .select('id', { count: 'exact' })
              .gte('created_at', `${date}T00:00:00`)
              .lt('created_at', `${date}T23:59:59`),
            supabase
              .from('usuario_actividad')
              .select('usuario_id', { count: 'exact' })
              .gte('created_at', `${date}T00:00:00`)
              .lt('created_at', `${date}T23:59:59`),
            supabase
              .from('inmersion')
              .select('inmersion_id', { count: 'exact' })
              .gte('created_at', `${date}T00:00:00`)
              .lt('created_at', `${date}T23:59:59`)
          ]);

          return {
            date: new Date(date).toLocaleDateString('es-ES', { 
              month: 'short', 
              day: 'numeric' 
            }),
            operations: operationsResult.count || 0,
            users: usersResult.count || 0,
            immersions: immersionsResult.count || 0
          };
        })
      );

      return usageData;
    },
    refetchInterval: 300000, // Actualizar cada 5 minutos
  });

  if (isLoading || !usageData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Cargando estadísticas...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-gray-100 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const totalOperations = usageData.reduce((sum, day) => sum + day.operations, 0);
  const totalUsers = usageData.reduce((sum, day) => sum + day.users, 0);
  const totalImmersions = usageData.reduce((sum, day) => sum + day.immersions, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-500" />
        <CardTitle className="text-sm font-medium">Estadísticas de Uso (Últimos 7 días)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Activity className="w-4 h-4 text-purple-500" />
              <span className="text-lg font-bold text-purple-600">{totalOperations}</span>
            </div>
            <p className="text-xs text-gray-500">Operaciones</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-4 h-4 text-green-500" />
              <span className="text-lg font-bold text-green-600">{totalUsers}</span>
            </div>
            <p className="text-xs text-gray-500">Actividad Usuarios</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-lg font-bold text-blue-600">{totalImmersions}</span>
            </div>
            <p className="text-xs text-gray-500">Inmersiones</p>
          </div>
        </div>
        
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usageData}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="operations" fill="#8884d8" radius={2} />
              <Bar dataKey="immersions" fill="#82ca9d" radius={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageStatsWidget;
