
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useInvitationRegistration } from '@/hooks/useInvitationRegistration';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, Building2 } from 'lucide-react';

interface InvitationData {
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  empresa_id: string;
  tipo_empresa: 'salmonera' | 'contratista';
  invitado_por: string;
}

export default function RegisterFromInvitation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    password: '',
    confirmPassword: ''
  });

  const { registerFromInvitation, isRegistering } = useInvitationRegistration();

  useEffect(() => {
    const loadInvitationData = async () => {
      if (!token) {
        navigate('/auth/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('usuario_invitaciones')
          .select('*')
          .eq('token', token)
          .eq('estado', 'pendiente')
          .gt('fecha_expiracion', new Date().toISOString())
          .single();

        if (error || !data) {
          throw new Error('Invitación no válida o expirada');
        }

        // Type assertion to ensure tipo_empresa is the correct type
        const invitationData: InvitationData = {
          email: data.email,
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          rol: data.rol,
          empresa_id: data.empresa_id,
          tipo_empresa: data.tipo_empresa as 'salmonera' | 'contratista',
          invitado_por: data.invitado_por
        };

        setInvitation(invitationData);
        setFormData({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          password: '',
          confirmPassword: ''
        });
      } catch (error) {
        console.error('Error cargando invitación:', error);
        navigate('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    loadInvitationData();
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invitation) return;

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (formData.password.length < 6) {
      return;
    }

    try {
      await registerFromInvitation({
        token: token!,
        email: invitation.email,
        password: formData.password,
        nombre: formData.nombre,
        apellido: formData.apellido
      });

      // Redirigir al login después del registro exitoso
      navigate('/auth/login?message=registration_success');
    } catch (error) {
      console.error('Error en registro:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner text="Cargando invitación..." />
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Invitación no válida
            </h2>
            <p className="text-gray-600 mb-4">
              La invitación ha expirado o no existe.
            </p>
            <Button onClick={() => navigate('/auth/login')}>
              Ir al Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin_salmonera':
        return 'Administrador de Salmonera';
      case 'admin_servicio':
        return 'Administrador de Servicio';
      case 'supervisor':
        return 'Supervisor';
      case 'buzo':
        return 'Buzo';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Completar Registro
          </CardTitle>
          <CardDescription>
            Has sido invitado a unirte a Breus
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
              <Building2 className="w-4 h-4" />
              Información de la invitación
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Email:</strong> {invitation.email}</p>
              <p><strong>Rol:</strong> {getRoleDisplayName(invitation.rol)}</p>
              <p><strong>Empresa:</strong> {invitation.tipo_empresa === 'salmonera' ? 'Salmonera' : 'Empresa de Servicio'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                disabled={isRegistering}
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                type="text"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                required
                disabled={isRegistering}
                placeholder="Tu apellido"
              />
            </div>

            <div>
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isRegistering}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={isRegistering}
                placeholder="Confirma tu contraseña"
                minLength={6}
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">Las contraseñas no coinciden</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                isRegistering ||
                !formData.nombre ||
                !formData.apellido ||
                !formData.password ||
                formData.password !== formData.confirmPassword ||
                formData.password.length < 6
              }
            >
              {isRegistering ? (
                <>
                  <LoadingSpinner />
                  Creando cuenta...
                </>
              ) : (
                'Crear cuenta'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth/login')}
              disabled={isRegistering}
            >
              ¿Ya tienes cuenta? Iniciar sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
