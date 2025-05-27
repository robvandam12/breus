
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { AppSidebar } from "@/components/AppSidebar";
import { CreateOperacionForm } from "@/components/operaciones/CreateOperacionForm";
import { OperacionDetails } from "@/components/operaciones/OperacionDetails";
import { OperacionCardView } from "@/components/operaciones/OperacionCardView";
import { OperacionesManager } from "@/components/operaciones/OperacionesManager";
import { DocumentStatusCard } from "@/components/operaciones/DocumentStatusCard";
import { Header } from "@/components/layout/Header";
import { Briefcase, Plus, Table, Grid, FileText, CheckCircle, Clock } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";

export default function Operaciones() {
  const { operaciones, isLoading, createOperacion, updateOperacion, deleteOperacion } = useOperaciones();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOperacionId, setSelectedOperacionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const handleCreateOperacion = async (data: any) => {
    await createOperacion(data);
    setShowCreateForm(false);
  };

  const handleSelectOperacion = (operacion: any) => {
    setSelectedOperacionId(operacion.id);
  };

  const getOperacionStats = () => {
    const stats = {
      total: operaciones.length,
      activas: operaciones.filter(op => op.estado === 'activa').length,
      completadas: operaciones.filter(op => op.estado === 'completada').length,
      documentosPendientes: operaciones.filter(op => op.estado === 'activa').length * 2
    };
    return stats;
  };

  const stats = getOperacionStats();

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <Header title="Operaciones" subtitle="Gestión de operaciones de buceo y documentos" icon={Briefcase} />
            <div className="flex-1 p-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-32 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-48" />
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (showCreateForm) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <Header title="Nueva Operación" subtitle="Crear una nueva operación de buceo" icon={Briefcase} />
            <div className="flex-1 p-6">
              <CreateOperacionForm
                onSubmit={handleCreateOperacion}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (selectedOperacionId) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <Header title="Detalles de Operación" subtitle="Gestión de documentos y seguimiento" icon={Briefcase} />
            <div className="flex-1 p-6">
              <OperacionDetails
                operacionId={selectedOperacionId}
                onClose={() => setSelectedOperacionId(null)}
              />
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <Header title="Operaciones" subtitle="Gestión de operaciones de buceo y documentos" icon={Briefcase}>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white rounded-lg border">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="rounded-r-none"
                >
                  <Table className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="rounded-l-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </div>
              <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Operación
              </Button>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-6 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Total Operaciones</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Activas</p>
                        <p className="text-2xl font-bold text-green-600">{stats.activas}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Completadas</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.completadas}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-yellow-600" />
                      <div>
                        <p className="text-sm text-gray-600">Docs. Pendientes</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.documentosPendientes}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Document Status Cards for each operation */}
              {operaciones.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Estado de Documentos por Operación</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {operaciones.slice(0, 4).map((operacion) => (
                      <DocumentStatusCard
                        key={operacion.id}
                        operacionId={operacion.id}
                        operacionCodigo={operacion.codigo}
                        documents={{
                          hpt: { exists: false, firmado: false },
                          anexoBravo: { exists: false, firmado: false },
                          inmersiones: { count: 0 }
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <Card className="ios-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span>Gestión de Operaciones y Documentos</span>
                    <Badge variant="outline">{operaciones.length} operaciones</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'table' | 'cards')}>
                    <TabsContent value="table">
                      <OperacionesManager />
                    </TabsContent>
                    
                    <TabsContent value="cards">
                      <OperacionCardView
                        operaciones={operaciones}
                        onSelect={handleSelectOperacion}
                        onEdit={() => {}}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
