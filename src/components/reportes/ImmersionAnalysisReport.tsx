
import { useState } from 'react';
import type { DateRange } from "react-day-picker";
import { subDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useImmersionReports } from '@/hooks/useImmersionReports';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Fish, TrendingUp, Clock } from 'lucide-react';
import { ReportDateRangePicker } from './ReportDateRangePicker';
import { ReportKPICard } from './ReportKPICard';
import { ImmersionReportSkeleton } from './ImmersionReportSkeleton';
import { DailyImmersionTrendChart } from './DailyImmersionTrendChart';
import { ImmersionsBySiteChart } from './ImmersionsBySiteChart';
import { TopDiversChart } from './TopDiversChart';

const formatTotalDiveTime = (seconds: number) => {
    if (seconds === 0) return '0h';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

const formatAvgDiveTime = (seconds: number) => {
    if (seconds === 0) return '0m';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
};

export const ImmersionAnalysisReport = () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    });

    const { stats, isLoading, error } = useImmersionReports({
        from: dateRange?.from!,
        to: dateRange?.to!,
    });
    
    const dailyData = stats ? stats.inmersions_by_day.map(d => ({...d, date: format(new Date(d.date), 'dd/MM', { locale: es }) })) : [];

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-2">
                        <Fish className="w-5 h-5" />
                        Análisis de Inmersiones
                    </CardTitle>
                    <ReportDateRangePicker dateRange={dateRange} onDateChange={setDateRange} />
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoading && <ImmersionReportSkeleton />}
                {error && <div className="text-center py-8 text-red-600"><AlertCircle className="mx-auto h-8 w-8 mb-2" /><p>Error al cargar el reporte de inmersiones.</p></div>}
                {stats && !isLoading && (
                    <>
                        {stats.total_inmersions === 0 ? (
                            <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
                                <Fish className="w-12 h-12 mx-auto text-zinc-400 mb-4" />
                                <p className="font-medium">No hay inmersiones completadas</p>
                                <p className="text-sm">No se han registrado inmersiones en el período seleccionado.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <ReportKPICard title="Total Inmersiones" value={stats.total_inmersions} icon={TrendingUp} />
                                    <ReportKPICard title="Tiempo Total Buceo" value={formatTotalDiveTime(stats.total_dive_time_seconds)} icon={Clock} />
                                    <ReportKPICard title="Tiempo Prom. Buceo" value={formatAvgDiveTime(stats.avg_dive_time_seconds)} icon={Clock} />
                                    <ReportKPICard title="Prof. Prom. Máxima" value={`${stats.avg_max_depth}m`} icon={Fish} />
                                </div>

                                <DailyImmersionTrendChart data={dailyData} />

                                <div className="grid gap-6 md:grid-cols-2">
                                    <ImmersionsBySiteChart data={stats.inmersions_by_site} />
                                    <TopDiversChart data={stats.inmersions_by_diver} />
                                </div>
                            </>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
