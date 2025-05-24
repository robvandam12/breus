
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Plus, Calendar, Users, CheckCircle } from "lucide-react";
import { useBitacoras } from "@/hooks/useBitacoras";

const Bitacoras = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { bitacorasSupervisor, bitacorasBuzo, loading } = useBitacoras();

  const getEstadoBadge = (firmado: boolean) => {
    return firmado ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700";
  };

  const formatEstado = (firmado: boolean) => {
    return firmado ? 'Firmada' : 'Pendiente';
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
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Cargando bitácoras...
                </div>
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
              <TableRow key={bitacora.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="font-medium">{bitacora.codigo}</div>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-600">{bitacora.inmersion_codigo}</TableCell>
                <TableCell className="text-zinc-600">{bitacora.supervisor}</TableCell>
                <TableCell className="text-zinc-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {bitacora.fecha}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getEstadoBadge(bitacora.firmado)}>
                    {formatEstado(bitacora.firmado)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                    {!bitacora.firmado && (
                      <Button size="sm">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Firmar
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
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
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Cargando bitácoras...
                </div>
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
              <TableRow key={bitacora.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="font-medium">{bitacora.codigo}</div>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-600">{bitacora.inmersion_codigo}</TableCell>
                <TableCell className="text-zinc-600">{bitacora.buzo}</TableCell>
                <TableCell className="text-zinc-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {bitacora.fecha}
                  </div>
                </TableCell>
                <TableCell className="text-zinc-600">{bitacora.profundidad_maxima}m</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getEstadoBadge(bitacora.firmado)}>
                    {formatEstado(bitacora.firmado)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                    {!bitacora.firmado && (
                      <Button size="sm">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Firmar
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
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
                    <Button className="ios-button">
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Bitácora
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
                    {/* TODO: Implementar formulario de bitácora */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Crear Nueva Bitácora</h3>
                      <p className="text-gray-500">Formulario de bitácora pendiente de implementación</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              <Tabs defaultValue="supervisor" className="space-y-6">
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
