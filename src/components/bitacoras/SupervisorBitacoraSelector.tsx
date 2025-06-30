
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Clock, User, CheckCircle, AlertCircle } from "lucide-react";
import { useBitacorasBuzo } from "@/hooks/useBitacorasBuzo";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SupervisorBitacoraSelectorProps {
  onSelect: (bitacoraSupervisorId: string) => void;
  onCancel: () => void;
}

export const SupervisorBitacoraSelector = ({ onSelect, onCancel }: SupervisorBitacoraSelectorProps) => {
  const { profile } = useAuth();
  const { getAvailableSupervisorBitacoras } = useBitacorasBuzo();
  const [availableBitacoras, setAvailableBitacoras] = useState<any[]>([]);
  const [selectedBitacora, setSelectedBitacora] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      loadAvailableBitacoras();
    }
  }, [profile]);

  const loadAvailableBitacoras = async () => {
    if (!profile?.id) return;
    
    try {
      setLoading(true);
      const bitacoras = await getAvailableSupervisorBitacoras(profile.id);
      setAvailableBitacoras(bitacoras);
    } catch (error) {
      console.error('Error loading available bitacoras:', error);
      setAvailableBitacoras([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = () => {
    if (selectedBitacora) {
      onSelect(selectedBitacora);
    }
  };

  const selectedBitacoraData = availableBitacoras.find(b => b.bitacora_id === selectedBitacora);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Seleccionar Bitácora de Supervisor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando bitácoras disponibles...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Seleccionar Bitácora de Supervisor
        </CardTitle>
        <p className="text-sm text-gray-600">
          Seleccione la bitácora de supervisor de la cual desea crear su bitácora personal de buzo
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {availableBitacoras.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay bitácoras disponibles
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              No existen bitácoras de supervisor firmadas donde usted aparezca como miembro de la cuadrilla 
              y que no tengan ya una bitácora de buzo asociada.
            </p>
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="mt-4"
            >
              Volver
            </Button>
          </div>
        ) : (
          <>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Bitácora de Supervisor Disponible
              </label>
              <Select value={selectedBitacora} onValueChange={setSelectedBitacora}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar bitácora de supervisor..." />
                </SelectTrigger>
                <SelectContent>
                  {availableBitacoras.map((bitacora) => (
                    <SelectItem key={bitacora.bitacora_id} value={bitacora.bitacora_id}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{bitacora.codigo}</Badge>
                        <span>{bitacora.inmersion?.codigo} - {format(new Date(bitacora.fecha), 'dd/MM/yyyy', { locale: es })}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedBitacoraData && (
              <Card className="border border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Firmada
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {format(new Date(selectedBitacoraData.fecha), 'dd MMMM yyyy', { locale: es })}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedBitacoraData.codigo}</h4>
                    <p className="text-sm text-gray-600">
                      Inmersión: {selectedBitacoraData.inmersion?.codigo}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>Supervisor: {selectedBitacoraData.supervisor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Objetivo: {selectedBitacoraData.inmersion?.objetivo}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">
                      <strong>Desarrollo:</strong> {selectedBitacoraData.desarrollo_inmersion?.substring(0, 100)}
                      {selectedBitacoraData.desarrollo_inmersion?.length > 100 && '...'}
                    </p>
                  </div>

                  {/* Mostrar datos específicos del buzo si están disponibles */}
                  {selectedBitacoraData.datos_cuadrilla && (
                    <div className="pt-2 border-t">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Sus datos en esta inmersión:</h5>
                      {(() => {
                        let cuadrillaData = [];
                        if (typeof selectedBitacoraData.datos_cuadrilla === 'string') {
                          try {
                            cuadrillaData = JSON.parse(selectedBitacoraData.datos_cuadrilla);
                          } catch {
                            cuadrillaData = [];
                          }
                        } else if (Array.isArray(selectedBitacoraData.datos_cuadrilla)) {
                          cuadrillaData = selectedBitacoraData.datos_cuadrilla;
                        }

                        const misDatos = cuadrillaData.find(
                          (member: any) => member.usuario_id === profile?.id
                        );
                        
                        if (misDatos) {
                          return (
                            <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded">
                              <span>Rol: {misDatos.rol}</span>
                              <span>Profundidad: {misDatos.profundidad_maxima}m</span>
                              <span>Entrada: {misDatos.hora_entrada}</span>
                              <span>Salida: {misDatos.hora_salida}</span>
                            </div>
                          );
                        }
                        return (
                          <p className="text-xs text-amber-600">
                            No se encontraron datos específicos para usted en esta bitácora.
                          </p>
                        );
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSelect}
                disabled={!selectedBitacora}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Crear Bitácora de Buzo
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
