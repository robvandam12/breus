
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, AlertCircle } from "lucide-react";
import { BitacoraSupervisorData } from "../BitacoraWizard";

interface BitacoraStep5Props {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
}

export const BitacoraStep5 = ({ data, onUpdate }: BitacoraStep5Props) => {
  const handleInputChange = (field: keyof BitacoraSupervisorData, value: any) => {
    onUpdate({ [field]: value });
  };

  const getResumenBitacora = () => {
    const equiposCount = data.equipos_utilizados?.length || 0;
    const inmersionesCount = data.inmersiones_buzos?.length || 0;
    
    return {
      fecha: data.fecha_inicio_faena || 'Sin fecha',
      lugar: data.lugar_trabajo || 'Sin especificar',
      supervisor: data.supervisor_nombre_matricula || 'Sin asignar',
      duracion: data.hora_inicio_faena && data.hora_termino_faena 
        ? `${data.hora_inicio_faena} - ${data.hora_termino_faena}` 
        : 'Sin especificar',
      equipos: equiposCount,
      inmersiones: inmersionesCount,
      estado_mar: data.estado_mar || 'Sin especificar',
      visibilidad: data.visibilidad_fondo ? `${data.visibilidad_fondo}m` : 'Sin especificar'
    };
  };

  const resumen = getResumenBitacora();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Cierre y Validación</h2>
        <p className="mt-2 text-gray-600">
          Resumen final y observaciones de la bitácora
        </p>
      </div>

      {/* Resumen de la Bitácora */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Resumen de la Bitácora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Fecha:</span>
                <span className="text-gray-900">{resumen.fecha}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Lugar:</span>
                <span className="text-gray-900">{resumen.lugar}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Supervisor:</span>
                <span className="text-gray-900">{resumen.supervisor}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Duración:</span>
                <span className="text-gray-900">{resumen.duracion}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-700">Equipos Utilizados:</span>
                <Badge variant="secondary">{resumen.equipos}</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-green-700">Inmersiones:</span>
                <Badge variant="secondary">{resumen.inmersiones}</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-lg">
                <span className="font-medium text-cyan-700">Estado del Mar:</span>
                <span className="text-cyan-900 capitalize">{resumen.estado_mar}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-700">Visibilidad:</span>
                <span className="text-purple-900">{resumen.visibilidad}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observaciones Generales */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Observaciones Generales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="observaciones_generales">
              Observaciones, Incidentes y Comentarios Adicionales
            </Label>
            <Textarea
              id="observaciones_generales"
              value={data.observaciones_generales_texto}
              onChange={(e) => handleInputChange('observaciones_generales_texto', e.target.value)}
              placeholder="Registre cualquier observación relevante sobre la faena, incidentes menores, condiciones especiales, recomendaciones, etc."
              rows={6}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Validación del Contratista */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Validación del Contratista
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="validacion_contratista"
              checked={data.validacion_contratista}
              onCheckedChange={(checked) => handleInputChange('validacion_contratista', checked)}
            />
            <Label htmlFor="validacion_contratista" className="text-sm">
              El contratista ha validado la información contenida en esta bitácora
            </Label>
          </div>

          {data.validacion_contratista && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800 font-medium">
                  Bitácora validada por el contratista
                </span>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="comentarios_validacion">
              Comentarios de Validación (Opcional)
            </Label>
            <Textarea
              id="comentarios_validacion"
              value={data.comentarios_validacion}
              onChange={(e) => handleInputChange('comentarios_validacion', e.target.value)}
              placeholder="Comentarios adicionales del contratista sobre la validación..."
              rows={3}
              className="mt-2"
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
            <strong>Información:</strong> Al completar este paso, la bitácora se guardará como borrador. 
            Posteriormente podrá firmarla desde la lista de bitácoras creadas.
            <br />
            <strong>Registros incluidos:</strong> {resumen.inmersiones} buzos han sido registrados en esta bitácora.
          </div>
        </div>
      </div>
    </div>
  );
};
