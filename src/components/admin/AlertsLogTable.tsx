
import { useMemo, useState } from "react";
import { useSecurityAlerts } from "@/hooks/useSecurityAlerts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, CheckCircle } from "lucide-react";
import type { SecurityAlert } from "@/types/security";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const getPriorityBadgeVariant = (priority: string): "destructive" | "default" | "secondary" => {
    switch (priority) {
        case 'emergency':
        case 'critical':
            return 'destructive';
        case 'warning':
            return 'default';
        default: // info
            return 'secondary';
    }
};

export const AlertsLogTable = () => {
    const { alerts, isLoading } = useSecurityAlerts();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState('all');

    const filteredAlerts = useMemo(() => {
        return alerts
            .filter(a => filterPriority === 'all' || a.priority === filterPriority)
            .filter(a => {
                const code = a.details?.inmersion_code || a.inmersion?.codigo || '';
                const type = a.type.toLowerCase();
                const term = searchTerm.toLowerCase();
                return code.toLowerCase().includes(term) || type.includes(term);
            });
    }, [alerts, filterPriority, searchTerm]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-full max-w-sm" />
                    <Skeleton className="h-10 w-[180px]" />
                </div>
                <div className="border rounded-lg">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        );
    }
    
    return (
        <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
             <div className="p-4 border-b flex flex-wrap gap-2">
                <Input 
                    placeholder="Buscar por código de inmersión o tipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toda Prioridad</SelectItem>
                        <SelectItem value="emergency">Emergencia</SelectItem>
                        <SelectItem value="critical">Crítica</SelectItem>
                        <SelectItem value="warning">Advertencia</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Prioridad</TableHead>
                            <TableHead>Inmersión</TableHead>
                            <TableHead>Fecha Creación</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Reconocida Por (ID)</TableHead>
                            <TableHead>Fecha Reconocimiento</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAlerts.length > 0 ? (
                            filteredAlerts.map((alert: SecurityAlert) => (
                                <TableRow key={alert.id}>
                                    <TableCell className="font-medium">{alert.type.replace(/_/g, ' ')}</TableCell>
                                    <TableCell>
                                        <Badge variant={getPriorityBadgeVariant(alert.priority)} className="capitalize">{alert.priority}</Badge>
                                    </TableCell>
                                    <TableCell>{alert.inmersion?.codigo || alert.details?.inmersion_code || 'N/A'}</TableCell>
                                    <TableCell>{new Date(alert.created_at).toLocaleString('es-CL')}</TableCell>
                                    <TableCell>
                                        <Badge variant={alert.acknowledged ? 'secondary' : 'destructive'} className="flex items-center gap-1.5 w-fit">
                                            {alert.acknowledged ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                            {alert.acknowledged ? 'Reconocida' : 'Activa'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {alert.acknowledged_by ? (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <span className="font-mono text-xs">{alert.acknowledged_by.substring(0, 8)}...</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="font-mono text-xs">{alert.acknowledged_by}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ) : (
                                            '---'
                                        )}
                                    </TableCell>
                                    <TableCell>{alert.acknowledged_at ? new Date(alert.acknowledged_at).toLocaleString('es-CL') : '---'}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No se encontraron alertas con los filtros actuales.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
