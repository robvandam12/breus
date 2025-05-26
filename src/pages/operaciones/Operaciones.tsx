import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { AppSidebar } from "@/components/AppSidebar";
import { CreateOperacionForm } from "@/components/operaciones/CreateOperacionForm";
import { OperacionDetails } from "@/components/operaciones/OperacionDetails";
import { OperacionCardView } from "@/components/operaciones/OperacionCardView";
import { OperacionesManager } from "@/components/operaciones/OperacionesManager";
import { Briefcase, Plus, Table, Grid, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useRouter } from "@/hooks/useRouter";

export default function Operaciones() {
  const { operaciones, isLoading, createOperacion, updateOperacion, deleteOperacion } = useOperaciones();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOperacionId, setSelectedOperacionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const router = useRouter();

  const handleCreateOperacion = async (data: any) => {
    await createOperacion(data);
    setShowCreateForm(false);
  };

  const handleSelectOperacion = (operacion: any) => {
    setSelectedOperacionId(operacion.id);
  };

  const handleCreateHPT = (operacionId: string) => {
    router.push(`/formularios/hpt?operacion_id=${operacionId}`);
  };

  const handleCreateAnexoBravo = (operacionId: string) => {
    router.push(`/formularios/anexo-bravo?operacion_id=${operacionId}`);
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
          <main className="flex-1 p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-32 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
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
          <main className="flex-1 p-6">
            <CreateOperacionForm
              onSubmit={handleCreateOperacion}
              onCancel={() => setShowCreateForm(false)}
            />
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
          <main className="flex-1 p-6">
            <OperacionDetails
              operacionId={selectedOperacionId}
              onClose={() => setSelectedOperacionId(null)}
            />
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Operaciones</h1>
                    <p className="text-zinc-500">Gestión de operaciones de buceo y documentos</p>
                  </div>
                </div>
              </div>
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
            </div>

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
                    <OperacionesManager 
                      onCreateHPT={handleCreateHPT}
                      onCreateAnexoBravo={handleCreateAnexoBravo}
                    />
                  </TabsContent>
                  
                  <TabsContent value="cards">
                    <OperacionCardView
                      operaciones={operaciones}
                      onSelect={handleSelectOperacion}
                      onEdit={() => {}}
                      onCreateHPT={handleCreateHPT}
                      onCreateAnexoBravo={handleCreateAnexoBravo}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
