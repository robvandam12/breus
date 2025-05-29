
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Waves } from "lucide-react";
import { useInmersiones } from "@/hooks/useInmersiones";

interface BitacoraInmersionSelectorProps {
  onInmersionSelected: (inmersionId: string) => void;
  selectedInmersionId?: string;
}

export const BitacoraInmersionSelector = ({ onInmersionSelected, selectedInmersionId }: BitacoraInmersionSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { inmersiones, isLoading } = useInmersiones();

  // Filtrar solo inmersiones completadas para crear bitácoras
  const inmersionesCompletadas = inmersiones.filter(inmersion => 
    inmersion.estado === 'completada' &&
    (inmersion.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
     inmersion.objetivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
     inmersion.operacion_nombre?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Waves className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle>Seleccionar Inmersión</CardTitle>
            <p className="text-sm text-zinc-500">Elige la inmersión para crear la bitácora</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <Input
            placeholder="Buscar inmersiones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {inmersionesCompletadas.length === 0 ? (
          <div className="text-center py-8">
            <Waves className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">
              {searchTerm ? "No se encontraron inmersiones" : "No hay inmersiones completadas"}
            </h3>
            <p className="text-zinc-500">
              {searchTerm 
                ? "Intenta ajustar los términos de búsqueda" 
                : "No se encontraron inmersiones completadas disponibles para crear bitácoras"
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {inmersionesCompletadas.map((inmersion) => (
              <Card 
                key={inmersion.inmersion_id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedInmersionId === inmersion.inmersion_id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => onInmersionSelected(inmersion.inmersion_id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{inmersion.codigo}</h4>
                        <Badge variant="outline">
                          {inmersion.estado}
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-600 mb-1">
                        <strong>Operación:</strong> {inmersion.operacion_nombre || 'Sin nombre'}
                      </p>
                      <p className="text-sm text-zinc-600 mb-1">
                        <strong>Objetivo:</strong> {inmersion.objetivo}
                      </p>
                      <p className="text-sm text-zinc-600 mb-1">
                        <strong>Buzo Principal:</strong> {inmersion.buzo_principal}
                      </p>
                      <p className="text-sm text-zinc-600">
                        <strong>Fecha:</strong> {new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}
                      </p>
                    </div>
                    <div className="text-right text-sm text-zinc-500">
                      <p><strong>Prof. Máx:</strong> {inmersion.profundidad_max}m</p>
                      <p><strong>Supervisor:</strong> {inmersion.supervisor}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
  );
};
