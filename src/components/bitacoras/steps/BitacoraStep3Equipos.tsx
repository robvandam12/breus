
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Wrench, Plus, Trash2 } from "lucide-react";
import { BitacoraSupervisorData } from '../BitacoraWizardFromInmersion';

interface BitacoraStep3EquiposProps {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
}

export const BitacoraStep3Equipos = ({ data, onUpdate }: BitacoraStep3EquiposProps) => {
  const agregarEquipo = () => {
    const nuevoEquipo = {
      nombre: '',
      tipo: '',
      estado: 'bueno',
      observaciones: ''
    };

    const equiposActuales = data.equipos_utilizados || [];
    onUpdate({
      equipos_utilizados: [...equiposActuales, nuevoEquipo]
    });
  };

  const actualizarEquipo = (index: number, campo: string, valor: any) => {
    const equiposActualizados = [...(data.equipos_utilizados || [])];
    equiposActualizados[index] = {
      ...equiposActualizados[index],
      [campo]: valor
    };
    onUpdate({ equipos_utilizados: equiposActualizados });
  };

  const eliminarEquipo = (index: number) => {
    const equiposActualizados = (data.equipos_utilizados || []).filter((_, i) => i !== index);
    onUpdate({ equipos_utilizados: equiposActualizados });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Equipos Utilizados</h2>
        <p className="mt-2 text-gray-600">
          Registro de equipos y herramientas utilizadas en la inmersión
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-orange-600" />
              Equipos Registrados ({(data.equipos_utilizados || []).length})
            </span>
            <Button onClick={agregarEquipo} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Equipo
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(data.equipos_utilizados || []).length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay equipos registrados. Agregue los equipos utilizados en la inmersión.
            </p>
          ) : (
            <div className="space-y-4">
              {(data.equipos_utilizados || []).map((equipo, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline">Equipo {index + 1}</Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => eliminarEquipo(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nombre del Equipo</Label>
                      <Input
                        value={equipo.nombre}
                        onChange={(e) => actualizarEquipo(index, 'nombre', e.target.value)}
                        placeholder="Nombre del equipo"
                      />
                    </div>
                    <div>
                      <Label>Tipo</Label>
                      <Select 
                        value={equipo.tipo} 
                        onValueChange={(value) => actualizarEquipo(index, 'tipo', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="respiracion">Equipo de Respiración</SelectItem>
                          <SelectItem value="herramienta">Herramienta</SelectItem>
                          <SelectItem value="comunicacion">Comunicación</SelectItem>
                          <SelectItem value="seguridad">Seguridad</SelectItem>
                          <SelectItem value="medicion">Medición</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <Select 
                        value={equipo.estado} 
                        onValueChange={(value) => actualizarEquipo(index, 'estado', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="malo">Malo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Observaciones</Label>
                      <Input
                        value={equipo.observaciones || ''}
                        onChange={(e) => actualizarEquipo(index, 'observaciones', e.target.value)}
                        placeholder="Observaciones del equipo"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Wrench className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-sm text-orange-800">
            <strong>Información:</strong> Registre todos los equipos utilizados durante la inmersión, 
            incluyendo herramientas, equipos de respiración, comunicación y seguridad. 
            Esto es importante para el control de inventario y mantenimiento.
          </div>
        </div>
      </div>
    </div>
  );
};
