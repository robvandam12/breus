
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Plus, X, Thermometer, Eye, Waves } from "lucide-react";

interface HPTStep3Props {
  data: any;
  onUpdate: (data: any) => void;
}

const TIPOS_TRABAJO = [
  { value: "inspeccion", label: "Inspección" },
  { value: "mantenimiento", label: "Mantenimiento" },
  { value: "reparacion", label: "Reparación" },
  { value: "instalacion", label: "Instalación" },
  { value: "limpieza", label: "Limpieza" },
  { value: "soldadura", label: "Soldadura Subacuática" },
  { value: "corte", label: "Corte Subacuático" },
  { value: "otros", label: "Otros" }
].filter(tipo => tipo.value && tipo.value.trim() !== ""); // Ensure no empty values

const RIESGOS_PREDEFINIDOS = [
  "Enredamiento en cabos o redes",
  "Corrientes fuertes",
  "Baja visibilidad",
  "Fauna marina peligrosa",
  "Objetos cortantes",
  "Equipos en movimiento",
  "Espacios confinados",
  "Contaminación del agua",
  "Condiciones climáticas adversas",
  "Fallas de equipos"
].filter(riesgo => riesgo && riesgo.trim() !== ""); // Ensure no empty values

const MEDIDAS_CONTROL = [
  "Uso de cabo de vida",
  "Comunicación constante",
  "Buzo de respaldo",
  "Iluminación adicional",
  "Herramientas de corte de emergencia",
  "Protocolo de emergencia",
  "Revisión de equipos",
  "Monitoreo continuo",
  "Señalización de área",
  "Equipo de primeros auxilios"
].filter(medida => medida && medida.trim() !== ""); // Ensure no empty values

export const HPTStep3 = ({ data, onUpdate }: HPTStep3Props) => {
  const addRiesgo = (riesgo: string) => {
    if (!riesgo || riesgo.trim() === "") return; // Guard against empty values
    const riesgos = data.riesgos_identificados || [];
    if (!riesgos.includes(riesgo)) {
      onUpdate({ riesgos_identificados: [...riesgos, riesgo] });
    }
  };

  const removeRiesgo = (riesgo: string) => {
    const riesgos = data.riesgos_identificados || [];
    onUpdate({ riesgos_identificados: riesgos.filter((r: string) => r !== riesgo) });
  };

  const addMedida = (medida: string) => {
    if (!medida || medida.trim() === "") return; // Guard against empty values
    const medidas = data.medidas_control || [];
    if (!medidas.includes(medida)) {
      onUpdate({ medidas_control: [...medidas, medida] });
    }
  };

  const removeMedida = (medida: string) => {
    const medidas = data.medidas_control || [];
    onUpdate({ medidas_control: medidas.filter((m: string) => m !== medida) });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Análisis de Riesgos</h2>
        <p className="mt-2 text-gray-600">
          Identifique los riesgos y condiciones ambientales de la operación
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Tipo de Trabajo y Condiciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tipo_trabajo">Tipo de Trabajo *</Label>
              <Select 
                value={data.tipo_trabajo || ""} 
                onValueChange={(value) => onUpdate({ tipo_trabajo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo de trabajo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_TRABAJO.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="profundidad_maxima">Profundidad Máxima (metros) *</Label>
              <Input
                id="profundidad_maxima"
                type="number"
                min="0"
                max="100"
                value={data.profundidad_maxima || ''}
                onChange={(e) => onUpdate({ profundidad_maxima: parseFloat(e.target.value) || 0 })}
                placeholder="Ej: 15"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="corrientes" className="flex items-center gap-2">
                  <Waves className="w-4 h-4" />
                  Corrientes
                </Label>
                <Select 
                  value={data.corrientes || ""} 
                  onValueChange={(value) => onUpdate({ corrientes: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Intensidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nula">Nula</SelectItem>
                    <SelectItem value="leve">Leve</SelectItem>
                    <SelectItem value="moderada">Moderada</SelectItem>
                    <SelectItem value="fuerte">Fuerte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="visibilidad" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Visibilidad
                </Label>
                <Select 
                  value={data.visibilidad || ""} 
                  onValueChange={(value) => onUpdate({ visibilidad: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Condición" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excelente">Excelente</SelectItem>
                    <SelectItem value="buena">Buena</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="mala">Mala</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="temperatura" className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4" />
                  Temperatura (°C)
                </Label>
                <Input
                  id="temperatura"
                  type="number"
                  min="0"
                  max="30"
                  value={data.temperatura || ''}
                  onChange={(e) => onUpdate({ temperatura: parseFloat(e.target.value) || 0 })}
                  placeholder="Ej: 12"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Riesgos Identificados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {RIESGOS_PREDEFINIDOS.map((riesgo) => (
                <Button
                  key={riesgo}
                  variant="outline"
                  size="sm"
                  onClick={() => addRiesgo(riesgo)}
                  className="text-xs"
                  disabled={data.riesgos_identificados?.includes(riesgo)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {riesgo}
                </Button>
              ))}
            </div>

            {data.riesgos_identificados?.length > 0 && (
              <div>
                <Label>Riesgos Seleccionados:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.riesgos_identificados.map((riesgo: string) => (
                    <Badge
                      key={riesgo}
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={() => removeRiesgo(riesgo)}
                    >
                      {riesgo}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Medidas de Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {MEDIDAS_CONTROL.map((medida) => (
                <Button
                  key={medida}
                  variant="outline"
                  size="sm"
                  onClick={() => addMedida(medida)}
                  className="text-xs"
                  disabled={data.medidas_control?.includes(medida)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {medida}
                </Button>
              ))}
            </div>

            {data.medidas_control?.length > 0 && (
              <div>
                <Label>Medidas Seleccionadas:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.medidas_control.map((medida: string) => (
                    <Badge
                      key={medida}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeMedida(medida)}
                    >
                      {medida}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
