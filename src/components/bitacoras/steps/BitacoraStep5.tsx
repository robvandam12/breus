
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, Users, Settings, AlertTriangle } from "lucide-react";
import { BitacoraSupervisorData } from "../BitacoraWizard";

interface BitacoraStep5Props {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
}

export const BitacoraStep5 = ({ data, onUpdate }: BitacoraStep5Props) => {
  const handleInputChange = (field: keyof BitacoraSupervisorData, value: any) => {
    onUpdate({ [field]: value });
  };

  // Generar resumen de la bitácora
  const resumenBitacora = {
    fecha: data.fecha_inicio_faena,
    lugar: data.lugar_trabajo,
    supervisor: data.supervisor_nombre_matricula,
    estadoMar: data.estado_mar,
    horaInicio: data.hora_inicio_faena,
    horaTermino: data.hora_termino_faena,
    buzosRegistrados: data.registros_inmersion?.length || 0,
    equiposUtilizados: data.equipos_utilizados?.length || 0,
    trabajoRealizado: data.trabajo_realizar
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Cierre y Validación</h2>
        <p className="mt-2 text-gray-600">
          Resumen final de la bitácora y validaciones necesarias
        </p>
      </div>

      {/* Resumen de la Bitácora */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Resumen de la Bitácora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Fecha:</span>
                <span>{resumenBitacora.fecha || 'No especificada'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Lugar:</span>
                <span>{resumenBitacora.lugar || 'No especificado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Supervisor:</span>
                <span>{resumenBitacora.supervisor || 'No asignado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Estado del Mar:</span>
                <Badge variant="outline">{resumenBitacora.estadoMar || 'No especificado'}</Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Hora Inicio:</span>
                <span>{resumenBitacora.horaInicio || 'No especificada'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Hora Término:</span>
                <span>{resumenBitacora.horaTermino || 'No especificada'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Buzos Registrados:</span>
                <Badge variant="secondary">{resumenBitacora.buzosRegistrados}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Trabajo Realizado:</span>
                <span className="text-sm">{resumenBitacora.trabajoRealizado || 'No especificado'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observaciones Generales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Observaciones Generales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="observaciones_generales">Observaciones y Comentarios Finales</Label>
            <Textarea
              id="observaciones_generales"
              value={data.observaciones_previas}
              onChange={(e) => handleInputChange('observaciones_previas', e.target.value)}
              placeholder="Registre cualquier observación importante, incidentes menores, condiciones especiales o comentarios sobre la faena..."
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      {/* Validación del Contratista */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Validación del Contratista
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="validacion_contratista"
              checked={data.validacion_contratista}
              onCheckedChange={(checked) => handleInputChange('validacion_contratista', checked)}
            />
            <Label htmlFor="validacion_contratista" className="text-sm">
              El contratista ha validado y aprobado la información registrada en esta bitácora
            </Label>
          </div>
          
          {data.validacion_contratista && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Validación confirmada</span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                La bitácora ha sido validada por el contratista responsable.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estado de Completitud */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <strong>Estado del Formulario:</strong> Una vez que complete esta bitácora, se guardará como borrador.
            Podrá firmarla posteriormente desde la lista de bitácoras creadas.
          </div>
        </div>
      </div>
    </div>
  );
};
