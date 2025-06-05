
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, UserCheck, UserX, Edit, Trash2 } from "lucide-react";

interface EquipoBuceoTabImprovedProps {
  equipos: any[];
  onCreateEquipo: () => void;
  onEditEquipo: (id: string) => void;
  onDeleteEquipo: (id: string) => void;
}

export const EquipoBuceoTabImproved = ({ 
  equipos, 
  onCreateEquipo, 
  onEditEquipo, 
  onDeleteEquipo 
}: EquipoBuceoTabImprovedProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Equipos de Buceo</h3>
          <p className="text-sm text-gray-600">
            Gestiona los equipos de buceo asignados a esta operación
          </p>
        </div>
        <Button onClick={onCreateEquipo} size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Equipo
        </Button>
      </div>

      {equipos.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No hay equipos de buceo
            </h4>
            <p className="text-gray-500 mb-4">
              Crea el primer equipo de buceo para esta operación
            </p>
            <Button onClick={onCreateEquipo} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Crear Equipo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipos.map((equipo) => (
            <Card key={equipo.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{equipo.nombre}</CardTitle>
                    <Badge variant={equipo.activo ? "default" : "secondary"} className="mt-1">
                      {equipo.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEditEquipo(equipo.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDeleteEquipo(equipo.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {equipo.descripcion && (
                  <p className="text-sm text-gray-600 mb-3">{equipo.descripcion}</p>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Miembros:</span>
                    <span className="font-medium">
                      {equipo.miembros?.length || 0}
                    </span>
                  </div>
                  
                  {equipo.miembros && equipo.miembros.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {equipo.miembros.slice(0, 3).map((miembro: any, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {miembro.rol_equipo}
                        </Badge>
                      ))}
                      {equipo.miembros.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{equipo.miembros.length - 3} más
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
