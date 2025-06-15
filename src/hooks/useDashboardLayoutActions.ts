
import { useState } from 'react';
import { Layouts } from 'react-grid-layout';
import { toast } from '@/hooks/use-toast';

interface UseDashboardLayoutActionsProps {
    currentLayouts: Layouts;
    currentWidgets: any;
    saveLayout: (params: { layout: Layouts, widgets: any }, options: any) => void;
    resetLayout: (params: undefined | void, options: any) => void;
    onSaveSuccess?: () => void;
    onResetSuccess?: () => void;
}

export const useDashboardLayoutActions = ({
    currentLayouts,
    currentWidgets,
    saveLayout,
    resetLayout,
    onSaveSuccess,
    onResetSuccess,
}: UseDashboardLayoutActionsProps) => {
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

    const handleSaveLayout = () => {
        saveLayout({ layout: currentLayouts, widgets: currentWidgets }, {
            onSuccess: () => {
                toast({ title: "Diseño guardado", description: "Tu dashboard ha sido actualizado." });
                onSaveSuccess?.();
            },
        });
    }

    const handleResetLayout = () => {
        setIsResetConfirmOpen(false);
        resetLayout(undefined, {
            onSuccess: () => {
                toast({ title: "Diseño restaurado", description: "El dashboard ha vuelto a su estado por defecto." });
                onResetSuccess?.();
            },
        });
    };

    return {
        isResetConfirmOpen,
        setIsResetConfirmOpen,
        handleSaveLayout,
        handleResetLayout,
    };
};
