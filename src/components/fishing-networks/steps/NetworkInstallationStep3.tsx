
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Network } from "lucide-react";
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
          <Network className="w-5 h-5" />
          Instalación de Loberos / Peceras
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Ingrese los números de jaula para cada combinación de sección y franja. 
            Puede usar formatos como "1, 2, 3" o "1-5" según corresponda.
          </p>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-64">Sección</TableHead>
                  {franjas.map((franja) => (
                    <TableHead key={franja} className="text-center min-w-32">
                      {franja}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {secciones.map((seccion) => (
                  <TableRow key={seccion.key}>
                    <TableCell className="font-medium">
                      {seccion.label}
                    </TableCell>
                    {franjas.map((franja) => (
                      <TableCell key={franja}>
                        <Input
                          placeholder="Jaula N° ..."
                          value={formData.instalacion_redes[seccion.key as keyof typeof formData.instalacion_redes]?.[franja] || ''}
                          onChange={(e) => handleInputChange(seccion.key, franja, e.target.value)}
                          disabled={readOnly}
                          className="text-center"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Ejemplo:</strong> Para la jaula número 1, escriba "1". Para múltiples jaulas, 
              use "1, 2, 3" o "1-3". Deje en blanco las celdas que no apliquen.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

