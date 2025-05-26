
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserPlus, Mail } from "lucide-react";
import { useUsuarios } from "@/hooks/useUsuarios";
import { useInvitations } from "@/hooks/useInvitations";

interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  matricula?: string;
  especialidades?: string[];
  certificaciones?: string[];
}

interface UnifiedUserSearchSelectProps {
  onSelectUser: (user: User) => void;
  onInviteUser: (userData: any) => void;
  allowedRoles?: string[];
  placeholder?: string;
}

export const UnifiedUserSearchSelect = ({
  onSelectUser,
  onInviteUser,
  allowedRoles = ['supervisor', 'buzo'],
  placeholder = "Buscar usuario existente..."
}: UnifiedUserSearchSelectProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [inviteData, setInviteData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    rol: 'buzo',
    matricula: '',
    especialidades: [],
    certificaciones: []
  });

  const { usuarios, isLoading } = useUsuarios();
  const { sendInvitation, isLoading: isSending } = useInvitations();

  const filteredUsers = usuarios.filter(user => {
    if (!allowedRoles.includes(user.rol)) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      user.nombre.toLowerCase().includes(searchLower) ||
      user.apellido.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  const handleInvite = async () => {
    try {
      await sendInvitation({
        email: inviteData.email,
        role: inviteData.rol,
        metadata: {
          nombre: inviteData.nombre,
          apellido: inviteData.apellido,
          matricula: inviteData.matricula
        }
      });
      
      onInviteUser(inviteData);
      
      // Reset form
      setInviteData({
        nombre: '',
        apellido: '',
        email: '',
        rol: 'buzo',
        matricula: '',
        especialidades: [],
        certificaciones: []
      });
    } catch (error) {
      console.error('Error sending invitation:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Agregar Personal</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
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

            <div className="max-h-64 overflow-y-auto space-y-2">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Buscando usuarios...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No se encontraron usuarios</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => onSelectUser(user)}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{user.nombre} {user.apellido}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {user.matricula && (
                        <div className="text-xs text-gray-400">Matrícula: {user.matricula}</div>
                      )}
                    </div>
                    <Badge variant="outline">
                      {user.rol === 'supervisor' ? 'Supervisor' : 'Buzo'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="invite" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={inviteData.nombre}
                  onChange={(e) => setInviteData(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Juan"
                />
              </div>
              <div>
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  value={inviteData.apellido}
                  onChange={(e) => setInviteData(prev => ({ ...prev, apellido: e.target.value }))}
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
                onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="juan.perez@empresa.cl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rol">Rol</Label>
                <select
                  id="rol"
                  value={inviteData.rol}
                  onChange={(e) => setInviteData(prev => ({ ...prev, rol: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  {allowedRoles.includes('supervisor') && (
                    <option value="supervisor">Supervisor</option>
                  )}
                  {allowedRoles.includes('buzo') && (
                    <option value="buzo">Buzo</option>
                  )}
                </select>
              </div>
              <div>
                <Label htmlFor="matricula">Matrícula</Label>
                <Input
                  id="matricula"
                  value={inviteData.matricula}
                  onChange={(e) => setInviteData(prev => ({ ...prev, matricula: e.target.value }))}
                  placeholder="MAT-001"
                />
              </div>
            </div>

            <Button 
              onClick={handleInvite}
              disabled={!inviteData.nombre || !inviteData.apellido || !inviteData.email || isSending}
              className="w-full"
            >
              {isSending ? (
                "Enviando invitación..."
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Invitación
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
