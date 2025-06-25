
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SignatureCapture } from "@/components/signatures/SignatureCapture";
import { PenTool, User, UserCheck } from "lucide-react";
import type { FishingNetworkMaintenanceData } from '@/types/fishing-networks';

interface Step9FirmasProps {
  formData: FishingNetworkMaintenanceData;
  updateFormData: (updates: Partial<FishingNetworkMaintenanceData>) => void;
  readOnly?: boolean;
}

export const Step9Firmas = ({ formData, updateFormData, readOnly = false }: Step9FirmasProps) => {
  const handleFirmaChange = (tipo: 'supervisor_buceo' | 'jefe_centro', field: 'nombre' | 'firma', value: string) => {
    updateFormData({
      firmas: {
        ...formData.firmas,
        [tipo]: {
          ...formData.firmas[tipo],
          [field]: value
        }
      }
    });
  };

  const firmasData = formData.firmas || {
    supervisor_buceo: { nombre: '', firma: '' },
    jefe_centro: { nombre: '', firma: '' }
  };

  const clearSignature = (tipo: 'supervisor_buceo' | 'jefe_centro') => {
    handleFirmaChange(tipo, 'firma', '');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5" />
            Firmas Digitales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Firma Supervisor de Buceo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <User className="w-4 h-4 text-blue-600" />
              <h3 className="text-lg font-medium">Supervisor de Buceo</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supervisor_buceo_nombre">Nombre completo</Label>
              <Input
                id="supervisor_buceo_nombre"
                value={firmasData.supervisor_buceo.nombre}
                onChange={(e) => handleFirmaChange('supervisor_buceo', 'nombre', e.target.value)}
                placeholder="Nombre y apellido del supervisor de buceo"
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label>Firma digital</Label>
              {!readOnly ? (
                <div className="space-y-2">
                  <SignatureCapture
                    onSignatureChange={(signature) => handleFirmaChange('supervisor_buceo', 'firma', signature)}
                    existingSignature={firmasData.supervisor_buceo.firma}
                  />
                  {firmasData.supervisor_buceo.firma && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => clearSignature('supervisor_buceo')}
                    >
                      Limpiar firma
                    </Button>
                  )}
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  {firmasData.supervisor_buceo.firma ? (
                    <img
                      src={firmasData.supervisor_buceo.firma}
                      alt="Firma supervisor de buceo"
                      className="max-h-24 object-contain"
                    />
                  ) : (
                    <p className="text-gray-500 text-sm">Sin firma</p>
                  )}
                </div>
              )}
            </div>

            {firmasData.supervisor_buceo.firma && firmasData.supervisor_buceo.nombre && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <UserCheck className="w-4 h-4" />
                <span>Firma completada</span>
              </div>
            )}
          </div>

          {/* Firma Jefe de Centro */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <UserCheck className="w-4 h-4 text-purple-600" />
              <h3 className="text-lg font-medium">Jefe de Centro</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jefe_centro_nombre">Nombre completo</Label>
              <Input
                id="jefe_centro_nombre"
                value={firmasData.jefe_centro.nombre}
                onChange={(e) => handleFirmaChange('jefe_centro', 'nombre', e.target.value)}
                placeholder="Nombre y apellido del jefe de centro"
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label>Firma digital</Label>
              {!readOnly ? (
                <div className="space-y-2">
                  <SignatureCapture
                    onSignatureChange={(signature) => handleFirmaChange('jefe_centro', 'firma', signature)}
                    existingSignature={firmasData.jefe_centro.firma}
                  />
                  {firmasData.jefe_centro.firma && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => clearSignature('jefe_centro')}
                    >
                      Limpiar firma
                    </Button>
                  )}
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  {firmasData.jefe_centro.firma ? (
                    <img
                      src={firmasData.jefe_centro.firma}
                      alt="Firma jefe de centro"
                      className="max-h-24 object-contain"
                    />
                  ) : (
                    <p className="text-gray-500 text-sm">Sin firma</p>
                  )}
                </div>
              )}
            </div>

            {firmasData.jefe_centro.firma && firmasData.jefe_centro.nombre && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <UserCheck className="w-4 h-4" />
                <span>Firma completada</span>
              </div>
            )}
          </div>

          {/* Estado general de firmas */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Estado de las Firmas</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Supervisor de Buceo:</span>
                <span className={firmasData.supervisor_buceo.firma && firmasData.supervisor_buceo.nombre ? 'text-green-600' : 'text-gray-500'}>
                  {firmasData.supervisor_buceo.firma && firmasData.supervisor_buceo.nombre ? 'Completada' : 'Pendiente'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Jefe de Centro:</span>
                <span className={firmasData.jefe_centro.firma && firmasData.jefe_centro.nombre ? 'text-green-600' : 'text-gray-500'}>
                  {firmasData.jefe_centro.firma && firmasData.jefe_centro.nombre ? 'Completada' : 'Pendiente'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
