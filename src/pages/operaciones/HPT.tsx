import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Plus, Search, Edit, Trash2, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { CreateHPTForm } from "@/components/hpt/CreateHPTForm";
import { useHPT } from "@/hooks/useHPT";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const HPT = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'borrador' | 'firmado' | 'pendiente'>('all');
  
  const { hpts, isLoading, createHPT, updateHPT, deleteHPT } = useHPT();

  const filteredHPTs = hpts.filter(hpt => {
    const matchesSearch = hpt.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hpt.supervisor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || hpt.estado === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateHPT = async (data: any) => {
    try {
      await createHPT(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating HPT:', error);
    }
  };

  const handleWizardSubmit = async (data: any) => {
    try {
      // Transformar los datos del wizard al formato esperado por la API
      const hptData = {
        codigo: data.folio || `HPT-${Date.now()}`,
        supervisor: data.supervisor_nombre,
        operacion_id: data.operacion_id,
        plan_trabajo: data.plan_trabajo,
        fecha_programada: data.fecha,
        hora_inicio: data.hora_inicio,
        hora_fin: data.hora_termino,
        descripcion_trabajo: data.descripcion_tarea,
        observaciones: data.observaciones,
        // Nuevos campos específicos
        folio: data.folio,
        fecha: data.fecha,
        hora_termino: data.hora_termino,
        empresa_servicio_nombre: data.empresa_servicio_nombre,
        supervisor_nombre: data.supervisor_nombre,
        centro_trabajo_nombre: data.centro_trabajo_nombre,
        jefe_mandante_nombre: data.jefe_mandante_nombre,
        descripcion_tarea: data.descripcion_tarea,
        es_rutinaria: data.es_rutinaria,
        lugar_especifico: data.lugar_especifico,
        estado_puerto: data.estado_puerto,
        hpt_epp: data.hpt_epp,
        hpt_erc: data.hpt_erc,
        hpt_medidas: data.hpt_medidas,
        hpt_riesgos_comp: data.hpt_riesgos_comp,
        hpt_conocimiento: data.hpt_conocimiento,
        hpt_conocimiento_asistentes: data.hpt_conocimiento_asistentes,
        plan_emergencia: data.plan_emergencia,
        contactos_emergencia: data.contactos_emergencia,
        hospital_cercano: data.hospital_cercano,
        camara_hiperbarica: data.camara_hiperbarica,
        supervisor_firma: data.supervisor_firma,
        jefe_obra_firma: data.jefe_obra_firma
      };

      await createHPT(hptData);
      setIsWizardOpen(false);
    } catch (error) {
      console.error('Error creating HPT:', error);
    }
  };

  const getEstadoBadge = (estado: string, firmado: boolean) => {
    if (firmado) {
      return { className: "bg-green-100 text-green-700", label: "Firmado", icon: CheckCircle };
    }
    
    const estadoMap: Record<string, { className: string; label: string; icon: any }> = {
      borrador: { className: "bg-gray-100 text-gray-700", label: "Borrador", icon: Clock },
      pendiente: { className: "bg-yellow-100 text-yellow-700", label: "Pendiente Firma", icon: AlertCircle },
      completado: { className: "bg-blue-100 text-blue-700", label: "Completado", icon: CheckCircle }
    };
    return estadoMap[estado] || estadoMap.borrador;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "N/A";
    try {
      const [hours, minutes] = timeString.split(':');
      return `${hours}:${minutes}`;
    } catch {
      return timeString;
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
                  <FileText className="w-6 h-6 text-zinc-600" />
                  <div>
                    <h1 className="text-xl font-semibold text-zinc-900">HPT</h1>
                    <p className="text-sm text-zinc-500">Hojas de Planificación de Tarea</p>
                  </div>
                </div>
              </div>
            </header>
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner text="Cargando HPTs..." />
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
                  <h1 className="text-xl font-semibold text-zinc-900">HPT</h1>
                  <p className="text-sm text-zinc-500">Hojas de Planificación de Tarea</p>
                </div>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar HPTs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant={filterStatus === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus('all')}
                  >
                    Todos
                  </Button>
                  <Button 
                    variant={filterStatus === 'borrador' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus('borrador')}
                  >
                    Borrador
                  </Button>
                  <Button 
                    variant={filterStatus === 'pendiente' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus('pendiente')}
                  >
                    Pendientes
                  </Button>
                  <Button 
                    variant={filterStatus === 'firmado' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus('firmado')}
                  >
                    Firmados
                  </Button>
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="ios-button bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva HPT
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                    <CreateHPTForm
                      onSubmit={handleCreateHPT}
                      onCancel={() => setIsCreateDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>

                <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
                  <DialogTrigger asChild>
                    <Button className="ios-button bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      HPT Completa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0">
                    <HPTWizard
                      onSubmit={handleWizardSubmit}
                      onCancel={() => setIsWizardOpen(false)}
                    />
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
                  <div className="text-2xl font-bold text-blue-600">
                    {hpts.length}
                  </div>
                  <div className="text-sm text-zinc-500">Total HPTs</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {hpts.filter(h => h.firmado).length}
                  </div>
                  <div className="text-sm text-zinc-500">Firmadas</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {hpts.filter(h => !h.firmado && h.estado === 'pendiente').length}
                  </div>
                  <div className="text-sm text-zinc-500">Pendientes</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-gray-600">
                    {hpts.filter(h => h.estado === 'borrador').length}
                  </div>
                  <div className="text-sm text-zinc-500">Borradores</div>
                </Card>
              </div>

              {filteredHPTs.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay HPTs registradas</h3>
                    <p className="text-zinc-500 mb-4">Comience creando la primera Hoja de Planificación de Tarea</p>
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva HPT
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Supervisor</TableHead>
                        <TableHead>Fecha Programada</TableHead>
                        <TableHead>Horario</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Operación</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHPTs.map((hpt) => {
                        const estadoInfo = getEstadoBadge(hpt.estado || 'borrador', hpt.firmado);
                        const IconComponent = estadoInfo.icon;
                        
                        return (
                          <TableRow key={hpt.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-medium">{hpt.codigo}</div>
                                  <div className="text-xs text-zinc-500">{formatDate(hpt.created_at)}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-zinc-600">{hpt.supervisor}</TableCell>
                            <TableCell className="text-zinc-600">
                              {hpt.fecha_programada ? formatDate(hpt.fecha_programada) : "N/A"}
                            </TableCell>
                            <TableCell className="text-zinc-600">
                              {hpt.hora_inicio && hpt.hora_fin 
                                ? `${formatTime(hpt.hora_inicio)} - ${formatTime(hpt.hora_fin)}`
                                : "N/A"
                              }
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={estadoInfo.className}>
                                <IconComponent className="w-3 h-3 mr-1" />
                                {estadoInfo.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-zinc-600">
                              {hpt.operacion_id || "N/A"}
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
                                  onClick={() => deleteHPT(hpt.id)}
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
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default HPT;
