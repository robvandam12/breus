
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreateInmersionData } from "@/hooks/useInmersiones";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CreateInmersionFormProps {
  onSubmit: (data: CreateInmersionData) => Promise<void>;
  onCancel: () => void;
  initialData?: any;
  isEditing?: boolean;
}

export const CreateInmersionForm = ({ onSubmit, onCancel, initialData, isEditing }: CreateInmersionFormProps) => {
  const [formData, setFormData] = useState<CreateInmersionData>({
    operacion_id: '',
    fecha_inmersion: new Date().toISOString().split('T')[0],
    hora_inicio: '',
    hora_fin: '',
    profundidad_maxima: 0,
    buzo_principal: '',
    buzo_asistente: '',
    supervisor: '',
    objetivo: '',
    temperatura_agua: 15,
    visibilidad: 10,
    corriente: 'baja',
    observaciones: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch operaciones
  const { data: operaciones = [] } = useQuery({
    queryKey: ['operaciones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('operacion')
        .select('id, codigo, nombre')
        .eq('estado', 'activa');
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch personal pool (supervisores y buzos)
  const { data: supervisores = [] } = useQuery({
    queryKey: ['supervisores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuario')
        .select('usuario_id, nombre, apellido, perfil_buzo')
        .eq('rol', 'supervisor')
        .eq('perfil_completado', true);
      if (error) throw error;
      return (data || []).filter(user => {
        const perfil = user.perfil_buzo as any;
        return perfil?.disponible !== false;
      });
    }
  });

  const { data: buzos = [] } = useQuery({
    queryKey: ['buzos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuario')
        .select('usuario_id, nombre, apellido, perfil_buzo')
        .eq('rol', 'buzo')
        .eq('perfil_completado', true);
      if (error) throw error;
      return (data || []).filter(user => {
        const perfil = user.perfil_buzo as any;
        return perfil?.disponible !== false;
      });
    }
  });

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        operacion_id: initialData.operacion_id || '',
        fecha_inmersion: initialData.fecha_inmersion || new Date().toISOString().split('T')[0],
        hora_inicio: initialData.hora_inicio || '',
        hora_fin: initialData.hora_fin || '',
        profundidad_maxima: initialData.profundidad_maxima || 0,
        buzo_principal: initialData.buzo_principal || '',
        buzo_asistente: initialData.buzo_asistente || '',
        supervisor: initialData.supervisor || '',
        objetivo: initialData.objetivo || '',
        temperatura_agua: initialData.temperatura_agua || 15,
        visibilidad: initialData.visibilidad || 10,
        corriente: initialData.corriente || 'baja',
        observaciones: initialData.observaciones || ''
      });
    }
  }, [initialData, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPersonDisplayName = (person: any) => {
    const perfil = person.perfil_buzo as any;
    const matricula = perfil?.matricula ? ` (${perfil.matricula})` : '';
    return `${person.nombre} ${person.apellido}${matricula}`;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Inmersión' : 'Nueva Inmersión'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="operacion_id">Operación *</Label>
            <Select
              value={formData.operacion_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, operacion_id: value }))}
            >
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_inmersion">Fecha *</Label>
              <Input
                id="fecha_inmersion"
                type="date"
                value={formData.fecha_inmersion}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha_inmersion: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hora_inicio">Hora de Inicio *</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => setFormData(prev => ({ ...prev, hora_inicio: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supervisor">Supervisor *</Label>
            <Select
              value={formData.supervisor}
              onValueChange={(value) => setFormData(prev => ({ ...prev, supervisor: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar supervisor" />
              </SelectTrigger>
              <SelectContent>
                {supervisores.map((supervisor) => (
                  <SelectItem key={supervisor.usuario_id} value={getPersonDisplayName(supervisor)}>
                    {getPersonDisplayName(supervisor)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buzo_principal">Buzo Principal *</Label>
              <Select
                value={formData.buzo_principal}
                onValueChange={(value) => setFormData(prev => ({ ...prev, buzo_principal: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar buzo principal" />
                </SelectTrigger>
                <SelectContent>
                  {buzos.map((buzo) => (
                    <SelectItem key={buzo.usuario_id} value={getPersonDisplayName(buzo)}>
                      {getPersonDisplayName(buzo)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="buzo_asistente">Buzo Asistente</Label>
              <Select
                value={formData.buzo_asistente || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, buzo_asistente: value || undefined }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar buzo asistente (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin asistente</SelectItem>
                  {buzos.filter(buzo => getPersonDisplayName(buzo) !== formData.buzo_principal).map((buzo) => (
                    <SelectItem key={buzo.usuario_id} value={getPersonDisplayName(buzo)}>
                      {getPersonDisplayName(buzo)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
              <Input
                id="profundidad_maxima"
                type="number"
                min="0"
                step="0.1"
                value={formData.profundidad_maxima}
                onChange={(e) => setFormData(prev => ({ ...prev, profundidad_maxima: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hora_fin">Hora de Fin</Label>
              <Input
                id="hora_fin"
                type="time"
                value={formData.hora_fin || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, hora_fin: e.target.value || undefined }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="objetivo">Objetivo *</Label>
            <Textarea
              id="objetivo"
              value={formData.objetivo}
              onChange={(e) => setFormData(prev => ({ ...prev, objetivo: e.target.value }))}
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperatura_agua">Temperatura Agua (°C)</Label>
              <Input
                id="temperatura_agua"
                type="number"
                min="0"
                max="50"
                value={formData.temperatura_agua}
                onChange={(e) => setFormData(prev => ({ ...prev, temperatura_agua: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visibilidad">Visibilidad (m)</Label>
              <Input
                id="visibilidad"
                type="number"
                min="0"
                value={formData.visibilidad}
                onChange={(e) => setFormData(prev => ({ ...prev, visibilidad: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="corriente">Corriente</Label>
              <Select
                value={formData.corriente}
                onValueChange={(value) => setFormData(prev => ({ ...prev, corriente: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ninguna">Ninguna</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="moderada">Moderada</SelectItem>
                  <SelectItem value="fuerte">Fuerte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value || undefined }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Inmersión')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
