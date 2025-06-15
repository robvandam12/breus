
import { useUndoRedo as useBaseUndoRedo } from '@/hooks/useUndoRedo';
import { toast } from '@/hooks/use-toast';
import { Layouts } from 'react-grid-layout';

interface DashboardState {
    layouts: Layouts;
    widgets: any;
}

const defaultWidgets = {};
const initialUndoRedoState: DashboardState = { layouts: {}, widgets: defaultWidgets };

export const useDashboardUndoRedo = () => {
    const { 
        state, 
        set, 
        undo: undoAction, 
        redo: redoAction, 
        reset, 
        canUndo, 
        canRedo 
    } = useBaseUndoRedo<DashboardState>(initialUndoRedoState);
    
    const undo = () => {
        if (canUndo) {
            undoAction();
            toast({ title: "Deshacer", description: "Última acción deshecha." });
        }
    };

    const redo = () => {
        if (canRedo) {
            redoAction();
            toast({ title: "Rehacer", description: "Última acción rehecha." });
        }
    };

    return {
        dashboardState: state,
        setDashboardState: set,
        resetDashboardState: reset,
        undo,
        redo,
        canUndo,
        canRedo,
    };
};
