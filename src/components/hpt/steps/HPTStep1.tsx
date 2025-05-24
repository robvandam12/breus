
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, FileText } from "lucide-react";

interface HPTStep1Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep1 = ({ data, onUpdate }: HPTStep1Props) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Información General</h2>
        <p className="mt-2 text-gray-600">
          Datos básicos de la operación y responsables
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Identificación de la Operación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="operacion_id">ID de Operación *</Label>
              <Input
                id="operacion_id"
                value={data.operacion_id || ''}
                onChange={(e) => onUpdate({ operacion_id: e.target.value })}
                placeholder="OP-2024-001"
              />
            </div>

            <div>
              <Label htmlFor="fecha_programada">Fecha Programada</Label>
              <Input
                id="fecha_programada"
                type="date"
                value={data.fecha_programada || ''}
                onChange={(e) => onUpdate({ fecha_programada: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="hora_inicio">Hora de Inicio</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={data.hora_inicio || ''}
                onChange={(e) => onUpdate({ hora_inicio: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="hora_fin">Hora de Fin</Label>
              <Input
                id="hora_fin"
                type="time"
                value={data.hora_fin || ''}
                onChange={(e) => onUpdate({ hora_fin: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Responsables
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supervisor">Supervisor *</Label>
              <Input
                id="supervisor"
                value={data.supervisor || ''}
                onChange={(e) => onUpdate({ supervisor: e.target.value })}
                placeholder="Nombre del supervisor"
              />
            </div>

            <div>
              <Label htmlFor="jefe_obra">Jefe de Obra</Label>
              <Input
                id="jefe_obra"
                value={data.jefe_obra || ''}
                onChange={(e) => onUpdate({ jefe_obra: e.target.value })}
                placeholder="Nombre del jefe de obra"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Descripción del Trabajo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="descripcion_trabajo">Descripción del Trabajo</Label>
            <Textarea
              id="descripcion_trabajo"
              value={data.descripcion_trabajo || ''}
              onChange={(e) => onUpdate({ descripcion_trabajo: e.target.value })}
              placeholder="Describa el trabajo a realizar..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="plan_trabajo">Plan de Trabajo *</Label>
            <Textarea
              id="plan_trabajo"
              value={data.plan_trabajo || ''}
              onChange={(e) => onUpdate({ plan_trabajo: e.target.value })}
              placeholder="Detalle el plan específico de trabajo..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
