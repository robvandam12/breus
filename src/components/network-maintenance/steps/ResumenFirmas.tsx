
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Users, 
  Settings, 
  Network, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  User,
  Calendar
} from "lucide-react";
import type { NetworkMaintenanceFormProps } from '@/types/network-maintenance';

export const ResumenFirmas = ({ 
  formData, 
  updateFormData, 
  errors = {} 
}: NetworkMaintenanceFormProps) => {

  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
  };

  const getCompletionStatus = () => {
    const checks = {
      informacion_basica: !!(formData.lugar_trabajo && formData.fecha && formData.hora_inicio),
      dotacion: formData.dotacion && formData.dotacion.length > 0,
      equipos: true, // Equipos son opcionales
      faenas: true, // Faenas son opcionales inicialmente
      supervisor: !!formData.supervisor_responsable
    };

    const completed = Object.values(checks).filter(Boolean).length;
    const total = Object.keys(checks).length;
    const percentage = Math.round((completed / total) * 100);

    return { checks, completed, total, percentage };
  };

  const status = getCompletionStatus();

  const getTotalTiempoInmersion = () => {
    if (!formData.dotacion) return 0;
    return formData.dotacion.reduce((total, personal) => total + (personal.tiempo_inmersion || 0), 0);
  };

  const getProfundidadMaxima = () => {
    if (!formData.dotacion) return 0;
    return Math.max(...formData.dotacion.map(personal => personal.profundidad_max || 0), 0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Resumen y Firmas
        </h3>
        <p className="text-sm text-gray-600">
          Revisa la información ingresada y completa las firmas para finalizar
        </p>
      </div>

      {/* Estado de Completitud */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle className="h-4 w-4" />
            Estado de Completitud ({status.percentage}%)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Información Básica</span>
              {status.checks.informacion_basica ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Dotación de Buceo</span>
              {status.checks.dotacion ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Equipos de Superficie</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Faenas Registradas</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Supervisor Responsable</span>
              {status.checks.supervisor ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>
          
          <div className="mt-4 bg-gray-100 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${status.percentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Resumen de la Operación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Resumen de la Operación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Lugar de Trabajo</Label>
                <p className="text-gray-900">{formData.lugar_trabajo || 'No especificado'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Fecha y Horario</Label>
                <p className="text-gray-900">
                  {formData.fecha || 'No especificada'}
                  {formData.hora_inicio && formData.hora_termino && (
                    <span className="text-gray-600 ml-2">
                      ({formData.hora_inicio} - {formData.hora_termino})
                    </span>
                  )}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Condiciones</Label>
                <p className="text-gray-900">
                  Temp: {formData.temperatura}°C | 
                  Prof. máx: {formData.profundidad_max}m
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Personal</Label>
                <p className="text-gray-900">
                  {formData.dotacion?.length || 0} personas | 
                  {getTotalTiempoInmersion()} min total
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Equipos</Label>
                <p className="text-gray-900">
                  {formData.equipos_superficie?.length || 0} equipos registrados
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Faenas</Label>
                <p className="text-gray-900">
                  {(formData.faenas_mantencion?.length || 0) + (formData.faenas_redes?.length || 0)} faenas
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Firmas y Responsables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            Supervisor Responsable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="supervisor_responsable" className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                Nombre del Supervisor *
              </Label>
              <Input
                id="supervisor_responsable"
                value={formData.supervisor_responsable || ''}
                onChange={(e) => handleInputChange('supervisor_responsable', e.target.value)}
                placeholder="Nombre completo del supervisor responsable"
                className={errors.supervisor_responsable ? 'border-red-500' : ''}
              />
              {errors.supervisor_responsable && (
                <p className="text-sm text-red-600">{errors.supervisor_responsable}</p>
              )}
            </div>

            <div>
              <Label htmlFor="fecha_firma" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                Fecha de Firma
              </Label>
              <Input
                id="fecha_firma"
                type="date"
                value={formData.fecha_firma || new Date().toISOString().split('T')[0]}
                onChange={(e) => handleInputChange('fecha_firma', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observaciones Finales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Observaciones Finales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="incidentes">Incidentes o Situaciones Especiales</Label>
              <Textarea
                id="incidentes"
                value={formData.incidentes || ''}
                onChange={(e) => handleInputChange('incidentes', e.target.value)}
                placeholder="Registra cualquier incidente, situación especial o desviación del plan..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="observaciones_finales">Observaciones Generales del Supervisor</Label>
              <Textarea
                id="observaciones_finales"
                value={formData.observaciones_generales || ''}
                onChange={(e) => handleInputChange('observaciones_generales', e.target.value)}
                placeholder="Comentarios generales sobre la operación, recomendaciones, etc..."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado Final */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">
                Formulario de Mantención de Redes
              </h3>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="bg-white">
                {formData.tipo_formulario === 'mantencion' ? 'Mantención' : 'Faena'} de Redes
              </Badge>
              <Badge variant="outline" className="bg-white">
                {status.percentage}% Completado
              </Badge>
              <Badge variant="outline" className="bg-white">
                {formData.dotacion?.length || 0} Personas
              </Badge>
            </div>

            <p className="text-sm text-blue-700">
              Una vez completados todos los campos requeridos, podrás finalizar el formulario.
              La información quedará registrada y no podrá ser modificada posteriormente.
            </p>

            {status.percentage < 100 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                  Faltan campos por completar para poder finalizar el formulario
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Información de ayuda */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Validación Final</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Revisa que toda la información esté correcta antes de finalizar</li>
              <li>• El supervisor responsable debe validar la información</li>
              <li>• Una vez firmado, el formulario no podrá ser modificado</li>
              <li>• Los datos se integrarán a los reportes operacionales</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
