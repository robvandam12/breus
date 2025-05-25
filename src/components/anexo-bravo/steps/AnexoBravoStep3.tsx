
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Wrench, AlertTriangle, CheckCircle2 } from "lucide-react";

interface AnexoBravoStep3Props {
  data: any;
  onUpdate: (data: any) => void;
}

// Lista de equipos e insumos para verificar según especificación
const equiposInsumos = [
  { id: "compresor", label: "Compresor", categoria: "equipo_principal" },
  { id: "regulador", label: "Regulador", categoria: "equipo_principal" },
  { id: "traje", label: "Traje de buceo", categoria: "equipo_personal" },
  { id: "aletas", label: "Aletas", categoria: "equipo_personal" },
  { id: "cinturon_lastre", label: "Cinturón de lastre", categoria: "equipo_personal" },
  { id: "mascarilla", label: "Mascarilla", categoria: "equipo_personal" },
  { id: "pufal", label: "Puñal", categoria: "herramientas" },
  { id: "profundimetro", label: "Profundímetro", categoria: "instrumentos" },
  { id: "salvavidas", label: "Salvavidas", categoria: "seguridad" },
  { id: "tablas_descompresion", label: "Tablas de descompresión", categoria: "seguridad" },
  { id: "botiquin", label: "Botiquín", categoria: "seguridad" },
  { id: "cabo_vida", label: "Cabo de vida", categoria: "seguridad" },
  { id: "cabo_descenso", label: "Cabo de descenso", categoria: "seguridad" },
  { id: "manguera", label: "Manguera de aire", categoria: "equipo_principal" },
  { id: "equipo_comunicacion", label: "Equipo de comunicación", categoria: "comunicacion" },
  { id: "matricula_buzo", label: "Matrícula del buzo", categoria: "documentacion" },
  { id: "matricula_asistente", label: "Matrícula del asistente", categoria: "documentacion" },
  { id: "certificado_mantencion", label: "Certificado de mantención de equipos", categoria: "documentacion" },
  { id: "filtro_aire", label: "Filtro de aire", categoria: "mantenimiento" },
  { id: "nivel_aceite_motor", label: "Nivel de aceite del motor", categoria: "mantenimiento" },
  { id: "nivel_aceite_cabezal", label: "Nivel de aceite del cabezal", categoria: "mantenimiento" },
  { id: "valvula_retencion", label: "Válvula de retención", categoria: "mantenimiento" },
  { id: "proteccion_partes_moviles", label: "Protección de partes móviles", categoria: "seguridad" },
  { id: "botella_aire_auxiliar", label: "Botella de aire auxiliar", categoria: "equipo_principal" }
];

const categorias = {
  equipo_principal: { label: "Equipo Principal", icon: Wrench, color: "text-blue-600" },
  equipo_personal: { label: "Equipo Personal", icon: CheckCircle2, color: "text-green-600" },
  herramientas: { label: "Herramientas", icon: Wrench, color: "text-purple-600" },
  instrumentos: { label: "Instrumentos", icon: CheckCircle2, color: "text-orange-600" },
  seguridad: { label: "Seguridad", icon: AlertTriangle, color: "text-red-600" },
  comunicacion: { label: "Comunicación", icon: CheckCircle2, color: "text-cyan-600" },
  documentacion: { label: "Documentación", icon: CheckCircle2, color: "text-gray-600" },
  mantenimiento: { label: "Mantenimiento", icon: Wrench, color: "text-yellow-600" }
};

export const AnexoBravoStep3 = ({ data, onUpdate }: AnexoBravoStep3Props) => {
  const checklist = data.anexo_bravo_checklist || {};

  const handleCheckChange = (equipoId: string, checked: boolean) => {
    const newChecklist = {
      ...checklist,
      [equipoId]: {
        ...checklist[equipoId],
        verificado: checked
      }
    };
    onUpdate({ anexo_bravo_checklist: newChecklist });
  };

  const handleObservacionChange = (equipoId: string, observacion: string) => {
    const newChecklist = {
      ...checklist,
      [equipoId]: {
        ...checklist[equipoId],
        observaciones: observacion
      }
    };
    onUpdate({ anexo_bravo_checklist: newChecklist });
  };

  const equiposPorCategoria = Object.entries(categorias).map(([categoriaId, categoriaInfo]) => ({
    id: categoriaId,
    ...categoriaInfo,
    equipos: equiposInsumos.filter(equipo => equipo.categoria === categoriaId)
  }));

  const totalEquipos = equiposInsumos.length;
  const equiposVerificados = equiposInsumos.filter(equipo => 
    checklist[equipo.id]?.verificado
  ).length;
  const porcentajeCompleto = Math.round((equiposVerificados / totalEquipos) * 100);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Chequeo de Equipos e Insumos</h2>
        <p className="mt-2 text-gray-600">
          Verificación obligatoria de equipos según normativa de buceo
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="text-sm text-gray-600">
            Progreso: {equiposVerificados}/{totalEquipos} equipos verificados
          </div>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${porcentajeCompleto}%` }}
            />
          </div>
          <div className="text-sm font-medium text-green-600">
            {porcentajeCompleto}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {equiposPorCategoria.map((categoria) => {
          const IconComponent = categoria.icon;
          
          return (
            <Card key={categoria.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <IconComponent className={`w-4 h-4 ${categoria.color}`} />
                  {categoria.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categoria.equipos.map((equipo) => {
                  const equipoData = checklist[equipo.id] || {};
                  const isVerificado = equipoData.verificado || false;
                  
                  return (
                    <div key={equipo.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={equipo.id}
                          checked={isVerificado}
                          onCheckedChange={(checked) => handleCheckChange(equipo.id, !!checked)}
                        />
                        <Label 
                          htmlFor={equipo.id} 
                          className={`text-sm font-medium cursor-pointer flex-1 ${
                            isVerificado ? 'text-green-700' : 'text-gray-700'
                          }`}
                        >
                          {equipo.label}
                        </Label>
                        {isVerificado && (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor={`obs-${equipo.id}`} className="text-xs text-gray-500">
                          Observaciones
                        </Label>
                        <Textarea
                          id={`obs-${equipo.id}`}
                          value={equipoData.observaciones || ''}
                          onChange={(e) => handleObservacionChange(equipo.id, e.target.value)}
                          placeholder="Observaciones del equipo..."
                          rows={2}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  );
                })}
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
            <strong>Importante:</strong> Todos los equipos marcados deben estar en condiciones 
            óptimas de funcionamiento. Cualquier equipo defectuoso debe ser reportado en las 
            observaciones y reemplazado antes de la operación de buceo.
          </div>
        </div>
      </div>
    </div>
  );
};
