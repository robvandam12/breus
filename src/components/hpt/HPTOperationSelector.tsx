
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Building } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useHPT } from "@/hooks/useHPT";
import { EnterpriseSelector } from "@/components/common/EnterpriseSelector";
import { EnterpriseSelectionResult } from "@/hooks/useEnterpriseContext";

interface HPTOperationSelectorProps {
  onOperacionSelected: (operacionId: string) => void;
  selectedOperacionId: string;
}

export const HPTOperationSelector = ({ 
  onOperacionSelected, 
  selectedOperacionId 
}: HPTOperationSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [enterpriseSelection, setEnterpriseSelection] = useState<EnterpriseSelectionResult | null>(null);
  
  const { operaciones } = useOperaciones();
  const { hpts } = useHPT();

  // Filtrar operaciones por contexto empresarial
  const contextFilteredOperaciones = operaciones.filter(op => {
    if (!enterpriseSelection) return true;
    
    const matchesSalmonera = op.salmonera_id === enterpriseSelection.salmonera_id;
    const matchesContratista = enterpriseSelection.contratista_id ? 
      op.contratista_id === enterpriseSelection.contratista_id : true;
    
    return matchesSalmonera && matchesContratista;
  });

  // Filtrar operaciones disponibles (sin HPT ya creado)
  const availableOperaciones = contextFilteredOperaciones.filter(op => 
    !hpts.some(hpt => hpt.operacion_id === op.id)
  );

  // Aplicar búsqueda
  const filteredOperaciones = availableOperaciones.filter(op =>
    op.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOperation = (operacionId: string) => {
    onOperacionSelected(operacionId);
  };

  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Seleccionar Operación para HPT
        </CardTitle>
      </CardHeader>

      <div className="space-y-4">
        <EnterpriseSelector
          onSelectionChange={setEnterpriseSelection}
          showCard={false}
          title="Contexto Empresarial"
          description="Filtre operaciones por contexto empresarial"
        />

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar operaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {enterpriseSelection && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Contexto Seleccionado:</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="outline">
                <Building className="w-3 h-3 mr-1" />
                Salmonera: {enterpriseSelection.salmonera_id}
              </Badge>
              {enterpriseSelection.contratista_id && (
                <Badge variant="outline">
                  <Building className="w-3 h-3 mr-1" />
                  Contratista: {enterpriseSelection.contratista_id}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="grid gap-3 max-h-96 overflow-y-auto">
          {filteredOperaciones.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-muted-foreground mb-2">
                  {availableOperaciones.length === 0 ? 
                    "No hay operaciones disponibles" : 
                    "No se encontraron operaciones"
                  }
                </h3>
                <p className="text-sm text-muted-foreground">
                  {availableOperaciones.length === 0 ? 
                    "Todas las operaciones ya tienen HPT asociado o no hay operaciones creadas." :
                    "Intenta ajustar los filtros de búsqueda."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOperaciones.map((operacion) => (
              <Card 
                key={operacion.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedOperacionId === operacion.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleSelectOperation(operacion.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{operacion.codigo}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {operacion.nombre}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>Inicio: {new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}</span>
                        {operacion.fecha_fin && (
                          <span>• Fin: {new Date(operacion.fecha_fin).toLocaleDateString('es-CL')}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-2">
                        {operacion.estado}
                      </Badge>
                      {selectedOperacionId === operacion.id && (
                        <div className="text-xs text-blue-600 font-medium">
                          Seleccionado
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {filteredOperaciones.length > 0 && selectedOperacionId && (
          <div className="flex justify-end pt-4">
            <Button 
              onClick={() => onOperacionSelected(selectedOperacionId)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continuar con HPT
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
