
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AlertsPanelWidgetConfigProps {
    config: {
        alertType?: 'general' | 'security';
    };
    onChange: (newConfig: any) => void;
}

export const AlertsPanelWidgetConfig = ({ config, onChange }: AlertsPanelWidgetConfigProps) => {
    const handleAlertTypeChange = (value: 'general' | 'security') => {
        onChange({ ...config, alertType: value });
    };

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Selecciona el tipo de alertas que deseas visualizar en este widget.
            </p>
            <RadioGroup
                value={config.alertType || 'general'}
                onValueChange={handleAlertTypeChange}
                className="space-y-2"
            >
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="general" id="r1" />
                    <Label htmlFor="r1" className="cursor-pointer w-full">
                        <span className="font-semibold">Alertas Generales</span>
                        <p className="text-xs text-muted-foreground">Vista simplificada de las alertas del sistema (bitácoras, HPT, etc.).</p>
                    </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="security" id="r2" />
                    <Label htmlFor="r2" className="cursor-pointer w-full">
                        <span className="font-semibold">Alertas de Seguridad</span>
                        <p className="text-xs text-muted-foreground">Panel avanzado para monitorear y reconocer alertas de seguridad críticas en tiempo real.</p>
                    </Label>
                </div>
            </RadioGroup>
        </div>
    );
};
