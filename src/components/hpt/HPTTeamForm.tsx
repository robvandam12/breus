
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HPTTeamFormProps {
  data: any;
  operacionData?: any;
  onChange: (data: any) => void;
}

export const HPTTeamForm = ({ data, operacionData, onChange }: HPTTeamFormProps) => {
  const handleChange = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipo de Trabajo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="empresa_servicio_nombre">Empresa de Servicio</Label>
          <Input
            id="empresa_servicio_nombre"
            value={data.empresa_servicio_nombre || ''}
            onChange={(e) => handleChange('empresa_servicio_nombre', e.target.value)}
            placeholder="Nombre de la empresa"
          />
        </div>

        <div>
          <Label htmlFor="centro_trabajo_nombre">Centro de Trabajo</Label>
          <Input
            id="centro_trabajo_nombre"
            value={data.centro_trabajo_nombre || ''}
            onChange={(e) => handleChange('centro_trabajo_nombre', e.target.value)}
            placeholder="Nombre del centro de trabajo"
          />
        </div>

        <div>
          <Label htmlFor="jefe_mandante_nombre">Jefe Mandante</Label>
          <Input
            id="jefe_mandante_nombre"
            value={data.jefe_mandante_nombre || ''}
            onChange={(e) => handleChange('jefe_mandante_nombre', e.target.value)}
            placeholder="Nombre del jefe mandante"
          />
        </div>
      </CardContent>
    </Card>
  );
};
