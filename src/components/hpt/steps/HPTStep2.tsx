
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, HardHat, Eye, Hand, Shirt, Users } from "lucide-react";

interface HPTStep2Props {
  data: any;
  onUpdate: (data: any) => void;
  operacionId: string;
  teamMembers: any[];
}

export const HPTStep2 = ({ data, onUpdate, operacionId, teamMembers }: HPTStep2Props) => {
  const handleEPPChange = (key: string, checked: boolean) => {
    const currentEPP = data.hpt_epp || {};
    onUpdate({
      hpt_epp: {
        ...currentEPP,
        [key]: checked
      }
    });
  };

  const handleEPPOtrosChange = (value: string) => {
    const currentEPP = data.hpt_epp || {};
    onUpdate({
      hpt_epp: {
        ...currentEPP,
        otros: value
      }
    });
  };

  const eppItems = [
    { key: 'casco', label: 'Casco de Seguridad', icon: HardHat },
    { key: 'lentes', label: 'Lentes de Seguridad', icon: Eye },
    { key: 'guantes', label: 'Guantes de Trabajo', icon: Hand },
    { key: 'botas', label: 'Botas de Seguridad', icon: Shield },
    { key: 'chaleco', label: 'Chaleco Salvavidas', icon: Shirt },
    { key: 'respirador', label: 'Respirador/Mascarilla', icon: Shield },
    { key: 'arnes', label: 'Arnés de Seguridad', icon: Shield }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Equipo de Protección Personal (EPP)</h2>
        <p className="mt-2 text-gray-600">
          Seleccione los elementos de protección personal requeridos para esta tarea
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            EPP Requerido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eppItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={item.key}
                    checked={data.hpt_epp?.[item.key] || false}
                    onCheckedChange={(checked) => handleEPPChange(item.key, checked as boolean)}
                  />
                  <IconComponent className="w-5 h-5 text-gray-500" />
                  <Label htmlFor={item.key} className="flex-1 cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <Label htmlFor="epp_otros">Otros EPP (especificar)</Label>
            <Input
              id="epp_otros"
              value={data.hpt_epp?.otros || ''}
              onChange={(e) => handleEPPOtrosChange(e.target.value)}
              placeholder="Especifique otros elementos de protección personal..."
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {teamMembers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Equipo de Trabajo Asignado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{member.nombre_completo}</p>
                    <p className="text-sm text-gray-600">{member.rol}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <strong>Importante:</strong> Todo el personal debe usar el EPP seleccionado durante toda la operación. 
            Verifique que todos los elementos estén en buen estado antes del inicio de los trabajos.
          </div>
        </div>
      </div>
    </div>
  );
};
