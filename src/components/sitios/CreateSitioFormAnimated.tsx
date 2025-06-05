
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, X, Building, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SitioFormData } from "@/hooks/useSitios";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SimpleMap } from "@/components/ui/simple-map";

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  codigo: z.string().min(1, "El código es requerido"),
  salmonera_id: z.string().min(1, "Debe seleccionar una salmonera"),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  estado: z.enum(['activo', 'inactivo', 'mantenimiento']),
  profundidad_maxima: z.number().optional(),
  coordenadas_lat: z.number().optional(),
  coordenadas_lng: z.number().optional(),
  capacidad_jaulas: z.number().optional(),
  observaciones: z.string().optional(),
});

interface CreateSitioFormAnimatedProps {
  onSubmit: (data: SitioFormData) => Promise<void>;
  onCancel: () => void;
}

export const CreateSitioFormAnimated = ({ onSubmit, onCancel }: CreateSitioFormAnimatedProps) => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat?: number; lng?: number }>({});

  // Query para obtener salmoneras (solo si no es admin_salmonera)
  const { data: salmoneras = [] } = useQuery({
    queryKey: ['salmoneras'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salmoneras')
        .select('id, nombre')
        .eq('estado', 'activa')
        .order('nombre');
      
      if (error) throw error;
      return data;
    },
    enabled: profile?.role !== 'admin_salmonera'
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      estado: 'activo',
      salmonera_id: profile?.role === 'admin_salmonera' ? profile.salmonera_id : '',
    }
  });

  // Auto-poblar salmonera_id si es admin_salmonera
  useEffect(() => {
    if (profile?.role === 'admin_salmonera' && profile?.salmonera_id) {
      setValue('salmonera_id', profile.salmonera_id);
    }
  }, [profile, setValue]);

  // Auto-poblar coordenadas cuando se seleccionan en el mapa
  useEffect(() => {
    if (coordinates.lat && coordinates.lng) {
      setValue('coordenadas_lat', coordinates.lat);
      setValue('coordenadas_lng', coordinates.lng);
    }
  }, [coordinates, setValue]);

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // Asegurar que todos los campos requeridos estén presentes
      const sitioData: SitioFormData = {
        nombre: data.nombre,
        codigo: data.codigo,
        salmonera_id: data.salmonera_id,
        ubicacion: data.ubicacion,
        estado: data.estado,
        profundidad_maxima: data.profundidad_maxima,
        coordenadas_lat: data.coordenadas_lat,
        coordenadas_lng: data.coordenadas_lng,
        capacidad_jaulas: data.capacidad_jaulas,
        observaciones: data.observaciones,
      };
      await onSubmit(sitioData);
    } catch (error) {
      console.error('Error creating sitio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
  };

  const isAdminSalmonera = profile?.role === 'admin_salmonera';

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Nuevo Sitio de Acuicultura</CardTitle>
              <p className="text-sm text-zinc-500">Crear un nuevo sitio para operaciones de acuicultura</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {isAdminSalmonera && (
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-blue-800">
              <strong>Auto-asignación:</strong> Este sitio se asociará automáticamente a su salmonera.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Sitio *</Label>
              <Input
                id="nombre"
                {...register('nombre')}
                placeholder="Ej: Sitio Salmón Norte"
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
                placeholder="Ej: SSN-001"
              />
              {errors.codigo && (
                <p className="text-sm text-red-600">{errors.codigo.message}</p>
              )}
            </div>

            {!isAdminSalmonera && (
              <div className="space-y-2">
                <Label htmlFor="salmonera_id">Salmonera *</Label>
                <Select onValueChange={(value) => setValue('salmonera_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar salmonera" />
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
            )}

            {isAdminSalmonera && (
              <div className="space-y-2">
                <Label>Salmonera</Label>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Asignada automáticamente
                  </Badge>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select defaultValue="activo" onValueChange={(value) => setValue('estado', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ubicacion">Ubicación *</Label>
            <Input
              id="ubicacion"
              {...register('ubicacion')}
              placeholder="Ej: Puerto Montt, Región de Los Lagos"
            />
            {errors.ubicacion && (
              <p className="text-sm text-red-600">{errors.ubicacion.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
              <Input
                id="profundidad_maxima"
                type="number"
                step="0.1"
                {...register('profundidad_maxima', { valueAsNumber: true })}
                placeholder="50.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacidad_jaulas">Capacidad de Jaulas</Label>
              <Input
                id="capacidad_jaulas"
                type="number"
                {...register('capacidad_jaulas', { valueAsNumber: true })}
                placeholder="12"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Coordenadas GPS</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowMap(!showMap)}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {showMap ? 'Ocultar Mapa' : 'Seleccionar en Mapa'}
              </Button>
            </div>

            <AnimatePresence>
              {showMap && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 400 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <SimpleMap
                    onLocationSelect={handleLocationSelect}
                    height="400px"
                    initialLat={coordinates.lat || -41.4693}
                    initialLng={coordinates.lng || -72.9424}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coordenadas_lat">Latitud</Label>
                <Input
                  id="coordenadas_lat"
                  type="number"
                  step="any"
                  {...register('coordenadas_lat', { valueAsNumber: true })}
                  placeholder="-41.4693"
                  value={coordinates.lat || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      setCoordinates(prev => ({ ...prev, lat: value }));
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coordenadas_lng">Longitud</Label>
                <Input
                  id="coordenadas_lng"
                  type="number"
                  step="any"
                  {...register('coordenadas_lng', { valueAsNumber: true })}
                  placeholder="-72.9424"
                  value={coordinates.lng || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      setCoordinates(prev => ({ ...prev, lng: value }));
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              {...register('observaciones')}
              placeholder="Observaciones adicionales sobre el sitio..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creando...
                </>
              ) : (
                "Crear Sitio"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
