
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DocumentCreationButtonProps {
  onClick: () => void;
  disabled: boolean;
  className: string;
  children: React.ReactNode;
}

export const DocumentCreationButton = ({ onClick, disabled, className, children }: DocumentCreationButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      disabled={disabled}
      className={className}
      size="sm"
    >
      <Plus className="w-4 h-4 mr-2" />
      {children}
    </Button>
  );
};
