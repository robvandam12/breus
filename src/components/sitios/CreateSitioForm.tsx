
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
import { MapPin, X, Building2 } from "lucide-react";
import { SitioFormData } from "@/hooks/useSitios";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { MapPicker } from "./MapPicker";

const formSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(100, "El nombre no puede exceder 100 caracteres"),
  codigo: z.string().min(3, "El código debe tener al menos 3 caracteres").max(20, "El código no puede exceder 20 caracteres"),
  salmonera_id: z.string().uuid("Debe seleccionar una salmonera válida"),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  profundidad_maxima: z.number().min(0, "La profundidad debe ser positiva").optional(),
  coordenadas_lat: z.number().min(-90).max(90, "Latitud debe estar entre -90 y 90").optional(),
  coordenadas_lng: z.number().min(-180).max(180, "Longitud debe estar entre -180 y 180").optional(),
  estado: z.enum(['activo', 'inactivo', 'mantenimiento']),
  capacidad_jaulas: z.number().min(0, "La capacidad debe ser positiva").optional(),
  observaciones: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

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
  const [showMapPicker, setShowMapPicker] = useState(false);

  const { salmoneras, isLoading: loadingSalmoneras } = useSalmoneras();

  const form = useForm<FormSchema>({
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

  const { register, setValue, watch, formState: { errors } } = form;
  const watchedLat = watch('coordenadas_lat');
  const watchedLng = watch('coordenadas_lng');

  const handleFormSubmit = async (data: FormSchema) => {
    setLoading(true);
    try {
      const formData: SitioFormData = {
        nombre: data.nombre,
        codigo: data.codigo,
        salmonera_id: data.salmonera_id,
        ubicacion: data.ubicacion,
        profundidad_maxima: data.profundidad_maxima || undefined,
        coordenadas_lat: data.coordenadas_lat || undefined,
        coordenadas_lng: data.coordenadas_lng || undefined,
        estado: data.estado,
        capacidad_jaulas: data.capacidad_jaulas || undefined,
        observaciones: data.observaciones || undefined,
      };
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting sitio form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setValue('coordenadas_lat', lat);
    setValue('coordenadas_lng', lng);
    setShowMapPicker(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      <Card className="ios-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
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
                <Label htmlFor="nombre">Nombre del Sitio *</Label>
                <Input
                  id="nombre"
                  {...register('nombre')}
                  placeholder="Ej: Centro Los Molinos"
                  className="touch-target"
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
                  placeholder="Ej: LM-001"
                  className="touch-target"
                />
                {errors.codigo && (
                  <p className="text-sm text-red-600">{errors.codigo.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salmonera_id">Salmonera *</Label>
              <Select 
                onValueChange={(value) => setValue('salmonera_id', value)}
                defaultValue={initialData?.salmonera_id}
              >
                <SelectTrigger className="touch-target">
                  <SelectValue placeholder="Seleccionar salmonera..." />
                </SelectTrigger>
                <SelectContent>
                  {loadingSalmoneras ? (
                    <div className="flex items-center justify-center p-4">
                      <LoadingSpinner size="sm" />
                    </div>
                  ) : (
                    salmoneras.map((salmonera) => (
                      <SelectItem key={salmonera.id} value={salmonera.id}>
                        {salmonera.nombre}
                      </SelectItem>
                    ))
                  )}
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
                placeholder="Ej: Puerto Montt, Región de Los Lagos"
                className="touch-target"
              />
              {errors.ubicacion && (
                <p className="text-sm text-red-600">{errors.ubicacion.message}</p>
              )}
            </div>

            {/* Detalles Técnicos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
                <Input
                  id="profundidad_maxima"
                  type="number"
                  step="0.1"
                  {...register('profundidad_maxima', { valueAsNumber: true })}
                  placeholder="Ej: 25.5"
                  className="touch-target"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacidad_jaulas">Capacidad Jaulas</Label>
                <Input
                  id="capacidad_jaulas"
                  type="number"
                  {...register('capacidad_jaulas', { valueAsNumber: true })}
                  placeholder="Ej: 12"
                  className="touch-target"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select 
                  onValueChange={(value) => setValue('estado', value as 'activo' | 'inactivo' | 'mantenimiento')}
                  defaultValue={initialData?.estado || 'activo'}
                >
                  <SelectTrigger className="touch-target">
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

            {/* Coordenadas */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Coordenadas GPS</Label>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowMapPicker(!showMapPicker)}
                  className="touch-target"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {watchedLat && watchedLng ? 'Editar Ubicación' : 'Seleccionar en Mapa'}
                </Button>
              </div>
              
              {(watchedLat && watchedLng) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    📍 Coordenadas: {watchedLat.toFixed(6)}, {watchedLng.toFixed(6)}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coordenadas_lat">Latitud</Label>
                  <Input
                    id="coordenadas_lat"
                    type="number"
                    step="0.000001"
                    {...register('coordenadas_lat', { valueAsNumber: true })}
                    placeholder="-41.4693"
                    className="touch-target"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coordenadas_lng">Longitud</Label>
                  <Input
                    id="coordenadas_lng"
                    type="number"
                    step="0.000001"
                    {...register('coordenadas_lng', { valueAsNumber: true })}
                    placeholder="-72.9424"
                    className="touch-target"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                {...register('observaciones')}
                placeholder="Información adicional sobre el sitio..."
                rows={3}
                className="touch-target"
              />
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
                className="bg-blue-600 hover:bg-blue-700 touch-target"
              >
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

      {/* Map Picker Modal */}
      {showMapPicker && (
        <MapPicker
          initialLat={watchedLat || -41.4693}
          initialLng={watchedLng || -72.9424}
          onLocationSelect={handleLocationSelect}
        />
      )}
    </div>
  );
};
