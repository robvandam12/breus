
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileCheck, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
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

  // Validaciones de completitud
  const validaciones = {
    informacionGeneral: !!(data.codigo && data.desarrollo_inmersion),
    buzosAsistentes: resumenBuzos > 0,
    trabajosRealizados: !!(data.trabajo_a_realizar || data.descripcion_trabajo),
    equiposUtilizados: resumenEquipos > 0,
    registrosBuceo: resumenDivingRecords > 0,
    validacionContratista: !!data.validacion_contratista,
    comentariosValidacion: !!(data.comentarios_validacion && data.comentarios_validacion.trim())
  };

  const totalValidaciones = Object.keys(validaciones).length;
  const validacionesCompletas = Object.values(validaciones).filter(Boolean).length;
  const porcentajeCompletitud = Math.round((validacionesCompletas / totalValidaciones) * 100);

  const isReadyToFinalize = validaciones.informacionGeneral && 
                           validaciones.buzosAsistentes && 
                           validaciones.trabajosRealizados && 
                           validaciones.validacionContratista;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Validación y Firmas</h2>
        <p className="mt-2 text-gray-600">
          Validación final y comentarios de la bitácora
        </p>
      </div>

      {/* Indicador de Progreso */}
      <Card className={`border-2 ${isReadyToFinalize ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isReadyToFinalize ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-orange-600" />
            )}
            Progreso de Completitud
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Completitud General</span>
              <span>{porcentajeCompletitud}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  porcentajeCompletitud >= 80 ? 'bg-green-500' : 
                  porcentajeCompletitud >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${porcentajeCompletitud}%` }}
              />
            </div>
          </div>
          
          {!isReadyToFinalize && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Campos requeridos faltantes:</strong> Revise las secciones marcadas como incompletas antes de finalizar.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

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
            <Label>Comentarios de Validación *</Label>
            <Textarea
              value={data.comentarios_validacion || ''}
              onChange={(e) => handleInputChange('comentarios_validacion', e.target.value)}
              placeholder="Comentarios del contratista sobre la bitácora..."
              className="min-h-[80px]"
              required
            />
            {!validaciones.comentariosValidacion && (
              <p className="text-sm text-red-600 mt-1">Los comentarios de validación son obligatorios</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estado de Completitud Detallado */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Completitud Detallado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Información General</span>
              <Badge variant={validaciones.informacionGeneral ? "default" : "secondary"}>
                {validaciones.informacionGeneral ? "Completo" : "Incompleto"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Buzos y Asistentes</span>
              <Badge variant={validaciones.buzosAsistentes ? "default" : "secondary"}>
                {validaciones.buzosAsistentes ? "Completo" : "Incompleto"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Trabajos Realizados</span>
              <Badge variant={validaciones.trabajosRealizados ? "default" : "secondary"}>
                {validaciones.trabajosRealizados ? "Completo" : "Incompleto"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Equipos Utilizados</span>
              <Badge variant={validaciones.equiposUtilizados ? "default" : "secondary"}>
                {validaciones.equiposUtilizados ? "Completo" : "Incompleto"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Registros de Buceo</span>
              <Badge variant={validaciones.registrosBuceo ? "default" : "secondary"}>
                {validaciones.registrosBuceo ? "Completo" : "Incompleto"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Validación del Contratista</span>
              <Badge variant={validaciones.validacionContratista ? "default" : "secondary"}>
                {validaciones.validacionContratista ? "Validado" : "Pendiente"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Comentarios de Validación</span>
              <Badge variant={validaciones.comentariosValidacion ? "default" : "secondary"}>
                {validaciones.comentariosValidacion ? "Completo" : "Pendiente"}
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
            digitalmente por el supervisor responsable. Los campos marcados con (*) son obligatorios.
          </div>
        </div>
      </div>
    </div>
  );
};
