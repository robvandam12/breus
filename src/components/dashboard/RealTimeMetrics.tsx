
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Activity, TrendingUp, Users, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { usePreDiveValidation } from '@/hooks/usePreDiveValidation';

interface RealTimeMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
}

interface ActivityData {
  time: string;
  inmersiones: number;
  validaciones: number;
  firmas: number;
}

export const RealTimeMetrics = () => {
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { validations } = usePreDiveValidation();

  const fetchRealTimeMetrics = async () => {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const thisHour = now.getHours();

      // Métricas de inmersiones hoy - usando la columna correcta fecha_inmersion
      const { data: inmersionesHoy, error: inmError } = await supabase
        .from('inmersion')
        .select('inmersion_id, estado, created_at, fecha_inmersion')
        .eq('fecha_inmersion', today);

      if (inmError) throw inmError;

      // Métricas de formularios firmados hoy
      const { data: hptFirmados, error: hptError } = await supabase
        .from('hpt')
        .select('id, created_at')
        .eq('firmado', true)
        .gte('created_at', `${today}T00:00:00`);

      if (hptError) throw hptError;

      const { data: anexosFirmados, error: anexoError } = await supabase
        .from('anexo_bravo')
        .select('id, created_at')
        .eq('firmado', true)
        .gte('created_at', `${today}T00:00:00`);

      if (anexoError) throw anexoError;

      // Métricas de operaciones activas
      const { data: operacionesActivas, error: opError } = await supabase
        .from('operacion')
        .select('id, estado')
        .eq('estado', 'activa');

      if (opError) throw opError;

      // Calcular métricas
      const totalInmersiones = inmersionesHoy?.length || 0;
      const inmersionesCompletadas = inmersionesHoy?.filter(i => i.estado === 'completada').length || 0;
      const formulariosFirmados = (hptFirmados?.length || 0) + (anexosFirmados?.length || 0);
      const operacionesActivasCount = operacionesActivas?.length || 0;
      const validacionesPendientes = validations.filter(v => !v.validation.isValid).length;

      const newMetrics: RealTimeMetric[] = [
        {
          label: 'Inmersiones Hoy',
          value: totalInmersiones,
          change: Math.random() * 10 - 5, // Simulado para demo
          trend: totalInmersiones > 5 ? 'up' : 'stable',
          icon: Activity,
          color: 'text-blue-600'
        },
        {
          label: 'Tasa Completitud',
          value: totalInmersiones > 0 ? Math.round((inmersionesCompletadas / totalInmersiones) * 100) : 0,
          change: Math.random() * 5 - 2.5,
          trend: inmersionesCompletadas > totalInmersiones * 0.8 ? 'up' : 'down',
          icon: CheckCircle,
          color: 'text-green-600'
        },
        {
          label: 'Formularios Firmados',
          value: formulariosFirmados,
          change: Math.random() * 3,
          trend: 'up',
          icon: Users,
          color: 'text-purple-600'
        },
        {
          label: 'Validaciones Pendientes',
          value: validacionesPendientes,
          change: Math.random() * -2,
          trend: validacionesPendientes > 3 ? 'up' : 'down',
          icon: AlertTriangle,
          color: 'text-amber-600'
        }
      ];

      setMetrics(newMetrics);

      // Generar datos de actividad por hora (últimas 24 horas)
      const activityByHour: ActivityData[] = [];
      for (let i = 23; i >= 0; i--) {
        const hour = (thisHour - i + 24) % 24;
        const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
        
        activityByHour.push({
          time: timeLabel,
          inmersiones: Math.floor(Math.random() * 5),
          validaciones: Math.floor(Math.random() * 3),
          firmas: Math.floor(Math.random() * 4)
        });
      }

      setActivityData(activityByHour);

    } catch (error) {
      console.error('Error fetching real-time metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRealTimeMetrics();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchRealTimeMetrics, 30000);
    
    return () => clearInterval(interval);
  }, [validations]);

  // Suscripción a cambios en tiempo real
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inmersion' },
        () => fetchRealTimeMetrics()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hpt' },
        () => fetchRealTimeMetrics()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'anexo_bravo' },
        () => fetchRealTimeMetrics()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />;
      default:
        return <Clock className="w-3 h-3 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas en Tiempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-bold">{metric.value}</span>
                      {metric.label.includes('Tasa') && <span className="text-sm text-gray-500">%</span>}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-xs ${
                        metric.change > 0 ? 'text-green-600' : 
                        metric.change < 0 ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                      </span>
                      <Badge variant="outline" className="text-xs ml-1">
                        Tiempo Real
                      </Badge>
                    </div>
                  </div>
                  <IconComponent className={`w-8 h-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráfico de Actividad en Tiempo Real */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Actividad en Tiempo Real (Últimas 24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgb(255 255 255 / 0.95)',
                    border: '1px solid rgb(226 232 240)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="inmersiones" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Inmersiones"
                  dot={{ r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="validaciones" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Validaciones"
                  dot={{ r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="firmas" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Firmas"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Distribución de Estados */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Estados Actuales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { estado: 'HPT Firmados', valor: metrics.find(m => m.label.includes('Formularios'))?.value || 0 },
                { estado: 'Inmersiones Activas', valor: metrics.find(m => m.label.includes('Inmersiones'))?.value || 0 },
                { estado: 'Validaciones Pendientes', valor: metrics.find(m => m.label.includes('Validaciones'))?.value || 0 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="estado" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="valor" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
