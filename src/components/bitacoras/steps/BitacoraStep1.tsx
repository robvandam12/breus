
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText } from "lucide-react";
import { BitacoraSupervisorData } from "../BitacoraWizard";

interface BitacoraStep1Props {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
}

export const BitacoraStep1 = ({ data, onUpdate }: BitacoraStep1Props) => {
  const handleInputChange = (field: keyof BitacoraSupervisorData, value: any) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Información General</h2>
        <p className="mt-2 text-gray-600">
          Datos básicos de la bitácora de supervisor
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Información Básica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={data.codigo}
                onChange={(e) => handleInputChange('codigo', e.target.value)}
                placeholder="Código de la bitácora"
              />
            </div>
            
            <div>
              <Label htmlFor="fecha_inicio_faena">Fecha de Inicio</Label>
              <Input
                id="fecha_inicio_faena"
                type="date"
                value={data.fecha_inicio_faena || ''}
                onChange={(e) => handleInputChange('fecha_inicio_faena', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lugar_trabajo">Lugar de Trabajo</Label>
            <Input
              id="lugar_trabajo"
              value={data.lugar_trabajo || ''}
              onChange={(e) => handleInputChange('lugar_trabajo', e.target.value)}
              placeholder="Ubicación donde se realiza el trabajo"
            />
          </div>

          <div>
            <Label htmlFor="supervisor_nombre_matricula">Supervisor (Nombre y Matrícula)</Label>
            <Input
              id="supervisor_nombre_matricula"
              value={data.supervisor_nombre_matricula || ''}
              onChange={(e) => handleInputChange('supervisor_nombre_matricula', e.target.value)}
              placeholder="Nombre completo y matrícula del supervisor"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estado_mar">Estado del Mar</Label>
              <Select 
                value={data.estado_mar || ''}
                onValueChange={(value) => handleInputChange('estado_mar', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado del mar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calmo">Calmo</SelectItem>
                  <SelectItem value="moderado">Moderado</SelectItem>
                  <SelectItem value="agitado">Agitado</SelectItem>
                  <SelectItem value="muy-agitado">Muy Agitado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="visibilidad_fondo">Visibilidad del Fondo (m)</Label>
              <Input
                id="visibilidad_fondo"
                type="number"
                value={data.visibilidad_fondo || 0}
                onChange={(e) => handleInputChange('visibilidad_fondo', Number(e.target.value))}
                placeholder="Visibilidad en metros"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hora_inicio_faena">Hora de Inicio</Label>
              <Input
                id="hora_inicio_faena"
                type="time"
                value={data.hora_inicio_faena || ''}
                onChange={(e) => handleInputChange('hora_inicio_faena', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="hora_termino_faena">Hora de Término</Label>
              <Input
                id="hora_termino_faena"
                type="time"
                value={data.hora_termino_faena || ''}
                onChange={(e) => handleInputChange('hora_termino_faena', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="desarrollo_inmersion">Desarrollo de la Inmersión</Label>
            <Textarea
              id="desarrollo_inmersion"
              value={data.desarrollo_inmersion}
              onChange={(e) => handleInputChange('desarrollo_inmersion', e.target.value)}
              placeholder="Describe cómo se desarrolló la inmersión..."
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="incidentes">Incidentes (Opcional)</Label>
            <Textarea
              id="incidentes"
              value={data.incidentes || ''}
              onChange={(e) => handleInputChange('incidentes', e.target.value)}
              placeholder="Describe cualquier incidente..."
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="evaluacion_general">Evaluación General</Label>
            <Textarea
              id="evaluacion_general"
              value={data.evaluacion_general}
              onChange={(e) => handleInputChange('evaluacion_general', e.target.value)}
              placeholder="Evaluación general de la inmersión..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <strong>Información:</strong> Complete todos los campos requeridos para continuar con el siguiente paso.
          </div>
        </div>
      </div>
    </div>
  );
};
