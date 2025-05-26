
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
import { Briefcase, Plus, Table, Grid } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";

export default function Operaciones() {
  const { operaciones, isLoading, createOperacion, updateOperacion, deleteOperacion } = useOperaciones();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOperacion, setSelectedOperacion] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  const handleCreateOperacion = async (data: any) => {
    await createOperacion(data);
    setShowCreateForm(false);
  };

  const handleSelectOperacion = (operacion: any) => {
    setSelectedOperacion(operacion);
  };

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

  if (selectedOperacion) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 p-6">
            <OperacionDetails
              operacion={selectedOperacion}
              onBack={() => setSelectedOperacion(null)}
              onUpdate={updateOperacion}
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
                    <p className="text-zinc-500">Gestión de operaciones de buceo</p>
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
                  <span>Operaciones Registradas</span>
                  <Badge variant="outline">{operaciones.length} operaciones</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {viewMode === 'table' ? (
                  <OperacionesManager />
                ) : (
                  <OperacionCardView
                    operaciones={operaciones}
                    onSelect={handleSelectOperacion}
                    onEdit={() => {}}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
