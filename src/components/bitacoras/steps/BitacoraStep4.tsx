
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Anchor, Calendar, Briefcase } from "lucide-react";
import { BitacoraSupervisorData } from "../BitacoraWizard";

interface BitacoraStep4Props {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
}

export const BitacoraStep4 = ({ data, onUpdate }: BitacoraStep4Props) => {
  const handleInputChange = (field: keyof BitacoraSupervisorData, value: any) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Datos Técnicos de la Faena</h2>
        <p className="mt-2 text-gray-600">
          Información sobre equipos utilizados y trabajo realizado
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Equipos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Equipos Utilizados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="equipos_utilizados">Equipos Utilizados</Label>
              <Select value={data.equipos_utilizados} onValueChange={(value) => handleInputChange('equipos_utilizados', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar equipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equipo_autonomo">Equipo Autónomo</SelectItem>
                  <SelectItem value="superficie_suministrada">Superficie Suministrada</SelectItem>
                  <SelectItem value="casco_rigido">Casco Rígido</SelectItem>
                  <SelectItem value="mixto">Mixto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="matricula">Matrícula</Label>
              <Input
                id="matricula"
                value={data.matricula_equipo}
                onChange={(e) => handleInputChange('matricula_equipo', e.target.value)}
                placeholder="Matrícula del equipo"
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-green-600" />
              Trabajo y Apoyo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="trabajo_realizar">Trabajo a Realizar</Label>
              <Textarea
                id="trabajo_realizar"
                value={data.trabajo_realizar}
                onChange={(e) => handleInputChange('trabajo_realizar', e.target.value)}
                placeholder="Descripción del trabajo realizado..."
                rows={3}
              />
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
    </div>
  );
};
