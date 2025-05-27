
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Search, Edit, Trash2, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AnexoBravoWizard } from "@/components/anexo-bravo/AnexoBravoWizard";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AnexoBravo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'borrador' | 'firmado' | 'pendiente'>('all');
  
  const { anexosBravo, isLoading, createAnexoBravo, deleteAnexoBravo } = useAnexoBravo();

  // Ensure anexosBravo is always an array
  const safeAnexosBravo = anexosBravo || [];

  const filteredAnexos = safeAnexosBravo.filter(anexo => {
    if (!anexo) return false;
    const matchesSearch = (anexo.codigo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (anexo.supervisor || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || anexo.estado === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateAnexoBravo = async (data: any) => {
    try {
      await createAnexoBravo(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating Anexo Bravo:', error);
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
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  const handleDeleteAnexo = async (id: string) => {
    try {
      await deleteAnexoBravo(id);
    } catch (error) {
      console.error('Error deleting Anexo Bravo:', error);
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col">
            <Header 
              title="Anexo Bravo" 
              subtitle="Lista de chequeo para faenas de buceo" 
              icon={FileText} 
            />
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner text="Cargando Anexos Bravo..." />
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
            title="Anexo Bravo" 
            subtitle="Lista de chequeo para faenas de buceo" 
            icon={FileText} 
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input
                  placeholder="Buscar Anexos Bravo..."
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
                    Nuevo Anexo Bravo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
                  <AnexoBravoWizard
                    onSubmit={handleCreateAnexoBravo}
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
                  <div className="text-2xl font-bold text-green-600">
                    {safeAnexosBravo.length}
                  </div>
                  <div className="text-sm text-zinc-500">Total Anexos Bravo</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {safeAnexosBravo.filter(a => a?.firmado).length}
                  </div>
                  <div className="text-sm text-zinc-500">Firmados</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {safeAnexosBravo.filter(a => a && !a.firmado && a.estado === 'pendiente').length}
                  </div>
                  <div className="text-sm text-zinc-500">Pendientes</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-gray-600">
                    {safeAnexosBravo.filter(a => a?.estado === 'borrador').length}
                  </div>
                  <div className="text-sm text-zinc-500">Borradores</div>
                </Card>
              </div>

              {filteredAnexos.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay Anexos Bravo registrados</h3>
                    <p className="text-zinc-500 mb-4">Comience creando el primer formulario de verificación de equipos</p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Anexo Bravo
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
                        <TableHead>Jefe de Centro</TableHead>
                        <TableHead>Fecha Verificación</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Progreso</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAnexos.map((anexo) => {
                        if (!anexo || !anexo.id) return null;
                        
                        const estadoInfo = getEstadoBadge(anexo.estado || 'borrador', anexo.firmado);
                        const IconComponent = estadoInfo.icon;
                        
                        return (
                          <TableRow key={anexo.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                  <div className="font-medium">{anexo.codigo || 'Sin código'}</div>
                                  <div className="text-xs text-zinc-500">{formatDate(anexo.created_at)}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-zinc-600">{anexo.supervisor || 'N/A'}</TableCell>
                            <TableCell className="text-zinc-600">{anexo.jefe_centro || 'N/A'}</TableCell>
                            <TableCell className="text-zinc-600">
                              {formatDate(anexo.fecha_verificacion)}
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
                                    className="bg-green-600 h-2 rounded-full" 
                                    style={{ width: `${anexo.progreso || 0}%` }}
                                  />
                                </div>
                                <span className="text-xs text-zinc-500">{anexo.progreso || 0}%</span>
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
                                  onClick={() => handleDeleteAnexo(anexo.id)}
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
