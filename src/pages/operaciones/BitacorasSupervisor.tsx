
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, Plus, LayoutGrid, LayoutList } from "lucide-react";
import { CreateBitacoraSupervisorFormComplete } from "@/components/bitacoras/CreateBitacoraSupervisorFormComplete";
import { useBitacorasSupervisor, BitacoraSupervisorFormData } from "@/hooks/useBitacorasSupervisor";
import { useBitacorasBuzo } from "@/hooks/useBitacorasBuzo";
import { useBitacoraFilters } from "@/hooks/useBitacoraFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { BitacoraTableRow } from "@/components/bitacoras/BitacoraTableRow";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BitacoraFilters } from "@/components/bitacoras/BitacoraFilters";
import { BitacoraStats } from "@/components/bitacoras/BitacoraStats";

const BitacorasSupervisor = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { 
    bitacorasSupervisor, 
    loadingSupervisor,
    createBitacoraSupervisor,
    updateBitacoraSupervisorSignature
  } = useBitacorasSupervisor();

  const { bitacorasBuzo, loadingBuzo } = useBitacorasBuzo();
  
  const loading = loadingSupervisor || loadingBuzo;
  
  const { filters, setFilters, filterBitacoras } = useBitacoraFilters();

  const filteredBitacorasSupervisor = filterBitacoras(bitacorasSupervisor);

  const handleCreateSupervisor = async (data: BitacoraSupervisorFormData) => {
    try {
      await createBitacoraSupervisor.mutateAsync(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating bitácora supervisor:', error);
    }
  };

  const handleSignSupervisor = async (id: string, signatureData: string) => {
    await updateBitacoraSupervisorSignature.mutateAsync({ bitacoraId: id, signatureData });
  };
  
  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <Header 
              title="Bitácoras Supervisor" 
              subtitle="Registro de supervisión de inmersiones" 
              icon={FileText} 
            />
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
          <Header 
            title="Bitácoras Supervisor" 
            subtitle="Registro completo de supervisión de inmersiones" 
            icon={FileText} 
          >
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
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Bitácora Supervisor
              </Button>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
            <BitacoraStats 
              bitacorasSupervisor={bitacorasSupervisor}
              bitacorasBuzo={bitacorasBuzo}
              filteredSupervisor={filteredBitacorasSupervisor}
              filteredBuzo={bitacorasBuzo}
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
                      ? "Comienza creando una nueva bitácora de supervisor"
                      : "Intenta ajustar los filtros de búsqueda"}
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Bitácora Supervisor
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {viewMode === 'table' ? (
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
                ) : (
                   <div className="text-center p-8 border rounded-lg bg-zinc-50">
                    <p className="text-zinc-500">La vista de tarjetas no está implementada aún.</p>
                  </div>
                )}
              </>
            )}
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent variant="form" className="max-w-7xl max-h-[95vh] overflow-y-auto p-0">
              <CreateBitacoraSupervisorFormComplete
                onSubmit={handleCreateSupervisor}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default BitacorasSupervisor;
