
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Plus, Search, Edit, Trash2, Eye, FileText, Clock, CheckCircle, Users, X, Waves, ClipboardCheck } from "lucide-react";
import { CreateOperacionForm } from "@/components/operaciones/CreateOperacionForm";
import { OperacionTeamManager } from "@/components/operaciones/OperacionTeamManager";
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
  const [activeTab, setActiveTab] = useState("details");
  
  const { operaciones, isLoading, createOperacion, updateOperacion, deleteOperacion } = useOperaciones();
  const { workflowStatus, refetch: refetchWorkflow } = useWorkflow(selectedOperacion || undefined);

  const filteredOperaciones = operaciones.filter(operacion => 
    operacion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operacion.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOp = operaciones.find(op => op.id === selectedOperacion);

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

  const getWorkflowStepInfo = (step: string) => {
    const stepMap: Record<string, { label: string; icon: any; color: string }> = {
      operacion: { label: "Operación Creada", icon: FileText, color: "blue" },
      hpt: { label: "HPT Pendiente", icon: ClipboardCheck, color: "orange" },
      anexo_bravo: { label: "Anexo Bravo Pendiente", icon: FileText, color: "purple" },
      inmersion: { label: "Inmersión Pendiente", icon: Waves, color: "teal" },
      bitacora: { label: "Bitácoras Pendientes", icon: FileText, color: "green" },
      completado: { label: "Completado", icon: CheckCircle, color: "green" }
    };
    return stepMap[step] || stepMap.operacion;
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
              {selectedOperacion ? (
                // Vista detalle para iPad
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedOperacion(null)}
                      className="ios-button"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Volver
                    </Button>
                    {selectedOp && (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{selectedOp.codigo}</h2>
                          <p className="text-zinc-600">{selectedOp.nombre}</p>
                        </div>
                        {workflowStatus && (
                          <Badge variant="outline" className="ml-auto">
                            {getWorkflowStepInfo(workflowStatus.workflow_step).label}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Detalles
                      </TabsTrigger>
                      <TabsTrigger value="workflow" className="flex items-center gap-2">
                        <ClipboardCheck className="w-4 h-4" />
                        Flujo de Trabajo
                      </TabsTrigger>
                      <TabsTrigger value="team" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Equipo
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                      <Card className="ios-card">
                        <CardHeader>
                          <CardTitle>Información de la Operación</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {selectedOp && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="text-sm font-medium text-zinc-700">Fecha Inicio</label>
                                <p className="text-lg">{formatDate(selectedOp.fecha_inicio)}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-zinc-700">Estado</label>
                                <div className="mt-1">
                                  {(() => {
                                    const estadoInfo = getEstadoBadge(selectedOp.estado);
                                    const IconComponent = estadoInfo.icon;
                                    return (
                                      <Badge variant="secondary" className={estadoInfo.className}>
                                        <IconComponent className="w-3 h-3 mr-1" />
                                        {estadoInfo.label}
                                      </Badge>
                                    );
                                  })()}
                                </div>
                              </div>
                              {selectedOp.fecha_fin && (
                                <div>
                                  <label className="text-sm font-medium text-zinc-700">Fecha Fin</label>
                                  <p className="text-lg">{formatDate(selectedOp.fecha_fin)}</p>
                                </div>
                              )}
                              {selectedOp.tareas && (
                                <div className="md:col-span-2">
                                  <label className="text-sm font-medium text-zinc-700">Tareas</label>
                                  <p className="text-zinc-600 mt-1">{selectedOp.tareas}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="workflow">
                      {workflowStatus ? (
                        <WorkflowCard 
                          status={workflowStatus} 
                          onRefresh={refetchWorkflow}
                        />
                      ) : (
                        <Card className="ios-card">
                          <CardContent className="p-12 text-center">
                            <ClipboardCheck className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                            <h3 className="font-medium text-zinc-900 mb-2">Cargando flujo de trabajo</h3>
                            <p className="text-sm text-zinc-500">Obteniendo estado de la operación...</p>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="team">
                      <OperacionTeamManager 
                        operacionId={selectedOperacion}
                        salmoneraId={selectedOp?.salmonera_id || ""} 
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                // Vista lista
                <div className="space-y-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredOperaciones.map((operacion) => {
                        const estadoInfo = getEstadoBadge(operacion.estado);
                        const IconComponent = estadoInfo.icon;
                        
                        return (
                          <Card 
                            key={operacion.id}
                            className="ios-card cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                            onClick={() => setSelectedOperacion(operacion.id)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-zinc-900">{operacion.codigo}</h3>
                                    <p className="text-sm text-zinc-500">{formatDate(operacion.created_at)}</p>
                                  </div>
                                </div>
                                <Badge variant="secondary" className={estadoInfo.className}>
                                  <IconComponent className="w-3 h-3 mr-1" />
                                  {estadoInfo.label}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <h4 className="font-medium text-zinc-900 mb-2">{operacion.nombre}</h4>
                              <div className="space-y-2 text-sm text-zinc-600">
                                <div>
                                  <span className="font-medium">Inicio:</span> {formatDate(operacion.fecha_inicio)}
                                </div>
                                {operacion.fecha_fin && (
                                  <div>
                                    <span className="font-medium">Fin:</span> {formatDate(operacion.fecha_fin)}
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2 mt-4">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedOperacion(operacion.id);
                                    setActiveTab("team");
                                  }}
                                  className="flex-1"
                                >
                                  <Users className="w-4 h-4 mr-1" />
                                  Equipo
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteOperacion(operacion.id);
                                  }}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Operaciones;
