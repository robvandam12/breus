
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings, Plus, Search, Edit, Trash2, Eye, FileText, Clock, CheckCircle } from "lucide-react";
import { CreateOperacionForm } from "@/components/operaciones/CreateOperacionForm";
import { WorkflowCard } from "@/components/workflow/WorkflowCard";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useWorkflow } from "@/hooks/useWorkflow";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Operaciones = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOperacion, setSelectedOperacion] = useState<string | null>(null);
  
  const { operaciones, isLoading, createOperacion, updateOperacion, deleteOperacion } = useOperaciones();
  const { workflowStatus, refetch: refetchWorkflow } = useWorkflow(selectedOperacion || undefined);

  const filteredOperaciones = operaciones.filter(operacion => 
    operacion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operacion.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateOperacion = async (data: any) => {
    try {
      await createOperacion(data);
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      console.error('Error creating operacion:', error);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const estadoMap: Record<string, { className: string; label: string; icon: any }> = {
      activa: { className: "bg-green-100 text-green-700", label: "Activa", icon: CheckCircle },
      pausada: { className: "bg-yellow-100 text-yellow-700", label: "Pausada", icon: Clock },
      completada: { className: "bg-blue-100 text-blue-700", label: "Completada", icon: CheckCircle },
      cancelada: { className: "bg-red-100 text-red-700", label: "Cancelada", icon: Clock }
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
                  <Settings className="w-6 h-6 text-zinc-600" />
                  <div>
                    <h1 className="text-xl font-semibold text-zinc-900">Operaciones</h1>
                    <p className="text-sm text-zinc-500">Gestión de Operaciones de Buceo</p>
                  </div>
                </div>
              </div>
            </header>
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner text="Cargando Operaciones..." />
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
                <Settings className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Operaciones</h1>
                  <p className="text-sm text-zinc-500">Gestión de Operaciones de Buceo</p>
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

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="ios-button bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Operación
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <CreateOperacionForm
                      onSubmit={handleCreateOperacion}
                      onCancel={() => setIsCreateDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lista de Operaciones */}
                <div className="lg:col-span-2">
                  {filteredOperaciones.length === 0 ? (
                    <Card className="text-center py-12">
                      <CardContent>
                        <Settings className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay operaciones registradas</h3>
                        <p className="text-zinc-500 mb-4">Comience creando la primera operación de buceo</p>
                        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Nueva Operación
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>Lista de Operaciones</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Código</TableHead>
                              <TableHead>Nombre</TableHead>
                              <TableHead>Fecha Inicio</TableHead>
                              <TableHead>Estado</TableHead>
                              <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredOperaciones.map((operacion) => {
                              const estadoInfo = getEstadoBadge(operacion.estado);
                              const IconComponent = estadoInfo.icon;
                              
                              return (
                                <TableRow 
                                  key={operacion.id}
                                  className={selectedOperacion === operacion.id ? "bg-blue-50" : "cursor-pointer hover:bg-gray-50"}
                                  onClick={() => setSelectedOperacion(operacion.id)}
                                >
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-blue-600" />
                                      </div>
                                      <div>
                                        <div className="font-medium">{operacion.codigo}</div>
                                        <div className="text-xs text-zinc-500">{formatDate(operacion.created_at)}</div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="font-medium">{operacion.nombre}</TableCell>
                                  <TableCell className="text-zinc-600">{formatDate(operacion.fecha_inicio)}</TableCell>
                                  <TableCell>
                                    <Badge variant="secondary" className={estadoInfo.className}>
                                      <IconComponent className="w-3 h-3 mr-1" />
                                      {estadoInfo.label}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                      <Button variant="outline" size="sm">
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteOperacion(operacion.id);
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Panel de Workflow */}
                <div className="lg:col-span-1">
                  {selectedOperacion && workflowStatus ? (
                    <WorkflowCard 
                      status={workflowStatus} 
                      onRefresh={refetchWorkflow}
                    />
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                        <h3 className="font-medium text-zinc-900 mb-2">Seleccione una operación</h3>
                        <p className="text-sm text-zinc-500">
                          Haga clic en una operación para ver su flujo de trabajo
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Operaciones;
