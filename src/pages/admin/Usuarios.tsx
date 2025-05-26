
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Shield, Plus, Search, UserPlus, Edit, Trash2, Building2, HardHat, Users } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { CreateUserForm } from "@/components/usuarios/CreateUserForm";
import { useAuthRoles } from "@/hooks/useAuthRoles";

const AdminUsuarios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>("all");
  
  const { permissions } = useAuthRoles();
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = selectedRole === 'all' || user.rol === selectedRole;
    
    const matchesEmpresa = selectedEmpresa === 'all' || 
      (selectedEmpresa === 'salmonera' && user.salmonera_id) ||
      (selectedEmpresa === 'servicio' && user.servicio_id) ||
      (selectedEmpresa === 'sin_asignar' && !user.salmonera_id && !user.servicio_id);
    
    return matchesSearch && matchesRole && matchesEmpresa;
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
      case 'superuser':
        return 'bg-red-100 text-red-700';
      case 'admin_salmonera':
        return 'bg-blue-100 text-blue-700';
      case 'admin_servicio':
        return 'bg-green-100 text-green-700';
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
      case 'superuser':
        return 'Super Usuario';
      case 'admin_salmonera':
        return 'Admin Salmonera';
      case 'admin_servicio':
        return 'Admin Servicio';
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
                  <Shield className="w-6 h-6 text-zinc-600" />
                  <div>
                    <h1 className="text-xl font-semibold text-zinc-900">Nuevo Usuario</h1>
                    <p className="text-sm text-zinc-500">Crear nuevo usuario del sistema</p>
                  </div>
                </div>
              </div>
            </header>
            
            <div className="flex-1 overflow-auto">
              <div className="p-4 md:p-8 max-w-4xl mx-auto">
                <CreateUserForm
                  onSubmit={handleCreateUser}
                  onCancel={() => setShowCreateForm(false)}
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
                <Shield className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Gestión de Usuarios</h1>
                  <p className="text-sm text-zinc-500">Administración completa de usuarios del sistema</p>
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
              {/* Filtros */}
              <Card className="ios-card">
                <CardHeader>
                  <CardTitle className="text-lg">Filtros de Búsqueda</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los roles</SelectItem>
                        <SelectItem value="superuser">Super Usuario</SelectItem>
                        <SelectItem value="admin_salmonera">Admin Salmonera</SelectItem>
                        <SelectItem value="admin_servicio">Admin Servicio</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="buzo">Buzo</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedEmpresa} onValueChange={setSelectedEmpresa}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las empresas</SelectItem>
                        <SelectItem value="salmonera">Salmoneras</SelectItem>
                        <SelectItem value="servicio">Contratistas</SelectItem>
                        <SelectItem value="sin_asignar">Sin asignar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Estadísticas */}
              {!isLoading && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Card className="ios-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-zinc-900">{users.length}</div>
                      <div className="text-sm text-zinc-500">Total Usuarios</div>
                    </CardContent>
                  </Card>
                  <Card className="ios-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {users.filter(u => u.rol === 'superuser').length}
                      </div>
                      <div className="text-sm text-zinc-500">Super Users</div>
                    </CardContent>
                  </Card>
                  <Card className="ios-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {users.filter(u => u.rol === 'admin_salmonera').length}
                      </div>
                      <div className="text-sm text-zinc-500">Admin Salmonera</div>
                    </CardContent>
                  </Card>
                  <Card className="ios-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {users.filter(u => u.rol === 'admin_servicio').length}
                      </div>
                      <div className="text-sm text-zinc-500">Admin Servicio</div>
                    </CardContent>
                  </Card>
                  <Card className="ios-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {users.filter(u => u.rol === 'supervisor' || u.rol === 'buzo').length}
                      </div>
                      <div className="text-sm text-zinc-500">Equipos Buceo</div>
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
                    <Shield className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">
                      {searchTerm ? 'Sin resultados' : 'No hay usuarios registrados'}
                    </h3>
                    <p className="text-zinc-500 mb-4">
                      {searchTerm 
                        ? `No se encontraron usuarios que coincidan con los filtros aplicados`
                        : 'Comienza creando el primer usuario del sistema'
                      }
                    </p>
                    {!searchTerm && (
                      <Button onClick={() => setShowCreateForm(true)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Crear Usuario
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
                        <TableHead>Fecha Registro</TableHead>
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
                            <TableCell className="text-zinc-600 text-sm">
                              {new Date(user.created_at).toLocaleDateString()}
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

export default AdminUsuarios;
