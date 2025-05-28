
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, MapPin, Building, Users } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";

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

  const filteredOperaciones = operaciones.filter(op => 
    op.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.sitios?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'activa':
        return 'bg-green-100 text-green-800';
      case 'completada':
        return 'bg-blue-100 text-blue-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando operaciones...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Seleccionar Operación</h2>
        <p className="mt-2 text-gray-600">
          Seleccione la operación para la cual desea crear la inmersión
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Operaciones</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nombre, código o sitio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 ios-input"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredOperaciones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {operaciones.length === 0 
                ? "No hay operaciones disponibles" 
                : "No se encontraron operaciones que coincidan con la búsqueda"}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredOperaciones.map((operacion) => (
                <Card 
                  key={operacion.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedOperacionId === operacion.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onOperacionSelected(operacion.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{operacion.codigo}</h3>
                          <Badge className={getEstadoBadgeColor(operacion.estado)}>
                            {operacion.estado}
                          </Badge>
                        </div>
                        
                        <h4 className="text-gray-900 mb-3">{operacion.nombre}</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          {operacion.sitios && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">{operacion.sitios.nombre}</span>
                            </div>
                          )}
                          
                          {operacion.salmoneras && (
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">{operacion.salmoneras.nombre}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {new Date(operacion.fecha_inicio).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        {operacion.equipo_buceo_id && (
                          <div className="flex items-center gap-2 mt-2">
                            <Users className="w-4 h-4 text-green-500" />
                            <span className="text-green-600 text-sm">Equipo asignado</span>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onOperacionSelected(operacion.id);
                        }}
                        className="ml-4"
                        variant={selectedOperacionId === operacion.id ? "default" : "outline"}
                      >
                        {selectedOperacionId === operacion.id ? "Seleccionado" : "Seleccionar"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
