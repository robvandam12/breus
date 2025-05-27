
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { CreateSitioForm } from "@/components/sitios/CreateSitioForm";
import { SitioTableView } from "@/components/sitios/SitioTableView";
import { SitioCardView } from "@/components/sitios/SitioCardView";
import { MapPin, Plus, Table as TableIcon, Grid } from "lucide-react";
import { useSitios } from "@/hooks/useSitios";
import { useToast } from "@/hooks/use-toast";

export default function Sitios() {
  const { sitios, isLoading, createSitio, updateSitio, deleteSitio } = useSitios();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table'); // Default to table view
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleCreateSitio = async (data: any) => {
    try {
      await createSitio(data);
      setShowCreateForm(false);
      toast({
        title: "Sitio creado",
        description: "El sitio ha sido creado exitosamente.",
      });
    } catch (error) {
      console.error('Error creating sitio:', error);
    }
  };

  const handleUpdateSitio = async (id: string, data: any) => {
    try {
      await updateSitio({ id, data });
      toast({
        title: "Sitio actualizado",
        description: "El sitio ha sido actualizado exitosamente.",
      });
    } catch (error) {
      console.error('Error updating sitio:', error);
    }
  };

  const handleDeleteSitio = async (id: string) => {
    try {
      await deleteSitio(id);
      toast({
        title: "Sitio eliminado",
        description: "El sitio ha sido eliminado exitosamente.",
      });
    } catch (error) {
      console.error('Error deleting sitio:', error);
    }
  };

  const filteredSitios = sitios.filter(sitio =>
    sitio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sitio.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sitio.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <RoleBasedSidebar />
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
          <RoleBasedSidebar />
          <main className="flex-1 p-6">
            <CreateSitioForm
              onSubmit={handleCreateSitio}
              onCancel={() => setShowCreateForm(false)}
            />
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header title="Sitios" subtitle="Gestión de sitios de trabajo" icon={MapPin}>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white rounded-lg border">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="rounded-r-none"
                >
                  <TableIcon className="w-4 h-4" />
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
                Nuevo
              </Button>
            </div>
          </Header>

          <div className="flex-1 overflow-auto">
            <div className="p-6 space-y-6">
              <Card className="ios-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center justify-between">
                      <span>Sitios Registrados</span>
                      <Badge variant="outline">{filteredSitios.length} sitios</Badge>
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <Input
                      placeholder="Buscar sitios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'table' | 'cards')}>
                    <TabsContent value="table">
                      {filteredSitios.length === 0 ? (
                        <div className="text-center py-12">
                          <MapPin className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay sitios registrados</h3>
                          <p className="text-zinc-500 mb-4">Cree el primer sitio para comenzar</p>
                          <Button onClick={() => setShowCreateForm(true)} variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Crear Primer Sitio
                          </Button>
                        </div>
                      ) : (
                        <SitioTableView
                          sitios={filteredSitios}
                          onEdit={handleUpdateSitio}
                          onDelete={handleDeleteSitio}
                        />
                      )}
                    </TabsContent>

                    <TabsContent value="cards">
                      {filteredSitios.length === 0 ? (
                        <div className="text-center py-12">
                          <MapPin className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay sitios registrados</h3>
                          <p className="text-zinc-500 mb-4">Cree el primer sitio para comenzar</p>
                          <Button onClick={() => setShowCreateForm(true)} variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Crear Primer Sitio
                          </Button>
                        </div>
                      ) : (
                        <SitioCardView
                          sitios={filteredSitios}
                          onEdit={handleUpdateSitio}
                          onDelete={handleDeleteSitio}
                        />
                      )}
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
