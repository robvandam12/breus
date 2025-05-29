
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Waves } from "lucide-react";
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
        <h2 className="text-2xl font-bold text-gray-900">Información General de la Faena</h2>
        <p className="mt-2 text-gray-600">
          Información básica sobre la operación de buceo realizada
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información Básica */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={data.fecha_inicio_faena}
                onChange={(e) => handleInputChange('fecha_inicio_faena', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="lugar">Lugar (Sitio)</Label>
              <Input
                id="lugar"
                value={data.lugar_trabajo}
                onChange={(e) => handleInputChange('lugar_trabajo', e.target.value)}
                placeholder="Sitio de la operación"
                className="bg-green-50"
                readOnly
              />
            </div>
            
            <div>
              <Label htmlFor="supervisor">Supervisor</Label>
              <Input
                id="supervisor"
                value={data.supervisor_nombre_matricula}
                onChange={(e) => handleInputChange('supervisor_nombre_matricula', e.target.value)}
                placeholder="Autorrellenado de operación"
                className="bg-green-50"
                readOnly
              />
            </div>
          </CardContent>
        </Card>

        {/* Condiciones de Trabajo */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Waves className="w-4 h-4" />
              Condiciones de Trabajo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="estado_mar">Estado del Mar</Label>
              <Select value={data.estado_mar} onValueChange={(value) => handleInputChange('estado_mar', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado del mar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calma">Calma</SelectItem>
                  <SelectItem value="llana">Llana</SelectItem>
                  <SelectItem value="moderada">Moderada</SelectItem>
                  <SelectItem value="rizada">Rizada</SelectItem>
                  <SelectItem value="marejada">Marejada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="hora_inicio">Hora de Inicio</Label>
                <Input
                  id="hora_inicio"
                  type="time"
                  value={data.hora_inicio_faena}
                  onChange={(e) => handleInputChange('hora_inicio_faena', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="hora_termino">Hora de Término</Label>
                <Input
                  id="hora_termino"
                  type="time"
                  value={data.hora_termino_faena}
                  onChange={(e) => handleInputChange('hora_termino_faena', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="visibilidad_fondo">Visibilidad del Fondo</Label>
              <Input
                id="visibilidad_fondo"
                value={data.visibilidad_fondo}
                onChange={(e) => handleInputChange('visibilidad_fondo', e.target.value)}
                placeholder="Descripción de la visibilidad"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
