
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react";

const mockData = [
  { name: 'Ene', inmersiones: 12, bitacoras: 10 },
  { name: 'Feb', inmersiones: 19, bitacoras: 18 },
  { name: 'Mar', inmersiones: 15, bitacoras: 14 },
  { name: 'Abr', inmersiones: 22, bitacoras: 20 },
  { name: 'May', inmersiones: 18, bitacoras: 17 },
  { name: 'Jun', inmersiones: 25, bitacoras: 24 },
];

export const DashboardChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Actividad de Inmersiones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="inmersiones" fill="#3b82f6" name="Inmersiones" />
            <Bar dataKey="bitacoras" fill="#10b981" name="Bitácoras" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
