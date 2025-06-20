
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Settings, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AnexoBravoStep3Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const AnexoBravoStep3 = ({ data, onUpdate }: AnexoBravoStep3Props) => {
  const checklist = data.anexo_bravo_checklist || {};
  const [openObservations, setOpenObservations] = useState<Record<string, boolean>>({});

  const equiposInsumos = [
    { key: 'compresor', label: 'Compresor', categoria: 'equipo_principal' },
    { key: 'regulador', label: 'Regulador', categoria: 'equipo_principal' },
    { key: 'traje', label: 'Traje de Buceo', categoria: 'equipo_personal' },
    { key: 'aletas', label: 'Aletas', categoria: 'equipo_personal' },
    { key: 'cinturon_lastre', label: 'Cinturón de Lastre', categoria: 'equipo_personal' },
    { key: 'mascarilla', label: 'Mascarilla/Máscara', categoria: 'equipo_personal' },
    { key: 'pufal', label: 'Puñal de Buceo', categoria: 'herramientas' },
    { key: 'profundimetro', label: 'Profundímetro', categoria: 'instrumentos' },
    { key: 'salvavidas', label: 'Salvavidas', categoria: 'seguridad' },
    { key: 'tablas_descompresion', label: 'Tablas de Descompresión', categoria: 'documentos' },
    { key: 'botiquin', label: 'Botiquín de Primeros Auxilios', categoria: 'seguridad' },
    { key: 'cabo_vida', label: 'Cabo de Vida', categoria: 'seguridad' },
    { key: 'cabo_descenso', label: 'Cabo de Descenso', categoria: 'seguridad' },
    { key: 'manguera', label: 'Manguera de Aire', categoria: 'equipo_principal' },
    { key: 'equipo_comunicacion', label: 'Equipo de Comunicación', categoria: 'comunicacion' },
    { key: 'matricula_buzo', label: 'Matrícula del Buzo', categoria: 'documentos' },
    { key: 'matricula_asistente', label: 'Matrícula del Asistente', categoria: 'documentos' },
    { key: 'certificado_mantencion', label: 'Certificado de Mantención de Equipos', categoria: 'documentos' },
    { key: 'filtro_aire', label: 'Filtro de Aire', categoria: 'mantenimiento' },
    { key: 'nivel_aceite_motor', label: 'Nivel de Aceite del Motor', categoria: 'mantenimiento' },
    { key: 'nivel_aceite_cabezal', label: 'Nivel de Aceite del Cabezal', categoria: 'mantenimiento' },
    { key: 'valvula_retencion', label: 'Válvula de Retención', categoria: 'mantenimiento' },
    { key: 'proteccion_partes_moviles', label: 'Protección de Partes Móviles', categoria: 'seguridad' },
    { key: 'botella_aire_auxiliar', label: 'Botella de Aire Auxiliar', categoria: 'seguridad' }
  ];

  const categorias = {
    equipo_principal: { label: 'Equipo Principal', icon: Settings, color: 'text-blue-600' },
    equipo_personal: { label: 'Equipo Personal', icon: CheckCircle, color: 'text-green-600' },
    herramientas: { label: 'Herramientas', icon: Settings, color: 'text-purple-600' },
    instrumentos: { label: 'Instrumentos', icon: CheckCircle, color: 'text-orange-600' },
    seguridad: { label: 'Seguridad', icon: AlertTriangle, color: 'text-red-600' },
    documentos: { label: 'Documentos', icon: CheckCircle, color: 'text-gray-600' },
    comunicacion: { label: 'Comunicación', icon: Settings, color: 'text-cyan-600' },
    mantenimiento: { label: 'Mantenimiento', icon: Settings, color: 'text-yellow-600' }
  };

  const handleChecklistChange = (item: string, field: 'verificado' | 'observaciones', value: any) => {
    const newChecklist = {
      ...checklist,
      [item]: {
        ...checklist[item],
        [field]: value
      }
    };
    onUpdate({ anexo_bravo_checklist: newChecklist });
  };

  const toggleObservations = (equipoKey: string) => {
    setOpenObservations(prev => ({
      ...prev,
      [equipoKey]: !prev[equipoKey]
    }));
  };

  const getEquiposPorCategoria = () => {
    const grouped: Record<string, typeof equiposInsumos> = {};
    equiposInsumos.forEach(equipo => {
      if (!grouped[equipo.categoria]) {
        grouped[equipo.categoria] = [];
      }
      grouped[equipo.categoria].push(equipo);
    });
    return grouped;
  };

  const equiposAgrupados = getEquiposPorCategoria();

  const getTotalVerificados = () => {
    return equiposInsumos.filter(equipo => checklist[equipo.key]?.verificado).length;
  };

  const getPorcentajeCompletitud = () => {
    return Math.round((getTotalVerificados() / equiposInsumos.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Chequeo de Equipos e Insumos</h2>
        <p className="mt-2 text-gray-600">
          Verificación de todos los equipos e insumos requeridos para la operación de buceo
        </p>
      </div>

      {/* Progreso del Chequeo */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Progreso del Chequeo</p>
              <p className="text-xs text-blue-700">
                {getTotalVerificados()} de {equiposInsumos.length} elementos verificados
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{getPorcentajeCompletitud()}%</div>
              <div className="w-20 bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${getPorcentajeCompletitud()}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chequeo por Categorías */}
      <div className="space-y-4">
        {Object.entries(equiposAgrupados).map(([categoria, equipos]) => {
          const categoriaInfo = categorias[categoria as keyof typeof categorias];
          const IconComponent = categoriaInfo.icon;
          
          return (
            <Card key={categoria}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-lg flex items-center gap-2 ${categoriaInfo.color}`}>
                  <IconComponent className="w-5 h-5" />
                  {categoriaInfo.label}
                  <span className="text-sm font-normal text-gray-500">
                    ({equipos.filter(e => checklist[e.key]?.verificado).length}/{equipos.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {equipos.map((equipo) => (
                  <div key={equipo.key} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`check_${equipo.key}`}
                          checked={checklist[equipo.key]?.verificado || false}
                          onCheckedChange={(checked) => 
                            handleChecklistChange(equipo.key, 'verificado', checked)
                          }
                        />
                        <Label 
                          htmlFor={`check_${equipo.key}`}
                          className="font-medium cursor-pointer"
                        >
                          {equipo.label}
                        </Label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {checklist[equipo.key]?.verificado && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleObservations(equipo.key)}
                          className="p-1 h-8 w-8"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <Collapsible 
                      open={openObservations[equipo.key]} 
                      onOpenChange={() => toggleObservations(equipo.key)}
                    >
                      <CollapsibleContent className="ml-6">
                        <div className="mt-2">
                          <Label htmlFor={`obs_${equipo.key}`} className="text-xs text-gray-600">
                            Observaciones
                          </Label>
                          <Textarea
                            id={`obs_${equipo.key}`}
                            value={checklist[equipo.key]?.observaciones || ''}
                            onChange={(e) => 
                              handleChecklistChange(equipo.key, 'observaciones', e.target.value)
                            }
                            placeholder="Observaciones específicas del equipo..."
                            rows={2}
                            className="text-xs mt-1"
                          />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-sm text-amber-800">
            <strong>Importante:</strong> Todos los equipos e insumos deben ser verificados antes de 
            proceder con la operación de buceo. Registre cualquier observación relevante en el 
            campo correspondiente. Los elementos marcados como "no verificados" deberán ser 
            revisados antes de la inmersión.
          </div>
        </div>
      </div>
    </div>
  );
};
