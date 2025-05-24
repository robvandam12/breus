
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Building2, X } from "lucide-react";
import { SalmoneraFormData } from "@/hooks/useSalmoneras";

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  rut: z.string().min(1, "El RUT es requerido"),
  direccion: z.string().min(1, "La dirección es requerida"),
  telefono: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  estado: z.enum(['activa', 'inactiva', 'suspendida']),
});

interface CreateSalmoneraFormProps {
  onSubmit: (data: SalmoneraFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<SalmoneraFormData>;
  isEditing?: boolean;
}

export const CreateSalmoneraForm = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  isEditing = false 
}: CreateSalmoneraFormProps) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      rut: initialData?.rut || "",
      direccion: initialData?.direccion || "",
      telefono: initialData?.telefono || "",
      email: initialData?.email || "",
      estado: initialData?.estado || 'activa',
    }
  });

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const formData: SalmoneraFormData = {
        nombre: data.nombre,
        rut: data.rut,
        direccion: data.direccion,
        telefono: data.telefono || undefined,
        email: data.email || undefined,
        estado: data.estado,
      };
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting salmonera form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {isEditing ? 'Editar Salmonera' : 'Nueva Salmonera'}
              </CardTitle>
              <p className="text-sm text-zinc-500">
                {isEditing ? 'Modifica los datos de la salmonera' : 'Registra una nueva empresa salmonera'}
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
                placeholder="Ej: AquaChile S.A."
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
                placeholder="Ej: +56 65 2270000"
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

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select onValueChange={(value) => setValue('estado', value as 'activa' | 'inactiva' | 'suspendida')}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activa">Activa</SelectItem>
                <SelectItem value="inactiva">Inactiva</SelectItem>
                <SelectItem value="suspendida">Suspendida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {isEditing ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                isEditing ? 'Actualizar Salmonera' : 'Crear Salmonera'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
