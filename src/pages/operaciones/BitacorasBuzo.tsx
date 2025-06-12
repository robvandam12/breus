
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Plus, LayoutGrid, LayoutList, AlertTriangle, Users } from "lucide-react";
import { CreateBitacoraBuzoFormComplete } from "@/components/bitacoras/CreateBitacoraBuzoFormComplete";
import { BitacoraTableRow } from "@/components/bitacoras/BitacoraTableRow";
import { BitacoraFilters } from "@/components/bitacoras/BitacoraFilters";
import { BitacoraStats } from "@/components/bitacoras/BitacoraStats";
import { useBitacoraEnhanced } from "@/hooks/useBitacoraEnhanced";
import { useBitacoras } from "@/hooks/useBitacoras";
import { useBitacoraActions } from "@/hooks/useBitacoraActions";
import { useBitacoraFilters } from "@/hooks/useBitacoraFilters";
import { BitacoraBuzoFormData } from "@/hooks/useBitacoras";
import { Skeleton } from "@/components/ui/skeleton";

const BitacorasBuzo = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { 
    bitacorasBuzo, 
    bitacorasSupervisor,
    loading 
  } = useBitacoraEnhanced();
  
  const { createBitacoraBuzo } = useBitacoras();
  const { signBitacoraBuzo } = useBitacoraActions();
  const { filters, setFilters, filterBitacoras } = useBitacoraFilters();

  const filteredBitacorasBuzo = filterBitacoras(bitacorasBuzo);

  const handleCreateBuzo = async (data: BitacoraBuzoFormData) => {
    try {
      await createBitacoraBuzo.mutateAsync(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating bitácora buzo:', error);
    }
  };

  const handleSignBuzo = async (id: string) => {
    await signBitacoraBuzo(id);
  };

  // Check if there are supervisor logs available
  const hasSupervisorLogs = bitacorasSupervisor.length > 0;

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <Header 
              title="Bitácoras Buzo" 
              subtitle="Registro personal de inmersiones" 
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
            title="Bitácoras Buzo" 
            subtitle="Registro completo personal de inmersiones basado en bitácoras de supervisor" 
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
                className="bg-teal-600 hover:bg-teal-700"
                disabled={!hasSupervisorLogs}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Bitácora Buzo
              </Button>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {/* Supervisor Requirement Alert */}
              {!hasSupervisorLogs && (
                <Alert className="mb-6 border-orange-200 bg-orange-50">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Bitácoras de Supervisor Requeridas:</strong> Las bitácoras de buzo requieren 
                    datos de inmersión registrados por el supervisor. Debe crear primero una bitácora 
                    de supervisor que incluya el registro de inmersiones del equipo de buceo.
                  </AlertDescription>
                </Alert>
              )}

              {/* Emergency Diver Info */}
              <Alert className="mb-6 border-blue-200 bg-blue-50">
                <Users className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Buzos de Emergencia:</strong> Los buzos designados como "emergencia" 
                  que no realizan inmersión efectiva no generan bitácora individual, 
                  pero se registran en la bitácora del supervisor como parte del equipo.
                </AlertDescription>
              </Alert>

              <BitacoraStats 
                bitacorasSupervisor={bitacorasSupervisor}
                bitacorasBuzo={bitacorasBuzo}
                filteredSupervisor={bitacorasSupervisor}
                filteredBuzo={filteredBitacorasBuzo}
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

              {filteredBitacorasBuzo.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">
                      {bitacorasBuzo.length === 0 
                        ? "No hay bitácoras de buzo" 
                        : "No se encontraron resultados"}
                    </h3>
                    <p className="text-zinc-500 mb-4">
                      {bitacorasBuzo.length === 0 
                        ? hasSupervisorLogs 
                          ? "Comienza creando bitácoras de buzo basadas en los registros del supervisor"
                          : "Primero necesitas bitácoras de supervisor con datos de inmersión"
                        : "Intenta ajustar los filtros de búsqueda"}
                    </p>
                    {bitacorasBuzo.length === 0 && hasSupervisorLogs && (
                      <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-teal-600 hover:bg-teal-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Nueva Bitácora Buzo
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
                        <TableHead>Buzo</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Profundidad</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBitacorasBuzo.map((bitacora) => (
                        <BitacoraTableRow
                          key={bitacora.bitacora_id}
                          bitacora={bitacora}
                          type="buzo"
                          onSign={handleSignBuzo}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </div>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent variant="form" className="max-w-7xl max-h-[95vh] overflow-y-auto p-0">
              <CreateBitacoraBuzoFormComplete
                onSubmit={handleCreateBuzo}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default BitacorasBuzo;
