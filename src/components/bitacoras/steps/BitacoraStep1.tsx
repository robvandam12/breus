
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, Briefcase } from "lucide-react";
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
        <h2 className="text-2xl font-bold text-gray-900">Identificación de la Faena</h2>
        <p className="mt-2 text-gray-600">
          Información básica sobre la operación de buceo realizada
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fechas y Horarios */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Fechas de la Faena
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
                <Input
                  id="fecha_inicio"
                  type="date"
                  value={data.fecha_inicio_faena}
                  onChange={(e) => handleInputChange('fecha_inicio_faena', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="hora_inicio">Hora Inicio</Label>
                <Input
                  id="hora_inicio"
                  type="time"
                  value={data.hora_inicio_faena}
                  onChange={(e) => handleInputChange('hora_inicio_faena', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="fecha_termino">Fecha Término</Label>
                <Input
                  id="fecha_termino"
                  type="date"
                  value={data.fecha_termino_faena}
                  onChange={(e) => handleInputChange('fecha_termino_faena', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="hora_termino">Hora Término</Label>
                <Input
                  id="hora_termino"
                  type="time"
                  value={data.hora_termino_faena}
                  onChange={(e) => handleInputChange('hora_termino_faena', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ubicación y Trabajo */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Ubicación y Tipo de Trabajo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="lugar_trabajo">Lugar de Trabajo</Label>
              <Input
                id="lugar_trabajo"
                value={data.lugar_trabajo}
                onChange={(e) => handleInputChange('lugar_trabajo', e.target.value)}
                placeholder="Especifique el lugar exacto de trabajo"
              />
            </div>
            
            <div>
              <Label htmlFor="tipo_trabajo">Tipo de Trabajo</Label>
              <Input
                id="tipo_trabajo"
                value={data.tipo_trabajo}
                onChange={(e) => handleInputChange('tipo_trabajo', e.target.value)}
                placeholder="Descripción del tipo de trabajo realizado"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supervisor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            Supervisor de Buceo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="supervisor_matricula">Nombre y N° de Matrícula del Supervisor</Label>
            <Input
              id="supervisor_matricula"
              value={data.supervisor_nombre_matricula}
              onChange={(e) => handleInputChange('supervisor_nombre_matricula', e.target.value)}
              placeholder="Nombre completo y número de matrícula"
            />
          </div>
        </CardContent>
      </Card>

      {/* Observaciones Previas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            Observaciones Previas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="observaciones_previas">
              Condiciones Físicas Previas e Incidentes Menores
            </Label>
            <Textarea
              id="observaciones_previas"
              value={data.observaciones_previas}
              onChange={(e) => handleInputChange('observaciones_previas', e.target.value)}
              placeholder="Registre cualquier observación sobre condiciones físicas del personal, incidentes menores, condiciones ambientales, etc."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
