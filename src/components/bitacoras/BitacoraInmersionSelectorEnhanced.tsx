
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Users, Building, MapPin, Anchor } from "lucide-react";
import { useInmersionesData } from "@/hooks/useInmersionesData";
import { InmersionCompleta } from "@/types/bitacoras";

interface InmersionData {
  inmersion_id: string;
  codigo: string;
  fecha_inmersion: string;
  objetivo: string;
  supervisor: string;
  buzo_principal: string;
  hora_inicio: string;
  hora_fin?: string;
  operacion: any;
  equipo_buceo_id?: string;
}

interface BitacoraInmersionSelectorEnhancedProps {
  onInmersionSelected: (inmersion: InmersionData) => void;
  selectedInmersionId?: string;
  title?: string;
  description?: string;
}

export const BitacoraInmersionSelectorEnhanced = ({ 
  onInmersionSelected, 
  selectedInmersionId,
  title = "Seleccionar Inmersión para Bitácora",
  description = "Seleccione la inmersión para la cual desea crear la bitácora"
}: BitacoraInmersionSelectorEnhancedProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { inmersiones, loadingInmersiones } = useInmersionesData();

  const filteredInmersiones = (inmersiones as InmersionCompleta[]).filter(inmersion =>
    inmersion.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inmersion.objetivo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inmersion.supervisor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inmersion.operacion?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (inmersion: InmersionCompleta) => {
    const inmersionData: InmersionData = {
      inmersion_id: inmersion.inmersion_id,
      codigo: inmersion.codigo,
      fecha_inmersion: inmersion.fecha_inmersion,
      objetivo: inmersion.objetivo,
      supervisor: inmersion.supervisor,
      buzo_principal: inmersion.buzo_principal,
      hora_inicio: inmersion.hora_inicio,
      hora_fin: inmersion.hora_fin,
      operacion: inmersion.operacion,
      equipo_buceo_id: inmersion.operacion?.equipo_buceo_id
    };
    onInmersionSelected(inmersionData);
  };

  if (loadingInmersiones) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Cargando inmersiones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar por código, objetivo, supervisor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredInmersiones.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Anchor className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {inmersiones.length === 0 ? "No hay inmersiones disponibles" : "No se encontraron resultados"}
            </h3>
            <p className="text-gray-500">
              {inmersiones.length === 0 
                ? "Primero debe crear inmersiones antes de poder crear bitácoras"
                : "Intente ajustar los términos de búsqueda"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
          {filteredInmersiones.map((inmersion) => (
            <Card 
              key={inmersion.inmersion_id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedInmersionId === inmersion.inmersion_id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleSelect(inmersion)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Anchor className="w-4 h-4 text-blue-600" />
                    {inmersion.codigo}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-900">{inmersion.objetivo}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span><strong>Supervisor:</strong> {inmersion.supervisor}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span><strong>Buzo:</strong> {inmersion.buzo_principal}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span><strong>Horario:</strong> {inmersion.hora_inicio} - {inmersion.hora_fin || 'En curso'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      <span><strong>Operación:</strong> {inmersion.operacion?.nombre || 'Sin operación'}</span>
                    </div>
                  </div>

                  {inmersion.operacion?.equipo_buceo_id && (
                    <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                      <div className="flex items-center gap-1 text-xs text-green-700">
                        <Users className="w-3 h-3" />
                        <span><strong>Equipo de Buceo ID:</strong> {inmersion.operacion.equipo_buceo_id}</span>
                      </div>
                    </div>
                  )}

                  {inmersion.operacion?.salmoneras?.nombre && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span><strong>Empresa:</strong> {inmersion.operacion.salmoneras.nombre}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(inmersion);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Seleccionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
