
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Users, FileText, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCentros } from '@/hooks/useCentros';
import { useContratistas } from '@/hooks/useContratistas';

const operacionSchema = z.object({
  codigo: z.string().min(1, "Código es requerido"),
  nombre: z.string().min(3, "Nombre debe tener al menos 3 caracteres"),
  fecha_inicio: z.string().min(1, "Fecha de inicio es requerida"),
  fecha_fin: z.string().optional(),
  estado: z.enum(['activa', 'pausada', 'completada', 'cancelada']).default('activa'),
  tareas: z.string().optional(),
  centro_id: z.string().optional(),
  contratista_id: z.string().optional(),
});

type OperacionFormData = z.infer<typeof operacionSchema>;

interface CreateOperacionFormEnhancedProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  enterpriseContext?: any;
}

export const CreateOperacionFormEnhanced = ({ 
  onSubmit, 
  onCancel, 
  enterpriseContext 
}: CreateOperacionFormEnhancedProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Cargar datos reales
  const { centros, isLoading: loadingCentros } = useCentros();
  const { contratistas, isLoading: loadingContratistas } = useContratistas();

  const form = useForm<OperacionFormData>({
    resolver: zodResolver(operacionSchema),
    defaultValues: {
      codigo: '',
      nombre: '',
      fecha_inicio: '',
      fecha_fin: '',
      estado: 'activa',
      tareas: '',
      centro_id: '',
      contratista_id: '',
    }
  });

  const handleSubmit = async (data: OperacionFormData) => {
    setIsSubmitting(true);
    try {
      // Preparar datos para envío - eliminar campos vacíos que causen error UUID
      const operacionData = {
        ...data,
        salmonera_id: enterpriseContext?.salmonera_id,
        contratista_id: data.contratista_id || null, // null en lugar de string vacío
        centro_id: data.centro_id || null, // null en lugar de string vacío
        company_id: enterpriseContext?.salmonera_id || enterpriseContext?.contratista_id,
        company_type: enterpriseContext?.salmonera_id ? 'salmonera' : 'contratista',
      };

      // Remover campos vacíos para evitar errores UUID
      Object.keys(operacionData).forEach(key => {
        if (operacionData[key] === '') {
          operacionData[key] = null;
        }
      });

      console.log('Submitting operacion data:', operacionData);
      await onSubmit(operacionData);
    } catch (error) {
      console.error('Error submitting operacion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-16 h-1 mx-2 ${
                step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        
        {/* Step 1: Información Básica */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Información Básica de la Operación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="codigo">Código de Operación *</Label>
                  <Input
                    id="codigo"
                    {...form.register('codigo')}
                    placeholder="Ej: OP-2024-001"
                  />
                  {form.formState.errors.codigo && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.codigo.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Select 
                    value={form.watch('estado')} 
                    onValueChange={(value) => form.setValue('estado', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activa">Activa</SelectItem>
                      <SelectItem value="pausada">Pausada</SelectItem>
                      <SelectItem value="completada">Completada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="nombre">Nombre de la Operación *</Label>
                <Input
                  id="nombre"
                  {...form.register('nombre')}
                  placeholder="Ej: Mantenimiento Red Centro Norte"
                />
                {form.formState.errors.nombre && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.nombre.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="tareas">Descripción de Tareas</Label>
                <Textarea
                  id="tareas"
                  {...form.register('tareas')}
                  placeholder="Describe las tareas principales de esta operación..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Fechas y Cronograma */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Cronograma de la Operación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fecha_inicio">Fecha de Inicio *</Label>
                  <Input
                    id="fecha_inicio"
                    type="date"
                    {...form.register('fecha_inicio')}
                  />
                  {form.formState.errors.fecha_inicio && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.fecha_inicio.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="fecha_fin">Fecha de Fin (Estimada)</Label>
                  <Input
                    id="fecha_fin"
                    type="date"
                    {...form.register('fecha_fin')}
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Información del Cronograma</h4>
                <p className="text-sm text-blue-800">
                  La fecha de inicio marca el comienzo oficial de la operación. 
                  La fecha de fin es estimativa y se puede ajustar según el progreso.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Asignaciones y Confirmación */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Asignaciones y Confirmación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="centro_id">Centro de Trabajo</Label>
                  <Select 
                    value={form.watch('centro_id')} 
                    onValueChange={(value) => form.setValue('centro_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar centro" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingCentros ? (
                        <div className="p-4 text-center text-gray-500">Cargando centros...</div>
                      ) : centros.length > 0 ? (
                        centros.map((centro) => (
                          <SelectItem key={centro.id} value={centro.id}>
                            {centro.nombre} - {centro.salmoneras?.nombre || 'Sin salmonera'}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">No hay centros disponibles</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contratista_id">Empresa de Servicio</Label>
                  <Select 
                    value={form.watch('contratista_id')} 
                    onValueChange={(value) => form.setValue('contratista_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar contratista" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingContratistas ? (
                        <div className="p-4 text-center text-gray-500">Cargando contratistas...</div>
                      ) : contratistas.length > 0 ? (
                        contratistas.map((contratista) => (
                          <SelectItem key={contratista.id} value={contratista.id}>
                            {contratista.nombre}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">No hay contratistas disponibles</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Resumen de la operación */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Resumen de la Operación</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Código:</span>
                    <Badge variant="outline">{form.watch('codigo') || 'Sin definir'}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre:</span>
                    <span className="font-medium">{form.watch('nombre') || 'Sin definir'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <Badge variant={form.watch('estado') === 'activa' ? 'default' : 'secondary'}>
                      {form.watch('estado')}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha Inicio:</span>
                    <span>{form.watch('fecha_inicio') || 'Sin definir'}</span>
                  </div>
                  {form.watch('fecha_fin') && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha Fin:</span>
                      <span>{form.watch('fecha_fin')}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep}
                disabled={isSubmitting}
              >
                Anterior
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>

            {currentStep < 3 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                disabled={!form.watch('codigo') || !form.watch('nombre')}
              >
                Siguiente
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Creando...' : 'Crear Operación'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
