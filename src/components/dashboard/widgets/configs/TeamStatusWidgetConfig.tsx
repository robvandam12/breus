
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface TeamStatusWidgetConfigProps {
    config: {
        showInactive?: boolean;
        showSuspended?: boolean;
    };
    onChange: (newConfig: any) => void;
}

export default function TeamStatusWidgetConfig({ config, onChange }: TeamStatusWidgetConfigProps) {
    const handleShowInactiveChange = (checked: boolean) => {
        onChange({ ...config, showInactive: checked });
    };
    
    const handleShowSuspendedChange = (checked: boolean) => {
        onChange({ ...config, showSuspended: checked });
    };

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Selecciona qué estados de buzos quieres visualizar en el widget. Por defecto, solo se muestran los activos.
            </p>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <Label htmlFor="show-inactive" className="cursor-pointer">Mostrar miembros inactivos</Label>
                <Switch
                    id="show-inactive"
                    checked={!!config.showInactive}
                    onCheckedChange={handleShowInactiveChange}
                />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <Label htmlFor="show-suspended" className="cursor-pointer">Mostrar miembros suspendidos</Label>
                <Switch
                    id="show-suspended"
                    checked={!!config.showSuspended}
                    onCheckedChange={handleShowSuspendedChange}
                />
            </div>
        </div>
    );
}
