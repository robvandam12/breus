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
  nombre: string;
  apellido: string;
  empresa_id: string;
  tipo_empresa: string; // Cambiado de 'salmonera' | 'contratista' a string
}

export default function RegisterWithToken() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
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

  // Timer for rate limit
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (rateLimited && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setRateLimited(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [rateLimited, timeRemaining]);

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
      
      // Pre-poblar datos si están disponibles
      if (data.nombre || data.apellido) {
        setFormData(prev => ({
          ...prev,
          nombre: data.nombre || '',
          apellido: data.apellido || ''
        }));
      }
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

    if (rateLimited) {
      toast({
        title: "Límite de intentos",
        description: `Debe esperar ${timeRemaining} segundos antes de intentar nuevamente.`,
        variant: "destructive",
      });
      return;
    }

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
      console.log('Iniciando proceso de registro con invitación...', {
        email: invitation.email,
        empresa_id: invitation.empresa_id,
        tipo_empresa: invitation.tipo_empresa
      });
      
      // Paso 1: Crear usuario en Supabase Auth con auto-confirmación
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: invitation.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            nombre: formData.nombre,
            apellido: formData.apellido,
            role: invitation.rol,
            // Marcar que viene de invitación para auto-confirmación
            from_invitation: true,
            invitation_token: token
          }
        }
      });

      if (authError) {
        console.error('Error en auth.signUp:', authError);
        
        // Manejar rate limiting específicamente
        if (authError.message?.includes('rate limit') || authError.message?.includes('36 seconds')) {
          setRateLimited(true);
          setTimeRemaining(36);
          toast({
            title: "Límite de intentos excedido",
            description: "Por seguridad, debe esperar 36 segundos antes de intentar nuevamente.",
            variant: "destructive",
          });
          return;
        }
        
        throw authError;
      }

      console.log('Usuario creado en Auth:', authData.user?.id);

      // Si el usuario se creó pero necesita confirmación, intentar confirmarlo automáticamente
      if (authData.user && !authData.user.email_confirmed_at) {
        console.log('Intentando confirmar email automáticamente...');
        
        try {
          // Usar la función edge para confirmar el email automáticamente
          const { error: confirmError } = await supabase.functions.invoke('confirm-invitation-user', {
            body: {
              user_id: authData.user.id,
              email: invitation.email,
              token: token
            }
          });

          if (confirmError) {
            console.warn('No se pudo confirmar automáticamente, pero continuamos:', confirmError);
          } else {
            console.log('Email confirmado automáticamente');
          }
        } catch (confirmErr) {
          console.warn('Error en confirmación automática, continuamos:', confirmErr);
        }
      }

      // Paso 2: Crear perfil de usuario con asignación automática a la empresa
      if (authData.user) {
        console.log('Creando perfil de usuario con empresa:', {
          userId: authData.user.id,
          empresa_id: invitation.empresa_id,
          tipo_empresa: invitation.tipo_empresa
        });
        
        // Determinar qué campo de empresa usar
        const empresaData = invitation.tipo_empresa === 'salmonera' 
          ? { salmonera_id: invitation.empresa_id, servicio_id: null }
          : { salmonera_id: null, servicio_id: invitation.empresa_id };

        // Verificar si el perfil ya existe
        const { data: existingProfile, error: checkError } = await supabase
          .from('usuario')
          .select('usuario_id')
          .eq('usuario_id', authData.user.id)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('Error verificando perfil existente:', checkError);
        }

        const profileData = {
          usuario_id: authData.user.id,
          email: invitation.email,
          nombre: formData.nombre,
          apellido: formData.apellido,
          rol: invitation.rol,
          ...empresaData,
          // Usuario invitado siempre queda con perfil completado y activo
          perfil_completado: true,
          estado_buzo: 'activo'
        };

        if (!existingProfile) {
          console.log('Creando nuevo perfil...', profileData);
          
          const { error: profileError } = await supabase
            .from('usuario')
            .insert([profileData]);

          if (profileError) {
            console.error('Error creando perfil:', profileError);
            if (profileError.code === '23505') {
              console.log('Perfil ya existe, actualizando...');
              const { error: updateError } = await supabase
                .from('usuario')
                .update(profileData)
                .eq('usuario_id', authData.user.id);

              if (updateError) {
                console.error('Error actualizando perfil:', updateError);
                throw updateError;
              }
            } else {
              throw profileError;
            }
          }
        } else {
          console.log('Perfil ya existe, actualizando datos...', profileData);
          const { error: updateError } = await supabase
            .from('usuario')
            .update(profileData)
            .eq('usuario_id', authData.user.id);

          if (updateError) {
            console.error('Error actualizando perfil existente:', updateError);
            throw updateError;
          }
        }

        console.log('Perfil creado/actualizado exitosamente con empresa asignada');

        // Paso 3: Marcar invitación como aceptada
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
        }

        console.log('Proceso completado exitosamente');

        const empresaTipo = invitation.tipo_empresa === 'salmonera' ? 'salmonera' : 'empresa de servicio';
        
        toast({
          title: "¡Bienvenido a Breus!",
          description: `Tu cuenta ha sido creada exitosamente y has sido asignado a la ${empresaTipo}. Puedes iniciar sesión ahora.`,
        });

        // Intentar hacer login automático si el email está confirmado
        if (authData.user.email_confirmed_at || authData.session) {
          console.log('Usuario confirmado, redirigiendo al dashboard...');
          navigate('/');
        } else {
          console.log('Redirigiendo al login...');
          navigate('/auth/login?message=account_created');
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = "Error al crear la cuenta.";
      
      if (error.message?.includes('Email rate limit exceeded')) {
        errorMessage = "Límite de envío de emails excedido. Intenta nuevamente en unos minutos.";
        setRateLimited(true);
        setTimeRemaining(60);
      } else if (error.message?.includes('User already registered')) {
        errorMessage = "Este email ya está registrado. Intenta iniciar sesión.";
      } else if (error.message?.includes('row-level security')) {
        errorMessage = "Error de permisos. Verifica que la invitación sea válida.";
      } else if (error.message?.includes('rate limit') || error.message?.includes('36 seconds')) {
        errorMessage = "Límite de intentos excedido. Debe esperar antes de intentar nuevamente.";
        setRateLimited(true);
        setTimeRemaining(36);
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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

  const getEmpresaTipoDisplayName = (tipo: string) => {
    return tipo === 'salmonera' ? 'Salmonera' : 'Empresa de Servicio';
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
            {invitation.tipo_empresa && (
              <span> para la {getEmpresaTipoDisplayName(invitation.tipo_empresa)}</span>
            )}
          </CardDescription>
          {rateLimited && (
            <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-sm">
              Debe esperar {timeRemaining} segundos antes de intentar nuevamente
            </div>
          )}
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
                disabled={submitting || rateLimited}
              />
            </div>

            <div>
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                required
                disabled={submitting || rateLimited}
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
                disabled={submitting || rateLimited}
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
                disabled={submitting || rateLimited}
                minLength={6}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={submitting || rateLimited || !formData.nombre || !formData.apellido || !formData.password}
            >
              {submitting ? "Creando cuenta..." : rateLimited ? `Esperar ${timeRemaining}s` : "Crear cuenta"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
