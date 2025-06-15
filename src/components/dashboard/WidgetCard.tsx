
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, X, Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import React from "react";

interface WidgetCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  isDraggable?: boolean;
  onRemove?: () => void;
  onConfigure?: () => void;
  isStatic?: boolean;
}

export const WidgetCard = ({ title, children, className, isDraggable = false, onRemove, onConfigure, isStatic = false }: WidgetCardProps) => {
  const cardId = React.useId();
  const titleId = `${cardId}-title`;
  const descriptionId = `${cardId}-desc`;

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "w-full h-full flex flex-col overflow-hidden transition-shadow duration-200",
          isDraggable && !isStatic ? "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" : "",
          className
        )}
        role="group"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={isDraggable && !isStatic ? 0 : -1}
      >
        <span id={descriptionId} className="sr-only">
          Widget. {isDraggable && !isStatic ? "Cuando el modo edición está activo, este widget es enfocable. Futuras versiones permitirán moverlo con el teclado." : ""}
        </span>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
          <div className="flex items-center gap-2">
            {isDraggable && !isStatic && (
              <Tooltip>
                <TooltipTrigger className="cursor-move drag-handle">
                  <GripVertical className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Arrastrar para mover</p>
                </TooltipContent>
              </Tooltip>
            )}
            <CardTitle id={titleId} className="text-base font-medium">{title}</CardTitle>
          </div>
          {isDraggable && !isStatic && (
            <div className="flex items-center gap-1">
              {onConfigure && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 group" onClick={onConfigure} aria-label={`Configurar widget ${title}`}>
                        <Settings className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Configurar widget</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {onRemove && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 group" onClick={onRemove} aria-label={`Quitar widget ${title}`}>
                        <X className="w-4 h-4 transition-colors duration-200 group-hover:text-red-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Quitar widget</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-4">
          {children}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
