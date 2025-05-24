
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PenTool, CheckCircle, FileText } from "lucide-react";

interface HPTStep6Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep6 = ({ data, onUpdate }: HPTStep6Props) => {
  const handleSupervisorSign = () => {
    const timestamp = new Date().toISOString();
    onUpdate({ supervisor_firma: `Firmado digitalmente el ${new Date().toLocaleString()}` });
  };

  const handleJefeObraSign = () => {
    const timestamp = new Date().toISOString();
    onUpdate({ jefe_obra_firma: `Firmado digitalmente el ${new Date().toLocaleString()}` });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Autorizaciones y Firmas</h2>
        <p className="mt-2 text-gray-600">
          Aprobación final y firmas de responsables
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="w-5 h-5" />
              Firma del Supervisor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <strong>Supervisor:</strong> {data.supervisor || 'No especificado'}
            </div>
            
            {data.supervisor_firma ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Firmado</span>
                </div>
                <div className="text-sm text-green-600">
                  {data.supervisor_firma}
                </div>
              </div>
            ) : (
              <Button 
                onClick={handleSupervisorSign}
                className="w-full"
                disabled={!data.supervisor}
              >
                <PenTool className="w-4 h-4 mr-2" />
                Firmar como Supervisor
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="w-5 h-5" />
              Firma del Jefe de Obra
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <strong>Jefe de Obra:</strong> {data.jefe_obra || 'No especificado'}
            </div>
            
            {data.jefe_obra_firma ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Firmado</span>
                </div>
                <div className="text-sm text-green-600">
                  {data.jefe_obra_firma}
                </div>
              </div>
            ) : (
              <Button 
                onClick={handleJefeObraSign}
                className="w-full"
                disabled={!data.jefe_obra}
              >
                <PenTool className="w-4 h-4 mr-2" />
                Firmar como Jefe de Obra
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText className="w-3 h-3 text-amber-600" />
            </div>
            <div className="text-sm text-amber-800">
              <strong>Importante:</strong> Una vez firmada por ambas partes, esta HPT no podrá ser modificada. 
              Asegúrese de que toda la información sea correcta antes de finalizar.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
