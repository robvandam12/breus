
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Anchor } from "lucide-react";
import type { NetworkInstallationData } from '@/types/fishing-networks';

interface NetworkInstallationStep3Props {
  formData: NetworkInstallationData;
  updateFormData: (updates: Partial<NetworkInstallationData>) => void;
  readOnly?: boolean;
}

export const NetworkInstallationStep3 = ({ 
  formData, 
  updateFormData, 
  readOnly = false 
}: NetworkInstallationStep3Props) => {
  const franjas = ['TC', 'FCD', 'FCS', 'MA', 'Pecera'];
  
  const secciones = [
    { key: 'instalacion_redes', label: 'Instalación de Redes' },
    { key: 'instalacion_impias', label: 'Instalación de Impías (Amarras a Pasillo)' },
    { key: 'contrapeso_250kg', label: 'Contrapeso 250 kg' },
    { key: 'contrapeso_150kg', label: 'Contrapeso 150 kg' },
    { key: 'reticulado_cabecera', label: 'Reticulado Cabecera' },
  ];

  const handleInputChange = (seccion: string, franja: string, value: string) => {
    updateFormData({
      instalacion_redes: {
        ...formData.instalacion_redes,
        [seccion]: {
          ...formData.instalacion_redes[seccion as keyof typeof formData.instalacion_redes],
          [franja]: value
        }
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Anchor className="w-5 h-5" />
          Instalación de Loberos / Peceras
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            Ingrese los números de jaula para cada combinación de sección y franja. 
            Puede usar múltiples jaulas separadas por comas (ej: "1, 3, 5").
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-3 text-left font-medium">
                    Sección
                  </th>
                  {franjas.map((franja) => (
                    <th key={franja} className="border border-gray-300 p-3 text-center font-medium min-w-[120px]">
                      {franja}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {secciones.map((seccion) => (
                  <tr key={seccion.key} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 font-medium bg-gray-25">
                      {seccion.label}
                    </td>
                    {franjas.map((franja) => (
                      <td key={franja} className="border border-gray-300 p-2">
                        <Input
                          placeholder="Jaula N°..."
                          value={formData.instalacion_redes[seccion.key as keyof typeof formData.instalacion_redes]?.[franja] || ''}
                          onChange={(e) => handleInputChange(seccion.key, franja, e.target.value)}
                          disabled={readOnly}
                          className="text-center text-sm"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Anchor className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Referencia de Franjas</p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li><strong>TC</strong> = Tapa Cabecera</li>
                  <li><strong>FCD</strong> = Franja Central Doble</li>
                  <li><strong>FCS</strong> = Franja Central Simple</li>
                  <li><strong>MA</strong> = Franja Mangampo</li>
                  <li><strong>Pecera</strong> = Red Pecera</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
