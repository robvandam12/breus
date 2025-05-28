
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, Users, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { EquipoBuceoForm } from "@/components/equipos-buceo/EquipoBuceoForm";
import { EquipoBuceoDetail } from "@/components/equipos-buceo/EquipoBuceoDetail";

export default function EquiposBuceo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEquipo, setSelectedEquipo] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [editingEquipo, setEditingEquipo] = useState<any>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const { 
    equipos, 
    isLoading, 
    createEquipo, 
    updateEquipo,
    deleteEquipo,
    isCreating, 
    isUpdating 
  } = useEquiposBuceoEnhanced();

  const filteredEquipos = equipos.filter(equipo =>
    equipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEquipo = async (data: any) => {
    await createEquipo(data);
    setShowCreateForm(false);
  };

  const handleViewDetail = (equipo: any) => {
    setSelectedEquipo(equipo);
    setShowDetail(true);
  };

  const handleEdit = (equipo: any) => {
    setEditingEquipo(equipo);
    setShowEditForm(true);
  };

  const handleEditSubmit = async (data: any) => {
    if (!editingEquipo) return;
    
    await updateEquipo({ id: editingEquipo.id, data });
    setShowEditForm(false);
    setEditingEquipo(null);
  };

  const handleDelete = async (equipoId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este equipo?')) {
      await deleteEquipo(equipoId);
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-gray-50">
            <Header 
              title="Equipos de Buceo" 
              subtitle="Gestión de equipos y personal de buceo" 
              icon={Users} 
            />
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col bg-gray-50">
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
                  className="pl-10 w-64 ios-input"
                />
              </div>

              <Button 
                onClick={() => setShowCreateForm(true)}
                className="ios-button bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Equipo
              </Button>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="ios-card">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {equipos.length}
                    </div>
                    <div className="text-sm text-zinc-500">Equipos Totales</div>
                  </CardContent>
                </Card>
                <Card className="ios-card">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {equipos.filter(e => e.activo).length}
                    </div>
                    <div className="text-sm text-zinc-500">Equipos Activos</div>
                  </CardContent>
                </Card>
                <Card className="ios-card">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {equipos.reduce((total, equipo) => total + (equipo.miembros?.length || 0), 0)}
                    </div>
                    <div className="text-sm text-zinc-500">Total Miembros</div>
                  </CardContent>
                </Card>
                <Card className="ios-card">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {equipos.filter(e => 
                        e.miembros?.some(m => m.rol === 'supervisor')
                      ).length}
                    </div>
                    <div className="text-sm text-zinc-500">Con Supervisor</div>
                  </CardContent>
                </Card>
              </div>

              {/* Teams List */}
              {filteredEquipos.length === 0 ? (
                <Card className="ios-card text-center py-12">
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
                    <Button 
                      onClick={() => setShowCreateForm(true)}
                      className="ios-button bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Equipo
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="ios-card">
                  <div className="ios-table-container">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Empresa</TableHead>
                          <TableHead>Miembros</TableHead>
                          <TableHead>Supervisor</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEquipos.map((equipo) => {
                          const supervisor = equipo.miembros?.find(m => m.rol === 'supervisor');
                          
                          return (
                            <TableRow key={equipo.id}>
                              <TableCell>
                                <div className="font-medium">{equipo.nombre}</div>
                                {equipo.descripcion && (
                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {equipo.descripcion}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {equipo.empresa?.nombre || 'Sin empresa'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {equipo.tipo_empresa}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {equipo.miembros?.length || 0}
                                  </span>
                                  <span className="text-sm text-gray-500">miembros</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {supervisor ? (
                                  <div className="text-sm">
                                    <div className="font-medium">{supervisor.nombre_completo}</div>
                                    <div className="text-gray-500">{supervisor.empresa}</div>
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-400">Sin supervisor</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant={equipo.activo ? 'default' : 'secondary'}>
                                  {equipo.activo ? 'Activo' : 'Inactivo'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewDetail(equipo)}
                                    className="ios-button-sm"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(equipo)}
                                    className="ios-button-sm"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(equipo.id)}
                                    className="ios-button-sm text-red-600 hover:text-red-700"
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
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Create Form Modal */}
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogContent className="max-w-2xl">
              <EquipoBuceoForm
                onSubmit={handleCreateEquipo}
                onCancel={() => setShowCreateForm(false)}
                isLoading={isCreating}
              />
            </DialogContent>
          </Dialog>

          {/* Edit Form Modal */}
          <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
            <DialogContent className="max-w-2xl">
              <EquipoBuceoForm
                equipo={editingEquipo}
                onSubmit={handleEditSubmit}
                onCancel={() => {
                  setShowEditForm(false);
                  setEditingEquipo(null);
                }}
                isLoading={isUpdating}
              />
            </DialogContent>
          </Dialog>

          {/* Detail Modal */}
          <Dialog open={showDetail} onOpenChange={setShowDetail}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {selectedEquipo && (
                <EquipoBuceoDetail 
                  equipo={selectedEquipo}
                  onClose={() => setShowDetail(false)}
                />
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
}
