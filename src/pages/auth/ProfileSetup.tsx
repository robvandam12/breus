
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Calendar, Award, FileText, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const ProfileSetup = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    rut: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    region: '',
    fecha_nacimiento: '',
    matricula_buzo: '',
    certificacion_nivel: '',
    fecha_vencimiento_certificacion: '',
    experiencia_anos: '',
    especialidades: '',
    contacto_emergencia_nombre: '',
    contacto_emergencia_telefono: '',
    contacto_emergencia_relacion: '',
    observaciones_medicas: ''
  });

  const calculateProgress = () => {
    const requiredFields = [
      'rut', 'telefono', 'direccion', 'ciudad', 'region',
      'fecha_nacimiento', 'matricula_buzo', 'certificacion_nivel',
      'fecha_vencimiento_certificacion', 'contacto_emergencia_nombre',
      'contacto_emergencia_telefono'
    ];
    
    const filledFields = requiredFields.filter(field => 
      profileData[field as keyof typeof profileData]?.trim()
    ).length;
    
    return Math.round((filledFields / requiredFields.length) * 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('usuario')
        .update({
          perfil_buzo: profileData,
          perfil_completado: calculateProgress() >= 80
        })
        .eq('usuario_id', user?.id);

      if (error) throw error;

      toast({
        title: "Perfil actualizado",
        description: "Tu información de buzo ha sido guardada exitosamente.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const progress = calculateProgress();

  // Skip profile setup for admin roles
  useEffect(() => {
    if (profile?.role === 'admin_salmonera' || profile?.role === 'admin_servicio' || profile?.role === 'superuser') {
      navigate('/dashboard');
    }
  }, [profile, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="ios-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Completar Perfil de Buzo
              </CardTitle>
              <Badge variant={progress >= 80 ? "default" : "outline"}>
                {progress}% completo
              </Badge>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600">
              Completa tu información profesional para acceder a todas las funcionalidades
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Personal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Información Personal
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rut">RUT *</Label>
                    <Input
                      id="rut"
                      placeholder="12.345.678-9"
                      value={profileData.rut}
                      onChange={(e) => setProfileData({ ...profileData, rut: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono *</Label>
                    <Input
                      id="telefono"
                      placeholder="+56 9 1234 5678"
                      value={profileData.telefono}
                      onChange={(e) => setProfileData({ ...profileData, telefono: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</Label>
                  <Input
                    id="fecha_nacimiento"
                    type="date"
                    value={profileData.fecha_nacimiento}
                    onChange={(e) => setProfileData({ ...profileData, fecha_nacimiento: e.target.value })}
                  />
                </div>
              </div>

              {/* Dirección */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Dirección
                </h3>
                <div>
                  <Label htmlFor="direccion">Dirección *</Label>
                  <Input
                    id="direccion"
                    placeholder="Av. Libertador 1234"
                    value={profileData.direccion}
                    onChange={(e) => setProfileData({ ...profileData, direccion: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ciudad">Ciudad *</Label>
                    <Input
                      id="ciudad"
                      placeholder="Puerto Montt"
                      value={profileData.ciudad}
                      onChange={(e) => setProfileData({ ...profileData, ciudad: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="region">Región *</Label>
                    <Select value={profileData.region} onValueChange={(value) => setProfileData({ ...profileData, region: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar región" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="X">Región de Los Lagos</SelectItem>
                        <SelectItem value="XI">Región de Aysén</SelectItem>
                        <SelectItem value="XII">Región de Magallanes</SelectItem>
                        <SelectItem value="VIII">Región del Biobío</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Certificaciones */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Certificaciones Profesionales
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="matricula_buzo">Matrícula de Buzo *</Label>
                    <Input
                      id="matricula_buzo"
                      placeholder="BZ-12345"
                      value={profileData.matricula_buzo}
                      onChange={(e) => setProfileData({ ...profileData, matricula_buzo: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="certificacion_nivel">Nivel de Certificación *</Label>
                    <Select value={profileData.certificacion_nivel} onValueChange={(value) => setProfileData({ ...profileData, certificacion_nivel: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basico">Básico</SelectItem>
                        <SelectItem value="intermedio">Intermedio</SelectItem>
                        <SelectItem value="avanzado">Avanzado</SelectItem>
                        <SelectItem value="instructor">Instructor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fecha_vencimiento_certificacion">Vencimiento Certificación *</Label>
                    <Input
                      id="fecha_vencimiento_certificacion"
                      type="date"
                      value={profileData.fecha_vencimiento_certificacion}
                      onChange={(e) => setProfileData({ ...profileData, fecha_vencimiento_certificacion: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="experiencia_anos">Años de Experiencia</Label>
                    <Input
                      id="experiencia_anos"
                      type="number"
                      placeholder="5"
                      value={profileData.experiencia_anos}
                      onChange={(e) => setProfileData({ ...profileData, experiencia_anos: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="especialidades">Especialidades</Label>
                  <Textarea
                    id="especialidades"
                    placeholder="Soldadura subacuática, inspección de cascos, reparación de redes..."
                    value={profileData.especialidades}
                    onChange={(e) => setProfileData({ ...profileData, especialidades: e.target.value })}
                  />
                </div>
              </div>

              {/* Contacto de Emergencia */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Contacto de Emergencia
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contacto_emergencia_nombre">Nombre *</Label>
                    <Input
                      id="contacto_emergencia_nombre"
                      placeholder="María González"
                      value={profileData.contacto_emergencia_nombre}
                      onChange={(e) => setProfileData({ ...profileData, contacto_emergencia_nombre: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contacto_emergencia_telefono">Teléfono *</Label>
                    <Input
                      id="contacto_emergencia_telefono"
                      placeholder="+56 9 8765 4321"
                      value={profileData.contacto_emergencia_telefono}
                      onChange={(e) => setProfileData({ ...profileData, contacto_emergencia_telefono: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contacto_emergencia_relacion">Relación</Label>
                  <Input
                    id="contacto_emergencia_relacion"
                    placeholder="Esposa, Hermano, Padre..."
                    value={profileData.contacto_emergencia_relacion}
                    onChange={(e) => setProfileData({ ...profileData, contacto_emergencia_relacion: e.target.value })}
                  />
                </div>
              </div>

              {/* Información Médica */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Observaciones Médicas</h3>
                <div>
                  <Label htmlFor="observaciones_medicas">Condiciones Médicas Relevantes</Label>
                  <Textarea
                    id="observaciones_medicas"
                    placeholder="Alergias, medicamentos, condiciones médicas especiales..."
                    value={profileData.observaciones_medicas}
                    onChange={(e) => setProfileData({ ...profileData, observaciones_medicas: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    "Guardando..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Perfil
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  disabled={isLoading}
                >
                  Completar Después
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
