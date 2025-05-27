
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Search, Edit, Trash2, Eye, UserPlus, Mail } from "lucide-react";
import { CreateEquipoForm } from "@/components/equipos/CreateEquipoForm";
import { useEquipoBuceo } from "@/hooks/useEquipoBuceo";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const EquipoBuceo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { equipos, isLoading, createEquipo } = useEquipoBuceo();

  const filteredEquipos = equipos.filter(equipo => 
    equipo.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipo.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEquipo = async (data: any) => {
    try {
      await createEquipo(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating equipo:', error);
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
                  <Users className="w-6 h-6 text-zinc-600" />
                  <div>
                    <h1 className="text-xl font-semibold text-zinc-900">Equipo de Buceo</h1>
                    <p className="text-sm text-zinc-500">Gestión de equipos y personal de buceo</p>
                  </div>
                </div>
              </div>
            </header>
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner text="Cargando equipos..." />
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
                <Users className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Equipo de Buceo</h1>
                  <p className="text-sm text-zinc-500">Gestión de equipos y personal de buceo</p>
                </div>
              </div>
              <div className="flex-1" />
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
                  <DialogContent className="max-w-2xl">
                    <CreateEquipoForm
                      onSubmit={handleCreateEquipo}
                      onCancel={() => setIsCreateDialogOpen(false)}
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
                    {equipos.length}
                  </div>
                  <div className="text-sm text-zinc-500">Equipos Activos</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {equipos.filter(e => e.estado === 'activa').length}
                  </div>
                  <div className="text-sm text-zinc-500">En Operación</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {equipos.filter(e => e.estado === 'planificada').length}
                  </div>
                  <div className="text-sm text-zinc-500">Planificados</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-gray-600">
                    {equipos.filter(e => e.estado === 'completada').length}
                  </div>
                  <div className="text-sm text-zinc-500">Completados</div>
                </Card>
              </div>

              {filteredEquipos.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay equipos registrados</h3>
                    <p className="text-zinc-500 mb-4">Comience creando el primer equipo de buceo</p>
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Equipo
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Equipo</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Sitio</TableHead>
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
                                  {new Date(equipo.created_at).toLocaleDateString('es-CL')}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-zinc-600">{equipo.codigo}</TableCell>
                          <TableCell>
                            <Badge variant={
                              equipo.estado === 'activa' ? 'default' : 
                              equipo.estado === 'planificada' ? 'secondary' : 
                              'outline'
                            }>
                              {equipo.estado}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-zinc-600">
                            {new Date(equipo.fecha_inicio).toLocaleDateString('es-CL')}
                          </TableCell>
                          <TableCell className="text-zinc-600">
                            {equipo.sitios?.nombre || 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <UserPlus className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
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
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EquipoBuceo;
