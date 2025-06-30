
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Zap, Calendar as CalendarLucide } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useCentros } from '@/hooks/useCentros';
import { useAuth } from '@/hooks/useAuth';
import { useEnterpriseModuleAccess } from '@/hooks/useEnterpriseModuleAccess';
import { toast } from '@/hooks/use-toast';
import { EnhancedCuadrillaSelector } from '@/components/cuadrillas/EnhancedCuadrillaSelector';

interface SalmoneroInmersionFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  initialData?: any;
}

export const SalmoneroInmersionForm = ({ onSubmit, onCancel, initialData }: SalmoneroInmersionFormProps) => {
  const { profile } = useAuth();
  const { operaciones } = useOperaciones();
  const { centros } = useCentros();
  const { getModulesForCompany } = useEnterpriseModuleAccess();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPlanning, setHasPlanning] = useState(false);
  const [selectedCuadrillaId, setSelectedCuadrillaId] = useState<string | null>(null);
  const [debouncedCentroId, setDebouncedCentroId] = useState<string>('');
  
  const [formData, setFormData] = useState({
    codigo: '',
    operacion_id: '',
    centro_id: '',
    fecha_inmersion: new Date(),
    hora_inicio: '08:00',
    hora_fin: '',
    objetivo: '',
    profundidad_max: 0,
    temperatura_agua: 12,
    visibilidad: 5,
    corriente: 'débil',
    observaciones: '',
    is_independent: false,
    planned_bottom_time: 60,
    ...initialData
  });

  // Debouncer para centro_id para evitar actualizaciones constantes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedCentroId(formData.centro_id);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.centro_id]);

  // Verificar módulos de la empresa con memoización
  const moduleCheck = useMemo(() => {
    return async () => {
      if (profile?.salmonera_id) {
        try {
          const moduleAccess = await getModulesForCompany(profile.salmonera_id, 'salmonera');
          setHasPlanning(moduleAccess.hasPlanning);
          
          // Si no tiene planning, forzar a independiente
          if (!moduleAccess.hasPlanning) {
            setFormData(prev => ({ ...prev, is_independent: true }));
          }
        } catch (error) {
          console.error('Error checking modules:', error);
          setHasPlanning(false);
          setFormData(prev => ({ ...prev, is_independent: true }));
        }
      }
    };
  }, [profile?.salmonera_id, getModulesForCompany]);

  useEffect(() => {
    moduleCheck();
  }, [moduleCheck]);

  // Filtrar operaciones y centros con memoización
  const availableOperaciones = useMemo(() => {
    return operaciones.filter(op => {
      if (profile?.salmonera_id) {
        return op.salmonera_id === profile.salmonera_id;
      }
      return true;
    });
  }, [operaciones, profile?.salmonera_id]);

  const availableCentros = useMemo(() => {
    return centros.filter(centro => {
      if (profile?.salmonera_id) {
        return centro.salmonera_id === profile.salmonera_id;
      }
      return true;
    });
  }, [centros, profile?.salmonera_id]);

  // Auto-generar código con debounce
  useEffect(() => {
    if (!initialData && (!formData.codigo || formData.codigo.startsWith('AUTO-'))) {
      const timeoutId = setTimeout(() => {
        const generateCode = () => {
          const dateStr = format(formData.fecha_inmersion, 'yyyyMMdd');
          const timeStr = formData.hora_inicio.replace(':', '');
          const prefix = formData.is_independent ? 'IND' : 'SAL';
          const random = Math.random().toString(36).substring(2, 5).toUpperCase();
          return `${prefix}-${dateStr}-${timeStr}-${random}`;
        };
        
        setFormData(prev => ({ ...prev, codigo: generateCode() }));
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [formData.fecha_inmersion, formData.hora_inicio, formData.is_independent, initialData]);

  const updateFormData = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const validateForm = useCallback(() => {
    if (!formData.codigo?.trim()) {
      toast({
        title: "Error de validación",
        description: "El código de inmersión es requerido",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.objetivo?.trim()) {
      toast({
        title: "Error de validación", 
        description: "El objetivo de la inmersión es requerido",
        variant: "destructive"
      });
      return false;
    }

    if (formData.profundidad_max <= 0) {
      toast({
        title: "Error de validación",
        description: "La profundidad máxima debe ser mayor a 0",
        variant: "destructive"
      });
      return false;
    }

    return true;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Preparar datos con contexto empresarial correcto
      const submitData = {
        ...formData,
        fecha_inmersion: format(formData.fecha_inmersion, 'yyyy-MM-dd'),
        empresa_creadora_id: profile?.salmonera_id,
        empresa_creadora_tipo: 'salmonera',
        contexto_operativo: formData.is_independent ? 'independiente' : 'planificada',
        profundidad_max: Number(formData.profundidad_max),
        temperatura_agua: Number(formData.temperatura_agua),
        visibilidad: Number(formData.visibilidad),
        planned_bottom_time: Number(formData.planned_bottom_time),
        metadata: {
          cuadrilla_id: selectedCuadrillaId,
          enterprise_context: {
            salmonera_id: profile?.salmonera_id,
            context_metadata: {
              selection_mode: 'salmonera_admin',
              empresa_origen_tipo: 'salmonera'
            }
          }
        }
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el formulario. Intente nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedCuadrillaId, profile, isSubmitting, validateForm, onSubmit]);

  // Memoizar el contexto empresarial para evitar re-renders
  const enterpriseContext = useMemo(() => ({
    salmonera_id: profile?.salmonera_id,
    context_metadata: {
      selection_mode: 'salmonera_admin',
      empresa_origen_tipo: 'salmonera'
    }
  }), [profile?.salmonera_id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Salmonera
        </Badge>
        <span>Formulario de Inmersión</span>
        {hasPlanning && (
          <Badge variant="outline" className="ml-auto text-green-600 border-green-200">
            Planning Activo
          </Badge>
        )}
        {!hasPlanning && (
          <Badge variant="outline" className="ml-auto text-amber-600 border-amber-200">
            Solo Independientes
          </Badge>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        {/* Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="codigo">Código de Inmersión *</Label>
            <Input
              id="codigo"
              value={formData.codigo}
              onChange={(e) => updateFormData('codigo', e.target.value)}
              placeholder="Código único de inmersión"
              required
            />
          </div>

          {hasPlanning && (
            <div>
              <Label className="flex items-center justify-between">
                <span>Tipo de Inmersión</span>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <Switch
                    checked={!formData.is_independent}
                    onCheckedChange={(checked) => updateFormData('is_independent', !checked)}
                    id="inmersion-type"
                  />
                  <CalendarLucide className="w-4 h-4" />
                </div>
              </Label>
              <div className="mt-2">
                <Badge variant={formData.is_independent ? "default" : "secondary"}>
                  {formData.is_independent ? "Independiente" : "Planificada"}
                </Badge>
              </div>
            </div>
          )}

          {!formData.is_independent && hasPlanning && (
            <div className="md:col-span-2">
              <Label htmlFor="operacion_id">Operación Asociada *</Label>
              <Select value={formData.operacion_id} onValueChange={(value) => updateFormData('operacion_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar operación" />
                </SelectTrigger>
                <SelectContent>
                  {availableOperaciones.map((operacion) => (
                    <SelectItem key={operacion.id} value={operacion.id}>
                      {operacion.codigo} - {operacion.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="md:col-span-2">
            <Label htmlFor="centro_id">Centro de Operación *</Label>
            <Select value={formData.centro_id} onValueChange={(value) => updateFormData('centro_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar centro" />
              </SelectTrigger>
              <SelectContent>
                {availableCentros.map((centro) => (
                  <SelectItem key={centro.id} value={centro.id}>
                    {centro.nombre} - {centro.codigo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="objetivo">Objetivo de la Inmersión *</Label>
            <Input
              id="objetivo"
              value={formData.objetivo}
              onChange={(e) => updateFormData('objetivo', e.target.value)}
              placeholder="Descripción del objetivo de la inmersión"
              required
            />
          </div>
        </div>

        {/* Fecha y Horarios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Fecha de Inmersión *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(formData.fecha_inmersion, 'PPP', { locale: es })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.fecha_inmersion}
                  onSelect={(date) => date && updateFormData('fecha_inmersion', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="hora_inicio">Hora de Inicio *</Label>
            <Input
              id="hora_inicio"
              type="time"
              value={formData.hora_inicio}
              onChange={(e) => updateFormData('hora_inicio', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="planned_bottom_time">Tiempo Planificado (min)</Label>
            <Input
              id="planned_bottom_time"
              type="number"
              value={formData.planned_bottom_time}
              onChange={(e) => updateFormData('planned_bottom_time', Number(e.target.value))}
              min="1"
            />
          </div>
        </div>

        {/* Condiciones del Agua */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="profundidad_max">Profundidad Máx. (m) *</Label>
            <Input
              id="profundidad_max"
              type="number"
              value={formData.profundidad_max}
              onChange={(e) => updateFormData('profundidad_max', Number(e.target.value))}
              min="0"
              step="0.1"
              required
            />
          </div>

          <div>
            <Label htmlFor="temperatura_agua">Temperatura (°C)</Label>
            <Input
              id="temperatura_agua"
              type="number"
              value={formData.temperatura_agua}
              onChange={(e) => updateFormData('temperatura_agua', Number(e.target.value))}
              step="0.1"
            />
          </div>

          <div>
            <Label htmlFor="visibilidad">Visibilidad (m)</Label>
            <Input
              id="visibilidad"
              type="number"
              value={formData.visibilidad}
              onChange={(e) => updateFormData('visibilidad', Number(e.target.value))}
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <Label htmlFor="corriente">Corriente</Label>
            <Select value={formData.corriente} onValueChange={(value) => updateFormData('corriente', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nula">Nula</SelectItem>
                <SelectItem value="débil">Débil</SelectItem>
                <SelectItem value="moderada">Moderada</SelectItem>
                <SelectItem value="fuerte">Fuerte</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Selector de Cuadrilla con valores memoizados */}
        <EnhancedCuadrillaSelector
          selectedCuadrillaId={selectedCuadrillaId}
          onCuadrillaChange={setSelectedCuadrillaId}
          fechaInmersion={format(formData.fecha_inmersion, 'yyyy-MM-dd')}
          centroId={debouncedCentroId}
          enterpriseContext={enterpriseContext}
        />

        {/* Observaciones */}
        <div>
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea
            id="observaciones"
            value={formData.observaciones || ''}
            onChange={(e) => updateFormData('observaciones', e.target.value)}
            placeholder="Observaciones adicionales..."
            rows={3}
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : (initialData ? 'Actualizar' : 'Crear Inmersión')}
          </Button>
        </div>
      </form>
    </div>
  );
};
