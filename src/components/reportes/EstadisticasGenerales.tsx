
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, FileText, Waves, Users, MapPin } from "lucide-react";

interface StatsData {
  total_operaciones: number;
  total_inmersiones: number;
  total_formularios: number;
  total_sitios_activos: number;
  operaciones_variacion: number;
  inmersiones_variacion: number;
  formularios_variacion: number;
  tiempo_promedio_inmersion: number;
}

interface EstadisticasGeneralesProps {
  data?: StatsData;
}

export const EstadisticasGenerales = ({ data }: EstadisticasGeneralesProps) => {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getTrendIcon = (variation: number) => {
    if (variation > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (variation < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (variation: number) => {
    if (variation > 0) return "text-green-600";
    if (variation < 0) return "text-red-600";
    return "text-gray-600";
  };

  const formatVariation = (variation: number) => {
    const sign = variation > 0 ? '+' : '';
    return `${sign}${variation.toFixed(1)}%`;
  };

  const stats = [
    {
      title: "Total Operaciones",
      value: data.total_operaciones,
      variation: data.operaciones_variacion,
      icon: FileText,
      color: "blue"
    },
    {
      title: "Total Inmersiones",
      value: data.total_inmersiones,
      variation: data.inmersiones_variacion,
      icon: Waves,
      color: "cyan"
    },
    {
      title: "Formularios Completados",
      value: data.total_formularios,
      variation: data.formularios_variacion,
      icon: FileText,
      color: "green"
    },
    {
      title: "Sitios Activos",
      value: data.total_sitios_activos,
      variation: 0, // Los sitios no suelen variar mucho
      icon: MapPin,
      color: "purple"
    }
  ];

  return (
    <div className="space-y-6 mb-6">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                  {stat.variation !== 0 && (
                    <div className={`flex items-center gap-1 text-sm ${getTrendColor(stat.variation)}`}>
                      {getTrendIcon(stat.variation)}
                      <span>{formatVariation(stat.variation)}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                  <div className="text-sm text-zinc-500">{stat.title}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Métricas Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tiempo Promedio de Inmersión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Math.round(data.tiempo_promedio_inmersion)} min
            </div>
            <div className="text-sm text-zinc-500">
              Tiempo promedio por inmersión en el período seleccionado
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Eficiencia Operacional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {Math.round((data.total_formularios / Math.max(data.total_operaciones, 1)) * 100)}%
            </div>
            <div className="text-sm text-zinc-500">
              Porcentaje de operaciones con formularios completos
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
