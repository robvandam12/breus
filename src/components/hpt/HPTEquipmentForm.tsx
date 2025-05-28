
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface HPTEquipmentFormProps {
  data: any;
  onChange: (data: any) => void;
}

export const HPTEquipmentForm = ({ data, onChange }: HPTEquipmentFormProps) => {
  const handleEPPChange = (field: string, checked: boolean) => {
    onChange({
      hpt_epp: {
        ...data.hpt_epp,
        [field]: checked
      }
    });
  };

  const handleEPPOtherChange = (value: string) => {
    onChange({
      hpt_epp: {
        ...data.hpt_epp,
        otros: value
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipos de Protección Personal (EPP)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="casco"
              checked={data.hpt_epp?.casco || false}
              onCheckedChange={(checked) => handleEPPChange('casco', !!checked)}
            />
            <Label htmlFor="casco">Casco</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="lentes"
              checked={data.hpt_epp?.lentes || false}
              onCheckedChange={(checked) => handleEPPChange('lentes', !!checked)}
            />
            <Label htmlFor="lentes">Lentes</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="guantes"
              checked={data.hpt_epp?.guantes || false}
              onCheckedChange={(checked) => handleEPPChange('guantes', !!checked)}
            />
            <Label htmlFor="guantes">Guantes</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="botas"
              checked={data.hpt_epp?.botas || false}
              onCheckedChange={(checked) => handleEPPChange('botas', !!checked)}
            />
            <Label htmlFor="botas">Botas</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="chaleco"
              checked={data.hpt_epp?.chaleco || false}
              onCheckedChange={(checked) => handleEPPChange('chaleco', !!checked)}
            />
            <Label htmlFor="chaleco">Chaleco</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="arnes"
              checked={data.hpt_epp?.arnes || false}
              onCheckedChange={(checked) => handleEPPChange('arnes', !!checked)}
            />
            <Label htmlFor="arnes">Arnés</Label>
          </div>
        </div>

        <div>
          <Label htmlFor="otros_epp">Otros EPP</Label>
          <Textarea
            id="otros_epp"
            value={data.hpt_epp?.otros || ''}
            onChange={(e) => handleEPPOtherChange(e.target.value)}
            placeholder="Especificar otros EPP"
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
};
