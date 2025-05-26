
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { AppSidebar } from "@/components/AppSidebar";
import { CreateSitioForm } from "@/components/sitios/CreateSitioForm";
import { EditSitioForm } from "@/components/sitios/EditSitioForm";
import { SitioDetailsView } from "@/components/sitios/SitioDetailsView";
import { MapPin, Plus, Building, Edit, Trash2, Table as TableIcon, Grid, Eye, AlertTriangle } from "lucide-react";
import { useSitios } from "@/hooks/useSitios";
import { useToast } from "@/hooks/use-toast";

export default function Sitios() {
  const { sitios, isLoading, createSitio, updateSitio, deleteSitio } = useSitios();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSitio, setEditingSitio] = useState<any>(null);
  const [viewingSitio, setViewingSitio] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
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

  const handleUpdateSitio = async (data: any) => {
    if (editingSitio) {
      try {
        await updateSitio({ id: editingSitio.id, data });
        setEditingSitio(null);
        toast({
          title: "Sitio actualizado",
          description: "El sitio ha sido actualizado exitosamente.",
        });
      } catch (error) {
        console.error('Error updating sitio:', error);
      }
    }
  };

  const handleDeleteSitio = async (id: string) => {
    try {
      await deleteSitio(id);
      setDeleteConfirm(null);
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
            <CreateSitioForm
              onSubmit={handleCreateSitio}
              onCancel={() => setShowCreateForm(false)}
            />
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (editingSitio) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 p-6">
            <EditSitioForm
              sitio={editingSitio}
              onSubmit={handleUpdateSitio}
              onCancel={() => setEditingSitio(null)}
            />
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (viewingSitio) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 p-6">
            <SitioDetailsView
              sitio={viewingSitio}
              onBack={() => setViewingSitio(null)}
              onEdit={() => {
                setEditingSitio(viewingSitio);
                setViewingSitio(null);
              }}
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
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Sitios</h1>
                    <p className="text-zinc-500">Gestión de sitios de trabajo</p>
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
                  Nuevo Sitio
                </Button>
              </div>
            </div>

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
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSitios.map((sitio) => (
                          <Card key={sitio.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-lg font-semibold">{sitio.nombre}</CardTitle>
                                  <p className="text-sm text-zinc-500">{sitio.codigo}</p>
                                </div>
                                <Badge variant="outline" className={
                                  sitio.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }>
                                  {sitio.estado}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-start gap-2 text-sm text-zinc-600">
                                <MapPin className="w-4 h-4 mt-0.5" />
                                <span>{sitio.ubicacion}</span>
                              </div>
                              
                              {sitio.coordenadas_lat && sitio.coordenadas_lng && (
                                <div className="text-xs text-zinc-500">
                                  Coordenadas: {sitio.coordenadas_lat.toFixed(6)}, {sitio.coordenadas_lng.toFixed(6)}
                                </div>
                              )}

                              {sitio.observaciones && (
                                <p className="text-xs text-zinc-600 line-clamp-2">{sitio.observaciones}</p>
                              )}

                              <div className="flex gap-2 pt-3">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setViewingSitio(sitio)}
                                  className="flex-1"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Ver
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setEditingSitio(sitio)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setDeleteConfirm(sitio.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

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
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Sitio</TableHead>
                            <TableHead>Ubicación</TableHead>
                            <TableHead>Coordenadas</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredSitios.map((sitio) => (
                            <TableRow key={sitio.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{sitio.nombre}</div>
                                  <div className="text-sm text-zinc-500">{sitio.codigo}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span>{sitio.ubicacion}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {sitio.coordenadas_lat && sitio.coordenadas_lng ? (
                                  <div className="text-sm">
                                    <div>{sitio.coordenadas_lat.toFixed(6)}</div>
                                    <div className="text-zinc-500">{sitio.coordenadas_lng.toFixed(6)}</div>
                                  </div>
                                ) : (
                                  <span className="text-zinc-400">No disponible</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={
                                  sitio.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }>
                                  {sitio.estado}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setViewingSitio(sitio)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setEditingSitio(sitio)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setDeleteConfirm(sitio.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Confirmar eliminación
                </DialogTitle>
                <DialogDescription>
                  ¿Está seguro de que desea eliminar este sitio? Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => deleteConfirm && handleDeleteSitio(deleteConfirm)}
                  className="flex-1"
                >
                  Eliminar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
}
