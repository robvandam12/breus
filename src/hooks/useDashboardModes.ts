
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
            toast({ description: "Saliendo de vista previa." });
        }
    };
    
    const handleToggleEdit = () => {
        if (isPreviewMode) {
            handleExitPreview();
        }
        setIsEditMode(true);
        toast({ description: "Modo edición activado. Ahora puedes mover y redimensionar widgets." });
    };

    const handleEnterPreview = () => {
        if (isEditMode) {
            setPreviewSnapshot({ ...dashboardState });
            setIsEditMode(false);
            setIsPreviewMode(true);
            toast({ description: "Entrando a vista previa." });
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
            toast({ description: "Cambios de la vista previa descartados." });
        }
    };
    
    const handleCancelEdit = () => {
        resetDashboardState(getInitialDashboardState());
        setIsEditMode(false);
        setIsPreviewMode(false);
        setPreviewSnapshot(null);
        toast({ description: "Edición cancelada. Se ha restaurado el último diseño guardado." });
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
