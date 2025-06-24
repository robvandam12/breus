
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserCheck, Clock, AlertTriangle } from "lucide-react";
import { useUsuarios } from "@/hooks/useUsuarios";

export const TeamStatusWidget = () => {
  const { usuarios, isLoading } = useUsuarios();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Estado del Equipo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeUsers = usuarios.filter(u => u.estado_buzo === 'activo');
  const inactiveUsers = usuarios.filter(u => u.estado_buzo === 'inactivo');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Estado del Equipo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-green-600">{activeUsers.length}</p>
              <p className="text-sm text-gray-600">Activos</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-2xl font-bold text-gray-600">{inactiveUsers.length}</p>
              <p className="text-sm text-gray-600">Inactivos</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Equipo Activo</h4>
          {activeUsers.slice(0, 5).map((usuario) => {
            // Parse perfil_buzo safely
            let perfilBuzo: any = {};
            try {
              perfilBuzo = typeof usuario.perfil_buzo === 'string' 
                ? JSON.parse(usuario.perfil_buzo) 
                : usuario.perfil_buzo || {};
            } catch (e) {
              perfilBuzo = {};
            }

            return (
              <div key={usuario.usuario_id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={perfilBuzo.avatar_url || ''} />
                  <AvatarFallback>
                    {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{usuario.nombre} {usuario.apellido}</p>
                  <p className="text-xs text-gray-500">{usuario.empresa_nombre}</p>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  {usuario.rol}
                </Badge>
              </div>
            );
          })}
          
          {activeUsers.length > 5 && (
            <p className="text-sm text-gray-500 text-center">
              +{activeUsers.length - 5} más
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
