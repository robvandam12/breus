
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock, MapPin, User, AlertCircle } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useCentros } from '@/hooks/useCentros';
import { useCuadrillas } from '@/hooks/useCuadrillas';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InmersionFormData {
  codigo: string;
  operacion_id?: string;
  centro_id?: string;
  fecha_inmersion: Date;
  hora_inicio: string;
  objetivo: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  supervisor: string;
  buzo_principal: string;
  buzo_asistente?: string;
  observaciones?: string;
  is_independent?: boolean;
  planned_bottom_time?: number;
}

interface InmersionFormEnhancedProps {
  onSubmit: (data: InmersionFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<InmersionFormData>;
  mode?: 'independent' | 'planned';
}

export const InmersionFormEnhanced = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  mode = 'independent'
}: InmersionFormEnhancedProps) => {
  const { profile } = useAuth();
  const { operaciones } = useOperaciones();
  const { centros } = useCentros();
  const { cuadrillas } = useCuadrillas();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InmersionFormData>({
    codigo: '',
    fecha_inmersion: new Date(),
    hora_inicio: '08:00',
    objetivo: '',
    profundidad_max: 0,
    temperatura_agua: 12,
    visibilidad: 5,
    corriente: 'débil',
    supervisor: '',
    buzo_principal: '',
    buzo_asistente: '',
    observaciones: '',
    is_independent: mode === 'independent',
    planned_bottom_time: 60,
    ...initialData
  });

  // Filtrar centros según la empresa del usuario
  const availableCentros = centros.filter(centro => {
    if (profile?.salmonera_id) {
      return centro.salmonera_id === profile.salmonera_id;
    }
    return true; // Superuser puede ver todos
  });

  // Filtrar cuadrillas disponibles para el centro seleccionado
  const availableCuadrillas = cuadrillas.filter(cuadrilla => {
    if (formData.centro_id) {
      return cuadrilla.centro_id === formData.centro_id || !cuadrilla.centro_id; // Global o específico del centro
    }
    return cuadrilla.empresa_id === profile?.salmonera_id || cuadrilla.empresa_id === profile?.servicio_id;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent submission if form is already being submitted
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof InmersionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Auto-generar código si está vacío
  useEffect(() => {
    if (!formData.codigo) {
      const today = new Date();
      const dateStr = format(today, 'yyyyMMdd');
      const timeStr = formData.hora_inicio.replace(':', '');
      const prefix = mode === 'independent' ? 'IND' : 'PLN';
      updateFormData('codigo', `${prefix}-${dateStr}-${timeStr}`);
    }
  }, [formData.hora_inicio, mode]);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {mode === 'independent' ? 'Nueva Inmersión Independiente' : 'Nueva Inmersión Planificada'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código de Inmersión *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => updateFormData('codigo', e.target.value)}
                placeholder="Ej: IND-20240101-0800"
                required
              />
            </div>

            {mode === 'planned' && (
              <div>
                <Label htmlFor="operacion_id">Operación Asociada *</Label>
                <Select value={formData.operacion_id || ''} onValueChange={(value) => updateFormData('operacion_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar operación" />
                  </SelectTrigger>
                  <SelectContent>
                    {operaciones.map((operacion) => (
                      <SelectItem key={operacion.id} value={operacion.id}>
                        {operacion.codigo} - {operacion.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="centro_id">Centro de Operación *</Label>
              <Select value={formData.centro_id || ''} onValueChange={(value) => updateFormData('centro_id', value)}>
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

            <div>
              <Label htmlFor="objetivo">Objetivo de la Inmersión *</Label>
              <Input
                id="objetivo"
                value={formData.objetivo}
                onChange={(e) => updateFormData('objetivo', e.target.value)}
                placeholder="Ej: Inspección de redes"
                required
              />
            </div>
          </div>

          {/* Fecha y Hora */}
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
                value={formData.planned_bottom_time || 60}
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
              <Label htmlFor="temperatura_agua">Temperatura (°C) *</Label>
              <Input
                id="temperatura_agua"
                type="number"
                value={formData.temperatura_agua}
                onChange={(e) => updateFormData('temperatura_agua', Number(e.target.value))}
                step="0.1"
                required
              />
            </div>

            <div>
              <Label htmlFor="visibilidad">Visibilidad (m) *</Label>
              <Input
                id="visibilidad"
                type="number"
                value={formData.visibilidad}
                onChange={(e) => updateFormData('visibilidad', Number(e.target.value))}
                min="0"
                step="0.1"
                required
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

          {/* Personal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="supervisor">Supervisor *</Label>
              <Input
                id="supervisor"
                value={formData.supervisor}
                onChange={(e) => updateFormData('supervisor', e.target.value)}
                placeholder="Nombre del supervisor"
                required
              />
            </div>

            <div>
              <Label htmlFor="buzo_principal">Buzo Principal *</Label>
              <Input
                id="buzo_principal"
                value={formData.buzo_principal}
                onChange={(e) => updateFormData('buzo_principal', e.target.value)}
                placeholder="Nombre del buzo principal"
                required
              />
            </div>

            <div>
              <Label htmlFor="buzo_asistente">Buzo Asistente</Label>
              <Input
                id="buzo_asistente"
                value={formData.buzo_asistente || ''}
                onChange={(e) => updateFormData('buzo_asistente', e.target.value)}
                placeholder="Nombre del buzo asistente"
              />
            </div>
          </div>

          {/* Cuadrillas Disponibles */}
          {formData.centro_id && availableCuadrillas.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="mt-2">
                  <p className="font-medium mb-2">Cuadrillas disponibles para este centro:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {availableCuadrillas.map((cuadrilla) => (
                      <div key={cuadrilla.id} className="p-2 bg-blue-50 rounded text-sm">
                        <div className="font-medium">{cuadrilla.nombre}</div>
                        <div className="text-xs text-gray-600">
                          {cuadrilla.miembros?.length || 0} miembros - {cuadrilla.estado}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

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
              {isSubmitting ? 'Creando...' : 'Crear Inmersión'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
