
import React from "react";
import { KPICard } from "@/components/KPICard";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { FileText, Anchor, Users, AlertTriangle } from "lucide-react";
import { KpiCardsWidgetSkeleton } from "./skeletons/KpiCardsWidgetSkeleton";

const KpiCardsWidget = ({ config }: { config?: any }) => {
    const { stats, isLoading: statsLoading } = useDashboardStats();
    
    if (statsLoading) {
        return <KpiCardsWidgetSkeleton />;
    }

    const kpiData = [
        {
            title: "Bitácoras Totales",
            value: stats.totalBitacoras.toString(),
            change: { 
                value: `${stats.bitacorasFirmadas}/${stats.totalBitacoras}`, 
                type: "neutral" as const 
            },
            description: "Firmadas/Total",
            icon: <FileText className="w-4 h-4" />,
        },
        {
            title: "Inmersiones Hoy",
            value: stats.inmersionesHoy.toString(),
            change: { value: "+25%", type: "positive" as const },
            description: "Respecto a ayer",
            icon: <Anchor className="w-4 h-4" />,
        },
        {
            title: "Operaciones Activas",
            value: stats.operacionesActivas.toString(),
            change: { value: "100%", type: "positive" as const },
            description: "En progreso",
            icon: <Users className="w-4 h-4" />,
        },
        {
            title: "Alertas Activas",
            value: stats.alertasActivas.toString(),
            change: { 
                value: stats.alertasActivas > 0 ? "-1" : "0", 
                type: stats.alertasActivas > 0 ? "positive" as const : "neutral" as const 
            },
            description: "Requieren atención",
            icon: <AlertTriangle className="w-4 h-4" />,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {kpiData.map((kpi, index) => (
                <div key={index} className="transition-all duration-200 hover:scale-105">
                    <KPICard
                        title={kpi.title}
                        value={kpi.value}
                        change={kpi.change}
                        description={kpi.description}
                        icon={kpi.icon}
                        className="h-full shadow-lg hover:shadow-xl"
                    />
                </div>
            ))}
        </div>
    );
};

export default React.memo(KpiCardsWidget);
