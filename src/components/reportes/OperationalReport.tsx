
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from "recharts";
import { 
  Calendar as CalendarIcon, Download, Users, Activity, 
  TrendingUp, AlertTriangle, Clock, Building 
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { useReportesOperativo } from "@/hooks/useReportesOperativo";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const OperationalReport = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date()
  });
  
  const [filters, setFilters] = useState({
    dateRange: {
      from: format(new Date(2024, 0, 1), 'yyyy-MM-dd'),
      to: format(new Date(), 'yyyy-MM-dd')
    },
    tipoFormulario: undefined as 'mantencion' | 'faena' | undefined,
    contratistaId: undefined as string | undefined,
    sitioId: undefined as string | undefined
  });

  const { reportData, isLoading, generateOperationalReport, exportReport } = useReportesOperativo(filters);

  useEffect(() => {
    generateOperationalReport();
  }, [generateOperationalReport]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      setFilters(prev => ({
        ...prev,
        dateRange: {
          from: format(range.from, 'yyyy-MM-dd'),
          to: format(range.to, 'yyyy-MM-dd')
        }
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!reportData) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No hay datos disponibles</p>
            <p className="text-sm">No se pudieron cargar los datos del reporte operativo</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Reporte Operativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
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
                    onSelect={handleDateRangeChange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Tipo:</label>
              <Select value={filters.tipoFormulario || ''} onValueChange={(value) => 
                setFilters(prev => ({ ...prev, tipoFormulario: value as 'mantencion' | 'faena' || undefined }))
              }>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los tipos</SelectItem>
                  <SelectItem value="mantencion">Mantención</SelectItem>
                  <SelectItem value="faena">Faena</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => exportReport('excel')} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar Excel
            </Button>

            <Button onClick={() => exportReport('pdf')} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Formularios</p>
                <p className="text-2xl font-bold">{reportData.estadisticas_generales.total_formularios_periodo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Contratistas Activos</p>
                <p className="text-2xl font-bold">{reportData.estadisticas_generales.contratistas_activos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Buzos Activos</p>
                <p className="text-2xl font-bold">{reportData.estadisticas_generales.buzos_activos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Eficiencia General</p>
                <p className="text-2xl font-bold">{reportData.estadisticas_generales.eficiencia_general}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tendencias Mensuales */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencias Mensuales</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.comparativas_mensuales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="formularios_completados" stroke="#3b82f6" name="Formularios Completados" />
              <Line type="monotone" dataKey="eficiencia" stroke="#10b981" name="Eficiencia %" />
              <Line type="monotone" dataKey="buzos_participantes" stroke="#f59e0b" name="Buzos Participantes" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance de Contratistas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Contratistas por Eficiencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.top_contratistas.map((contratista, index) => (
                <div key={contratista.nombre} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <div>
                      <p className="font-medium">{contratista.nombre}</p>
                      <p className="text-sm text-gray-600">{contratista.formularios_completados} formularios</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{contratista.eficiencia}%</p>
                    <p className="text-xs text-gray-500">{contratista.tiempo_promedio}h promedio</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Buzos por Participación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.top_buzos.map((buzo, index) => (
                <div key={buzo.nombre} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <div>
                      <p className="font-medium">{buzo.nombre}</p>
                      <p className="text-sm text-gray-600">{buzo.participaciones} participaciones</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{buzo.tiempo_total}h</p>
                    <p className="text-xs text-gray-500">⭐ {buzo.calificacion}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Operativas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Alertas Operativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportData.alertas_operativas.map((alerta, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alerta.prioridad === 'alta' ? 'bg-red-500' :
                  alerta.prioridad === 'media' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{alerta.tipo}</p>
                    <Badge variant={alerta.prioridad === 'alta' ? 'destructive' : 'secondary'} className="text-xs">
                      {alerta.prioridad}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{alerta.descripcion}</p>
                  {(alerta.contratista || alerta.sitio) && (
                    <p className="text-xs text-gray-500 mt-1">
                      {alerta.contratista && `Contratista: ${alerta.contratista}`}
                      {alerta.sitio && `Sitio: ${alerta.sitio}`}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
