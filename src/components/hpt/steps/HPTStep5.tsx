
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Phone, Plus, Trash2 } from "lucide-react";

interface HPTStep5Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep5 = ({ data, onUpdate }: HPTStep5Props) => {
  const [newContacto, setNewContacto] = useState({
    nombre: "",
    cargo: "",
    telefono: ""
  });

  const addContacto = () => {
    if (newContacto.nombre.trim() && newContacto.telefono.trim()) {
      const updatedContactos = [...(data.contactos_emergencia || []), { ...newContacto, id: Date.now() }];
      onUpdate({ contactos_emergencia: updatedContactos });
      setNewContacto({ nombre: "", cargo: "", telefono: "" });
    }
  };

  const removeContacto = (index: number) => {
    const updatedContactos = data.contactos_emergencia.filter((_: any, i: number) => i !== index);
    onUpdate({ contactos_emergencia: updatedContactos });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Procedimientos de Emergencia</h2>
        <p className="mt-2 text-gray-600">
          Define el plan de emergencia y contactos críticos
        </p>
      </div>

      {/* Plan de Emergencia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Plan de Emergencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="plan_emergencia">Descripción del Plan de Emergencia *</Label>
            <Textarea
              id="plan_emergencia"
              value={data.plan_emergencia || ''}
              onChange={(e) => onUpdate({ plan_emergencia: e.target.value })}
              placeholder="Describe los procedimientos a seguir en caso de emergencia..."
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contactos de Emergencia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contactos de Emergencia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="contacto-nombre">Nombre *</Label>
              <Input
                id="contacto-nombre"
                value={newContacto.nombre}
                onChange={(e) => setNewContacto(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <Label htmlFor="contacto-cargo">Cargo</Label>
              <Input
                id="contacto-cargo"
                value={newContacto.cargo}
                onChange={(e) => setNewContacto(prev => ({ ...prev, cargo: e.target.value }))}
                placeholder="Cargo o función"
              />
            </div>
            <div>
              <Label htmlFor="contacto-telefono">Teléfono *</Label>
              <Input
                id="contacto-telefono"
                value={newContacto.telefono}
                onChange={(e) => setNewContacto(prev => ({ ...prev, telefono: e.target.value }))}
                placeholder="+56 9 1234 5678"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addContacto} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
          </div>

          {data.contactos_emergencia && data.contactos_emergencia.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.contactos_emergencia.map((contacto: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{contacto.nombre}</TableCell>
                    <TableCell>{contacto.cargo}</TableCell>
                    <TableCell>{contacto.telefono}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeContacto(index)}
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

      {/* Instalaciones de Emergencia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Instalaciones de Emergencia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hospital_cercano">Hospital más Cercano</Label>
              <Input
                id="hospital_cercano"
                value={data.hospital_cercano || ''}
                onChange={(e) => onUpdate({ hospital_cercano: e.target.value })}
                placeholder="Nombre y dirección del hospital"
              />
            </div>
            <div>
              <Label htmlFor="camara_hiperbarica">Cámara Hiperbárica</Label>
              <Input
                id="camara_hiperbarica"
                value={data.camara_hiperbarica || ''}
                onChange={(e) => onUpdate({ camara_hiperbarica: e.target.value })}
                placeholder="Ubicación de la cámara hiperbárica"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
