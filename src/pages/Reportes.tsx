
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, Download, Filter, BarChart3, PieChart as PieChartIcon, TrendingUp, FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";

const Reportes = () => {
  const [dateRange, setDateRange] = useState("month");
  const [selectedSalmonera, setSelectedSalmonera] = useState("all");
  const [selectedContratista, setSelectedContratista] = useState("all");

  // Mock data for charts
  const cumplimientoData = [
    { mes: "Ene", hpt: 85, anexo: 90, bitacoras: 75 },
    { mes: "Feb", hpt: 92, anexo: 88, bitacoras: 82 },
    { mes: "Mar", hpt: 88, anexo: 95, bitacoras: 90 },
    { mes: "Abr", hpt: 95, anexo: 92, bitacoras: 85 },
    { mes: "May", hpt: 90, anexo: 85, bitacoras: 88 }
  ];

  const inmersionesData = [
    { fecha: "01/05", inmersiones: 12 },
    { fecha: "02/05", inmersiones: 8 },
    { fecha: "03/05", inmersiones: 15 },
    { fecha: "04/05", inmersiones: 10 },
    { fecha: "05/05", inmersiones: 18 },
    { fecha: "06/05", inmersiones: 14 },
    { fecha: "07/05", inmersiones: 16 }
  ];

  const estadoFormulariosData = [
    { name: "Completados", value: 65, color: "#10B981" },
    { name: "Pendientes", value: 25, color: "#F59E0B" },
    { name: "Borradores", value: 10, color: "#6B7280" }
  ];

  const permisosVencimiento = [
    { buzo: "Juan Pérez", matricula: "BUZ-12345", vencimiento: "2024-06-15", dias: 15, estado: "warning" },
    { buzo: "Pedro González", matricula: "BUZ-67890", vencimiento: "2024-07-02", dias: 32, estado: "safe" },
    { buzo: "Carlos López", matricula: "BUZ-54321", vencimiento: "2024-05-28", dias: 2, estado: "danger" },
    { buzo: "Ana Torres", matricula: "BUZ-98765", vencimiento: "2024-06-10", dias: 10, estado: "warning" }
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "danger": return "bg-red-100 text-red-700 border-red-200";
      case "warning": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "safe": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const COLORS = ['#10B981', '#F59E0B', '#6B7280'];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Reportes</h1>
                  <p className="text-sm text-zinc-500">Análisis y estadísticas operacionales</p>
                </div>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                </Button>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
              
              {/* Filtros Globales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Filtros de Reporte
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="dateRange">Período</Label>
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">Última semana</SelectItem>
                          <SelectItem value="month">Último mes</SelectItem>
                          <SelectItem value="quarter">Último trimestre</SelectItem>
                          <SelectItem value="year">Último año</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="salmonera">Salmonera</Label>
                      <Select value={selectedSalmonera} onValueChange={setSelectedSalmonera}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="blumar">Blumar S.A.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="contratista">Contratista</Label>
                      <Select value={selectedContratista} onValueChange={setSelectedContratista}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="aerocam">Aerocam Chile</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full">Aplicar Filtros</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* KPIs Principales */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-600">Total Operaciones</p>
                        <p className="text-3xl font-bold text-blue-600">24</p>
                      </div>
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="mt-2 text-sm text-green-600">
                      +12% vs mes anterior
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-600">Inmersiones</p>
                        <p className="text-3xl font-bold text-teal-600">186</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-teal-600" />
                    </div>
                    <div className="mt-2 text-sm text-green-600">
                      +8% vs mes anterior
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-600">Cumplimiento</p>
                        <p className="text-3xl font-bold text-green-600">92%</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="mt-2 text-sm text-green-600">
                      +3% vs mes anterior
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-600">Pendientes</p>
                        <p className="text-3xl font-bold text-orange-600">7</p>
                      </div>
                      <Clock className="w-8 h-8 text-orange-600" />
                    </div>
                    <div className="mt-2 text-sm text-red-600">
                      -2 vs mes anterior
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Gráficos Principales */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cumplimiento de Formularios */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Cumplimiento de Formularios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={cumplimientoData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="hpt" fill="#3B82F6" name="HPT" />
                        <Bar dataKey="anexo" fill="#10B981" name="Anexo Bravo" />
                        <Bar dataKey="bitacoras" fill="#8B5CF6" name="Bitácoras" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Estado de Formularios */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="w-5 h-5" />
                      Estado de Formularios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={estadoFormulariosData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {estadoFormulariosData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Inmersiones por Día */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Inmersiones Diarias (Últimos 7 días)
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
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Permisos Próximos a Vencer */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Permisos y Matrículas Próximas a Vencer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {permisosVencimiento.map((permiso, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{permiso.buzo}</div>
                            <div className="text-sm text-zinc-500">{permiso.matricula}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-medium">{permiso.vencimiento}</div>
                            <div className="text-xs text-zinc-500">{permiso.dias} días</div>
                          </div>
                          <Badge className={getEstadoColor(permiso.estado)}>
                            {permiso.dias <= 5 ? "Urgente" : 
                             permiso.dias <= 15 ? "Próximo" : "Normal"}
                          </Badge>
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

export default Reportes;
