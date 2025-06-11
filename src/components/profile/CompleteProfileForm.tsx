
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Award, Phone, MapPin, AlertTriangle, X, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PhotoUpload } from './PhotoUpload';

interface ProfileFormData {
  foto_perfil: string;
  rut: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  region: string;
  nacionalidad: string;
  fecha_nacimiento: string;
  matricula: string;
  certificacion_nivel: string;
  fecha_vencimiento_certificacion: string;
  experiencia_anos: string;
  especialidades: string[];
  contacto_emergencia_nombre: string;
  contacto_emergencia_telefono: string;
  contacto_emergencia_relacion: string;
  observaciones_medicas: string;
}

export const CompleteProfileForm = ({ onComplete }: { onComplete?: () => void }) => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [newEspecialidad, setNewEspecialidad] = useState('');
  const [profileData, setProfileData] = useState<ProfileFormData>({
    foto_perfil: '',
    rut: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    region: '',
    nacionalidad: 'Chilena',
    fecha_nacimiento: '',
    matricula: '',
    certificacion_nivel: '',
    fecha_vencimiento_certificacion: '',
    experiencia_anos: '',
    especialidades: [],
    contacto_emergencia_nombre: '',
    contacto_emergencia_telefono: '',
    contacto_emergencia_relacion: '',
    observaciones_medicas: ''
  });

  useEffect(() => {
    // Load existing profile data from the usuario table
    const loadProfileData = async () => {
      if (!user?.id) return;
      
      try {
        const { data: userData, error } = await supabase
          .from('usuario')
          .select('perfil_buzo')
          .eq('usuario_id', user.id)
          .single();

        if (error) {
          console.error('Error loading profile:', error);
          return;
        }

        if (userData?.perfil_buzo && typeof userData.perfil_buzo === 'object') {
          setProfileData(prev => ({
            ...prev,
            ...userData.perfil_buzo as Partial<ProfileFormData>
          }));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfileData();
  }, [user?.id]);

  const addEspecialidad = () => {
    if (newEspecialidad.trim() && !profileData.especialidades.includes(newEspecialidad.trim())) {
      setProfileData(prev => ({
        ...prev,
        especialidades: [...prev.especialidades, newEspecialidad.trim()]
      }));
      setNewEspecialidad('');
    }
  };

  const removeEspecialidad = (especialidad: string) => {
    setProfileData(prev => ({
      ...prev,
      especialidades: prev.especialidades.filter(e => e !== especialidad)
    }));
  };

  const calculateProgress = () => {
    const requiredFields = [
      'rut', 'telefono', 'direccion', 'ciudad', 'region', 'nacionalidad',
      'fecha_nacimiento', 'matricula', 'certificacion_nivel',
      'fecha_vencimiento_certificacion', 'contacto_emergencia_nombre',
      'contacto_emergencia_telefono'
    ];
    
    const filledFields = requiredFields.filter(field => 
      profileData[field as keyof ProfileFormData]?.toString().trim()
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
          perfil_buzo: profileData as any,
          perfil_completado: calculateProgress() >= 80
        })
        .eq('usuario_id', user?.id);

      if (error) throw error;

      toast({
        title: "Perfil actualizado",
        description: "Tu información profesional ha sido guardada exitosamente.",
      });

      onComplete?.();
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Perfil Profesional - {profile?.rol === 'supervisor' ? 'Supervisor' : 'Buzo'}
          </CardTitle>
          <Badge variant={progress >= 80 ? "default" : "outline"}>
            {progress}% completo
          </Badge>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Foto de Perfil */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
              <User className="w-4 h-4" />
              Foto de Perfil
            </h3>
            <PhotoUpload
              currentPhoto={profileData.foto_perfil}
              onPhotoChange={(photoUrl) => setProfileData(prev => ({ ...prev, foto_perfil: photoUrl || '' }))}
              disabled={isLoading}
            />
          </div>

          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
              <User className="w-4 h-4" />
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</Label>
                <Input
                  id="fecha_nacimiento"
                  type="date"
                  value={profileData.fecha_nacimiento}
                  onChange={(e) => setProfileData({ ...profileData, fecha_nacimiento: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="nacionalidad">Nacionalidad *</Label>
                <Select value={profileData.nacionalidad} onValueChange={(value) => setProfileData({ ...profileData, nacionalidad: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar nacionalidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chilena">Chilena</SelectItem>
                    <SelectItem value="Argentina">Argentina</SelectItem>
                    <SelectItem value="Peruana">Peruana</SelectItem>
                    <SelectItem value="Boliviana">Boliviana</SelectItem>
                    <SelectItem value="Colombiana">Colombiana</SelectItem>
                    <SelectItem value="Ecuatoriana">Ecuatoriana</SelectItem>
                    <SelectItem value="Venezolana">Venezolana</SelectItem>
                    <SelectItem value="Brasileña">Brasileña</SelectItem>
                    <SelectItem value="Uruguaya">Uruguaya</SelectItem>
                    <SelectItem value="Paraguaya">Paraguaya</SelectItem>
                    <SelectItem value="Otra">Otra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
              <MapPin className="w-4 h-4" />
              Dirección
            </h3>
            <div className="space-y-4">
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
          </div>

          {/* Certificaciones Profesionales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
              <Award className="w-4 h-4" />
              Certificaciones Profesionales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="matricula">Matrícula Profesional *</Label>
                <Input
                  id="matricula"
                  placeholder="BZ-12345 o SUP-12345"
                  value={profileData.matricula}
                  onChange={(e) => setProfileData({ ...profileData, matricula: e.target.value })}
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
              <Label>Especialidades</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newEspecialidad}
                  onChange={(e) => setNewEspecialidad(e.target.value)}
                  placeholder="Soldadura subacuática, inspección..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEspecialidad())}
                />
                <Button type="button" onClick={addEspecialidad} size="sm">
                  Agregar
                </Button>
              </div>
              {profileData.especialidades.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profileData.especialidades.map((especialidad, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {especialidad}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeEspecialidad(especialidad)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contacto de Emergencia */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
              <AlertTriangle className="w-4 h-4" />
              Contacto de Emergencia
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="md:col-span-2">
                <Label htmlFor="contacto_emergencia_relacion">Relación</Label>
                <Input
                  id="contacto_emergencia_relacion"
                  placeholder="Esposa, Hermano, Padre..."
                  value={profileData.contacto_emergencia_relacion}
                  onChange={(e) => setProfileData({ ...profileData, contacto_emergencia_relacion: e.target.value })}
                />
              </div>
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
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Guardando..." : "Guardar Perfil"}
            </Button>
            {onComplete && (
              <Button 
                type="button" 
                variant="outline"
                onClick={onComplete}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
