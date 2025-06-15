
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Role, widgetRegistry, WidgetType } from "./widgetRegistry";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthRoles } from "@/hooks/useAuthRoles";

interface WidgetCatalogProps {
  onAddWidget: (widgetType: WidgetType) => void;
  currentWidgets: string[];
}

export const WidgetCatalog = ({ onAddWidget, currentWidgets }: WidgetCatalogProps) => {
  const { currentRole } = useAuthRoles();

  const availableWidgets = Object.entries(widgetRegistry).filter(
    ([key, config]) => {
      if (currentWidgets.includes(key)) {
        return false;
      }
      if (config.roles && !config.roles.includes(currentRole as Role)) {
        return false;
      }
      return true;
    }
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Widget
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Catálogo de Widgets</SheetTitle>
          <SheetDescription>
            Añade nuevos widgets a tu dashboard.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
          <div className="py-4 space-y-4">
            {availableWidgets.length > 0 ? (
              availableWidgets.map(([key, { name, description }]) => (
                <div key={key} className="p-4 border rounded-lg flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{name}</h3>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                  </div>
                  <SheetClose asChild>
                    <Button size="sm" onClick={() => onAddWidget(key as WidgetType)}>
                      Añadir
                    </Button>
                  </SheetClose>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-10">
                No hay más widgets para añadir.
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
