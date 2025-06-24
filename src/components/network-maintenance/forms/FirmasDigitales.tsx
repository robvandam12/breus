
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenTool, Check, X } from "lucide-react";
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
    supervisor_firmado: false,
    jefe_centro_nombre: '',
    jefe_centro_firma: '',
    jefe_centro_firmado: false
  };

  const updateFirma = (field: string, value: any) => {
    const nuevasFirmas = { ...firmas, [field]: value };
    updateFormData({ firmas: nuevasFirmas });
  };

  const firmarDocumento = (tipo: 'supervisor' | 'jefe_centro') => {
    if (readOnly) return;
    
    // Simular proceso de firma digital
    const timestamp = new Date().toISOString();
    const nombre = tipo === 'supervisor' ? firmas.supervisor_nombre : firmas.jefe_centro_nombre;
    
    if (!nombre.trim()) {
      alert('Debe ingresar el nombre antes de firmar');
      return;
    }
    
    updateFirma(`${tipo}_firma`, `Firmado digitalmente por ${nombre} el ${new Date().toLocaleString()}`);
    updateFirma(`${tipo}_firmado`, true);
    updateFirma(`${tipo}_timestamp`, timestamp);
  };

  const limpiarFirma = (tipo: 'supervisor' | 'jefe_centro') => {
    if (readOnly) return;
    
    updateFirma(`${tipo}_firma`, '');
    updateFirma(`${tipo}_firmado`, false);
    updateFirma(`${tipo}_timestamp`, null);
  };

  const todasLasFirmasCompletas = firmas.supervisor_firmado && firmas.jefe_centro_firmado;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <PenTool className="w-5 h-5" />
          Firmas Digitales
        </h3>
        <p className="text-sm text-gray-600">
          Autorización y validación del reporte de mantención
        </p>
      </div>

      {todasLasFirmasCompletas && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700">
            <Check className="w-5 h-5" />
            <span className="font-medium">Documento firmado completamente</span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            Todas las firmas requeridas han sido completadas
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Firma Supervisor de Buceo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Supervisor de Buceo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="supervisor_nombre">Nombre del Supervisor</Label>
              <Input
                id="supervisor_nombre"
                value={firmas.supervisor_nombre}
                onChange={(e) => updateFirma('supervisor_nombre', e.target.value)}
                disabled={readOnly || firmas.supervisor_firmado}
                placeholder="Nombre completo del supervisor"
              />
            </div>

            {firmas.supervisor_firmado ? (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <Check className="w-4 h-4" />
                    <span className="font-medium">Firmado</span>
                  </div>
                  <p className="text-sm text-gray-600">{firmas.supervisor_firma}</p>
                </div>
                {!readOnly && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => limpiarFirma('supervisor')}
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Limpiar Firma
                  </Button>
                )}
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => firmarDocumento('supervisor')}
                disabled={readOnly || !firmas.supervisor_nombre.trim()}
                className="w-full"
              >
                <PenTool className="w-4 h-4 mr-2" />
                Firmar como Supervisor
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Firma Jefe de Centro */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Jefe de Centro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="jefe_centro_nombre">Nombre del Jefe de Centro</Label>
              <Input
                id="jefe_centro_nombre"
                value={firmas.jefe_centro_nombre}
                onChange={(e) => updateFirma('jefe_centro_nombre', e.target.value)}
                disabled={readOnly || firmas.jefe_centro_firmado}
                placeholder="Nombre completo del jefe de centro"
              />
            </div>

            {firmas.jefe_centro_firmado ? (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <Check className="w-4 h-4" />
                    <span className="font-medium">Firmado</span>
                  </div>
                  <p className="text-sm text-gray-600">{firmas.jefe_centro_firma}</p>
                </div>
                {!readOnly && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => limpiarFirma('jefe_centro')}
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Limpiar Firma
                  </Button>
                )}
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => firmarDocumento('jefe_centro')}
                disabled={readOnly || !firmas.jefe_centro_nombre.trim()}
                className="w-full"
              >
                <PenTool className="w-4 h-4 mr-2" />
                Firmar como Jefe de Centro
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600">
            <h4 className="font-medium mb-2">Información sobre las firmas:</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Las firmas digitales quedan registradas con fecha y hora</li>
              <li>Una vez firmado, el documento no puede ser modificado</li>
              <li>Se requieren ambas firmas para completar el documento</li>
              <li>Las firmas pueden ser limpiadas solo antes del envío final</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
