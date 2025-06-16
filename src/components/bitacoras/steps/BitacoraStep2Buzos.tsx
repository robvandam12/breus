
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Trash2, UserCheck } from "lucide-react";
import { BitacoraSupervisorData } from '../BitacoraWizardFromInmersion';

interface BitacoraStep2BuzosProps {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
  equipoBuceo?: any;
}

export const BitacoraStep2Buzos = ({ data, onUpdate, equipoBuceo }: BitacoraStep2BuzosProps) => {
  const agregarBuzoEquipo = (miembro: any) => {
    const nuevoBuzo = {
      nombre: miembro.nombre || '',
      apellido: '',
      rut: '',
      rol: miembro.rol_equipo,
      profundidad_trabajo: 0,
      tiempo_inmersion: 0,
      del_equipo_buceo: true
    };

    const buzosActuales = data.inmersiones_buzos || [];
    onUpdate({
      inmersiones_buzos: [...buzosActuales, nuevoBuzo]
    });
  };

  const agregarBuzoExterno = () => {
    const nuevoBuzo = {
      nombre: '',
      apellido: '',
      rut: '',
      rol: 'Buzo Emergencia',
      profundidad_trabajo: 0,
      tiempo_inmersion: 0,
      del_equipo_buceo: false
    };

    const buzosActuales = data.inmersiones_buzos || [];
    onUpdate({
      inmersiones_buzos: [...buzosActuales, nuevoBuzo]
    });
  };

  const actualizarBuzo = (index: number, campo: string, valor: any) => {
    const buzosActualizados = [...(data.inmersiones_buzos || [])];
    buzosActualizados[index] = {
      ...buzosActualizados[index],
      [campo]: valor
    };
    onUpdate({ inmersiones_buzos: buzosActualizados });
  };

  const eliminarBuzo = (index: number) => {
    const buzosActualizados = (data.inmersiones_buzos || []).filter((_, i) => i !== index);
    onUpdate({ inmersiones_buzos: buzosActualizados });
  };

  const miembrosDisponibles = equipoBuceo?.miembros?.filter(miembro => 
    !(data.inmersiones_buzos || []).some(buzo => 
      buzo.nombre === miembro.nombre && buzo.del_equipo_buceo
    )
  ) || [];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Buzos y Asistentes</h2>
        <p className="mt-2 text-gray-600">
          Personal participante en la inmersión
        </p>
      </div>

      {/* Equipo de Buceo Asignado */}
      {equipoBuceo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Equipo de Buceo: {equipoBuceo.nombre}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {miembrosDisponibles.map((miembro, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{miembro.nombre || 'Sin nombre'}</p>
                    <p className="text-sm text-gray-600">{miembro.rol_equipo}</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => agregarBuzoEquipo(miembro)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar
                  </Button>
                </div>
              ))}
            </div>
            {miembrosDisponibles.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Todos los miembros del equipo ya están agregados
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Buzos Participantes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-green-600" />
              Buzos Participantes ({(data.inmersiones_buzos || []).length})
            </span>
            <Button onClick={agregarBuzoExterno} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Buzo Externo
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(data.inmersiones_buzos || []).length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay buzos agregados. Agregue buzos del equipo o buzos externos.
            </p>
          ) : (
            <div className="space-y-4">
              {(data.inmersiones_buzos || []).map((buzo, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={buzo.del_equipo_buceo ? "default" : "secondary"}>
                        {buzo.del_equipo_buceo ? "Del Equipo" : "Externo"}
                      </Badge>
                      <span className="font-medium">{buzo.rol}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => eliminarBuzo(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label>Nombre</Label>
                      <Input
                        value={buzo.nombre}
                        onChange={(e) => actualizarBuzo(index, 'nombre', e.target.value)}
                        placeholder="Nombre del buzo"
                        disabled={buzo.del_equipo_buceo}
                      />
                    </div>
                    <div>
                      <Label>Apellido</Label>
                      <Input
                        value={buzo.apellido}
                        onChange={(e) => actualizarBuzo(index, 'apellido', e.target.value)}
                        placeholder="Apellido del buzo"
                      />
                    </div>
                    <div>
                      <Label>RUT</Label>
                      <Input
                        value={buzo.rut}
                        onChange={(e) => actualizarBuzo(index, 'rut', e.target.value)}
                        placeholder="12.345.678-9"
                      />
                    </div>
                    <div>
                      <Label>Rol</Label>
                      <Select 
                        value={buzo.rol} 
                        onValueChange={(value) => actualizarBuzo(index, 'rol', value)}
                        disabled={buzo.del_equipo_buceo}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Supervisor">Supervisor</SelectItem>
                          <SelectItem value="Buzo N°1">Buzo N°1</SelectItem>
                          <SelectItem value="Buzo N°2">Buzo N°2</SelectItem>
                          <SelectItem value="Buzo Emergencia">Buzo Emergencia</SelectItem>
                          <SelectItem value="Comunicador">Comunicador</SelectItem>
                          <SelectItem value="Asistente">Asistente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label>Profundidad de Trabajo (m)</Label>
                      <Input
                        type="number"
                        value={buzo.profundidad_trabajo || 0}
                        onChange={(e) => actualizarBuzo(index, 'profundidad_trabajo', Number(e.target.value))}
                        placeholder="Profundidad en metros"
                      />
                    </div>
                    <div>
                      <Label>Tiempo de Inmersión (min)</Label>
                      <Input
                        type="number"
                        value={buzo.tiempo_inmersion || 0}
                        onChange={(e) => actualizarBuzo(index, 'tiempo_inmersion', Number(e.target.value))}
                        placeholder="Tiempo en minutos"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <strong>Información:</strong> Los buzos del equipo de buceo se auto-pueblan automáticamente. 
            Solo necesita completar RUT, apellido y profundidades de trabajo. Para buzos de emergencia 
            externos, agregue manualmente sus datos completos.
          </div>
        </div>
      </div>
    </div>
  );
};
