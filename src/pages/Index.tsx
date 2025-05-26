
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin,
  Ship,
  Filter,
  Calendar,
  Download
} from "lucide-react";
import { DashboardFilters, DashboardFilterState } from "@/components/dashboard/DashboardFilters";
import { useState } from "react";

const Index = () => {
  const [filters, setFilters] = useState<DashboardFilterState>({
    fechaInicio: '',
    fechaFin: '',
    salmonera: 'all',
    contratista: 'all',
    sitio: 'all',
    tipoOperacion: 'all',
    estadoOperacion: 'all',
    supervisor: 'all',
    buzo: 'all'
  });

  // Mock data that would be filtered based on the filters state
  const kpiData = {
    totalOperaciones: 24,
    operacionesActivas: 8,
    inmersionesTotales: 186,
    cumplimientoPromedio: 92
  };

  const recentActivity = [
    { id: 1, type: "hpt", title: "HPT-2024-001 completada", time: "2 horas", status: "success" },
    { id: 2, type: "inmersion", title: "Inmersión en Centro PA", time: "4 horas", status: "progress" },
    { id: 3, type: "anexo", title: "Anexo Bravo pendiente firma", time: "1 día", status: "warning" },
    { id: 4, type: "bitacora", title: "Bitácora supervisor enviada", time: "6 horas", status: "success" }
  ];

  const inmersionesData = [
    { fecha: "01/05", inmersiones: 12, profundidadPromedio: 35 },
    { fecha: "02/05", inmersiones: 8, profundidadPromedio: 28 },
    { fecha: "03/05", inmersiones: 15, profundidadPromedio: 42 },
    { fecha: "04/05", inmersiones: 10, profundidadPromedio: 31 },
    { fecha: "05/05", inmersiones: 18, profundidadPromedio: 38 },
    { fecha: "06/05", inmersiones: 14, profundidadPromedio: 33 },
    { fecha: "07/05", inmersiones: 16, profundidadPromedio: 40 }
  ];

  const operacionesActivas = [
    { 
      id: "op001",
      nombre: "Mantención Integral Centro PA", 
      sitio: "Centro Punta Arenas",
      contratista: "Aerocam Chile",
      progreso: 75,
      estado: "activa",
      fechaInicio: "2024-05-01",
      buzos: 3
    },
    { 
      id: "op002",
      nombre: "Renovación Redes Chiloé Sur", 
      sitio: "Centro Chiloé Sur",
      contratista: "Aerocam Chile",
      progreso: 45,
      estado: "activa",
      fechaInicio: "2024-05-15",
      buzos: 2
    },
    { 
      id: "op003",
      nombre: "Inspección Preventiva", 
      sitio: "Barco Austral",
      contratista: "Aerocam Chile",
      progreso: 20,
      estado: "planificada",
      fechaInicio: "2024-05-20",
      buzos: 1
    }
  ];

  const handleFiltersChange = (newFilters: DashboardFilterState) => {
    setFilters(newFilters);
    // Here you would typically refetch data with the new filters
    console.log('Filters changed:', newFilters);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-700";
      case "warning": return "bg-yellow-100 text-yellow-700";
      case "progress": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="w-4 h-4" />;
      case "warning": return <AlertTriangle className="w-4 h-4" />;
      case "progress": return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Dashboard</h1>
                  <p className="text-sm text-zinc-500">Panel de control operacional</p>
                </div>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Actualizado hace 5 min
                </Badge>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
              
              {/* Dashboard Filters */}
              <DashboardFilters onFiltersChange={handleFiltersChange} />

              {/* KPIs Principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Operaciones</p>
                        <p className="text-3xl font-bold text-blue-900">{kpiData.totalOperaciones}</p>
                      </div>
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="mt-2 text-sm text-blue-700">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      +12% vs mes anterior
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Operaciones Activas</p>
                        <p className="text-3xl font-bold text-green-900">{kpiData.operacionesActivas}</p>
                      </div>
                      <Ship className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="mt-2 text-sm text-green-700">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      En progreso normal
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-teal-600">Inmersiones Total</p>
                        <p className="text-3xl font-bold text-teal-900">{kpiData.inmersionesTotales}</p>
                      </div>
                      <Users className="w-8 h-8 text-teal-600" />
                    </div>
                    <div className="mt-2 text-sm text-teal-700">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      +8% vs mes anterior
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Cumplimiento</p>
                        <p className="text-3xl font-bold text-purple-900">{kpiData.cumplimientoPromedio}%</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="mt-2 text-sm text-purple-700">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      +3% vs mes anterior
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Gráficos y Análisis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Inmersiones por Día */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Inmersiones Diarias
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={inmersionesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="inmersiones" 
                          stroke="#3B82F6" 
                          strokeWidth={3}
                          dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
                          name="Inmersiones"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="profundidadPromedio" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                          name="Profundidad Promedio (m)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Actividad Reciente */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Actividad Reciente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border bg-white">
                          <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                            {getStatusIcon(activity.status)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{activity.title}</p>
                            <p className="text-xs text-gray-500">hace {activity.time}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {activity.type.toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Operaciones Activas */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Ship className="w-5 h-5" />
                      Operaciones Activas
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      Ver todas
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {operacionesActivas.map((operacion) => (
                      <div key={operacion.id} className="p-4 border rounded-lg bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Ship className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{operacion.nombre}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {operacion.sitio}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {operacion.buzos} buzos
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={operacion.estado === 'activa' ? 'default' : 'secondary'}
                              className={operacion.estado === 'activa' ? 'bg-green-100 text-green-700' : ''}
                            >
                              {operacion.estado}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              Desde {operacion.fechaInicio}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progreso</span>
                            <span>{operacion.progreso}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${operacion.progreso}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
