
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Waves, Plus, Search, Edit, Trash2, Eye, AlertTriangle, CheckCircle, Clock, Activity } from "lucide-react";
import { CreateInmersionForm } from "@/components/inmersiones/CreateInmersionForm";
import { useInmersiones } from "@/hooks/useInmersiones";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Inmersiones = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'planificada' | 'en_progreso' | 'completada' | 'cancelada'>('all');
  
  const { inmersiones, isLoading, createInmersion, updateInmersion, deleteInmersion } = useInmersiones();

  const filteredInmersiones = inmersiones.filter(inmersion => {
    const matchesSearch = inmersion.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inmersion.buzo_principal.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inmersion.supervisor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || inmersion.estado === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateInmersion = async (data: any) => {
    try {
      await createInmersion(data);
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      console.error('Error creating Inmersion:', error);
      // El hook ya maneja el toast de error
    }
  };

  const getEstadoBadge = (estado: string) => {
    const estadoMap: Record<string, { className: string; label: string; icon: any }> = {
      planificada: { className: "bg-blue-100 text-blue-700", label: "Planificada", icon: Clock },
      en_progreso: { className: "bg-yellow-100 text-yellow-700", label: "En Progreso", icon: Activity },
      completada: { className: "bg-green-100 text-green-700", label: "Completada", icon: CheckCircle },
      cancelada: { className: "bg-red-100 text-red-700", label: "Cancelada", icon: AlertTriangle }
    };
    return estadoMap[estado] || estadoMap.planificada;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A";
    return timeString.slice(0, 5); // HH:MM format
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-white">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col">
            <Header 
              title="Inmersiones" 
              subtitle="Gestión de Inmersiones de Buceo" 
              icon={Waves} 
            />
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner text="Cargando Inmersiones..." />
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Inmersiones" 
            subtitle="Gestión de Inmersiones de Buceo" 
            icon={Waves} 
          >
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Inmersión
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <CreateInmersionForm
                  onSubmit={handleCreateInmersion}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {/* Filtros movidos al contenido */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar Inmersiones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant={filterStatus === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus('all')}
                  >
                    Todas
                  </Button>
                  <Button 
                    variant={filterStatus === 'planificada' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus('planificada')}
                  >
                    Planificadas
                  </Button>
                  <Button 
                    variant={filterStatus === 'en_progreso' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus('en_progreso')}
                  >
                    En Progreso
                  </Button>
                  <Button 
                    variant={filterStatus === 'completada' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus('completada')}
                  >
                    Completadas
                  </Button>
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {inmersiones.length}
                  </div>
                  <div className="text-sm text-zinc-500">Total Inmersiones</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {inmersiones.filter(i => i.estado === 'completada').length}
                  </div>
                  <div className="text-sm text-zinc-500">Completadas</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {inmersiones.filter(i => i.estado === 'en_progreso').length}
                  </div>
                  <div className="text-sm text-zinc-500">En Progreso</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {inmersiones.filter(i => i.estado === 'planificada').length}
                  </div>
                  <div className="text-sm text-zinc-500">Planificadas</div>
                </Card>
              </div>

              {filteredInmersiones.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Waves className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay inmersiones registradas</h3>
                    <p className="text-zinc-500 mb-4">Comience creando la primera inmersión de buceo</p>
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Inmersión
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Buzo Principal</TableHead>
                        <TableHead>Supervisor</TableHead>
                        <TableHead>Fecha/Hora</TableHead>
                        <TableHead>Profundidad</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Validación</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInmersiones.map((inmersion) => {
                        const estadoInfo = getEstadoBadge(inmersion.estado);
                        const IconComponent = estadoInfo.icon;
                        
                        return (
                          <TableRow key={inmersion.inmersion_id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Waves className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-medium">{inmersion.codigo}</div>
                                  <div className="text-xs text-zinc-500">{formatDate(inmersion.created_at)}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-zinc-600">{inmersion.buzo_principal}</TableCell>
                            <TableCell className="text-zinc-600">{inmersion.supervisor}</TableCell>
                            <TableCell className="text-zinc-600">
                              <div>
                                <div>{formatDate(inmersion.fecha_inmersion)}</div>
                                <div className="text-xs text-zinc-500">
                                  {formatTime(inmersion.hora_inicio)} - {formatTime(inmersion.hora_fin)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-zinc-600">
                              {inmersion.profundidad_maxima}m
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={estadoInfo.className}>
                                <IconComponent className="w-3 h-3 mr-1" />
                                {estadoInfo.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Badge 
                                  variant="secondary" 
                                  className={inmersion.hpt_validado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                                >
                                  HPT
                                </Badge>
                                <Badge 
                                  variant="secondary" 
                                  className={inmersion.anexo_bravo_validado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                                >
                                  AB
                                </Badge>
                              </div>
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
                                  onClick={() => deleteInmersion(inmersion.inmersion_id)}
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

export default Inmersiones;
