
import { MainLayout } from "@/components/layout/MainLayout";
import { useUsersByCompany } from "@/hooks/useUsersByCompany";
import { useAuth } from "@/hooks/useAuth";
import { Users, UserPlus, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { InvitationManagement } from "@/components/invitations/InvitationManagement";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserInviteForm } from "@/components/users/forms/UserInviteForm";
import { useUsuarios } from "@/hooks/useUsuarios";

export default function Usuarios() {
  const { profile } = useAuth();
  const { usuarios, isLoading } = useUsersByCompany();
  const { inviteUsuario } = useUsuarios();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  
  console.log('Usuarios page rendering, profile:', profile);
  console.log('Users data:', usuarios);
  
  if (isLoading) {
    return (
      <MainLayout
        title="Gestión de Usuarios"
        subtitle="Administra los usuarios de tu empresa"
        icon={Users}
      >
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner text="Cargando usuarios..." />
        </div>
      </MainLayout>
    );
  }

  const getRoleBadgeColor = (rol: string) => {
    switch (rol) {
      case 'admin_salmonera':
        return 'bg-blue-100 text-blue-800';
      case 'admin_servicio':
        return 'bg-green-100 text-green-800';
      case 'supervisor':
        return 'bg-yellow-100 text-yellow-800';
      case 'buzo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (rol: string) => {
    switch (rol) {
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

  const handleInviteUser = async (userData: { email: string; rol: string }) => {
    await inviteUsuario(userData);
    setShowInviteDialog(false);
  };

  return (
    <MainLayout
      title="Gestión de Usuarios"
      subtitle="Administra los usuarios de tu empresa"
      icon={Users}
      headerChildren={
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowInviteDialog(true)}
        >
          <UserPlus className="w-4 h-4" />
          Invitar Usuario
        </Button>
      }
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usuarios Registrados
            </TabsTrigger>
            <TabsTrigger value="invitations" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Invitaciones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usuarios.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {usuarios.filter(u => u.perfil_completado).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Perfiles Pendientes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {usuarios.filter(u => !u.perfil_completado).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Usuarios</CardTitle>
                <CardDescription>
                  Todos los usuarios asociados a tu empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usuarios.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No hay usuarios registrados
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Comienza invitando usuarios a tu empresa.
                    </p>
                    <Button 
                      className="flex items-center gap-2 mx-auto"
                      onClick={() => setShowInviteDialog(true)}
                    >
                      <UserPlus className="w-4 h-4" />
                      Invitar Primer Usuario
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {usuarios.map((usuario) => (
                      <div
                        key={usuario.usuario_id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {usuario.nombre.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold">
                              {usuario.nombre} {usuario.apellido}
                            </h4>
                            <p className="text-sm text-gray-600">{usuario.email}</p>
                            {usuario.empresa_nombre && (
                              <p className="text-xs text-gray-500">
                                {usuario.empresa_nombre}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getRoleBadgeColor(usuario.rol)}>
                            {getRoleDisplayName(usuario.rol)}
                          </Badge>
                          <Badge variant={usuario.perfil_completado ? "default" : "secondary"}>
                            {usuario.perfil_completado ? "Activo" : "Pendiente"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invitations">
            <InvitationManagement />
          </TabsContent>
        </Tabs>
      </div>

      {/* Invite User Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invitar Usuario</DialogTitle>
          </DialogHeader>
          <UserInviteForm
            onSubmit={handleInviteUser}
            onCancel={() => setShowInviteDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
