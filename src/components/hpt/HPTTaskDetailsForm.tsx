
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface HPTTaskDetailsFormProps {
  data: any;
  operacionData?: any;
  onChange: (data: any) => void;
}

export const HPTTaskDetailsForm = ({ data, operacionData, onChange }: HPTTaskDetailsFormProps) => {
  const handleChange = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles de la Tarea</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hora_inicio">Hora de Inicio</Label>
            <Input
              id="hora_inicio"
              type="time"
              value={data.hora_inicio || ''}
              onChange={(e) => handleChange('hora_inicio', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="hora_termino">Hora de Término</Label>
            <Input
              id="hora_termino"
              type="time"
              value={data.hora_termino || ''}
              onChange={(e) => handleChange('hora_termino', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="plan_trabajo">Plan de Trabajo</Label>
          <Textarea
            id="plan_trabajo"
            value={data.plan_trabajo || ''}
            onChange={(e) => handleChange('plan_trabajo', e.target.value)}
            placeholder="Detalle el plan de trabajo"
            rows={4}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="es_rutinaria"
            checked={data.es_rutinaria || false}
            onCheckedChange={(checked) => handleChange('es_rutinaria', checked)}
          />
          <Label htmlFor="es_rutinaria">Tarea rutinaria</Label>
        </div>
      </CardContent>
    </Card>
  );
};
