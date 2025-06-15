
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, X, Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  return (
    <TooltipProvider>
      <Card className={`w-full h-full flex flex-col overflow-hidden ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
          <div className="flex items-center gap-2">
            {isDraggable && !isStatic && (
              <Tooltip>
                <TooltipTrigger className="cursor-move drag-handle">
                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Arrastrar para mover</p>
                </TooltipContent>
              </Tooltip>
            )}
            <CardTitle className="text-base font-medium">{title}</CardTitle>
          </div>
          {isDraggable && !isStatic && (
            <div className="flex items-center gap-1">
              {onConfigure && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 group" onClick={onConfigure}>
                        <Settings className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
                        <span className="sr-only">Configurar widget</span>
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
                    <Button variant="ghost" size="icon" className="h-6 w-6 group" onClick={onRemove}>
                        <X className="w-4 h-4 transition-colors duration-200 group-hover:text-red-500" />
                        <span className="sr-only">Quitar widget</span>
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
