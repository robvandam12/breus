
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { HardHat, X, Plus, Trash2 } from "lucide-react";
import { ContratistaFormData } from "@/hooks/useContratistas";

// Validación de RUT chileno simplificada
const rutRegex = /^[0-9]+-[0-9kK]{1}$/;

const formSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(100, "El nombre no puede exceder 100 caracteres"),
  rut: z.string().min(1, "El RUT es requerido").regex(rutRegex, "Formato de RUT inválido (ej: 12345678-9)"),
  direccion: z.string().min(1, "La dirección es requerida"),
  telefono: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  especialidades: z.array(z.string()).optional(),
  certificaciones: z.array(z.string()).optional(),
  estado: z.enum(['activo', 'inactivo', 'suspendido']),
});

type FormSchema = z.infer<typeof formSchema>;

interface CreateContratistaFormProps {
  onSubmit: (data: ContratistaFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<ContratistaFormData>;
  isEditing?: boolean;
}

// Predefined specialties and certifications
const ESPECIALIDADES_PREDEFINIDAS = [
  'Buceo Comercial',
  'Soldadura Subacuática',
  'Inspección de Cascos',
  'Corte Subacuático',
  'Mantenimiento de Redes',
  'Inspección de Estructuras',
  'Limpieza de Fondos',
  'Instalación de Equipos',
];

const CERTIFICACIONES_PREDEFINIDAS = [
  'PADI Open Water',
  'PADI Advanced',
  'Buceo Comercial Nivel I',
  'Buceo Comercial Nivel II',
  'Soldadura AWS D3.6',
  'Primeros Auxilios',
  'RCP Básico',
  'Manejo de Emergencias',
];

export const CreateContratistaForm = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  isEditing = false 
}: CreateContratistaFormProps) => {
  const [loading, setLoading] = useState(false);
  const [especialidades, setEspecialidades] = useState<string[]>(initialData?.especialidades || []);
  const [certificaciones, setCertificaciones] = useState<string[]>(initialData?.certificaciones || []);
  const [newEspecialidad, setNewEspecialidad] = useState('');
  const [newCertificacion, setNewCertificacion] = useState('');

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      rut: initialData?.rut || "",
      direccion: initialData?.direccion || "",
      telefono: initialData?.telefono || "",
      email: initialData?.email || "",
      especialidades: initialData?.especialidades || [],
      certificaciones: initialData?.certificaciones || [],
      estado: initialData?.estado || 'activo',
    }
  });

  const { register, setValue, formState: { errors } } = form;

  const handleFormSubmit = async (data: FormSchema) => {
    setLoading(true);
    try {
      const formData: ContratistaFormData = {
        nombre: data.nombre,
        rut: data.rut,
        direccion: data.direccion,
        telefono: data.telefono || undefined,
        email: data.email || undefined,
        especialidades: especialidades.length > 0 ? especialidades : undefined,
        certificaciones: certificaciones.length > 0 ? certificaciones : undefined,
        estado: data.estado,
      };
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting contratista form:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEspecialidad = (especialidad: string) => {
    if (especialidad && !especialidades.includes(especialidad)) {
      const newEspecialidades = [...especialidades, especialidad];
      setEspecialidades(newEspecialidades);
      setValue('especialidades', newEspecialidades);
      setNewEspecialidad('');
    }
  };

  const removeEspecialidad = (especialidad: string) => {
    const newEspecialidades = especialidades.filter(e => e !== especialidad);
    setEspecialidades(newEspecialidades);
    setValue('especialidades', newEspecialidades);
  };

  const addCertificacion = (certificacion: string) => {
    if (certificacion && !certificaciones.includes(certificacion)) {
      const newCertificaciones = [...certificaciones, certificacion];
      setCertificaciones(newCertificaciones);
      setValue('certificaciones', newCertificaciones);
      setNewCertificacion('');
    }
  };

  const removeCertificacion = (certificacion: string) => {
    const newCertificaciones = certificaciones.filter(c => c !== certificacion);
    setCertificaciones(newCertificaciones);
    setValue('certificaciones', newCertificaciones);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Card className="ios-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <HardHat className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {isEditing ? 'Editar Contratista' : 'Nuevo Contratista'}
                </CardTitle>
                <p className="text-sm text-zinc-500">
                  {isEditing ? 'Modifica los datos del contratista' : 'Registra una nueva empresa contratista'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel} className="touch-target">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Empresa *</Label>
                <Input
                  id="nombre"
                  {...register('nombre')}
                  placeholder="Ej: Servicios de Buceo Austral Ltda."
                  className="touch-target"
                />
                {errors.nombre && (
                  <p className="text-sm text-red-600">{errors.nombre.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rut">RUT *</Label>
                <Input
                  id="rut"
                  {...register('rut')}
                  placeholder="Ej: 96.856.780-3"
                  className="touch-target"
                />
                {errors.rut && (
                  <p className="text-sm text-red-600">{errors.rut.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección *</Label>
              <Input
                id="direccion"
                {...register('direccion')}
                placeholder="Ej: Puerto Montt, Región de Los Lagos"
                className="touch-target"
              />
              {errors.direccion && (
                <p className="text-sm text-red-600">{errors.direccion.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  {...register('telefono')}
                  placeholder="Ej: +56 65 2270000"
                  className="touch-target"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Ej: contacto@empresa.cl"
                  className="touch-target"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select 
                onValueChange={(value) => setValue('estado', value as 'activo' | 'inactivo' | 'suspendido')}
                defaultValue={initialData?.estado || 'activo'}
              >
                <SelectTrigger className="touch-target">
                  <SelectValue placeholder="Seleccionar estado..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="suspendido">Suspendido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Especialidades */}
            <div className="space-y-4">
              <Label>Especialidades</Label>
              
              {/* Quick Add Predefined */}
              <div className="space-y-3">
                <p className="text-sm text-zinc-600">Especialidades predefinidas:</p>
                <div className="flex flex-wrap gap-2">
                  {ESPECIALIDADES_PREDEFINIDAS.map((esp) => (
                    <Button
                      key={esp}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addEspecialidad(esp)}
                      disabled={especialidades.includes(esp)}
                      className="touch-target"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {esp}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Add */}
              <div className="flex gap-2">
                <Input
                  placeholder="Agregar especialidad personalizada..."
                  value={newEspecialidad}
                  onChange={(e) => setNewEspecialidad(e.target.value)}
                  className="touch-target"
                />
                <Button
                  type="button"
                  onClick={() => addEspecialidad(newEspecialidad)}
                  className="touch-target"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Selected Specialties */}
              {especialidades.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Especialidades seleccionadas:</p>
                  <div className="flex flex-wrap gap-2">
                    {especialidades.map((esp) => (
                      <Badge key={esp} variant="secondary" className="gap-2">
                        {esp}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEspecialidad(esp)}
                          className="h-auto p-0 hover:bg-transparent"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Certificaciones */}
            <div className="space-y-4">
              <Label>Certificaciones</Label>
              
              {/* Quick Add Predefined */}
              <div className="space-y-3">
                <p className="text-sm text-zinc-600">Certificaciones predefinidas:</p>
                <div className="flex flex-wrap gap-2">
                  {CERTIFICACIONES_PREDEFINIDAS.map((cert) => (
                    <Button
                      key={cert}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addCertificacion(cert)}
                      disabled={certificaciones.includes(cert)}
                      className="touch-target"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {cert}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Add */}
              <div className="flex gap-2">
                <Input
                  placeholder="Agregar certificación personalizada..."
                  value={newCertificacion}
                  onChange={(e) => setNewCertificacion(e.target.value)}
                  className="touch-target"
                />
                <Button
                  type="button"
                  onClick={() => addCertificacion(newCertificacion)}
                  className="touch-target"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Selected Certifications */}
              {certificaciones.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Certificaciones seleccionadas:</p>
                  <div className="flex flex-wrap gap-2">
                    {certificaciones.map((cert) => (
                      <Badge key={cert} variant="secondary" className="gap-2">
                        {cert}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCertificacion(cert)}
                          className="h-auto p-0 hover:bg-transparent"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="touch-target"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading} 
                className="bg-orange-600 hover:bg-orange-700 touch-target"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {isEditing ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  isEditing ? 'Actualizar Contratista' : 'Crear Contratista'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
