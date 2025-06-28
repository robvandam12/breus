
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Plus } from 'lucide-react';
import { useCentros } from '@/hooks/useCentros';
import { useSalmoneras } from '@/hooks/useSalmoneras';
import type { CentroFormData } from '@/hooks/useCentros';

const sitioSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  codigo: z.string().min(1, 'Código es requerido'),
  salmonera_id: z.string().min(1, 'Salmonera es requerida'),
  ubicacion: z.string().min(1, 'Ubicación es requerida'),
  region: z.string().optional(),
  coordenadas_lat: z.number(),
  coordenadas_lng: z.number(),
  profundidad_maxima: z.number().min(0),
  capacidad_jaulas: z.number().min(0),
  estado: z.enum(['activo', 'inactivo', 'mantenimiento']).default('activo'),
  observaciones: z.string().optional().default('')
});

interface CreateSitioFormAnimatedProps {
  onCancel: () => void;
  onSubmit: (data: CentroFormData) => Promise<void>;
}

export const CreateSitioFormAnimated = ({ onCancel, onSubmit }: CreateSitioFormAnimatedProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { salmoneras } = useSalmoneras();
  const { isLoading } = useCentros();

  const form = useForm<z.infer<typeof sitioSchema>>({
    resolver: zodResolver(sitioSchema),
    defaultValues: {
      nombre: '',
      codigo: '',
      salmonera_id: '',
      ubicacion: '',
      region: '',
      coordenadas_lat: 0,
      coordenadas_lng: 0,
      profundidad_maxima: 0,
      capacidad_jaulas: 0,
      estado: 'activo',
      observaciones: ''
    }
  });

  const handleSubmit = async (values: z.infer<typeof sitioSchema>) => {
    setIsSubmitting(true);
    try {
      const centroData: CentroFormData = {
        nombre: values.nombre,
        codigo: values.codigo,
        salmonera_id: values.salmonera_id,
        ubicacion: values.ubicacion,
        region: values.region || '',
        coordenadas_lat: values.coordenadas_lat,
        coordenadas_lng: values.coordenadas_lng,
        profundidad_maxima: values.profundidad_maxima,
        capacidad_jaulas: values.capacidad_jaulas,
        estado: values.estado,
        observaciones: values.observaciones || ''
      };
      
      await onSubmit(centroData);
    } catch (error) {
      console.error('Error creating centro:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Crear Nuevo Centro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  {...form.register('nombre')}
                  placeholder="Nombre del centro"
                />
                {form.formState.errors.nombre && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.nombre.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  {...form.register('codigo')}
                  placeholder="Ej: CTR-001"
                />
                {form.formState.errors.codigo && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.codigo.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="salmonera_id">Salmonera *</Label>
                <Select onValueChange={(value) => form.setValue('salmonera_id', value)}>
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
                {form.formState.errors.salmonera_id && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.salmonera_id.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <Select onValueChange={(value: 'activo' | 'inactivo' | 'mantenimiento') => form.setValue('estado', value)}>
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

              <div>
                <Label htmlFor="ubicacion">Ubicación *</Label>
                <Input
                  id="ubicacion"
                  {...form.register('ubicacion')}
                  placeholder="Ubicación del centro"
                />
                {form.formState.errors.ubicacion && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.ubicacion.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="region">Región</Label>
                <Input
                  id="region"
                  {...form.register('region')}
                  placeholder="Región"
                />
              </div>

              <div>
                <Label htmlFor="coordenadas_lat">Latitud</Label>
                <Input
                  id="coordenadas_lat"
                  type="number"
                  step="any"
                  {...form.register('coordenadas_lat', { valueAsNumber: true })}
                  placeholder="-33.4489"
                />
              </div>

              <div>
                <Label htmlFor="coordenadas_lng">Longitud</Label>
                <Input
                  id="coordenadas_lng"
                  type="number"
                  step="any"
                  {...form.register('coordenadas_lng', { valueAsNumber: true })}
                  placeholder="-70.6693"
                />
              </div>

              <div>
                <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
                <Input
                  id="profundidad_maxima"
                  type="number"
                  {...form.register('profundidad_maxima', { valueAsNumber: true })}
                  placeholder="Profundidad en metros"
                />
              </div>

              <div>
                <Label htmlFor="capacidad_jaulas">Capacidad de Jaulas</Label>
                <Input
                  id="capacidad_jaulas"
                  type="number"
                  {...form.register('capacidad_jaulas', { valueAsNumber: true })}
                  placeholder="Número de jaulas"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                {...form.register('observaciones')}
                placeholder="Observaciones adicionales..."
                className="min-h-[100px]"
              />
            </div>

            <div className="flex gap-3 pt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting || isLoading} 
                className="flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Creando...' : 'Crear Centro'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
