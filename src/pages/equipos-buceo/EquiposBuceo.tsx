
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Users, Plus, Search, UserPlus, Edit, Trash2, Building2, HardHat } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { CreateUserForm } from "@/components/usuarios/CreateUserForm";

const EquiposBuceo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  
  const { 
    users, 
    isLoading, 
    createUser, 
    updateUser, 
    deleteUser,
    isCreating,
    isUpdating,
    isDeleting
  } = useUsers();

  // Filtrar solo usuarios de buceo (supervisor y buzo)
  const equiposBuceo = users.filter(user => 
    user.rol === 'supervisor' || user.rol === 'buzo'
  );

  const filteredUsers = equiposBuceo.filter(user => {
    const matchesSearch = 
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = selectedRole === 'all' || user.rol === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = async (data: any) => {
    try {
      await createUser(data);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      try {
        await deleteUser(id);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const getRoleBadge = (rol: string) => {
    switch (rol) {
      case 'supervisor':
        return 'bg-orange-100 text-orange-700';
      case 'buzo':
        return 'bg-teal-100 text-teal-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleLabel = (rol: string) => {
    switch (rol) {
      case 'supervisor':
        return 'Supervisor';
      case 'buzo':
        return 'Buzo';
      default:
        return rol;
    }
  };

  const getEmpresaInfo = (user: any) => {
    if (user.salmonera_id) {
      return { tipo: 'Salmonera', icon: Building2, color: 'text-blue-600' };
    }
    if (user.servicio_id) {
      return { tipo: 'Contratista', icon: HardHat, color: 'text-orange-600' };
    }
    return { tipo: 'Sin asignar', icon: Users, color: 'text-gray-400' };
  };

  if (showCreateForm) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
              <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
                <SidebarTrigger className="mr-4" />
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-zinc-600" />
                  <div>
                    <h1 className="text-xl font-semibold text-zinc-900">Nuevo Usuario - Equipo de Buceo</h1>
                    <p className="text-sm text-zinc-500">Agregar nuevo miembro al equipo</p>
                  </div>
                </div>
              </div>
            </header>
            
            <div className="flex-1 overflow-auto">
              <div className="p-4 md:p-8 max-w-4xl mx-auto">
                <CreateUserForm
                  onSubmit={handleCreateUser}
                  onCancel={() => setShowCreateForm(false)}
                  restrictedRoles={['supervisor', 'buzo']}
                />
              </div>
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
              <SidebarTrigger className="mr-4" />
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Equipos de Buceo</h1>
                  <p className="text-sm text-zinc-500">Gestión de supervisores y buzos profesionales</p>
                </div>
              </div>
              <div className="flex-1" />
              
              <div className="hidden md:flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  className="ios-button"
                  onClick={() => setShowCreateForm(true)}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <UserPlus className="w-4 h-4 mr-2" />
                  )}
                  Nuevo Usuario
                </Button>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
              {/* Búsqueda móvil */}
              <div className="md:hidden">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Estadísticas */}
              {!isLoading && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="ios-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-zinc-900">{equiposBuceo.length}</div>
                      <div className="text-sm text-zinc-500">Total Usuarios</div>
                    </CardContent>
                  </Card>
                  <Card className="ios-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {equiposBuceo.filter(u => u.rol === 'supervisor').length}
                      </div>
                      <div className="text-sm text-zinc-500">Supervisores</div>
                    </CardContent>
                  </Card>
                  <Card className="ios-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-teal-600">
                        {equiposBuceo.filter(u => u.rol === 'buzo').length}
                      </div>
                      <div className="text-sm text-zinc-500">Buzos</div>
                    </CardContent>
                  </Card>
                  <Card className="ios-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {equiposBuceo.filter(u => u.salmonera_id || u.servicio_id).length}
                      </div>
                      <div className="text-sm text-zinc-500">Asignados</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Contenido principal */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">
                      {searchTerm ? 'Sin resultados' : 'No hay usuarios registrados'}
                    </h3>
                    <p className="text-zinc-500 mb-4">
                      {searchTerm 
                        ? `No se encontraron usuarios que coincidan con "${searchTerm}"`
                        : 'Comienza agregando supervisores y buzos a tu equipo'
                      }
                    </p>
                    {!searchTerm && (
                      <Button onClick={() => setShowCreateForm(true)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Agregar Usuario
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="ios-card">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => {
                        const empresaInfo = getEmpresaInfo(user);
                        const EmpresaIcon = empresaInfo.icon;
                        
                        return (
                          <TableRow key={user.usuario_id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                  {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-medium">{user.nombre} {user.apellido}</div>
                                  <div className="text-xs text-zinc-500">ID: {user.usuario_id.slice(0, 8)}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-zinc-600">{user.email}</TableCell>
                            <TableCell>
                              <Badge className={getRoleBadge(user.rol)}>
                                {getRoleLabel(user.rol)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <EmpresaIcon className={`w-4 h-4 ${empresaInfo.color}`} />
                                <span className="text-sm text-zinc-600">{empresaInfo.tipo}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-100 text-green-700">
                                Activo
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleDeleteUser(user.usuario_id)}
                                  disabled={isDeleting}
                                  className="text-red-600 hover:text-red-700"
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

export default EquiposBuceo;
