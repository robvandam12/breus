
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Anchor } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";

interface CreateInmersionFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  defaultOperacionId?: string;
}

export const CreateInmersionForm = ({ onSubmit, onCancel, defaultOperacionId }: CreateInmersionFormProps) => {
  const { operaciones } = useOperaciones();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    operacion_id: defaultOperacionId || "",
    codigo: `INM-${Date.now()}`,
    buzo_principal: "",
    buzo_asistente: "",
    supervisor: "",
    fecha_inmersion: new Date().toISOString().split('T')[0],
    hora_inicio: "",
    hora_fin: "",
    profundidad_max: "",
    temperatura_agua: "",
    visibilidad: "",
    corriente: "",
    objetivo: "",
    observaciones: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        profundidad_max: formData.profundidad_max ? parseFloat(formData.profundidad_max) : 0,
        temperatura_agua: formData.temperatura_agua ? parseFloat(formData.temperatura_agua) : 0,
        visibilidad: formData.visibilidad ? parseFloat(formData.visibilidad) : 0,
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error creating inmersion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const operacionOptions = operaciones.map(op => ({
    value: op.id,
    label: `${op.codigo} - ${op.nombre}`
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Anchor className="w-5 h-5 text-blue-600" />
          Nueva Inmersión
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="operacion_id">Operación *</Label>
            <EnhancedSelect
              options={operacionOptions}
              value={formData.operacion_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, operacion_id: value }))}
              placeholder="Seleccione una operación"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buzo_principal">Buzo Principal *</Label>
              <Input
                id="buzo_principal"
                value={formData.buzo_principal}
                onChange={(e) => setFormData(prev => ({ ...prev, buzo_principal: e.target.value }))}
                placeholder="Nombre del buzo principal"
                required
              />
            </div>

            <div>
              <Label htmlFor="buzo_asistente">Buzo Asistente</Label>
              <Input
                id="buzo_asistente"
                value={formData.buzo_asistente}
                onChange={(e) => setFormData(prev => ({ ...prev, buzo_asistente: e.target.value }))}
                placeholder="Nombre del buzo asistente"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="supervisor">Supervisor *</Label>
            <Input
              id="supervisor"
              value={formData.supervisor}
              onChange={(e) => setFormData(prev => ({ ...prev, supervisor: e.target.value }))}
              placeholder="Nombre del supervisor"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fecha_inmersion">Fecha de Inmersión</Label>
              <Input
                type="date"
                id="fecha_inmersion"
                value={formData.fecha_inmersion}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha_inmersion: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="hora_inicio">Hora Inicio</Label>
              <Input
                type="time"
                id="hora_inicio"
                value={formData.hora_inicio}
                onChange={(e) => setFormData(prev => ({ ...prev, hora_inicio: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="hora_fin">Hora Fin</Label>
              <Input
                type="time"
                id="hora_fin"
                value={formData.hora_fin}
                onChange={(e) => setFormData(prev => ({ ...prev, hora_fin: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="profundidad_max">Profundidad Máxima (m)</Label>
              <Input
                type="number"
                step="0.1"
                id="profundidad_max"
                value={formData.profundidad_max}
                onChange={(e) => setFormData(prev => ({ ...prev, profundidad_max: e.target.value }))}
                placeholder="0.0"
              />
            </div>

            <div>
              <Label htmlFor="temperatura_agua">Temperatura Agua (°C)</Label>
              <Input
                type="number"
                step="0.1"
                id="temperatura_agua"
                value={formData.temperatura_agua}
                onChange={(e) => setFormData(prev => ({ ...prev, temperatura_agua: e.target.value }))}
                placeholder="0.0"
              />
            </div>

            <div>
              <Label htmlFor="visibilidad">Visibilidad (m)</Label>
              <Input
                type="number"
                step="0.1"
                id="visibilidad"
                value={formData.visibilidad}
                onChange={(e) => setFormData(prev => ({ ...prev, visibilidad: e.target.value }))}
                placeholder="0.0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="corriente">Corriente</Label>
            <Input
              id="corriente"
              value={formData.corriente}
              onChange={(e) => setFormData(prev => ({ ...prev, corriente: e.target.value }))}
              placeholder="Descripción de la corriente"
            />
          </div>

          <div>
            <Label htmlFor="objetivo">Objetivo *</Label>
            <Textarea
              id="objetivo"
              value={formData.objetivo}
              onChange={(e) => setFormData(prev => ({ ...prev, objetivo: e.target.value }))}
              placeholder="Objetivo de la inmersión"
              required
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
              placeholder="Observaciones adicionales"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={!formData.operacion_id || !formData.buzo_principal || !formData.supervisor || !formData.objetivo || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Creando...' : 'Crear Inmersión'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
