
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface HPTReviewFormProps {
  data: any;
  operacionData?: any;
  onChange: (data: any) => void;
}

export const HPTReviewForm = ({ data, operacionData, onChange }: HPTReviewFormProps) => {
  const isComplete = (section: any) => {
    if (!section) return false;
    if (typeof section === 'object') {
      return Object.values(section).some(value => value === true || (typeof value === 'string' && value.length > 0));
    }
    return section.length > 0;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revisión Final</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">Información Básica</span>
              <Badge variant={data.codigo && data.supervisor_nombre ? "default" : "secondary"}>
                {data.codigo && data.supervisor_nombre ? (
                  <><CheckCircle className="w-3 h-3 mr-1" />Completo</>
                ) : (
                  <><AlertTriangle className="w-3 h-3 mr-1" />Incompleto</>
                )}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">EPP</span>
              <Badge variant={isComplete(data.hpt_epp) ? "default" : "secondary"}>
                {isComplete(data.hpt_epp) ? (
                  <><CheckCircle className="w-3 h-3 mr-1" />Completo</>
                ) : (
                  <><AlertTriangle className="w-3 h-3 mr-1" />Incompleto</>
                )}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">Riesgos ERC</span>
              <Badge variant={isComplete(data.hpt_erc) ? "default" : "secondary"}>
                {isComplete(data.hpt_erc) ? (
                  <><CheckCircle className="w-3 h-3 mr-1" />Completo</>
                ) : (
                  <><AlertTriangle className="w-3 h-3 mr-1" />Incompleto</>
                )}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">Equipo de Trabajo</span>
              <Badge variant={data.empresa_servicio_nombre ? "default" : "secondary"}>
                {data.empresa_servicio_nombre ? (
                  <><CheckCircle className="w-3 h-3 mr-1" />Completo</>
                ) : (
                  <><AlertTriangle className="w-3 h-3 mr-1" />Incompleto</>
                )}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Código:</strong> {data.codigo || 'No especificado'}</p>
            <p><strong>Supervisor:</strong> {data.supervisor_nombre || 'No especificado'}</p>
            <p><strong>Fecha:</strong> {data.fecha || 'No especificada'}</p>
            <p><strong>Tarea:</strong> {data.descripcion_tarea || 'No especificada'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
