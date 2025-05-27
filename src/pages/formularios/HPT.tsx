
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Plus, Search, Edit, Trash2, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { HPTWizard } from "@/components/hpt/HPTWizard";
import { useHPT } from "@/hooks/useHPT";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function HPT() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'borrador' | 'firmado' | 'pendiente'>('all');
  
  const { hpts, isLoading, createHPT, deleteHPT } = useHPT();

  const filteredHPTs = hpts.filter(hpt => {
    const matchesSearch = (hpt.codigo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (hpt.supervisor || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || hpt.estado === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateComplete = (hptId: string) => {
    setIsCreateDialogOpen(false);
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
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col">
            <Header 
              title="HPT" 
              subtitle="Herramientas de Planificación de Trabajo" 
              icon={FileText} 
            />
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
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="HPT" 
            subtitle="Herramientas de Planificación de Trabajo" 
            icon={FileText} 
          >
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
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo HPT
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                  <HPTWizard
                    onComplete={handleCreateComplete}
                    onCancel={() => setIsCreateDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
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
                  <div className="text-sm text-zinc-500">Firmados</div>
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
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay HPTs registrados</h3>
                    <p className="text-zinc-500 mb-4">Comience creando la primera herramienta de planificación</p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo HPT
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
                        <TableHead>Plan de Trabajo</TableHead>
                        <TableHead>Fecha Programada</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Progreso</TableHead>
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
                                  <div className="font-medium">{hpt.codigo || 'Sin código'}</div>
                                  <div className="text-xs text-zinc-500">{formatDate(hpt.created_at)}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-zinc-600">{hpt.supervisor || 'N/A'}</TableCell>
                            <TableCell className="text-zinc-600 max-w-xs truncate">
                              {hpt.plan_trabajo || 'N/A'}
                            </TableCell>
                            <TableCell className="text-zinc-600">
                              {formatDate(hpt.fecha_programada)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={estadoInfo.className}>
                                <IconComponent className="w-3 h-3 mr-1" />
                                {estadoInfo.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${hpt.progreso || 0}%` }}
                                  />
                                </div>
                                <span className="text-xs text-zinc-500">{hpt.progreso || 0}%</span>
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
}
