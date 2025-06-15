
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionIcon?: React.ElementType;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  actionIcon: ActionIcon,
  className = ""
}) => {
  return (
    <Card className={`text-center py-12 ${className}`}>
      <CardContent>
        <Icon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground mb-4">
          {description}
        </p>
        {actionText && onAction && (
          <Button 
            onClick={onAction}
            className="bg-primary hover:bg-primary/90"
          >
            {ActionIcon && <ActionIcon className="w-4 h-4 mr-2" />}
            {actionText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
