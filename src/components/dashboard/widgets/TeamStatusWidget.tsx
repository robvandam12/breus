
import { useTeamStatusData } from "@/hooks/useTeamStatusData";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TeamStatusWidgetProps {
    config?: {
        showInactive?: boolean;
        showSuspended?: boolean;
    }
}

export const TeamStatusWidget = ({ config }: TeamStatusWidgetProps) => {
    const { teamMembers, isLoading } = useTeamStatusData({
        includeInactive: config?.showInactive,
        includeSuspended: config?.showSuspended,
    });

    if (isLoading) {
        return <Skeleton className="h-full w-full" />;
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Estado del Equipo</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                {teamMembers.length > 0 ? (
                    <ScrollArea className="h-full pr-4">
                        <ul className="space-y-4">
                            {teamMembers.map(member => (
                                <li key={member.usuario_id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={member.perfil_buzo?.avatar_url} />
                                            <AvatarFallback>{member.nombre?.[0]}{member.apellido?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{member.nombre} {member.apellido}</p>
                                            <p className="text-sm text-muted-foreground capitalize">{member.rol}</p>
                                        </div>
                                    </div>
                                    <Badge variant={member.estado_buzo === 'activo' ? 'default' : 'secondary'} className="capitalize">
                                        {member.estado_buzo || 'desconocido'}
                                    </Badge>
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground text-center py-4">No se encontraron miembros del equipo.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
