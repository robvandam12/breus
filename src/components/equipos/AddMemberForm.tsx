
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserSearchSelect } from "@/components/usuarios/UserSearchSelect";
import { Users, UserPlus } from "lucide-react";

interface AddMemberFormProps {
  equipoId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const AddMemberForm = ({ equipoId, onSubmit, onCancel }: AddMemberFormProps) => {
  const [selectedRole, setSelectedRole] = useState<string>('buzo_principal');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
  };

  const handleInviteUser = (userData: any) => {
    // Manejar invitación de usuario
    const memberData = {
      usuario_id: null,
      nombre_completo: `${userData.nombre} ${userData.apellido}`,
      email: userData.email,
      rol_equipo: selectedRole,
      invitado: true
    };
    onSubmit(memberData);
  };

  const handleSubmit = () => {
    if (!selectedUser) return;

    const memberData = {
      usuario_id: selectedUser.usuario_id,
      nombre_completo: selectedUser.nombre_completo || `${selectedUser.nombre} ${selectedUser.apellido}`,
      email: selectedUser.email,
      rol_equipo: selectedRole,
      invitado: false
    };
    
    onSubmit(memberData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Agregar Miembro al Equipo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Rol en el Equipo</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="supervisor">Supervisor</SelectItem>
              <SelectItem value="buzo_principal">Buzo Principal</SelectItem>
              <SelectItem value="buzo_asistente">Buzo Asistente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Buscar Usuario</Label>
          <UserSearchSelect
            onSelectUser={handleSelectUser}
            onInviteUser={handleInviteUser}
            allowedRoles={selectedRole === 'supervisor' ? ['supervisor'] : ['buzo']}
            placeholder="Buscar usuario para agregar al equipo..."
          />
        </div>

        {selectedUser && (
          <div className="p-4 border rounded-lg bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-green-800">
                  {selectedUser.nombre_completo || `${selectedUser.nombre} ${selectedUser.apellido}`}
                </p>
                <p className="text-sm text-green-600">{selectedUser.email}</p>
              </div>
              <Badge className="bg-green-100 text-green-700">
                {selectedRole === 'supervisor' ? 'Supervisor' : 
                 selectedRole === 'buzo_principal' ? 'Buzo Principal' : 'Buzo Asistente'}
              </Badge>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedUser}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Agregar Miembro
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
