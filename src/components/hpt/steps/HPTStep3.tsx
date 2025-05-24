
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { AlertTriangle, Shield } from "lucide-react";

interface HPTStep3Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep3 = ({ data, onUpdate }: HPTStep3Props) => {
  const form = useForm({
    defaultValues: {
      tipoTrabajo: data.tipoTrabajo || "",
      profundidadMaxima: data.profundidadMaxima || 0,
      corrientes: data.corrientes || "",
      visibilidad: data.visibilidad || "",
      temperatura: data.temperatura || 0,
    }
  });

  const [selectedRiesgos, setSelectedRiesgos] = useState<string[]>(data.riesgosIdentificados || []);
  const [selectedMedidas, setSelectedMedidas] = useState<string[]>(data.medidasControl || []);

  const formData = form.watch();

  useEffect(() => {
    onUpdate({
      ...formData,
      riesgosIdentificados: selectedRiesgos,
      medidasControl: selectedMedidas
    });
  }, [formData, selectedRiesgos, selectedMedidas, onUpdate]);

  const tiposTrabajos = [
    "Mantenimiento de Jaulas",
    "Inspección Visual",
    "Limpieza de Redes",
    "Soldadura Subacuática",
    "Reparación de Estructuras",
    "Instalación de Equipos",
    "Trabajo de Emergencia"
  ];

  const riesgosDisponibles = [
    "Enredamiento en líneas",
    "Corrientes fuertes", 
    "Baja visibilidad",
    "Fauna marina peligrosa",
    "Temperatura extrema del agua",
    "Presencia de embarcaciones",
    "Condiciones climáticas adversas",
    "Equipos defectuosos",
    "Profundidad excesiva",
    "Tiempo de buceo prolongado",
    "Trabajos en espacios confinados",
    "Riesgo de descompresión"
  ];

  const medidasDisponibles = [
    "Revisión completa de equipos",
    "Establecer comunicación constante",
    "Usar línea de vida",
    "Monitoreo de corrientes",
    "Buddy system obligatorio",
    "Límites de tiempo estrictos",
    "Plan de ascenso de emergencia",
    "Equipo de rescate en superficie",
    "Verificar condiciones meteorológicas",
    "Inspección médica previa",
    "Sistema de señales establecido",
    "Cámara hiperbárica disponible"
  ];

  const handleRiesgoChange = (riesgo: string, checked: boolean) => {
    if (checked) {
      setSelectedRiesgos([...selectedRiesgos, riesgo]);
    } else {
      setSelectedRiesgos(selectedRiesgos.filter(r => r !== riesgo));
    }
  };

  const handleMedidaChange = (medida: string, checked: boolean) => {
    if (checked) {
      setSelectedMedidas([...selectedMedidas, medida]);
    } else {
      setSelectedMedidas(selectedMedidas.filter(m => m !== medida));
    }
  };

  const getRiskLevel = () => {
    const riskFactors = selectedRiesgos.length;
    const depth = formData.profundidadMaxima;
    
    if (riskFactors >= 4 || depth > 30) return { level: "Alto", color: "bg-red-100 text-red-700" };
    if (riskFactors >= 2 || depth > 15) return { level: "Medio", color: "bg-yellow-100 text-yellow-700" };
    return { level: "Bajo", color: "bg-green-100 text-green-700" };
  };

  const riskLevel = getRiskLevel();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Análisis de Riesgos</h3>
        <p className="text-sm text-zinc-500 mb-6">
          Identifique los riesgos asociados al trabajo y defina las medidas de control.
        </p>
      </div>

      <Form {...form}>
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="tipoTrabajo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Trabajo *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo de trabajo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tiposTrabajos.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profundidadMaxima"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profundidad Máxima (metros) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="corrientes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condiciones de Corriente</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione condición" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="nula">Nula (0-0.5 nudos)</SelectItem>
                    <SelectItem value="leve">Leve (0.5-1 nudo)</SelectItem>
                    <SelectItem value="moderada">Moderada (1-2 nudos)</SelectItem>
                    <SelectItem value="fuerte">Fuerte (>2 nudos)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visibilidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visibilidad</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione visibilidad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="excelente">Excelente (>15m)</SelectItem>
                    <SelectItem value="buena">Buena (10-15m)</SelectItem>
                    <SelectItem value="regular">Regular (5-10m)</SelectItem>
                    <SelectItem value="mala">Mala (<5m)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="temperatura"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temperatura del Agua (°C)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="30"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Nivel de Riesgo:</span>
            <Badge className={riskLevel.color}>
              {riskLevel.level}
            </Badge>
          </div>
        </div>
      </Form>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Riesgos Identificados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Riesgos Identificados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {riesgosDisponibles.map((riesgo) => (
                <div key={riesgo} className="flex items-center space-x-2">
                  <Checkbox
                    id={riesgo}
                    checked={selectedRiesgos.includes(riesgo)}
                    onCheckedChange={(checked) => handleRiesgoChange(riesgo, checked as boolean)}
                  />
                  <label
                    htmlFor={riesgo}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {riesgo}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Medidas de Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Medidas de Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {medidasDisponibles.map((medida) => (
                <div key={medida} className="flex items-center space-x-2">
                  <Checkbox
                    id={medida}
                    checked={selectedMedidas.includes(medida)}
                    onCheckedChange={(checked) => handleMedidaChange(medida, checked as boolean)}
                  />
                  <label
                    htmlFor={medida}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {medida}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
