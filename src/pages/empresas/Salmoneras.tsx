
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus, LayoutGrid, LayoutList, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSalmoneras, SalmoneraFormData } from "@/hooks/useSalmoneras";
import { CreateSalmoneraForm } from "@/components/salmoneras/CreateSalmoneraForm";
import { SalmoneraTableView } from "@/components/salmoneras/SalmoneraTableView";
import { SalmoneraCardView } from "@/components/salmoneras/SalmoneraCardView";

const Salmoneras = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSalmonera, setEditingSalmonera] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filtrar salmoneras por término de búsqueda
  const filteredSalmoneras = salmoneras.filter(salmonera =>
    salmonera.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salmonera.rut.includes(searchTerm) ||
    salmonera.direccion.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    if (confirm('¿Está seguro de que desea eliminar esta salmonera? Esta acción no se puede deshacer.')) {
      await deleteSalmonera(id);
    }
  };

  const handleViewSitios = (id: string) => {
    console.log('Ver sitios para salmonera:', id);
    // TODO: Navegar a la página de sitios filtrada por salmonera
  };

  // Vista de formulario de creación
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
              <div className="p-4 md:p-8">
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

  // Vista de formulario de edición
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
              <div className="p-4 md:p-8">
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

  // Vista principal de lista
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
              
              {/* Barra de búsqueda */}
              <div className="hidden md:flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar salmoneras..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64 touch-target"
                  />
                </div>
              </div>

              {/* Controles de vista y acciones */}
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center bg-zinc-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                    className="h-8 px-3 touch-target"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="h-8 px-3 touch-target"
                  >
                    <LayoutList className="w-4 h-4" />
                  </Button>
                </div>
                <Button 
                  className="ios-button touch-target"
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
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
              {/* Búsqueda móvil */}
              <div className="md:hidden">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar salmoneras..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 touch-target"
                  />
                </div>
              </div>

              {/* Estadísticas */}
              {!isLoading && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="ios-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-zinc-900">{salmoneras.length}</div>
                      <div className="text-sm text-zinc-500">Total Salmoneras</div>
                    </CardContent>
                  </Card>
                  <Card className="ios-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-600">
                        {salmoneras.filter(s => s.estado === 'activa').length}
                      </div>
                      <div className="text-sm text-zinc-500">Activas</div>
                    </CardContent>
                  </Card>
                  <Card className="ios-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {salmoneras.reduce((sum, s) => sum + s.sitios_activos, 0)}
                      </div>
                      <div className="text-sm text-zinc-500">Sitios Totales</div>
                    </CardContent>
                  </Card>
                  <Card className="ios-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-zinc-600">
                        {Math.round(salmoneras.reduce((sum, s) => sum + s.sitios_activos, 0) / Math.max(salmoneras.length, 1))}
                      </div>
                      <div className="text-sm text-zinc-500">Promedio Sitios</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Contenido principal */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : filteredSalmoneras.length === 0 ? (
                searchTerm ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Search className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-zinc-900 mb-2">Sin resultados</h3>
                      <p className="text-zinc-500 mb-4">
                        No se encontraron salmoneras que coincidan con "{searchTerm}"
                      </p>
                      <Button variant="outline" onClick={() => setSearchTerm("")}>
                        Limpiar búsqueda
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Building2 className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay salmoneras registradas</h3>
                      <p className="text-zinc-500 mb-4">Comienza registrando tu primera empresa salmonera</p>
                      <Button onClick={() => setShowCreateForm(true)} className="touch-target">
                        <Plus className="w-4 h-4 mr-2" />
                        Nueva Salmonera
                      </Button>
                    </CardContent>
                  </Card>
                )
              ) : (
                viewMode === 'cards' ? (
                  <SalmoneraCardView
                    salmoneras={filteredSalmoneras}
                    onEdit={setEditingSalmonera}
                    onDelete={handleDeleteSalmonera}
                    onViewSitios={handleViewSitios}
                    isDeleting={isDeleting}
                    isUpdating={isUpdating}
                  />
                ) : (
                  <SalmoneraTableView
                    salmoneras={filteredSalmoneras}
                    onEdit={setEditingSalmonera}
                    onDelete={handleDeleteSalmonera}
                    onViewSitios={handleViewSitios}
                    isDeleting={isDeleting}
                    isUpdating={isUpdating}
                  />
                )
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Salmoneras;
