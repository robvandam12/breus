
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, Anchor, FileText, TrendingUp, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useBitacoras } from '@/hooks/useBitacoras';
import { useOperaciones } from '@/hooks/useOperaciones';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';

export const BuzoReports = () => {
  const { profile } = useAuth();
  const { inmersiones } = useInmersiones();
  const { bitacorasBuzo } = useBitacoras();
  const { operaciones } = useOperaciones();
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Filtrar datos del buzo específico
  const buzoName = `${profile?.nombre} ${profile?.apellido}`;
  const buzoInmersiones = inmersiones.filter(i => 
    i.buzo_principal === buzoName || i.buzo_asistente === buzoName
  );
  const buzoBitacoras = bitacorasBuzo.filter(b => b.buzo === buzoName);

  // Datos para gráficos
  const [chartData, setChartData] = useState({
    inmersionesPorMes: [],
    bitacorasPorEstado: [],
    profundidadPromedio: [],
    operacionesPorTipo: []
  });

  useEffect(() => {
    // Inmersiones por mes
    const inmersionesMes = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const count = buzoInmersiones.filter(inm => {
        const date = new Date(inm.fecha_inmersion);
        return date.getFullYear().toString() === selectedYear && date.getMonth() + 1 === month;
      }).length;
      
      return {
        mes: new Date(0, i).toLocaleDateString('es-ES', { month: 'short' }),
        inmersiones: count
      };
    });

    // Bitácoras por estado
    const bitacorasEstado = [
      { estado: 'Completadas', cantidad: buzoBitacoras.filter(b => b.firmado).length, color: '#10B981' },
      { estado: 'Pendientes', cantidad: buzoBitacoras.filter(b => !b.firmado).length, color: '#F59E0B' }
    ];

    // Profundidad promedio por mes
    const profundidadMes = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const inmersionesMes = buzoInmersiones.filter(inm => {
        const date = new Date(inm.fecha_inmersion);
        return date.getFullYear().toString() === selectedYear && date.getMonth() + 1 === month;
      });
      
      const promedio = inmersionesMes.length > 0 
        ? inmersionesMes.reduce((sum, inm) => sum + (inm.profundidad_max || 0), 0) / inmersionesMes.length
        : 0;
      
      return {
        mes: new Date(0, i).toLocaleDateString('es-ES', { month: 'short' }),
        profundidad: Math.round(promedio * 10) / 10
      };
    });

    setChartData({
      inmersionesPorMes: inmersionesMes,
      bitacorasPorEstado: bitacorasEstado,
      profundidadPromedio: profundidadMes,
      operacionesPorTipo: []
    });
  }, [buzoInmersiones, buzoBitacoras, selectedYear]);

  const estadisticas = {
    totalInmersiones: buzoInmersiones.length,
    bitacorasCompletadas: buzoBitacoras.filter(b => b.firmado).length,
    bitacorasPendientes: buzoBitacoras.filter(b => !b.firmado).length,
    profundidadMaxima: Math.max(...buzoInmersiones.map(i => i.profundidad_max || 0), 0),
    horasTotales: buzoInmersiones.reduce((total, inm) => {
      if (inm.hora_inicio && inm.hora_fin) {
        const inicio = new Date(`2000-01-01 ${inm.hora_inicio}`);
        const fin = new Date(`2000-01-01 ${inm.hora_fin}`);
        return total + (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);
      }
      return total;
    }, 0)
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Filtros de Reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="text-sm font-medium mb-2 block">Año</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Rango de Fechas</label>
              <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Anchor className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{estadisticas.totalInmersiones}</p>
                <p className="text-sm text-muted-foreground">Total Inmersiones</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{estadisticas.bitacorasCompletadas}</p>
                <p className="text-sm text-muted-foreground">Bitácoras Completadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-600">{estadisticas.bitacorasPendientes}</p>
                <p className="text-sm text-muted-foreground">Bitácoras Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-2xl font-bold">{estadisticas.profundidadMaxima}m</p>
              <p className="text-sm text-muted-foreground">Profundidad Máxima</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-2xl font-bold">{Math.round(estadisticas.horasTotales)}h</p>
              <p className="text-sm text-muted-foreground">Horas Totales</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inmersiones por Mes */}
        <Card>
          <CardHeader>
            <CardTitle>Inmersiones por Mes ({selectedYear})</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.inmersionesPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="inmersiones" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Estado de Bitácoras */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Bitácoras</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.bitacorasPorEstado}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ estado, cantidad }) => `${estado}: ${cantidad}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cantidad"
                >
                  {chartData.bitacorasPorEstado.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Profundidad Promedio */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profundidad Promedio por Mes ({selectedYear})</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.profundidadPromedio}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} m`, 'Profundidad']} />
                <Line 
                  type="monotone" 
                  dataKey="profundidad" 
                  stroke="#06B6D4" 
                  strokeWidth={2}
                  dot={{ fill: '#06B6D4' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Listado Reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {buzoInmersiones.slice(0, 10).map((inmersion) => (
              <div key={inmersion.inmersion_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{inmersion.codigo}</p>
                  <p className="text-sm text-gray-600">{inmersion.objetivo}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(inmersion.fecha_inmersion).toLocaleDateString()} - 
                    Profundidad: {inmersion.profundidad_max}m
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{inmersion.estado}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
