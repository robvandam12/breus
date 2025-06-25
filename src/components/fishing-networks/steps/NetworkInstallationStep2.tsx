
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export const NetworkInstallationStep2 = () => {
  const leyendaItems = [
    { codigo: 'TC', descripcion: 'Tapa Cabecera' },
    { codigo: 'FCD', descripcion: 'Franja Central Doble' },
    { codigo: 'FCS', descripcion: 'Franja Central Simple' },
    { codigo: 'MA', descripcion: 'Franja Mangampo' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          Leyenda de Franjas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Esta es la leyenda de referencia para las franjas utilizadas en los siguientes pasos:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leyendaItems.map((item) => (
              <div key={item.codigo} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="font-bold text-blue-700">{item.codigo}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{item.descripcion}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-6">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Nota Importante</p>
                <p className="text-sm text-yellow-700">
                  Mantenga esta leyenda como referencia durante el llenado de las siguientes secciones. 
                  Las franjas mencionadas corresponden a las diferentes partes de la estructura de red.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

