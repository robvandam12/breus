
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Anchor, Users, CheckCircle } from "lucide-react";
import type { UserActivity } from '@/hooks/useUserActivity';

interface UserActivityStatsProps {
  activity: UserActivity;
}

export const UserActivityStats = ({ activity }: UserActivityStatsProps) => {
  const totalInmersiones = 
    activity.inmersiones.como_buzo_principal.length +
    activity.inmersiones.como_buzo_asistente.length +
    activity.inmersiones.como_supervisor.length +
    activity.inmersiones.como_miembro_equipo.length;

  const totalBitacoras = 
    activity.bitacoras.buzo.completadas.length +
    activity.bitacoras.buzo.pendientes.length +
    activity.bitacoras.supervisor.completadas.length +
    activity.bitacoras.supervisor.pendientes.length;

  const totalDocumentos = 
    activity.documentos.hpts.length +
    activity.documentos.anexos_bravo.length;

  const bitacorasPendientes = 
    activity.bitacoras.buzo.pendientes.length +
    activity.bitacoras.supervisor.pendientes.length;

  const stats = [
    {
      icon: <Anchor className="w-5 h-5 text-blue-600" />,
      label: "Total Inmersiones",
      value: totalInmersiones,
      color: "bg-blue-100"
    },
    {
      icon: <FileText className="w-5 h-5 text-green-600" />,
      label: "Bitácoras Totales",
      value: totalBitacoras,
      color: "bg-green-100"
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-purple-600" />,
      label: "Documentos Creados",
      value: totalDocumentos,
      color: "bg-purple-100"
    },
    {
      icon: <FileText className="w-5 h-5 text-orange-600" />,
      label: "Bitácoras Pendientes",
      value: bitacorasPendientes,
      color: "bg-orange-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
