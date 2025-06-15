
import { useState } from 'react';
import type { DateRange } from "react-day-picker";
import { subDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useImmersionReports } from '@/hooks/useImmersionReports';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, LineChart, Line } from 'recharts';
import { AlertCircle, BarChart2, Calendar as CalendarIcon, Clock, Fish, TrendingUp, Users } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

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

const KPICard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType; }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={`h-4 w-4 text-muted-foreground`} />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

const ReportSkeleton = () => (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-[350px] w-full" />
            <Skeleton className="h-[350px] w-full" />
        </div>
        <Skeleton className="h-[300px] w-full" />
    </div>
);

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
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button id="date" variant={"outline"} className="w-[300px] justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "LLL dd, y", { locale: es })} -{" "}
                                            {format(dateRange.to, "LLL dd, y", { locale: es })}
                                        </>
                                    ) : (
                                        format(dateRange.from, "LLL dd, y", { locale: es })
                                    )
                                ) : (
                                    <span>Seleccionar rango</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoading && <ReportSkeleton />}
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
                                    <KPICard title="Total Inmersiones" value={stats.total_inmersions} icon={TrendingUp} />
                                    <KPICard title="Tiempo Total Buceo" value={formatTotalDiveTime(stats.total_dive_time_seconds)} icon={Clock} />
                                    <KPICard title="Tiempo Prom. Buceo" value={formatAvgDiveTime(stats.avg_dive_time_seconds)} icon={Clock} />
                                    <KPICard title="Prof. Prom. Máxima" value={`${stats.avg_max_depth}m`} icon={Fish} />
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base font-medium flex items-center gap-2"><TrendingUp className="w-5 h-5" />Inmersiones por Día</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={dailyData} margin={{ left: -10, right: 20 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="count" name="Inmersiones" stroke="#3b82f6" strokeWidth={2} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base font-medium flex items-center gap-2"><BarChart2 className="w-5 h-5" />Inmersiones por Sitio</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <BarChart data={stats.inmersions_by_site} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                                    <XAxis type="number" allowDecimals={false} />
                                                    <YAxis dataKey="site" type="category" width={100} tick={{ fontSize: 12 }} />
                                                    <Tooltip cursor={{fill: 'rgba(240, 240, 240, 0.5)'}}/>
                                                    <Bar dataKey="count" name="Cantidad" fill="#10b981" barSize={20} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base font-medium flex items-center gap-2"><Users className="w-5 h-5" />Top Buzos</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <BarChart data={stats.inmersions_by_diver} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                                    <XAxis type="number" allowDecimals={false} />
                                                    <YAxis dataKey="diver" type="category" width={100} tick={{ fontSize: 12 }} />
                                                    <Tooltip cursor={{fill: 'rgba(240, 240, 240, 0.5)'}}/>
                                                    <Bar dataKey="count" name="Cantidad" fill="#8884d8" barSize={20} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                </div>
                            </>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
