
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Ship, Users, Settings } from "lucide-react";

interface InmersionesContextInfoProps {
  contextInfo: {
    empresa: string;
    tipo: 'salmonera' | 'contratista' | null;
    modulos: string[];
  };
}

export const InmersionesContextInfo = ({ contextInfo }: InmersionesContextInfoProps) => {
  const getModuleDisplayName = (moduleName: string) => {
    const moduleMap: Record<string, string> = {
      'core_immersions': 'Inmersiones Core',
      'planning_operations': 'Planificación de Operaciones',
      'maintenance_networks': 'Mantención de Redes',
      'advanced_reporting': 'Reportes Avanzados',
      'external_integrations': 'Integraciones Externas'
    };
    return moduleMap[moduleName] || moduleName;
  };

  if (!contextInfo.tipo) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <Settings className="w-4 h-4" />
            <span className="font-medium">{contextInfo.empresa}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800 text-sm">
          {contextInfo.tipo === 'salmonera' ? (
            <Building2 className="w-4 h-4" />
          ) : (
            <Ship className="w-4 h-4" />
          )}
          Contexto Empresarial
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-blue-900">{contextInfo.empresa}</span>
            <Badge variant={contextInfo.tipo === 'salmonera' ? 'default' : 'secondary'}>
              {contextInfo.tipo}
            </Badge>
          </div>
          
          {contextInfo.modulos.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-3 h-3 text-blue-700" />
                <span className="text-xs font-medium text-blue-700">Módulos activos:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {contextInfo.modulos.map((modulo) => (
                  <Badge 
                    key={modulo} 
                    variant="outline" 
                    className="text-xs bg-blue-100 text-blue-700 border-blue-200"
                  >
                    {getModuleDisplayName(modulo)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
