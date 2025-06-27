
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, AlertTriangle, Users, Search } from 'lucide-react';
import { UserSearchSelect } from '@/components/usuarios/UserSearchSelect';
import { usePersonalConflictValidation } from '@/hooks/usePersonalConflictValidation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PersonalBuceoSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectUser: (user: any) => void;
  onInviteUser?: (userData: any) => void;
  selectedRole: 'supervisor' | 'buzo_principal' | 'buzo_asistente' | 'buzo_emergencia';
  targetDate?: string;
}

export const PersonalBuceoSelector = ({
  open,
  onOpenChange,
  onSelectUser,
  onInviteUser,
  selectedRole,
  targetDate
}: PersonalBuceoSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [availablePersonal, setAvailablePersonal] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('existing');
  
  const { getAvailablePersonal, isLoading } = usePersonalConflictValidation(targetDate);

  useEffect(() => {
    if (open && targetDate) {
      loadAvailablePersonal();
    }
  }, [open, targetDate, selectedRole]);

  const loadAvailablePersonal = async () => {
    if (!targetDate) return;
    
    const roleType = selectedRole === 'supervisor' ? 'supervisor' : 'buzo';
    const personal = await getAvailablePersonal(targetDate, roleType);
    setAvailablePersonal(personal);
  };

  const filteredPersonal = availablePersonal.filter(person =>
    `${person.nombre} ${person.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectExistingUser = (person: any) => {
    onSelectUser({
      usuario_id: person.usuario_id,
      nombre: person.nombre,
      apellido: person.apellido,
      email: person.email,
      isExisting: true
    });
    onOpenChange(false);
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      supervisor: 'Supervisor',
      buzo_principal: 'Buzo Principal',
      buzo_asistente: 'Buzo Asistente',
      buzo_emergencia: 'Buzo de Emergencia'
    };
    return labels[role as keyof typeof labels] || role;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Agregar {getRoleLabel(selectedRole)}
            {targetDate && (
              <Badge variant="outline">
                Para fecha: {new Date(targetDate).toLocaleDateString('es-CL')}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Personal Existente
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Crear Nuevo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="search">Buscar Personal</Label>
                <Input
                  id="search"
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {isLoading ? (
                <div className="text-center py-4">Cargando personal disponible...</div>
              ) : filteredPersonal.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay personal disponible para esta fecha</p>
                  <p className="text-sm">Prueba crear un nuevo miembro</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredPersonal.map((person) => (
                    <div
                      key={person.usuario_id}
                      className={`p-4 border rounded-lg ${
                        person.isAvailable ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {person.nombre} {person.apellido}
                          </div>
                          <div className="text-sm text-gray-600">{person.email}</div>
                          <Badge variant="outline" className="mt-1">
                            {person.rol}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-3">
                          {!person.isAvailable && person.conflict && (
                            <Alert className="max-w-xs">
                              <AlertTriangle className="w-4 h-4" />
                              <AlertDescription className="text-xs">
                                Ya asignado a inmersión: {person.conflict.inmersion_code}
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          <Button
                            onClick={() => handleSelectExistingUser(person)}
                            variant={person.isAvailable ? "default" : "outline"}
                            size="sm"
                          >
                            {person.isAvailable ? 'Seleccionar' : 'Forzar Asignación'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            <Alert>
              <UserPlus className="w-4 h-4" />
              <AlertDescription>
                Invita a un nuevo usuario o registra personal que aún no está en el sistema.
              </AlertDescription>
            </Alert>

            <UserSearchSelect
              onSelectUser={(user) => {
                onSelectUser({
                  ...user,
                  isExisting: false
                });
                onOpenChange(false);
              }}
              onInviteUser={(userData) => {
                if (onInviteUser) {
                  onInviteUser(userData);
                }
                onOpenChange(false);
              }}
              allowedRoles={selectedRole === 'supervisor' ? ['supervisor'] : ['buzo']}
              placeholder="Buscar o invitar nuevo personal..."
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
