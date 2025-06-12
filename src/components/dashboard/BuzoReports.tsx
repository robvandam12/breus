
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Anchor, Clock, CheckCircle2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBitacoras } from '@/hooks/useBitacoras';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useOperaciones } from '@/hooks/useOperaciones';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const BuzoReports = () => {
  const { profile } = useAuth();
  const { bitacorasBuzo } = useBitacoras();
  const { inmersiones } = useInmersiones();
  const { operaciones } = useOperaciones();
  const [timeFilter, setTimeFilter] = useState('6m');

  const nombreBuzo = `${profile?.nombre} ${profile?.apellido}`;

  // Filtrar datos específicos del buzo
  const buzoBitacoras = useMemo(() => 
    bitacorasBuzo.filter(b => b.buzo === nombreBuzo),
    [bitacorasBuzo, nombreBuzo]
  );

  const buzoInmersiones = useMemo(() => 
    inmersiones.filter(i => 
      i.buzo_principal === nombreBuzo || 
      i.buzo_asistente === nombreBuzo
    ),
    [inmersiones, nombreBuzo]
  );

  // Datos para gráficos de línea (inmersiones por mes)
  const inmersionesPorMes = useMemo(() => {
    const meses = {};
    const mesesNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    buzoInmersiones.forEach(inmersion => {
      const fecha = new Date(inmersion.fecha_inmersion);
      const mesKey = `${fecha.getFullYear()}-${fecha.getMonth()}`;
      const mesLabel = `${mesesNames[fecha.getMonth()]} ${fecha.getFullYear()}`;
      
      if (!meses[mesKey]) {
        meses[mesKey] = { mes: mesLabel, inmersiones: 0, bitacoras: 0 };
      }
      meses[mesKey].inmersiones++;
    });

    buzoBitacoras.forEach(bitacora => {
      const fecha = new Date(bitacora.fecha);
      const mesKey = `${fecha.getFullYear()}-${fecha.getMonth()}`;
      const mesLabel = `${mesesNames[fecha.getMonth()]} ${fecha.getFullYear()}`;
      
      if (!meses[mesKey]) {
        meses[mesKey] = { mes: mesLabel, inmersiones: 0, bitacoras: 0 };
      }
      meses[mesKey].bitacoras++;
    });

    return Object.values(meses).slice(-6);
  }, [buzoInmersiones, buzoBitacoras]);

  // Datos para gráfico de profundidades
  const profundidadesData = useMemo(() => {
    const rangos = {
      '0-10m': 0,
      '10-20m': 0,
      '20-30m': 0,
      '30m+': 0
    };

    buzoBitacoras.forEach(bitacora => {
      const prof = Number(bitacora.profundidad_maxima) || 0;
      if (prof <= 10) rangos['0-10m']++;
      else if (prof <= 20) rangos['10-20m']++;
      else if (prof <= 30) rangos['20-30m']++;
      else rangos['30m+']++;
    });

    return Object.entries(rangos).map(([rango, cantidad]) => ({
      rango,
      cantidad
    }));
  }, [buzoBitacoras]);

  // Estadísticas generales
  const stats = useMemo(() => {
    const totalInmersiones = buzoInmersiones.length;
    const bitacorasCompletadas = buzoBitacoras.filter(b => b.firmado).length;
    const bitacorasPendientes = buzoBitacoras.filter(b => !b.firmado).length;
    
    const profundidadPromedio = buzoBitacoras.length > 0 
      ? buzoBitacoras.reduce((sum, b) => sum + (Number(b.profundidad_maxima) || 0), 0) / buzoBitacoras.length
      : 0;

    return {
      totalInmersiones,
      bitacorasCompletadas,
      bitacorasPendientes,
      profundidadPromedio: Math.round(profundidadPromedio * 10) / 10
    };
  }, [buzoInmersiones, buzoBitacoras]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reportes de Actividad</h2>
          <p className="text-gray-600">Análisis de tu desempeño y actividad como buzo</p>
        </div>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3m">Últimos 3 meses</SelectItem>
            <SelectItem value="6m">Últimos 6 meses</SelectItem>
            <SelectItem value="1y">Último año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inmersiones</CardTitle>
            <Anchor className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInmersiones}</div>
            <p className="text-xs text-muted-foreground">
              Inmersiones realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bitácoras Completadas</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.bitacorasCompletadas}</div>
            <p className="text-xs text-muted-foreground">
              Documentación completa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.bitacorasPendientes}</div>
            <p className="text-xs text-muted-foreground">
              Por completar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prof. Promedio</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profundidadPromedio}m</div>
            <p className="text-xs text-muted-foreground">
              Profundidad promedio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendencia de actividad */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={inmersionesPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="inmersiones" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Inmersiones"
                />
                <Line 
                  type="monotone" 
                  dataKey="bitacoras" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Bitácoras"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución de profundidades */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Profundidad</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profundidadesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rango" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bitácoras recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Bitácoras Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {buzoBitacoras.slice(0, 5).map((bitacora) => (
              <div key={bitacora.bitacora_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{bitacora.codigo}</h4>
                    <Badge variant={bitacora.firmado ? "default" : "secondary"}>
                      {bitacora.firmado ? "Firmada" : "Pendiente"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(bitacora.fecha).toLocaleDateString()} - 
                    Profundidad: {bitacora.profundidad_maxima}m
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{bitacora.trabajos_realizados}</p>
                </div>
              </div>
            ))}
            {buzoBitacoras.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No hay bitácoras registradas</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
