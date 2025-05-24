
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Trash2 } from "lucide-react";

interface HPTStep2Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep2 = ({ data, onUpdate }: HPTStep2Props) => {
  const [newBuzo, setNewBuzo] = useState({
    nombre: "",
    certificacion: "",
    vencimiento: "",
    rol: "buzo"
  });

  const [newAsistente, setNewAsistente] = useState({
    nombre: "",
    rol: "asistente"
  });

  const addBuzo = () => {
    if (newBuzo.nombre.trim()) {
      const updatedBuzos = [...(data.buzos || []), { ...newBuzo, id: Date.now() }];
      onUpdate({ buzos: updatedBuzos });
      setNewBuzo({ nombre: "", certificacion: "", vencimiento: "", rol: "buzo" });
    }
  };

  const removeBuzo = (index: number) => {
    const updatedBuzos = data.buzos.filter((_: any, i: number) => i !== index);
    onUpdate({ buzos: updatedBuzos });
  };

  const addAsistente = () => {
    if (newAsistente.nombre.trim()) {
      const updatedAsistentes = [...(data.asistentes || []), { ...newAsistente, id: Date.now() }];
      onUpdate({ asistentes: updatedAsistentes });
      setNewAsistente({ nombre: "", rol: "asistente" });
    }
  };

  const removeAsistente = (index: number) => {
    const updatedAsistentes = data.asistentes.filter((_: any, i: number) => i !== index);
    onUpdate({ asistentes: updatedAsistentes });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Equipo de Buceo</h2>
        <p className="mt-2 text-gray-600">
          Define el equipo de buzos y asistentes para la operación
        </p>
      </div>

      {/* Buzos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Buzos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="buzo-nombre">Nombre *</Label>
              <Input
                id="buzo-nombre"
                value={newBuzo.nombre}
                onChange={(e) => setNewBuzo(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Nombre del buzo"
              />
            </div>
            <div>
              <Label htmlFor="buzo-cert">Certificación</Label>
              <Input
                id="buzo-cert"
                value={newBuzo.certificacion}
                onChange={(e) => setNewBuzo(prev => ({ ...prev, certificacion: e.target.value }))}
                placeholder="Tipo de certificación"
              />
            </div>
            <div>
              <Label htmlFor="buzo-venc">Vencimiento</Label>
              <Input
                id="buzo-venc"
                type="date"
                value={newBuzo.vencimiento}
                onChange={(e) => setNewBuzo(prev => ({ ...prev, vencimiento: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addBuzo} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
          </div>

          {data.buzos && data.buzos.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Certificación</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.buzos.map((buzo: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{buzo.nombre}</TableCell>
                    <TableCell>{buzo.certificacion}</TableCell>
                    <TableCell>{buzo.vencimiento}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeBuzo(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Asistentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Asistentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="asistente-nombre">Nombre *</Label>
              <Input
                id="asistente-nombre"
                value={newAsistente.nombre}
                onChange={(e) => setNewAsistente(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Nombre del asistente"
              />
            </div>
            <div>
              <Label htmlFor="asistente-rol">Rol</Label>
              <Select
                value={newAsistente.rol}
                onValueChange={(value) => setNewAsistente(prev => ({ ...prev, rol: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asistente">Asistente</SelectItem>
                  <SelectItem value="operador">Operador</SelectItem>
                  <SelectItem value="supervisor_superficie">Supervisor de Superficie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={addAsistente} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
          </div>

          {data.asistentes && data.asistentes.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.asistentes.map((asistente: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{asistente.nombre}</TableCell>
                    <TableCell>{asistente.rol}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeAsistente(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
