
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Search, UserPlus, Mail } from "lucide-react";
import { UserSearchSelectEnhanced } from "@/components/usuarios/UserSearchSelectEnhanced";
import { useUsersByCompany } from "@/hooks/useUsersByCompany";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/hooks/use-toast";

const Usuarios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const { profile } = useAuth();
  
  // Determine company info based on user profile
  const empresaId = profile?.salmonera_id || profile?.servicio_id;
  const empresaType = profile?.salmonera_id ? 'salmonera' : 'contratista';
  
  const { usuarios, isLoading, inviteUser, createUser } = useUsersByCompany(empresaId, empresaType);

  const filteredUsuarios = usuarios.filter(usuario => 
    usuario.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInviteUser = (userData: any) => {
    try {
      inviteUser(userData);
      setIsInviteDialogOpen(false);
      toast({
        title: "Invitación enviada",
        description: `Se ha enviado una invitación a ${userData.email}`,
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
      admin_salmonera: 'bg-purple-100 text-purple-700',
      admin_servicio: 'bg-purple-100 text-purple-700',
      supervisor: 'bg-blue-100 text-blue-700',
      buzo: 'bg-green-100 text-green-700',
    };
    return colors[rol] || 'bg-gray-100 text-gray-700';
  };

  const getRoleLabel = (rol: string) => {
    const labels: Record<string, string> = {
      admin_salmonera: 'Admin Salmonera',
      admin_servicio: 'Admin Servicio',
      supervisor: 'Supervisor',
      buzo: 'Buzo',
    };
    return labels[rol] || rol;
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-white">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-white">
            <Header 
              title="Usuarios de Empresa" 
              subtitle="Gestión de usuarios y personal" 
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
            title="Usuarios de Empresa" 
            subtitle="Gestión de usuarios y personal" 
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
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invitar Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <UserSearchSelectEnhanced
                    onSelectUser={() => {}} // No seleccionar usuarios existentes en esta página
                    onInviteUser={handleInviteUser}
                    placeholder="Invitar nuevo usuario..."
                    empresaId={empresaId}
                    empresaType={empresaType}
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
                    {usuarios.length}
                  </div>
                  <div className="text-sm text-zinc-500">Total Usuarios</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {usuarios.filter(u => u.rol === 'buzo').length}
                  </div>
                  <div className="text-sm text-zinc-500">Buzos</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {usuarios.filter(u => u.rol === 'supervisor').length}
                  </div>
                  <div className="text-sm text-zinc-500">Supervisores</div>
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
                        ? "Comience invitando el primer usuario"
                        : "Intenta ajustar la búsqueda"}
                    </p>
                    {usuarios.length === 0 && (
                      <Button onClick={() => setIsInviteDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invitar Usuario
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
                        <TableHead>Fecha Registro</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsuarios.map((usuario) => (
                        <TableRow key={usuario.usuario_id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">{usuario.nombre} {usuario.apellido}</div>
                                <div className="text-xs text-zinc-500">
                                  ID: {usuario.usuario_id.slice(0, 8)}...
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-zinc-600">
                            {usuario.email || 'Sin email'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getRoleBadgeColor(usuario.rol)}>
                              {getRoleLabel(usuario.rol)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-zinc-600">
                            <div className="flex flex-col">
                              <span className="font-medium">{usuario.empresa_nombre}</span>
                              <Badge variant="outline" className="text-xs w-fit">
                                {usuario.empresa_tipo === 'salmonera' ? 'Salmonera' : 'Contratista'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={usuario.perfil_completado ? 'default' : 'secondary'}>
                              {usuario.perfil_completado ? 'Activo' : 'Pendiente'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-zinc-600">
                            {new Date(usuario.created_at).toLocaleDateString('es-CL')}
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
