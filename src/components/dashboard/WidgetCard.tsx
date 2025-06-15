
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GripVertical } from "lucide-react";

interface WidgetCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  isDraggable?: boolean;
}

export const WidgetCard = ({ title, children, className, isDraggable = false }: WidgetCardProps) => {
  return (
    <Card className={`w-full h-full flex flex-col overflow-hidden ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {isDraggable && <GripVertical className="w-5 h-5 text-muted-foreground cursor-move drag-handle" />}
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-4">
        {children}
      </CardContent>
    </Card>
  );
};
