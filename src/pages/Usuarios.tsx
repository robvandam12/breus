
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Search, Edit, Trash2, UserPlus } from "lucide-react";
import { UserSearchSelectEnhanced } from "@/components/usuarios/UserSearchSelectEnhanced";
import { useUsersByCompany } from "@/hooks/useUsersByCompany";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/hooks/use-toast";

const Usuarios = () => {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  // Determinar la empresa y tipo basado en el usuario actual
  const empresaId = profile?.salmonera_id || profile?.servicio_id;
  const empresaTipo = profile?.salmonera_id ? 'salmonera' : 'contratista';

  const { usuarios, isLoading, createUser, inviteUser } = useUsersByCompany(
    empresaId, 
    empresaTipo as 'salmonera' | 'contratista'
  );

  const filteredUsuarios = usuarios.filter(usuario => 
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = async (user: any) => {
    try {
      await createUser({
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        rol: user.rol,
        empresa_id: empresaId,
        tipo_empresa: empresaTipo
      });
      setIsInviteDialogOpen(false);
      toast({
        title: "Usuario agregado",
        description: "El usuario ha sido agregado a la empresa exitosamente.",
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el usuario a la empresa.",
        variant: "destructive",
      });
    }
  };

  const handleUserInvite = async (userData: any) => {
    try {
      await inviteUser({
        email: userData.email,
        nombre: userData.nombre,
        apellido: userData.apellido,
        rol: userData.rol,
        empresa_id: empresaId,
        tipo_empresa: empresaTipo
      });
      setIsInviteDialogOpen(false);
      toast({
        title: "Invitación enviada",
        description: "La invitación ha sido enviada exitosamente.",
      });
    } catch (error) {
      console.error('Error inviting user:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la invitación.",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (rol: string) => {
    const colors: Record<string, string> = {
      admin_salmonera: 'bg-blue-100 text-blue-700',
      admin_servicio: 'bg-purple-100 text-purple-700',
      supervisor: 'bg-green-100 text-green-700',
      buzo: 'bg-orange-100 text-orange-700',
    };
    return colors[rol] || 'bg-gray-100 text-gray-700';
  };

  const allowedRoles = empresaTipo === 'salmonera' 
    ? ['admin_salmonera', 'supervisor', 'buzo']
    : ['admin_servicio', 'supervisor', 'buzo'];

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-white">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-white">
            <Header 
              title="Gestión de Usuarios" 
              subtitle="Administra los usuarios de tu empresa" 
              icon={Users} 
            />
            <div className="flex-1 flex items-center justify-center bg-white">
              <LoadingSpinner text="Cargando usuarios..." />
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
            title="Gestión de Usuarios" 
            subtitle="Administra los usuarios de tu empresa" 
            icon={Users} 
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="ios-button bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-blue-600" />
                      <h2 className="text-lg font-semibold">Agregar Usuario a la Empresa</h2>
                    </div>
                    <UserSearchSelectEnhanced
                      onUserSelect={handleUserSelect}
                      onUserInvite={handleUserInvite}
                      companyType={empresaTipo as 'salmonera' | 'contratista'}
                      companyId={empresaId || ''}
                      allowedRoles={allowedRoles}
                      placeholder="Buscar usuario existente o invitar nuevo..."
                    />
                  </div>
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
                    {usuarios.length}
                  </div>
                  <div className="text-sm text-zinc-500">Total Usuarios</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {usuarios.filter(u => u.rol === 'supervisor').length}
                  </div>
                  <div className="text-sm text-zinc-500">Supervisores</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {usuarios.filter(u => u.rol === 'buzo').length}
                  </div>
                  <div className="text-sm text-zinc-500">Buzos</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {usuarios.filter(u => u.rol.includes('admin')).length}
                  </div>
                  <div className="text-sm text-zinc-500">Administradores</div>
                </Card>
              </div>

              {filteredUsuarios.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">
                      {usuarios.length === 0 ? "No hay usuarios registrados" : "No se encontraron usuarios"}
                    </h3>
                    <p className="text-zinc-500 mb-4">
                      {usuarios.length === 0 
                        ? "Comience agregando el primer usuario"
                        : "Intenta ajustar la búsqueda"}
                    </p>
                    {usuarios.length === 0 && (
                      <Button onClick={() => setIsInviteDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Usuario
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
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
                      {filteredUsuarios.map((usuario) => (
                        <TableRow key={usuario.usuario_id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium text-sm">
                                  {usuario.nombre.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{usuario.nombre} {usuario.apellido}</div>
                                <div className="text-xs text-zinc-500">
                                  Registrado: {new Date(usuario.created_at).toLocaleDateString('es-CL')}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-zinc-600">
                            {usuario.email}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getRoleBadgeColor(usuario.rol)}>
                              {usuario.rol.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{usuario.empresa_nombre}</div>
                              <Badge variant="outline" className="mt-1">
                                {usuario.empresa_tipo === 'salmonera' ? 'Salmonera' : 'Contratista'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={usuario.perfil_completado ? 'default' : 'secondary'}>
                              {usuario.perfil_completado ? 'Activo' : 'Pendiente'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
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
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Usuarios;
