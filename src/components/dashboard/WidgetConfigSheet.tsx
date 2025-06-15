
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { WidgetType, widgetRegistry } from "./widgetRegistry";
import React, { useState, useEffect } from "react";

interface WidgetConfigSheetProps {
  isOpen: boolean;
  onClose: () => void;
  widgetId: WidgetType | null;
  currentConfig: any;
  onSave: (widgetId: WidgetType, config: any) => void;
}

export const WidgetConfigSheet = ({
  isOpen,
  onClose,
  widgetId,
  currentConfig,
  onSave,
}: WidgetConfigSheetProps) => {
  const [localConfig, setLocalConfig] = useState(currentConfig || {});

  useEffect(() => {
    setLocalConfig(currentConfig || {});
  }, [currentConfig, isOpen]);

  if (!widgetId) return null;

  const widgetInfo = widgetRegistry[widgetId];
  if (!widgetInfo) return null;
  
  const { name: widgetName, configComponent: ConfigComponent } = widgetInfo;

  const handleSave = () => {
    if(widgetId) {
        onSave(widgetId, localConfig);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Configurar: {widgetName}</SheetTitle>
          <SheetDescription>
            Personaliza las opciones para este widget.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
            {ConfigComponent ? (
                <ConfigComponent config={localConfig} onChange={setLocalConfig} />
            ) : (
                <p className="text-muted-foreground">Este widget no tiene opciones de configuración.</p>
            )}
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
          </SheetClose>
          {ConfigComponent && 
            <SheetClose asChild>
                <Button onClick={handleSave}>Guardar Cambios</Button>
            </SheetClose>
          }
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
