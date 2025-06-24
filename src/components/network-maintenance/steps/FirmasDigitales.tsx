
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PenTool, Check, AlertCircle } from "lucide-react";
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

interface FirmasDigitalesProps {
  formData: NetworkMaintenanceData;
  updateFormData: (updates: Partial<NetworkMaintenanceData>) => void;
  readOnly?: boolean;
}

export const FirmasDigitales = ({ formData, updateFormData, readOnly = false }: FirmasDigitalesProps) => {
  const firmas = formData.firmas || {
    supervisor_nombre: '',
    supervisor_firma: '',
    jefe_centro_nombre: '',
    jefe_centro_firma: '',
    fecha_firma: '',
    codigo_verificacion: ''
  };

  const updateFirma = (campo: keyof typeof firmas, valor: string) => {
    updateFormData({
      firmas: {
        ...firmas,
        [campo]: valor
      }
    });
  };

  const handleFirmarSupervisor = () => {
    const codigoVerificacion = `SUP-${Date.now().toString().slice(-6)}`;
    const fechaFirma = new Date().toISOString();
    
    updateFirma('supervisor_firma', codigoVerificacion);
    updateFirma('fecha_firma', fechaFirma);
    updateFirma('codigo_verificacion', codigoVerificacion);
  };

  const handleFirmarJefe = () => {
    const codigoVerificacion = `JEF-${Date.now().toString().slice(-6)}`;
    
    updateFirma('jefe_centro_firma', codigoVerificacion);
    if (!firmas.fecha_firma) {
      updateFirma('fecha_firma', new Date().toISOString());
    }
  };

  const isFormComplete = () => {
    return !!(
      formData.lugar_trabajo &&
      formData.fecha &&
      formData.dotacion.length > 0 &&
      formData.faenas_mantencion.length > 0
    );
  };

  const canSign = isFormComplete() && !readOnly;
  const isSupervisorSigned = !!firmas.supervisor_firma;
  const isJefeSigned = !!firmas.jefe_centro_firma;
  const isFullySigned = isSupervisorSigned && isJefeSigned;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <PenTool className="w-5 h-5" />
          Firmas Digitales
        </h3>
        <p className="text-sm text-gray-600">
          Validación y firma del formulario de mantención
        </p>
      </div>

      {/* Estado del Formulario */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Estado del Formulario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Completitud</span>
            <Badge variant={isFormComplete() ? "default" : "secondary"}>
              {isFormComplete() ? "Formulario Completo" : "Formulario Incompleto"}
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              {formData.lugar_trabajo ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              )}
              <span>Información general completa</span>
            </div>
            <div className="flex items-center gap-2">
              {formData.dotacion.length > 0 ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              )}
              <span>Dotación de buceo asignada</span>
            </div>
            <div className="flex items-center gap-2">
              {formData.faenas_mantencion.length > 0 ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              )}
              <span>Faenas de mantención registradas</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Firma del Supervisor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Supervisor de Buceo</span>
            {isSupervisorSigned && (
              <Badge className="bg-green-100 text-green-700">
                <Check className="w-3 h-3 mr-1" />
                Firmado
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="supervisor_nombre">Nombre del Supervisor</Label>
            <Input
              id="supervisor_nombre"
              value={firmas.supervisor_nombre}
              onChange={(e) => updateFirma('supervisor_nombre', e.target.value)}
              placeholder="Nombre completo del supervisor"
              disabled={readOnly || isSupervisorSigned}
            />
          </div>

          {isSupervisorSigned ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <Check className="w-4 h-4" />
                <span className="font-medium">Firma Digital Registrada</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Código: {firmas.supervisor_firma}
              </p>
            </div>
          ) : (
            <Button
              onClick={handleFirmarSupervisor}
              disabled={!canSign || !firmas.supervisor_nombre}
              className="w-full"
            >
              <PenTool className="w-4 h-4 mr-2" />
              Firmar como Supervisor
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Firma del Jefe de Centro */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Jefe de Centro</span>
            {isJefeSigned && (
              <Badge className="bg-green-100 text-green-700">
                <Check className="w-3 h-3 mr-1" />
                Firmado
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="jefe_centro_nombre">Nombre del Jefe de Centro</Label>
            <Input
              id="jefe_centro_nombre"
              value={firmas.jefe_centro_nombre}
              onChange={(e) => updateFirma('jefe_centro_nombre', e.target.value)}
              placeholder="Nombre completo del jefe de centro"
              disabled={readOnly || isJefeSigned}
            />
          </div>

          {isJefeSigned ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <Check className="w-4 h-4" />
                <span className="font-medium">Firma Digital Registrada</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Código: {firmas.jefe_centro_firma}
              </p>
            </div>
          ) : (
            <Button
              onClick={handleFirmarJefe}
              disabled={!canSign || !firmas.jefe_centro_nombre}
              className="w-full"
              variant="outline"
            >
              <PenTool className="w-4 h-4 mr-2" />
              Firmar como Jefe de Centro
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Estado Final */}
      {isFullySigned && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-900">Formulario Completado</h3>
              <p className="text-green-700 mt-2">
                El formulario ha sido firmado por ambas partes y está listo para su procesamiento.
              </p>
              {firmas.fecha_firma && (
                <p className="text-sm text-gray-600 mt-2">
                  Fecha de firma: {new Date(firmas.fecha_firma).toLocaleDateString('es-CL')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información de ayuda */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <PenTool className="h-4 w-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Proceso de Firma</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Complete toda la información requerida antes de firmar</li>
              <li>• El supervisor debe firmar primero</li>
              <li>• El jefe de centro puede firmar después del supervisor</li>
              <li>• Una vez firmado, el formulario no podrá ser modificado</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
