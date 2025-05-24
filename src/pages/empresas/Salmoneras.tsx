
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Plus, MapPin, Phone, Mail, LayoutGrid, LayoutList, Edit, Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSalmoneras, SalmoneraFormData } from "@/hooks/useSalmoneras";
import { CreateSalmoneraForm } from "@/components/salmoneras/CreateSalmoneraForm";

const Salmoneras = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSalmonera, setEditingSalmonera] = useState<string | null>(null);

  const { 
    salmoneras, 
    isLoading, 
    createSalmonera, 
    updateSalmonera, 
    deleteSalmonera,
    isCreating,
    isUpdating,
    isDeleting
  } = useSalmoneras();

  const handleCreateSalmonera = async (data: SalmoneraFormData) => {
    await createSalmonera(data);
    setShowCreateForm(false);
  };

  const handleUpdateSalmonera = async (data: SalmoneraFormData) => {
    if (editingSalmonera) {
      await updateSalmonera({ id: editingSalmonera, data });
      setEditingSalmonera(null);
    }
  };

  const handleDeleteSalmonera = async (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar esta salmonera?')) {
      await deleteSalmonera(id);
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
                  <Building2 className="w-6 h-6 text-zinc-600" />
                  <div>
                    <h1 className="text-xl font-semibold text-zinc-900">Nueva Salmonera</h1>
                    <p className="text-sm text-zinc-500">Registro de empresa salmonera</p>
                  </div>
                </div>
              </div>
            </header>
            
            <div className="flex-1 overflow-auto">
              <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <CreateSalmoneraForm
                  onSubmit={handleCreateSalmonera}
                  onCancel={() => setShowCreateForm(false)}
                />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (editingSalmonera) {
    const salmoneraToEdit = salmoneras.find(s => s.id === editingSalmonera);
    
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
                    <h1 className="text-xl font-semibold text-zinc-900">Editar Salmonera</h1>
                    <p className="text-sm text-zinc-500">Modificar datos de la empresa</p>
                  </div>
                </div>
              </div>
            </header>
            
            <div className="flex-1 overflow-auto">
              <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <CreateSalmoneraForm
                  onSubmit={handleUpdateSalmonera}
                  onCancel={() => setEditingSalmonera(null)}
                  initialData={salmoneraToEdit}
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
      case 'activa':
        return 'bg-emerald-100 text-emerald-700';
      case 'inactiva':
        return 'bg-gray-100 text-gray-700';
      case 'suspendida':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderCardsView = () => (
    <div className="grid gap-6">
      {salmoneras.map((salmonera) => (
        <Card key={salmonera.id} className="ios-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-zinc-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-zinc-900">{salmonera.nombre}</CardTitle>
                  <p className="text-sm text-zinc-500">RUT: {salmonera.rut}</p>
                </div>
              </div>
              <Badge variant="secondary" className={getEstadoBadgeColor(salmonera.estado)}>
                {salmonera.estado.charAt(0).toUpperCase() + salmonera.estado.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <MapPin className="w-4 h-4" />
                <span>{salmonera.direccion}</span>
              </div>
              {salmonera.telefono && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Phone className="w-4 h-4" />
                  <span>{salmonera.telefono}</span>
                </div>
              )}
              {salmonera.email && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Mail className="w-4 h-4" />
                  <span>{salmonera.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Building2 className="w-4 h-4" />
                <span>{salmonera.sitios_activos} sitios activos</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm">
                Ver Sitios
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditingSalmonera(salmonera.id)}
                disabled={isUpdating}
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDeleteSalmonera(salmonera.id)}
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
            <TableHead>Empresa</TableHead>
            <TableHead>RUT</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Sitios</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salmoneras.map((salmonera) => (
            <TableRow key={salmonera.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-zinc-600" />
                  </div>
                  <div>
                    <div className="font-medium">{salmonera.nombre}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-zinc-600">{salmonera.rut}</TableCell>
              <TableCell className="text-zinc-600">{salmonera.direccion}</TableCell>
              <TableCell className="text-zinc-600">{salmonera.telefono || '-'}</TableCell>
              <TableCell className="text-zinc-600">{salmonera.email || '-'}</TableCell>
              <TableCell className="text-zinc-600">{salmonera.sitios_activos}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={getEstadoBadgeColor(salmonera.estado)}>
                  {salmonera.estado.charAt(0).toUpperCase() + salmonera.estado.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Ver Sitios
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingSalmonera(salmonera.id)}
                    disabled={isUpdating}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteSalmonera(salmonera.id)}
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
                <Building2 className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Salmoneras</h1>
                  <p className="text-sm text-zinc-500">Gestión de empresas salmoneras</p>
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
                  Nueva Salmonera
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
              ) : salmoneras.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Building2 className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay salmoneras registradas</h3>
                    <p className="text-zinc-500 mb-4">Comienza registrando tu primera empresa salmonera</p>
                    <Button onClick={() => setShowCreateForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Salmonera
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

export default Salmoneras;
