
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, UserCheck, UserX, Edit, Trash2, Shield } from "lucide-react";

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
        <Button onClick={onCreateEquipo} size="sm" className="bg-blue-600 hover:bg-blue-700 h-9 px-4">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Equipo
        </Button>
      </div>

      {equipos.length === 0 ? (
        <Card className="text-center py-12 border-dashed border-2 border-gray-200">
          <CardContent>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No hay equipos de buceo
            </h4>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Crea el primer equipo de buceo para esta operación y comienza a asignar personal especializado
            </p>
            <Button onClick={onCreateEquipo} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Equipo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {equipos.map((equipo) => (
            <Card key={equipo.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-base mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      {equipo.nombre}
                    </CardTitle>
                    <Badge 
                      variant={equipo.activo ? "default" : "secondary"} 
                      className={`text-xs ${equipo.activo ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {equipo.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEditEquipo(equipo.id)}
                      className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDeleteEquipo(equipo.id)}
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {equipo.descripcion && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{equipo.descripcion}</p>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Miembros</span>
                    </div>
                    <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs">
                      {equipo.miembros?.length || 0}
                    </span>
                  </div>
                  
                  {equipo.miembros && equipo.miembros.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {equipo.miembros.slice(0, 2).map((miembro: any, index: number) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            {miembro.rol_equipo}
                          </Badge>
                        ))}
                        {equipo.miembros.length > 2 && (
                          <Badge 
                            variant="outline" 
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                          >
                            +{equipo.miembros.length - 2} más
                          </Badge>
                        )}
                      </div>
                      
                      {/* Indicador de estado del equipo */}
                      <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                        {equipo.miembros.some((m: any) => m.rol_equipo === 'supervisor') ? (
                          <div className="flex items-center gap-1">
                            <UserCheck className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-600 font-medium">Supervisor asignado</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <UserX className="w-3 h-3 text-orange-500" />
                            <span className="text-xs text-orange-600 font-medium">Falta supervisor</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(!equipo.miembros || equipo.miembros.length === 0) && (
                    <div className="text-center py-4 bg-gray-50 rounded-lg border-dashed border-2 border-gray-200">
                      <Users className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Sin miembros asignados</p>
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
