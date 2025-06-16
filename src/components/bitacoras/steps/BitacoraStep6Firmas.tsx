
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FileCheck, AlertTriangle } from "lucide-react";
import { BitacoraSupervisorData } from '../BitacoraWizardFromInmersion';

interface BitacoraStep6FirmasProps {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
}

export const BitacoraStep6Firmas = ({ data, onUpdate }: BitacoraStep6FirmasProps) => {
  const handleInputChange = (field: keyof BitacoraSupervisorData, value: any) => {
    onUpdate({ [field]: value });
  };

  const resumenBuzos = data.inmersiones_buzos?.length || 0;
  const resumenEquipos = data.equipos_utilizados?.length || 0;
  const resumenDivingRecords = data.diving_records?.length || 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Validación y Firmas</h2>
        <p className="mt-2 text-gray-600">
          Validación final y comentarios de la bitácora
        </p>
      </div>

      {/* Resumen de la Bitácora */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            Resumen de la Bitácora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{resumenBuzos}</div>
              <div className="text-sm text-blue-800">Buzos Participantes</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{resumenEquipos}</div>
              <div className="text-sm text-orange-800">Equipos Utilizados</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{resumenDivingRecords}</div>
              <div className="text-sm text-green-800">Registros de Buceo</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validación del Contratista */}
      <Card>
        <CardHeader>
          <CardTitle>Validación del Contratista</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="validacion_contratista"
              checked={data.validacion_contratista || false}
              onCheckedChange={(checked) => handleInputChange('validacion_contratista', checked)}
            />
            <Label htmlFor="validacion_contratista" className="text-sm font-medium">
              El contratista valida y aprueba esta bitácora de supervisor
            </Label>
          </div>
          
          <div>
            <Label>Comentarios de Validación</Label>
            <Textarea
              value={data.comentarios_validacion || ''}
              onChange={(e) => handleInputChange('comentarios_validacion', e.target.value)}
              placeholder="Comentarios del contratista sobre la bitácora..."
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Estado de Completitud */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Completitud</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Información General</span>
              <Badge variant={data.codigo && data.desarrollo_inmersion ? "default" : "secondary"}>
                {data.codigo && data.desarrollo_inmersion ? "Completo" : "Incompleto"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Buzos y Asistentes</span>
              <Badge variant={resumenBuzos > 0 ? "default" : "secondary"}>
                {resumenBuzos > 0 ? "Completo" : "Incompleto"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Trabajos Realizados</span>
              <Badge variant={data.trabajo_a_realizar || data.descripcion_trabajo ? "default" : "secondary"}>
                {data.trabajo_a_realizar || data.descripcion_trabajo ? "Completo" : "Incompleto"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Validación del Contratista</span>
              <Badge variant={data.validacion_contratista ? "default" : "secondary"}>
                {data.validacion_contratista ? "Validado" : "Pendiente"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-sm text-yellow-800">
            <strong>Importante:</strong> Revise toda la información antes de finalizar la bitácora. 
            Una vez guardada, la información será registrada en el sistema y podrá ser firmada 
            digitalmente por el supervisor responsable.
          </div>
        </div>
      </div>
    </div>
  );
};
