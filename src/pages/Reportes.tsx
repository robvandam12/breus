
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BarChart3, PieChart, FileText, Download, Filter } from "lucide-react";
import { CumplimientoChart } from "@/components/reportes/CumplimientoChart";
import { InmersionesHeatmap } from "@/components/reportes/InmersionesHeatmap";
import { PermisosVencimiento } from "@/components/reportes/PermisosVencimiento";
import { EstadisticasGenerales } from "@/components/reportes/EstadisticasGenerales";
import { useReportes } from "@/hooks/useReportes";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Reportes = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [selectedSitio, setSelectedSitio] = useState<string>('all');
  const [selectedServicio, setSelectedServicio] = useState<string>('all');

  const { reportData, isLoading, generateReport, exportReport } = useReportes({
    dateRange,
    sitioId: selectedSitio === 'all' ? undefined : selectedSitio,
    servicioId: selectedServicio === 'all' ? undefined : selectedServicio
  });

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      await exportReport(format);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  if (isLoading) {
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
              </div>
            </header>
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner text="Cargando reportes..." />
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

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
                <Button variant="outline" onClick={() => handleExport('excel')}>
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline" onClick={() => handleExport('pdf')}>
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {/* Filtros */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filtros de Reporte
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Fecha Desde</label>
                      <Input
                        type="date"
                        value={dateRange.from}
                        onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Fecha Hasta</label>
                      <Input
                        type="date"
                        value={dateRange.to}
                        onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sitio</label>
                      <Select value={selectedSitio} onValueChange={setSelectedSitio}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos los sitios" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los sitios</SelectItem>
                          {reportData?.sitios.map((sitio) => (
                            <SelectItem key={sitio.id} value={sitio.id}>
                              {sitio.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Empresa de Servicio</label>
                      <Select value={selectedServicio} onValueChange={setSelectedServicio}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas las empresas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas las empresas</SelectItem>
                          {reportData?.servicios.map((servicio) => (
                            <SelectItem key={servicio.id} value={servicio.id}>
                              {servicio.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Estadísticas Generales */}
              <EstadisticasGenerales data={reportData?.stats} />

              {/* Pestañas de Reportes */}
              <Tabs defaultValue="cumplimiento" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="cumplimiento" className="flex items-center gap-2">
                    <PieChart className="w-4 h-4" />
                    Cumplimiento
                  </TabsTrigger>
                  <TabsTrigger value="inmersiones" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Inmersiones
                  </TabsTrigger>
                  <TabsTrigger value="permisos" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Permisos
                  </TabsTrigger>
                  <TabsTrigger value="documentos" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Documentos
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="cumplimiento">
                  <CumplimientoChart data={reportData?.cumplimiento} />
                </TabsContent>

                <TabsContent value="inmersiones">
                  <InmersionesHeatmap data={reportData?.inmersiones} />
                </TabsContent>

                <TabsContent value="permisos">
                  <PermisosVencimiento data={reportData?.permisos} />
                </TabsContent>

                <TabsContent value="documentos">
                  <Card>
                    <CardHeader>
                      <CardTitle>Estado de Documentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {reportData?.documentos?.hpt_firmados || 0}
                          </div>
                          <div className="text-sm text-zinc-500">HPT Firmados</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {reportData?.documentos?.anexos_firmados || 0}
                          </div>
                          <div className="text-sm text-zinc-500">Anexos Bravo Firmados</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {reportData?.documentos?.bitacoras_completadas || 0}
                          </div>
                          <div className="text-sm text-zinc-500">Bitácoras Completadas</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Reportes;
