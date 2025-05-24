
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, Plus, Building2, Waves, LayoutGrid, LayoutList, Edit, Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSitios, SitioFormData } from "@/hooks/useSitios";
import { CreateSitioForm } from "@/components/sitios/CreateSitioForm";

const Sitios = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSitio, setEditingSitio] = useState<string | null>(null);

  const { 
    sitios, 
    isLoading, 
    createSitio, 
    updateSitio, 
    deleteSitio,
    isCreating,
    isUpdating,
    isDeleting
  } = useSitios();

  const handleCreateSitio = async (data: SitioFormData) => {
    await createSitio(data);
    setShowCreateForm(false);
  };

  const handleUpdateSitio = async (data: SitioFormData) => {
    if (editingSitio) {
      await updateSitio({ id: editingSitio, data });
      setEditingSitio(null);
    }
  };

  const handleDeleteSitio = async (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este sitio?')) {
      await deleteSitio(id);
    }
  };

  if (showCreateForm) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
              <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
                <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-zinc-600" />
                  <div>
                    <h1 className="text-xl font-semibold text-zinc-900">Nuevo Sitio</h1>
                    <p className="text-sm text-zinc-500">Registro de sitio de trabajo</p>
                  </div>
                </div>
              </div>
            </header>
            
            <div className="flex-1 overflow-auto">
              <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <CreateSitioForm
                  onSubmit={handleCreateSitio}
                  onCancel={() => setShowCreateForm(false)}
                />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (editingSitio) {
    const sitioToEdit = sitios.find(s => s.id === editingSitio);
    
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
              <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
                <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-zinc-600" />
                  <div>
                    <h1 className="text-xl font-semibold text-zinc-900">Editar Sitio</h1>
                    <p className="text-sm text-zinc-500">Modificar datos del sitio</p>
                  </div>
                </div>
              </div>
            </header>
            
            <div className="flex-1 overflow-auto">
              <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <CreateSitioForm
                  onSubmit={handleUpdateSitio}
                  onCancel={() => setEditingSitio(null)}
                  initialData={sitioToEdit}
                  isEditing={true}
                />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-emerald-100 text-emerald-700';
      case 'inactivo':
        return 'bg-gray-100 text-gray-700';
      case 'mantenimiento':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderCardsView = () => (
    <div className="grid gap-6">
      {sitios.map((sitio) => (
        <Card key={sitio.id} className="ios-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-zinc-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-zinc-900">{sitio.nombre}</CardTitle>
                  <p className="text-sm text-zinc-500">Código: {sitio.codigo}</p>
                  <p className="text-sm text-zinc-500">
                    {sitio.salmoneras?.nombre}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className={getEstadoBadgeColor(sitio.estado)}>
                {sitio.estado.charAt(0).toUpperCase() + sitio.estado.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <MapPin className="w-4 h-4" />
                <span>{sitio.ubicacion}</span>
              </div>
              {sitio.profundidad_maxima && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Waves className="w-4 h-4" />
                  <span>{sitio.profundidad_maxima}m de profundidad</span>
                </div>
              )}
              {sitio.capacidad_jaulas && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Building2 className="w-4 h-4" />
                  <span>{sitio.capacidad_jaulas} jaulas</span>
                </div>
              )}
              {sitio.coordenadas_lat && sitio.coordenadas_lng && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <MapPin className="w-4 h-4" />
                  <span>{sitio.coordenadas_lat.toFixed(6)}, {sitio.coordenadas_lng.toFixed(6)}</span>
                </div>
              )}
            </div>
            {sitio.observaciones && (
              <div className="text-sm text-zinc-600">
                <strong>Observaciones:</strong> {sitio.observaciones}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm">
                Ver Operaciones
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditingSitio(sitio.id)}
                disabled={isUpdating}
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDeleteSitio(sitio.id)}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderTableView = () => (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sitio</TableHead>
            <TableHead>Salmonera</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Profundidad</TableHead>
            <TableHead>Jaulas</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sitios.map((sitio) => (
            <TableRow key={sitio.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-zinc-600" />
                  </div>
                  <div>
                    <div className="font-medium">{sitio.nombre}</div>
                    <div className="text-sm text-zinc-500">{sitio.codigo}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-zinc-600">
                {sitio.salmoneras?.nombre || '-'}
              </TableCell>
              <TableCell className="text-zinc-600">{sitio.ubicacion}</TableCell>
              <TableCell className="text-zinc-600">
                {sitio.profundidad_maxima ? `${sitio.profundidad_maxima}m` : '-'}
              </TableCell>
              <TableCell className="text-zinc-600">
                {sitio.capacidad_jaulas || '-'}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={getEstadoBadgeColor(sitio.estado)}>
                  {sitio.estado.charAt(0).toUpperCase() + sitio.estado.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Ver Operaciones
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingSitio(sitio.id)}
                    disabled={isUpdating}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteSitio(sitio.id)}
                    disabled={isDeleting}
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
    </Card>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Sitios</h1>
                  <p className="text-sm text-zinc-500">Gestión de sitios de trabajo</p>
                </div>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-zinc-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                    className="h-8 px-3"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="h-8 px-3"
                  >
                    <LayoutList className="w-4 h-4" />
                  </Button>
                </div>
                <Button 
                  className="ios-button"
                  onClick={() => setShowCreateForm(true)}
                  disabled={isCreating}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Sitio
                </Button>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : sitios.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <MapPin className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay sitios registrados</h3>
                    <p className="text-zinc-500 mb-4">Comienza registrando tu primer sitio de trabajo</p>
                    <Button onClick={() => setShowCreateForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Sitio
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                viewMode === 'cards' ? renderCardsView() : renderTableView()
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Sitios;
