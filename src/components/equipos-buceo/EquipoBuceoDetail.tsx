
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Users, Building2, Calendar, Phone, Mail } from "lucide-react";

interface EquipoBuceoDetailProps {
  equipo: any;
  onClose: () => void;
}

export const EquipoBuceoDetail: React.FC<EquipoBuceoDetailProps> = ({
  equipo,
  onClose
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {equipo.nombre}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <Badge variant={equipo.activo ? 'default' : 'secondary'}>
                  {equipo.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipo</p>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span className="capitalize">{equipo.tipo_empresa}</span>
                </div>
              </div>
            </div>

            {equipo.descripcion && (
              <div>
                <p className="text-sm text-gray-500">Descripción</p>
                <p className="text-sm">{equipo.descripcion}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500">Creado</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(equipo.created_at).toLocaleDateString('es-CL')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Miembros del Equipo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Miembros del Equipo ({equipo.miembros?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!equipo.miembros || equipo.miembros.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay miembros asignados</p>
                <p className="text-sm text-gray-400">
                  Agregue miembros para completar el equipo
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {equipo.miembros.map((miembro: any, index: number) => (
                  <div key={miembro.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {(miembro.nombre_completo || '').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{miembro.nombre_completo}</p>
                        <p className="text-sm text-gray-500">{miembro.rol}</p>
                        {miembro.email && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Mail className="w-3 h-3" />
                            {miembro.email}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline">
                      {miembro.rol}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </>
  );
};
