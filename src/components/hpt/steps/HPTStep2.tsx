
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Trash2, UserCheck } from "lucide-react";

interface HPTStep2Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep2 = ({ data, onUpdate }: HPTStep2Props) => {
  const [newBuzo, setNewBuzo] = useState({
    nombre: '',
    certificacion: '',
    vencimiento: '',
    rol: ''
  });

  const [newAsistente, setNewAsistente] = useState({
    nombre: '',
    rol: ''
  });

  const addBuzo = () => {
    if (newBuzo.nombre && newBuzo.certificacion && newBuzo.vencimiento && newBuzo.rol) {
      const updatedBuzos = [...(data.buzos || []), newBuzo];
      onUpdate({ buzos: updatedBuzos });
      setNewBuzo({ nombre: '', certificacion: '', vencimiento: '', rol: '' });
    }
  };

  const removeBuzo = (index: number) => {
    const updatedBuzos = (data.buzos || []).filter((_: any, i: number) => i !== index);
    onUpdate({ buzos: updatedBuzos });
  };

  const addAsistente = () => {
    if (newAsistente.nombre && newAsistente.rol) {
      const updatedAsistentes = [...(data.asistentes || []), newAsistente];
      onUpdate({ asistentes: updatedAsistentes });
      setNewAsistente({ nombre: '', rol: '' });
    }
  };

  const removeAsistente = (index: number) => {
    const updatedAsistentes = (data.asistentes || []).filter((_: any, i: number) => i !== index);
    onUpdate({ asistentes: updatedAsistentes });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Equipo de Buceo</h2>
        <p className="mt-2 text-gray-600">
          Personal certificado y asistentes para la operación
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Buzos Certificados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="buzo_nombre">Nombre Completo</Label>
              <Input
                id="buzo_nombre"
                value={newBuzo.nombre}
                onChange={(e) => setNewBuzo({...newBuzo, nombre: e.target.value})}
                placeholder="Nombre del buzo"
              />
            </div>
            <div>
              <Label htmlFor="buzo_certificacion">Certificación</Label>
              <Select
                value={newBuzo.certificacion}
                onValueChange={(value) => setNewBuzo({...newBuzo, certificacion: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de certificación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open_water">Open Water</SelectItem>
                  <SelectItem value="advanced">Advanced Open Water</SelectItem>
                  <SelectItem value="rescue">Rescue Diver</SelectItem>
                  <SelectItem value="divemaster">Divemaster</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="comercial">Buceo Comercial</SelectItem>
                  <SelectItem value="industrial">Buceo Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="buzo_vencimiento">Vencimiento</Label>
              <Input
                id="buzo_vencimiento"
                type="date"
                value={newBuzo.vencimiento}
                onChange={(e) => setNewBuzo({...newBuzo, vencimiento: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="buzo_rol">Rol en la Operación</Label>
              <Select
                value={newBuzo.rol}
                onValueChange={(value) => setNewBuzo({...newBuzo, rol: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buzo_principal">Buzo Principal</SelectItem>
                  <SelectItem value="buzo_seguridad">Buzo de Seguridad</SelectItem>
                  <SelectItem value="buzo_standby">Buzo Standby</SelectItem>
                  <SelectItem value="supervisor_buceo">Supervisor de Buceo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={addBuzo} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Buzo
          </Button>

          {data.buzos && data.buzos.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Buzos Registrados:</h4>
              {data.buzos.map((buzo: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900">{buzo.nombre}</div>
                      <div className="text-sm text-blue-700">
                        {buzo.certificacion} - {buzo.rol}
                      </div>
                      <div className="text-xs text-blue-600">
                        Vence: {new Date(buzo.vencimiento).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeBuzo(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Personal de Apoyo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="asistente_nombre">Nombre Completo</Label>
              <Input
                id="asistente_nombre"
                value={newAsistente.nombre}
                onChange={(e) => setNewAsistente({...newAsistente, nombre: e.target.value})}
                placeholder="Nombre del asistente"
              />
            </div>
            <div>
              <Label htmlFor="asistente_rol">Función</Label>
              <Select
                value={newAsistente.rol}
                onValueChange={(value) => setNewAsistente({...newAsistente, rol: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar función" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tendero">Tendero</SelectItem>
                  <SelectItem value="operador_compresor">Operador de Compresor</SelectItem>
                  <SelectItem value="asistente_superficie">Asistente de Superficie</SelectItem>
                  <SelectItem value="operador_grua">Operador de Grúa</SelectItem>
                  <SelectItem value="soldador">Soldador</SelectItem>
                  <SelectItem value="tecnico">Técnico</SelectItem>
                  <SelectItem value="seguridad">Personal de Seguridad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={addAsistente} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Asistente
          </Button>

          {data.asistentes && data.asistentes.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Personal de Apoyo Registrado:</h4>
              {data.asistentes.map((asistente: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium">{asistente.nombre}</div>
                      <div className="text-sm text-gray-600">{asistente.rol}</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeAsistente(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
