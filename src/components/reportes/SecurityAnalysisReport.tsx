import { useState } from 'react';
import type { DateRange } from "react-day-picker";
import { subDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSecurityReports } from '@/hooks/useSecurityReports';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts';
import { AlertCircle, BarChart2, Calendar as CalendarIcon, Clock, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

const formatSeconds = (seconds: number) => {
    if (seconds === 0) return 'N/A';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

const COLORS: { [key: string]: string } = {
    'critical': '#EF4444',
    'emergency': '#DC2626',
    'warning': '#F97316',
    'info': '#3B82F6',
};
const DEFAULT_COLOR = '#6B7280';

const KPICard = ({ title, value, icon: Icon, color = 'text-primary' }: { title: string; value: string | number; icon: React.ElementType; color?: string; }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={`h-4 w-4 text-muted-foreground`} />
        </CardHeader>
        <CardContent>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
        </CardContent>
    </Card>
);

const SecurityReportSkeleton = () => (
    <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-[350px] w-full" />
            <Skeleton className="h-[350px] w-full" />
        </div>
    </div>
);

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
                                    <KPICard title="Total de Alertas" value={stats.total_alerts} icon={ShieldAlert} />
                                    <KPICard title="Tiempo Prom. Reconocimiento" value={formatSeconds(stats.avg_acknowledgement_time_seconds)} icon={Clock} />
                                    <KPICard title="Alertas por Reconocer" value={stats.unacknowledged_alerts} icon={AlertCircle} color={stats.unacknowledged_alerts > 0 ? "text-red-500" : "text-green-500"} />
                                </div>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base font-medium flex items-center gap-2"><BarChart2 className="w-5 h-5" />Alertas por Prioridad</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <PieChart>
                                                    <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                                        {priorityData.map((entry) => (
                                                            <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || DEFAULT_COLOR} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base font-medium flex items-center gap-2"><BarChart2 className="w-5 h-5" />Alertas por Tipo</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <BarChart data={typeData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                                    <XAxis type="number" allowDecimals={false} />
                                                    <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 12 }} />
                                                    <Tooltip cursor={{fill: 'rgba(240, 240, 240, 0.5)'}}/>
                                                    <Bar dataKey="value" name="Cantidad" fill="#3b82f6" barSize={20} />
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
