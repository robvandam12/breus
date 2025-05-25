
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface InmersionData {
  inmersiones_por_dia: Array<{
    fecha: string;
    cantidad: number;
    tiempo_total: number;
  }>;
  inmersiones_por_sitio: Array<{
    sitio: string;
    cantidad: number;
    tiempo_promedio: number;
  }>;
  tiempo_promedio_general: number;
}

interface InmersionesHeatmapProps {
  data?: InmersionData;
}

export const InmersionesHeatmap = ({ data }: InmersionesHeatmapProps) => {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Inmersiones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-zinc-500">
            No hay datos de inmersiones para el período seleccionado
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.inmersiones_por_dia.map(item => ({
    ...item,
    fecha_formateada: format(new Date(item.fecha), "dd/MM", { locale: es })
  }));

  return (
    <div className="space-y-6">
      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {data.inmersiones_por_dia.reduce((acc, item) => acc + item.cantidad, 0)}
            </div>
            <div className="text-sm text-zinc-500">Total Inmersiones</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(data.tiempo_promedio_general)} min
            </div>
            <div className="text-sm text-zinc-500">Tiempo Promedio</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {data.inmersiones_por_sitio.length}
            </div>
            <div className="text-sm text-zinc-500">Sitios Activos</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Línea - Inmersiones por Día */}
      <Card>
        <CardHeader>
          <CardTitle>Inmersiones por Día</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha_formateada" />
              <YAxis />
              <Tooltip 
                labelFormatter={(value, payload) => {
                  const item = payload?.[0]?.payload;
                  return item ? format(new Date(item.fecha), "dd 'de' MMMM", { locale: es }) : value;
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cantidad" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Inmersiones"
              />
              <Line 
                type="monotone" 
                dataKey="tiempo_total" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Tiempo Total (min)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Barras - Inmersiones por Sitio */}
      <Card>
        <CardHeader>
          <CardTitle>Inmersiones por Sitio</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.inmersiones_por_sitio}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sitio" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#3b82f6" name="Cantidad" />
              <Bar dataKey="tiempo_promedio" fill="#10b981" name="Tiempo Promedio (min)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabla de Detalles por Sitio */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle por Sitio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Sitio</th>
                  <th className="text-center py-2">Inmersiones</th>
                  <th className="text-center py-2">Tiempo Promedio</th>
                  <th className="text-center py-2">Eficiencia</th>
                </tr>
              </thead>
              <tbody>
                {data.inmersiones_por_sitio.map((sitio, index) => {
                  const eficiencia = sitio.tiempo_promedio <= data.tiempo_promedio_general ? 'Alta' : 'Media';
                  return (
                    <tr key={index} className="border-b">
                      <td className="py-2 font-medium">{sitio.sitio}</td>
                      <td className="py-2 text-center">{sitio.cantidad}</td>
                      <td className="py-2 text-center">{Math.round(sitio.tiempo_promedio)} min</td>
                      <td className="py-2 text-center">
                        <span className={`px-2 py-1 rounded text-sm ${
                          eficiencia === 'Alta' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {eficiencia}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
