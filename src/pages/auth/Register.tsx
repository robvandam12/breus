
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from './AuthLayout';

export const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    setIsLoading(true);

    try {
      await signUp(formData.email, formData.password, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        role: 'buzo' // Registro por defecto como buzo
      });
      
      // Redirect to email confirmation page
      navigate(`/email-confirmation?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      // Error handling is done in the signUp function
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password && formData.confirmPassword && 
                     formData.nombre && formData.apellido && 
                     formData.password === formData.confirmPassword;

  return (
    <AuthLayout 
      title="Crear Cuenta" 
      subtitle="Únete a la plataforma de gestión de buceo profesional"
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Juan"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="apellido">Apellido *</Label>
            <Input
              id="apellido"
              type="text"
              placeholder="Pérez"
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="juan.perez@empresa.cl"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="password">Contraseña *</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

        <div>
          <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              disabled={isLoading}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
          {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-sm text-red-600 mt-1">Las contraseñas no coinciden</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? (
            "Creando cuenta..."
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Crear Cuenta
            </>
          )}
        </Button>

        <div className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link 
            to="/login" 
            className="text-blue-600 hover:underline font-medium"
          >
            Iniciar Sesión
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
