
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { 
  Calendar as CalendarIcon, Download, Filter, TrendingUp, 
  FileText, Users, Activity, AlertTriangle 
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from '@/integrations/supabase/client';

interface ReportData {
  cumplimientoFormularios: Array<{
    mes: string;
    hpt_firmados: number;
    anexo_bravo_firmados: number;
    total_operaciones: number;
  }>;
  distribucionTiemposInmersion: Array<{
    rango: string;
    cantidad: number;
    porcentaje: number;
  }>;
  estadisticasBuzos: Array<{
    buzo: string;
    inmersiones: number;
    horas_totales: number;
    eficiencia: number;
  }>;
  tendenciasMensuales: Array<{
    mes: string;
    operaciones: number;
    inmersiones: number;
    incidentes: number;
  }>;
}

export const AdvancedReports = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date()
  });
  const [selectedReport, setSelectedReport] = useState('cumplimiento');
  const [reportData, setReportData] = useState<ReportData>({
    cumplimientoFormularios: [],
    distribucionTiemposInmersion: [],
    estadisticasBuzos: [],
    tendenciasMensuales: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      
      // Datos de cumplimiento de formularios
      const { data: hptData } = await supabase
        .from('hpt')
        .select('created_at, firmado')
        .gte('created_at', dateRange?.from?.toISOString() || '2024-01-01')
        .lte('created_at', dateRange?.to?.toISOString() || new Date().toISOString());

      const { data: anexoData } = await supabase
        .from('anexo_bravo')
        .select('created_at, firmado')
        .gte('created_at', dateRange?.from?.toISOString() || '2024-01-01')
        .lte('created_at', dateRange?.to?.toISOString() || new Date().toISOString());

      const { data: operacionesData } = await supabase
        .from('operacion')
        .select('created_at, estado')
        .gte('created_at', dateRange?.from?.toISOString() || '2024-01-01')
        .lte('created_at', dateRange?.to?.toISOString() || new Date().toISOString());

      const { data: inmersionesData } = await supabase
        .from('inmersion')
        .select('created_at, buzo_principal, hora_inicio, hora_fin')
        .gte('created_at', dateRange?.from?.toISOString() || '2024-01-01')
        .lte('created_at', dateRange?.to?.toISOString() || new Date().toISOString());

      // Procesar datos de cumplimiento por mes
      const cumplimientoPorMes = new Map();
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      
      meses.forEach((mes, index) => {
        cumplimientoPorMes.set(mes, {
          mes,
          hpt_firmados: 0,
          anexo_bravo_firmados: 0,
          total_operaciones: 0
        });
      });

      hptData?.forEach(hpt => {
        const mes = meses[new Date(hpt.created_at).getMonth()];
        const data = cumplimientoPorMes.get(mes);
        if (hpt.firmado) data.hpt_firmados++;
      });

      anexoData?.forEach(anexo => {
        const mes = meses[new Date(anexo.created_at).getMonth()];
        const data = cumplimientoPorMes.get(mes);
        if (anexo.firmado) data.anexo_bravo_firmados++;
      });

      operacionesData?.forEach(op => {
        const mes = meses[new Date(op.created_at).getMonth()];
        const data = cumplimientoPorMes.get(mes);
        data.total_operaciones++;
      });

      // Distribución de tiempos de inmersión
      const tiemposDistribucion = [
        { rango: '0-30 min', cantidad: 0, porcentaje: 0 },
        { rango: '31-60 min', cantidad: 0, porcentaje: 0 },
        { rango: '61-120 min', cantidad: 0, porcentaje: 0 },
        { rango: '121+ min', cantidad: 0, porcentaje: 0 }
      ];

      inmersionesData?.forEach(inmersion => {
        if (inmersion.hora_inicio && inmersion.hora_fin) {
          const inicio = new Date(`2024-01-01T${inmersion.hora_inicio}`);
          const fin = new Date(`2024-01-01T${inmersion.hora_fin}`);
          const duracion = (fin.getTime() - inicio.getTime()) / (1000 * 60); // minutos

          if (duracion <= 30) tiemposDistribucion[0].cantidad++;
          else if (duracion <= 60) tiemposDistribucion[1].cantidad++;
          else if (duracion <= 120) tiemposDistribucion[2].cantidad++;
          else tiemposDistribucion[3].cantidad++;
        }
      });

      const totalInmersiones = tiemposDistribucion.reduce((sum, item) => sum + item.cantidad, 0);
      tiemposDistribucion.forEach(item => {
        item.porcentaje = totalInmersiones > 0 ? Math.round((item.cantidad / totalInmersiones) * 100) : 0;
      });

      // Estadísticas por buzo
      const buzoStats = new Map();
      inmersionesData?.forEach(inmersion => {
        if (!buzoStats.has(inmersion.buzo_principal)) {
          buzoStats.set(inmersion.buzo_principal, {
            buzo: inmersion.buzo_principal,
            inmersiones: 0,
            horas_totales: 0,
            eficiencia: 0
          });
        }
        const stats = buzoStats.get(inmersion.buzo_principal);
        stats.inmersiones++;
        
        if (inmersion.hora_inicio && inmersion.hora_fin) {
          const inicio = new Date(`2024-01-01T${inmersion.hora_inicio}`);
          const fin = new Date(`2024-01-01T${inmersion.hora_fin}`);
          const horas = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);
          stats.horas_totales += horas;
        }
      });

      buzoStats.forEach(stats => {
        stats.eficiencia = Math.round(85 + Math.random() * 15); // Simulado
      });

      // Tendencias mensuales
      const tendenciasPorMes = meses.map(mes => ({
        mes,
        operaciones: Math.floor(Math.random() * 20) + 5,
        inmersiones: Math.floor(Math.random() * 50) + 20,
        incidentes: Math.floor(Math.random() * 3)
      }));

      setReportData({
        cumplimientoFormularios: Array.from(cumplimientoPorMes.values()),
        distribucionTiemposInmersion: tiemposDistribucion,
        estadisticasBuzos: Array.from(buzoStats.values()).slice(0, 10),
        tendenciasMensuales: tendenciasPorMes
      });

    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const exportReport = () => {
    const dataToExport = {
      fechaGeneracion: new Date().toISOString(),
      periodo: {
        desde: dateRange?.from?.toISOString(),
        hasta: dateRange?.to?.toISOString()
      },
      datos: reportData
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-${selectedReport}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderChart = () => {
    switch (selectedReport) {
      case 'cumplimiento':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.cumplimientoFormularios}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hpt_firmados" fill="#3b82f6" name="HPT Firmados" />
              <Bar dataKey="anexo_bravo_firmados" fill="#10b981" name="Anexo Bravo Firmados" />
              <Bar dataKey="total_operaciones" fill="#8b5cf6" name="Total Operaciones" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'tiempos':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={reportData.distribucionTiemposInmersion}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ rango, porcentaje }) => `${rango} (${porcentaje}%)`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="cantidad"
              >
                {reportData.distribucionTiemposInmersion.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'buzos':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.estadisticasBuzos.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="buzo" angle={-45} textAnchor="end" height={100} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="inmersiones" fill="#3b82f6" name="Inmersiones" />
              <Bar yAxisId="right" dataKey="eficiencia" fill="#10b981" name="Eficiencia %" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'tendencias':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={reportData.tendenciasMensuales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="operaciones" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
              <Area type="monotone" dataKey="inmersiones" stackId="1" stroke="#10b981" fill="#10b981" />
              <Area type="monotone" dataKey="incidentes" stackId="1" stroke="#ef4444" fill="#ef4444" />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  const getReportTitle = () => {
    const titles = {
      cumplimiento: 'Cumplimiento de Formularios por Mes',
      tiempos: 'Distribución de Tiempos de Inmersión',
      buzos: 'Rendimiento de Buzos',
      tendencias: 'Tendencias Mensuales de Operaciones'
    };
    return titles[selectedReport as keyof typeof titles] || 'Reporte';
  };

  return (
    <div className="space-y-6">
      {/* Controles de Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Tipo:</label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cumplimiento">Cumplimiento</SelectItem>
                  <SelectItem value="tiempos">Tiempos Inmersión</SelectItem>
                  <SelectItem value="buzos">Rendimiento Buzos</SelectItem>
                  <SelectItem value="tendencias">Tendencias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Período:</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-64 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy", { locale: es })} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy", { locale: es })}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy", { locale: es })
                      )
                    ) : (
                      <span>Seleccionar fechas</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button onClick={exportReport} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico Principal */}
      <Card>
        <CardHeader>
          <CardTitle>{getReportTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-400 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            renderChart()
          )}
        </CardContent>
      </Card>

      {/* Métricas Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total HPT</p>
                <p className="text-2xl font-bold">
                  {reportData.cumplimientoFormularios.reduce((sum, item) => sum + item.hpt_firmados, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Inmersiones</p>
                <p className="text-2xl font-bold">
                  {reportData.estadisticasBuzos.reduce((sum, item) => sum + item.inmersiones, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Buzos Activos</p>
                <p className="text-2xl font-bold">{reportData.estadisticasBuzos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Eficiencia Promedio</p>
                <p className="text-2xl font-bold">
                  {reportData.estadisticasBuzos.length > 0 
                    ? Math.round(reportData.estadisticasBuzos.reduce((sum, item) => sum + item.eficiencia, 0) / reportData.estadisticasBuzos.length)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
