
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Anchor, Clock, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useBitacoraEnhanced } from '@/hooks/useBitacoraEnhanced';
import { useOperaciones } from '@/hooks/useOperaciones';

interface MonthlyData {
  mes: string;
  inmersiones: number;
  bitacoras: number;
  profundidadPromedio: number;
}

interface EstadoData {
  name: string;
  value: number;
  color: string;
}

export const BuzoReports = () => {
  const { profile } = useAuth();
  const { inmersiones } = useInmersiones();
  const { bitacorasBuzo } = useBitacoraEnhanced();
  const { operaciones } = useOperaciones();
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [estadoData, setEstadoData] = useState<EstadoData[]>([]);
  const [stats, setStats] = useState({
    totalInmersiones: 0,
    totalBitacoras: 0,
    totalOperaciones: 0,
    profundidadMaxima: 0,
    horasAcumuladas: 0,
    promedioProfundidad: 0
  });

  useEffect(() => {
    if (!profile) return;

    const buzoName = `${profile.nombre} ${profile.apellido}`;
    
    // Filtrar datos del buzo
    const buzoInmersiones = inmersiones.filter(i => 
      i.buzo_principal === buzoName || i.buzo_asistente === buzoName
    );
    
    const buzoBitacoras = bitacorasBuzo.filter(b => b.buzo === buzoName);
    
    const buzoOperaciones = operaciones.filter(op => 
      buzoInmersiones.some(inm => inm.operacion_id === op.id)
    );

    // Filtrar por año
    const inmersionesYear = buzoInmersiones.filter(i => 
      new Date(i.fecha_inmersion).getFullYear() === parseInt(year)
    );

    // Calcular estadísticas generales
    const totalInmersiones = inmersionesYear.length;
    const totalBitacoras = buzoBitacoras.filter(b => 
      new Date(b.fecha).getFullYear() === parseInt(year)
    ).length;
    const profundidadMaxima = Math.max(...inmersionesYear.map(i => i.profundidad_max), 0);
    const promedioProfundidad = inmersionesYear.length > 0 
      ? inmersionesYear.reduce((acc, i) => acc + i.profundidad_max, 0) / inmersionesYear.length 
      : 0;

    // Calcular horas acumuladas (estimado: 4 horas por inmersión)
    const horasAcumuladas = totalInmersiones * 4;

    setStats({
      totalInmersiones,
      totalBitacoras,
      totalOperaciones: buzoOperaciones.length,
      profundidadMaxima,
      horasAcumuladas,
      promedioProfundidad: Math.round(promedioProfundidad * 10) / 10
    });

    // Datos mensuales
    const meses = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];

    const monthlyStats: MonthlyData[] = meses.map((mes, index) => {
      const inmersionesMes = inmersionesYear.filter(i => 
        new Date(i.fecha_inmersion).getMonth() === index
      );
      const bitacorasMes = buzoBitacoras.filter(b => 
        new Date(b.fecha).getMonth() === index && 
        new Date(b.fecha).getFullYear() === parseInt(year)
      );
      const profundidadPromedio = inmersionesMes.length > 0
        ? inmersionesMes.reduce((acc, i) => acc + i.profundidad_max, 0) / inmersionesMes.length
        : 0;

      return {
        mes,
        inmersiones: inmersionesMes.length,
        bitacoras: bitacorasMes.length,
        profundidadPromedio: Math.round(profundidadPromedio * 10) / 10
      };
    });

    setMonthlyData(monthlyStats);

    // Datos de estado de inmersiones
    const estados = inmersionesYear.reduce((acc, inmersion) => {
      acc[inmersion.estado] = (acc[inmersion.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colores = {
      'completada': '#10B981',
      'en_curso': '#3B82F6',
      'planificada': '#F59E0B',
      'cancelada': '#EF4444'
    };

    const estadoStats: EstadoData[] = Object.entries(estados).map(([estado, cantidad]) => ({
      name: estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' '),
      value: cantidad,
      color: colores[estado as keyof typeof colores] || '#6B7280'
    }));

    setEstadoData(estadoStats);

  }, [profile, inmersiones, bitacorasBuzo, operaciones, year]);

  const exportData = () => {
    // Aquí se podría implementar la exportación a PDF/Excel
    console.log('Exportando datos...');
  };

  const years = Array.from({ length: 5 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return { value: y.toString(), label: y.toString() };
  });

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Mis Reportes de Buceo
            </CardTitle>
            <div className="flex items-center gap-3">
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(y => (
                    <SelectItem key={y.value} value={y.value}>
                      {y.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalInmersiones}</div>
              <div className="text-xs text-gray-500">Inmersiones</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalBitacoras}</div>
              <div className="text-xs text-gray-500">Bitácoras</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalOperaciones}</div>
              <div className="text-xs text-gray-500">Operaciones</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.profundidadMaxima}m</div>
              <div className="text-xs text-gray-500">Prof. Máxima</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.horasAcumuladas}h</div>
              <div className="text-xs text-gray-500">Horas Buceo</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">{stats.promedioProfundidad}m</div>
              <div className="text-xs text-gray-500">Prof. Promedio</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad Mensual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Actividad Mensual {year}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="inmersiones" fill="#3B82F6" name="Inmersiones" />
                <Bar dataKey="bitacoras" fill="#10B981" name="Bitácoras" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Estados de Inmersiones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Anchor className="w-5 h-5" />
              Estados de Inmersiones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={estadoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {estadoData.map((entry, index) => (
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
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Profundidad Promedio por Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}m`, 'Profundidad Promedio']} />
                <Line 
                  type="monotone" 
                  dataKey="profundidadPromedio" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Resumen Anual */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen Anual {year}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalInmersiones}</div>
              <div className="text-sm text-blue-800">Total de Inmersiones Realizadas</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.horasAcumuladas}</div>
              <div className="text-sm text-green-800">Horas de Buceo Estimadas</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.profundidadMaxima}m</div>
              <div className="text-sm text-orange-800">Profundidad Máxima Alcanzada</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalOperaciones}</div>
              <div className="text-sm text-purple-800">Operaciones Participadas</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
