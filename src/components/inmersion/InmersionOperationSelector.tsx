
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Building, MapPin, Calendar, Users, AlertTriangle } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";

interface InmersionOperationSelectorProps {
  onOperacionSelected: (operacionId: string) => void;
  selectedOperacionId?: string;
}

export const InmersionOperationSelector = ({ 
  onOperacionSelected, 
  selectedOperacionId 
}: InmersionOperationSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { operaciones, isLoading } = useOperaciones();
  const { equipos } = useEquiposBuceoEnhanced();

  const filteredOperaciones = operaciones.filter(op => {
    const matchesSearch = op.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch && op.estado === 'activa';
  });

  const getOperacionTeam = (operacionId: string) => {
    const operacion = operaciones.find(op => op.id === operacionId);
    if (!operacion?.equipo_buceo_id) return null;
    
    return equipos.find(eq => eq.id === operacion.equipo_buceo_id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Seleccionar Operación</h2>
        <p className="mt-2 text-gray-600">
          Elija la operación para la cual desea crear la inmersión
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar operaciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredOperaciones.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay operaciones disponibles
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? "No se encontraron operaciones que coincidan con la búsqueda"
                : "No hay operaciones activas disponibles"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
          {filteredOperaciones.map((operacion) => {
            const team = getOperacionTeam(operacion.id);
            const isSelected = selectedOperacionId === operacion.id;
            
            return (
              <Card 
                key={operacion.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => onOperacionSelected(operacion.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {operacion.codigo}
                        </h3>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {operacion.estado}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{operacion.nombre}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {operacion.salmoneras && (
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{operacion.salmoneras.nombre}</span>
                          </div>
                        )}
                        
                        {operacion.sitios && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{operacion.sitios.nombre}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}
                          </span>
                        </div>
                        
                        {team && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {team.miembros?.length || 0} miembros
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {!team && (
                        <div className="mt-2 flex items-center gap-2 text-amber-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm">Sin equipo asignado</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      className="ml-4"
                    >
                      {isSelected ? "Seleccionado" : "Seleccionar"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
