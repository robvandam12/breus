
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone, Plus, Trash2, MapPin } from "lucide-react";

interface HPTStep5Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep5 = ({ data, onUpdate }: HPTStep5Props) => {
  const [newContacto, setNewContacto] = useState({
    nombre: '',
    cargo: '',
    telefono: ''
  });

  const addContacto = () => {
    if (newContacto.nombre && newContacto.telefono) {
      const updatedContactos = [...(data.contactos_emergencia || []), newContacto];
      onUpdate({ contactos_emergencia: updatedContactos });
      setNewContacto({ nombre: '', cargo: '', telefono: '' });
    }
  };

  const removeContacto = (index: number) => {
    const updatedContactos = (data.contactos_emergencia || []).filter((_: any, i: number) => i !== index);
    onUpdate({ contactos_emergencia: updatedContactos });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Procedimientos de Emergencia</h2>
        <p className="mt-2 text-gray-600">
          Plan de respuesta ante emergencias y contactos críticos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Plan de Emergencia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="plan_emergencia">Descripción del Plan de Emergencia *</Label>
            <Textarea
              id="plan_emergencia"
              value={data.plan_emergencia || ''}
              onChange={(e) => onUpdate({ plan_emergencia: e.target.value })}
              placeholder="Detalle los procedimientos a seguir en caso de emergencia..."
              rows={5}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contactos de Emergencia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="contacto_nombre">Nombre</Label>
              <Input
                id="contacto_nombre"
                value={newContacto.nombre}
                onChange={(e) => setNewContacto({...newContacto, nombre: e.target.value})}
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <Label htmlFor="contacto_cargo">Cargo</Label>
              <Input
                id="contacto_cargo"
                value={newContacto.cargo}
                onChange={(e) => setNewContacto({...newContacto, cargo: e.target.value})}
                placeholder="Cargo o función"
              />
            </div>
            <div>
              <Label htmlFor="contacto_telefono">Teléfono</Label>
              <Input
                id="contacto_telefono"
                value={newContacto.telefono}
                onChange={(e) => setNewContacto({...newContacto, telefono: e.target.value})}
                placeholder="+56 9 1234 5678"
              />
            </div>
          </div>
          <Button onClick={addContacto} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Contacto
          </Button>

          {data.contactos_emergencia && data.contactos_emergencia.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Contactos Registrados:</h4>
              {data.contactos_emergencia.map((contacto: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="font-medium">{contacto.nombre}</div>
                      <div className="text-sm text-gray-600">
                        {contacto.cargo} - {contacto.telefono}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeContacto(index)}
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
            <MapPin className="w-5 h-5" />
            Centros Médicos de Emergencia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hospital_cercano">Hospital o Centro Médico más Cercano</Label>
            <Input
              id="hospital_cercano"
              value={data.hospital_cercano || ''}
              onChange={(e) => onUpdate({ hospital_cercano: e.target.value })}
              placeholder="Nombre y dirección del hospital"
            />
          </div>

          <div>
            <Label htmlFor="camara_hiperbarica">Cámara Hiperbárica más Cercana</Label>
            <Input
              id="camara_hiperbarica"
              value={data.camara_hiperbarica || ''}
              onChange={(e) => onUpdate({ camara_hiperbarica: e.target.value })}
              placeholder="Ubicación de la cámara hiperbárica"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
