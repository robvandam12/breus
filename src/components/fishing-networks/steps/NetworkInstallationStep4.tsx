
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors } from "lucide-react";
import type { NetworkInstallationData } from '@/types/fishing-networks';

interface NetworkInstallationStep4Props {
  formData: NetworkInstallationData;
  updateFormData: (updates: Partial<NetworkInstallationData>) => void;
  readOnly?: boolean;
}

export const NetworkInstallationStep4 = ({ 
  formData, 
  updateFormData, 
  readOnly = false 
}: NetworkInstallationStep4Props) => {
  const handleInputChange = (field: keyof typeof formData.cambio_franjas, value: string) => {
    updateFormData({
      cambio_franjas: {
        ...formData.cambio_franjas,
        [field]: value
      }
    });
  };

  const costuras = [
    { key: 'costura_ftc_fcd', label: 'FTC → FCD', descripcion: 'Franja Tapa Cabecera a Franja Central Doble' },
    { key: 'costura_fced_fcs', label: 'FCED → FCS', descripcion: 'Franja Central Externa Doble a Franja Central Simple' },
    { key: 'costura_fces_fcs', label: 'FCES → FCS', descripcion: 'Franja Central Externa Simple a Franja Central Simple' },
    { key: 'costura_fma', label: 'FMA', descripcion: 'Franja Mangampo' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="w-5 h-5" />
          Cambio de Franjas - Costuras
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            Ingrese los números de jaula donde se realizaron cambios de franjas con costuras específicas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {costuras.map((costura) => (
              <div key={costura.key} className="space-y-2">
                <Label htmlFor={costura.key} className="text-sm font-medium">
                  {costura.label}
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  {costura.descripcion}
                </p>
                <Input
                  id={costura.key}
                  placeholder="Jaula N° ..."
                  value={formData.cambio_franjas[costura.key as keyof typeof formData.cambio_franjas] || ''}
                  onChange={(e) => handleInputChange(costura.key as keyof typeof formData.cambio_franjas, e.target.value)}
                  disabled={readOnly}
                />
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Scissors className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Información sobre Costuras</p>
                <p className="text-sm text-yellow-700">
                  Las costuras representan las uniones entre diferentes tipos de franjas en la red. 
                  Registre únicamente las jaulas donde se realizaron estos tipos específicos de costuras.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

