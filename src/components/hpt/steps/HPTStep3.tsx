
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Zap, Anchor, Mountain, Home, Wrench, AlertCircle } from "lucide-react";
import { HPTWizardData } from "@/hooks/useHPTWizard";

interface HPTStep3Props {
  data: HPTWizardData;
  onUpdate: (updates: Partial<HPTWizardData>) => void;
}

export const HPTStep3: React.FC<HPTStep3Props> = ({ data, onUpdate }) => {
  const handleERCChange = (field: keyof typeof data.hpt_erc, checked: boolean) => {
    onUpdate({
      hpt_erc: {
        ...data.hpt_erc,
        [field]: checked
      }
    });
  };

  const handleOtrosERCChange = (value: string) => {
    onUpdate({
      hpt_erc: {
        ...data.hpt_erc,
        otros: value
      }
    });
  };

  const ercItems = [
    { key: 'izaje', label: 'Izaje y Manipulación de Cargas', icon: Mountain },
    { key: 'buceo', label: 'Buceo Comercial', icon: Anchor },
    { key: 'navegacion', label: 'Navegación y Transporte Marítimo', icon: Anchor },
    { key: 'trabajo_altura', label: 'Trabajo en Altura', icon: Mountain },
    { key: 'espacios_confinados', label: 'Espacios Confinados', icon: Home },
    { key: 'energia_peligrosa', label: 'Energía Peligrosa', icon: Zap },
    { key: 'materiales_peligrosos', label: 'Materiales Peligrosos', icon: AlertCircle }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Estándares de Riesgos Críticos (ERC)</h2>
        <p className="mt-2 text-gray-600">
          Seleccione los estándares de riesgos críticos aplicables a esta tarea
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Estándares de Riesgos Críticos Aplicables
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ercItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={item.key}
                    checked={Boolean(data.hpt_erc[item.key as keyof typeof data.hpt_erc])}
                    onCheckedChange={(checked) => handleERCChange(item.key as keyof typeof data.hpt_erc, Boolean(checked))}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <IconComponent className="w-4 h-4 text-gray-600" />
                    <Label htmlFor={item.key} className="text-sm font-medium cursor-pointer">
                      {item.label}
                    </Label>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 mt-6">
            <Label htmlFor="otros_erc">Otros ERC</Label>
            <Input
              id="otros_erc"
              value={data.hpt_erc.otros || ''}
              onChange={(e) => handleOtrosERCChange(e.target.value)}
              placeholder="Especifique otros estándares de riesgos críticos"
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-sm text-amber-800">
            <strong>Importante:</strong> Seleccione al menos un Estándar de Riesgo Crítico que aplique a la tarea. 
            Para trabajos de buceo comercial, siempre debe seleccionar "Buceo Comercial". 
            Los ERC seleccionados determinarán los controles y medidas de seguridad requeridos.
          </div>
        </div>
      </div>
    </div>
  );
};
