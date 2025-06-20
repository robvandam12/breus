
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Waves, Thermometer, User } from "lucide-react";
import { useInmersionesEnhanced } from "@/hooks/useInmersionesEnhanced";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface IndependentImmersionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const IndependentImmersionForm = ({ onSuccess, onCancel }: IndependentImmersionFormProps) => {
  const { profile } = useAuth();
  const { createInmersion, isCreating } = useInmersionesEnhanced();
  
  const [formData, setFormData] = useState({
    fecha_inmersion: new Date().toISOString().split('T')[0],
    hora_inicio: '08:00',
    profundidad_max: 10,
    temperatura_agua: 12,
    visibilidad: 5,
    objetivo: '',
    corriente: 'baja',
    buzo_principal: '',
    supervisor: '',
    buzo_asistente: '',
    observaciones: '',
    salmonera_id: profile?.salmonera_id || '',
    contratista_id: '',
    sitio_id: '',
    centro_trabajo_nombre: '',
    lugar_trabajo: '',
    tipo_trabajo: 'buceo_general'
  });

  // Cargar salmoneras para selector
  const { data: salmoneras = [] } = useQuery({
    queryKey: ['salmoneras-select'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salmoneras')
        .select('id, nombre')
        .eq('estado', 'activa')
        .order('nombre');
      if (error) throw error;
      return data;
    },
  });

  // Cargar contratistas para selector
  const { data: contratistas = [] } = useQuery({
    queryKey: ['contratistas-select'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contratistas')
        .select('id, nombre')
        .eq('estado', 'activo')
        .order('nombre');
      if (error) throw error;
      return data;
    },
  });

  // Cargar sitios según salmonera seleccionada
  const { data: sitios = [] } = useQuery({
    queryKey: ['sitios-select', formData.salmonera_id],
    queryFn: async () => {
      if (!formData.salmonera_id) return [];
      const { data, error } = await supabase
        .from('sitios')
        .select('id, nombre, ubicacion')
        .eq('salmonera_id', formData.salmonera_id)
        .eq('estado', 'activo')
        .order('nombre');
      if (error) throw error;
      return data;
    },
    enabled: !!formData.salmonera_id,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createInmersion({
        ...formData,
        profundidad_max: Number(formData.profundidad_max),
        temperatura_agua: Number(formData.temperatura_agua),
        visibilidad: Number(formData.visibilidad),
      });
      onSuccess?.();
    } catch (error) {
      console.error('Error creating independent immersion:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-blue-600" />
            Nueva Inmersión Independiente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha_inmersion">Fecha de Inmersión</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="fecha_inmersion"
                  type="date"
                  value={formData.fecha_inmersion}
                  onChange={(e) => handleInputChange('fecha_inmersion', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="hora_inicio">Hora de Inicio</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="hora_inicio"
                  type="time"
                  value={formData.hora_inicio}
                  onChange={(e) => handleInputChange('hora_inicio', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Ubicación y Contexto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salmonera_id">Salmonera</Label>
              <Select value={formData.salmonera_id} onValueChange={(value) => handleInputChange('salmonera_id', value)}>
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
            </div>

            <div>
              <Label htmlFor="contratista_id">Contratista</Label>
              <Select value={formData.contratista_id} onValueChange={(value) => handleInputChange('contratista_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar contratista" />
                </SelectTrigger>
                <SelectContent>
                  {contratistas.map((contratista) => (
                    <SelectItem key={contratista.id} value={contratista.id}>
                      {contratista.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sitio_id">Sitio</Label>
              <Select value={formData.sitio_id} onValueChange={(value) => handleInputChange('sitio_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sitio" />
                </SelectTrigger>
                <SelectContent>
                  {sitios.map((sitio) => (
                    <SelectItem key={sitio.id} value={sitio.id}>
                      {sitio.nombre} - {sitio.ubicacion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tipo_trabajo">Tipo de Trabajo</Label>
              <Select value={formData.tipo_trabajo} onValueChange={(value) => handleInputChange('tipo_trabajo', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buceo_general">Buceo General</SelectItem>
                  <SelectItem value="mantencion">Mantención</SelectItem>
                  <SelectItem value="inspeccion">Inspección</SelectItem>
                  <SelectItem value="limpieza">Limpieza</SelectItem>
                  <SelectItem value="reparacion">Reparación</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supervisor">Supervisor</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="supervisor"
                  value={formData.supervisor}
                  onChange={(e) => handleInputChange('supervisor', e.target.value)}
                  className="pl-10"
                  placeholder="Nombre del supervisor"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="buzo_principal">Buzo Principal</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="buzo_principal"
                  value={formData.buzo_principal}
                  onChange={(e) => handleInputChange('buzo_principal', e.target.value)}
                  className="pl-10"
                  placeholder="Nombre del buzo principal"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="buzo_asistente">Buzo Asistente (Opcional)</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="buzo_asistente"
                value={formData.buzo_asistente}
                onChange={(e) => handleInputChange('buzo_asistente', e.target.value)}
                className="pl-10"
                placeholder="Nombre del buzo asistente"
              />
            </div>
          </div>

          {/* Condiciones de Buceo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="profundidad_max">Profundidad Máxima (m)</Label>
              <div className="relative">
                <Waves className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="profundidad_max"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.profundidad_max}
                  onChange={(e) => handleInputChange('profundidad_max', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="temperatura_agua">Temperatura (°C)</Label>
              <div className="relative">
                <Thermometer className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="temperatura_agua"
                  type="number"
                  min="0"
                  max="30"
                  step="0.1"
                  value={formData.temperatura_agua}
                  onChange={(e) => handleInputChange('temperatura_agua', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="visibilidad">Visibilidad (m)</Label>
              <Input
                id="visibilidad"
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={formData.visibilidad}
                onChange={(e) => handleInputChange('visibilidad', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="corriente">Corriente</Label>
              <Select value={formData.corriente} onValueChange={(value) => handleInputChange('corriente', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nula">Nula</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="objetivo">Objetivo del Trabajo</Label>
              <Input
                id="objetivo"
                value={formData.objetivo}
                onChange={(e) => handleInputChange('objetivo', e.target.value)}
                placeholder="Descripción del objetivo"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => handleInputChange('observaciones', e.target.value)}
              placeholder="Observaciones adicionales..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Botones de Acción */}
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isCreating}>
          {isCreating ? 'Creando...' : 'Crear Inmersión'}
        </Button>
      </div>
    </form>
  );
};
