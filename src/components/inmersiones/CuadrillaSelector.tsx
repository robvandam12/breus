
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, AlertTriangle, Calendar, CheckCircle } from 'lucide-react';
import { useCuadrillasBuceo } from '@/hooks/useCuadrillasBuceo';
import { useCuadrillaConflictValidation } from '@/hooks/useCuadrillaConflictValidation';
import { CreateCuadrillaFormWizard } from '@/components/cuadrillas/CreateCuadrillaFormWizard';

interface CuadrillaSelectorProps {
  selectedCuadrillaId?: string;
  fechaInmersion?: string;
  inmersionId?: string;
  onCuadrillaChange: (cuadrillaId: string | null) => void;
  onCuadrillaCreated?: (cuadrilla: any) => void;
}

export const CuadrillaSelector = ({
  selectedCuadrillaId,
  fechaInmersion,
  inmersionId,
  onCuadrillaChange,
  onCuadrillaCreated
}: CuadrillaSelectorProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { cuadrillas, isLoading, createCuadrilla } = useCuadrillasBuceo();
  
  const { data: conflictValidation } = useCuadrillaConflictValidation(
    selectedCuadrillaId || null,
    fechaInmersion || null,
    inmersionId
  );

  const handleCuadrillaCreated = async (data: any) => {
    try {
      const newCuadrilla = await createCuadrilla(data.cuadrillaData);
      setShowCreateDialog(false);
      onCuadrillaChange(newCuadrilla.id);
      onCuadrillaCreated?.(newCuadrilla);
    } catch (error) {
      console.error('Error creating cuadrilla:', error);
    }
  };

  const selectedCuadrilla = cuadrillas.find(c => c.id === selectedCuadrillaId);

  const getAvailableCuadrillas = () => {
    if (!fechaInmersion) return cuadrillas;
    
    return cuadrillas.map(cuadrilla => {
      const hasConflict = cuadrilla.asignaciones_activas?.some(
        asignacion => asignacion.fecha === fechaInmersion && asignacion.inmersion_id !== inmersionId
      );
      return { ...cuadrilla, hasConflict };
    });
  };

  const availableCuadrillas = getAvailableCuadrillas();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-zinc-500">
            Cargando cuadrillas...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Cuadrilla de Buceo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Select
              value={selectedCuadrillaId || ''}
              onValueChange={(value) => onCuadrillaChange(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cuadrilla existente" />
              </SelectTrigger>
              <SelectContent>
                {availableCuadrillas.map((cuadrilla) => (
                  <SelectItem 
                    key={cuadrilla.id} 
                    value={cuadrilla.id}
                    disabled={cuadrilla.hasConflict}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{cuadrilla.nombre}</span>
                      <div className="flex items-center gap-1 ml-2">
                        <Badge variant="outline" className="text-xs">
                          {cuadrilla.miembros?.length || 0} miembros
                        </Badge>
                        {cuadrilla.hasConflict && (
                          <AlertTriangle className="w-3 h-3 text-orange-500" />
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Crear Nueva Cuadrilla</DialogTitle>
              </DialogHeader>
              <CreateCuadrillaFormWizard
                onSubmit={handleCuadrillaCreated}
                onCancel={() => setShowCreateDialog(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Validation and conflict alerts */}
        {selectedCuadrillaId && fechaInmersion && conflictValidation && (
          <div className="space-y-2">
            {!conflictValidation.isAvailable ? (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Conflicto de horario:</strong> Esta cuadrilla ya está asignada a la inmersión{' '}
                  <span className="font-mono">{conflictValidation.conflictingInmersionCodigo}</span>{' '}
                  en la fecha {new Date(fechaInmersion).toLocaleDateString('es-CL')}.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  La cuadrilla está disponible para la fecha seleccionada.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Selected cuadrilla details */}
        {selectedCuadrilla && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              Cuadrilla Seleccionada: {selectedCuadrilla.nombre}
            </h4>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {selectedCuadrilla.miembros?.map((miembro) => (
                  <Badge key={miembro.id} variant="outline" className="text-xs">
                    {miembro.nombre_completo} - {miembro.rol}
                  </Badge>
                ))}
              </div>
              
              {selectedCuadrilla.asignaciones_activas && selectedCuadrilla.asignaciones_activas.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-blue-800 mb-1">Otras asignaciones activas:</h5>
                  <div className="space-y-1">
                    {selectedCuadrilla.asignaciones_activas.map((asignacion, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-blue-700">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(asignacion.fecha).toLocaleDateString('es-CL')}</span>
                        <span>-</span>
                        <span className="font-mono">{asignacion.inmersion_codigo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {cuadrillas.length === 0 && (
          <Alert>
            <Users className="w-4 h-4" />
            <AlertDescription>
              No hay cuadrillas disponibles. Cree una nueva cuadrilla para continuar.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
