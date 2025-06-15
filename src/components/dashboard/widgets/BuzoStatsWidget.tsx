
import { useBuzoStats } from "@/hooks/useBuzoStats";
import { Calendar, Clock, CheckCircle2, Anchor } from 'lucide-react';
import { BuzoStatsWidgetSkeleton } from "./skeletons/BuzoStatsWidgetSkeleton";

const StatCard = ({ title, value, icon: Icon }: { title: string, value: number | string, icon: React.ElementType }) => (
    <div className="flex flex-col items-center justify-center text-center p-2 rounded-lg bg-background h-full">
        <Icon className="w-6 h-6 text-muted-foreground mb-2" />
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground text-balance">{title}</p>
    </div>
);

const BuzoStatsWidget = () => {
    const { stats, isLoading } = useBuzoStats();

    if (isLoading) {
        return <BuzoStatsWidgetSkeleton />;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 h-full content-center">
            <StatCard title="Operaciones" value={stats.totalOperaciones} icon={Calendar} />
            <StatCard title="Bitácoras Pendientes" value={stats.bitacorasPendientes} icon={Clock} />
            <StatCard title="Bitácoras Completas" value={stats.bitacorasCompletadas} icon={CheckCircle2} />
            <StatCard title="Inmersiones (Mes)" value={stats.inmersionesMes} icon={Anchor} />
        </div>
    );
};

export default BuzoStatsWidget;
