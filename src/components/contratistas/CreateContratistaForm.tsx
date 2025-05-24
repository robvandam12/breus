
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { HardHat, X, Plus, Minus } from "lucide-react";
import { ContratistaFormData } from "@/hooks/useContratistas";

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  rut: z.string().min(1, "El RUT es requerido"),
  direccion: z.string().min(1, "La dirección es requerida"),
  telefono: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  especialidades: z.array(z.object({ value: z.string() })).optional(),
  certificaciones: z.array(z.object({ value: z.string() })).optional(),
  estado: z.enum(['activo', 'inactivo', 'suspendido']),
});

interface CreateContratistaFormProps {
  onSubmit: (data: ContratistaFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<ContratistaFormData>;
  isEditing?: boolean;
}

export const CreateContratistaForm = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  isEditing = false 
}: CreateContratistaFormProps) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      rut: initialData?.rut || "",
      direccion: initialData?.direccion || "",
      telefono: initialData?.telefono || "",
      email: initialData?.email || "",
      especialidades: initialData?.especialidades?.map(e => ({ value: e })) || [],
      certificaciones: initialData?.certificaciones?.map(c => ({ value: c })) || [],
      estado: initialData?.estado || 'activo',
    }
  });

  const { fields: especialidadesFields, append: appendEspecialidad, remove: removeEspecialidad } = useFieldArray({
    control,
    name: "especialidades"
  });

  const { fields: certificacionesFields, append: appendCertificacion, remove: removeCertificacion } = useFieldArray({
    control,
    name: "certificaciones"
  });

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const formData: ContratistaFormData = {
        nombre: data.nombre,
        rut: data.rut,
        direccion: data.direccion,
        telefono: data.telefono || undefined,
        email: data.email || undefined,
        especialidades: data.especialidades?.map(e => e.value).filter(e => e.trim() !== "") || [],
        certificaciones: data.certificaciones?.map(c => c.value).filter(c => c.trim() !== "") || [],
        estado: data.estado,
      };
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting contratista form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
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
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la Empresa *</Label>
              <Input
                id="nombre"
                {...register('nombre')}
                placeholder="Ej: Servicios Subacuáticos del Sur Ltda."
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
                placeholder="Ej: 76.234.567-8"
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
                placeholder="Ej: +56 65 2345678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Ej: contacto@empresa.cl"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Especialidades</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendEspecialidad({ value: "" })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
            {especialidadesFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(`especialidades.${index}.value` as const)}
                  placeholder="Ej: Buceo Comercial"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeEspecialidad(index)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Certificaciones</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendCertificacion({ value: "" })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
            {certificacionesFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(`certificaciones.${index}.value` as const)}
                  placeholder="Ej: PADI, NAUI, Commercial Diver"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeCertificacion(index)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select onValueChange={(value) => setValue('estado', value as 'activo' | 'inactivo' | 'suspendido')}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="suspendido">Suspendido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
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
  );
};
