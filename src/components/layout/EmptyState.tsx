
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionIcon?: LucideIcon;
}

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  onAction, 
  actionIcon: ActionIcon 
}: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} className="inline-flex items-center">
          {ActionIcon && <ActionIcon className="w-4 h-4 mr-2" />}
          {actionText}
        </Button>
      )}
    </div>
  );
};
