
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Users, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { NetworkMaintenanceData, ResumenInmersiones, Contingencias } from '@/types/network-maintenance';

interface ResumenFirmasProps {
  formData: NetworkMaintenanceData;
  updateFormData: (updates: Partial<NetworkMaintenanceData>) => void;
  onFirmar?: () => void;
  readOnly?: boolean;
}

export const ResumenFirmas = ({ 
  formData, 
  updateFormData, 
  onFirmar,
  readOnly = false 
}: ResumenFirmasProps) => {

  const updateResumenInmersiones = (campo: keyof ResumenInmersiones, valor: number) => {
    const resumenActual = formData.resumen_inmersiones || {
      total_inmersiones: 0,
      horas_navegacion: 0,
      cabotaje_perdida: 0,
      rev_documental: 0,
      relevo: 0
    };

    updateFormData({
      resumen_inmersiones: {
        ...resumenActual,
        [campo]: valor
      }
    });
  };

  const updateContingencias = (campo: keyof Contingencias, valor: number | string) => {
    const contingenciasActuales = formData.contingencias || {
      mortalidad: 0,
      bloom_algas: 0,
      observaciones_generales: ''
    };

    updateFormData({
      contingencias: {
        ...contingenciasActuales,
        [campo]: valor
      }
    });
  };

  const resumen = formData.resumen_inmersiones || {
    total_inmersiones: 0,
    horas_navegacion: 0,
    cabotaje_perdida: 0,
    rev_documental: 0,
    relevo: 0
  };

  const contingencias = formData.contingencias || {
    mortalidad: 0,
    bloom_algas: 0,
    observaciones_generales: ''
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Resumen de Inmersiones y Firmas
        </h3>
        <p className="text-sm text-gray-600">
          Finalización del formulario con resumen de actividades y firmas digitales
        </p>
      </div>

      {/* Resumen de Inmersiones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Resumen de Inmersiones y Navegaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="total_inmersiones">Nº total de inmersiones</Label>
              <Input
                id="total_inmersiones"
                type="number"
                value={resumen.total_inmersiones}
                onChange={(e) => updateResumenInmersiones('total_inmersiones', parseInt(e.target.value) || 0)}
                placeholder="0"
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="horas_navegacion">Horas de navegación por relevo</Label>
              <Input
                id="horas_navegacion"
                type="number"
                step="0.1"
                value={resumen.horas_navegacion}
                onChange={(e) => updateResumenInmersiones('horas_navegacion', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="cabotaje_perdida">Cabotaje con pérdida de buceo</Label>
              <Input
                id="cabotaje_perdida"
                type="number"
                value={resumen.cabotaje_perdida}
                onChange={(e) => updateResumenInmersiones('cabotaje_perdida', parseInt(e.target.value) || 0)}
                placeholder="0"
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="rev_documental">Revisión documental (horas)</Label>
              <Input
                id="rev_documental"
                type="number"
                step="0.1"
                value={resumen.rev_documental}
                onChange={(e) => updateResumenInmersiones('rev_documental', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="relevo">Relevo (horas)</Label>
              <Input
                id="relevo"
                type="number"
                step="0.1"
                value={resumen.relevo}
                onChange={(e) => updateResumenInmersiones('relevo', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
                disabled={readOnly}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contingencias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Contingencias
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mortalidad">Mortalidad</Label>
              <Input
                id="mortalidad"
                type="number"
                value={contingencias.mortalidad || ''}
                onChange={(e) => updateContingencias('mortalidad', parseInt(e.target.value) || 0)}
                placeholder="0"
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="bloom_algas">Bloom de algas</Label>
              <Input
                id="bloom_algas"
                type="number"
                value={contingencias.bloom_algas || ''}
                onChange={(e) => updateContingencias('bloom_algas', parseInt(e.target.value) || 0)}
                placeholder="0"
                disabled={readOnly}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="observaciones_generales">Observaciones generales</Label>
            <Textarea
              id="observaciones_generales"
              value={contingencias.observaciones_generales || ''}
              onChange={(e) => updateContingencias('observaciones_generales', e.target.value)}
              placeholder="Observaciones generales de contingencias..."
              rows={4}
              disabled={readOnly}
            />
          </div>
        </CardContent>
      </Card>

      {/* Observaciones Finales */}
      <Card>
        <CardHeader>
          <CardTitle>Observaciones Finales</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.observaciones_finales || ''}
            onChange={(e) => updateFormData({ observaciones_finales: e.target.value })}
            placeholder="Observaciones finales del formulario..."
            rows={4}
            disabled={readOnly}
          />
        </CardContent>
      </Card>

      {/* Firmas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Firmas Digitales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supervisor_responsable">Supervisor de Buceo</Label>
              <Input
                id="supervisor_responsable"
                value={formData.supervisor_responsable || ''}
                onChange={(e) => updateFormData({ supervisor_responsable: e.target.value })}
                placeholder="Nombre del supervisor"
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="jefe_centro">Jefe de Centro</Label>
              <Input
                id="jefe_centro"
                placeholder="Nombre del jefe de centro"
                disabled={readOnly}
              />
            </div>
          </div>

          {/* Estado de firma */}
          <div className="mt-6 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {formData.firmado ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Formulario Firmado</p>
                      <p className="text-sm text-green-600">Este formulario ha sido firmado digitalmente</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-amber-900">Pendiente de Firma</p>
                      <p className="text-sm text-amber-600">Este formulario requiere firma digital</p>
                    </div>
                  </>
                )}
              </div>

              {!readOnly && !formData.firmado && onFirmar && (
                <Button onClick={onFirmar} className="bg-blue-600 hover:bg-blue-700">
                  <Users className="w-4 h-4 mr-2" />
                  Firmar Formulario
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de ayuda */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Finalización del Formulario</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Completa el resumen de inmersiones realizadas</li>
              <li>• Registra cualquier contingencia ocurrida</li>
              <li>• Agrega observaciones finales relevantes</li>
              <li>• Procede con la firma digital para completar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
