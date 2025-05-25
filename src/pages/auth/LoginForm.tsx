
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, LogIn, Waves } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

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
      await signIn(email, password);
      navigate('/dashboard');
    } catch (error) {
      // Error handling is done in the signIn function
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Waves className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Bienvenido a Breus
              </CardTitle>
              <p className="text-gray-600">
                Sistema de Gestión de Buceo Profesional
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-12 pr-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
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
                      className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-medium shadow-lg" 
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
              </form>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  ¿No tienes cuenta?{' '}
                  <Link 
                    to="/register" 
                    className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                  >
                    Registrarse
                  </Link>
                </p>
              </div>

              {/* Demo Users Section */}
              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 text-center mb-3">Usuarios de prueba:</p>
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2 p-2 bg-gray-50 rounded text-center">
                    <span className="font-medium">Superuser:</span>
                    <span>superuser@breus.cl</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-2 bg-gray-50 rounded text-center">
                    <span className="font-medium">Admin Salmonera:</span>
                    <span>admin.salmonera@blumar.cl</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-2 bg-gray-50 rounded text-center">
                    <span className="font-medium">Supervisor:</span>
                    <span>supervisor@aquabuceo.cl</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-2 bg-gray-50 rounded text-center">
                    <span className="font-medium">Buzo:</span>
                    <span>buzo1@aquabuceo.cl</span>
                  </div>
                  <p className="text-center text-gray-400 mt-2">Contraseña según email</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Hero Image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-teal-900/20 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=2874&auto=format&fit=crop"
          alt="Buceo Profesional"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center text-white p-8">
            <h2 className="text-4xl font-bold mb-4">
              Gestión Profesional de Buceo
            </h2>
            <p className="text-xl text-blue-100 max-w-md">
              Plataforma integral para la industria salmonicultora chilena
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
