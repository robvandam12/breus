
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
      name: "Alta",
      value: alertasPorPrioridad?.alta || 0,
      fill: "#dc2626"
    },
    {
      id: "media-prioridad",
      name: "Media", 
      value: alertasPorPrioridad?.media || 0,
      fill: "#ea580c"
    },
    {
      id: "baja-prioridad",
      name: "Baja",
      value: alertasPorPrioridad?.baja || 0,
      fill: "#16a34a"
    }
  ], [alertasPorPrioridad]);

  return (
    <Card className="ios-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          Alertas por Prioridad
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              key="stats-chart"
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                className="text-xs"
                tick={{ fontSize: 10 }}
                interval={0}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 10 }}
                width={25}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="value" 
                radius={[2, 2, 0, 0]}
                fill="#3b82f6"
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
