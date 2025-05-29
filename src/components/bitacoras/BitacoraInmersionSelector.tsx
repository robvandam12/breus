
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Waves, Calendar, User, MapPin } from "lucide-react";
import { useInmersiones } from "@/hooks/useInmersiones";
import { useOperaciones } from "@/hooks/useOperaciones";

interface BitacoraInmersionSelectorProps {
  onInmersionSelected: (inmersionId: string) => void;
  selectedInmersionId?: string;
}

export const BitacoraInmersionSelector = ({ onInmersionSelected, selectedInmersionId }: BitacoraInmersionSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { inmersiones, isLoading } = useInmersiones();
  const { operaciones } = useOperaciones();

  // Filtrar inmersiones completadas para crear bitácoras
  const inmersionesCompletadas = inmersiones.filter(inmersion => 
    inmersion.estado === 'completada' &&
    (inmersion.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
     inmersion.objetivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
     inmersion.buzo_principal.toLowerCase().includes(searchTerm.toLowerCase()) ||
     inmersion.supervisor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getOperacionData = (operacionId: string) => {
    return operaciones.find(op => op.id === operacionId);
  };

  const handleSelectInmersion = (inmersionId: string) => {
    console.log('Selecting inmersion:', inmersionId);
    onInmersionSelected(inmersionId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600">Cargando inmersiones...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Waves className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>Seleccionar Inmersión</CardTitle>
              <p className="text-sm text-zinc-500">Elige la inmersión completada para crear la bitácora</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <Input
              placeholder="Buscar por código, objetivo, buzo o supervisor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {inmersionesCompletadas.length === 0 ? (
            <div className="text-center py-12">
              <Waves className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-zinc-900 mb-2">
                No hay inmersiones completadas
              </h3>
              <p className="text-zinc-500">
                {inmersiones.length === 0 
                  ? "No se encontraron inmersiones en el sistema"
                  : searchTerm
                    ? "No se encontraron inmersiones que coincidan con la búsqueda"
                    : "No hay inmersiones completadas disponibles para crear bitácoras"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {inmersionesCompletadas.map((inmersion) => {
                const operacion = getOperacionData(inmersion.operacion_id);
                const isSelected = selectedInmersionId === inmersion.inmersion_id;
                
                return (
                  <Card 
                    key={inmersion.inmersion_id}
                    className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSelectInmersion(inmersion.inmersion_id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-lg">{inmersion.codigo}</h4>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {inmersion.estado}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span><strong>Fecha:</strong> {new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-green-500" />
                              <span><strong>Buzo Principal:</strong> {inmersion.buzo_principal}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-purple-500" />
                              <span><strong>Supervisor:</strong> {inmersion.supervisor}</span>
                            </div>
                            
                            {operacion && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-red-500" />
                                <span><strong>Operación:</strong> {operacion.codigo} - {operacion.nombre}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              <strong>Objetivo:</strong> {inmersion.objetivo}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-xs text-gray-500 mt-2 pt-2 border-t">
                            <div><strong>Prof. Máx:</strong> {inmersion.profundidad_max}m</div>
                            <div><strong>Temp:</strong> {inmersion.temperatura_agua}°C</div>
                            <div><strong>Visibilidad:</strong> {inmersion.visibilidad}m</div>
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          <Button 
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectInmersion(inmersion.inmersion_id);
                            }}
                          >
                            {isSelected ? "Seleccionada" : "Seleccionar"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {selectedInmersionId && (
            <div className="flex justify-end pt-4 border-t">
              <Button 
                onClick={() => onInmersionSelected(selectedInmersionId)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continuar con Inmersión Seleccionada
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
