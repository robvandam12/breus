
import React from "react";
import { useMyImmersionsData } from "@/hooks/useMyImmersionsData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Calendar, Anchor } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MyImmersionsWidgetSkeleton } from "./skeletons/MyImmersionsWidgetSkeleton";

const MyImmersionsWidget = ({ config }: { config?: any }) => {
    const { last5Immersions, pendingBitacorasCount, upcomingImmersions, isLoading } = useMyImmersionsData();

    if (isLoading) {
        return <MyImmersionsWidgetSkeleton />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            <Card className="col-span-1 md:col-span-2 h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Anchor className="w-5 h-5" />Últimas Inmersiones</CardTitle>
                    <CardDescription>Tu actividad de buceo más reciente.</CardDescription>
                </CardHeader>
                <CardContent>
                    {last5Immersions.length > 0 ? (
                        <ul className="space-y-3">
                            {last5Immersions.map(inmersion => (
                                <li key={inmersion.inmersion_id} className="flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-medium">{inmersion.codigo}</p>
                                        <p className="text-muted-foreground">{new Date(inmersion.fecha_inmersion + 'T00:00:00').toLocaleDateString()}</p>
                                    </div>
                                    <Badge variant={inmersion.estado === 'completada' ? 'default' : 'outline'}>{inmersion.estado}</Badge>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No hay inmersiones recientes.</p>
                    )}
                </CardContent>
            </Card>

            <div className="col-span-1 space-y-4 flex flex-col">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2"><FileText className="w-4 h-4"/>Bitácoras Pendientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{pendingBitacorasCount}</p>
                        <p className="text-xs text-muted-foreground">Requieren tu firma.</p>
                        {pendingBitacorasCount > 0 && (
                            <Button asChild size="sm" className="mt-2 w-full">
                                <Link to="/bitacoras/buzo">Revisar</Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
                <Card className="flex-grow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2"><Calendar className="w-4 h-4"/>Próximas</CardTitle>
                    </CardHeader>
                    <CardContent>
                       {upcomingImmersions.length > 0 ? (
                            <ul className="space-y-2">
                                {upcomingImmersions.map(inmersion => (
                                    <li key={inmersion.inmersion_id} className="text-sm">
                                        <p className="font-medium">{inmersion.codigo}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(inmersion.fecha_inmersion  + 'T00:00:00').toLocaleDateString()}</p>
                                    </li>
                                ))}
                            </ul>
                       ) : (
                           <p className="text-sm text-muted-foreground text-center">No hay inmersiones programadas.</p>
                       )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default React.memo(MyImmersionsWidget);
