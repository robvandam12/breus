
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
    if (newBuzo.nombre && newBuzo.certificacion) {
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
          Personal involucrado en la operación de buceo
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
              <Label htmlFor="buzo_nombre">Nombre</Label>
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
                  <SelectValue placeholder="Tipo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="padi-ow">PADI Open Water</SelectItem>
                  <SelectItem value="padi-aow">PADI Advanced Open Water</SelectItem>
                  <SelectItem value="padi-rescue">PADI Rescue Diver</SelectItem>
                  <SelectItem value="padi-dm">PADI Divemaster</SelectItem>
                  <SelectItem value="ssi-ow">SSI Open Water</SelectItem>
                  <SelectItem value="comercial">Buceo Comercial</SelectItem>
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
              <Label htmlFor="buzo_rol">Rol</Label>
              <Select
                value={newBuzo.rol}
                onValueChange={(value) => setNewBuzo({...newBuzo, rol: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rol..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="principal">Buzo Principal</SelectItem>
                  <SelectItem value="asistente">Buzo Asistente</SelectItem>
                  <SelectItem value="standby">Buzo Standby</SelectItem>
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
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="font-medium">{buzo.nombre}</div>
                      <div className="text-sm text-gray-600">
                        {buzo.certificacion} - {buzo.rol}
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
              <Label htmlFor="asistente_nombre">Nombre</Label>
              <Input
                id="asistente_nombre"
                value={newAsistente.nombre}
                onChange={(e) => setNewAsistente({...newAsistente, nombre: e.target.value})}
                placeholder="Nombre del asistente"
              />
            </div>
            <div>
              <Label htmlFor="asistente_rol">Rol</Label>
              <Select
                value={newAsistente.rol}
                onValueChange={(value) => setNewAsistente({...newAsistente, rol: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rol..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tender">Tender</SelectItem>
                  <SelectItem value="operador">Operador de Superficie</SelectItem>
                  <SelectItem value="seguridad">Oficial de Seguridad</SelectItem>
                  <SelectItem value="medico">Paramédico</SelectItem>
                  <SelectItem value="tecnico">Técnico</SelectItem>
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
              <h4 className="font-medium">Personal de Apoyo:</h4>
              {data.asistentes.map((asistente: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-blue-600" />
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
