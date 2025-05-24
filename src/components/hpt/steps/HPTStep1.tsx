
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface HPTStep1Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep1 = ({ data, onUpdate }: HPTStep1Props) => {
  const form = useForm({
    defaultValues: {
      operacionId: data.operacionId || "",
      fechaProgramada: data.fechaProgramada || "",
      horaInicio: data.horaInicio || "",
      horaFin: data.horaFin || "",
      supervisor: data.supervisor || "",
      jefeObra: data.jefeObra || "",
      descripcionTrabajo: data.descripcionTrabajo || "",
    }
  });

  const formData = form.watch();

  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  // Mock data for selects
  const operaciones = [
    { id: "OP-2024-001", nombre: "Mantenimiento Jaulas Sitio Norte" },
    { id: "OP-2024-002", nombre: "Inspección Redes Centro Los Fiordos" },
    { id: "OP-2024-003", nombre: "Limpieza Estructuras Piscicultura" },
  ];

  const supervisores = [
    "Diego Martínez",
    "Carlos Rojas", 
    "Ana López",
    "Roberto Silva"
  ];

  const jefesObra = [
    "Carlos Mendoza",
    "Ana Morales",
    "Roberto Silva",
    "Patricia Gonzalez"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Información General del Trabajo</h3>
        <p className="text-sm text-zinc-500 mb-6">
          Complete la información básica de la HPT y los responsables del trabajo.
        </p>
      </div>

      <Form {...form}>
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="operacionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operación *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una operación" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {operaciones.map((op) => (
                      <SelectItem key={op.id} value={op.id}>
                        {op.id} - {op.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fechaProgramada"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha Programada *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="horaInicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de Inicio</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="horaFin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de Término</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supervisor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supervisor de Servicio *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione supervisor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {supervisores.map((supervisor) => (
                      <SelectItem key={supervisor} value={supervisor}>
                        {supervisor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jefeObra"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jefe de Obra *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione jefe de obra" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {jefesObra.map((jefe) => (
                      <SelectItem key={jefe} value={jefe}>
                        {jefe}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="descripcionTrabajo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción del Trabajo</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describa detalladamente el trabajo a realizar..."
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </div>
  );
};
