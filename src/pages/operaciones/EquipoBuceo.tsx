import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useEquipoBuceo } from "@/hooks/useEquipoBuceo";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CreateEquipoBuceoForm } from "@/components/equipo-buceo/CreateEquipoBuceoForm";
import { EquipoBuceoDetails } from "@/components/equipo-buceo/EquipoBuceoDetails";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const EquipoBuceo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedEquipoId, setSelectedEquipoId] = useState<string | null>(null);
  
  const { equipos, isLoading, fetchEquipos, createEquipo, addMiembroEquipo, inviteMiembro } = useEquipoBuceo();

  const filteredEquipos = equipos.filter(equipo =>
    equipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Header 
              title="Equipos de Buceo" 
              subtitle="Gestión de equipos y personal de buceo" 
              icon={Users} 
            />
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner text="Cargando Equipos de Buceo..." />
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
          <Header 
            title="Equipos de Buceo" 
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

              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Equipo
              </Button>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {equipos.length}
                  </div>
                  <div className="text-sm text-zinc-500">Total Equipos</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {equipos.filter(equipo => equipo.miembros && equipo.miembros.length > 0).length}
                  </div>
                  <div className="text-sm text-zinc-500">Equipos con Miembros</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {equipos.reduce((total, equipo) => total + (equipo.miembros ? equipo.miembros.length : 0), 0)}
                  </div>
                  <div className="text-sm text-zinc-500">Total Miembros</div>
                </Card>
              </div>

              {filteredEquipos.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay equipos de buceo registrados</h3>
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
                        <TableHead>Nombre</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Creado</TableHead>
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
                                <div className="text-xs text-zinc-500">{equipo.miembros?.length} miembros</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-zinc-600">{equipo.descripcion}</TableCell>
                          <TableCell className="text-zinc-600">{equipo.empresa_nombre}</TableCell>
                          <TableCell className="text-zinc-600">{formatDate(equipo.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="outline" size="sm" onClick={() => setSelectedEquipoId(equipo.id)}>
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
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </div>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="hidden">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Equipo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <CreateEquipoBuceoForm
                onSubmit={async (data) => {
                  await createEquipo(data);
                  setIsCreateDialogOpen(false);
                  await fetchEquipos();
                }}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={!!selectedEquipoId} onOpenChange={() => setSelectedEquipoId(null)}>
            <DialogContent className="max-w-2xl">
              {selectedEquipoId && (
                <EquipoBuceoDetails
                  equipoId={selectedEquipoId}
                  onClose={() => setSelectedEquipoId(null)}
                />
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EquipoBuceo;
