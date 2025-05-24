
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Plus, Trash2, AlertTriangle, Phone, MapPin } from "lucide-react";

interface HPTStep5Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep5 = ({ data, onUpdate }: HPTStep5Props) => {
  const form = useForm({
    defaultValues: {
      planEmergencia: data.planEmergencia || "",
      hospitalCercano: data.hospitalCercano || "",
      camaraHiperbarica: data.camaraHiperbarica || "",
    }
  });

  const [contactos, setContactos] = useState(data.contactosEmergencia || []);
  const [newContacto, setNewContacto] = useState({
    nombre: "",
    cargo: "",
    telefono: ""
  });

  const formData = form.watch();

  useEffect(() => {
    onUpdate({
      ...formData,
      contactosEmergencia: contactos
    });
  }, [formData, contactos, onUpdate]);

  const addContacto = () => {
    if (newContacto.nombre && newContacto.telefono) {
      setContactos([...contactos, { ...newContacto, id: Date.now() }]);
      setNewContacto({ nombre: "", cargo: "", telefono: "" });
    }
  };

  const removeContacto = (index: number) => {
    setContactos(contactos.filter((_: any, i: number) => i !== index));
  };

  const cargos = [
    "Supervisor de Buceo",
    "Jefe de Operaciones",
    "Médico de Emergencia",
    "Capitán de Puerto",
    "Coordinador de Rescate",
    "Director de Sitio",
    "Gerente de Seguridad"
  ];

  const hospitales = [
    "Hospital Regional Puerto Montt",
    "Clínica Alemana Puerto Varas",
    "Hospital de Castro",
    "Clínica Los Andes",
    "Centro Médico Osorno"
  ];

  const camarasHiperbarica = [
    "Cámara Hiperbárica Armada - Puerto Montt",
    "Centro Médico Naval - Valparaíso", 
    "Hospital Naval - Talcahuano",
    "Clínica Las Condes - Santiago",
    "No disponible en zona"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Procedimientos de Emergencia</h3>
        <p className="text-sm text-zinc-500 mb-6">
          Defina el plan de emergencia y los contactos críticos para situaciones de riesgo.
        </p>
      </div>

      <Form {...form}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="planEmergencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan de Emergencia *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describa detalladamente el plan de emergencia, incluyendo procedimientos de rescate, evacuación médica y comunicaciones..."
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="hospitalCercano"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hospital Más Cercano</FormLabel>
                  <FormControl>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <option value="">Seleccione hospital</option>
                      {hospitales.map((hospital) => (
                        <option key={hospital} value={hospital}>
                          {hospital}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="camaraHiperbarica"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cámara Hiperbárica</FormLabel>
                  <FormControl>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <option value="">Seleccione cámara hiperbárica</option>
                      {camarasHiperbarica.map((camara) => (
                        <option key={camara} value={camara}>
                          {camara}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </Form>

      {/* Contactos de Emergencia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-600" />
            Contactos de Emergencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <Input
              placeholder="Nombre completo"
              value={newContacto.nombre}
              onChange={(e) => setNewContacto({ ...newContacto, nombre: e.target.value })}
            />
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={newContacto.cargo}
              onChange={(e) => setNewContacto({ ...newContacto, cargo: e.target.value })}
            >
              <option value="">Seleccione cargo</option>
              {cargos.map((cargo) => (
                <option key={cargo} value={cargo}>
                  {cargo}
                </option>
              ))}
            </select>
            <Input
              placeholder="Teléfono"
              type="tel"
              value={newContacto.telefono}
              onChange={(e) => setNewContacto({ ...newContacto, telefono: e.target.value })}
            />
            <Button onClick={addContacto} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Agregar
            </Button>
          </div>

          {contactos.length > 0 && (
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
                {contactos.map((contacto: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{contacto.nombre}</TableCell>
                    <TableCell>{contacto.cargo}</TableCell>
                    <TableCell>{contacto.telefono}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeContacto(index)}
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

      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">
              Asegúrese de que todos los contactos estén disponibles 24/7 durante la operación
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
