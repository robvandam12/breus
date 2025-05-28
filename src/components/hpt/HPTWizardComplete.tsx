
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { useHPT } from "@/hooks/useHPT";

interface HPTWizardCompleteProps {
  operacionId: string;
  onComplete: (hptId: string) => void;
  onCancel: () => void;
}

export const HPTWizardComplete = ({ operacionId, onComplete, onCancel }: HPTWizardCompleteProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createHPT } = useHPT();
  
  const [formData, setFormData] = useState({
    codigo: '',
    supervisor: '',
    plan_trabajo: '',
    descripcion_trabajo: '',
    fecha: new Date().toISOString().split('T')[0],
    hora_inicio: '',
    hora_termino: '',
    observaciones: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const hpt = await createHPT({
        ...formData,
        operacion_id: operacionId
      });
      onComplete(hpt.id);
    } catch (error) {
      console.error('Error creating HPT:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Nuevo HPT
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código HPT *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => updateFormData('codigo', e.target.value)}
                placeholder="HPT-001"
                required
              />
            </div>
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
          </div>

          <div>
            <Label htmlFor="descripcion_trabajo">Descripción del Trabajo *</Label>
            <Textarea
              id="descripcion_trabajo"
              value={formData.descripcion_trabajo}
              onChange={(e) => updateFormData('descripcion_trabajo', e.target.value)}
              placeholder="Descripción detallada del trabajo a realizar"
              required
            />
          </div>

          <div>
            <Label htmlFor="plan_trabajo">Plan de Trabajo *</Label>
            <Textarea
              id="plan_trabajo"
              value={formData.plan_trabajo}
              onChange={(e) => updateFormData('plan_trabajo', e.target.value)}
              placeholder="Plan detallado de ejecución"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => updateFormData('fecha', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="hora_inicio">Hora Inicio</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => updateFormData('hora_inicio', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hora_termino">Hora Término</Label>
              <Input
                id="hora_termino"
                type="time"
                value={formData.hora_termino}
                onChange={(e) => updateFormData('hora_termino', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => updateFormData('observaciones', e.target.value)}
              placeholder="Observaciones adicionales"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear HPT'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
