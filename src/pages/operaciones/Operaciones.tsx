
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Wrench, Plus, Calendar, MapPin, HardHat, LayoutGrid, LayoutList, Edit, Trash2 } from "lucide-react";
import { useOperaciones, Operacion } from "@/hooks/useOperaciones";
import { CreateOperacionForm } from "@/components/operaciones/CreateOperacionForm";

const Operaciones = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingOperacion, setEditingOperacion] = useState<Operacion | null>(null);
  
  const { 
    operaciones, 
    isLoading, 
    createOperacion, 
    updateOperacion, 
    deleteOperacion,
    isCreating,
    isUpdating,
    isDeleting
  } = useOperaciones();

  const handleCreateOperacion = async (data: any) => {
    try {
      await createOperacion(data);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating operacion:', error);
    }
  };

  const handleUpdateOperacion = async (data: any) => {
    if (!editingOperacion) return;
    try {
      await updateOperacion({ id: editingOperacion.id, data });
      setEditingOperacion(null);
    } catch (error) {
      console.error('Error updating operacion:', error);
    }
  };

  const handleDeleteOperacion = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta operación?')) {
      try {
        await deleteOperacion(id);
      } catch (error) {
        console.error('Error deleting operacion:', error);
      }
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "activa":
        return "bg-emerald-100 text-emerald-700";
      case "pausada":
        return "bg-yellow-100 text-yellow-700";
      case "completada":
        return "bg-blue-100 text-blue-700";
      case "cancelada":
        return "bg-red-100 text-red-700";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  if (showCreateForm) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <div className="flex-1 overflow-auto">
              <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <CreateOperacionForm
                  onSubmit={handleCreateOperacion}
                  onCancel={() => setShowCreateForm(false)}
                />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (editingOperacion) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <div className="flex-1 overflow-auto">
              <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <CreateOperacionForm
                  onSubmit={handleUpdateOperacion}
                  onCancel={() => setEditingOperacion(null)}
                  initialData={editingOperacion}
                  isEditing={true}
                />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  const renderCardsView = () => (
    <div className="grid gap-6">
      {operaciones.map((operacion) => (
        <Card key={operacion.id} className="ios-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-zinc-900">{operacion.nombre}</CardTitle>
                  <p className="text-sm text-zinc-500">Código: {operacion.codigo}</p>
                </div>
              </div>
              <Badge variant="secondary" className={getEstadoBadge(operacion.estado)}>
                {operacion.estado}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Calendar className="w-4 h-4" />
                <span>Inicio: {new Date(operacion.fecha_inicio).toLocaleDateString()}</span>
              </div>
              {operacion.fecha_fin && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Calendar className="w-4 h-4" />
                  <span>Fin: {new Date(operacion.fecha_fin).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              {operacion.salmoneras && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <MapPin className="w-4 h-4" />
                  <span>Salmonera: {operacion.salmoneras.nombre}</span>
                </div>
              )}
              {operacion.sitios && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <MapPin className="w-4 h-4" />
                  <span>Sitio: {operacion.sitios.nombre} ({operacion.sitios.codigo})</span>
                </div>
              )}
              {operacion.contratistas && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <HardHat className="w-4 h-4" />
                  <span>Contratista: {operacion.contratistas.nombre}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditingOperacion(operacion)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDeleteOperacion(operacion.id)}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
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
            <TableHead>Operación</TableHead>
            <TableHead>Fechas</TableHead>
            <TableHead>Salmonera</TableHead>
            <TableHead>Sitio</TableHead>
            <TableHead>Contratista</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {operaciones.map((operacion) => (
            <TableRow key={operacion.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Wrench className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{operacion.nombre}</div>
                    <div className="text-sm text-zinc-500">{operacion.codigo}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-zinc-600">
                <div className="space-y-1">
                  <div>Inicio: {new Date(operacion.fecha_inicio).toLocaleDateString()}</div>
                  {operacion.fecha_fin && (
                    <div>Fin: {new Date(operacion.fecha_fin).toLocaleDateString()}</div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-zinc-600">
                {operacion.salmoneras?.nombre || '-'}
              </TableCell>
              <TableCell className="text-zinc-600">
                {operacion.sitios ? `${operacion.sitios.nombre} (${operacion.sitios.codigo})` : '-'}
              </TableCell>
              <TableCell className="text-zinc-600">
                {operacion.contratistas?.nombre || '-'}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={getEstadoBadge(operacion.estado)}>
                  {operacion.estado}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingOperacion(operacion)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteOperacion(operacion.id)}
                    disabled={isDeleting}
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
                <Wrench className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Operaciones</h1>
                  <p className="text-sm text-zinc-500">Gestión de operaciones de buceo</p>
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
                  {isCreating ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Nueva Operación
                </Button>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner size="lg" />
                </div>
              ) : operaciones.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Wrench className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">
                      No hay operaciones registradas
                    </h3>
                    <p className="text-zinc-500 mb-4">
                      Comienza creando tu primera operación de buceo.
                    </p>
                    <Button onClick={() => setShowCreateForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Primera Operación
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

export default Operaciones;
