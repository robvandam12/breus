
import { MainLayout } from "@/components/layout/MainLayout";
import { useUsersByCompany } from "@/hooks/useUsersByCompany";
import { useAuth } from "@/hooks/useAuth";
import { Users, UserPlus, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { InvitationManagement } from "@/components/invitations/InvitationManagement";
import { UserStatsCards } from "@/components/users/UserStatsCards";
import { UsersList } from "@/components/users/UsersList";
import { UserInviteDialog } from "@/components/users/UserInviteDialog";
import { useState } from "react";
import { useUsuarios, InviteUserOptions } from "@/hooks/useUsuarios";

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

  const handleInviteUser = async (options: InviteUserOptions) => {
    await inviteUsuario(options);
  };

  const totalUsers = usuarios.length;
  const activeUsers = usuarios.filter(u => u.perfil_completado).length;
  const pendingUsers = usuarios.filter(u => !u.perfil_completado).length;

  // Determinar roles permitidos según el perfil del usuario
  const getAllowedRoles = () => {
    if (profile?.rol === 'admin_salmonera') {
      return ['admin_salmonera', 'supervisor', 'buzo'];
    } else if (profile?.rol === 'admin_servicio') {
      return ['admin_servicio', 'supervisor', 'buzo'];
    } else if (profile?.rol === 'superuser') {
      return ['admin_salmonera', 'admin_servicio', 'supervisor', 'buzo'];
    }
    return ['buzo'];
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
            <UserStatsCards 
              totalUsers={totalUsers}
              activeUsers={activeUsers}
              pendingUsers={pendingUsers}
            />
            <UsersList 
              usuarios={usuarios}
              onInviteUser={() => setShowInviteDialog(true)}
            />
          </TabsContent>

          <TabsContent value="invitations">
            <InvitationManagement />
          </TabsContent>
        </Tabs>
      </div>

      <UserInviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        onSubmit={handleInviteUser}
        allowedRoles={getAllowedRoles()}
      />
    </MainLayout>
  );
}
