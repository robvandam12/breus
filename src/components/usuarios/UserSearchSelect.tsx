
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserPlus, Mail } from "lucide-react";
import { useUsersByCompany } from "@/hooks/useUsersByCompany";

interface User {
  usuario_id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  empresa_nombre?: string;
}

interface UserSearchSelectProps {
  onSelectUser: (user: User) => void;
  onInviteUser: (userData: {
    email: string;
    nombre: string;
    apellido: string;
    rol: string;
  }) => void;
  allowedRoles?: string[];
  empresaType?: 'salmonera' | 'contratista';
  empresaId?: string;
  placeholder?: string;
}

export const UserSearchSelect = ({
  onSelectUser,
  onInviteUser,
  allowedRoles = ['supervisor', 'buzo'],
  empresaType,
  empresaId,
  placeholder = "Buscar usuario..."
}: UserSearchSelectProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inviteData, setInviteData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    rol: allowedRoles[0] || 'buzo'
  });

  const { usuarios } = useUsersByCompany(empresaId, empresaType);

  const filteredUsers = usuarios.filter(user => 
    allowedRoles.includes(user.rol) &&
    (user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    onSelectUser(user);
  };

  const handleInviteSubmit = () => {
    if (inviteData.nombre && inviteData.apellido && inviteData.email) {
      onInviteUser(inviteData);
      setInviteData({
        email: '',
        nombre: '',
        apellido: '',
        rol: allowedRoles[0] || 'buzo'
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

  return (
    <Card>
      <CardContent className="p-4">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Buscar Existente</TabsTrigger>
            <TabsTrigger value="invite">Invitar Nuevo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.usuario_id}
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedUser?.usuario_id === user.usuario_id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{user.nombre} {user.apellido}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {user.empresa_nombre && (
                        <div className="text-xs text-gray-400">{user.empresa_nombre}</div>
                      )}
                    </div>
                    <Badge variant="outline" className={getRoleBadgeColor(user.rol)}>
                      {user.rol}
                    </Badge>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && searchTerm && (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron usuarios con ese criterio
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="invite" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={inviteData.nombre}
                  onChange={(e) => setInviteData({...inviteData, nombre: e.target.value})}
                  placeholder="Juan"
                />
              </div>
              <div>
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  value={inviteData.apellido}
                  onChange={(e) => setInviteData({...inviteData, apellido: e.target.value})}
                  placeholder="Pérez"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={inviteData.email}
                onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                placeholder="juan.perez@empresa.cl"
              />
            </div>

            <div>
              <Label htmlFor="rol">Rol</Label>
              <select
                id="rol"
                value={inviteData.rol}
                onChange={(e) => setInviteData({...inviteData, rol: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                {allowedRoles.map(rol => (
                  <option key={rol} value={rol}>
                    {rol.charAt(0).toUpperCase() + rol.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <Button 
              onClick={handleInviteSubmit}
              disabled={!inviteData.nombre || !inviteData.apellido || !inviteData.email}
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              Enviar Invitación
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
