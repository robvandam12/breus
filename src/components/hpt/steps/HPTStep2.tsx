
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, HardHat, Eye, Hand } from "lucide-react";

interface HPTStep2Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep2 = ({ data, onUpdate }: HPTStep2Props) => {
  const handleEPPChange = (item: string, checked: boolean) => {
    const currentEPP = data.hpt_epp || {};
    onUpdate({
      hpt_epp: {
        ...currentEPP,
        [item]: checked
      }
    });
  };

  const handleERCChange = (item: string, checked: boolean) => {
    const currentERC = data.hpt_erc || {};
    onUpdate({
      hpt_erc: {
        ...currentERC,
        [item]: checked
      }
    });
  };

  const eppItems = [
    { key: 'casco', label: 'Casco de Seguridad', icon: HardHat },
    { key: 'lentes', label: 'Lentes de Seguridad', icon: Eye },
    { key: 'guantes', label: 'Guantes de Protección', icon: Hand },
    { key: 'chaleco', label: 'Chaleco Salvavidas' },
    { key: 'botas', label: 'Botas de Seguridad' },
    { key: 'traje_buceo', label: 'Traje de Buceo' },
    { key: 'mascara', label: 'Máscara de Buceo' },
    { key: 'aletas', label: 'Aletas' },
    { key: 'cinturon_lastre', label: 'Cinturón de Lastre' },
    { key: 'regulador', label: 'Regulador' },
    { key: 'manometro', label: 'Manómetro' },
    { key: 'profundimetro', label: 'Profundímetro' }
  ];

  const ercItems = [
    { key: 'izaje', label: 'Izaje y Grúas' },
    { key: 'buceo', label: 'Buceo y Trabajo Subacuático' },
    { key: 'navegacion', label: 'Navegación Marítima' },
    { key: 'energia_electrica', label: 'Energía Eléctrica' },
    { key: 'espacios_confinados', label: 'Espacios Confinados' },
    { key: 'trabajo_altura', label: 'Trabajo en Altura' },
    { key: 'sustancias_peligrosas', label: 'Sustancias Peligrosas' },
    { key: 'soldadura', label: 'Soldadura y Corte' },
    { key: 'herramientas_poder', label: 'Herramientas de Poder' },
    { key: 'manejo_manual', label: 'Manejo Manual de Materiales' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Equipo de Protección Personal y Estándares de Riesgos Críticos</h2>
        <p className="mt-2 text-gray-600">
          Verificación de EPP y identificación de ERC aplicables
        </p>
      </div>

      {/* Equipo de Protección Personal (EPP) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Equipo de Protección Personal (EPP)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eppItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  {IconComponent && <IconComponent className="w-5 h-5 text-gray-600" />}
                  <Checkbox
                    id={`epp_${item.key}`}
                    checked={data.hpt_epp?.[item.key] || false}
                    onCheckedChange={(checked) => handleEPPChange(item.key, checked as boolean)}
                  />
                  <Label htmlFor={`epp_${item.key}`} className="text-sm font-medium cursor-pointer flex-1">
                    {item.label}
                  </Label>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Estándares de Riesgos Críticos (ERC) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            Estándares de Riesgos Críticos (ERC)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ercItems.map((item) => (
              <div key={item.key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={`erc_${item.key}`}
                  checked={data.hpt_erc?.[item.key] || false}
                  onCheckedChange={(checked) => handleERCChange(item.key, checked as boolean)}
                />
                <Label htmlFor={`erc_${item.key}`} className="text-sm font-medium cursor-pointer flex-1">
                  {item.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <strong>Importante:</strong> Seleccione todos los elementos de EPP requeridos y los ERC aplicables para esta tarea específica. 
            Esta información es crítica para la evaluación de riesgos y planificación de medidas de control.
          </div>
        </div>
      </div>
    </div>
  );
};
