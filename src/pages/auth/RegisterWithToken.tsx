
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface InvitationData {
  email: string;
  rol: string;
  invitado_por: string;
  fecha_expiracion: string;
}

export default function RegisterWithToken() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!token) {
      toast({
        title: "Token inválido",
        description: "No se encontró un token de invitación válido.",
        variant: "destructive",
      });
      navigate('/auth/login');
      return;
    }

    validateToken();
  }, [token, navigate]);

  const validateToken = async () => {
    try {
      const { data, error } = await supabase
        .from('usuario_invitaciones')
        .select('*')
        .eq('token', token)
        .eq('estado', 'pendiente')
        .gt('fecha_expiracion', new Date().toISOString())
        .single();

      if (error || !data) {
        toast({
          title: "Invitación inválida",
          description: "La invitación ha expirado o ya ha sido utilizada.",
          variant: "destructive",
        });
        navigate('/auth/login');
        return;
      }

      setInvitation(data);
    } catch (error) {
      console.error('Error validating token:', error);
      toast({
        title: "Error",
        description: "Error al validar la invitación.",
        variant: "destructive",
      });
      navigate('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invitation) return;

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: invitation.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            nombre: formData.nombre,
            apellido: formData.apellido,
            role: invitation.rol
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Crear perfil en la tabla usuario
        const { error: profileError } = await supabase
          .from('usuario')
          .insert([{
            usuario_id: authData.user.id,
            email: invitation.email,
            nombre: formData.nombre,
            apellido: formData.apellido,
            rol: invitation.rol,
            perfil_completado: true,
            estado_buzo: invitation.rol === 'buzo' ? 'activo' : 'activo'
          }]);

        if (profileError) throw profileError;

        // Marcar invitación como aceptada
        const { error: invitationError } = await supabase
          .from('usuario_invitaciones')
          .update({ 
            estado: 'aceptada',
            fecha_invitacion: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('token', token);

        if (invitationError) {
          console.error('Error updating invitation status:', invitationError);
          // No fallar por esto, el usuario ya se creó
        }

        toast({
          title: "¡Bienvenido a Breus!",
          description: "Tu cuenta ha sido creada exitosamente.",
        });

        // Redirigir al login o dashboard
        navigate('/auth/login');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: error.message || "Error al crear la cuenta.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner text="Validando invitación..." />
      </div>
    );
  }

  if (!invitation) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Completa tu registro
          </CardTitle>
          <CardDescription>
            Has sido invitado como <strong>{getRoleDisplayName(invitation.rol)}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={invitation.email}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                disabled={submitting}
              />
            </div>

            <div>
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                required
                disabled={submitting}
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
                disabled={submitting}
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
                disabled={submitting}
                minLength={6}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={submitting || !formData.nombre || !formData.apellido || !formData.password}
            >
              {submitting ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
