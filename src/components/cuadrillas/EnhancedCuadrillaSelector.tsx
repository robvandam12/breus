
import React, { useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";
import { useCuadrillas } from "@/hooks/useCuadrillas";
import { useCuadrillaAvailability } from "@/hooks/useCuadrillaAvailability";
import { CuadrillaAvailabilityBadge } from './components/CuadrillaAvailabilityBadge';
import { CuadrillaCreateButton } from './components/CuadrillaCreateButton';
import { toast } from "@/hooks/use-toast";

interface EnhancedCuadrillaSelectorProps {
  selectedCuadrillaId?: string | null;
  onCuadrillaChange: (cuadrillaId: string | null) => void;
  fechaInmersion?: string;
  inmersionId?: string;
  centroId?: string;
  disabled?: boolean;
  enterpriseContext?: any;
}

export const EnhancedCuadrillaSelector = ({
  selectedCuadrillaId,
  onCuadrillaChange,
  fechaInmersion,
  inmersionId,
  centroId,
  disabled = false,
  enterpriseContext
}: EnhancedCuadrillaSelectorProps) => {
  const { cuadrillas, isLoading, createCuadrilla } = useCuadrillas();
  
  // Memoizar las cuadrillas filtradas
  const availableCuadrillas = useMemo(() => {
    if (!cuadrillas || cuadrillas.length === 0) return [];
    
    return cuadrillas.filter(cuadrilla => {
      if (centroId) {
        return cuadrilla.centro_id === centroId || !cuadrilla.centro_id;
      }
      return true;
    });
  }, [cuadrillas, centroId]);

  // Solo verificar disponibilidad de la cuadrilla seleccionada
  const { data: selectedCuadrillaAvailability } = useCuadrillaAvailability(
    selectedCuadrillaId || undefined,
    fechaInmersion || undefined,
    inmersionId
  );

  const handleCuadrillaSelect = useCallback((cuadrillaId: string) => {
    if (cuadrillaId === 'create-new') {
      handleCreateCuadrilla();
      return;
    }

    // Solo verificar disponibilidad si hay fecha de inmersión
    if (fechaInmersion && selectedCuadrillaAvailability && !selectedCuadrillaAvailability.is_available) {
      toast({
        title: "Cuadrilla no disponible",
        description: `Esta cuadrilla ya está asignada a la inmersión ${selectedCuadrillaAvailability.conflicting_inmersion_codigo} para esta fecha.`,
        variant: "destructive",
      });
      return;
    }

    onCuadrillaChange(cuadrillaId);
  }, [fechaInmersion, selectedCuadrillaAvailability, onCuadrillaChange]);

  const handleCreateCuadrilla = useCallback(async () => {
    try {
      const newCuadrilla = await createCuadrilla({
        nombre: `Cuadrilla ${Date.now()}`,
        centro_id: centroId || null,
        estado: 'disponible',
        activo: true
      });
      
      if (newCuadrilla) {
        onCuadrillaChange(newCuadrilla.id);
        toast({
          title: "Cuadrilla creada",
          description: "Se ha creado una nueva cuadrilla exitosamente.",
        });
      }
    } catch (error) {
      console.error('Error creating cuadrilla:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la cuadrilla.",
        variant: "destructive",
      });
    }
  }, [createCuadrilla, centroId, onCuadrillaChange]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Cuadrilla de Buceo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="text-gray-500">Cargando cuadrillas...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Cuadrilla de Buceo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Select
            value={selectedCuadrillaId || ''}
            onValueChange={handleCuadrillaSelect}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar cuadrilla" />
            </SelectTrigger>
            <SelectContent>
              <CuadrillaCreateButton />
              {availableCuadrillas.map((cuadrilla) => (
                <SelectItem key={cuadrilla.id} value={cuadrilla.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{cuadrilla.nombre}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedCuadrillaId && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>
                Cuadrilla seleccionada: {availableCuadrillas.find(c => c.id === selectedCuadrillaId)?.nombre}
              </span>
              {fechaInmersion && (
                <CuadrillaAvailabilityBadge
                  cuadrillaId={selectedCuadrillaId}
                  fechaInmersion={fechaInmersion}
                  availabilityStatus={selectedCuadrillaAvailability ? { [selectedCuadrillaId]: selectedCuadrillaAvailability } : {}}
                  checkingAvailability={false}
                />
              )}
            </div>
          )}
        </div>

        {fechaInmersion && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <Users className="w-4 h-4 inline mr-2" />
              La disponibilidad se verifica para la fecha: {fechaInmersion}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
