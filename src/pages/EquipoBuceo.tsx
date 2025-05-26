
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Plus, Edit, Trash2, UserPlus, Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePersonalPool, PersonalFormData } from "@/hooks/usePersonalPool";
import { CreatePersonalForm } from "@/components/personal/CreatePersonalForm";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { CreateEquipoForm } from "@/components/equipos/CreateEquipoForm";
import { UnifiedUserSearchSelect } from "@/components/usuarios/UnifiedUserSearchSelect";

const EquipoBuceo = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateEquipoForm, setShowCreateEquipoForm] = useState(false);
  const [showAddPersonalDialog, setShowAddPersonalDialog] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState<string | null>(null);

  const { 
    personal, 
    isLoading, 
    createPersonal, 
    updatePersonal, 
    deletePersonal,
    isCreating,
    isUpdating,
    isDeleting
  } = usePersonalPool();

  const { equipos, createEquipo, isCreating: isCreatingEquipo } = useEquiposBuceoEnhanced();

  const handleCreatePersonal = async (data: PersonalFormData) => {
    await createPersonal(data);
    setShowCreateForm(false);
  };

  const handleSelectUser = async (user: any) => {
    const personalData: PersonalFormData = {
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol,
      matricula: user.matricula || '',
      especialidades: user.especialidades || [],
      certificaciones: user.certificaciones || []
    };
    
    await createPersonal(personalData);
    setShowAddPersonalDialog(false);
  };

  const handleInviteUser = async (userData: any) => {
    await createPersonal(userData);
    setShowAddPersonalDialog(false);
  };

  const handleUpdatePersonal = async (data: PersonalFormData) => {
    if (editingPersonal) {
      await updatePersonal({ id: editingPersonal, data });
      setEditingPersonal(null);
    }
  };

  const handleDeletePersonal = async (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este miembro del personal?')) {
      await deletePersonal(id);
    }
  };

  const handleCreateEquipo = async (data: { nombre: string; descripcion: string; empresa_id: string }) => {
    await createEquipo(data);
    setShowCreateEquipoForm(false);
  };

  const getRoleBadgeColor = (rol: string) => {
    switch (rol) {
      case 'supervisor':
        return 'bg-blue-100 text-blue-800';
      case 'buzo':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
                    <h1 className="text-xl font-semibold text-zinc-900">Equipos de Buceo</h1>
                    <p className="text-sm text-zinc-500">Gestión de equipos y personal de buceo</p>
                  </div>
                </div>
              </div>
            </header>
            <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-8 w-20 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  const editingPersonalData = editingPersonal ? personal.find(p => p.id === editingPersonal) : null;

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
                  <h1 className="text-xl font-semibold text-zinc-900">Equipos de Buceo</h1>
                  <p className="text-sm text-zinc-500">Gestión de equipos y personal de buceo</p>
                </div>
              </div>
              <div className="flex-1" />
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setShowCreateEquipoForm(true)}
                  disabled={isCreatingEquipo}
                  className="ios-button"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Equipo
                </Button>
                <Button 
                  className="ios-button"
                  onClick={() => setShowAddPersonalDialog(true)}
                  disabled={isCreating}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Agregar Personal
                </Button>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-600">Equipos Activos</p>
                        <p className="text-2xl font-bold">{equipos.length}</p>
                      </div>
                      <Users className="w-8 h-8 text-zinc-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-600">Total Personal</p>
                        <p className="text-2xl font-bold">{personal.length}</p>
                      </div>
                      <Users className="w-8 h-8 text-zinc-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-600">Supervisores</p>
                        <p className="text-2xl font-bold">
                          {personal.filter(p => p.rol === 'supervisor').length}
                        </p>
                      </div>
                      <UserPlus className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-600">Buzos</p>
                        <p className="text-2xl font-bold">
                          {personal.filter(p => p.rol === 'buzo').length}
                        </p>
                      </div>
                      <Users className="w-8 h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Equipos Section */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Equipos de Buceo</CardTitle>
                </CardHeader>
                <CardContent>
                  {equipos.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                      <h3 className="font-medium text-zinc-900 mb-2">No hay equipos creados</h3>
                      <p className="text-zinc-500 mb-4">Cree el primer equipo de buceo</p>
                      <Button onClick={() => setShowCreateEquipoForm(true)} variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Equipo
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {equipos.map((equipo) => (
                        <Card key={equipo.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{equipo.nombre}</CardTitle>
                              <Badge variant="outline">
                                {equipo.miembros?.length || 0} miembros
                              </Badge>
                            </div>
                            {equipo.descripcion && (
                              <p className="text-sm text-zinc-600">{equipo.descripcion}</p>
                            )}
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {equipo.miembros?.slice(0, 3).map((miembro) => (
                                <div key={miembro.id} className="flex items-center gap-2 text-sm">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span>{miembro.nombre_completo}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {miembro.rol.replace('_', ' ')}
                                  </Badge>
                                </div>
                              ))}
                              {(equipo.miembros?.length || 0) > 3 && (
                                <p className="text-xs text-zinc-500">
                                  +{(equipo.miembros?.length || 0) - 3} más...
                                </p>
                              )}
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full mt-3"
                            >
                              Gestionar Equipo
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Personal Section */}
              {personal.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Mail className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay personal registrado</h3>
                    <p className="text-zinc-500 mb-4">Agregue personal existente o invite nuevos miembros</p>
                    <Button onClick={() => setShowAddPersonalDialog(true)}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Agregar Personal
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Disponible</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Rol</TableHead>
                          <TableHead>Empresa</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {personal.map((miembro) => (
                          <TableRow key={miembro.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{miembro.nombre} {miembro.apellido}</div>
                                {miembro.matricula && (
                                  <div className="text-sm text-zinc-500">Matrícula: {miembro.matricula}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-zinc-600">{miembro.email}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={getRoleBadgeColor(miembro.rol)}>
                                {miembro.rol === 'supervisor' ? 'Supervisor' : 'Buzo'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-zinc-600">
                              {miembro.empresa_asociada || 'Sin asignar'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={miembro.disponible ? "default" : "secondary"}>
                                {miembro.disponible ? 'Disponible' : 'No disponible'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setEditingPersonal(miembro.id)}
                                  disabled={isUpdating}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleDeletePersonal(miembro.id)}
                                  disabled={isDeleting}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Dialogs */}
          <Dialog open={showAddPersonalDialog} onOpenChange={setShowAddPersonalDialog}>
            <DialogContent variant="form" className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Agregar Personal al Equipo</DialogTitle>
              </DialogHeader>
              <UnifiedUserSearchSelect
                onSelectUser={handleSelectUser}
                onInviteUser={handleInviteUser}
                allowedRoles={['supervisor', 'buzo']}
                placeholder="Buscar personal existente o invitar nuevo..."
              />
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogContent variant="form" className="max-w-2xl">
              <CreatePersonalForm
                onSubmit={handleCreatePersonal}
                onCancel={() => setShowCreateForm(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={editingPersonal !== null} onOpenChange={() => setEditingPersonal(null)}>
            <DialogContent variant="form" className="max-w-2xl">
              <CreatePersonalForm
                onSubmit={handleUpdatePersonal}
                onCancel={() => setEditingPersonal(null)}
                initialData={editingPersonalData}
                isEditing={true}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateEquipoForm} onOpenChange={setShowCreateEquipoForm}>
            <DialogContent variant="form" className="max-w-lg">
              <CreateEquipoForm
                onSubmit={handleCreateEquipo}
                onCancel={() => setShowCreateEquipoForm(false)}
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EquipoBuceo;
