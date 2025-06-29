
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Plus, AlertTriangle, CheckCircle, Calendar } from "lucide-react";
import { useCuadrillas } from '@/hooks/useCuadrillas';
import { CuadrillaCreationWizardEnhanced } from './CuadrillaCreationWizardEnhanced';
import { CuadrillaManagementModal } from './CuadrillaManagementModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface EnhancedCuadrillaSelectorProps {
  selectedCuadrillaId: string | null;
  onCuadrillaChange: (cuadrillaId: string | null) => void;
  fechaInmersion?: string;
  onCuadrillaCreated?: (cuadrilla: any) => void;
  enterpriseContext?: any;
}

interface AvailabilityCheck {
  is_available: boolean;
  conflicting_inmersion_id: string | null;
  conflicting_inmersion_codigo: string | null;
}

export const EnhancedCuadrillaSelector = ({
  selectedCuadrillaId,
  onCuadrillaChange,
  fechaInmersion,
  onCuadrillaCreated,
  enterpriseContext
}: EnhancedCuadrillaSelectorProps) => {
  const { cuadrillas, isLoading } = useCuadrillas();
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [showManagementModal, setShowManagementModal] = useState(false);
  const [selectedCuadrilla, setSelectedCuadrilla] = useState<any>(null);
  const [availabilityStatus, setAvailabilityStatus] = useState<Record<string, AvailabilityCheck>>({});

  // Verificar disponibilidad cuando cambien las cuadrillas o la fecha
  useEffect(() => {
    if (cuadrillas.length > 0 && fechaInmersion) {
      checkAvailability();
    }
  }, [cuadrillas, fechaInmersion]);

  const checkAvailability = async () => {
    if (!fechaInmersion) return;

    const availabilityResults: Record<string, AvailabilityCheck> = {};

    for (const cuadrilla of cuadrillas) {
      try {
        const { data, error } = await supabase
          .rpc('validate_cuadrilla_availability', {
            p_cuadrilla_id: cuadrilla.id,
            p_fecha_inmersion: fechaInmersion
          });

        if (error) {
          console.error('Error checking availability:', error);
          continue;
        }

        if (data && data.length > 0) {
          availabilityResults[cuadrilla.id] = data[0];
        }
      } catch (error) {
        console.error('Error checking cuadrilla availability:', error);
      }
    }

    setAvailabilityStatus(availabilityResults);
  };

  const handleCuadrillaCreated = (newCuadrilla: any) => {
    setShowCreateWizard(false);
    onCuadrillaChange(newCuadrilla.id);
    onCuadrillaCreated?.(newCuadrilla);
    toast({
      title: "Cuadrilla creada y asignada",
      description: `La cuadrilla "${newCuadrilla.nombre}" ha sido creada y asignada a la inmersión.`,
    });
  };

  const getAvailabilityBadge = (cuadrillaId: string) => {
    if (!fechaInmersion) return null;

    const status = availabilityStatus[cuadrillaId];
    if (!status) return null;

    if (status.is_available) {
      return (
        <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
          <CheckCircle className="w-3 h-3 mr-1" />
          Disponible
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="text-red-600 border-red-200 text-xs">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Ocupada
        </Badge>
      );
    }
  };

  const getConflictInfo = (cuadrillaId: string) => {
    const status = availabilityStatus[cuadrillaId];
    if (!status || status.is_available) return null;

    return (
      <div className="text-xs text-red-600 mt-1 p-2 bg-red-50 rounded border">
        <AlertTriangle className="w-3 h-3 inline mr-1" />
        Conflicto con inmersión: {status.conflicting_inmersion_codigo}
      </div>
    );
  };

  // Verificar si la cuadrilla seleccionada está ocupada
  const isSelectedCuadrillaOccupied = selectedCuadrillaId && 
    availabilityStatus[selectedCuadrillaId] && 
    !availabilityStatus[selectedCuadrillaId].is_available;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Cuadrilla de Buceo</span>
              {selectedCuadrillaId && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Asignada
                </Badge>
              )}
            </div>
            <Button
              onClick={() => setShowCreateWizard(true)}
              size="sm"
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {fechaInmersion && (
            <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-blue-50 rounded">
              <Calendar className="w-4 h-4" />
              <span>Fecha de inmersión: {fechaInmersion}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label>Seleccionar Cuadrilla</Label>
            <Select
              value={selectedCuadrillaId || ''}
              onValueChange={(value) => onCuadrillaChange(value || null)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Cargando cuadrillas..." : "Seleccionar cuadrilla"} />
              </SelectTrigger>
              <SelectContent>
                {cuadrillas.length === 0 && !isLoading && (
                  <div className="p-4 text-center text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No hay cuadrillas disponibles</p>
                    <p className="text-xs">Cree una nueva cuadrilla</p>
                  </div>
                )}
                {cuadrillas.map((cuadrilla) => (
                  <SelectItem key={cuadrilla.id} value={cuadrilla.id}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{cuadrilla.nombre}</span>
                          {getAvailabilityBadge(cuadrilla.id)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {cuadrilla.miembros?.length || 0} miembros • {cuadrilla.estado}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Información detallada de la cuadrilla seleccionada */}
          {selectedCuadrillaId && (
            <div className="space-y-3">
              {(() => {
                const cuadrilla = cuadrillas.find(c => c.id === selectedCuadrillaId);
                if (!cuadrilla) return <p className="text-sm text-gray-500">Cuadrilla no encontrada</p>;

                return (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-sm">{cuadrilla.nombre}</h4>
                      <Button
                        onClick={() => {
                          setSelectedCuadrilla(cuadrilla);
                          setShowManagementModal(true);
                        }}
                        size="sm"
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-800 h-auto p-1"
                      >
                        Ver Detalles
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {cuadrilla.miembros?.map((miembro: any, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {miembro.nombre} {miembro.apellido} ({miembro.rol_equipo})
                          </Badge>
                        ))}
                      </div>

                      {/* Información de conflicto si existe */}
                      {getConflictInfo(cuadrilla.id)}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Advertencia si no hay fecha seleccionada */}
          {!fechaInmersion && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              💡 Seleccione una fecha de inmersión para verificar la disponibilidad de las cuadrillas.
            </div>
          )}

          {/* Advertencia si hay conflicto */}
          {isSelectedCuadrillaOccupied && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              <strong>¡Atención!</strong> La cuadrilla seleccionada tiene un conflicto en la fecha elegida. Se recomienda seleccionar otra cuadrilla o cambiar la fecha.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wizard de creación mejorado */}
      <CuadrillaCreationWizardEnhanced
        isOpen={showCreateWizard}
        onClose={() => setShowCreateWizard(false)}
        onCuadrillaCreated={handleCuadrillaCreated}
        enterpriseContext={enterpriseContext}
        fechaInmersion={fechaInmersion}
      />

      {/* Modal de gestión */}
      {selectedCuadrilla && (
        <CuadrillaManagementModal
          isOpen={showManagementModal}
          onClose={() => {
            setShowManagementModal(false);
            setSelectedCuadrilla(null);
          }}
          cuadrillaId={selectedCuadrilla.id}
          onCuadrillaUpdated={(updatedCuadrilla) => {
            setSelectedCuadrilla(updatedCuadrilla);
          }}
          fechaInmersion={fechaInmersion}
        />
      )}
    </>
  );
};
