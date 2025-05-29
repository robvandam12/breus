
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { BitacoraSupervisorData } from "../BitacoraWizard";

interface BitacoraStep5Props {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
}

export const BitacoraStep5 = ({ data, onUpdate }: BitacoraStep5Props) => {
  const handleInputChange = (field: keyof BitacoraSupervisorData, value: any) => {
    onUpdate({ [field]: value });
  };

  const handleCheckboxChange = (field: keyof BitacoraSupervisorData, checked: boolean) => {
    onUpdate({ [field]: checked });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Cierre y Validación</h2>
        <p className="mt-2 text-gray-600">
          Resumen final y observaciones de la bitácora
        </p>
      </div>

      {/* Resumen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Resumen de la Bitácora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Datos Registrados:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Fecha: {data.fecha_inicio_faena || 'No especificada'}</li>
              <li>• Lugar: {data.lugar_trabajo || 'No especificado'}</li>
              <li>• Supervisor: {data.supervisor_nombre_matricula || 'No especificado'}</li>
              <li>• Registros de inmersión: {data.registros_inmersion?.length || 0} buzos</li>
              <li>• Equipos utilizados: {data.equipos_utilizados || 'No especificados'}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Observaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Observaciones Generales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="observaciones_generales">Observaciones Finales</Label>
            <Textarea
              id="observaciones_generales"
              value={data.observaciones_generales_texto}
              onChange={(e) => handleInputChange('observaciones_generales_texto', e.target.value)}
              placeholder="Registre cualquier observación relevante sobre la operación..."
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      {/* Validación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Validación del Contratista
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <Checkbox
              id="validacion_contratista"
              checked={data.validacion_contratista}
              onCheckedChange={(checked) => handleCheckboxChange('validacion_contratista', checked as boolean)}
            />
            <Label htmlFor="validacion_contratista" className="cursor-pointer flex-1">
              Validación del contratista (opcional)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Nota Final */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <FileText className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-sm text-yellow-800">
            <strong>Nota:</strong> Al crear la bitácora se guardará y luego deberá ser firmada desde la lista de bitácoras creadas.
          </div>
        </div>
      </div>
    </div>
  );
};
