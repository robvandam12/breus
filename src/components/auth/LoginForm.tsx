
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/pages/auth/AuthLayout';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn(email, password);
      if (result.success) {
        // Redireccionar al dashboard apropiado según el rol
        navigate(result.redirectPath || '/');
      }
    } catch (error) {
      // Error handling is done in the signIn function
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Iniciar Sesión" 
      subtitle="Accede a tu cuenta en la plataforma Breus"
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="ejemplo@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link 
              to="/forgot-password" 
              className="text-blue-600 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !email || !password}
        >
          {isLoading ? (
            "Iniciando sesión..."
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Iniciar Sesión
            </>
          )}
        </Button>

        <div className="text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link 
            to="/register" 
            className="text-blue-600 hover:underline font-medium"
          >
            Registrarse
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
