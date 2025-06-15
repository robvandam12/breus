
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useEquipoBuceo, EquipoBuceo } from '@/hooks/useEquipoBuceo';
import { EquipmentStatusWidgetSkeleton } from './skeletons/EquipmentStatusWidgetSkeleton';
import { AlertCircle, Users, CheckCircle, XCircle, Tool, Ship } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const getStatus = (equipo: EquipoBuceo) => {
    // Lógica de estado simulada para demostración
    if (!equipo.activo) {
        return { label: 'Inactivo', color: 'bg-gray-500', icon: <XCircle className="h-4 w-4" /> };
    }
    if (equipo.nombre.toLowerCase().includes('beta')) {
         return { label: 'En Uso', color: 'bg-blue-500', icon: <Ship className="h-4 w-4" /> };
    }
    if (equipo.nombre.toLowerCase().includes('gamma')) {
        return { label: 'Mantenimiento', color: 'bg-yellow-500 text-black', icon: <Tool className="h-4 w-4" /> };
    }
    return { label: 'Disponible', color: 'bg-green-500', icon: <CheckCircle className="h-4 w-4" /> };
};

const EquipoItem = ({ equipo }: { equipo: EquipoBuceo }) => {
    const status = getStatus(equipo);

    return (
        <div className="flex items-start justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
            <div className="flex flex-col flex-1 min-w-0">
                <span className="font-semibold truncate">{equipo.nombre}</span>
                 <p className="text-sm text-muted-foreground truncate">{equipo.descripcion}</p>
                 <div className="flex items-center gap-2 mt-2">
                    <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex -space-x-2">
                         {(equipo.miembros && equipo.miembros.length > 0) ? (
                            equipo.miembros.slice(0, 5).map((miembro) => (
                                <TooltipProvider key={miembro.id}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Avatar className="h-6 w-6 border-2 border-background">
                                                <AvatarFallback>{miembro.nombre_completo.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{miembro.nombre_completo}</p>
                                            <p className="text-muted-foreground capitalize">{miembro.rol_equipo.replace('_', ' ')}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))
                        ) : (
                             <p className="text-xs text-muted-foreground">Sin miembros</p>
                        )}
                        {equipo.miembros && equipo.miembros.length > 5 && (
                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold border-2 border-background">
                                +{equipo.miembros.length - 5}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Badge variant="outline" className={`${status.color} text-white flex items-center gap-1.5 flex-shrink-0 ml-2`}>
                {status.icon}
                {status.label}
            </Badge>
        </div>
    );
};

const EquipmentStatusWidget = () => {
    const { equipos, isLoading, isError } = useEquipoBuceo();

    if (isLoading) {
        return <EquipmentStatusWidgetSkeleton />;
    }

    if (isError) {
        return (
            <Card className="h-full flex flex-col items-center justify-center">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base text-red-500">
                        <AlertCircle className="w-5 h-5" />
                        Error al cargar equipos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No se pudieron cargar los datos de los equipos.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="text-base">Estado de Equipos de Buceo</CardTitle>
                <CardDescription>Resumen de disponibilidad y asignación de equipos.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-grow relative">
                <ScrollArea className="absolute inset-0">
                     <div className="space-y-1 p-2">
                        {equipos && equipos.length > 0 ? (
                            equipos.map((equipo) => <EquipoItem key={equipo.id} equipo={equipo} />)
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                                <p className="text-muted-foreground">No hay equipos de buceo registrados.</p>
                            </div>
                        )}
                     </div>
                 </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default React.memo(EquipmentStatusWidget);
