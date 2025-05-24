
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useOperaciones } from "@/hooks/useOperaciones";
import { InmersionFormData } from "@/hooks/useInmersiones";
import { Waves, Clock, Target, Thermometer, Eye, Wind } from "lucide-react";

interface CreateInmersionFormProps {
  onSubmit: (data: InmersionFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<InmersionFormData>;
  isEditing?: boolean;
}

export const CreateInmersionForm = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  isEditing = false 
}: CreateInmersionFormProps) => {
  const [loading, setLoading] = useState(false);
  const { operaciones, isLoading: loadingOperaciones } = useOperaciones();
  
  const [formData, setFormData] = useState<InmersionFormData>({
    operacion_id: initialData?.operacion_id || "",
    fecha_inmersion: initialData?.fecha_inmersion || new Date().toISOString().split('T')[0],
    hora_inicio: initialData?.hora_inicio || "",
    hora_fin: initialData?.hora_fin || "",
    buzo_principal: initialData?.buzo_principal || "",
    buzo_asistente: initialData?.buzo_asistente || "",
    supervisor: initialData?.supervisor || "",
    objetivo: initialData?.objetivo || "",
    profundidad_max: initialData?.profundidad_max || 0,
    temperatura_agua: initialData?.temperatura_agua || 0,
    visibilidad: initialData?.visibilidad || 0,
    corriente: initialData?.corriente || "nula",
    observaciones: initialData?.observaciones || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting inmersion:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (updates: Partial<InmersionFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  if (loadingOperaciones) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Waves className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {isEditing ? 'Editar Inmersión' : 'Nueva Inmersión'}
              </CardTitle>
              <p className="text-sm text-zinc-500">
                {isEditing ? 'Modifica los datos de la inmersión' : 'Registra una nueva inmersión'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            ×
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="operacion_id">Operación *</Label>
                <Select 
                  value={formData.operacion_id} 
                  onValueChange={(value) => updateFormData({ operacion_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar operación..." />
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

              <div className="space-y-2">
                <Label htmlFor="fecha_inmersion">Fecha de Inmersión *</Label>
                <Input
                  id="fecha_inmersion"
                  type="date"
                  value={formData.fecha_inmersion}
                  onChange={(e) => updateFormData({ fecha_inmersion: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora_inicio" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Hora de Inicio *
                </Label>
                <Input
                  id="hora_inicio"
                  type="time"
                  value={formData.hora_inicio}
                  onChange={(e) => updateFormData({ hora_inicio: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora_fin">Hora de Fin</Label>
                <Input
                  id="hora_fin"
                  type="time"
                  value={formData.hora_fin}
                  onChange={(e) => updateFormData({ hora_fin: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="objetivo" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Objetivo de la Inmersión *
                </Label>
                <Input
                  id="objetivo"
                  value={formData.objetivo}
                  onChange={(e) => updateFormData({ objetivo: e.target.value })}
                  placeholder="Ej: Inspección de redes, mantenimiento estructuras..."
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Condiciones Ambientales */}
          <Card>
            <CardHeader>
              <CardTitle>Condiciones Ambientales</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profundidad_max" className="flex items-center gap-2">
                  <Waves className="w-4 h-4" />
                  Profundidad Máxima (m) *
                </Label>
                <Input
                  id="profundidad_max"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.profundidad_max}
                  onChange={(e) => updateFormData({ profundidad_max: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperatura_agua" className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4" />
                  Temperatura del Agua (°C) *
                </Label>
                <Input
                  id="temperatura_agua"
                  type="number"
                  step="0.1"
                  value={formData.temperatura_agua}
                  onChange={(e) => updateFormData({ temperatura_agua: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visibilidad" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Visibilidad (m) *
                </Label>
                <Input
                  id="visibilidad"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.visibilidad}
                  onChange={(e) => updateFormData({ visibilidad: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="corriente" className="flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  Corriente
                </Label>
                <Select 
                  value={formData.corriente} 
                  onValueChange={(value) => updateFormData({ corriente: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nula">Nula</SelectItem>
                    <SelectItem value="leve">Leve</SelectItem>
                    <SelectItem value="moderada">Moderada</SelectItem>
                    <SelectItem value="fuerte">Fuerte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Personal Asignado */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Asignado</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supervisor">Supervisor *</Label>
                <Input
                  id="supervisor"
                  value={formData.supervisor}
                  onChange={(e) => updateFormData({ supervisor: e.target.value })}
                  placeholder="Nombre del supervisor"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buzo_principal">Buzo Principal *</Label>
                <Input
                  id="buzo_principal"
                  value={formData.buzo_principal}
                  onChange={(e) => updateFormData({ buzo_principal: e.target.value })}
                  placeholder="Nombre del buzo principal"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="buzo_asistente">Buzo Asistente</Label>
                <Input
                  id="buzo_asistente"
                  value={formData.buzo_asistente}
                  onChange={(e) => updateFormData({ buzo_asistente: e.target.value })}
                  placeholder="Nombre del buzo asistente (opcional)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Observaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones Adicionales</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => updateFormData({ observaciones: e.target.value })}
                  placeholder="Detalles adicionales sobre la inmersión..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {isEditing ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <Waves className="w-4 h-4 mr-2" />
                  {isEditing ? 'Actualizar Inmersión' : 'Crear Inmersión'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
