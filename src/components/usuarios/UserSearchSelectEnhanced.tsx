
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, UserPlus, Mail } from "lucide-react";
import { useUsersByCompany } from "@/hooks/useUsersByCompany";

interface UserSearchSelectEnhancedProps {
  onUserSelect: (user: any, role?: string) => void;
  onUserInvite: (userData: any) => void;
  companyType: 'salmonera' | 'contratista';
  companyId: string;
  allowedRoles?: string[];
  placeholder?: string;
  showRoleSelection?: boolean;
}

export const UserSearchSelectEnhanced = ({
  onUserSelect,
  onUserInvite,
  companyType,
  companyId,
  allowedRoles = [],
  placeholder = "Buscar usuario...",
  showRoleSelection = false
}: UserSearchSelectEnhancedProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState(allowedRoles[0] || 'buzo');
  const [inviteData, setInviteData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    rol: allowedRoles[0] || 'buzo'
  });

  const { usuarios } = useUsersByCompany(companyId, companyType);

  const filteredUsers = usuarios.filter(user => {
    const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = allowedRoles.length === 0 || allowedRoles.includes(user.rol);
    
    return matchesSearch && matchesRole;
  });

  const handleUserSelect = (user: any) => {
    if (showRoleSelection) {
      onUserSelect(user, selectedRole);
    } else {
      onUserSelect(user);
    }
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUserInvite({
      ...inviteData,
      empresa_id: companyId,
      tipo_empresa: companyType
    });
    setShowInviteForm(false);
    setInviteData({
      email: '',
      nombre: '',
      apellido: '',
      rol: allowedRoles[0] || 'buzo'
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {showRoleSelection && allowedRoles.length > 0 && (
        <div>
          <Label>Rol en el equipo</Label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {allowedRoles.map(role => (
              <option key={role} value={role}>
                {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
      )}

      {searchTerm && (
        <div className="max-h-60 overflow-y-auto space-y-2">
          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-zinc-500 mb-3">No se encontraron usuarios</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowInviteForm(true)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Invitar Usuario
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map((user) => (
              <Card 
                key={user.usuario_id} 
                className="cursor-pointer hover:bg-zinc-50" 
                onClick={() => handleUserSelect(user)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{user.nombre} {user.apellido}</div>
                      <div className="text-sm text-zinc-500">{user.email}</div>
                      <div className="text-xs text-zinc-400">{user.empresa_nombre}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline">
                        {user.rol.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {user.empresa_tipo === 'salmonera' ? 'Salmonera' : 'Contratista'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button 
          variant="outline" 
          onClick={() => setShowInviteForm(true)}
          className="flex-1"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invitar Usuario
        </Button>
      </div>

      <Dialog open={showInviteForm} onOpenChange={setShowInviteForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invitar Nuevo Usuario</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={inviteData.email}
                onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={inviteData.nombre}
                  onChange={(e) => setInviteData(prev => ({ ...prev, nombre: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  value={inviteData.apellido}
                  onChange={(e) => setInviteData(prev => ({ ...prev, apellido: e.target.value }))}
                  required
                />
              </div>
            </div>
            {allowedRoles.length > 0 && (
              <div>
                <Label htmlFor="rol">Rol *</Label>
                <select
                  id="rol"
                  value={inviteData.rol}
                  onChange={(e) => setInviteData(prev => ({ ...prev, rol: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  {allowedRoles.map(role => (
                    <option key={role} value={role}>
                      {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                Enviar Invitación
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowInviteForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
