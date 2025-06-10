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
import { MapPin, X, Building, Info, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SitioFormData } from "@/hooks/useSitios";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LeafletMap } from "@/components/ui/leaflet-map";

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  codigo: z.string().min(1, "El código es requerido"),
  salmonera_id: z.string().min(1, "Debe seleccionar una salmonera"),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  region: z.string().min(1, "La región es requerida"),
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

// Función para determinar la región basada en la ubicación
const determinarRegion = (ubicacion: string): string => {
  const ubicacionLower = ubicacion.toLowerCase();
  
  if (ubicacionLower.includes('valparaíso') || ubicacionLower.includes('valparaiso')) return 'Valparaíso';
  if (ubicacionLower.includes('los lagos') || ubicacionLower.includes('puerto montt') || ubicacionLower.includes('osorno')) return 'Los Lagos';
  if (ubicacionLower.includes('aysén') || ubicacionLower.includes('aysen') || ubicacionLower.includes('coyhaique')) return 'Aysén';
  if (ubicacionLower.includes('magallanes') || ubicacionLower.includes('punta arenas')) return 'Magallanes';
  if (ubicacionLower.includes('antofagasta')) return 'Antofagasta';
  if (ubicacionLower.includes('atacama')) return 'Atacama';
  if (ubicacionLower.includes('coquimbo')) return 'Coquimbo';
  if (ubicacionLower.includes('metropolitana') || ubicacionLower.includes('santiago')) return 'Metropolitana';
  if (ubicacionLower.includes('ohiggins') || ubicacionLower.includes('rancagua')) return 'O´Higgins';
  if (ubicacionLower.includes('maule') || ubicacionLower.includes('talca')) return 'Maule';
  if (ubicacionLower.includes('ñuble') || ubicacionLower.includes('chillán')) return 'Ñuble';
  if (ubicacionLower.includes('biobío') || ubicacionLower.includes('biobio') || ubicacionLower.includes('concepción')) return 'Biobío';
  if (ubicacionLower.includes('araucanía') || ubicacionLower.includes('araucania') || ubicacionLower.includes('temuco')) return 'Araucanía';
  if (ubicacionLower.includes('los ríos') || ubicacionLower.includes('los rios') || ubicacionLower.includes('valdivia')) return 'Los Ríos';
  
  return 'Los Lagos'; // Por defecto para sitios de acuicultura
};

export const CreateSitioFormAnimated = ({ onSubmit, onCancel }: CreateSitioFormAnimatedProps) => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: -41.4693,
    lng: -72.9424
  });

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
      region: 'Los Lagos',
      salmonera_id: profile?.role === 'admin_salmonera' ? profile.salmonera_id : '',
      coordenadas_lat: coordinates.lat,
      coordenadas_lng: coordinates.lng,
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
    setValue('coordenadas_lat', coordinates.lat);
    setValue('coordenadas_lng', coordinates.lng);
  }, [coordinates, setValue]);

  // Auto-determinar región cuando cambia la ubicación
  const ubicacion = watch('ubicacion');
  useEffect(() => {
    if (ubicacion) {
      const regionDetectada = determinarRegion(ubicacion);
      setValue('region', regionDetectada);
    }
  }, [ubicacion, setValue]);

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // Asegurar que todos los campos requeridos estén presentes
      const sitioData: SitioFormData = {
        nombre: data.nombre,
        codigo: data.codigo,
        salmonera_id: data.salmonera_id,
        ubicacion: data.ubicacion,
        region: data.region,
        estado: data.estado,
        profundidad_maxima: data.profundidad_maxima,
        coordenadas_lat: coordinates.lat,
        coordenadas_lng: coordinates.lng,
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
    console.log('Location selected:', lat, lng);
    setCoordinates({ lat, lng });
    setValue('coordenadas_lat', lat);
    setValue('coordenadas_lng', lng);
  };

  const handleCoordinateChange = (field: 'lat' | 'lng', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setCoordinates(prev => {
        const newCoords = { ...prev, [field]: numValue };
        setValue('coordenadas_lat', newCoords.lat);
        setValue('coordenadas_lng', newCoords.lng);
        return newCoords;
      });
    }
  };

  const isAdminSalmonera = profile?.role === 'admin_salmonera';

  const regionOptions = [
    { value: 'Los Lagos', label: 'Los Lagos' },
    { value: 'Aysén', label: 'Aysén' },
    { value: 'Magallanes', label: 'Magallanes' },
    { value: 'Los Ríos', label: 'Los Ríos' },
    { value: 'Araucanía', label: 'Araucanía' },
    { value: 'Biobío', label: 'Biobío' },
    { value: 'Ñuble', label: 'Ñuble' },
    { value: 'Maule', label: 'Maule' },
    { value: 'O´Higgins', label: 'O´Higgins' },
    { value: 'Metropolitana', label: 'Metropolitana' },
    { value: 'Valparaíso', label: 'Valparaíso' },
    { value: 'Coquimbo', label: 'Coquimbo' },
    { value: 'Atacama', label: 'Atacama' },
    { value: 'Antofagasta', label: 'Antofagasta' }
  ];

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="space-y-2">
              <Label htmlFor="region">Región *</Label>
              <Select value={watch('region')} onValueChange={(value) => setValue('region', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar región" />
                </SelectTrigger>
                <SelectContent>
                  {regionOptions.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.region && (
                <p className="text-sm text-red-600">{errors.region.message}</p>
              )}
            </div>
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
                <Map className="w-4 h-4 mr-2" />
                {showMap ? 'Ocultar Mapa' : 'Seleccionar en Mapa'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coordenadas_lat">Latitud</Label>
                <Input
                  id="coordenadas_lat"
                  type="number"
                  step="any"
                  value={coordinates.lat}
                  onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                  placeholder="-41.4693"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coordenadas_lng">Longitud</Label>
                <Input
                  id="coordenadas_lng"
                  type="number"
                  step="any"
                  value={coordinates.lng}
                  onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                  placeholder="-72.9424"
                />
              </div>
            </div>

            <AnimatePresence>
              {showMap && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 500 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden rounded-lg border"
                >
                  <LeafletMap
                    onLocationSelect={handleLocationSelect}
                    height="500px"
                    initialLat={coordinates.lat}
                    initialLng={coordinates.lng}
                    showAddressSearch={true}
                  />
                </motion.div>
              )}
            </AnimatePresence>
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
