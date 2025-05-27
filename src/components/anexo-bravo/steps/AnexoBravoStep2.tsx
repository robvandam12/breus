
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, CreditCard, Shield } from "lucide-react";

interface AnexoBravoStep2Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const AnexoBravoStep2 = ({ data, onUpdate }: AnexoBravoStep2Props) => {
  const handleInputChange = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Identificación del Buzo o Empresa de Buceo</h2>
        <p className="mt-2 text-gray-600">
          Información de certificación y identificación del personal de buceo
        </p>
      </div>

      {/* Buzo Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Buzo Principal o Empresa de Buceo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buzo_empresa">Nombre del Buzo o Empresa</Label>
              <Input
                id="buzo_empresa"
                value={data.buzo_o_empresa_nombre || ''}
                onChange={(e) => handleInputChange('buzo_o_empresa_nombre', e.target.value)}
                placeholder="Nombre completo o razón social"
              />
            </div>

            <div>
              <Label htmlFor="buzo_matricula">Matrícula</Label>
              <Input
                id="buzo_matricula"
                value={data.buzo_matricula || ''}
                onChange={(e) => handleInputChange('buzo_matricula', e.target.value)}
                placeholder="Número de matrícula"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 border rounded-lg bg-blue-50">
            <Checkbox
              id="autorizacion_armada"
              checked={data.autorizacion_armada || false}
              onCheckedChange={(checked) => handleInputChange('autorizacion_armada', checked)}
            />
            <Label htmlFor="autorizacion_armada" className="text-sm font-medium cursor-pointer flex-1">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                Autorización de la Autoridad Marítima (Adjuntar copia)
              </div>
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Asistente de Buzo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Asistente de Buzo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="asistente_nombre">Nombre del Asistente</Label>
              <Input
                id="asistente_nombre"
                value={data.asistente_buzo_nombre || ''}
                onChange={(e) => handleInputChange('asistente_buzo_nombre', e.target.value)}
                placeholder="Nombre completo del asistente"
              />
            </div>

            <div>
              <Label htmlFor="asistente_matricula">Matrícula del Asistente</Label>
              <Input
                id="asistente_matricula"
                value={data.asistente_buzo_matricula || ''}
                onChange={(e) => handleInputChange('asistente_buzo_matricula', e.target.value)}
                placeholder="Número de matrícula del asistente"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-sm text-amber-800">
            <strong>Importante:</strong> Verifique que todas las matrículas estén vigentes y que se cuente 
            con la autorización correspondiente de la Autoridad Marítima. Es obligatorio adjuntar copia 
            de las certificaciones.
          </div>
        </div>
      </div>
    </div>
  );
};
