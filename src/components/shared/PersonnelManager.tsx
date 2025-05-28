
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, Search, Mail, UserCheck, Trash2, Info } from "lucide-react";
import { UserSearchSelect } from "@/components/usuarios/UserSearchSelect";
import { toast } from "@/hooks/use-toast";

interface PersonnelManagerProps {
  title: string;
  description?: string;
  currentMembers: any[];
  availableRoles: { value: string; label: string }[];
  onAddMember: (member: any) => void;
  onRemoveMember: (memberId: string) => void;
  onInviteUser?: (userData: any) => void;
  showInviteOption?: boolean;
  memberDisplayName?: (member: any) => string;
  memberDisplayRole?: (member: any) => string;
  className?: string;
}

export const PersonnelManager = ({
  title,
  description,
  currentMembers,
  availableRoles,
  onAddMember,
  onRemoveMember,
  onInviteUser,
  showInviteOption = true,
  memberDisplayName = (member) => member.nombre_completo || `${member.nombre} ${member.apellido}`,
  memberDisplayRole = (member) => member.rol || member.rol_equipo,
  className = ""
}: PersonnelManagerProps) => {
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteLastName, setInviteLastName] = useState("");
  const [inviteRole, setInviteRole] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);

  const handleAddExistingUser = () => {
    if (!selectedUser || !selectedRole) {
      toast({
        title: "Error",
        description: "Debe seleccionar un usuario y un rol",
        variant: "destructive",
      });
      return;
    }

    // Verificar si ya está en el equipo
    const isAlreadyMember = currentMembers.some(
      member => member.usuario_id === selectedUser.usuario_id
    );

    if (isAlreadyMember) {
      toast({
        title: "Error",
        description: "Este usuario ya es miembro del equipo",
        variant: "destructive",
      });
      return;
    }

    onAddMember({
      usuario_id: selectedUser.usuario_id,
      nombre_completo: `${selectedUser.nombre} ${selectedUser.apellido}`,
      email: selectedUser.email,
      rol_equipo: selectedRole,
      disponible: true
    });

    setSelectedUser(null);
    setSelectedRole("");
    setShowAddMember(false);

    toast({
      title: "Miembro agregado",
      description: "El usuario ha sido agregado exitosamente al equipo.",
    });
  };

  const handleInviteUser = () => {
    if (!inviteEmail || !inviteName || !inviteLastName || !inviteRole) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    if (onInviteUser) {
      onInviteUser({
        email: inviteEmail,
        nombre: inviteName,
        apellido: inviteLastName,
        rol: inviteRole
      });
    }

    // Reset form
    setInviteEmail("");
    setInviteName("");
    setInviteLastName("");
    setInviteRole("");
    setShowInviteForm(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <UserPlus className="w-5 h-5 text-blue-600" />
                {title}
              </CardTitle>
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
            </div>
            <Button
              onClick={() => setShowAddMember(true)}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar Miembro
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {currentMembers.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No hay miembros asignados</p>
              <p className="text-sm text-gray-400">Agregue miembros para continuar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentMembers.map((member, index) => (
                <div key={member.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {memberDisplayName(member).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{memberDisplayName(member)}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {memberDisplayRole(member)}
                        </Badge>
                        {member.disponible !== undefined && (
                          <Badge variant={member.disponible ? "default" : "secondary"} className="text-xs">
                            {member.disponible ? "Disponible" : "No disponible"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveMember(member.id || member.usuario_id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para agregar miembro */}
      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Miembro</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                Busque un usuario existente o invite a uno nuevo escribiendo su email completo.
              </AlertDescription>
            </Alert>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Usuario
              </label>
              <UserSearchSelect
                onSelectUser={setSelectedUser}
                onInviteUser={onInviteUser || (() => {})}
                allowedRoles={availableRoles.map(role => role.value)}
                placeholder="Buscar por nombre o email..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol <span className="text-red-500">*</span>
              </label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between pt-4">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAddMember(false)}>
                  Cancelar
                </Button>
                {showInviteOption && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddMember(false);
                      setShowInviteForm(true);
                    }}
                    className="text-blue-600"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Invitar Nuevo
                  </Button>
                )}
              </div>
              <Button
                onClick={handleAddExistingUser}
                disabled={!selectedUser || !selectedRole}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para invitar usuario */}
      {showInviteOption && (
        <Dialog open={showInviteForm} onOpenChange={setShowInviteForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Invitar Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Alert className="border-amber-200 bg-amber-50">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-amber-800">
                  Se enviará una invitación por email al usuario. Complete todos los campos requeridos.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="Nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={inviteLastName}
                    onChange={(e) => setInviteLastName(e.target.value)}
                    placeholder="Apellido"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="usuario@empresa.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol <span className="text-red-500">*</span>
                </label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleInviteUser}
                  disabled={!inviteEmail || !inviteName || !inviteLastName || !inviteRole}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Invitación
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
