
import { useBuzoStats } from "@/hooks/useBuzoStats";
import { Calendar, Clock, CheckCircle2, Anchor } from 'lucide-react';
import { BuzoStatsWidgetSkeleton } from "./skeletons/BuzoStatsWidgetSkeleton";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const StatCard = ({ title, value, icon: Icon, to }: { title: string, value: number | string, icon: React.ElementType, to?: string }) => {
    const cardContent = (
        <div className="flex flex-col items-center justify-center text-center p-2 rounded-lg bg-background h-full">
            <Icon className="w-6 h-6 text-muted-foreground mb-2" />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground text-balance">{title}</p>
        </div>
    );

    if (to) {
        return (
            <Link to={to} className={cn(
                "block h-full rounded-lg transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}>
                {cardContent}
            </Link>
        );
    }

    return cardContent;
};

const BuzoStatsWidget = () => {
    const { stats, isLoading } = useBuzoStats();

    if (isLoading) {
        return <BuzoStatsWidgetSkeleton />;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 h-full content-center">
            <StatCard title="Operaciones" value={stats.totalOperaciones} icon={Calendar} to="/operaciones" />
            <StatCard title="Bitácoras Pendientes" value={stats.bitacorasPendientes} icon={Clock} to="/bitacoras-buzo" />
            <StatCard title="Bitácoras Completas" value={stats.bitacorasCompletadas} icon={CheckCircle2} to="/bitacoras-buzo" />
            <StatCard title="Inmersiones (Mes)" value={stats.inmersionesMes} icon={Anchor} to="/inmersiones" />
        </div>
    );
};

export default BuzoStatsWidget;
