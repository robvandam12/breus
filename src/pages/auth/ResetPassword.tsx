
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from './AuthLayout';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { updatePassword } = useAuth();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      // Handle password mismatch
      return;
    }

    if (!token) {
      // Handle missing token
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      // Error handling is done in the updatePassword function
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout 
        title="Contraseña Actualizada" 
        subtitle="Tu contraseña ha sido cambiada exitosamente"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <p className="text-gray-600 mb-4">
              Tu contraseña ha sido actualizada exitosamente.
            </p>
            <p className="text-sm text-gray-500">
              Serás redirigido al login en unos segundos...
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (!token) {
    return (
      <AuthLayout 
        title="Enlace Inválido" 
        subtitle="El enlace de recuperación no es válido"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <p className="text-gray-600 mb-4">
              El enlace de recuperación ha expirado o no es válido.
            </p>
            <Button onClick={() => navigate('/forgot-password')} className="w-full">
              Solicitar Nuevo Enlace
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Restablecer Contraseña" 
      subtitle="Ingresa tu nueva contraseña"
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {email && (
          <div className="text-sm text-gray-600 text-center">
            Restableciendo contraseña para: <strong>{email}</strong>
          </div>
        )}

        <div>
          <Label htmlFor="password">Nueva Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={8}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirma tu nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={8}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {password && confirmPassword && password !== confirmPassword && (
          <div className="text-sm text-red-600">
            Las contraseñas no coinciden
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
        >
          {isLoading ? (
            "Actualizando..."
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Actualizar Contraseña
            </>
          )}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
