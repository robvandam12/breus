import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserCheck, Clock, AlertTriangle } from "lucide-react";
import { useUsuarios } from "@/hooks/useUsuarios";

export const TeamStatusWidget: React.FC<TeamStatusWidgetProps> = ({ 
  config = {} 
}) => {
  const { usuarios, loading } = useUsuarios();

  const stats = useMemo(() => {
    if (!usuarios || usuarios.length === 0) {
      return {
        totalBuzos: 0,
        buzosActivos: 0,
        buzosDisponibles: 0,
        supervisores: 0
      };
    }

    const buzos = usuarios.filter(usuario => usuario.rol === 'buzo');
    const supervisores = usuarios.filter(usuario => usuario.rol === 'supervisor');
    
    return {
      totalBuzos: buzos.length,
      buzosActivos: buzos.filter(buzo => buzo.estado_buzo === 'activo').length,
      buzosDisponibles: buzos.filter(buzo => buzo.estado_buzo === 'disponible').length,
      supervisores: supervisores.length
    };
  }, [usuarios]);

  if (loading) {
    return <TeamStatusWidgetSkeleton />;
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Estado del Equipo</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalBuzos}</div>
              <div className="text-xs text-muted-foreground">Total Buzos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.supervisores}</div>
              <div className="text-xs text-muted-foreground">Supervisores</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Buzos Activos</span>
              <span className="text-sm font-medium">{stats.buzosActivos}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Buzos Disponibles</span>
              <span className="text-sm font-medium">{stats.buzosDisponibles}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Personal Reciente</h4>
            <div className="space-y-1">
              {usuarios.slice(0, 3).map((usuario) => (
                <div key={usuario.usuario_id} className="flex items-center justify-between text-xs">
                  <span className="truncate">{usuario.nombre} {usuario.apellido}</span>
                  <span className="text-muted-foreground">{usuario.rol}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamStatusWidget;
