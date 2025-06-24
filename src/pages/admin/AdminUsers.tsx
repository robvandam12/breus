
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, UserPlus, Search, Filter } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { UserManagementActions } from "@/components/admin/UserManagementActions";
import { useUsuarios } from "@/hooks/useUsuarios";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  
  const { usuarios, loading, inviteUsuario } = useUsuarios();

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = 
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "" || usuario.rol === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (rol: string) => {
    switch (rol) {
      case 'superuser': return 'bg-red-100 text-red-800 border-red-200';
      case 'admin_salmonera': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'admin_servicio': return 'bg-green-100 text-green-800 border-green-200';
      case 'supervisor': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'buzo': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (rol: string) => {
    switch (rol) {
      case 'superuser': return 'Super Usuario';
      case 'admin_salmonera': return 'Admin Salmonera';
      case 'admin_servicio': return 'Admin Servicio';
      case 'supervisor': return 'Supervisor';
      case 'buzo': return 'Buzo';
      default: return rol;
    }
  };

  const handleInviteUser = async (userData: any) => {
    try {
      await inviteUsuario(userData);
      setInviteDialogOpen(false);
    } catch (error) {
      console.error('Error inviting user:', error);
    }
  };

  const headerActions = (
    <div className="flex gap-2">
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Invitar Usuario
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invitar Nuevo Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Esta funcionalidad estará disponible próximamente.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  if (loading) {
    return (
      <MainLayout
        title="Gestión de Usuarios"
        subtitle="Administrar usuarios del sistema"
        icon={Users}
        headerChildren={headerActions}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Cargando usuarios...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Gestión de Usuarios"
      subtitle="Administrar usuarios del sistema"
      icon={Users}
      headerChildren={headerActions}
    >
      <div className="space-y-6">
        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por nombre, apellido o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-48">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full h-12 px-3 rounded-xl border border-zinc-200 bg-white/90"
                >
                  <option value="">Todos los roles</option>
                  <option value="superuser">Super Usuario</option>
                  <option value="admin_salmonera">Admin Salmonera</option>
                  <option value="admin_servicio">Admin Servicio</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="buzo">Buzo</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{usuarios.length}</div>
              <p className="text-sm text-gray-600">Total Usuarios</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {usuarios.filter(u => u.estado_buzo === 'activo').length}
              </div>
              <p className="text-sm text-gray-600">Usuarios Activos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {usuarios.filter(u => u.rol === 'buzo').length}
              </div>
              <p className="text-sm text-gray-600">Buzos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {usuarios.filter(u => u.rol.includes('admin')).length}
              </div>
              <p className="text-sm text-gray-600">Administradores</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de usuarios */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios ({filteredUsuarios.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.map((usuario) => (
                  <TableRow key={usuario.usuario_id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{usuario.nombre} {usuario.apellido}</p>
                        <p className="text-sm text-gray-500">ID: {usuario.usuario_id.slice(0, 8)}...</p>
                      </div>
                    </TableCell>
                    <TableCell>{usuario.email || 'No especificado'}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(usuario.rol)}>
                        {getRoleLabel(usuario.rol)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={usuario.estado_buzo === 'activo' ? 'default' : 'secondary'}>
                        {usuario.estado_buzo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {usuario.salmonera?.nombre || usuario.contratista?.nombre || 'Sin asignar'}
                    </TableCell>
                    <TableCell>
                      {new Date(usuario.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <UserManagementActions usuario={usuario} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredUsuarios.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No se encontraron usuarios que coincidan con los filtros.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminUsers;
