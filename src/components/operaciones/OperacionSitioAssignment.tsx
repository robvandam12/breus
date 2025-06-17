
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, CheckCircle2, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface OperacionSitioAssignmentProps {
  operacionId: string;
  currentSitioId?: string;
  onComplete: (sitioId: string) => void;
}

export const OperacionSitioAssignment = ({ operacionId, currentSitioId, onComplete }: OperacionSitioAssignmentProps) => {
  const [selectedSitio, setSelectedSitio] = useState(currentSitioId || '');
  const [isAssigning, setIsAssigning] = useState(false);

  const { data: sitios = [], isLoading } = useQuery({
    queryKey: ['sitios-disponibles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sitios')
        .select('*')
        .eq('estado', 'activo')
        .order('nombre');
      
      if (error) throw error;
      return data;
    }
  });

  const handleAssignSitio = async () => {
    if (!selectedSitio) {
      toast({
        title: "Error",
        description: "Debe seleccionar un sitio",
        variant: "destructive"
      });
      return;
    }

    setIsAssigning(true);
    try {
      const { error } = await supabase
        .from('operacion')
        .update({ sitio_id: selectedSitio })
        .eq('id', operacionId);

      if (error) throw error;

      toast({
        title: "Sitio asignado",
        description: "El sitio ha sido asignado exitosamente a la operación"
      });

      onComplete(selectedSitio);
    } catch (error) {
      console.error('Error assigning sitio:', error);
      toast({
        title: "Error",
        description: "No se pudo asignar el sitio",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Asignar Sitio de Trabajo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentSitioId && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800">Sitio ya asignado</span>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Seleccionar Sitio</label>
          <Select value={selectedSitio} onValueChange={setSelectedSitio} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un sitio..." />
            </SelectTrigger>
            <SelectContent>
              {sitios.map((sitio) => (
                <SelectItem key={sitio.id} value={sitio.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{sitio.nombre}</span>
                    <span className="text-xs text-gray-500">{sitio.codigo} - {sitio.ubicacion}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedSitio && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Información del Sitio</h4>
            {(() => {
              const sitio = sitios.find(s => s.id === selectedSitio);
              return sitio ? (
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Código:</strong> {sitio.codigo}</p>
                  <p><strong>Ubicación:</strong> {sitio.ubicacion}</p>
                  <p><strong>Profundidad máxima:</strong> {sitio.profundidad_maxima}m</p>
                  {sitio.capacidad_jaulas && (
                    <p><strong>Capacidad jaulas:</strong> {sitio.capacidad_jaulas}</p>
                  )}
                </div>
              ) : null;
            })()}
          </div>
        )}

        <Button 
          onClick={handleAssignSitio} 
          disabled={!selectedSitio || isAssigning}
          className="w-full"
        >
          {isAssigning ? 'Asignando...' : currentSitioId ? 'Cambiar Sitio' : 'Asignar Sitio'}
        </Button>
      </CardContent>
    </Card>
  );
};
