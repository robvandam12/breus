
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, Info } from "lucide-react";

interface OperacionTeamTransitionProps {
  operacionId: string;
  onNavigateToInmersiones?: () => void;
}

export const OperacionTeamTransition = ({ 
  operacionId, 
  onNavigateToInmersiones 
}: OperacionTeamTransitionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Gestión de Personal de Buceo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-blue-800">
            <strong>Nueva Arquitectura:</strong> El personal de buceo ahora se gestiona individualmente para cada inmersión, 
            no a nivel de operación. Esto permite mayor flexibilidad y control granular del personal asignado.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="font-medium">¿Cómo funciona ahora?</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Cada inmersión tiene su propio equipo de buceo asignado</li>
            <li>• El personal se selecciona específicamente para cada inmersión</li>
            <li>• Permite diferentes equipos para diferentes inmersiones dentro de la misma operación</li>
            <li>• Mayor flexibilidad en la planificación y ejecución</li>
          </ul>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={onNavigateToInmersiones}
            className="flex items-center gap-2"
          >
            Ir a Gestión de Inmersiones
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
