
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiXFormData, ESTADOS_PUERTO } from "@/types/multix";

interface MultiXStep1Props {
  formData: MultiXFormData;
  updateFormData: (updates: Partial<MultiXFormData>) => void;
  tipo: 'mantencion' | 'faena';
}

export const MultiXStep1 = ({ formData, updateFormData, tipo }: MultiXStep1Props) => {
  const handleChange = (field: keyof MultiXFormData, value: string | number) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lugar_trabajo">Lugar de trabajo (centro u otro) *</Label>
          <Input
            id="lugar_trabajo"
            value={formData.lugar_trabajo}
            onChange={(e) => handleChange('lugar_trabajo', e.target.value)}
            className="ios-input"
            required
          />
        </div>

        <div>
          <Label htmlFor="fecha">Fecha *</Label>
          <Input
            id="fecha"
            type="date"
            value={formData.fecha}
            onChange={(e) => handleChange('fecha', e.target.value)}
            className="ios-input"
            required
          />
        </div>

        <div>
          <Label htmlFor="temperatura">Temperatura (°C)</Label>
          <Input
            id="temperatura"
            type="number"
            step="0.1"
            value={formData.temperatura || ''}
            onChange={(e) => handleChange('temperatura', parseFloat(e.target.value) || 0)}
            className="ios-input"
          />
        </div>

        <div>
          <Label htmlFor="profundidad_max">Profundidad máxima (m)</Label>
          <Input
            id="profundidad_max"
            type="number"
            step="0.1"
            value={formData.profundidad_max || ''}
            onChange={(e) => handleChange('profundidad_max', parseFloat(e.target.value) || 0)}
            className="ios-input"
          />
        </div>

        <div>
          <Label htmlFor="hora_inicio">Hora inicio faena</Label>
          <Input
            id="hora_inicio"
            type="time"
            value={formData.hora_inicio || ''}
            onChange={(e) => handleChange('hora_inicio', e.target.value)}
            className="ios-input"
          />
        </div>

        <div>
          <Label htmlFor="hora_termino">Hora término faena</Label>
          <Input
            id="hora_termino"
            type="time"
            value={formData.hora_termino || ''}
            onChange={(e) => handleChange('hora_termino', e.target.value)}
            className="ios-input"
          />
        </div>

        <div>
          <Label htmlFor="nave_maniobras">Nave maniobras</Label>
          <Input
            id="nave_maniobras"
            value={formData.nave_maniobras || ''}
            onChange={(e) => handleChange('nave_maniobras', e.target.value)}
            className="ios-input"
          />
        </div>

        <div>
          <Label htmlFor="matricula_nave">Matrícula nave</Label>
          <Input
            id="matricula_nave"
            value={formData.matricula_nave || ''}
            onChange={(e) => handleChange('matricula_nave', e.target.value)}
            className="ios-input"
          />
        </div>

        <div>
          <Label htmlFor="team_s">Team S</Label>
          <Input
            id="team_s"
            value={formData.team_s || ''}
            onChange={(e) => handleChange('team_s', e.target.value)}
            className="ios-input"
          />
        </div>

        <div>
          <Label htmlFor="team_be">Team BE</Label>
          <Input
            id="team_be"
            value={formData.team_be || ''}
            onChange={(e) => handleChange('team_be', e.target.value)}
            className="ios-input"
          />
        </div>

        <div>
          <Label htmlFor="team_bi">Team BI</Label>
          <Input
            id="team_bi"
            value={formData.team_bi || ''}
            onChange={(e) => handleChange('team_bi', e.target.value)}
            className="ios-input"
          />
        </div>

        <div>
          <Label htmlFor="estado_puerto">Estado de puerto</Label>
          <Select
            value={formData.estado_puerto || ''}
            onValueChange={(value) => handleChange('estado_puerto', value)}
          >
            <SelectTrigger className="ios-input">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              {ESTADOS_PUERTO.map((estado) => (
                <SelectItem key={estado} value={estado}>
                  {estado}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
