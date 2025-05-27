
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, FileText } from "lucide-react";

interface AnexoBravoStep3Props {
  data: any;
  onUpdate: (updates: any) => void;
}

export const AnexoBravoStep3 = ({ data, onUpdate }: AnexoBravoStep3Props) => {
  const verificadosCount = data.checklist.filter((item: any) => item.verificado).length;
  const totalCount = data.checklist.length;
  const completionPercentage = Math.round((verificadosCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Resumen de Verificación */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Resumen de Verificación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
              <div className="text-sm text-blue-700">Items Totales</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{verificadosCount}</div>
              <div className="text-sm text-green-700">Verificados</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{completionPercentage}%</div>
              <div className="text-sm text-orange-700">Completado</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Estado de Items:</h4>
            {data.checklist.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">{item.item}</span>
                <Badge variant={item.verificado ? "default" : "secondary"}>
                  {item.verificado ? "Verificado" : "Pendiente"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Observaciones Generales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Observaciones Generales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="observaciones_generales">
              Observaciones y comentarios adicionales
            </Label>
            <Textarea
              id="observaciones_generales"
              placeholder="Ingrese observaciones generales sobre la verificación..."
              value={data.observaciones_generales}
              onChange={(e) => onUpdate({ observaciones_generales: e.target.value })}
              rows={4}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Información de Completado */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Información Importante</h4>
              <p className="text-sm text-blue-700 mt-1">
                Una vez creado, el Anexo Bravo quedará como borrador. Podrá firmarlo posteriormente 
                desde la sección de documentos de la operación, siguiendo el mismo proceso que las bitácoras.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
