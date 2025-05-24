
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Plus, LayoutGrid, LayoutList, Loader2 } from "lucide-react";
import { CreateBitacoraSupervisorForm } from "@/components/bitacoras/CreateBitacoraSupervisorForm";
import { CreateBitacoraBuzoForm } from "@/components/bitacoras/CreateBitacoraBuzoForm";
import { BitacoraTableRow } from "@/components/bitacoras/BitacoraTableRow";
import { useBitacoras, BitacoraSupervisorFormData, BitacoraBuzoFormData } from "@/hooks/useBitacoras";
import { useBitacoraActions } from "@/hooks/useBitacoraActions";

const Bitacoras = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createType, setCreateType] = useState<'supervisor' | 'buzo'>('supervisor');
  
  const { 
    bitacorasSupervisor, 
    bitacorasBuzo, 
    loading, 
    createBitacoraSupervisor, 
    createBitacoraBuzo,
    refreshBitacoras 
  } = useBitacoras();
  
  const { signBitacoraSupervisor, signBitacoraBuzo } = useBitacoraActions();

  const handleCreateSupervisor = async (data: BitacoraSupervisorFormData) => {
    try {
      await createBitacoraSupervisor(data);
      setIsCreateDialogOpen(false);
      refreshBitacoras();
    } catch (error) {
      console.error('Error creating bitácora supervisor:', error);
    }
  };

  const handleCreateBuzo = async (data: BitacoraBuzoFormData) => {
    try {
      await createBitacoraBuzo(data);
      setIsCreateDialogOpen(false);
      refreshBitacoras();
    } catch (error) {
      console.error('Error creating bitácora buzo:', error);
    }
  };

  const handleSignSupervisor = async (id: string) => {
    await signBitacoraSupervisor(id);
    refreshBitacoras();
  };

  const handleSignBuzo = async (id: string) => {
    await signBitacoraBuzo(id);
    refreshBitacoras();
  };

  const openCreateDialog = (type: 'supervisor' | 'buzo') => {
    setCreateType(type);
    setIsCreateDialogOpen(true);
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
                    <h1 className="text-xl font-semibold text-zinc-900">Bitácoras</h1>
                    <p className="text-sm text-zinc-500">Registro de inmersiones</p>
                  </div>
                </div>
              </div>
            </header>
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Cargando bitácoras...</span>
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
          <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Bitácoras</h1>
                  <p className="text-sm text-zinc-500">Registro de inmersiones</p>
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
                  onClick={() => openCreateDialog('supervisor')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Bitácora Supervisor
                </Button>
                
                <Button
                  onClick={() => openCreateDialog('buzo')}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Bitácora Buzo
                </Button>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              <Tabs defaultValue="supervisor" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="supervisor" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Bitácoras de Supervisor
                  </TabsTrigger>
                  <TabsTrigger value="buzo" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Bitácoras de Buzo
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="supervisor">
                  {bitacorasSupervisor.length === 0 ? (
                    <Card className="text-center py-12">
                      <CardContent>
                        <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay bitácoras de supervisor</h3>
                        <p className="text-zinc-500 mb-4">Comienza creando tu primera bitácora de supervisor</p>
                        <Button onClick={() => openCreateDialog('supervisor')} className="bg-purple-600 hover:bg-purple-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Nueva Bitácora Supervisor
                        </Button>
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
                          {bitacorasSupervisor.map((bitacora) => (
                            <BitacoraTableRow
                              key={bitacora.id}
                              bitacora={bitacora}
                              type="supervisor"
                              onSign={handleSignSupervisor}
                            />
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="buzo">
                  {bitacorasBuzo.length === 0 ? (
                    <Card className="text-center py-12">
                      <CardContent>
                        <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay bitácoras de buzo</h3>
                        <p className="text-zinc-500 mb-4">Comienza creando tu primera bitácora de buzo</p>
                        <Button onClick={() => openCreateDialog('buzo')} className="bg-teal-600 hover:bg-teal-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Nueva Bitácora Buzo
                        </Button>
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
                          {bitacorasBuzo.map((bitacora) => (
                            <BitacoraTableRow
                              key={bitacora.id}
                              bitacora={bitacora}
                              type="buzo"
                              onSign={handleSignBuzo}
                            />
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
              {createType === 'supervisor' ? (
                <CreateBitacoraSupervisorForm
                  onSubmit={handleCreateSupervisor}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              ) : (
                <CreateBitacoraBuzoForm
                  onSubmit={handleCreateBuzo}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Bitacoras;
