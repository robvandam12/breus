
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";

interface CreateHPTFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  defaultOperacionId?: string;
}

export const CreateHPTForm = ({ onSubmit, onCancel, defaultOperacionId }: CreateHPTFormProps) => {
  const { operaciones } = useOperaciones();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    operacion_id: defaultOperacionId || "",
    supervisor: "",
    plan_trabajo: "",
    descripcion_trabajo: "",
    fecha_programada: new Date().toISOString().split('T')[0],
    hora_inicio: "",
    hora_fin: "",
    observaciones: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error creating HPT:', error);
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
          <FileText className="w-5 h-5 text-blue-600" />
          Nuevo HPT
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="operacion_id">Operación *</Label>
            <EnhancedSelect
              options={operacionOptions}
              value={formData.operacion_id}
              onChange={(value) => setFormData(prev => ({ ...prev, operacion_id: value }))}
              placeholder="Seleccione una operación"
              className="w-full"
            />
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

          <div>
            <Label htmlFor="plan_trabajo">Plan de Trabajo *</Label>
            <Textarea
              id="plan_trabajo"
              value={formData.plan_trabajo}
              onChange={(e) => setFormData(prev => ({ ...prev, plan_trabajo: e.target.value }))}
              placeholder="Descripción del plan de trabajo"
              required
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="descripcion_trabajo">Descripción del Trabajo</Label>
            <Textarea
              id="descripcion_trabajo"
              value={formData.descripcion_trabajo}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion_trabajo: e.target.value }))}
              placeholder="Descripción detallada del trabajo a realizar"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fecha_programada">Fecha Programada</Label>
              <Input
                type="date"
                id="fecha_programada"
                value={formData.fecha_programada}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha_programada: e.target.value }))}
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
              disabled={!formData.operacion_id || !formData.supervisor || !formData.plan_trabajo || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Creando...' : 'Crear HPT'}
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
