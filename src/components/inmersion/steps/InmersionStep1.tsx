
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, FileText } from "lucide-react";

interface InmersionStep1Props {
  data: any;
  onUpdate: (updates: any) => void;
}

export const InmersionStep1 = ({ data, onUpdate }: InmersionStep1Props) => {
  const handleChange = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Datos Generales de la Inmersión</h2>
        <p className="mt-2 text-gray-600">
          Configure la información básica de la inmersión de buceo
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Información Básica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código de Inmersión *</Label>
              <Input
                id="codigo"
                value={data.codigo || ''}
                onChange={(e) => handleChange('codigo', e.target.value)}
                placeholder="Ej: INM-2024-001"
                className="ios-input"
              />
            </div>
            
            <div>
              <Label htmlFor="fecha_inmersion">Fecha de Inmersión *</Label>
              <Input
                id="fecha_inmersion"
                type="date"
                value={data.fecha_inmersion || ''}
                onChange={(e) => handleChange('fecha_inmersion', e.target.value)}
                className="ios-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hora_inicio">Hora de Inicio *</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={data.hora_inicio || ''}
                onChange={(e) => handleChange('hora_inicio', e.target.value)}
                className="ios-input"
              />
            </div>
            
            <div>
              <Label htmlFor="hora_fin">Hora de Fin (Estimada)</Label>
              <Input
                id="hora_fin"
                type="time"
                value={data.hora_fin || ''}
                onChange={(e) => handleChange('hora_fin', e.target.value)}
                className="ios-input"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="objetivo">Objetivo de la Inmersión *</Label>
            <Textarea
              id="objetivo"
              value={data.objetivo || ''}
              onChange={(e) => handleChange('objetivo', e.target.value)}
              placeholder="Describa el objetivo principal de esta inmersión"
              rows={3}
              className="ios-input"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
