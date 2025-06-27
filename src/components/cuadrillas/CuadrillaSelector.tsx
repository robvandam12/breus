
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Plus, AlertTriangle, Calendar } from "lucide-react";
import { useCuadrillasConAsignaciones, useCuadrillaAvailability } from "@/hooks/useCuadrillaAvailability";
import { CreateEquipoFormWizard } from "@/components/equipos/CreateEquipoFormWizard";
import { WizardDialog } from "@/components/forms/WizardDialog";

interface CuadrillaSelectorProps {
  selectedCuadrillaId?: string;
  onCuadrillaChange: (cuadrillaId: string | null) => void;
  fechaInmersion?: string;
  inmersionId?: string;
  onCuadrillaCreated?: (cuadrilla: any) => void;
}

export const CuadrillaSelector = ({
  selectedCuadrillaId,
  onCuadrillaChange,
  fechaInmersion,
  inmersionId,
  onCuadrillaCreated
}: CuadrillaSelectorProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: cuadrillas = [], isLoading } = useCuadrillasConAsignaciones();
  const { data: availability } = useCuadrillaAvailability(
    selectedCuadrillaId,
    fechaInmersion,
    inmersionId
  );

  const selectedCuadrilla = cuadrillas.find(c => c.id === selectedCuadrillaId);

  const getCuadrillaConflictos = (cuadrilla: any) => {
    if (!fechaInmersion) return [];
    
    return cuadrilla.cuadrilla_asignaciones?.filter((asignacion: any) => 
      asignacion.fecha_asignacion === fechaInmersion &&
      asignacion.estado === 'activa' &&
      asignacion.inmersion_id !== inmersionId
    ) || [];
  };

  const handleCreateCuadrilla = async (data: any) => {
    try {
      setShowCreateForm(false);
      if (onCuadrillaCreated) {
        onCuadrillaCreated(data);
      }
    } catch (error) {
      console.error('Error creating cuadrilla:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Cuadrilla de Buceo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <Select
              value={selectedCuadrillaId || ""}
              onValueChange={(value) => onCuadrillaChange(value || null)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cuadrilla existente" />
              </SelectTrigger>
              <SelectContent>
                {cuadrillas.map((cuadrilla) => {
                  const conflictos = getCuadrillaConflictos(cuadrilla);
                  const tieneConflicto = conflictos.length > 0;
                  
                  return (
                    <SelectItem 
                      key={cuadrilla.id} 
                      value={cuadrilla.id}
                      disabled={tieneConflicto}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <span className={tieneConflicto ? 'text-gray-400' : ''}>
                            {cuadrilla.nombre}
                          </span>
                          <div className="text-xs text-gray-500">
                            {cuadrilla.cuadrilla_miembros?.length || 0} miembros
                          </div>
                        </div>
                        {tieneConflicto && (
                          <AlertTriangle className="w-4 h-4 text-orange-500 ml-2" />
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <WizardDialog
            triggerText="Nueva Cuadrilla"
            triggerIcon={Plus}
            open={showCreateForm}
            onOpenChange={setShowCreateForm}
            size="xl"
          >
            <CreateEquipoFormWizard
              onSubmit={handleCreateCuadrilla}
              onCancel={() => setShowCreateForm(false)}
            />
          </WizardDialog>
        </div>

        {/* Mostrar información de la cuadrilla seleccionada */}
        {selectedCuadrilla && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{selectedCuadrilla.nombre}</h4>
              <Badge variant="outline">
                {selectedCuadrilla.cuadrilla_miembros?.length || 0} miembros
              </Badge>
            </div>
            
            {selectedCuadrilla.descripcion && (
              <p className="text-sm text-gray-600 mb-2">{selectedCuadrilla.descripcion}</p>
            )}

            <div className="space-y-1">
              {selectedCuadrilla.cuadrilla_miembros?.map((miembro: any) => (
                <div key={miembro.id} className="flex items-center justify-between text-sm">
                  <span>
                    {miembro.usuario?.nombre} {miembro.usuario?.apellido}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {miembro.rol_equipo}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alertas de conflicto */}
        {availability && !availability.is_available && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Esta cuadrilla ya está asignada a la inmersión{' '}
              <strong>{availability.conflicting_inmersion_codigo}</strong>{' '}
              en la fecha {fechaInmersion}.
            </AlertDescription>
          </Alert>
        )}

        {/* Mostrar asignaciones próximas */}
        {selectedCuadrilla && selectedCuadrilla.cuadrilla_asignaciones && selectedCuadrilla.cuadrilla_asignaciones.length > 0 && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Asignaciones Próximas</span>
            </div>
            <div className="space-y-1">
              {selectedCuadrilla.cuadrilla_asignaciones
                .filter((asignacion: any) => asignacion.estado === 'activa')
                .slice(0, 3)
                .map((asignacion: any) => (
                  <div key={asignacion.id} className="flex items-center justify-between text-xs">
                    <span>{asignacion.fecha_asignacion}</span>
                    <Badge variant="outline" className="text-xs">
                      {asignacion.inmersion?.codigo}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
