
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FileText, Plus, LayoutGrid, LayoutList } from "lucide-react";
import { BitacoraTableRow } from "@/components/bitacoras/BitacoraTableRow";
import { BitacoraFilters } from "@/components/bitacoras/BitacoraFilters";
import { BitacoraStats } from "@/components/bitacoras/BitacoraStats";
import { CreateBitacoraSupervisorFormComplete } from "@/components/bitacoras/CreateBitacoraSupervisorFormComplete";
import { BitacoraInmersionSelector } from "@/components/bitacoras/BitacoraInmersionSelector";
import { useBitacoras, BitacoraSupervisorFormData } from "@/hooks/useBitacoras";
import { useBitacoraActions } from "@/hooks/useBitacoraActions";
import { useBitacoraFilters } from "@/hooks/useBitacoraFilters";
import { Skeleton } from "@/components/ui/skeleton";

const BitacorasSupervisor = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showInmersionSelector, setShowInmersionSelector] = useState(false);
  const [selectedInmersionId, setSelectedInmersionId] = useState<string>('');
  
  const { 
    bitacorasSupervisor, 
    loading, 
    createBitacoraSupervisor, 
    refreshBitacoras 
  } = useBitacoras();
  
  const { signBitacoraSupervisor } = useBitacoraActions();
  const { filters, setFilters, filterBitacoras } = useBitacoraFilters();

  const filteredBitacorasSupervisor = filterBitacoras(bitacorasSupervisor);

  const handleCreateSupervisor = async (data: BitacoraSupervisorFormData) => {
    try {
      console.log('Creating bitácora supervisor with data:', data);
      await createBitacoraSupervisor(data);
      setIsCreateDialogOpen(false);
      setShowInmersionSelector(false);
      setSelectedInmersionId('');
      refreshBitacoras();
    } catch (error) {
      console.error('Error creating bitácora supervisor:', error);
    }
  };

  const handleSignSupervisor = async (id: string) => {
    await signBitacoraSupervisor(id);
    refreshBitacoras();
  };

  const handleInmersionSelected = (inmersionId: string) => {
    console.log('Inmersion selected:', inmersionId);
    setSelectedInmersionId(inmersionId);
    setShowInmersionSelector(false);
    setIsCreateDialogOpen(true);
  };

  const handleNewBitacora = () => {
    setShowInmersionSelector(true);
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
              <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
                <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-zinc-600" />
                  <div>
                    <h1 className="text-xl font-semibold text-zinc-900">Bitácoras Supervisor</h1>
                    <p className="text-sm text-zinc-500">Registro de supervisión de inmersiones</p>
                  </div>
                </div>
              </div>
            </header>
            <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-8 w-20 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
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
                <FileText className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Bitácoras Supervisor</h1>
                  <p className="text-sm text-zinc-500">Registro completo de supervisión de inmersiones</p>
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
                  onClick={handleNewBitacora}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Bitácora Supervisor
                </Button>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              <BitacoraStats 
                bitacorasSupervisor={bitacorasSupervisor}
                bitacorasBuzo={[]}
                filteredSupervisor={filteredBitacorasSupervisor}
                filteredBuzo={[]}
              />

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Filtros y Búsqueda
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BitacoraFilters
                    activeFilters={filters}
                    onFiltersChange={setFilters}
                  />
                </CardContent>
              </Card>

              {filteredBitacorasSupervisor.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">
                      {bitacorasSupervisor.length === 0 
                        ? "No hay bitácoras de supervisor" 
                        : "No se encontraron resultados"}
                    </h3>
                    <p className="text-zinc-500 mb-4">
                      {bitacorasSupervisor.length === 0 
                        ? "Comienza creando tu primera bitácora de supervisor completa"
                        : "Intenta ajustar los filtros de búsqueda"}
                    </p>
                    {bitacorasSupervisor.length === 0 && (
                      <Button onClick={handleNewBitacora} className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Nueva Bitácora Supervisor
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Inmersión</TableHead>
                        <TableHead>Supervisor</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBitacorasSupervisor.map((bitacora) => (
                        <BitacoraTableRow
                          key={bitacora.bitacora_id}
                          bitacora={bitacora}
                          type="supervisor"
                          onSign={handleSignSupervisor}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </div>
          </div>

          {/* Inmersion Selector Dialog */}
          <Dialog open={showInmersionSelector} onOpenChange={setShowInmersionSelector}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogTitle>Seleccionar Inmersión para Bitácora</DialogTitle>
              <BitacoraInmersionSelector 
                onInmersionSelected={handleInmersionSelected}
                selectedInmersionId={selectedInmersionId}
              />
            </DialogContent>
          </Dialog>

          {/* Create Form Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto p-0">
              <DialogTitle className="sr-only">Crear Nueva Bitácora de Supervisor</DialogTitle>
              {selectedInmersionId && (
                <CreateBitacoraSupervisorFormComplete
                  inmersionId={selectedInmersionId}
                  onSubmit={handleCreateSupervisor}
                  onCancel={() => {
                    setIsCreateDialogOpen(false);
                    setSelectedInmersionId('');
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default BitacorasSupervisor;
