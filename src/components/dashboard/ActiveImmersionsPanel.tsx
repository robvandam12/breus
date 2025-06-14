
import { useActiveImmersions } from "@/hooks/useActiveImmersions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Clock, Anchor, User, Shield, Briefcase, PlayCircle, Calendar, Waves, Timer } from "lucide-react";
import { ImmersionDepthChart } from "./ImmersionDepthChart";
import { useState, useEffect } from 'react';

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'en_progreso':
            return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 animate-pulse">En Progreso</Badge>;
        case 'planificada':
            return <Badge variant="outline">Planificada</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
}

const calculateElapsedTime = (startTime: string, startDate: string): string => {
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const now = new Date();
    // Ajuste para asegurar que la hora de inicio se interprete en la zona horaria local correcta.
    // Asumiendo que el servidor y el cliente pueden tener zonas horarias distintas,
    // pero la fecha y hora vienen sin zona horaria. El navegador usará su zona local.
    const diff = now.getTime() - startDateTime.getTime();

    if (diff < 0) return '00:00:00';

    const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
};

export const ActiveImmersionsPanel = () => {
  const { activeImmersions, isLoading } = useActiveImmersions();
  const [elapsedTimes, setElapsedTimes] = useState<Record<string, string>>({});

  useEffect(() => {
      const interval = setInterval(() => {
          const newTimes: Record<string, string> = {};
          activeImmersions.forEach(inmersion => {
              if (inmersion.estado === 'en_progreso') {
                  newTimes[inmersion.inmersion_id] = calculateElapsedTime(inmersion.hora_inicio, inmersion.fecha_inmersion);
              }
          });
          setElapsedTimes(newTimes);
      }, 1000);

      return () => clearInterval(interval);
  }, [activeImmersions]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Cargando Inmersiones Activas...</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Anchor className="w-5 h-5 text-blue-600" />
          Inmersiones Activas y Planificadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeImmersions.length === 0 ? (
          <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
            <p>No hay inmersiones activas o planificadas.</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[450px]">
            <div className="space-y-4">
              {activeImmersions.map((inmersion) => (
                <div key={inmersion.inmersion_id} className="p-4 rounded-lg border bg-card transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{inmersion.codigo}</h4>
                      <p className="text-sm text-zinc-500 flex items-center gap-1">
                        <Briefcase className="w-3 h-3"/> 
                        {inmersion.operacion?.nombre || 'Operación sin nombre'}
                      </p>
                    </div>
                    {getStatusBadge(inmersion.estado)}
                  </div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                    <p className="flex items-center gap-2"><User className="w-4 h-4 text-primary"/> Buzo: {inmersion.buzo_principal}</p>
                    <p className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary"/> Supervisor: {inmersion.supervisor}</p>
                    <p className="flex items-center gap-2">
                      {inmersion.estado === 'en_progreso' ? <PlayCircle className="w-4 h-4 text-green-500"/> : <Calendar className="w-4 h-4 text-primary"/>}
                       {new Date(inmersion.fecha_inmersion + 'T00:00:00').toLocaleDateString('es-CL')} {inmersion.hora_inicio}
                    </p>
                    <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary"/> T. Fondo Plan: {inmersion.planned_bottom_time || 'N/A'} min</p>
                    {inmersion.estado === 'en_progreso' && (
                        <p className="flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400">
                            <Timer className="w-4 h-4"/>
                            T. Transcurrido: {elapsedTimes[inmersion.inmersion_id] || 'Calculando...'}
                        </p>
                    )}
                  </div>

                  {inmersion.estado === 'en_progreso' && (
                    <div className="mt-4 pt-3 border-t border-dashed">
                       <div className="flex justify-between items-center text-blue-800 dark:text-blue-300">
                        <h5 className="font-semibold text-sm">Datos en Tiempo Real</h5>
                        <div className="flex items-center gap-2">
                          <Waves className="w-5 h-5" />
                          <span className="text-2xl font-bold">{inmersion.current_depth || 0}m</span>
                        </div>
                      </div>
                      <ImmersionDepthChart immersion={inmersion} />
                    </div>
                  )}

                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
