
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Mail } from "lucide-react";
import { useUsersByCompany } from "@/hooks/useUsersByCompany";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface UserSearchSelectProps {
  onSelectUser: (user: any) => void;
  onInviteUser: (userData: any) => void;
  allowedRoles?: string[];
  placeholder?: string;
  salmoneraId?: string;
  contratistaId?: string;
  empresaType?: string;
  empresaId?: string;
}

export const UserSearchSelect = ({
  onSelectUser,
  onInviteUser,
  allowedRoles = [],
  placeholder = "Buscar usuario...",
  salmoneraId,
  contratistaId,
  empresaType,
  empresaId
}: UserSearchSelectProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    rol: allowedRoles[0] || 'buzo'
  });

  // Get users from both salmonera and contratista if available
  const { usuarios: salmoneraUsers } = useUsersByCompany(salmoneraId, 'salmonera');
  const { usuarios: contratistaUsers } = useUsersByCompany(contratistaId, 'contratista');
  
  // Combine users from both companies, avoiding duplicates
  const allUsers = [
    ...salmoneraUsers,
    ...contratistaUsers.filter(cu => 
      !salmoneraUsers.some(su => su.usuario_id === cu.usuario_id)
    )
  ];

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = allowedRoles.length === 0 || allowedRoles.includes(user.rol);
    
    return matchesSearch && matchesRole;
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInviteUser(inviteData);
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

      {searchTerm && (
        <div className="max-h-60 overflow-y-auto space-y-2">
          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-zinc-500 mb-3">No se encontraron usuarios</p>
                <Dialog open={showInviteForm} onOpenChange={setShowInviteForm}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Invitar Usuario
                    </Button>
                  </DialogTrigger>
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
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.usuario_id} className="cursor-pointer hover:bg-zinc-50" onClick={() => onSelectUser(user)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{user.nombre} {user.apellido}</div>
                      <div className="text-sm text-zinc-500">{user.email}</div>
                      <div className="text-xs text-zinc-400">{user.empresa_nombre}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline">
                        {user.rol.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
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
    </div>
  );
};
