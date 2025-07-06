
import { MainLayout } from "@/components/layout/MainLayout";
import { useUsersByCompany } from "@/hooks/useUsersByCompany";
import { useCompanyUserManagement } from "@/hooks/useCompanyUserManagement";
import { useAuth } from "@/hooks/useAuth";
import { Users, UserPlus, Mail, UserMinus, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { InvitationManagement } from "@/components/invitations/InvitationManagement";
import { UserStatsCards } from "@/components/users/UserStatsCards";
import { UsersList } from "@/components/users/UsersList";
import { UserInviteDialog } from "@/components/users/UserInviteDialog";
import { InviteExistingUserForm } from "@/components/users/forms/InviteExistingUserForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useState } from "react";
import { useUsuarios, InviteUserOptions } from "@/hooks/useUsuarios";
import { toast } from "@/hooks/use-toast";

export default function Usuarios() {
  const { profile } = useAuth();
  const { usuarios, isLoading } = useUsersByCompany();
  const { inviteUsuario } = useUsuarios();
  const { removeUserFromCompany, inviteExistingUser, isRemoving } = useCompanyUserManagement();
  
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showInviteExistingDialog, setShowInviteExistingDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [userToRemove, setUserToRemove] = useState<any>(null);
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

  const handleInviteUser = async (data: { email: string; rol: string }) => {
    console.log('🚀 Starting user invitation process');
    console.log('📝 Profile data:', profile);
    
    // Construir empresa_selection basado en el perfil del usuario
    let empresa_selection = '';
    
    if (profile?.salmonera_id) {
      empresa_selection = `salmonera_${profile.salmonera_id}`;
      console.log('✅ Using salmonera_id:', profile.salmonera_id);
    } else if (profile?.servicio_id) {
      empresa_selection = `contratista_${profile.servicio_id}`;
      console.log('✅ Using servicio_id:', profile.servicio_id);
    } else {
      console.error('❌ No company found in profile');
      toast({
        title: "Error",
        description: "No se pudo determinar la empresa. Contacte al administrador.",
        variant: "destructive",
      });
      return;
    }

    console.log('🏢 Final empresa_selection:', empresa_selection);

    const options: InviteUserOptions = {
      email: data.email,
      rol: data.rol,
      empresa_selection
    };

    console.log('📧 Sending invitation with options:', options);
    await inviteUsuario(options);
  };

  const handleInviteExistingUser = async (userData: { email: string; userId: string }) => {
    await inviteExistingUser(userData);
    setShowInviteExistingDialog(false);
  };

  const handleRemoveUser = (user: any) => {
    setUserToRemove(user);
    setShowRemoveDialog(true);
  };

  const confirmRemoveUser = async () => {
    if (userToRemove) {
      await removeUserFromCompany(userToRemove.usuario_id);
      setShowRemoveDialog(false);
      setUserToRemove(null);
    }
  };

  const totalUsers = usuarios.length;
  const activeUsers = usuarios.filter(u => u.perfil_completado).length;
  const pendingUsers = usuarios.filter(u => !u.perfil_completado).length;

  // Determinar roles permitidos según el perfil del usuario
  const getAllowedRoles = () => {
    if (profile?.role === 'admin_salmonera') {
      return ['admin_salmonera', 'supervisor', 'buzo'];
    } else if (profile?.role === 'admin_servicio') {
      return ['admin_servicio', 'supervisor', 'buzo'];
    } else if (profile?.role === 'superuser') {
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
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowInviteExistingDialog(true)}
          >
            <UserCheck className="w-4 h-4" />
            Agregar Existente
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setShowInviteDialog(true)}
          >
            <UserPlus className="w-4 h-4" />
            Invitar Usuario
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usuarios de la Empresa
            </TabsTrigger>
            <TabsTrigger value="invitations" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Invitaciones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <UserStatsCards 
              totalUsers={totalUsers}
              activeUsers={activeUsers}
              pendingUsers={pendingUsers}
            />
            <UsersList 
              usuarios={usuarios}
              onInviteUser={() => setShowInviteDialog(true)}
              showRemoveAction={true}
              onRemoveUser={handleRemoveUser}
            />
          </TabsContent>

          <TabsContent value="invitations">
            <InvitationManagement />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog para invitar nuevo usuario */}
      <UserInviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        onSubmit={handleInviteUser}
        allowedRoles={getAllowedRoles()}
      />

      {/* Dialog para agregar usuario existente */}
      <Dialog open={showInviteExistingDialog} onOpenChange={setShowInviteExistingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Usuario Existente</DialogTitle>
          </DialogHeader>
          <InviteExistingUserForm
            onSubmit={handleInviteExistingUser}
            onCancel={() => setShowInviteExistingDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para remover usuario */}
      <ConfirmDialog
        open={showRemoveDialog}
        onOpenChange={setShowRemoveDialog}
        title="¿Remover usuario de la empresa?"
        description={`¿Estás seguro de que deseas remover a ${userToRemove?.nombre} ${userToRemove?.apellido} de tu empresa? El usuario seguirá existiendo en el sistema pero ya no tendrá acceso a tu empresa.`}
        confirmText="Remover"
        cancelText="Cancelar"
        variant="destructive"
        onConfirm={confirmRemoveUser}
      />
    </MainLayout>
  );
}
