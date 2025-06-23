
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileCheck, User, AlertTriangle, CheckCircle } from "lucide-react";
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

interface ResumenFirmasProps {
  formData: NetworkMaintenanceData;
  updateFormData: (updates: Partial<NetworkMaintenanceData>) => void;
}

export const ResumenFirmas = ({ formData, updateFormData }: ResumenFirmasProps) => {
  const handleInputChange = (field: keyof NetworkMaintenanceData, value: any) => {
    updateFormData({ [field]: value });
  };

  const getResumenStats = () => {
    return {
      dotacion: formData.dotacion?.length || 0,
      equipos: formData.equipos_superficie?.length || 0,
      faenas: formData.faenas_mantencion?.length || 0,
      sistemas: formData.sistemas_equipos?.length || 0,
      completitud: Math.round(
        ((formData.lugar_trabajo ? 25 : 0) +
         (formData.dotacion?.length > 0 ? 25 : 0) +
         (formData.faenas_mantencion?.length > 0 ? 25 : 0) +
         (formData.supervisor_responsable ? 25 : 0)) / 4 * 4
      )
    };
  };

  const stats = getResumenStats();
  const isComplete = stats.completitud === 100 && formData.supervisor_responsable;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
          <FileCheck className="w-5 h-5" />
          Resumen y Firmas
        </h3>
        <p className="text-sm text-gray-600">
          Revisión final y validación del formulario de mantención de redes
        </p>
      </div>

      {/* Resumen estadístico */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen del Formulario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.dotacion}</div>
              <div className="text-sm text-blue-600">Personal</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.equipos}</div>
              <div className="text-sm text-green-600">Equipos</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.faenas}</div>
              <div className="text-sm text-orange-600">Faenas</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.sistemas}</div>
              <div className="text-sm text-purple-600">Sistemas</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Completitud del Formulario:</span>
            <div className="flex items-center gap-2">
              <div className={`w-16 h-2 rounded-full bg-gray-200`}>
                <div 
                  className={`h-full rounded-full transition-all ${stats.completitud === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${stats.completitud}%` }}
                />
              </div>
              <span className="font-bold">{stats.completitud}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observaciones finales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Observaciones Finales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="observaciones_finales">Observaciones Generales</Label>
            <Textarea
              id="observaciones_finales"
              value={formData.observaciones_finales || ''}
              onChange={(e) => handleInputChange('observaciones_finales', e.target.value)}
              placeholder="Observaciones generales sobre la operación..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="contingencias">Contingencias o Incidentes</Label>
            <Textarea
              id="contingencias"
              value={formData.contingencias || ''}
              onChange={(e) => handleInputChange('contingencias', e.target.value)}
              placeholder="Registra cualquier contingencia, incidente o situación especial..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Supervisor y firma */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4" />
            Supervisor Responsable
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="supervisor_responsable">Nombre del Supervisor Responsable *</Label>
            <Input
              id="supervisor_responsable"
              value={formData.supervisor_responsable || ''}
              onChange={(e) => handleInputChange('supervisor_responsable', e.target.value)}
              placeholder="Nombre completo del supervisor responsable"
              className={!formData.supervisor_responsable ? 'border-red-300' : ''}
            />
            {!formData.supervisor_responsable && (
              <p className="text-sm text-red-500 mt-1">Este campo es requerido para completar el formulario</p>
            )}
          </div>

          <div>
            <Label htmlFor="firma_digital">Firma Digital (Opcional)</Label>
            <Input
              id="firma_digital"
              value={formData.firma_digital || ''}
              onChange={(e) => handleInputChange('firma_digital', e.target.value)}
              placeholder="Código de firma digital o identificador"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirmacion_supervisor"
              checked={formData.firmado || false}
              onCheckedChange={(checked) => handleInputChange('firmado', checked)}
              disabled={!isComplete}
            />
            <Label htmlFor="confirmacion_supervisor" className="text-sm">
              Confirmo que toda la información registrada es correcta y completa
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Estado del formulario */}
      <Card>
        <CardContent className="pt-6">
          <div className={`flex items-center gap-3 p-4 rounded-lg ${
            isComplete ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            {isComplete ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            )}
            <div>
              <p className={`font-medium ${isComplete ? 'text-green-900' : 'text-yellow-900'}`}>
                {isComplete ? 'Formulario Listo para Completar' : 'Información Faltante'}
              </p>
              <p className={`text-sm ${isComplete ? 'text-green-700' : 'text-yellow-700'}`}>
                {isComplete 
                  ? 'Todos los campos requeridos están completos. Puedes finalizar el formulario.'
                  : 'Completa los campos faltantes antes de finalizar el formulario.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
