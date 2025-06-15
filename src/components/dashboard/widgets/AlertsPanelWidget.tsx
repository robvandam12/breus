
import { AlertasPanel } from "@/components/dashboard/AlertasPanel";
import { SecurityAlertsPanel } from "@/components/dashboard/SecurityAlertsPanel";

export const AlertasPanelWidget = ({ config }: { config?: { alertType?: 'general' | 'security' } }) => {
    const alertType = config?.alertType || 'general';

    if (alertType === 'security') {
        return <SecurityAlertsPanel />;
    }

    return <AlertasPanel />;
};
