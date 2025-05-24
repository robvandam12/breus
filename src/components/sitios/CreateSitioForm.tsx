
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MapPin, X } from "lucide-react";
import { SitioFormData } from "@/hooks/useSitios";
import { useSalmoneras } from "@/hooks/useSalmoneras";

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  codigo: z.string().min(1, "El código es requerido"),
  salmonera_id: z.string().min(1, "La salmonera es requerida"),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  profundidad_maxima: z.number().positive().optional(),
  coordenadas_lat: z.number().min(-90).max(90).optional(),
  coordenadas_lng: z.number().min(-180).max(180).optional(),
  estado: z.enum(['activo', 'inactivo', 'mantenimiento']),
  capacidad_jaulas: z.number().positive().optional(),
  observaciones: z.string().optional(),
});

interface CreateSitioFormProps {
  onSubmit: (data: SitioFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<SitioFormData>;
  isEditing?: boolean;
}

export const CreateSitioForm = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  isEditing = false 
}: CreateSitioFormProps) => {
  const [loading, setLoading] = useState(false);
  const { salmoneras } = useSalmoneras();

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
      codigo: initialData?.codigo || "",
      salmonera_id: initialData?.salmonera_id || "",
      ubicacion: initialData?.ubicacion || "",
      profundidad_maxima: initialData?.profundidad_maxima || undefined,
      coordenadas_lat: initialData?.coordenadas_lat || undefined,
      coordenadas_lng: initialData?.coordenadas_lng || undefined,
      estado: initialData?.estado || 'activo',
      capacidad_jaulas: initialData?.capacidad_jaulas || undefined,
      observaciones: initialData?.observaciones || "",
    }
  });

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const formData: SitioFormData = {
        nombre: data.nombre,
        codigo: data.codigo,
        salmonera_id: data.salmonera_id,
        ubicacion: data.ubicacion,
        profundidad_maxima: data.profundidad_maxima,
        coordenadas_lat: data.coordenadas_lat,
        coordenadas_lng: data.coordenadas_lng,
        estado: data.estado,
        capacidad_jaulas: data.capacidad_jaulas,
        observaciones: data.observaciones,
      };
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting sitio form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {isEditing ? 'Editar Sitio' : 'Nuevo Sitio'}
              </CardTitle>
              <p className="text-sm text-zinc-500">
                {isEditing ? 'Modifica los datos del sitio' : 'Registra un nuevo sitio de trabajo'}
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
              <Label htmlFor="nombre">Nombre del Sitio *</Label>
              <Input
                id="nombre"
                {...register('nombre')}
                placeholder="Ej: Sitio Norte"
              />
              {errors.nombre && (
                <p className="text-sm text-red-600">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                {...register('codigo')}
                placeholder="Ej: SN-001"
              />
              {errors.codigo && (
                <p className="text-sm text-red-600">{errors.codigo.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salmonera_id">Salmonera *</Label>
            <Select onValueChange={(value) => setValue('salmonera_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar salmonera..." />
              </SelectTrigger>
              <SelectContent>
                {salmoneras.map((salmonera) => (
                  <SelectItem key={salmonera.id} value={salmonera.id}>
                    {salmonera.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.salmonera_id && (
              <p className="text-sm text-red-600">{errors.salmonera_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ubicacion">Ubicación *</Label>
            <Input
              id="ubicacion"
              {...register('ubicacion')}
              placeholder="Ej: Bahía de Castro, Chiloé"
            />
            {errors.ubicacion && (
              <p className="text-sm text-red-600">{errors.ubicacion.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
              <Input
                id="profundidad_maxima"
                type="number"
                step="0.1"
                {...register('profundidad_maxima', { valueAsNumber: true })}
                placeholder="Ej: 45.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacidad_jaulas">Capacidad de Jaulas</Label>
              <Input
                id="capacidad_jaulas"
                type="number"
                {...register('capacidad_jaulas', { valueAsNumber: true })}
                placeholder="Ej: 12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select onValueChange={(value) => setValue('estado', value as 'activo' | 'inactivo' | 'mantenimiento')}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="coordenadas_lat">Latitud</Label>
              <Input
                id="coordenadas_lat"
                type="number"
                step="0.000001"
                {...register('coordenadas_lat', { valueAsNumber: true })}
                placeholder="Ej: -42.123456"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coordenadas_lng">Longitud</Label>
              <Input
                id="coordenadas_lng"
                type="number"
                step="0.000001"
                {...register('coordenadas_lng', { valueAsNumber: true })}
                placeholder="Ej: -73.123456"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              {...register('observaciones')}
              placeholder="Observaciones adicionales sobre el sitio..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {isEditing ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                isEditing ? 'Actualizar Sitio' : 'Crear Sitio'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
