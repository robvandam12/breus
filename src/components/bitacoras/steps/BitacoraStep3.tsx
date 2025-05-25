
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { EnhancedDigitalSignature } from "@/components/signatures/EnhancedDigitalSignature";
import { Shield, FileText, AlertTriangle, Waves } from "lucide-react";
import { BitacoraSupervisorData } from "../BitacoraWizard";

interface BitacoraStep3Props {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
}

export const BitacoraStep3 = ({ data, onUpdate }: BitacoraStep3Props) => {
  const handleCheckboxChange = (field: keyof BitacoraSupervisorData, checked: boolean) => {
    onUpdate({ [field]: checked });
  };

  const handleSignature = (signatureData: { signature: string; signerName: string; timestamp: string }) => {
    onUpdate({ supervisor_buceo_firma: signatureData.signature });
  };

  const resetSignature = () => {
    onUpdate({ supervisor_buceo_firma: null });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión Preventiva y Finalización</h2>
        <p className="mt-2 text-gray-600">
          Validaciones finales, medidas correctivas y firma del supervisor
        </p>
      </div>

      {/* Profundidades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-blue-600" />
            Profundidades de Trabajo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="profundidad_trabajo">Profundidad de Trabajo (mts)</Label>
              <Input
                id="profundidad_trabajo"
                type="number"
                min="0"
                step="0.1"
                value={data.profundidad_trabajo_mts}
                onChange={(e) => onUpdate({ profundidad_trabajo_mts: parseFloat(e.target.value) || 0 })}
                placeholder="0.0"
              />
            </div>
            
            <div>
              <Label htmlFor="profundidad_maxima">Profundidad Máxima (mts)</Label>
              <Input
                id="profundidad_maxima"
                type="number"
                min="0"
                step="0.1"
                value={data.profundidad_maxima_mts}
                onChange={(e) => onUpdate({ profundidad_maxima_mts: parseFloat(e.target.value) || 0 })}
                placeholder="0.0"
              />
              <p className="text-xs text-amber-600 mt-1">
                * Sobre 40 metros requiere cámara hiperbárica - adjuntar documentos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gestión Preventiva */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Gestión Preventiva Según Decreto N°44
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Checkbox
                id="eval_riesgos"
                checked={data.gestprev_eval_riesgos_actualizada}
                onCheckedChange={(checked) => handleCheckboxChange('gestprev_eval_riesgos_actualizada', checked as boolean)}
              />
              <Label htmlFor="eval_riesgos" className="cursor-pointer flex-1">
                Evaluación de riesgos actualizada
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Checkbox
                id="procedimientos"
                checked={data.gestprev_procedimientos_disponibles_conocidos}
                onCheckedChange={(checked) => handleCheckboxChange('gestprev_procedimientos_disponibles_conocidos', checked as boolean)}
              />
              <Label htmlFor="procedimientos" className="cursor-pointer flex-1">
                Procedimientos disponibles y conocidos por el personal
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Checkbox
                id="capacitacion"
                checked={data.gestprev_capacitacion_previa_realizada}
                onCheckedChange={(checked) => handleCheckboxChange('gestprev_capacitacion_previa_realizada', checked as boolean)}
              />
              <Label htmlFor="capacitacion" className="cursor-pointer flex-1">
                Capacitación previa realizada
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Checkbox
                id="peligros_control"
                checked={data.gestprev_identif_peligros_control_riesgos_subacuaticos_realizados}
                onCheckedChange={(checked) => handleCheckboxChange('gestprev_identif_peligros_control_riesgos_subacuaticos_realizados', checked as boolean)}
              />
              <Label htmlFor="peligros_control" className="cursor-pointer flex-1">
                Identificación de peligros y control de riesgos subacuáticos realizados
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Checkbox
                id="incidentes"
                checked={data.gestprev_registro_incidentes_reportados}
                onCheckedChange={(checked) => handleCheckboxChange('gestprev_registro_incidentes_reportados', checked as boolean)}
              />
              <Label htmlFor="incidentes" className="cursor-pointer flex-1">
                Registro de incidentes reportados
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medidas Correctivas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Medidas Correctivas Implementadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="medidas_correctivas">Descripción de Medidas Correctivas</Label>
            <Textarea
              id="medidas_correctivas"
              value={data.medidas_correctivas_texto}
              onChange={(e) => onUpdate({ medidas_correctivas_texto: e.target.value })}
              placeholder="Describa las medidas correctivas implementadas durante la operación..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Observaciones Generales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            Observaciones Generales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="observaciones_generales">Observaciones Finales</Label>
            <Textarea
              id="observaciones_generales"
              value={data.observaciones_generales_texto}
              onChange={(e) => onUpdate({ observaciones_generales_texto: e.target.value })}
              placeholder="Registre cualquier observación adicional relevante sobre la operación..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Firma Digital */}
      <EnhancedDigitalSignature
        title="Firma del Supervisor de Buceo"
        role="Supervisor de Buceo"
        isSigned={!!data.supervisor_buceo_firma}
        onSign={handleSignature}
        onReset={resetSignature}
        iconColor="text-blue-600"
        requireSignerName={true}
      />
    </div>
  );
};
