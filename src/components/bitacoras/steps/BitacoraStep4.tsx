
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Anchor, Calendar, Wrench } from "lucide-react";
import { BitacoraSupervisorData } from "../BitacoraWizard";

interface BitacoraStep4Props {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
}

export const BitacoraStep4 = ({ data, onUpdate }: BitacoraStep4Props) => {
  const handleInputChange = (field: keyof BitacoraSupervisorData, value: any) => {
    onUpdate({ [field]: value });
  };

  const equiposDisponibles = [
    'Compresor de Aire',
    'Equipo de Soldadura Subacuática',
    'Herramientas de Corte',
    'Cámara Subacuática',
    'Aspiradora Submarina',
    'Martillo Neumático',
    'Taladro Subacuático',
    'Equipo de Medición'
  ];

  const trabajosComunes = [
    'Inspección de cascos',
    'Soldadura subacuática',
    'Corte de estructuras',
    'Limpieza de jaulas',
    'Reparación de redes',
    'Instalación de equipos',
    'Mantenimiento preventivo',
    'Inspección de anclajes'
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Datos Técnicos de la Faena</h2>
        <p className="mt-2 text-gray-600">
          Equipos utilizados, matriculación y descripción del trabajo realizado
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Equipos Utilizados */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Equipos Utilizados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="equipos_utilizados">Equipos Utilizados</Label>
              <Select 
                value={data.equipos_utilizados?.[0] || ''} 
                onValueChange={(value) => handleInputChange('equipos_utilizados', [value])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar equipo principal" />
                </SelectTrigger>
                <SelectContent>
                  {equiposDisponibles.map((equipo) => (
                    <SelectItem key={equipo} value={equipo}>
                      {equipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="matricula_equipo">Matrícula</Label>
              <Input
                id="matricula_equipo"
                value={data.matricula_equipo}
                onChange={(e) => handleInputChange('matricula_equipo', e.target.value)}
                placeholder="Matrícula o número de serie del equipo"
              />
            </div>
            
            <div>
              <Label htmlFor="vigencia_equipo">Vigencia del Equipo</Label>
              <Input
                id="vigencia_equipo"
                type="date"
                value={data.vigencia_equipo}
                onChange={(e) => handleInputChange('vigencia_equipo', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Trabajo y Embarcación */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Trabajo y Apoyo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="trabajo_realizar">Trabajo a Realizar</Label>
              <Select 
                value={data.trabajo_realizar || ''} 
                onValueChange={(value) => handleInputChange('trabajo_realizar', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de trabajo" />
                </SelectTrigger>
                <SelectContent>
                  {trabajosComunes.map((trabajo) => (
                    <SelectItem key={trabajo} value={trabajo}>
                      {trabajo}
                    </SelectItem>
                  ))}
                  <SelectItem value="otro">Otro (especificar)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="embarcacion_apoyo">Embarcación de Apoyo (Opcional)</Label>
              <Input
                id="embarcacion_apoyo"
                value={data.embarcacion_apoyo}
                onChange={(e) => handleInputChange('embarcacion_apoyo', e.target.value)}
                placeholder="Nombre y matrícula de la embarcación"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Descripción Detallada del Trabajo */}
      {data.trabajo_realizar === 'otro' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-orange-600" />
              Descripción Detallada del Trabajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="trabajo_detallado">Descripción del Trabajo Específico</Label>
              <Textarea
                id="trabajo_detallado"
                value={data.observaciones_previas}
                onChange={(e) => handleInputChange('observaciones_previas', e.target.value)}
                placeholder="Describa detalladamente el trabajo específico realizado..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Settings className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-sm text-orange-800">
            <strong>Información:</strong> Complete todos los datos técnicos de la faena.
            La matrícula y vigencia del equipo son obligatorios para el registro.
          </div>
        </div>
      </div>
    </div>
  );
};
