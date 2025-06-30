
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, AlertTriangle, CheckCircle } from "lucide-react";
import { useCuadrillas } from "@/hooks/useCuadrillas";
import { supabase } from "@/integrations/supabase/client";
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
  disabled = false,
  enterpriseContext
}: EnhancedCuadrillaSelectorProps) => {
  const { cuadrillas, isLoading, createCuadrilla } = useCuadrillas();
  const [availabilityStatus, setAvailabilityStatus] = useState<Record<string, AvailabilityResult>>({});
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  
  // Memoizar las cuadrillas filtradas de forma estable
  const availableCuadrillas = useMemo(() => {
    if (!cuadrillas || cuadrillas.length === 0) return [];
    
    return cuadrillas.filter(cuadrilla => {
      if (centroId) {
        return cuadrilla.centro_id === centroId || !cuadrilla.centro_id;
      }
      return true;
    });
  }, [cuadrillas, centroId]);

  // Memoizar la función de verificación de disponibilidad
  const checkCuadrillaAvailability = useCallback(async (cuadrillaId: string) => {
    if (!fechaInmersion) return { is_available: true };

    try {
      const { data, error } = await supabase.rpc('validate_cuadrilla_availability', {
        p_cuadrilla_id: cuadrillaId,
        p_fecha_inmersion: fechaInmersion,
        p_inmersion_id: inmersionId || null
      });

      if (error) {
        console.error('Error checking cuadrilla availability:', error);
        return { is_available: true };
      }

      return data?.[0] || { is_available: true };
    } catch (error) {
      console.error('Error in availability check:', error);
      return { is_available: true };
    }
  }, [fechaInmersion, inmersionId]);

  // Verificar disponibilidad con debounce y condiciones mejoradas
  useEffect(() => {
    // Condiciones de salida temprana
    if (!fechaInmersion || !availableCuadrillas.length) {
      setAvailabilityStatus({});
      return;
    }

    let isCancelled = false;

    const checkAllAvailability = async () => {
      if (isCancelled) return;
      
      setCheckingAvailability(true);
      const statusMap: Record<string, AvailabilityResult> = {};

      try {
        // Procesar en lotes para evitar sobrecargar la BD
        const batchSize = 5;
        for (let i = 0; i < availableCuadrillas.length; i += batchSize) {
          if (isCancelled) break;
          
          const batch = availableCuadrillas.slice(i, i + batchSize);
          const promises = batch.map(cuadrilla => 
            checkCuadrillaAvailability(cuadrilla.id).then(result => ({
              id: cuadrilla.id,
              result
            }))
          );
          
          const results = await Promise.all(promises);
          results.forEach(({ id, result }) => {
            statusMap[id] = result;
          });
        }
        
        if (!isCancelled) {
          setAvailabilityStatus(statusMap);
        }
      } catch (error) {
        console.error('Error checking availability for all cuadrillas:', error);
        if (!isCancelled) {
          setAvailabilityStatus({});
        }
      } finally {
        if (!isCancelled) {
          setCheckingAvailability(false);
        }
      }
    };

    // Debounce para evitar múltiples llamadas
    const timeoutId = setTimeout(checkAllAvailability, 800);
    
    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [fechaInmersion, inmersionId, availableCuadrillas, checkCuadrillaAvailability]);

  const handleCuadrillaSelect = useCallback((cuadrillaId: string) => {
    if (cuadrillaId === 'create-new') {
      handleCreateCuadrilla();
      return;
    }

    const availability = availabilityStatus[cuadrillaId];
    
    if (availability && !availability.is_available) {
      toast({
        title: "Cuadrilla no disponible",
        description: `Esta cuadrilla ya está asignada a la inmersión ${availability.conflicting_inmersion_codigo} para esta fecha.`,
        variant: "destructive",
      });
      return;
    }

    onCuadrillaChange(cuadrillaId);
  }, [availabilityStatus, onCuadrillaChange]);

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

  const getAvailabilityBadge = useCallback((cuadrillaId: string) => {
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
  }, [fechaInmersion, availabilityStatus, checkingAvailability]);

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
              <SelectItem value="create-new">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-green-600" />
                  Crear nueva cuadrilla
                </div>
              </SelectItem>
              {availableCuadrillas.map((cuadrilla) => (
                <SelectItem key={cuadrilla.id} value={cuadrilla.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{cuadrilla.nombre}</span>
                    {getAvailabilityBadge(cuadrilla.id)}
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
              {getAvailabilityBadge(selectedCuadrillaId)}
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
