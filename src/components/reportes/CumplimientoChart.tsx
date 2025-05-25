
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface CumplimientoData {
  formularios: Array<{
    tipo: string;
    completados: number;
    pendientes: number;
    total: number;
  }>;
  porcentaje_cumplimiento: number;
}

interface CumplimientoChartProps {
  data?: CumplimientoData;
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export const CumplimientoChart = ({ data }: CumplimientoChartProps) => {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cumplimiento de Formularios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-zinc-500">
            No hay datos disponibles para el período seleccionado
          </div>
        </CardContent>
      </Card>
    );
  }

  const pieData = data.formularios.map(item => ({
    name: item.tipo,
    value: item.completados,
    total: item.total
  }));

  const barData = data.formularios.map(item => ({
    tipo: item.tipo,
    Completados: item.completados,
    Pendientes: item.pendientes,
    porcentaje: Math.round((item.completados / item.total) * 100)
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Barras - Cumplimiento por Tipo */}
      <Card>
        <CardHeader>
          <CardTitle>Cumplimiento por Tipo de Formulario</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Completados" fill="#10b981" />
              <Bar dataKey="Pendientes" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico Circular - Distribución General */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución General de Cumplimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-green-600">
              {data.porcentaje_cumplimiento}%
            </div>
            <div className="text-sm text-zinc-500">Cumplimiento General</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabla de Detalles */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Detalle de Cumplimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Tipo de Formulario</th>
                  <th className="text-center py-2">Completados</th>
                  <th className="text-center py-2">Pendientes</th>
                  <th className="text-center py-2">Total</th>
                  <th className="text-center py-2">% Cumplimiento</th>
                </tr>
              </thead>
              <tbody>
                {data.formularios.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 font-medium">{item.tipo}</td>
                    <td className="py-2 text-center text-green-600">{item.completados}</td>
                    <td className="py-2 text-center text-amber-600">{item.pendientes}</td>
                    <td className="py-2 text-center">{item.total}</td>
                    <td className="py-2 text-center">
                      <span className={`px-2 py-1 rounded text-sm ${
                        (item.completados / item.total) * 100 >= 80 
                          ? 'bg-green-100 text-green-700'
                          : (item.completados / item.total) * 100 >= 60
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {Math.round((item.completados / item.total) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
