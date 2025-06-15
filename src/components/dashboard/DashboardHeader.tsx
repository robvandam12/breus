
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, Save, Loader2, RotateCcw, LayoutTemplate } from 'lucide-react';
import { WidgetCatalog } from './WidgetCatalog';
import { WidgetType } from './widgetRegistry';

interface DashboardHeaderProps {
    isEditMode: boolean;
    isSaving: boolean;
    isResetting: boolean;
    currentWidgetIds: string[];
    onToggleEdit: () => void;
    onSave: () => void;
    onResetConfirm: () => void;
    onAddWidget: (widgetType: WidgetType) => void;
    onManageTemplates: () => void;
}

export const DashboardHeader = ({
    isEditMode,
    isSaving,
    isResetting,
    currentWidgetIds,
    onToggleEdit,
    onSave,
    onResetConfirm,
    onAddWidget,
    onManageTemplates,
}: DashboardHeaderProps) => {
    return (
        <TooltipProvider>
            <div className="flex justify-end gap-2">
                {isEditMode ? (
                    <>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" onClick={onManageTemplates}>
                                    <LayoutTemplate className="mr-2 h-4 w-4" />
                                    Plantillas
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Aplicar una plantilla o guardar el diseño actual.</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div>
                                    <WidgetCatalog 
                                        onAddWidget={onAddWidget}
                                        currentWidgets={currentWidgetIds}
                                    />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Añadir nuevos widgets desde el catálogo.</p>
                            </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                            <TooltipTrigger asChild>
                                     <Button variant="outline" onClick={onResetConfirm} disabled={isSaving || isResetting}>
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Restaurar
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Restaurar el diseño por defecto para tu rol.</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={onSave} disabled={isSaving || isResetting}>
                                    {isSaving || isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    {isSaving ? 'Guardando...' : (isResetting ? 'Restaurando...' : 'Guardar Diseño')}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Guardar la disposición y configuración de tu dashboard.</p>
                            </TooltipContent>
                        </Tooltip>
                    </>
                ) : (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline" onClick={onToggleEdit}>
                                <Edit className="mr-2 h-4 w-4" /> Personalizar
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Activar modo edición para mover, quitar o configurar widgets.</p>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
        </TooltipProvider>
    );
};
