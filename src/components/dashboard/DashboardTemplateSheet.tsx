import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useDashboardTemplates, DashboardTemplate } from "@/hooks/useDashboardTemplates";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Layouts } from "react-grid-layout";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { Loader2, Save } from "lucide-react";

interface DashboardTemplateSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: DashboardTemplate) => void;
  currentLayouts: Layouts;
  currentWidgets: any;
}

export const DashboardTemplateSheet = ({
  isOpen,
  onClose,
  onApplyTemplate,
  currentLayouts,
  currentWidgets,
}: DashboardTemplateSheetProps) => {
  const { templates, isLoading, saveAsTemplate, isSavingTemplate } = useDashboardTemplates();
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDescription, setNewTemplateDescription] = useState("");

  const handleApply = (template: DashboardTemplate) => {
    onApplyTemplate(template);
    // The toast and onClose are now handled by the hook after validation.
  };

  const handleSaveCurrent = async () => {
    if (!newTemplateName.trim()) {
        toast({ title: "Nombre requerido", description: "Por favor, dale un nombre a tu plantilla.", variant: "destructive" });
        return;
    }
    try {
        await saveAsTemplate({
            name: newTemplateName,
            description: newTemplateDescription,
            layout_config: currentLayouts,
            widget_configs: currentWidgets,
        });
        setNewTemplateName("");
        setNewTemplateDescription("");
    } catch(e) {
        // error toast is handled by the hook
    }
  };

  const systemTemplates = templates.filter(t => t.type === 'system');
  const userTemplates = templates.filter(t => t.type === 'user');

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Gestionar Plantillas de Dashboard</SheetTitle>
          <SheetDescription>
            Aplica una plantilla existente o guarda tu diseño actual como una nueva.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-4">
            <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <h3 className="font-semibold text-base">Guardar diseño actual como plantilla</h3>
                <Input 
                    placeholder="Nombre de la plantilla"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                />
                <Textarea 
                    placeholder="Descripción (opcional)"
                    value={newTemplateDescription}
                    onChange={(e) => setNewTemplateDescription(e.target.value)}
                    rows={2}
                />
                <Button onClick={handleSaveCurrent} disabled={isSavingTemplate}>
                    {isSavingTemplate ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar Plantilla
                </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-28rem)] pr-4">
                <div className="space-y-4">
                    {isLoading ? <p>Cargando plantillas...</p> : (
                        <>
                           {systemTemplates.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold mb-2">Plantillas del Sistema</h3>
                                    {systemTemplates.map(template => (
                                        <TemplateItem key={template.id} template={template} onApply={handleApply} />
                                    ))}
                                </div>
                           )}
                           {userTemplates.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold mb-2">Mis Plantillas</h3>
                                    {userTemplates.map(template => (
                                        <TemplateItem key={template.id} template={template} onApply={handleApply} />
                                    ))}
                                </div>
                           )}
                           {systemTemplates.length === 0 && userTemplates.length === 0 && !isLoading && (
                               <p className="text-muted-foreground text-sm text-center py-4">No hay plantillas disponibles.</p>
                           )}
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const TemplateItem = ({ template, onApply }: { template: DashboardTemplate, onApply: (template: DashboardTemplate) => void }) => {
    return (
        <div className="p-3 border rounded-lg flex items-center justify-between hover:bg-muted/50 transition-colors">
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate">{template.name}</h4>
                {template.description && <p className="text-sm text-muted-foreground truncate">{template.description}</p>}
            </div>
            <Button size="sm" variant="outline" onClick={() => onApply(template)} className="ml-2 flex-shrink-0">
                Aplicar
            </Button>
        </div>
    );
}
