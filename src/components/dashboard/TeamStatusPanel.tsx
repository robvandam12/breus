
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX } from "lucide-react";
import { useActiveImmersions } from "@/hooks/useActiveImmersions";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const TeamStatusPanel = () => {
    const { activeImmersions, isLoading } = useActiveImmersions();

    const activePersonnel = activeImmersions.flatMap(i => [
        { name: i.buzo_principal, role: 'Buzo Principal', immersion: i.codigo },
        ...(i.buzo_asistente ? [{ name: i.buzo_asistente, role: 'Buzo Asistente', immersion: i.codigo }] : []),
        { name: i.supervisor, role: 'Supervisor', immersion: i.codigo },
    ]);

    // Simulación de datos para demostración. Esto se conectará a datos reales más adelante.
    const totalPersonnel = 25;
    const availablePersonnel = totalPersonnel - new Set(activePersonnel.map(p => p.name)).size;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Estado de Equipos en Tiempo Real
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Resumen General */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Personal Ocupado</p>
                            <div className="flex items-center justify-center gap-2 mt-1">
                                <UserX className="w-5 h-5 text-amber-500" />
                                <p className="text-2xl font-bold">{new Set(activePersonnel.map(p => p.name)).size}</p>
                            </div>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Personal Disponible</p>
                             <div className="flex items-center justify-center gap-2 mt-1">
                                <UserCheck className="w-5 h-5 text-green-500" />
                                <p className="text-2xl font-bold">{availablePersonnel}</p>
                            </div>
                        </div>
                    </div>

                    {/* Detalle Personal Activo */}
                    <div>
                        <h4 className="font-semibold mb-2 text-zinc-800 dark:text-zinc-200">Personal en Operación</h4>
                        {isLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : activePersonnel.length > 0 ? (
                            <ul className="space-y-2">
                                {activePersonnel.map((person, index) => (
                                    <li key={index} className="flex items-center justify-between p-2 rounded-md border">
                                        <div>
                                            <p className="font-medium">{person.name}</p>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Inmersión: {person.immersion}</p>
                                        </div>
                                        <Badge variant="outline">{person.role}</Badge>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 py-4">No hay personal en operaciones activas.</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
