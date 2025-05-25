
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOperaciones } from "@/hooks/useOperaciones";
import { Calendar, Clock, User, FileText } from "lucide-react";

interface HPTStep1Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep1 = ({ data, onUpdate }: HPTStep1Props) => {
  const { operaciones, isLoading } = useOperaciones();

  // Filter out operations with empty or invalid values and ensure valid structure
  const validOperaciones = (operaciones || []).filter(op => 
    op && 
    typeof op === 'object' &&
    op.id && 
    typeof op.id === 'string' &&
    op.id.trim() !== "" && 
    op.nombre && 
    typeof op.nombre === 'string' &&
    op.nombre.trim() !== ""
  );

  console.log('Valid operaciones:', validOperaciones);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Información General</h2>
        <p className="mt-2 text-gray-600">
          Complete los datos básicos de la operación de buceo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Operación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="operacion">Seleccionar Operación *</Label>
              <Select 
                value={data.operacion_id || ""} 
                onValueChange={(value) => onUpdate({ operacion_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una operación" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading-placeholder" disabled>Cargando operaciones...</SelectItem>
                  ) : validOperaciones.length === 0 ? (
                    <SelectItem value="no-data-placeholder" disabled>No hay operaciones disponibles</SelectItem>
                  ) : (
                    validOperaciones.map((operacion) => (
                      <SelectItem 
                        key={operacion.id} 
                        value={operacion.id}
                      >
                        {operacion.nombre} ({operacion.codigo || operacion.id.slice(0, 8)})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="plan_trabajo">Plan de Trabajo *</Label>
              <Textarea
                id="plan_trabajo"
                value={data.plan_trabajo || ''}
                onChange={(e) => onUpdate({ plan_trabajo: e.target.value })}
                placeholder="Describa el plan detallado de trabajo..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Programación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fecha_programada">Fecha Programada *</Label>
              <Input
                id="fecha_programada"
                type="date"
                value={data.fecha_programada || ''}
                onChange={(e) => onUpdate({ fecha_programada: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hora_inicio">Hora Inicio *</Label>
                <Input
                  id="hora_inicio"
                  type="time"
                  value={data.hora_inicio || ''}
                  onChange={(e) => onUpdate({ hora_inicio: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="hora_fin">Hora Fin</Label>
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
            <div>
              <Label htmlFor="supervisor">Supervisor *</Label>
              <Input
                id="supervisor"
                value={data.supervisor || ''}
                onChange={(e) => onUpdate({ supervisor: e.target.value })}
                placeholder="Nombre del supervisor de buceo"
              />
            </div>

            <div>
              <Label htmlFor="jefe_obra">Jefe de Obra</Label>
              <Input
                id="jefe_obra"
                value={data.jefe_obra || ''}
                onChange={(e) => onUpdate({ jefe_obra: e.target.value })}
                placeholder="Nombre del jefe de obra o mandante"
              />
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
          <CardContent>
            <div>
              <Label htmlFor="descripcion_trabajo">Descripción *</Label>
              <Textarea
                id="descripcion_trabajo"
                value={data.descripcion_trabajo || ''}
                onChange={(e) => onUpdate({ descripcion_trabajo: e.target.value })}
                placeholder="Describa detalladamente el trabajo a realizar..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
