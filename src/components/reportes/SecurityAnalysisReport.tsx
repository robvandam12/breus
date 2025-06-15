
import { useState } from 'react';
import type { DateRange } from "react-day-picker";
import { subDays } from 'date-fns';
import { useSecurityReports } from '@/hooks/useSecurityReports';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ShieldAlert, ShieldCheck, Clock } from 'lucide-react';
import { ReportDateRangePicker } from './ReportDateRangePicker';
import { ReportKPICard } from './ReportKPICard';
import { SecurityReportSkeleton } from './SecurityReportSkeleton';
import { SecurityPriorityChart } from './SecurityPriorityChart';
import { SecurityTypeChart } from './SecurityTypeChart';

const formatSeconds = (seconds: number) => {
    if (seconds === 0) return 'N/A';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

export const SecurityAnalysisReport = () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    });

    const { stats, isLoading, error } = useSecurityReports({
        from: dateRange?.from!,
        to: dateRange?.to!,
    });

    const priorityData = stats ? Object.entries(stats.alerts_by_priority).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value })).sort((a,b) => b.value - a.value) : [];
    const typeData = stats ? Object.entries(stats.alerts_by_type).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value })).sort((a,b) => b.value - a.value) : [];

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5" />
                        Análisis de Reportes de Seguridad
                    </CardTitle>
                    <ReportDateRangePicker dateRange={dateRange} onDateChange={setDateRange} />
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoading && <SecurityReportSkeleton />}
                {error && <div className="text-center py-8 text-red-600"><AlertCircle className="mx-auto h-8 w-8 mb-2" /><p>Error al cargar los datos de seguridad.</p></div>}
                {stats && !isLoading && (
                    <>
                        {stats.total_alerts === 0 ? (
                            <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
                                <ShieldCheck className="w-12 h-12 mx-auto text-zinc-400 mb-4" />
                                <p className="font-medium">No hay alertas de seguridad</p>
                                <p className="text-sm">No se han registrado alertas en el período seleccionado.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <ReportKPICard title="Total de Alertas" value={stats.total_alerts} icon={ShieldAlert} />
                                    <ReportKPICard title="Tiempo Prom. Reconocimiento" value={formatSeconds(stats.avg_acknowledgement_time_seconds)} icon={Clock} />
                                    <ReportKPICard title="Alertas por Reconocer" value={stats.unacknowledged_alerts} icon={AlertCircle} color={stats.unacknowledged_alerts > 0 ? "text-red-500" : "text-green-500"} />
                                </div>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <SecurityPriorityChart data={priorityData} />
                                    <SecurityTypeChart data={typeData} />
                                </div>
                            </>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
