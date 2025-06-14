
import { SecurityAlertsPanel } from "./SecurityAlertsPanel";
import { RealTimeMetrics } from "./RealTimeMetrics";
import { ActiveImmersionsPanel } from "./ActiveImmersionsPanel";

export const CentralizedMonitoringDashboard = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold tracking-tight">Monitoreo Centralizado</h1>
            
            <RealTimeMetrics />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <SecurityAlertsPanel />
                <ActiveImmersionsPanel />
            </div>
        </div>
    );
};
