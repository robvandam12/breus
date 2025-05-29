
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, Plus, LayoutGrid, LayoutList, Pen } from "lucide-react";
import { BitacoraTableRow } from "@/components/bitacoras/BitacoraTableRow";
import { BitacoraFilters } from "@/components/bitacoras/BitacoraFilters";
import { BitacoraStats } from "@/components/bitacoras/BitacoraStats";
import { BitacoraSupervisorFormEnhanced } from "@/components/bitacoras/BitacoraSupervisorFormEnhanced";
import { useBitacoras, BitacoraSupervisorFormData } from "@/hooks/useBitacoras";
import { useBitacoraActions } from "@/hooks/useBitacoraActions";
import { useBitacoraFilters } from "@/hooks/useBitacoraFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

const BitacorasSupervisor = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
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
      await createBitacoraSupervisor(data);
      setIsCreateDialogOpen(false);
      refreshBitacoras();
      
      toast({
        title: "Bitácora creada",
        description: "La bitácora de supervisor ha sido creada exitosamente. Ahora puede firmarla desde la lista.",
      });
    } catch (error) {
      console.error('Error creating bitácora supervisor:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la bitácora de supervisor.",
        variant: "destructive",
      });
    }
  };

  const handleSignSupervisor = async (id: string) => {
    try {
      await signBitacoraSupervisor(id);
      refreshBitacoras();
      
      toast({
        title: "Bitácora firmada",
        description: "La bitácora de supervisor ha sido firmada exitosamente.",
      });
    } catch (error) {
      console.error('Error signing bitácora supervisor:', error);
      toast({
        title: "Error",
        description: "No se pudo firmar la bitácora de supervisor.",
        variant: "destructive",
      });
    }
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
                  <p className="text-sm text-zinc-500">Registro de supervisión de inmersiones</p>
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
                  onClick={() => setIsCreateDialogOpen(true)}
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
                        ? "Comience creando su primera bitácora de supervisor"
                        : "Intenta ajustar los filtros de búsqueda"}
                    </p>
                    {bitacorasSupervisor.length === 0 && (
                      <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
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
                        <tr key={bitacora.id} className="hover:bg-gray-50">
                          <td className="font-medium">{bitacora.codigo}</td>
                          <td className="text-sm text-gray-600">
                            {bitacora.inmersion_id ? `Inmersión ${bitacora.inmersion_id}` : 'Sin inmersión'}
                          </td>
                          <td>{bitacora.supervisor}</td>
                          <td>
                            {bitacora.fecha ? new Date(bitacora.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
                          </td>
                          <td>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              bitacora.firmado 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {bitacora.firmado ? 'Firmado' : 'Por Firmar'}
                            </span>
                          </td>
                          <td className="text-right">
                            <div className="flex justify-end gap-1">
                              {!bitacora.firmado && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleSignSupervisor(bitacora.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Pen className="w-3 h-3" />
                                  Firmar
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                Ver
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </div>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent variant="form" className="p-0 max-w-6xl max-h-[90vh] overflow-y-auto">
              <BitacoraSupervisorFormEnhanced
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
