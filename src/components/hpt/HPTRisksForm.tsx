
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface HPTRisksFormProps {
  data: any;
  onChange: (data: any) => void;
}

export const HPTRisksForm = ({ data, onChange }: HPTRisksFormProps) => {
  const handleERCChange = (field: string, checked: boolean) => {
    onChange({
      hpt_erc: {
        ...data.hpt_erc,
        [field]: checked
      }
    });
  };

  const handleERCOtherChange = (value: string) => {
    onChange({
      hpt_erc: {
        ...data.hpt_erc,
        otros: value
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estándares de Riesgos Críticos (ERC)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="izaje"
              checked={data.hpt_erc?.izaje || false}
              onCheckedChange={(checked) => handleERCChange('izaje', !!checked)}
            />
            <Label htmlFor="izaje">Izaje</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="buceo"
              checked={data.hpt_erc?.buceo || false}
              onCheckedChange={(checked) => handleERCChange('buceo', !!checked)}
            />
            <Label htmlFor="buceo">Buceo</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="navegacion"
              checked={data.hpt_erc?.navegacion || false}
              onCheckedChange={(checked) => handleERCChange('navegacion', !!checked)}
            />
            <Label htmlFor="navegacion">Navegación</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="trabajo_altura"
              checked={data.hpt_erc?.trabajo_altura || false}
              onCheckedChange={(checked) => handleERCChange('trabajo_altura', !!checked)}
            />
            <Label htmlFor="trabajo_altura">Trabajo en Altura</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="espacios_confinados"
              checked={data.hpt_erc?.espacios_confinados || false}
              onCheckedChange={(checked) => handleERCChange('espacios_confinados', !!checked)}
            />
            <Label htmlFor="espacios_confinados">Espacios Confinados</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="energia_peligrosa"
              checked={data.hpt_erc?.energia_peligrosa || false}
              onCheckedChange={(checked) => handleERCChange('energia_peligrosa', !!checked)}
            />
            <Label htmlFor="energia_peligrosa">Energía Peligrosa</Label>
          </div>
        </div>

        <div>
          <Label htmlFor="otros_riesgos">Otros Riesgos</Label>
          <Textarea
            id="otros_riesgos"
            value={data.hpt_erc?.otros || ''}
            onChange={(e) => handleERCOtherChange(e.target.value)}
            placeholder="Especificar otros riesgos"
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
};
