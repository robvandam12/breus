
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Download, TrendingUp, Anchor, Clock, Award } from 'lucide-react';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useBitacoras } from '@/hooks/useBitacoras';
import { useAuth } from '@/hooks/useAuth';
import { useState, useMemo } from 'react';

export const BuzoReports = () => {
  const { profile } = useAuth();
  const { inmersiones } = useInmersiones();
  const { bitacorasBuzo } = useBitacoras();
  const [selectedPeriod, setSelectedPeriod] = useState('ultimo_mes');

  // Filtrar datos del buzo
  const buzoInmersiones = inmersiones.filter(inm => 
    inm.buzo_principal === `${profile?.nombre} ${profile?.apellido}` ||
    inm.buzo_asistente === `${profile?.nombre} ${profile?.apellido}`
  );

  const buzoBitacoras = bitacorasBuzo.filter(b => 
    b.buzo === `${profile?.nombre} ${profile?.apellido}`
  );

  // Filtrar por período
  const getFilteredData = (data: any[], dateField: string) => {
    const now = new Date();
    const filterDate = new Date();
    
    switch (selectedPeriod) {
      case 'ultima_semana':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'ultimo_mes':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'ultimos_3_meses':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case 'ultimo_ano':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return data;
    }
    
    return data.filter(item => new Date(item[dateField]) >= filterDate);
  };

  const filteredInmersiones = getFilteredData(buzoInmersiones, 'fecha_inmersion');
  const filteredBitacoras = getFilteredData(buzoBitacoras, 'fecha');

  // Datos para gráficos
  const inmersionesPorMes = useMemo(() => {
    const monthlyData: { [key: string]: number } = {};
    
    filteredInmersiones.forEach(inm => {
      const month = new Date(inm.fecha_inmersion).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'short' 
      });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });
    
    return Object.entries(monthlyData).map(([month, count]) => ({
      month,
      inmersiones: count
    }));
  }, [filteredInmersiones]);

  const profundidadesPorMes = useMemo(() => {
    const monthlyDepths: { [key: string]: { total: number; count: number } } = {};
    
    filteredInmersiones.forEach(inm => {
      const month = new Date(inm.fecha_inmersion).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'short' 
      });
      if (!monthlyDepths[month]) {
        monthlyDepths[month] = { total: 0, count: 0 };
      }
      monthlyDepths[month].total += inm.profundidad_max || 0;
      monthlyDepths[month].count += 1;
    });
    
    return Object.entries(monthlyDepths).map(([month, data]) => ({
      month,
      profundidad: Math.round(data.total / data.count) || 0
    }));
  }, [filteredInmersiones]);

  const estadosBitacoras = useMemo(() => {
    const estados = filteredBitacoras.reduce((acc: { [key: string]: number }, bitacora) => {
      const estado = bitacora.firmado ? 'Firmadas' : 'Pendientes';
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(estados).map(([name, value]) => ({ name, value }));
  }, [filteredBitacoras]);

  // Colores para el gráfico de pie
  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Estadísticas clave
  const stats = {
    totalInmersiones: filteredInmersiones.length,
    profundidadMaxima: Math.max(...filteredInmersiones.map(inm => inm.profundidad_max || 0), 0),
    bitacorasCompletadas: filteredBitacoras.filter(b => b.firmado).length,
    bitacorasPendientes: filteredBitacoras.filter(b => !b.firmado).length,
    tiempoTotal: filteredInmersiones.reduce((acc, inm) => {
      if (inm.hora_inicio && inm.hora_fin) {
        const inicio = new Date(`2000-01-01T${inm.hora_inicio}`);
        const fin = new Date(`2000-01-01T${inm.hora_fin}`);
        return acc + (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60); // horas
      }
      return acc;
    }, 0)
  };

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reportes de Actividad</h2>
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ultima_semana">Última semana</SelectItem>
              <SelectItem value="ultimo_mes">Último mes</SelectItem>
              <SelectItem value="ultimos_3_meses">Últimos 3 meses</SelectItem>
              <SelectItem value="ultimo_ano">Último año</SelectItem>
              <SelectItem value="todo">Todo el período</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inmersiones</CardTitle>
            <Anchor className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalInmersiones}</div>
            <p className="text-xs text-muted-foreground">Total realizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profundidad Máx.</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.profundidadMaxima}m</div>
            <p className="text-xs text-muted-foreground">Récord personal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">{Math.round(stats.tiempoTotal)}h</div>
            <p className="text-xs text-muted-foreground">Horas sumergido</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bitácoras</CardTitle>
            <Award className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.bitacorasCompletadas}</div>
            <p className="text-xs text-muted-foreground">Completadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.bitacorasPendientes}</div>
            <p className="text-xs text-muted-foreground">Por completar</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inmersiones por mes */}
        <Card>
          <CardHeader>
            <CardTitle>Inmersiones por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inmersionesPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="inmersiones" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Profundidad promedio por mes */}
        <Card>
          <CardHeader>
            <CardTitle>Profundidad Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={profundidadesPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="profundidad" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Estado de Bitácoras */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Bitácoras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={estadosBitacoras}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {estadosBitacoras.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
