
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";

interface HPTStep3Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep3 = ({ data, onUpdate }: HPTStep3Props) => {
  const handleMedidasChange = (key: string, value: string) => {
    const currentMedidas = data.hpt_medidas || {};
    onUpdate({
      hpt_medidas: {
        ...currentMedidas,
        [key]: value
      }
    });
  };

  const handleRiesgosChange = (key: string, field: string, value: string) => {
    const currentRiesgos = data.hpt_riesgos_comp || {};
    const currentItem = currentRiesgos[key] || {};
    
    onUpdate({
      hpt_riesgos_comp: {
        ...currentRiesgos,
        [key]: {
          ...currentItem,
          [field]: value
        }
      }
    });
  };

  const medidasEjecucion = [
    { key: 'listas_chequeo_erc_disponibles', label: '¿Están disponibles las listas de chequeo de ERC?' },
    { key: 'procedimientos_trabajo_seguros', label: '¿Se cuenta con procedimientos de trabajo seguros?' },
    { key: 'personal_capacitado', label: '¿El personal está capacitado para la tarea?' },
    { key: 'equipos_certificados', label: '¿Los equipos tienen certificación vigente?' },
    { key: 'permisos_trabajo_vigentes', label: '¿Los permisos de trabajo están vigentes?' },
    { key: 'comunicacion_establecida', label: '¿Se ha establecido la comunicación de emergencia?' },
    { key: 'condiciones_ambientales_evaluadas', label: '¿Se han evaluado las condiciones ambientales?' },
    { key: 'plan_emergencia_comunicado', label: '¿Se ha comunicado el plan de emergencia?' }
  ];

  const riesgosComplementarios = [
    { key: 'condiciones_ambientales', label: 'Condiciones Ambientales Adversas' },
    { key: 'fatiga_personal', label: 'Fatiga del Personal' },
    { key: 'equipos_defectuosos', label: 'Equipos Defectuosos o Mal Mantenidos' },
    { key: 'comunicacion_deficiente', label: 'Comunicación Deficiente' },
    { key: 'procedimientos_inadecuados', label: 'Procedimientos Inadecuados' },
    { key: 'interferencia_otras_actividades', label: 'Interferencia con Otras Actividades' },
    { key: 'acceso_restringido', label: 'Acceso Restringido o Difícil' },
    { key: 'tiempo_limitado', label: 'Tiempo de Ejecución Limitado' }
  ];

  const renderSelectOption = (value: string) => {
    const options = [
      { value: 'si', label: 'Sí', icon: CheckCircle2, color: 'text-green-600' },
      { value: 'no', label: 'No', icon: X, color: 'text-red-600' },
      { value: 'na', label: 'N/A', icon: AlertTriangle, color: 'text-gray-600' }
    ];

    return (
      <Select value={value || ''} onValueChange={(newValue) => newValue}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => {
            const IconComponent = option.icon;
            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <IconComponent className={`w-4 h-4 ${option.color}`} />
                  {option.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Medidas Claves para Ejecución y Riesgos Complementarios</h2>
        <p className="mt-2 text-gray-600">
          Verificación de medidas de control y identificación de riesgos adicionales
        </p>
      </div>

      {/* Medidas Claves para Ejecución */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Medidas Claves para Ejecución
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medidasEjecucion.map((medida) => (
              <div key={medida.key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 border rounded-lg">
                <Label className="text-sm font-medium">
                  {medida.label}
                </Label>
                <div className="md:col-span-1">
                  <Select 
                    value={data.hpt_medidas?.[medida.key] || ''} 
                    onValueChange={(value) => handleMedidasChange(medida.key, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Sí
                        </div>
                      </SelectItem>
                      <SelectItem value="no">
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-600" />
                          No
                        </div>
                      </SelectItem>
                      <SelectItem value="na">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-gray-600" />
                          N/A
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Identificación de Peligros / Riesgos Complementarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Identificación de Peligros / Riesgos Complementarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {riesgosComplementarios.map((riesgo) => (
              <div key={riesgo.key} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <Label className="text-sm font-medium">
                    {riesgo.label}
                  </Label>
                  <div>
                    <Select 
                      value={data.hpt_riesgos_comp?.[riesgo.key]?.presente || ''} 
                      onValueChange={(value) => handleRiesgosChange(riesgo.key, 'presente', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="¿Presente?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="si">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Sí
                          </div>
                        </SelectItem>
                        <SelectItem value="no">
                          <div className="flex items-center gap-2">
                            <X className="w-4 h-4 text-red-600" />
                            No
                          </div>
                        </SelectItem>
                        <SelectItem value="na">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-gray-600" />
                            N/A
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {data.hpt_riesgos_comp?.[riesgo.key]?.presente === 'si' && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium text-gray-700">
                      Acciones de Control
                    </Label>
                    <Textarea
                      value={data.hpt_riesgos_comp?.[riesgo.key]?.acciones_control || ''}
                      onChange={(e) => handleRiesgosChange(riesgo.key, 'acciones_control', e.target.value)}
                      placeholder="Describa las acciones de control implementadas..."
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-sm text-amber-800">
            <strong>Importante:</strong> Para cualquier medida marcada como "No" o riesgo presente, 
            se deben implementar acciones correctivas antes de proceder con la tarea. 
            Documente todas las acciones de control en los campos correspondientes.
          </div>
        </div>
      </div>
    </div>
  );
};
