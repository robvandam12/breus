
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Ship, Plus, X } from "lucide-react";
import { BitacoraSupervisorData } from "../BitacoraWizard";
import { useState } from "react";

interface EquipoUtilizado {
  id: string;
  nombre: string;
  matricula: string;
  vigencia: string;
}

interface BitacoraStep4Props {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
}

export const BitacoraStep4 = ({ data, onUpdate }: BitacoraStep4Props) => {
  const [equiposUtilizados, setEquiposUtilizados] = useState<EquipoUtilizado[]>(() => {
    return data.equipos_utilizados || [];
  });

  const equiposDisponibles = [
    'Equipo de Buceo Autónomo',
    'Equipo de Superficie',
    'Casco de Buceo',
    'Traje de Neopreno',
    'Compresor',
    'Winche',
    'Embarcación de Apoyo',
    'Sistema de Comunicación',
    'Equipos de Soldadura Subacuática',
    'Herramientas de Corte'
  ];

  const trabajosComunes = [
    'Inspección de estructuras',
    'Limpieza de cascos',
    'Soldadura subacuática',
    'Corte subacuático',
    'Instalación de equipos',
    'Mantenimiento de jaulas',
    'Reparación de redes',
    'Búsqueda y rescate',
    'Fotografía subacuática',
    'Toma de muestras'
  ];

  const agregarEquipo = () => {
    const nuevoEquipo: EquipoUtilizado = {
      id: `equipo-${Date.now()}`,
      nombre: '',
      matricula: '',
      vigencia: ''
    };
    const nuevosEquipos = [...equiposUtilizados, nuevoEquipo];
    setEquiposUtilizados(nuevosEquipos);
    onUpdate({ equipos_utilizados: nuevosEquipos });
  };

  const eliminarEquipo = (equipoId: string) => {
    const nuevosEquipos = equiposUtilizados.filter(eq => eq.id !== equipoId);
    setEquiposUtilizados(nuevosEquipos);
    onUpdate({ equipos_utilizados: nuevosEquipos });
  };

  const actualizarEquipo = (equipoId: string, campo: keyof EquipoUtilizado, valor: string) => {
    const nuevosEquipos = equiposUtilizados.map(eq => 
      eq.id === equipoId ? { ...eq, [campo]: valor } : eq
    );
    setEquiposUtilizados(nuevosEquipos);
    onUpdate({ equipos_utilizados: nuevosEquipos });
  };

  const handleInputChange = (field: keyof BitacoraSupervisorData, value: any) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Datos Técnicos de la Faena</h2>
        <p className="mt-2 text-gray-600">
          Equipos utilizados y detalles del trabajo realizado
        </p>
      </div>

      {/* Equipos Utilizados */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Equipos Utilizados
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {equiposUtilizados.length} {equiposUtilizados.length === 1 ? 'Equipo' : 'Equipos'}
              </Badge>
              <Button
                onClick={agregarEquipo}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar Equipo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {equiposUtilizados.length > 0 ? (
            equiposUtilizados.map((equipo, index) => (
              <div key={equipo.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Equipo {index + 1}</h4>
                  <Button
                    onClick={() => eliminarEquipo(equipo.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor={`equipo-nombre-${equipo.id}`}>Nombre del Equipo</Label>
                    <Select 
                      value={equipo.nombre}
                      onValueChange={(value) => actualizarEquipo(equipo.id, 'nombre', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar equipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {equiposDisponibles.map((equipoNombre) => (
                          <SelectItem key={equipoNombre} value={equipoNombre}>
                            {equipoNombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`equipo-matricula-${equipo.id}`}>Matrícula</Label>
                    <Input
                      id={`equipo-matricula-${equipo.id}`}
                      value={equipo.matricula}
                      onChange={(e) => actualizarEquipo(equipo.id, 'matricula', e.target.value)}
                      placeholder="Número de matrícula"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`equipo-vigencia-${equipo.id}`}>Vigencia del Equipo</Label>
                    <Input
                      id={`equipo-vigencia-${equipo.id}`}
                      type="date"
                      value={equipo.vigencia}
                      onChange={(e) => actualizarEquipo(equipo.id, 'vigencia', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
              <Settings className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 mb-3">No hay equipos registrados</p>
              <Button onClick={agregarEquipo} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primer Equipo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trabajo Realizado */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Ship className="w-5 h-5 text-green-600" />
            Trabajo Realizado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="trabajo_realizar">Trabajo a Realizar</Label>
            <Select 
              value={data.trabajo_a_realizar || ''}
              onValueChange={(value) => handleInputChange('trabajo_a_realizar', value)}
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
                <SelectItem value="otro">Otro (especificar en descripción)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="descripcion_trabajo">Descripción Detallada del Trabajo</Label>
            <Textarea
              id="descripcion_trabajo"
              value={data.descripcion_trabajo}
              onChange={(e) => handleInputChange('descripcion_trabajo', e.target.value)}
              placeholder="Describa detalladamente el trabajo realizado..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="embarcacion_apoyo">Embarcación de Apoyo (Opcional)</Label>
            <Input
              id="embarcacion_apoyo"
              value={data.embarcacion_apoyo}
              onChange={(e) => handleInputChange('embarcacion_apoyo', e.target.value)}
              placeholder="Nombre y matrícula de la embarcación de apoyo"
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Settings className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-sm text-orange-800">
            <strong>Información:</strong> Registre todos los equipos utilizados durante la faena. 
            Cada equipo debe tener su matrícula y fecha de vigencia actualizada.
          </div>
        </div>
      </div>
    </div>
  );
};
