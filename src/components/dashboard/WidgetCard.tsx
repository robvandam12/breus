
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, X } from "lucide-react";

interface WidgetCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  isDraggable?: boolean;
  onRemove?: () => void;
  isStatic?: boolean;
}

export const WidgetCard = ({ title, children, className, isDraggable = false, onRemove, isStatic = false }: WidgetCardProps) => {
  return (
    <Card className={`w-full h-full flex flex-col overflow-hidden ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
        <div className="flex items-center gap-2">
          {isDraggable && !isStatic && <GripVertical className="w-5 h-5 text-muted-foreground cursor-move drag-handle" />}
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </div>
        {isDraggable && !isStatic && onRemove && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRemove}>
                <X className="w-4 h-4" />
                <span className="sr-only">Quitar widget</span>
            </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-4">
        {children}
      </CardContent>
    </Card>
  );
};
