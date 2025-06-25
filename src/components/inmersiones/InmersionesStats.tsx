
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface InmersionesStatsProps {
  estadisticas: {
    total: number;
    planificadas: number;
    independientes: number;
    completadas: number;
  };
  hasPlanning: boolean;
}

export const InmersionesStats: React.FC<InmersionesStatsProps> = ({
  estadisticas,
  hasPlanning
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{estadisticas.total}</div>
            <div className="text-sm text-gray-600">Total Inmersiones</div>
          </div>
        </CardContent>
      </Card>
      
      {hasPlanning && (
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{estadisticas.planificadas}</div>
              <div className="text-sm text-gray-600">Planificadas</div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{estadisticas.independientes}</div>
            <div className="text-sm text-gray-600">Independientes</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{estadisticas.completadas}</div>
            <div className="text-sm text-gray-600">Completadas</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
