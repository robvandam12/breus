
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/useAuth';
import { Waves, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  
  const { signIn, signUp, loading, user } = useAuth();
  const navigate = useNavigate();

  // Si ya está autenticado, redirigir al dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isSignUp) {
        await signUp(email, password, { nombre, apellido });
      } else {
        await signIn(email, password);
        navigate('/');
      }
    } catch (error) {
      console.error('Error en autenticación:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Breus</h1>
          </div>
          <CardTitle className="text-xl">
            {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </CardTitle>
          <p className="text-sm text-gray-600">
            {isSignUp ? 'Registra tu cuenta para acceder al sistema' : 'Accede a tu cuenta para continuar'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required={isSignUp}
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    required={isSignUp}
                    placeholder="Tu apellido"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@ejemplo.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
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
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isSignUp ? 'Creando cuenta...' : 'Iniciando sesión...'}
                </div>
              ) : (
                isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm"
            >
              {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </Button>
          </div>

          {isSignUp && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                Al registrarte, recibirás un email de confirmación. Revisa tu bandeja de entrada y spam.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
