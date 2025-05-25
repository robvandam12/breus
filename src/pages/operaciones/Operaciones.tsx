
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Plus, Search, Edit, Trash2, Eye, LayoutGrid, LayoutList } from "lucide-react";
import { CreateOperacionForm } from "@/components/operaciones/CreateOperacionForm";
import { OperacionCard } from "@/components/operaciones/OperacionCard";
import { useOperaciones, Operacion, OperacionFormData } from "@/hooks/useOperaciones";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Operaciones = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOperacion, setEditingOperacion] = useState<Operacion | null>(null);
  
  const { operaciones, isLoading, createOperacion, updateOperacion, deleteOperacion } = useOperaciones();

  const filteredOperaciones = operaciones.filter(operacion =>
    operacion.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operacion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateOperacion = async (data: OperacionFormData) => {
    try {
      await createOperacion(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating operacion:', error);
    }
  };

  const handleEditOperacion = async (data: OperacionFormData) => {
    if (!editingOperacion) return;
    
    try {
      await updateOperacion({ id: editingOperacion.id, data });
      setIsEditDialogOpen(false);
      setEditingOperacion(null);
    } catch (error) {
      console.error('Error updating operacion:', error);
    }
  };

  const openEditDialog = (operacion: Operacion) => {
    setEditingOperacion(operacion);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingOperacion(null);
  };

  const getEstadoBadge = (estado: string) => {
    const estadoMap: Record<string, { className: string; label: string }> = {
      activa: { className: "bg-green-100 text-green-700", label: "Activa" },
      pausada: { className: "bg-yellow-100 text-yellow-700", label: "Pausada" },
      completada: { className: "bg-blue-100 text-blue-700", label: "Completada" },
      cancelada: { className: "bg-red-100 text-red-700", label: "Cancelada" }
    };
    return estadoMap[estado] || estadoMap.activa;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  const renderCardsView = () => (
    <div className="grid gap-6">
      {filteredOperaciones.map((operacion) => (
        <OperacionCard 
          key={operacion.id} 
          operacion={operacion}
          onEdit={() => openEditDialog(operacion)}
          onDelete={() => deleteOperacion(operacion.id)}
        />
      ))}
    </div>
  );

  const renderTableView = () => (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Fecha Inicio</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Salmonera</TableHead>
            <TableHead>Sitio</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOperaciones.map((operacion) => {
            const estadoInfo = getEstadoBadge(operacion.estado);
            return (
              <TableRow key={operacion.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{operacion.codigo}</div>
                      <div className="text-xs text-zinc-500">{formatDate(operacion.created_at)}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-600">{operacion.nombre}</TableCell>
                <TableCell className="text-zinc-600">{formatDate(operacion.fecha_inicio)}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={estadoInfo.className}>
                    {estadoInfo.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-600">{operacion.salmoneras?.nombre || "N/A"}</TableCell>
                <TableCell className="text-zinc-600">{operacion.sitios?.nombre || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(operacion)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteOperacion(operacion.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );

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
                  <Building2 className="w-6 h-6 text-zinc-600" />
                  <div>
                    <h1 className="text-xl font-semibold text-zinc-900">Operaciones</h1>
                    <p className="text-sm text-zinc-500">Gestión de operaciones</p>
                  </div>
                </div>
              </div>
            </header>
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner text="Cargando operaciones..." />
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
                <Building2 className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Operaciones</h1>
                  <p className="text-sm text-zinc-500">Gestión de operaciones</p>
                </div>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar operaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
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

                {/* Create Dialog */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="ios-button bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Operación
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                    <CreateOperacionForm
                      onSubmit={handleCreateOperacion}
                      onCancel={() => setIsCreateDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                    <CreateOperacionForm
                      onSubmit={handleEditOperacion}
                      onCancel={closeEditDialog}
                      initialData={editingOperacion || undefined}
                      isEditing={true}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {operaciones.filter(o => o.estado === 'activa').length}
                  </div>
                  <div className="text-sm text-zinc-500">Activas</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {operaciones.filter(o => o.estado === 'pausada').length}
                  </div>
                  <div className="text-sm text-zinc-500">Pausadas</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {operaciones.filter(o => o.estado === 'completada').length}
                  </div>
                  <div className="text-sm text-zinc-500">Completadas</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-zinc-600">
                    {operaciones.length}
                  </div>
                  <div className="text-sm text-zinc-500">Total</div>
                </Card>
              </div>

              {filteredOperaciones.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Building2 className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay operaciones registradas</h3>
                    <p className="text-zinc-500 mb-4">Comience registrando la primera operación</p>
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Operación
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
