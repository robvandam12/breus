
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserPlus } from 'lucide-react';
import { CompanyUserManagement } from '@/components/users/CompanyUserManagement';

// Simplified User interface for company management
export interface User {
  id: string;
  usuario_id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  estado: 'activo' | 'inactivo';
  created_at: string;
}

interface UserManagementProps {
  empresaType: 'salmonera' | 'servicio';
  empresaId: string;
  users: User[];
  onCreateUser: (userData: any) => Promise<void>;
  onUpdateUser: (id: string, userData: any) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
}

export const UserManagement = ({
  empresaType,
  empresaId,
  users,
  onCreateUser,
  onUpdateUser,
  onDeleteUser
}: UserManagementProps) => {
  const [showInviteForm, setShowInviteForm] = useState(false);

  const handleCreateUser = async (userData: any) => {
    await onCreateUser(userData);
    setShowInviteForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Personal de la Empresa</h3>
          <p className="text-sm text-zinc-500">
            Gestiona los usuarios que pertenecen a esta empresa
          </p>
        </div>
        <Button 
          onClick={() => setShowInviteForm(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Agregar Usuario
        </Button>
      </div>

      <CompanyUserManagement
        empresaType={empresaType}
        empresaId={empresaId}
        users={users}
        onCreateUser={handleCreateUser}
        onUpdateUser={onUpdateUser}
        onDeleteUser={onDeleteUser}
      />

      <Dialog open={showInviteForm} onOpenChange={setShowInviteForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Agregar Usuario a la Empresa
            </DialogTitle>
          </DialogHeader>
          {/* The form is handled inside CompanyUserManagement */}
        </DialogContent>
      </Dialog>
    </div>
  );
};
