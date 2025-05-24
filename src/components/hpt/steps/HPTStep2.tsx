
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Users } from "lucide-react";

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
    if (newBuzo.nombre && newBuzo.certificacion) {
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
    if (newAsistente.nombre) {
      const updatedAsistentes = [...(data.asistentes || []), { ...newAsistente, id: Date.now() }];
      onUpdate({ asistentes: updatedAsistentes });
      setNewAsistente({ nombre: "", rol: "asistente" });
    }
  };

  const removeAsistente = (index: number) => {
    const updatedAsistentes = data.asistentes.filter((_: any, i: number) => i !== index);
    onUpdate({ asistentes: updatedAsistentes });
  };

  const certificaciones = [
    "PADI Open Water",
    "PADI Advanced Open Water", 
    "PADI Rescue Diver",
    "SSI Open Water Diver",
    "NAUI Scuba Diver",
    "Buceo Comercial Nivel 1",
    "Buceo Comercial Nivel 2"
  ];

  const roles = [
    "Buzo Principal",
    "Buzo de Apoyo", 
    "Buzo de Reserva",
    "Tender"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Equipo de Buceo</h3>
        <p className="text-sm text-zinc-500 mb-6">
          Configure el equipo de buzos y asistentes que participarán en la operación.
        </p>
      </div>

      {/* Sección Buzos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Buzos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <Input
              placeholder="Nombre del buzo"
              value={newBuzo.nombre}
              onChange={(e) => setNewBuzo({ ...newBuzo, nombre: e.target.value })}
            />
            <Select
              value={newBuzo.certificacion}
              onValueChange={(value) => setNewBuzo({ ...newBuzo, certificacion: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Certificación" />
              </SelectTrigger>
              <SelectContent>
                {certificaciones.map((cert) => (
                  <SelectItem key={cert} value={cert}>
                    {cert}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              placeholder="Vencimiento"
              value={newBuzo.vencimiento}
              onChange={(e) => setNewBuzo({ ...newBuzo, vencimiento: e.target.value })}
            />
            <Button onClick={addBuzo} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Agregar Buzo
            </Button>
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
                        className="text-red-600 hover:text-red-700"
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

      {/* Sección Asistentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Asistentes de Superficie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Nombre del asistente"
              value={newAsistente.nombre}
              onChange={(e) => setNewAsistente({ ...newAsistente, nombre: e.target.value })}
            />
            <Select
              value={newAsistente.rol}
              onValueChange={(value) => setNewAsistente({ ...newAsistente, rol: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((rol) => (
                  <SelectItem key={rol} value={rol}>
                    {rol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addAsistente} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Agregar Asistente
            </Button>
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
                        className="text-red-600 hover:text-red-700"
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
