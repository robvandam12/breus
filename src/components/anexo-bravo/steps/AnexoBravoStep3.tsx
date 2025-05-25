
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Wrench, AlertTriangle } from "lucide-react";

interface AnexoBravoStep3Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const AnexoBravoStep3 = ({ data, onUpdate }: AnexoBravoStep3Props) => {
  const handleChecklistChange = (item: string, checked: boolean) => {
    const currentChecklist = data.anexo_bravo_checklist || {};
    onUpdate({
      anexo_bravo_checklist: {
        ...currentChecklist,
        [item]: { verificado: checked, observaciones: currentChecklist[item]?.observaciones || '' }
      }
    });
  };

  const handleObservacionChange = (item: string, observacion: string) => {
    const currentChecklist = data.anexo_bravo_checklist || {};
    onUpdate({
      anexo_bravo_checklist: {
        ...currentChecklist,
        [item]: { 
          verificado: currentChecklist[item]?.verificado || false, 
          observaciones: observacion 
        }
      }
    });
  };

  const equiposItems = [
    { key: 'compresor', label: 'Compresor' },
    { key: 'regulador', label: 'Regulador' },
    { key: 'traje', label: 'Traje de Buceo' },
    { key: 'aletas', label: 'Aletas' },
    { key: 'cinturon_lastre', label: 'Cinturón de Lastre' },
    { key: 'mascarilla', label: 'Mascarilla/Máscara' },
    { key: 'pufal', label: 'Puñal' },
    { key: 'profundimetro', label: 'Profundímetro' },
    { key: 'salvavidas', label: 'Salvavidas' },
    { key: 'tablas_descompresion', label: 'Tablas de Descompresión' },
    { key: 'botiquin', label: 'Botiquín de Primeros Auxilios' },
    { key: 'cabo_vida', label: 'Cabo de Vida' },
    { key: 'cabo_descenso', label: 'Cabo de Descenso' },
    { key: 'manguera', label: 'Manguera de Aire' },
    { key: 'equipo_comunicacion', label: 'Equipo de Comunicación' },
    { key: 'matricula_buzo', label: 'Matrícula del Buzo' },
    { key: 'matricula_asistente', label: 'Matrícula del Asistente' },
    { key: 'certificado_mantencion', label: 'Certificado Mantención Equipos' },
    { key: 'filtro_aire', label: 'Filtro de Aire' },
    { key: 'nivel_aceite_motor', label: 'Nivel Aceite Motor' },
    { key: 'nivel_aceite_cabezal', label: 'Nivel Aceite Cabezal' },
    { key: 'valvula_retencion', label: 'Válvula de Retención' },
    { key: 'proteccion_partes_moviles', label: 'Protección Partes Móviles' },
    { key: 'botella_aire_auxiliar', label: 'Botella de Aire Auxiliar' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Chequeo de Equipos e Insumos</h2>
        <p className="mt-2 text-gray-600">
          Verificación completa de equipos y materiales para la operación de buceo
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            Lista de Verificación de Equipos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {equiposItems.map((item) => (
              <div key={item.key} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center space-x-3 mb-3">
                  <Checkbox
                    id={`equipo_${item.key}`}
                    checked={data.anexo_bravo_checklist?.[item.key]?.verificado || false}
                    onCheckedChange={(checked) => handleChecklistChange(item.key, checked as boolean)}
                  />
                  <Label htmlFor={`equipo_${item.key}`} className="text-sm font-medium cursor-pointer flex-1">
                    {item.label}
                  </Label>
                </div>
                
                <div className="ml-6">
                  <Label htmlFor={`obs_${item.key}`} className="text-xs text-gray-600">
                    Observaciones
                  </Label>
                  <Textarea
                    id={`obs_${item.key}`}
                    value={data.anexo_bravo_checklist?.[item.key]?.observaciones || ''}
                    onChange={(e) => handleObservacionChange(item.key, e.target.value)}
                    placeholder="Observaciones sobre el equipo..."
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-sm text-red-800">
            <strong>Crítico:</strong> TODOS los equipos deben estar verificados y en condiciones óptimas. 
            Cualquier equipo defectuoso o faltante debe ser reportado y corregido antes de iniciar la operación. 
            Documente cualquier observación relevante.
          </div>
        </div>
      </div>
    </div>
  );
};
