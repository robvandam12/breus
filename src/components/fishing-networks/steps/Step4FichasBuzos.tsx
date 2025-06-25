
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, User } from "lucide-react";
import { BuzoFormSection } from "../components/BuzoFormSection";
import type { FishingNetworkMaintenanceData, FichaBuzo } from '@/types/fishing-networks';

interface Step4FichasBuzosProps {
  formData: FishingNetworkMaintenanceData;
  updateFormData: (updates: Partial<FishingNetworkMaintenanceData>) => void;
  readOnly?: boolean;
}

export const Step4FichasBuzos = ({ formData, updateFormData, readOnly = false }: Step4FichasBuzosProps) => {
  const fichasBuzos = formData.fichas_buzos || [];

  const createDefaultFicha = (buzoNumero: number): FichaBuzo => ({
    buzo_numero: buzoNumero,
    faenas_mantencion: {
      red_lober: false,
      red_pecera: false,
      reparacion_roturas: false,
      reparacion_descosturas: false,
      num_jaulas: '',
      cantidad: 0,
      ubicacion: '',
      tipo_rotura_2x1: false,
      tipo_rotura_2x2: false,
      tipo_rotura_mayor_2x2: false,
      observaciones: ''
    },
    sistemas_equipos: {
      instalacion: { checked: false, cantidad: 0 },
      mantencion: { checked: false, cantidad: 0 },
      recuperacion: { checked: false, cantidad: 0 },
      limpieza: { checked: false, cantidad: 0 },
      ajuste: { checked: false, cantidad: 0 },
      focos_fotoperiodo: { checked: false, cantidad: 0 },
      extractor_mortalidad: { checked: false, cantidad: 0 },
      sistema_aireacion: { checked: false, cantidad: 0 },
      sistema_oxigenacion: { checked: false, cantidad: 0 },
      otros: { checked: false, cantidad: 0, descripcion: '' },
      observaciones: ''
    },
    apoyo_faenas: {
      red_lober: false,
      red_pecera: false,
      balsas: false,
      cosecha: false,
      actividades: {
        soltar_reinstalar_tensores: { checked: false, cantidad: 0 },
        reparacion_red: { checked: false, cantidad: 0 },
        reinstalacion_extractor: { checked: false, cantidad: 0 },
        instalacion_reventadores: { checked: false, cantidad: 0 },
        recuperacion_fondones: { checked: false, cantidad: 0 }
      },
      observaciones: ''
    }
  });

  const addFichaBuzo = () => {
    if (fichasBuzos.length >= 8) return;
    
    const nextBuzoNumber = fichasBuzos.length + 1;
    const newFicha = createDefaultFicha(nextBuzoNumber);
    
    updateFormData({
      fichas_buzos: [...fichasBuzos, newFicha]
    });
  };

  const removeFichaBuzo = (index: number) => {
    const updatedFichas = fichasBuzos.filter((_, i) => i !== index);
    // Renumerar buzos
    const renumberedFichas = updatedFichas.map((ficha, i) => ({
      ...ficha,
      buzo_numero: i + 1
    }));
    
    updateFormData({
      fichas_buzos: renumberedFichas
    });
  };

  const updateFichaBuzo = (index: number, updatedFicha: FichaBuzo) => {
    const updatedFichas = [...fichasBuzos];
    updatedFichas[index] = updatedFicha;
    
    updateFormData({
      fichas_buzos: updatedFichas
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Fichas Individuales de Buzos
            </div>
            {!readOnly && fichasBuzos.length < 8 && (
              <Button onClick={addFichaBuzo} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Buzo
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fichasBuzos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay fichas de buzos agregadas.</p>
              {!readOnly && (
                <Button onClick={addFichaBuzo} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primera Ficha
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {fichasBuzos.map((ficha, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Buzo Nº {ficha.buzo_numero}</h3>
                    {!readOnly && fichasBuzos.length > 1 && (
                      <Button
                        onClick={() => removeFichaBuzo(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <BuzoFormSection
                    ficha={ficha}
                    onUpdate={(updatedFicha) => updateFichaBuzo(index, updatedFicha)}
                    readOnly={readOnly}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
