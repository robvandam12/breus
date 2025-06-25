
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Eye } from "lucide-react";

export const NetworkOperationsStep4 = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          Esquema de Jaulas - Lado Costa / Lado Canal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            Esta sección muestra el esquema visual de las jaulas organizadas por lado costa y lado canal.
          </p>

          {/* Placeholder para la imagen del esquema */}
          <div className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Esquema de Jaulas
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Aquí se mostrará el diagrama con la distribución de jaulas organizadas 
                  entre lado costa y lado canal, con las referencias correspondientes.
                </p>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Lado Costa</h4>
              <p className="text-sm text-blue-700">
                Jaulas ubicadas hacia el lado de la costa, generalmente con mayor protección 
                contra corrientes marinas.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Lado Canal</h4>
              <p className="text-sm text-green-700">
                Jaulas ubicadas hacia el canal principal, con mayor exposición a corrientes 
                y condiciones marinas abiertas.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Image className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Referencia Visual</p>
                <p className="text-sm text-yellow-700">
                  Este esquema sirve como referencia durante las faenas para identificar 
                  la ubicación exacta de cada jaula y planificar las actividades de manera eficiente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

