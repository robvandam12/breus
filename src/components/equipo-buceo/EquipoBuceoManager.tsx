
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Edit, Trash2, UserPlus } from "lucide-react";
import { EquipoBuceo } from "@/hooks/useEquiposBuceo";

interface EquipoBuceoManagerProps {
  equipos: EquipoBuceo[];
  onUpdate: (id: string, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const EquipoBuceoManager = ({ equipos, onUpdate, onDelete }: EquipoBuceoManagerProps) => {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {equipos.length}
          </div>
          <div className="text-sm text-gray-500">Total Equipos</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {equipos.filter(e => e.activo).length}
          </div>
          <div className="text-sm text-gray-500">Equipos Activos</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {equipos.reduce((acc, e) => acc + (e.miembros?.length || 0), 0)}
          </div>
          <div className="text-sm text-gray-500">Total Miembros</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-orange-600">
            {equipos.filter(e => e.tipo_empresa === 'salmonera').length}
          </div>
          <div className="text-sm text-gray-500">Equipos Salmonera</div>
        </Card>
      </div>

      {/* Teams List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipos.map((equipo) => (
          <Card key={equipo.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{equipo.nombre}</CardTitle>
                    <p className="text-sm text-gray-600">{equipo.descripcion}</p>
                  </div>
                </div>
                <Badge variant={equipo.activo ? "default" : "secondary"}>
                  {equipo.activo ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Miembros</span>
                  <span className="font-medium">{equipo.miembros?.length || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tipo</span>
                  <Badge variant="outline">{equipo.tipo_empresa}</Badge>
                </div>

                {/* Members List */}
                {equipo.miembros && equipo.miembros.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Miembros:</p>
                    <div className="space-y-1">
                      {equipo.miembros.map((miembro) => (
                        <div key={miembro.id} className="flex items-center justify-between text-xs">
                          <span>{miembro.usuario?.nombre} {miembro.usuario?.apellido}</span>
                          <Badge variant="outline" className="text-xs">
                            {miembro.rol_equipo}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Agregar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDelete(equipo.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {equipos.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay equipos de buceo</h3>
            <p className="text-gray-500">Comience creando el primer equipo de buceo</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
