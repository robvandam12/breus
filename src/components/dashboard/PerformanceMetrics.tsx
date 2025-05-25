
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Clock, CheckCircle, Award } from "lucide-react";
import { usePerformanceMetrics } from "@/hooks/usePerformanceMetrics";

export const PerformanceMetrics = () => {
  const { metrics } = usePerformanceMetrics();

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return "text-green-600";
    if (value >= 70) return "text-amber-600";
    return "text-red-600";
  };

  const getPerformanceBadge = (value: number) => {
    if (value >= 90) return { variant: "default" as const, text: "Excelente" };
    if (value >= 70) return { variant: "secondary" as const, text: "Bueno" };
    return { variant: "destructive" as const, text: "Mejorar" };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Métricas Principales */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="ios-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-600">
                Eficiencia Operacional
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${getPerformanceColor(metrics.eficienciaOperacional)}`}>
                {metrics.eficienciaOperacional}%
              </div>
              <Badge {...getPerformanceBadge(metrics.eficienciaOperacional)} className="text-xs">
                {getPerformanceBadge(metrics.eficienciaOperacional).text}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="ios-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-600">
                Tiempo Promedio
              </CardTitle>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-zinc-900">
                {metrics.tiempoPromedioInmersion}
              </div>
              <span className="text-xs text-zinc-500">minutos/inmersión</span>
            </div>
          </CardContent>
        </Card>

        <Card className="ios-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-600">
                Tasa Completitud
              </CardTitle>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${getPerformanceColor(metrics.tasaCompletitud)}`}>
                {metrics.tasaCompletitud}%
              </div>
              <Badge {...getPerformanceBadge(metrics.tasaCompletitud)} className="text-xs">
                {getPerformanceBadge(metrics.tasaCompletitud).text}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="ios-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-600">
                Índice Calidad
              </CardTitle>
              <Award className="w-4 h-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${getPerformanceColor(metrics.indiceCalidad)}`}>
                {metrics.indiceCalidad}%
              </div>
              <Badge {...getPerformanceBadge(metrics.indiceCalidad)} className="text-xs">
                {getPerformanceBadge(metrics.indiceCalidad).text}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tendencia Semanal */}
      <Card className="ios-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Tendencia de Rendimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.tendenciaSemanal} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="periodo" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                />
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
                  dataKey="valor" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#1d4ed8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
