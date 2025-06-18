
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle } from "lucide-react";
import { useSitios } from '@/hooks/useSitios';
import { useOperaciones } from '@/hooks/useOperaciones';
import { toast } from '@/hooks/use-toast';

interface OperacionSitioAssignmentProps {
  operacionId: string;
  currentSitioId?: string;
  onComplete: (sitioId: string) => void;
}

export const OperacionSitioAssignment = ({
  operacionId,
  currentSitioId,
  onComplete
}: OperacionSitioAssignmentProps) => {
  const [selectedSitioId, setSelectedSitioId] = useState(currentSitioId || '');
  const { sitios } = useSitios();
  const { assignSitio } = useOperaciones();

  const handleSave = async () => {
    if (!selectedSitioId) {
      toast({
        title: "Sitio requerido",
        description: "Debe seleccionar un sitio para la operación",
        variant: "destructive"
      });
      return;
    }

    try {
      await assignSitio(operacionId, selectedSitioId);
      onComplete(selectedSitioId);
    } catch (error) {
      console.error('Error assigning sitio:', error);
      toast({
        title: "Error",
        description: "No se pudo asignar el sitio",
        variant: "destructive"
      });
    }
  };

  const selectedSitio = sitios?.find(s => s.id === selectedSitioId);
  const isCompleted = !!currentSitioId;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Asignación de Sitio
          {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isCompleted && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">✓ Sitio asignado correctamente</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Sitio de Trabajo</Label>
            <Select value={selectedSitioId} onValueChange={setSelectedSitioId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar sitio" />
              </SelectTrigger>
              <SelectContent>
                {sitios?.map((sitio) => (
                  <SelectItem key={sitio.id} value={sitio.id}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <span className="font-medium">{sitio.nombre}</span>
                        <span className="text-sm text-gray-600 ml-2">({sitio.codigo})</span>
                      </div>
                      <Badge variant="outline">{sitio.estado}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSitio && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium mb-2">Información del Sitio</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Ubicación:</span>
                  <p>{selectedSitio.ubicacion}</p>
                </div>
                <div>
                  <span className="font-medium">Región:</span>
                  <p>{selectedSitio.region || 'No especificada'}</p>
                </div>
                <div>
                  <span className="font-medium">Profundidad máxima:</span>
                  <p>{selectedSitio.profundidad_maxima || 'No especificada'} m</p>
                </div>
                <div>
                  <span className="font-medium">Capacidad jaulas:</span>
                  <p>{selectedSitio.capacidad_jaulas || 'No especificada'}</p>
                </div>
                {selectedSitio.coordenadas_lat && selectedSitio.coordenadas_lng && (
                  <div className="col-span-2">
                    <span className="font-medium">Coordenadas:</span>
                    <p>{selectedSitio.coordenadas_lat}, {selectedSitio.coordenadas_lng}</p>
                  </div>
                )}
                {selectedSitio.observaciones && (
                  <div className="col-span-2">
                    <span className="font-medium">Observaciones:</span>
                    <p>{selectedSitio.observaciones}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave}
            disabled={!selectedSitioId}
          >
            {isCompleted ? 'Actualizar Sitio' : 'Asignar Sitio'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
