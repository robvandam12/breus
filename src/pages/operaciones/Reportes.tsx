
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, FileText, Calendar, TrendingUp, Download, Filter } from "lucide-react";

const Reportes = () => {
  const [activeTab, setActiveTab] = useState("operations");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Reportes" 
            subtitle="Análisis y estadísticas de operaciones" 
            icon={BarChart3} 
          >
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {/* KPIs Generales */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                  <div className="text-2xl font-bold text-blue-600">25</div>
                  <div className="text-sm text-zinc-500">Operaciones Activas</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-green-600">142</div>
                  <div className="text-sm text-zinc-500">Inmersiones Completadas</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">78</div>
                  <div className="text-sm text-zinc-500">Documentos Firmados</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-sm text-zinc-500">Equipos Activos</div>
                </Card>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 max-w-md">
                  <TabsTrigger value="operations">Operaciones</TabsTrigger>
                  <TabsTrigger value="immersions">Inmersiones</TabsTrigger>
                  <TabsTrigger value="documents">Documentos</TabsTrigger>
                  <TabsTrigger value="teams">Equipos</TabsTrigger>
                </TabsList>

                <TabsContent value="operations" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Operaciones por Estado
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span>Activas</span>
                            <span className="font-bold text-green-600">25</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Completadas</span>
                            <span className="font-bold text-blue-600">18</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Pausadas</span>
                            <span className="font-bold text-yellow-600">3</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Canceladas</span>
                            <span className="font-bold text-red-600">2</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Tendencia Mensual
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12 text-gray-500">
                          <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>Gráfico en desarrollo</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="immersions" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Estadísticas de Inmersiones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>Reportes de inmersiones en desarrollo</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Estado de Documentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>Reportes de documentos en desarrollo</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="teams" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Rendimiento de Equipos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>Reportes de equipos en desarrollo</p>
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
