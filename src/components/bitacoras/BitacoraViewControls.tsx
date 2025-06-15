
import { Button } from "@/components/ui/button";
import { LayoutGrid, LayoutList, Plus } from "lucide-react";

interface BitacoraViewControlsProps {
  viewMode: 'cards' | 'table';
  onViewModeChange: (mode: 'cards' | 'table') => void;
  onNewBitacora: () => void;
  newButtonText: string;
  newButtonColor?: string;
}

export const BitacoraViewControls = ({ 
  viewMode, 
  onViewModeChange, 
  onNewBitacora, 
  newButtonText,
  newButtonColor = "bg-purple-600 hover:bg-purple-700"
}: BitacoraViewControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center bg-zinc-100 rounded-lg p-1">
        <Button
          variant={viewMode === 'cards' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('cards')}
          className="h-8 px-3"
        >
          <LayoutGrid className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'table' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('table')}
          className="h-8 px-3"
        >
          <LayoutList className="w-4 h-4" />
        </Button>
      </div>

      <Button
        onClick={onNewBitacora}
        className={newButtonColor}
      >
        <Plus className="w-4 h-4 mr-2" />
        {newButtonText}
      </Button>
    </div>
  );
};
