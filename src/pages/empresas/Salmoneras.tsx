
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { AppSidebar } from "@/components/AppSidebar";
import { CreateSalmoneraForm } from "@/components/salmoneras/CreateSalmoneraForm";
import { SalmoneraTableView } from "@/components/salmoneras/SalmoneraTableView";
import { SalmoneraCardView } from "@/components/salmoneras/SalmoneraCardView";
import { AsociacionContratistas } from "@/components/salmoneras/AsociacionContratistas";
import { UserManagement } from "@/components/empresa/UserManagement";
import { EquipoBuceoManager } from "@/components/equipos/EquipoBuceoManager";
import { Building, Plus, Table, Grid, Users, Link } from "lucide-react";
import { useSalmoneras, Salmonera } from "@/hooks/useSalmoneras";

export default function Salmoneras() {
  const { salmoneras, isLoading, createSalmonera, updateSalmonera, deleteSalmonera } = useSalmoneras();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedSalmonera, setSelectedSalmonera] = useState<Salmonera | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const handleCreateSalmonera = async (data: any) => {
    await createSalmonera(data);
    setShowCreateForm(false);
  };

  const handleSelectSalmonera = (salmonera: Salmonera) => {
    setSelectedSalmonera(salmonera);
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
            <CreateSalmoneraForm
              onSubmit={handleCreateSalmonera}
              onCancel={() => setShowCreateForm(false)}
            />
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (selectedSalmonera) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSalmonera(null)}
                  >
                    ← Volver
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold">{selectedSalmonera.nombre}</h1>
                    <p className="text-zinc-500">{selectedSalmonera.rut}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-700">
                  {selectedSalmonera.estado}
                </Badge>
              </div>

              <Tabs defaultValue="asociaciones" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="asociaciones" className="flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    Contratistas
                  </TabsTrigger>
                  <TabsTrigger value="usuarios" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Usuarios
                  </TabsTrigger>
                  <TabsTrigger value="equipos" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Equipos de Buceo
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="asociaciones">
                  <AsociacionContratistas
                    salmoneraId={selectedSalmonera.id}
                    salmoneraName={selectedSalmonera.nombre}
                  />
                </TabsContent>

                <TabsContent value="usuarios">
                  <UserManagement
                    empresaType="salmonera"
                    empresaId={selectedSalmonera.id}
                    users={[]}
                    onCreateUser={async () => {}}
                    onUpdateUser={async () => {}}
                    onDeleteUser={async () => {}}
                  />
                </TabsContent>

                <TabsContent value="equipos">
                  <EquipoBuceoManager salmoneraId={selectedSalmonera.id} />
                </TabsContent>
              </Tabs>
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
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Salmoneras</h1>
                    <p className="text-zinc-500">Gestión de empresas salmoneras</p>
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
                  Nueva Salmonera
                </Button>
              </div>
            </div>

            <Card className="ios-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span>Empresas Registradas</span>
                  <Badge variant="outline">{salmoneras.length} empresas</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {viewMode === 'table' ? (
                  <SalmoneraTableView
                    salmoneras={salmoneras}
                    onEdit={() => {}}
                    onDelete={deleteSalmonera}
                    onSelect={handleSelectSalmonera}
                  />
                ) : (
                  <SalmoneraCardView
                    salmoneras={salmoneras}
                    onEdit={() => {}}
                    onDelete={deleteSalmonera}
                    onSelect={handleSelectSalmonera}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
