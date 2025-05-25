
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EnhancedDigitalSignature } from "@/components/signatures/EnhancedDigitalSignature";
import { FileText, AlertCircle } from "lucide-react";

interface HPTStep6Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep6 = ({ data, onUpdate }: HPTStep6Props) => {
  const handleSupervisorSign = (signatureData: { signature: string; signerName: string; timestamp: string }) => {
    onUpdate({ 
      supervisor_firma: signatureData.signature,
      supervisor_nombre: signatureData.signerName,
      supervisor_timestamp: signatureData.timestamp
    });
  };

  const handleJefeObraSign = (signatureData: { signature: string; signerName: string; timestamp: string }) => {
    onUpdate({ 
      jefe_obra_firma: signatureData.signature,
      jefe_obra_nombre: signatureData.signerName,
      jefe_obra_timestamp: signatureData.timestamp
    });
  };

  const resetSupervisorSign = () => {
    onUpdate({ 
      supervisor_firma: null,
      supervisor_nombre: null,
      supervisor_timestamp: null
    });
  };

  const resetJefeObraSign = () => {
    onUpdate({ 
      jefe_obra_firma: null,
      jefe_obra_nombre: null,
      jefe_obra_timestamp: null
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Autorizaciones y Firmas</h2>
        <p className="mt-2 text-gray-600">
          Aprobación final y firmas digitales de responsables
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Observaciones Finales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="observaciones">Observaciones Adicionales</Label>
            <Textarea
              id="observaciones"
              value={data.observaciones || ''}
              onChange={(e) => onUpdate({ observaciones: e.target.value })}
              placeholder="Agregue cualquier observación adicional relevante para la operación..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnhancedDigitalSignature
          title="Firma del Supervisor de Servicios"
          role="Supervisor de Servicios"
          signerName={data.supervisor_nombre}
          isSigned={!!data.supervisor_firma}
          onSign={handleSupervisorSign}
          onReset={resetSupervisorSign}
          iconColor="text-blue-600"
          requireSignerName={true}
        />

        <EnhancedDigitalSignature
          title="Firma del Jefe de Obra / Mandante"
          role="Jefe de Obra / Representante Mandante"
          signerName={data.jefe_obra_nombre}
          isSigned={!!data.jefe_obra_firma}
          onSign={handleJefeObraSign}
          onReset={resetJefeObraSign}
          iconColor="text-orange-600"
          requireSignerName={true}
        />
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-sm text-amber-800">
              <strong>Importante:</strong> Una vez firmada por ambas partes, esta HPT queda oficialmente aprobada para ejecución. 
              Asegúrese de que toda la información sea correcta antes de finalizar. Las firmas digitales incluyen timestamp 
              y datos del firmante para trazabilidad completa.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
