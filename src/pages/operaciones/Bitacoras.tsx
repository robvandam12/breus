
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Plus, Users, LayoutGrid, LayoutList } from "lucide-react";
import { useBitacoras } from "@/hooks/useBitacoras";
import { CreateBitacoraSupervisorForm } from "@/components/bitacoras/CreateBitacoraSupervisorForm";
import { CreateBitacoraBuzoForm } from "@/components/bitacoras/CreateBitacoraBuzoForm";
import { BitacoraTableRow } from "@/components/bitacoras/BitacoraTableRow";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Bitacoras = () => {
  const [activeTab, setActiveTab] = useState("supervisor");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { 
    bitacorasSupervisor, 
    bitacorasBuzo, 
    loading, 
    createBitacoraSupervisor,
    createBitacoraBuzo,
    refreshBitacoras
  } = useBitacoras();

  const handleCreateSupervisor = async (data: any) => {
    try {
      await createBitacoraSupervisor(data);
      setIsCreateDialogOpen(false);
      await refreshBitacoras();
    } catch (error) {
      console.error('Error creating supervisor bitácora:', error);
    }
  };

  const handleCreateBuzo = async (data: any) => {
    try {
      await createBitacoraBuzo(data);
      setIsCreateDialogOpen(false);
      await refreshBitacoras();
    } catch (error) {
      console.error('Error creating buzo bitácora:', error);
    }
  };

  const handleSignBitacora = async (id: string) => {
    // TODO: Implementar firma digital
    console.log('Signing bitácora:', id);
  };

  const renderSupervisorTable = () => (
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
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <LoadingSpinner text="Cargando bitácoras..." />
              </TableCell>
            </TableRow>
          ) : bitacorasSupervisor.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No hay bitácoras de supervisor registradas
              </TableCell>
            </TableRow>
          ) : (
            bitacorasSupervisor.map((bitacora) => (
              <BitacoraTableRow 
                key={bitacora.id} 
                bitacora={bitacora} 
                type="supervisor"
                onSign={handleSignBitacora}
              />
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );

  const renderBuzoTable = () => (
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
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <LoadingSpinner text="Cargando bitácoras..." />
              </TableCell>
            </TableRow>
          ) : bitacorasBuzo.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No hay bitácoras de buzo registradas
              </TableCell>
            </TableRow>
          ) : (
            bitacorasBuzo.map((bitacora) => (
              <BitacoraTableRow 
                key={bitacora.id} 
                bitacora={bitacora} 
                type="buzo"
                onSign={handleSignBitacora}
              />
            ))
          )}
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
                <FileText className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Bitácoras</h1>
                  <p className="text-sm text-zinc-500">Registro de actividades y firmas digitales</p>
                </div>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="ios-button bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Bitácora
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                    {activeTab === "supervisor" ? (
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
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {bitacorasSupervisor.length}
                  </div>
                  <div className="text-sm text-zinc-500">Bitácoras Supervisor</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-teal-600">
                    {bitacorasBuzo.length}
                  </div>
                  <div className="text-sm text-zinc-500">Bitácoras Buzo</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {bitacorasSupervisor.filter(b => b.firmado).length + bitacorasBuzo.filter(b => b.firmado).length}
                  </div>
                  <div className="text-sm text-zinc-500">Firmadas</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-amber-600">
                    {bitacorasSupervisor.filter(b => !b.firmado).length + bitacorasBuzo.filter(b => !b.firmado).length}
                  </div>
                  <div className="text-sm text-zinc-500">Pendientes</div>
                </Card>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="supervisor" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Bitácoras Supervisor
                  </TabsTrigger>
                  <TabsTrigger value="buzo" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Bitácoras Buzo
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="supervisor" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-zinc-900">Bitácoras de Supervisor</h2>
                      <p className="text-sm text-zinc-500">
                        Registro y supervisión de inmersiones por parte del supervisor
                      </p>
                    </div>
                  </div>
                  {renderSupervisorTable()}
                </TabsContent>
                
                <TabsContent value="buzo" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-zinc-900">Bitácoras de Buzo</h2>
                      <p className="text-sm text-zinc-500">
                        Registro personal de actividades por parte del buzo
                      </p>
                    </div>
                  </div>
                  {renderBuzoTable()}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Bitacoras;
