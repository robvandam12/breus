
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface AvailabilityResult {
  is_available: boolean;
  conflicting_inmersion_id?: string;
  conflicting_inmersion_codigo?: string;
}

interface CuadrillaAvailabilityBadgeProps {
  cuadrillaId: string;
  fechaInmersion?: string;
  availabilityStatus: Record<string, AvailabilityResult>;
  checkingAvailability: boolean;
}

export const CuadrillaAvailabilityBadge = ({
  cuadrillaId,
  fechaInmersion,
  availabilityStatus,
  checkingAvailability
}: CuadrillaAvailabilityBadgeProps) => {
  if (!fechaInmersion) return null;
  
  const availability = availabilityStatus[cuadrillaId];
  
  if (!availability) {
    return checkingAvailability ? (
      <Badge variant="outline" className="text-yellow-600">
        Verificando...
      </Badge>
    ) : null;
  }

  return availability.is_available ? (
    <Badge variant="outline" className="text-green-600">
      <CheckCircle className="w-3 h-3 mr-1" />
      Disponible
    </Badge>
  ) : (
    <Badge variant="outline" className="text-red-600">
      <AlertTriangle className="w-3 h-3 mr-1" />
      Ocupada
    </Badge>
  );
};
