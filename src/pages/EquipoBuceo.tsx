
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
import { Users, Plus, Search, Edit, Trash2, Eye, UserPlus, Mail } from "lucide-react";
import { CreateEquipoFormWizard } from "@/components/equipos/CreateEquipoFormWizard";
import { useEquipoBuceo } from "@/hooks/useEquipoBuceo";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";

const EquipoBuceo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedEquipo, setSelectedEquipo] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  const { equipos, isLoading, createEquipo, deleteEquipo } = useEquipoBuceo();
  const { toast } = useToast();

  const filteredEquipos = equipos.filter(equipo => 
    equipo.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEquipo = async (data: any) => {
    try {
      await createEquipo(data);
      setIsCreateDialogOpen(false);
      toast({
        title: "Equipo creado",
        description: "El equipo de buceo ha sido creado exitosamente.",
      });
    } catch (error) {
      console.error('Error creating equipo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el equipo de buceo.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (equipo: any) => {
    setSelectedEquipo(equipo);
    setIsDetailDialogOpen(true);
  };

  const handleDeleteEquipo = async (equipoId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este equipo?')) {
      try {
        await deleteEquipo(equipoId);
        toast({
          title: "Equipo eliminado",
          description: "El equipo ha sido eliminado exitosamente.",
        });
      } catch (error) {
        console.error('Error deleting equipo:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el equipo.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-white">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-white">
            <Header 
              title="Equipo de Buceo" 
              subtitle="Gestión de equipos y personal de buceo" 
              icon={Users} 
            />
            <div className="flex-1 flex items-center justify-center bg-white">
              <LoadingSpinner text="Cargando equipos..." />
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
        <main className="flex-1 flex flex-col bg-white">
          <Header 
            title="Equipo de Buceo" 
            subtitle="Gestión de equipos y personal de buceo" 
            icon={Users} 
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input
                  placeholder="Buscar equipos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="ios-button bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Equipo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <CreateEquipoFormWizard
                    onSubmit={handleCreateEquipo}
                    onCancel={() => setIsCreateDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {equipos.length}
                  </div>
                  <div className="text-sm text-zinc-500">Equipos Activos</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {equipos.reduce((total, equipo) => total + (equipo.miembros?.length || 0), 0)}
                  </div>
                  <div className="text-sm text-zinc-500">Total Miembros</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {equipos.reduce((total, equipo) => total + (equipo.miembros?.filter(m => m.rol_equipo === 'supervisor').length || 0), 0)}
                  </div>
                  <div className="text-sm text-zinc-500">Supervisores</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-gray-600">
                    {equipos.reduce((total, equipo) => total + (equipo.miembros?.filter(m => m.rol_equipo.includes('buzo')).length || 0), 0)}
                  </div>
                  <div className="text-sm text-zinc-500">Buzos</div>
                </Card>
              </div>

              {filteredEquipos.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">
                      {equipos.length === 0 ? "No hay equipos registrados" : "No se encontraron equipos"}
                    </h3>
                    <p className="text-zinc-500 mb-4">
                      {equipos.length === 0 
                        ? "Comience creando el primer equipo de buceo"
                        : "Intenta ajustar la búsqueda"}
                    </p>
                    {equipos.length === 0 && (
                      <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Equipo
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Equipo</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Miembros</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEquipos.map((equipo) => (
                        <TableRow key={equipo.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">{equipo.nombre}</div>
                                <div className="text-xs text-zinc-500">
                                  Creado: {new Date(equipo.created_at || '').toLocaleDateString('es-CL')}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-zinc-600 max-w-xs truncate">
                            {equipo.descripcion || 'Sin descripción'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {equipo.miembros?.length || 0} miembros
                              </Badge>
                              {(equipo.miembros?.length || 0) > 0 && (
                                <div className="flex -space-x-1">
                                  {equipo.miembros?.slice(0, 3).map((miembro, index) => (
                                    <div
                                      key={miembro.id}
                                      className="w-6 h-6 bg-zinc-300 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white"
                                      title={miembro.nombre_completo}
                                    >
                                      {(miembro.nombre_completo || '').charAt(0).toUpperCase()}
                                    </div>
                                  ))}
                                  {(equipo.miembros?.length || 0) > 3 && (
                                    <div className="w-6 h-6 bg-zinc-500 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-white">
                                      +{(equipo.miembros?.length || 0) - 3}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={equipo.activo ? 'default' : 'secondary'}>
                              {equipo.activo ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-zinc-600">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {equipo.tipo_empresa === 'salmonera' ? 'Salmonera' : 'Servicio'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                title="Ver detalles"
                                onClick={() => handleViewDetails(equipo)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                title="Agregar miembro"
                                onClick={() => {
                                  // TODO: Implementar agregar miembro
                                  toast({
                                    title: "Función en desarrollo",
                                    description: "Esta función estará disponible pronto.",
                                  });
                                }}
                              >
                                <UserPlus className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                title="Eliminar"
                                onClick={() => handleDeleteEquipo(equipo.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </div>
          </div>

          {/* Modal de detalles del equipo */}
          <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
            <DialogContent className="max-w-2xl">
              {selectedEquipo && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-blue-600" />
                    <div>
                      <h2 className="text-xl font-semibold">{selectedEquipo.nombre}</h2>
                      <p className="text-zinc-500">{selectedEquipo.descripcion}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Miembros del Equipo</h3>
                    {selectedEquipo.miembros && selectedEquipo.miembros.length > 0 ? (
                      <div className="space-y-2">
                        {selectedEquipo.miembros.map((miembro: any) => (
                          <div key={miembro.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">{miembro.nombre_completo}</div>
                                <div className="text-sm text-zinc-500">{miembro.email}</div>
                              </div>
                            </div>
                            <Badge variant="outline">
                              {miembro.rol_equipo?.replace('_', ' ')}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-500 text-center py-4">No hay miembros asignados</p>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EquipoBuceo;
