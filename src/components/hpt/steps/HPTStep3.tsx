
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Waves, Eye, Thermometer } from "lucide-react";

interface HPTStep3Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep3 = ({ data, onUpdate }: HPTStep3Props) => {
  const riesgosComunes = [
    "Corrientes fuertes",
    "Baja visibilidad",
    "Temperatura extrema",
    "Enredamiento",
    "Narcosis por nitrógeno",
    "Descompresión inadecuada",
    "Falla de equipo",
    "Vida marina peligrosa"
  ];

  const medidasControl = [
    "Verificación de equipos",
    "Plan de emergencia definido",
    "Comunicación constante",
    "Buddy system",
    "Tabla de descompresión",
    "Equipo de respaldo",
    "Señalización adecuada",
    "Monitoreo médico"
  ];

  const handleRiesgoChange = (riesgo: string, checked: boolean) => {
    const currentRiesgos = data.riesgos_identificados || [];
    let updatedRiesgos;
    
    if (checked) {
      updatedRiesgos = [...currentRiesgos, riesgo];
    } else {
      updatedRiesgos = currentRiesgos.filter((r: string) => r !== riesgo);
    }
    
    onUpdate({ riesgos_identificados: updatedRiesgos });
  };

  const handleMedidaChange = (medida: string, checked: boolean) => {
    const currentMedidas = data.medidas_control || [];
    let updatedMedidas;
    
    if (checked) {
      updatedMedidas = [...currentMedidas, medida];
    } else {
      updatedMedidas = currentMedidas.filter((m: string) => m !== medida);
    }
    
    onUpdate({ medidas_control: updatedMedidas });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Análisis de Riesgos</h2>
        <p className="mt-2 text-gray-600">
          Evalúa las condiciones y riesgos asociados a la inmersión
        </p>
      </div>

      {/* Condiciones de Buceo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="w-5 h-5" />
            Condiciones de Buceo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipo_trabajo">Tipo de Trabajo *</Label>
              <Select
                value={data.tipo_trabajo || ''}
                onValueChange={(value) => onUpdate({ tipo_trabajo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inspeccion">Inspección</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="reparacion">Reparación</SelectItem>
                  <SelectItem value="soldadura">Soldadura Subacuática</SelectItem>
                  <SelectItem value="limpieza">Limpieza</SelectItem>
                  <SelectItem value="instalacion">Instalación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="profundidad_maxima">Profundidad Máxima (m) *</Label>
              <Input
                id="profundidad_maxima"
                type="number"
                value={data.profundidad_maxima || ''}
                onChange={(e) => onUpdate({ profundidad_maxima: parseFloat(e.target.value) || 0 })}
                placeholder="Ej: 15"
              />
            </div>

            <div>
              <Label htmlFor="corrientes">Corrientes</Label>
              <Select
                value={data.corrientes || ''}
                onValueChange={(value) => onUpdate({ corrientes: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Intensidad..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nula">Nula</SelectItem>
                  <SelectItem value="ligera">Ligera</SelectItem>
                  <SelectItem value="moderada">Moderada</SelectItem>
                  <SelectItem value="fuerte">Fuerte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="visibilidad">Visibilidad</Label>
              <Select
                value={data.visibilidad || ''}
                onValueChange={(value) => onUpdate({ visibilidad: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Condición..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excelente">Excelente (>20m)</SelectItem>
                  <SelectItem value="buena">Buena (10-20m)</SelectItem>
                  <SelectItem value="regular">Regular (5-10m)</SelectItem>
                  <SelectItem value="mala">Mala (<5m)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="temperatura">Temperatura del Agua (°C)</Label>
              <Input
                id="temperatura"
                type="number"
                value={data.temperatura || ''}
                onChange={(e) => onUpdate({ temperatura: parseFloat(e.target.value) || 0 })}
                placeholder="Ej: 12"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Riesgos Identificados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Riesgos Identificados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riesgosComunes.map((riesgo) => (
              <div key={riesgo} className="flex items-center space-x-2">
                <Checkbox
                  id={`riesgo-${riesgo}`}
                  checked={(data.riesgos_identificados || []).includes(riesgo)}
                  onCheckedChange={(checked) => handleRiesgoChange(riesgo, checked as boolean)}
                />
                <Label htmlFor={`riesgo-${riesgo}`}>{riesgo}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medidas de Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Medidas de Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medidasControl.map((medida) => (
              <div key={medida} className="flex items-center space-x-2">
                <Checkbox
                  id={`medida-${medida}`}
                  checked={(data.medidas_control || []).includes(medida)}
                  onCheckedChange={(checked) => handleMedidaChange(medida, checked as boolean)}
                />
                <Label htmlFor={`medida-${medida}`}>{medida}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
