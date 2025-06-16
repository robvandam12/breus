
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Hammer, Ship } from "lucide-react";
import { BitacoraSupervisorData } from '../BitacoraWizardFromInmersion';

interface BitacoraStep4TrabajosProps {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
}

export const BitacoraStep4Trabajos = ({ data, onUpdate }: BitacoraStep4TrabajosProps) => {
  const handleInputChange = (field: keyof BitacoraSupervisorData, value: any) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Trabajos Realizados</h2>
        <p className="mt-2 text-gray-600">
          Descripción detallada de las actividades realizadas
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hammer className="w-5 h-5 text-blue-600" />
              Trabajo Principal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Trabajo a Realizar</Label>
              <Input
                value={data.trabajo_a_realizar || ''}
                onChange={(e) => handleInputChange('trabajo_a_realizar', e.target.value)}
                placeholder="Descripción del trabajo principal"
              />
            </div>
            <div>
              <Label>Descripción Detallada del Trabajo</Label>
              <Textarea
                value={data.descripcion_trabajo || ''}
                onChange={(e) => handleInputChange('descripcion_trabajo', e.target.value)}
                placeholder="Describa en detalle el trabajo realizado..."
                className="min-h-[120px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="w-5 h-5 text-green-600" />
              Información de Apoyo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Embarcación de Apoyo</Label>
              <Input
                value={data.embarcacion_apoyo || ''}
                onChange={(e) => handleInputChange('embarcacion_apoyo', e.target.value)}
                placeholder="Nombre o identificación de la embarcación"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Observaciones Generales</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Observaciones Adicionales</Label>
              <Textarea
                value={data.observaciones_generales_texto || ''}
                onChange={(e) => handleInputChange('observaciones_generales_texto', e.target.value)}
                placeholder="Observaciones generales, incidentes, recomendaciones..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Hammer className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-sm text-green-800">
            <strong>Información:</strong> Documente de manera clara y detallada todos los trabajos 
            realizados durante la inmersión. Esta información es crucial para el seguimiento 
            y control de las operaciones.
          </div>
        </div>
      </div>
    </div>
  );
};
