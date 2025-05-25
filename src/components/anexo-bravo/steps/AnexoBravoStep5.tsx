
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EnhancedDigitalSignature } from "@/components/signatures/EnhancedDigitalSignature";
import { FileText, AlertCircle } from "lucide-react";

interface AnexoBravoStep5Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const AnexoBravoStep5 = ({ data, onUpdate }: AnexoBravoStep5Props) => {
  const handleSupervisorServicioSign = (signatureData: { signature: string; signerName: string; timestamp: string }) => {
    onUpdate({ 
      supervisor_servicio_firma: signatureData.signature,
      supervisor_servicio_nombre: signatureData.signerName,
      supervisor_servicio_timestamp: signatureData.timestamp
    });
  };

  const handleSupervisorMandanteSign = (signatureData: { signature: string; signerName: string; timestamp: string }) => {
    onUpdate({ 
      supervisor_mandante_firma: signatureData.signature,
      supervisor_mandante_nombre: signatureData.signerName,
      supervisor_mandante_timestamp: signatureData.timestamp
    });
  };

  const resetSupervisorServicioSign = () => {
    onUpdate({ 
      supervisor_servicio_firma: null,
      supervisor_servicio_nombre: null,
      supervisor_servicio_timestamp: null
    });
  };

  const resetSupervisorMandanteSign = () => {
    onUpdate({ 
      supervisor_mandante_firma: null,
      supervisor_mandante_nombre: null,
      supervisor_mandante_timestamp: null
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Firmas de Autorización</h2>
        <p className="mt-2 text-gray-600">
          Autorizaciones finales para la operación de buceo
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Observaciones Generales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="observaciones_generales">Observaciones Adicionales</Label>
            <Textarea
              id="observaciones_generales"
              value={data.observaciones_generales || ''}
              onChange={(e) => onUpdate({ observaciones_generales: e.target.value })}
              placeholder="Agregue cualquier observación adicional relevante para la operación de buceo..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnhancedDigitalSignature
          title="Firma del Supervisor de Servicios"
          role="Supervisor de Servicios"
          signerName={data.supervisor_servicio_nombre}
          isSigned={!!data.supervisor_servicio_firma}
          onSign={handleSupervisorServicioSign}
          onReset={resetSupervisorServicioSign}
          iconColor="text-blue-600"
          requireSignerName={true}
        />

        <EnhancedDigitalSignature
          title="Firma del Supervisor Mandante/Blumar"
          role="Supervisor Mandante"
          signerName={data.supervisor_mandante_nombre}
          isSigned={!!data.supervisor_mandante_firma}
          onSign={handleSupervisorMandanteSign}
          onReset={resetSupervisorMandanteSign}
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
              <strong>Importante:</strong> Una vez firmado por ambas partes, este Anexo Bravo queda oficialmente 
              aprobado para la operación de buceo. Verifique que toda la información sea correcta antes de finalizar. 
              Las firmas digitales incluyen timestamp y datos del firmante para trazabilidad completa.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
