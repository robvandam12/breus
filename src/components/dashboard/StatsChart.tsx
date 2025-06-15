
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";
import { useAlertas } from "@/hooks/useAlertas";
import { useMemo } from "react";

export const StatsChart = () => {
  const { alertasPorPrioridad } = useAlertas();

  // Transform alertasPorPrioridad object to array format for chart with unique keys
  const chartData = useMemo(() => [
    {
      id: "alta-prioridad",
      name: "Alta Prioridad",
      value: alertasPorPrioridad?.alta || 0,
      fill: "#dc2626"
    },
    {
      id: "media-prioridad",
      name: "Media Prioridad", 
      value: alertasPorPrioridad?.media || 0,
      fill: "#ea580c"
    },
    {
      id: "baja-prioridad",
      name: "Baja Prioridad",
      value: alertasPorPrioridad?.baja || 0,
      fill: "#16a34a"
    }
  ], [alertasPorPrioridad]);

  return (
    <Card className="ios-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Distribución de Alertas por Prioridad
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} key="stats-chart">
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
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
                fill="#3b82f6"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
