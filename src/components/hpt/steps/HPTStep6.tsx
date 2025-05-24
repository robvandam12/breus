
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, PenTool, Calendar, MapPin } from "lucide-react";

interface HPTStep6Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep6 = ({ data, onUpdate }: HPTStep6Props) => {
  const handleSupervisorSign = () => {
    const timestamp = new Date().toISOString();
    onUpdate({ supervisor_firma: timestamp });
  };

  const handleJefeObraSign = () => {
    const timestamp = new Date().toISOString();
    onUpdate({ jefe_obra_firma: timestamp });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Autorizaciones y Firmas</h2>
        <p className="mt-2 text-gray-600">
          Revisa y autoriza la Hoja de Preparación de Trabajo
        </p>
      </div>

      {/* Resumen de la HPT */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Resumen de la HPT
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span><strong>Fecha:</strong> {data.fecha_programada || 'No especificada'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span><strong>Supervisor:</strong> {data.supervisor || 'No especificado'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span><strong>Buzos:</strong> {data.buzos?.length || 0} personas</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span><strong>Tipo de Trabajo:</strong> {data.tipo_trabajo || 'No especificado'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span><strong>Profundidad:</strong> {data.profundidad_maxima || 0} metros</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span><strong>Riesgos Identificados:</strong> {data.riesgos_identificados?.length || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Observaciones Finales</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="observaciones">Observaciones adicionales</Label>
            <Textarea
              id="observaciones"
              value={data.observaciones || ''}
              onChange={(e) => onUpdate({ observaciones: e.target.value })}
              placeholder="Cualquier observación adicional o comentario especial..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Firmas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5" />
            Firmas de Autorización
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Firma del Supervisor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Firma del Supervisor</h4>
                <p className="text-sm text-gray-600">{data.supervisor || 'Supervisor no especificado'}</p>
              </div>
              {data.supervisor_firma ? (
                <div className="text-center">
                  <div className="text-green-600 text-sm">✓ Firmado</div>
                  <div className="text-xs text-gray-500">
                    {new Date(data.supervisor_firma).toLocaleString('es-CL')}
                  </div>
                </div>
              ) : (
                <Button onClick={handleSupervisorSign} className="bg-blue-600 hover:bg-blue-700">
                  <PenTool className="w-4 h-4 mr-2" />
                  Firmar como Supervisor
                </Button>
              )}
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Firma del Jefe de Obra</h4>
                <p className="text-sm text-gray-600">{data.jefe_obra || 'Jefe de obra no especificado'}</p>
              </div>
              {data.jefe_obra_firma ? (
                <div className="text-center">
                  <div className="text-green-600 text-sm">✓ Firmado</div>
                  <div className="text-xs text-gray-500">
                    {new Date(data.jefe_obra_firma).toLocaleString('es-CL')}
                  </div>
                </div>
              ) : (
                <Button onClick={handleJefeObraSign} className="bg-green-600 hover:bg-green-700">
                  <PenTool className="w-4 h-4 mr-2" />
                  Firmar como Jefe de Obra
                </Button>
              )}
            </div>
          </div>

          {data.supervisor_firma && data.jefe_obra_firma && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <FileText className="w-5 h-5" />
                <span className="font-medium">HPT Lista para Finalizar</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Todas las firmas requeridas han sido completadas. La HPT está lista para ser finalizada.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
