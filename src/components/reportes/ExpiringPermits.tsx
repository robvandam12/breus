
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, FileText } from "lucide-react";
import { permisosVencimiento, getEstadoColor } from "@/data/reportesMockData";

export const ExpiringPermits = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Permisos y Matrículas Próximas a Vencer
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {permisosVencimiento.map((permiso, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="font-medium">{permiso.buzo}</div>
                                    <div className="text-sm text-zinc-500">{permiso.matricula}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <div className="text-sm font-medium">{permiso.vencimiento}</div>
                                    <div className="text-xs text-zinc-500">{permiso.dias} días</div>
                                </div>
                                <Badge className={getEstadoColor(permiso.estado)}>
                                    {permiso.dias <= 5 ? "Urgente" : 
                                    permiso.dias <= 15 ? "Próximo" : "Normal"}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
