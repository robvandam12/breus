
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HPTBasicInfoFormProps {
  data: any;
  operacionData?: any;
  onChange: (data: any) => void;
}

export const HPTBasicInfoForm = ({ data, operacionData, onChange }: HPTBasicInfoFormProps) => {
  const handleChange = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Básica</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="codigo">Código</Label>
            <Input
              id="codigo"
              value={data.codigo || ''}
              onChange={(e) => handleChange('codigo', e.target.value)}
              placeholder="HPT-2024-001"
            />
          </div>
          <div>
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={data.fecha || ''}
              onChange={(e) => handleChange('fecha', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="supervisor_nombre">Supervisor</Label>
          <Input
            id="supervisor_nombre"
            value={data.supervisor_nombre || ''}
            onChange={(e) => handleChange('supervisor_nombre', e.target.value)}
            placeholder="Nombre del supervisor"
          />
        </div>

        <div>
          <Label htmlFor="descripcion_tarea">Descripción de la Tarea</Label>
          <Textarea
            id="descripcion_tarea"
            value={data.descripcion_tarea || ''}
            onChange={(e) => handleChange('descripcion_tarea', e.target.value)}
            placeholder="Describa la tarea a realizar"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="lugar_especifico">Lugar Específico</Label>
          <Input
            id="lugar_especifico"
            value={data.lugar_especifico || ''}
            onChange={(e) => handleChange('lugar_especifico', e.target.value)}
            placeholder="Ubicación específica de la tarea"
          />
        </div>
      </CardContent>
    </Card>
  );
};
