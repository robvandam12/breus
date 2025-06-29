import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, AlertTriangle, CheckCircle } from "lucide-react";
import { useCuadrillas } from "@/hooks/useCuadrillas";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface EnhancedCuadrillaSelectorProps {
  selectedCuadrillaId?: string;
  onCuadrillaChange: (cuadrillaId: string | null) => void;
  fechaInmersion?: string;
  inmersionId?: string;
  centroId?: string;
  disabled?: boolean;
}

interface AvailabilityResult {
  is_available: boolean;
  conflicting_inmersion_id?: string;
  conflicting_inmersion_codigo?: string;
}

export const EnhancedCuadrillaSelector = ({
  selectedCuadrillaId,
  onCuadrillaChange,
  fechaInmersion,
  inmersionId,
  centroId,
  disabled = false
}: EnhancedCuadrillaSelectorProps) => {
  const { cuadrillas, isLoading, createCuadrilla } = useCuadrillas();
  const [availabilityStatus, setAvailabilityStatus] = useState<Record<string, AvailabilityResult>>({});
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  
  // Filtrar cuadrillas según el centro si está especificado
  const availableCuadrillas = cuadrillas.filter(cuadrilla => {
    if (centroId) {
      return cuadrilla.centro_id === centroId || !cuadrilla.centro_id; // Global o específico del centro
    }
    return true;
  });

  // Verificar disponibilidad de cuadrillas usando la función RPC corregida
  const checkCuadrillaAvailability = async (cuadrillaId: string) => {
    if (!fechaInmersion) return { is_available: true };

    try {
      const { data, error } = await supabase.rpc('validate_cuadrilla_availability', {
        p_cuadrilla_id: cuadrillaId,
        p_fecha_inmersion: fechaInmersion,
        p_inmersion_id: inmersionId || null
      });

      if (error) {
        console.error('Error checking cuadrilla availability:', error);
        return { is_available: true }; // Fallback: asumir disponible si hay error
      }

      return data?.[0] || { is_available: true };
    } catch (error) {
      console.error('Error in availability check:', error);
      return { is_available: true };
    }
  };

  // Verificar disponibilidad de todas las cuadrillas cuando cambie la fecha
  useEffect(() => {
    if (!fechaInmersion || availableCuadrillas.length === 0) {
      setAvailabilityStatus({});
      return;
    }

    const checkAllAvailability = async () => {
      setCheckingAvailability(true);
      const statusMap: Record<string, AvailabilityResult> = {};

      for (const cuadrilla of availableCuadrillas) {
        const result = await checkCuadrillaAvailability(cuadrilla.id);
        statusMap[cuadrilla.id] = result;
      }

      setAvailabilityStatus(statusMap);
      setCheckingAvailability(false);
    };

    checkAllAvailability();
  }, [fechaInmersion, availableCuadrillas, inmersionId]);

  const handleCuadrillaSelect = (cuadrillaId: string) => {
    if (cuadrillaId === 'create-new') {
      handleCreateCuadrilla();
      return;
    }

    const availability = availabilityStatus[cuadrillaId];
    if (availability && !availability.is_available) {
      toast({
        title: "Cuadrilla no disponible",
        description: `Esta cuadrilla ya está asignada a la inmersión ${availability.conflicting_inmersion_codigo}`,
        variant: "destructive"
      });
      return;
    }

    onCuadrillaChange(cuadrillaId);
  };

  const handleCreateCuadrilla = async () => {
    try {
      const newCuadrilla = await createCuadrilla({
        nombre: `Cuadrilla ${Date.now()}`,
        descripcion: 'Cuadrilla creada desde selector',
        estado: 'disponible',
        centro_id: centroId || null
      });
      
      onCuadrillaChange(newCuadrilla.id);
      toast({
        title: "Cuadrilla creada",
        description: "Nueva cuadrilla creada exitosamente"
      });
    } catch (error) {
      console.error('Error creating cuadrilla:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la cuadrilla",
        variant: "destructive"
      });
    }
  };

  const getCuadrillaDisplayInfo = (cuadrilla: any) => {
    const availability = availabilityStatus[cuadrilla.id];
    const miembrosCount = cuadrilla.miembros?.length || 0;
    
    return {
      isAvailable: !availability || availability.is_available,
      memberCount: miembrosCount,
      conflictInfo: availability?.conflicting_inmersion_codigo
    };
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5" />
          Asignar Cuadrilla
          {checkingAvailability && (
            <div className="ml-2 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Select
              value={selectedCuadrillaId || ''}
              onValueChange={handleCuadrillaSelect}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cuadrilla..." />
              </SelectTrigger>
              <SelectContent>
                {availableCuadrillas.map((cuadrilla) => {
                  const displayInfo = getCuadrillaDisplayInfo(cuadrilla);
                  
                  return (
                    <SelectItem 
                      key={cuadrilla.id} 
                      value={cuadrilla.id}
                      disabled={!displayInfo.isAvailable}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span>{cuadrilla.nombre}</span>
                          <Badge variant="outline" className="text-xs">
                            {displayInfo.memberCount} miembros
                          </Badge>
                          {displayInfo.isAvailable ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
                <SelectItem value="create-new">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Crear nueva cuadrilla</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mostrar información de la cuadrilla seleccionada */}
          {selectedCuadrillaId && (
            <div className="mt-4">
              {(() => {
                const selectedCuadrilla = availableCuadrillas.find(c => c.id === selectedCuadrillaId);
                if (!selectedCuadrilla) return null;
                
                const displayInfo = getCuadrillaDisplayInfo(selectedCuadrilla);
                
                return (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{selectedCuadrilla.nombre}</h4>
                        <p className="text-sm text-gray-600">
                          {displayInfo.memberCount} miembros • {selectedCuadrilla.estado}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {displayInfo.isAvailable ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Disponible
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Ocupada
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {!displayInfo.isAvailable && displayInfo.conflictInfo && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        Conflicto con inmersión: {displayInfo.conflictInfo}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {availableCuadrillas.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-3">No hay cuadrillas disponibles</p>
              <Button onClick={handleCreateCuadrilla} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Crear primera cuadrilla
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
