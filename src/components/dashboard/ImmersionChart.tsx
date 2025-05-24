
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from "lucide-react";

interface ImmersionData {
  date: string;
  inmersiones: number;
  completadas: number;
}

interface ImmersionChartProps {
  data: ImmersionData[];
}

export const ImmersionChart = ({ data }: ImmersionChartProps) => {
  return (
    <Card className="ios-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-cyan-600" />
          </div>
          <div>
            <CardTitle className="text-lg text-zinc-900">
              Inmersiones Diarias
            </CardTitle>
            <p className="text-sm text-zinc-500">Últimos 30 días</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#71717a' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#71717a' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e4e4e7',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="inmersiones" 
                stroke="#0891b2" 
                strokeWidth={2}
                dot={{ fill: '#0891b2', strokeWidth: 2, r: 4 }}
                name="Total Inmersiones"
              />
              <Line 
                type="monotone" 
                dataKey="completadas" 
                stroke="#059669" 
                strokeWidth={2}
                dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                name="Completadas"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
