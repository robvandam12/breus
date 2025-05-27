
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, CheckSquare } from "lucide-react";

interface AnexoBravoStep2Props {
  data: any;
  onUpdate: (updates: any) => void;
}

export const AnexoBravoStep2 = ({ data, onUpdate }: AnexoBravoStep2Props) => {
  const updateChecklist = (itemId: string, field: string, value: any) => {
    const updatedChecklist = data.checklist.map((item: any) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    onUpdate({ checklist: updatedChecklist });
  };

  return (
    <div className="space-y-6">
      {/* Trabajadores del Equipo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Trabajadores Principales
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.trabajadores.length > 0 ? (
            <div className="space-y-3">
              {data.trabajadores.map((trabajador: any, index: number) => (
                <div key={trabajador.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    <div>
                      <p className="font-medium">{trabajador.nombre}</p>
                      <p className="text-sm text-gray-500">{trabajador.rut}</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">Equipo de Buceo</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No hay trabajadores asignados</p>
              <p className="text-sm">Los trabajadores se obtienen del equipo de buceo de la operación</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Checklist de Equipos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            Verificación de Equipos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.checklist.map((item: any) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`check-${item.id}`}
                    checked={item.verificado}
                    onCheckedChange={(checked) => 
                      updateChecklist(item.id, 'verificado', checked)
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={`check-${item.id}`}
                      className="text-base font-medium cursor-pointer"
                    >
                      {item.item}
                    </Label>
                    <Input
                      placeholder="Observaciones (opcional)"
                      value={item.observaciones}
                      onChange={(e) => 
                        updateChecklist(item.id, 'observaciones', e.target.value)
                      }
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
