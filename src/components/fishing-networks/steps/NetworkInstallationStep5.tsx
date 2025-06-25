
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Users } from "lucide-react";
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

  const addBuzo = () => {
    const buzosExistentes = Object.keys(formData.cambio_pecera_buzos);
    const nuevoBuzoNumber = buzosExistentes.length + 1;
    const nuevoBuzoKey = `buzo_${nuevoBuzoNumber}`;
    
    updateFormData({
      cambio_pecera_buzos: {
        ...formData.cambio_pecera_buzos,
        [nuevoBuzoKey]: {
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
        }
      }
    });
  };

  const removeBuzo = (buzoKey: string) => {
    const newBuzos = { ...formData.cambio_pecera_buzos };
    delete newBuzos[buzoKey];
    updateFormData({
      cambio_pecera_buzos: newBuzos
    });
  };

  const updateBuzoJaula = (buzoKey: string, jaula: string) => {
    updateFormData({
      cambio_pecera_buzos: {
        ...formData.cambio_pecera_buzos,
        [buzoKey]: {
          ...formData.cambio_pecera_buzos[buzoKey],
          jaula_numero: jaula
        }
      }
    });
  };

  const updateBuzoActividad = (buzoKey: string, actividad: string, cantidad: number) => {
    updateFormData({
      cambio_pecera_buzos: {
        ...formData.cambio_pecera_buzos,
        [buzoKey]: {
          ...formData.cambio_pecera_buzos[buzoKey],
          actividades: {
            ...formData.cambio_pecera_buzos[buzoKey].actividades,
            [actividad]: cantidad
          }
        }
      }
    });
  };

  const buzos = Object.entries(formData.cambio_pecera_buzos);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Cambio de Pecera - Tareas por Buzo
            </CardTitle>
            {!readOnly && (
              <Button onClick={addBuzo} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Buzo
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {buzos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay buzos agregados. Haga clic en "Agregar Buzo" para comenzar.
            </div>
          ) : (
            <div className="space-y-6">
              {buzos.map(([buzoKey, buzoData], index) => (
                <Card key={buzoKey} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Buzo #{index + 1}</h4>
                      {!readOnly && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeBuzo(buzoKey)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Jaula (o) N°</Label>
                      <Input
                        value={buzoData.jaula_numero}
                        onChange={(e) => updateBuzoJaula(buzoKey, e.target.value)}
                        placeholder="Número de jaula"
                        disabled={readOnly}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Actividades y Cantidades
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {actividades.map((actividad) => (
                          <div key={actividad.key} className="flex items-center space-x-3">
                            <Label className="flex-1 text-sm">
                              {actividad.label}
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              value={buzoData.actividades[actividad.key as keyof typeof buzoData.actividades]}
                              onChange={(e) => updateBuzoActividad(buzoKey, actividad.key, Number(e.target.value))}
                              className="w-20"
                              disabled={readOnly}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Instrucciones:</strong> Agregue los buzos que participaron en el cambio de pecera. 
          Para cada buzo, especifique la jaula donde trabajó y las cantidades de cada actividad realizada.
        </p>
      </div>
    </div>
  );
};

