
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, UserPlus, Mail, X, Search, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface PersonnelManagerProps {
  title: string;
  description?: string;
  currentMembers: any[];
  onAddMember: (member: any) => void;
  onRemoveMember: (memberId: string) => void;
  onInviteUser?: (inviteData: any) => void;
  showInviteOption?: boolean;
  memberRoleField?: string;
  searchPlaceholder?: string;
}

export const PersonnelManager = ({
  title,
  description,
  currentMembers,
  onAddMember,
  onRemoveMember,
  onInviteUser,
  showInviteOption = true,
  memberRoleField = 'rol',
  searchPlaceholder = "Buscar por nombre o email..."
}: PersonnelManagerProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    nombre: '',
    apellido: '',
    rol: 'buzo'
  });
  const { profile } = useAuth();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      // Aquí iría la lógica de búsqueda real
      // Por ahora simulamos una búsqueda
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSearchResults([]);
      
      if (searchResults.length === 0) {
        toast({
          title: "Usuario no encontrado",
          description: "No se encontró ningún usuario con ese criterio. Puedes invitarlo completando el formulario.",
          variant: "default",
        });
        if (searchTerm.includes('@')) {
          setInviteForm(prev => ({ ...prev, email: searchTerm }));
          setShowInviteForm(true);
        }
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Error",
        description: "Error al buscar usuarios",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFromSearch = (user: any) => {
    onAddMember(user);
    setShowSearch(false);
    setSearchTerm("");
    setSearchResults([]);
    toast({
      title: "Usuario agregado",
      description: `${user.nombre} ${user.apellido} ha sido agregado exitosamente.`,
    });
  };

  const handleInviteUser = async () => {
    if (!inviteForm.email || !inviteForm.nombre || !inviteForm.apellido) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    try {
      if (onInviteUser) {
        await onInviteUser(inviteForm);
        toast({
          title: "Invitación enviada",
          description: `Se ha enviado una invitación a ${inviteForm.email}`,
        });
        setShowInviteForm(false);
        setInviteForm({ email: '', nombre: '', apellido: '', rol: 'buzo' });
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Error",
        description: "Error al enviar la invitación",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = (memberId: string) => {
    onRemoveMember(memberId);
    toast({
      title: "Usuario removido",
      description: "El usuario ha sido removido exitosamente.",
    });
  };

  return (
    <Card className="bg-white shadow-sm rounded-xl border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Users className="w-5 h-5 text-blue-600" />
              {title}
            </CardTitle>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
          <Button
            onClick={() => setShowSearch(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Agregar Personal
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentMembers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No hay personal asignado</p>
            <p className="text-sm text-gray-400 mb-4">Agregue personal para comenzar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentMembers.map((member, index) => (
              <div key={member.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {(member.nombre || member.nombre_completo || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {member.nombre_completo || `${member.nombre} ${member.apellido}`}
                    </p>
                    <p className="text-xs text-gray-600">
                      {member[memberRoleField] || member.rol || 'Sin rol'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveMember(member.id || member.usuario_id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Dialog para búsqueda */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Buscar y Agregar Personal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                Busque por nombre completo o email. Si no encuentra al usuario, puede invitarlo ingresando su email.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <Label htmlFor="search">Buscar Usuario</Label>
              <div className="flex gap-2">
                <Input
                  id="search"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching || !searchTerm.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2">
                <Label>Resultados de búsqueda</Label>
                {searchResults.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.nombre} {user.apellido}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleAddFromSearch(user)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Agregar
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {showInviteOption && (
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowInviteForm(true)}
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Invitar Nuevo Usuario
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para invitar usuario */}
      <Dialog open={showInviteForm} onOpenChange={setShowInviteForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invitar Nuevo Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <Mail className="h-4 w-4" />
              <AlertDescription className="text-green-800">
                Complete la información del usuario que desea invitar. Se enviará un email de invitación.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  placeholder="Nombre"
                  value={inviteForm.nombre}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, nombre: e.target.value }))}
                  className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  placeholder="Apellido"
                  value={inviteForm.apellido}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, apellido: e.target.value }))}
                  className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleInviteUser}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Mail className="w-4 h-4 mr-2" />
                Enviar Invitación
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowInviteForm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
