
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Hospital, Siren } from "lucide-react";
import { useActiveImmersions } from "@/hooks/useActiveImmersions";
import { Skeleton } from "@/components/ui/skeleton";

interface EmergencyContact {
    name: string;
    phone: string;
    icon: React.ElementType;
}

const emergencyContacts: EmergencyContact[] = [
    { name: "Emergencia Marítima (137)", phone: "137", icon: Siren },
    { name: "Ambulancia (SAMU)", phone: "131", icon: Hospital },
    { name: "Contacto Empresa", phone: "+56 9 1234 5678", icon: Phone },
];

export const EmergencyPanel = () => {
    const { activeImmersions, isLoading } = useActiveImmersions();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Siren className="w-5 h-5 text-red-600" />
                    Comunicaciones de Emergencia
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2 text-zinc-800 dark:text-zinc-200">Contactos Generales</h4>
                        <ul className="space-y-2">
                            {emergencyContacts.map(contact => {
                                const Icon = contact.icon;
                                return (
                                    <li key={contact.name} className="flex items-center justify-between p-2 rounded-md bg-zinc-100 dark:bg-zinc-800">
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-5 h-5 text-primary" />
                                            <span className="font-medium">{contact.name}</span>
                                        </div>
                                        <a href={`tel:${contact.phone}`} className="font-mono text-sm hover:underline">{contact.phone}</a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2 text-zinc-800 dark:text-zinc-200">Planes por Inmersión Activa</h4>
                        {isLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ) : activeImmersions.length > 0 ? (
                            <ul className="space-y-2 text-sm">
                                {activeImmersions.map(inmersion => (
                                    <li key={inmersion.inmersion_id} className="flex items-center justify-between p-2 rounded-md border">
                                        <span className="font-semibold">{inmersion.codigo}</span>
                                        <span className="text-zinc-500 dark:text-zinc-400">Hospital más cercano: No disponible</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 py-4">No hay inmersiones activas.</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
