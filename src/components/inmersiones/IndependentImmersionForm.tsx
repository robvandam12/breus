
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Info, Search, Anchor } from 'lucide-react';
import { useEnhancedValidation } from '@/hooks/useEnhancedValidation';
import { useModularSystem } from '@/hooks/useModularSystem';

interface IndependentImmersionFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const IndependentImmersionForm = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: IndependentImmersionFormProps) => {
  const [operationSuggestions, setOperationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { validateWithErrorHandling, validateOperationCode } = useEnhancedValidation();
  const { getUserContext, hasModuleAccess, modules } = useModularSystem();
  
  const userContext = getUserContext();
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      operacion_descripcion: '',
      objetivo: '',
      fecha_inmersion: '',
      hora_inicio: '',
      supervisor: '',
      buzo_principal: '',
      buzo_asistente: '',
      profundidad_max: '',
      observaciones: ''
    }
  });

  const operacionDescripcion = watch('operacion_descripcion');

  // Validar código de operación y obtener sugerencias
  const handleOperationCodeChange = async (value: string) => {
    setValue('operacion_descripcion', value);
    
    if (value.length >= 3) {
      const validation = await validateOperationCode(value);
      if (validation.suggestions && validation.suggestions.length > 0) {
        setOperationSuggestions(validation.suggestions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleFormSubmit = async (data: any) => {
    // Validar antes de enviar
    const validation = await validateWithErrorHandling('create_independent_immersion', data, { showToast: true });
    
    if (validation.success) {
      onSubmit({
        ...data,
        is_independent: true,
        contexto_operativo: 'independiente',
        operacion_id: null, // No hay operación asociada
      });
    }
  };

  const selectSuggestion = (suggestion: string) => {
    const code = suggestion.split(' - ')[0];
    setValue('operacion_descripcion', code);
    setShowSuggestions(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Anchor className="w-5 h-5" />
          Nueva Inmersión Independiente
        </CardTitle>
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="w-5 h-5 text-blue-600" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">Inmersión Independiente</p>
              <p className="text-blue-700">
                {userContext.isContratista
                  ? "Crea una inmersión sin operación planificada. Especifica el código de la operación externa."
                  : "Crea una inmersión directa sin necesidad de planificación previa."
                }
              </p>
            </div>
          </div>
          
          {userContext.isContratista && hasModuleAccess(modules.PLANNING_OPERATIONS) && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Info className="w-5 h-5 text-amber-600" />
              <div className="text-sm">
                <p className="font-medium text-amber-900">Módulo de Planificación Disponible</p>
                <p className="text-amber-700">
                  Tu salmonera tiene activo el módulo de planificación. Considera asociar esta inmersión a una operación planificada.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Código de Operación */}
          <div className="space-y-2">
            <Label htmlFor="operacion_descripcion" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Código de Operación Externa *
            </Label>
            <div className="relative">
              <Input
                id="operacion_descripcion"
                placeholder="Ej: OP-2024-001, MANT-RED-15, etc."
                {...register('operacion_descripcion', { 
                  required: 'El código de operación es obligatorio',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                })}
                onChange={(e) => handleOperationCodeChange(e.target.value)}
                className={errors.operacion_descripcion ? 'border-red-500' : ''}
              />
              
              {showSuggestions && operationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  <div className="p-2 text-xs text-gray-500 border-b">
                    Operaciones similares encontradas:
                  </div>
                  {operationSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full p-2 text-left text-sm hover:bg-gray-50 border-b last:border-b-0"
                      onClick={() => selectSuggestion(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.operacion_descripcion && (
              <p className="text-sm text-red-600">{errors.operacion_descripcion.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Especifica el código de la operación externa a la que corresponde esta inmersión
            </p>
          </div>

          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="objetivo">Objetivo de la Inmersión *</Label>
              <Input
                id="objetivo"
                placeholder="Descripción del trabajo a realizar"
                {...register('objetivo', { required: 'El objetivo es obligatorio' })}
                className={errors.objetivo ? 'border-red-500' : ''}
              />
              {errors.objetivo && (
                <p className="text-sm text-red-600 mt-1">{errors.objetivo.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="fecha_inmersion">Fecha de Inmersión *</Label>
              <Input
                id="fecha_inmersion"
                type="date"
                {...register('fecha_inmersion', { required: 'La fecha es obligatoria' })}
                className={errors.fecha_inmersion ? 'border-red-500' : ''}
              />
              {errors.fecha_inmersion && (
                <p className="text-sm text-red-600 mt-1">{errors.fecha_inmersion.message}</p>
              )}
            </div>
          </div>

          {/* Personal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="supervisor">Supervisor *</Label>
              <Input
                id="supervisor"
                placeholder="Nombre del supervisor"
                {...register('supervisor', { required: 'El supervisor es obligatorio' })}
                className={errors.supervisor ? 'border-red-500' : ''}
              />
              {errors.supervisor && (
                <p className="text-sm text-red-600 mt-1">{errors.supervisor.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="buzo_principal">Buzo Principal *</Label>
              <Input
                id="buzo_principal"
                placeholder="Nombre del buzo principal"
                {...register('buzo_principal', { required: 'El buzo principal es obligatorio' })}
                className={errors.buzo_principal ? 'border-red-500' : ''}
              />
              {errors.buzo_principal && (
                <p className="text-sm text-red-600 mt-1">{errors.buzo_principal.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="buzo_asistente">Buzo Asistente</Label>
              <Input
                id="buzo_asistente"
                placeholder="Nombre del buzo asistente (opcional)"
                {...register('buzo_asistente')}
              />
            </div>
          </div>

          {/* Detalles Técnicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hora_inicio">Hora de Inicio</Label>
              <Input
                id="hora_inicio"
                type="time"
                {...register('hora_inicio')}
              />
            </div>

            <div>
              <Label htmlFor="profundidad_max">Profundidad Máxima (m)</Label>
              <Input
                id="profundidad_max"
                type="number"
                step="0.1"
                placeholder="Ej: 15.5"
                {...register('profundidad_max')}
              />
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              placeholder="Observaciones adicionales sobre la inmersión..."
              rows={3}
              {...register('observaciones')}
            />
          </div>

          {/* Validación Contextual */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Validación Contextual</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-700 border-green-300">
                  ✓ Sin validación previa
                </Badge>
                <span className="text-sm text-gray-600">
                  Inmersión independiente - No requiere HPT ni Anexo Bravo
                </span>
              </div>
              
              {userContext.isContratista && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-blue-700 border-blue-300">
                    ✓ Contratista
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Código de operación externa requerido
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Anchor className="w-4 h-4" />
              )}
              Crear Inmersión Independiente
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
