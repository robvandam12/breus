
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, AlertCircle, Building } from "lucide-react";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useHPT } from "@/hooks/useHPT";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";
import { useQueryClient } from '@tanstack/react-query';
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OperacionTeamManagerEnhancedProps {
  operacionId: string;
  salmoneraId?: string;
  contratistaId?: string;
}

export const OperacionTeamManagerEnhanced = ({ 
  operacionId, 
  salmoneraId, 
  contratistaId 
}: OperacionTeamManagerEnhancedProps) => {
  const [selectedEquipoId, setSelectedEquipoId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  
  const queryClient = useQueryClient();
  const { equipos, isLoading: equiposLoading } = useEquiposBuceoEnhanced();
  const { operaciones, updateOperacion, isLoading: operacionesLoading } = useOperaciones();
  const { hpts } = useHPT();
  const { anexosBravo } = useAnexoBravo();

  const operacion = operaciones.find(op => op.id === operacionId);
  const currentEquipo = operacion?.equipo_buceo_id 
    ? equipos.find(e => e.id === operacion.equipo_buceo_id)
    : null;

  // Filtrar equipos disponibles (los equipos no tienen salmonera_id y contratista_id directamente)
  const equiposDisponibles = equipos.filter(equipo => {
    // Para ahora, mostrar todos los equipos disponibles
    // En el futuro, se puede implementar filtrado por empresa
    const isAvailable = !equipo.activo || equipo.activo === true;
    const isNotCurrentlyAssigned = equipo.id === operacion?.equipo_buceo_id;
    
    return (isAvailable || isNotCurrentlyAssigned);
  });

  useEffect(() => {
    if (operacion?.equipo_buceo_id) {
      setSelectedEquipoId(operacion.equipo_buceo_id);
    }
  }, [operacion?.equipo_buceo_id]);

  const handleAssignTeam = async () => {
    if (!selectedEquipoId || !operacion) return;
    
    setIsAssigning(true);
    try {
      await updateOperacion({
        id: operacionId,
        data: { equipo_buceo_id: selectedEquipoId }
      });

      // Invalidar queries relacionadas con documentos para actualizar estado inmediatamente
      await queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      await queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      await queryClient.invalidateQueries({ queryKey: ['hpts'] });
      await queryClient.invalidateQueries({ queryKey: ['anexos-bravo'] });

      toast({
        title: "Personal de buceo asignado",
        description: "El personal de buceo ha sido asignado exitosamente a la operación.",
      });
    } catch (error) {
      console.error('Error assigning team:', error);
      toast({
        title: "Error",
        description: "No se pudo asignar el personal de buceo.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveTeam = async () => {
    if (!operacion) return;
    
    setIsAssigning(true);
    try {
      await updateOperacion({
        id: operacionId,
        data: { equipo_buceo_id: null }
      });

      // Invalidar queries relacionadas
      await queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      await queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      await queryClient.invalidateQueries({ queryKey: ['hpts'] });
      await queryClient.invalidateQueries({ queryKey: ['anexos-bravo'] });

      setSelectedEquipoId('');
      toast({
        title: "Personal de buceo removido",
        description: "El personal de buceo ha sido removido de la operación.",
      });
    } catch (error) {
      console.error('Error removing team:', error);
      toast({
        title: "Error",
        description: "No se pudo remover el personal de buceo.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  // Contar documentos existentes
  const existingHPTs = hpts.filter(hpt => hpt.operacion_id === operacionId).length;
  const existingAnexos = anexosBravo.filter(anexo => anexo.operacion_id === operacionId).length;

  if (equiposLoading || operacionesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Gestión de Personal de Buceo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
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
          Gestión de Personal de Buceo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estado actual */}
        {currentEquipo ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-green-600" />
                <div>
                  <h3 className="font-medium text-green-800">{currentEquipo.nombre}</h3>
                  <p className="text-sm text-green-600">
                    {currentEquipo.miembros?.length || 0} miembros asignados
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-700">
                Personal Asignado
              </Badge>
            </div>
            
            {/* Miembros del equipo */}
            <div className="mt-3 space-y-2">
              <h4 className="text-sm font-medium text-green-700">Miembros:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentEquipo.miembros?.map((miembro, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="text-xs">
                      {(miembro as any).rol || 'Miembro'}
                    </Badge>
                    <span className="text-green-700">
                      {(miembro as any).nombre_completo || 
                       ((miembro as any).usuario?.nombre && (miembro as any).usuario?.apellido 
                         ? `${(miembro as any).usuario.nombre} ${(miembro as any).usuario.apellido}` 
                         : 'Sin nombre')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documentos creados */}
            {(existingHPTs > 0 || existingAnexos > 0) && (
              <Alert className="mt-3 border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-yellow-800">
                  <strong>Documentos existentes:</strong> {existingHPTs} HPT(s) y {existingAnexos} Anexo(s) Bravo creados con este personal.
                </AlertDescription>
              </Alert>
            )}

            <Button 
              variant="outline" 
              onClick={handleRemoveTeam}
              disabled={isAssigning}
              className="mt-3 text-red-600 hover:text-red-700"
            >
              {isAssigning ? 'Removiendo...' : 'Remover Personal de Buceo'}
            </Button>
          </div>
        ) : (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-yellow-800">
              <strong>Sin personal asignado:</strong> Asigne personal de buceo para poder crear documentos HPT y Anexo Bravo.
            </AlertDescription>
          </Alert>
        )}

        {/* Selector de equipo */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Seleccionar Personal de Buceo
            </label>
            <Select value={selectedEquipoId} onValueChange={setSelectedEquipoId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione personal de buceo disponible..." />
              </SelectTrigger>
              <SelectContent>
                {equiposDisponibles.map((equipo) => (
                  <SelectItem key={equipo.id} value={equipo.id}>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{equipo.nombre}</div>
                        <div className="text-xs text-gray-500">
                          {equipo.miembros?.length || 0} miembros - {equipo.activo ? 'Activo' : 'Inactivo'}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {equiposDisponibles.length === 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">
                No hay personal de buceo disponible que coincida con los criterios de la operación.
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleAssignTeam}
            disabled={!selectedEquipoId || isAssigning || selectedEquipoId === currentEquipo?.id}
            className="w-full"
          >
            {isAssigning ? 'Asignando...' : 'Asignar Personal de Buceo'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
