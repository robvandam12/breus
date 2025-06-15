
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Layouts } from 'react-grid-layout';

interface DashboardState {
    layouts: Layouts;
    widgets: any;
}

interface UseDashboardModesProps {
    dashboardState: DashboardState;
    setDashboardState: (newState: DashboardState) => void;
    resetDashboardState: (newState: DashboardState) => void;
    getInitialDashboardState: () => DashboardState;
    handleSaveLayout: () => void;
}

export const useDashboardModes = ({
    dashboardState,
    setDashboardState,
    resetDashboardState,
    getInitialDashboardState,
    handleSaveLayout
}: UseDashboardModesProps) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [previewSnapshot, setPreviewSnapshot] = useState<DashboardState | null>(null);

    const handleExitPreview = () => {
        if (isPreviewMode && previewSnapshot) {
            setDashboardState(previewSnapshot);
            setIsPreviewMode(false);
            setPreviewSnapshot(null);
            setIsEditMode(true);
            toast({ title: "Vista Previa", description: "Saliendo de vista previa. Vuelves al modo edición." });
        }
    };
    
    const handleToggleEdit = () => {
        if (isPreviewMode) {
            handleExitPreview();
            return; // Exit here as handleExitPreview already shows a toast
        }
        setIsEditMode(true);
        toast({ title: "Modo Edición", description: "Ahora puedes mover y redimensionar widgets." });
    };

    const handleEnterPreview = () => {
        if (isEditMode) {
            setPreviewSnapshot({ ...dashboardState });
            setIsEditMode(false);
            setIsPreviewMode(true);
            toast({ title: "Vista Previa", description: "Entrando a vista previa. Los cambios son temporales." });
        }
    };

    const handleApplyPreviewChanges = () => {
        if (isPreviewMode) {
            setIsPreviewMode(false);
            setPreviewSnapshot(null);
            handleSaveLayout();
        }
    };

    const handleDiscardPreviewChanges = () => {
        if (isPreviewMode) {
            resetDashboardState(getInitialDashboardState());
            setIsPreviewMode(false);
            setPreviewSnapshot(null);
            toast({ title: "Vista Previa", description: "Cambios de la vista previa descartados." });
        }
    };
    
    const handleCancelEdit = () => {
        resetDashboardState(getInitialDashboardState());
        setIsEditMode(false);
        setIsPreviewMode(false);
        setPreviewSnapshot(null);
        toast({ title: "Edición Cancelada", description: "Se ha restaurado el último diseño guardado." });
    };

    return {
        isEditMode,
        setIsEditMode,
        isPreviewMode,
        setIsPreviewMode,
        previewSnapshot,
        setPreviewSnapshot,
        handleToggleEdit,
        handleEnterPreview,
        handleExitPreview,
        handleCancelEdit,
        handleApplyPreviewChanges,
        handleDiscardPreviewChanges,
    };
};
