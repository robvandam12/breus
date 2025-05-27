
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
import { Book, Plus, Search, Edit, Trash2, Eye, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { CreateBitacoraSupervisorForm } from "@/components/bitacoras/CreateBitacoraSupervisorForm";
import { useBitacoras } from "@/hooks/useBitacoras";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function BitacorasSupervisor() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'borrador' | 'firmado' | 'pendiente'>('all');
  
  const { bitacorasSupervisor, isLoading } = useBitacoras();

  const filteredBitacoras = bitacorasSupervisor.filter(bitacora => {
    const matchesSearch = bitacora.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bitacora.supervisor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'firmado' && bitacora.firmado) ||
                         (filterStatus === 'borrador' && !bitacora.firmado);
    return matchesSearch && matchesFilter;
  });

  const handleCreateBitacora = async (data: any) => {
    try {
      // Logic to create bitacora
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      console.error('Error creating Bitacora:', error);
    }
  };

  const getEstadoBadge = (firmado: boolean) => {
    if (firmado) {
      return { className: "bg-green-100 text-green-700", label: "Firmado", icon: CheckCircle };
    }
    return { className: "bg-gray-100 text-gray-700", label: "Borrador", icon: Clock };
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
        <div className="min-h-screen flex w-full">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col">
            <Header 
              title="Bitácoras Supervisor" 
              subtitle="Gestión de Bitácoras de Supervisor" 
              icon={Book} 
            />
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner text="Cargando Bitácoras..." />
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
            title="Bitácoras Supervisor" 
            subtitle="Gestión de Bitácoras de Supervisor" 
            icon={Book} 
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input
                  placeholder="Buscar Bitácoras..."
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
                  Todas
                </Button>
                <Button 
                  variant={filterStatus === 'borrador' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilterStatus('borrador')}
                >
                  Borradores
                </Button>
                <Button 
                  variant={filterStatus === 'firmado' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilterStatus('firmado')}
                >
                  Firmadas
                </Button>
              </div>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Bitácora
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <CreateBitacoraSupervisorForm
                    onSubmit={handleCreateBitacora}
                    onCancel={() => setIsCreateDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {bitacorasSupervisor.length}
                  </div>
                  <div className="text-sm text-zinc-500">Total Bitácoras</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {bitacorasSupervisor.filter(b => b.firmado).length}
                  </div>
                  <div className="text-sm text-zinc-500">Firmadas</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-gray-600">
                    {bitacorasSupervisor.filter(b => !b.firmado).length}
                  </div>
                  <div className="text-sm text-zinc-500">Borradores</div>
                </Card>
              </div>

              {filteredBitacoras.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Book className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay bitácoras registradas</h3>
                    <p className="text-zinc-500 mb-4">Comience creando la primera bitácora de supervisor</p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Bitácora
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
                        <TableHead>Fecha</TableHead>
                        <TableHead>Desarrollo</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBitacoras.map((bitacora) => {
                        const estadoInfo = getEstadoBadge(bitacora.firmado);
                        const IconComponent = estadoInfo.icon;
                        
                        return (
                          <TableRow key={bitacora.bitacora_id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Book className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-medium">{bitacora.codigo}</div>
                                  <div className="text-xs text-zinc-500">{formatDate(bitacora.created_at)}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-zinc-600">{bitacora.supervisor}</TableCell>
                            <TableCell className="text-zinc-600">{formatDate(bitacora.fecha)}</TableCell>
                            <TableCell className="text-zinc-600 max-w-xs truncate">
                              {bitacora.desarrollo_inmersion}
                            </TableCell>
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
                                <Button variant="outline" size="sm">
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
