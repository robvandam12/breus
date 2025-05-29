
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, FileText } from "lucide-react";
import { BitacoraSupervisorData } from "../BitacoraWizard";

interface BitacoraStep1Props {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
}

export const BitacoraStep1 = ({ data, onUpdate }: BitacoraStep1Props) => {
  const handleInputChange = (field: keyof BitacoraSupervisorData, value: any) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Información General</h2>
        <p className="mt-2 text-gray-600">
          Datos básicos de la bitácora de supervisor
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Información Básica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="codigo">Código</Label>
            <Input
              id="codigo"
              value={data.codigo}
              onChange={(e) => handleInputChange('codigo', e.target.value)}
              placeholder="Código de la bitácora"
            />
          </div>
          
          <div>
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={data.fecha}
              onChange={(e) => handleInputChange('fecha', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="supervisor">Supervisor</Label>
            <Input
              id="supervisor"
              value={data.supervisor}
              onChange={(e) => handleInputChange('supervisor', e.target.value)}
              placeholder="Nombre del supervisor"
            />
          </div>

          <div>
            <Label htmlFor="desarrollo_inmersion">Desarrollo de la Inmersión</Label>
            <Textarea
              id="desarrollo_inmersion"
              value={data.desarrollo_inmersion}
              onChange={(e) => handleInputChange('desarrollo_inmersion', e.target.value)}
              placeholder="Describe cómo se desarrolló la inmersión..."
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="incidentes">Incidentes (Opcional)</Label>
            <Textarea
              id="incidentes"
              value={data.incidentes || ''}
              onChange={(e) => handleInputChange('incidentes', e.target.value)}
              placeholder="Describe cualquier incidente..."
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="evaluacion_general">Evaluación General</Label>
            <Textarea
              id="evaluacion_general"
              value={data.evaluacion_general}
              onChange={(e) => handleInputChange('evaluacion_general', e.target.value)}
              placeholder="Evaluación general de la inmersión..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <strong>Información:</strong> Complete todos los campos requeridos para continuar con el siguiente paso.
          </div>
        </div>
      </div>
    </div>
  );
};
