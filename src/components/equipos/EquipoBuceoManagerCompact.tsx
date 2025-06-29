
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Eye } from "lucide-react";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { useAuth } from "@/hooks/useAuth";

interface EquipoBuceoManagerCompactProps {
  maxItems?: number;
  showCreateButton?: boolean;
}

export const EquipoBuceoManagerCompact = ({ 
  maxItems = 5, 
  showCreateButton = true 
}: EquipoBuceoManagerCompactProps) => {
  const { profile } = useAuth();
  const { equipos, isLoading } = useEquiposBuceoEnhanced();
  
  const filteredEquipos = equipos
    .filter(equipo => {
      if (profile?.role === 'superuser') return true;
      if (profile?.role === 'admin_salmonera' && profile.salmonera_id) {
        return equipo.empresa_id === profile.salmonera_id;
      }
      if (profile?.role === 'admin_servicio' && profile.servicio_id) {
        return equipo.empresa_id === profile.servicio_id && equipo.tipo_empresa === 'contratista';
      }
      return true;
    })
    .slice(0, maxItems);

  if (isLoading) {
    return <div className="animate-pulse h-32 bg-gray-200 rounded"></div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Equipos de Buceo</CardTitle>
        {showCreateButton && (
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Nuevo
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {filteredEquipos.length === 0 ? (
          <p className="text-sm text-gray-500">No hay equipos disponibles</p>
        ) : (
          <div className="space-y-2">
            {filteredEquipos.map((equipo) => (
              <div key={equipo.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">{equipo.nombre}</span>
                  <Badge variant="outline" className="text-xs">
                    {equipo.miembros?.length || 0} miembros
                  </Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
