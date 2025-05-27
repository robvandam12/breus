
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, Clock, Plus, X } from "lucide-react";

interface HPTStep5Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep5 = ({ data, onUpdate }: HPTStep5Props) => {
  const handleContactoChange = (index: number, field: string, value: string) => {
    const currentContactos = data.contactos_emergencia || [];
    const updatedContactos = [...currentContactos];
    
    if (!updatedContactos[index]) {
      updatedContactos[index] = {};
    }
    
    updatedContactos[index] = {
      ...updatedContactos[index],
      [field]: value
    };
    
    onUpdate({
      contactos_emergencia: updatedContactos
    });
  };

  const addContacto = () => {
    const currentContactos = data.contactos_emergencia || [];
    onUpdate({
      contactos_emergencia: [
        ...currentContactos,
        { nombre: '', cargo: '', telefono: '' }
      ]
    });
  };

  const removeContacto = (index: number) => {
    const currentContactos = data.contactos_emergencia || [];
    const updatedContactos = currentContactos.filter((_: any, i: number) => i !== index);
    onUpdate({
      contactos_emergencia: updatedContactos
    });
  };

  const contactos = data.contactos_emergencia || [];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Procedimientos de Emergencia</h2>
        <p className="mt-2 text-gray-600">
          Plan de emergencia y contactos de respuesta inmediata
        </p>
      </div>

      {/* Plan de Emergencia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-600" />
            Plan de Emergencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="plan_emergencia">Descripción del Plan de Emergencia</Label>
            <Textarea
              id="plan_emergencia"
              value={data.plan_emergencia || ''}
              onChange={(e) => onUpdate({ plan_emergencia: e.target.value })}
              placeholder="Describa el plan de emergencia específico para esta operación, incluyendo procedimientos de evacuación, comunicación y respuesta..."
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contactos de Emergencia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-600" />
            Contactos de Emergencia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {contactos.map((contacto: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contacto #{index + 1}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeContacto(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`contacto_nombre_${index}`}>Nombre</Label>
                  <Input
                    id={`contacto_nombre_${index}`}
                    value={contacto.nombre || ''}
                    onChange={(e) => handleContactoChange(index, 'nombre', e.target.value)}
                    placeholder="Nombre completo"
                  />
                </div>

                <div>
                  <Label htmlFor={`contacto_cargo_${index}`}>Cargo/Función</Label>
                  <Input
                    id={`contacto_cargo_${index}`}
                    value={contacto.cargo || ''}
                    onChange={(e) => handleContactoChange(index, 'cargo', e.target.value)}
                    placeholder="Ej: Supervisor de Seguridad"
                  />
                </div>

                <div>
                  <Label htmlFor={`contacto_telefono_${index}`}>Teléfono</Label>
                  <Input
                    id={`contacto_telefono_${index}`}
                    value={contacto.telefono || ''}
                    onChange={(e) => handleContactoChange(index, 'telefono', e.target.value)}
                    placeholder="+56 9 1234 5678"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            onClick={addContacto}
            variant="outline"
            className="w-full border-2 border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Contacto de Emergencia
          </Button>

          {contactos.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Phone className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No hay contactos de emergencia registrados</p>
              <p className="text-sm">Agregue al menos un contacto para continuar</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ubicaciones de Emergencia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Hospital Más Cercano
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="hospital_cercano">Ubicación y Contacto</Label>
              <Textarea
                id="hospital_cercano"
                value={data.hospital_cercano || ''}
                onChange={(e) => onUpdate({ hospital_cercano: e.target.value })}
                placeholder="Nombre del hospital, dirección, teléfono y tiempo estimado de traslado..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              Cámara Hiperbárica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="camara_hiperbarica">Ubicación y Contacto</Label>
              <Textarea
                id="camara_hiperbarica"
                value={data.camara_hiperbarica || ''}
                onChange={(e) => onUpdate({ camara_hiperbarica: e.target.value })}
                placeholder="Ubicación de la cámara hiperbárica más cercana, contacto y tiempo de traslado..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Números de Emergencia Estándar */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Números de Emergencia Estándar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge variant="destructive" className="mb-2">133</Badge>
              <p className="text-sm text-red-700">Bomberos</p>
            </div>
            <div className="text-center">
              <Badge variant="destructive" className="mb-2">131</Badge>
              <p className="text-sm text-red-700">Ambulancia</p>
            </div>
            <div className="text-center">
              <Badge variant="destructive" className="mb-2">132</Badge>
              <p className="text-sm text-red-700">Carabineros</p>
            </div>
            <div className="text-center">
              <Badge variant="destructive" className="mb-2">137</Badge>
              <p className="text-sm text-red-700">Armada</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Phone className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-sm text-red-800">
            <strong>Crítico:</strong> Asegúrese de que todos los contactos de emergencia estén actualizados y disponibles. 
            Para operaciones de buceo a más de 40 metros, la ubicación de la cámara hiperbárica es obligatoria. 
            Verifique que todos los números sean funcionales antes de iniciar la operación.
          </div>
        </div>
      </div>
    </div>
  );
};
