
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Check, X, RotateCcw, RotateCw } from 'lucide-react';

interface PreviewBannerProps {
  onApplyChanges: () => void;
  onDiscardChanges: () => void;
  onExitPreview: () => void;
  isApplying: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export const PreviewBanner = ({
  onApplyChanges,
  onDiscardChanges,
  onExitPreview,
  isApplying,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: PreviewBannerProps) => {
  return (
    <Card className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-sm animate-fade-in">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <Eye className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100">
                Modo Vista Previa
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                Los cambios son temporales. Aplica o descarta los cambios para continuar.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo controls in preview */}
          <div className="flex items-center gap-1 rounded-md border bg-background p-0.5 mr-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onUndo} 
              disabled={!canUndo}
              className="h-8 w-8"
              aria-label="Deshacer"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onRedo} 
              disabled={!canRedo}
              className="h-8 w-8"
              aria-label="Rehacer"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>

          <Button 
            variant="outline" 
            onClick={onDiscardChanges}
            disabled={isApplying}
            className="text-red-600 hover:text-red-700 border-red-200"
          >
            <X className="w-4 h-4 mr-2" />
            Descartar
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onExitPreview}
            disabled={isApplying}
          >
            Salir Vista Previa
          </Button>
          
          <Button 
            onClick={onApplyChanges}
            disabled={isApplying}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Check className="w-4 h-4 mr-2" />
            {isApplying ? 'Aplicando...' : 'Aplicar Cambios'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
