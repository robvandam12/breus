
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Thermometer, Eye, Activity } from "lucide-react";

interface InmersionStep3Props {
  data: any;
  onUpdate: (updates: any) => void;
}

export const InmersionStep3 = ({ data, onUpdate }: InmersionStep3Props) => {
  const handleChange = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Condiciones y Detalles</h2>
        <p className="mt-2 text-gray-600">
          Configure las condiciones ambientales y detalles de la inmersión
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Condiciones de Buceo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="profundidad_max">Profundidad Máxima (m) *</Label>
              <Input
                id="profundidad_max"
                type="number"
                step="0.1"
                min="0"
                value={data.profundidad_max || ''}
                onChange={(e) => handleChange('profundidad_max', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
                className="ios-input"
              />
            </div>
            
            <div>
              <Label htmlFor="temperatura_agua">Temperatura del Agua (°C)</Label>
              <Input
                id="temperatura_agua"
                type="number"
                step="0.1"
                value={data.temperatura_agua || ''}
                onChange={(e) => handleChange('temperatura_agua', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
                className="ios-input"
              />
            </div>
            
            <div>
              <Label htmlFor="visibilidad">Visibilidad (m)</Label>
              <Input
                id="visibilidad"
                type="number"
                step="0.1"
                min="0"
                value={data.visibilidad || ''}
                onChange={(e) => handleChange('visibilidad', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
                className="ios-input"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="corriente">Condiciones de Corriente</Label>
            <Select 
              value={data.corriente || ''} 
              onValueChange={(value) => handleChange('corriente', value)}
            >
              <SelectTrigger className="ios-input">
                <SelectValue placeholder="Seleccionar condición de corriente..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nula">Nula (0 - 0.5 nudos)</SelectItem>
                <SelectItem value="ligera">Ligera (0.5 - 1 nudo)</SelectItem>
                <SelectItem value="moderada">Moderada (1 - 2 nudos)</SelectItem>
                <SelectItem value="fuerte">Fuerte (2+ nudos)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Observaciones Adicionales</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={data.observaciones || ''}
              onChange={(e) => handleChange('observaciones', e.target.value)}
              placeholder="Observaciones adicionales sobre la inmersión..."
              rows={4}
              className="ios-input"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
