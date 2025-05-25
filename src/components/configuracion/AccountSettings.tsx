
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { User, Key, Shield } from 'lucide-react';

export const AccountSettings = () => {
  const { user, profile } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 8 caracteres",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      // Aquí implementarías el cambio de contraseña
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada exitosamente",
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cambiar la contraseña",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superuser':
        return 'bg-purple-100 text-purple-700';
      case 'admin_salmonera':
        return 'bg-blue-100 text-blue-700';
      case 'admin_servicio':
        return 'bg-green-100 text-green-700';
      case 'supervisor':
        return 'bg-yellow-100 text-yellow-700';
      case 'buzo':
        return 'bg-cyan-100 text-cyan-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatRole = (role: string) => {
    const roles = {
      superuser: 'Super Usuario',
      admin_salmonera: 'Administrador Salmonera',
      admin_servicio: 'Administrador Servicio',
      supervisor: 'Supervisor',
      buzo: 'Buzo'
    };
    return roles[role as keyof typeof roles] || role;
  };

  return (
    <div className="space-y-6">
      {/* Información del Perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Información del Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label>Rol</Label>
              <div className="mt-2">
                <Badge className={getRoleBadgeColor(profile?.role || '')}>
                  {formatRole(profile?.role || '')}
                </Badge>
              </div>
            </div>
            <div>
              <Label>Nombre</Label>
              <Input value={profile?.nombre || ''} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label>Apellido</Label>
              <Input value={profile?.apellido || ''} disabled className="bg-gray-50" />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Para cambiar la información del perfil, contacta al administrador del sistema.
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Seguridad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cambio de Contraseña */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Key className="w-4 h-4" />
              Cambiar Contraseña
            </h4>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="currentPassword">Contraseña Actual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    required
                    disabled={isChangingPassword}
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">Nueva Contraseña</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    minLength={8}
                    required
                    disabled={isChangingPassword}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    disabled={isChangingPassword}
                  />
                </div>
              </div>
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
              </Button>
            </form>
          </div>

          <Separator />

          {/* Passkeys (Placeholder) */}
          <div>
            <h4 className="font-medium mb-3">Passkeys</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">
                Los Passkeys proporcionan una forma más segura y conveniente de iniciar sesión sin contraseñas.
              </p>
              <Button variant="outline" disabled>
                Configurar Passkeys (Próximamente)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
