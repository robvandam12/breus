
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useCentros } from '@/hooks/useCentros';
import { useSalmoneras } from '@/hooks/useSalmoneras';

const centroSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  codigo: z.string().min(1, 'Código es requerido'),
  ubicacion: z.string().min(1, 'Ubicación es requerida'),
  salmonera_id: z.string().min(1, 'Salmonera es requerida'),
  coordenadas_lat: z.number().optional(),
  coordenadas_lng: z.number().optional(),
  profundidad_maxima: z.number().optional(),
  capacidad_jaulas: z.number().optional(),
  region: z.string().optional(),
  observaciones: z.string().optional(),
  estado: z.enum(['activo', 'inactivo', 'mantenimiento']).default('activo'),
});

type CentroFormData = z.infer<typeof centroSchema>;

interface CreateSitioFormAnimatedProps {
  onCancel: () => void;
}

export const CreateSitioFormAnimated = ({ onCancel }: CreateSitioFormAnimatedProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  const { createCentro, isCreating } = useCentros();
  const { salmoneras } = useSalmoneras();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CentroFormData>({
    resolver: zodResolver(centroSchema),
    defaultValues: {
      estado: 'activo'
    }
  });

  const onSubmit = async (data: CentroFormData) => {
    try {
      await createCentro({
        ...data,
        coordenadas_lat: data.coordenadas_lat || 0,
        coordenadas_lng: data.coordenadas_lng || 0,
        profundidad_maxima: data.profundidad_maxima || 0,
        capacidad_jaulas: data.capacidad_jaulas || 0,
        observaciones: data.observaciones || ''
      });
      onCancel();
    } catch (error) {
      console.error('Error creating centro:', error);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Nuevo Centro</CardTitle>
              <p className="text-sm text-zinc-500">
                Paso {currentStep} de {totalSteps} - Crear un nuevo centro de trabajo
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-blue-700">Información Básica</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre del Centro *</Label>
                    <Input
                      id="nombre"
                      {...register('nombre')}
                      placeholder="Ej: Centro Punta Arenas"
                    />
                    {errors.nombre && (
                      <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="codigo">Código *</Label>
                    <Input
                      id="codigo"
                      {...register('codigo')}
                      placeholder="Ej: CPA-001"
                    />
                    {errors.codigo && (
                      <p className="text-red-500 text-sm mt-1">{errors.codigo.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
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
                      <p className="text-red-500 text-sm mt-1">{errors.salmonera_id.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Select onValueChange={(value: 'activo' | 'inactivo' | 'mantenimiento') => setValue('estado', value)}>
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
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-blue-700">Ubicación y Coordenadas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="ubicacion">Ubicación *</Label>
                    <Input
                      id="ubicacion"
                      {...register('ubicacion')}
                      placeholder="Ej: Región de Magallanes, Chile"
                    />
                    {errors.ubicacion && (
                      <p className="text-red-500 text-sm mt-1">{errors.ubicacion.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="region">Región</Label>
                    <Input
                      id="region"
                      {...register('region')}
                      placeholder="Ej: XII Región de Magallanes"
                    />
                  </div>

                  <div>
                    <Label htmlFor="coordenadas_lat">Latitud</Label>
                    <Input
                      id="coordenadas_lat"
                      type="number"
                      step="any"
                      {...register('coordenadas_lat', { valueAsNumber: true })}
                      placeholder="Ej: -53.1638"
                    />
                  </div>

                  <div>
                    <Label htmlFor="coordenadas_lng">Longitud</Label>
                    <Input
                      id="coordenadas_lng"
                      type="number"
                      step="any"
                      {...register('coordenadas_lng', { valueAsNumber: true })}
                      placeholder="Ej: -70.9171"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-blue-700">Características Técnicas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
                    <Input
                      id="profundidad_maxima"
                      type="number"
                      step="0.1"
                      {...register('profundidad_maxima', { valueAsNumber: true })}
                      placeholder="Ej: 40.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="capacidad_jaulas">Capacidad de Jaulas</Label>
                    <Input
                      id="capacidad_jaulas"
                      type="number"
                      {...register('capacidad_jaulas', { valueAsNumber: true })}
                      placeholder="Ej: 12"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="observaciones">Observaciones</Label>
                    <Textarea
                      id="observaciones"
                      {...register('observaciones')}
                      placeholder="Comentarios adicionales sobre el centro..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between pt-6 border-t">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              {currentStep < totalSteps ? (
                <Button type="button" onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={isCreating} className="bg-blue-600 hover:bg-blue-700">
                  {isCreating ? 'Creando...' : 'Crear Centro'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
