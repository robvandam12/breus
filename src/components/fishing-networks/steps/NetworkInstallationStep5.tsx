
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import type { NetworkInstallationData } from '@/types/fishing-networks';

interface NetworkInstallationStep5Props {
  formData: NetworkInstallationData;
  updateFormData: (updates: Partial<NetworkInstallationData>) => void;
  readOnly?: boolean;
}

export const NetworkInstallationStep5 = ({ 
  formData, 
  updateFormData, 
  readOnly = false 
}: NetworkInstallationStep5Props) => {
  const actividades = [
    { key: 'soltar_tensores', label: 'Soltar tensores' },
    { key: 'descosturar_extractor', label: 'Descosturar extractor' },
    { key: 'liberar_micropesos', label: 'Liberar micropesos' },
    { key: 'reconectar_tensores', label: 'Reconectar tensores' },
    { key: 'reinstalar_tensores', label: 'Reinstalar tensores' },
    { key: 'costurar_extractor', label: 'Costurar extractor' },
    { key: 'reinstalar_micropesos', label: 'Reinstalar micropesos' },
  ];

  const handleJaulaChange = (buzoNumero: string, jaula: string) => {
    updateFormData({
      cambio_pecera_buzos: {
        ...formData.cambio_pecera_buzos,
        [buzoNumero]: {
          ...formData.cambio_pecera_buzos[buzoNumero],
          jaula_numero: jaula,
        }
      }
    });
  };

  const handleActividadChange = (buzoNumero: string, actividad: string, cantidad: number) => {
    updateFormData({
      cambio_pecera_buzos: {
        ...formData.cambio_pecera_buzos,
        [buzoNumero]: {
          ...formData.cambio_pecera_buzos[buzoNumero],
          jaula_numero: formData.cambio_pecera_buzos[buzoNumero]?.jaula_numero || '',
          actividades: {
            ...formData.cambio_pecera_buzos[buzoNumero]?.actividades,
            [actividad]: cantidad,
          }
        }
      }
    });
  };

  const getBuzoData = (buzoNumero: string) => {
    return formData.cambio_pecera_buzos[buzoNumero] || {
      jaula_numero: '',
      actividades: {
        soltar_tensores: 0,
        descosturar_extractor: 0,
        liberar_micropesos: 0,
        reconectar_tensores: 0,
        reinstalar_tensores: 0,
        costurar_extractor: 0,
        reinstalar_micropesos: 0,
      }
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Cambio de Pecera - Tareas por Buzo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            Registre las actividades realizadas por cada buzo en el cambio de pecera, 
            indicando la jaula y la cantidad de cada actividad.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((buzoNum) => {
              const buzoNumero = `buzo_${buzoNum}`;
              const buzoData = getBuzoData(buzoNumero);

              return (
                <Card key={buzoNum} className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Buzo N° {buzoNum}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`jaula_${buzoNum}`} className="text-sm font-medium">
                        Jaula N°
                      </Label>
                      <Input
                        id={`jaula_${buzoNum}`}
                        placeholder="Número de jaula"
                        value={buzoData.jaula_numero}
                        onChange={(e) => handleJaulaChange(buzoNumero, e.target.value)}
                        disabled={readOnly}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Actividades (cantidad)</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {actividades.map((actividad) => (
                          <div key={actividad.key} className="flex items-center justify-between">
                            <Label htmlFor={`${buzoNumero}_${actividad.key}`} className="text-sm">
                              {actividad.label}
                            </Label>
                            <Input
                              id={`${buzoNumero}_${actividad.key}`}
                              type="number"
                              min="0"
                              className="w-20"
                              value={buzoData.actividades[actividad.key as keyof typeof buzoData.actividades] || 0}
                              onChange={(e) => handleActividadChange(buzoNumero, actividad.key, parseInt(e.target.value) || 0)}
                              disabled={readOnly}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Users className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Información de Registro</p>
                <p className="text-sm text-yellow-700">
                  Complete solo los buzos que participaron en actividades de cambio de pecera. 
                  Los campos sin completar se considerarán como no realizados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
