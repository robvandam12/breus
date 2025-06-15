
import { useEffect } from 'react';

interface UseDashboardKeyboardShortcutsProps {
    isEditMode: boolean;
    isPreviewMode: boolean;
    undo: () => void;
    redo: () => void;
    handleEnterPreview: () => void;
}

export const useDashboardKeyboardShortcuts = ({
    isEditMode,
    isPreviewMode,
    undo,
    redo,
    handleEnterPreview,
}: UseDashboardKeyboardShortcutsProps) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isEditMode && !isPreviewMode) return;
            if (event.ctrlKey || event.metaKey) {
                if (event.key === 'z') {
                    event.preventDefault();
                    undo();
                } else if (event.key === 'y') {
                    event.preventDefault();
                    redo();
                } else if (event.key === 'p' && isEditMode) {
                    event.preventDefault();
                    handleEnterPreview();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isEditMode, isPreviewMode, undo, redo, handleEnterPreview]);
};
