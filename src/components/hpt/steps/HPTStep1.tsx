
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HPTStep1Props {
  data: any;
  onUpdate: (data: any) => void;
}

interface Operacion {
  id: string;
  codigo: string;
  nombre: string;
}

export const HPTStep1 = ({ data, onUpdate }: HPTStep1Props) => {
  const [operaciones, setOperaciones] = useState<Operacion[]>([]);
  const [loadingOperaciones, setLoadingOperaciones] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      operacion_id: data.operacion_id || "",
      fecha_programada: data.fecha_programada || "",
      hora_inicio: data.hora_inicio || "",
      hora_fin: data.hora_fin || "",
      supervisor: data.supervisor || "",
      jefe_obra: data.jefe_obra || "",
      descripcion_trabajo: data.descripcion_trabajo || "",
    }
  });

  const formData = form.watch();

  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  useEffect(() => {
    loadOperaciones();
  }, []);

  const loadOperaciones = async () => {
    setLoadingOperaciones(true);
    try {
      const { data, error } = await supabase
        .from('operacion')
        .select('id, codigo, nombre')
        .eq('estado', 'activa')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData: Operacion[] = (data || []).map((item: any) => ({
        id: item.id,
        codigo: item.codigo,
        nombre: item.nombre
      }));

      setOperaciones(formattedData);
    } catch (err) {
      console.error('Error loading operaciones:', err);
      toast({
        title: "Error",
        description: "No se pudieron cargar las operaciones",
        variant: "destructive",
      });
    } finally {
      setLoadingOperaciones(false);
    }
  };

  // Mock data for selects - en producción estos vendrían de la base de datos
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
            name="operacion_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operación *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={loadingOperaciones ? "Cargando..." : "Seleccione una operación"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {operaciones.map((op) => (
                      <SelectItem key={op.id} value={op.id}>
                        {op.codigo} - {op.nombre}
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
            name="fecha_programada"
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
            name="hora_inicio"
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
            name="hora_fin"
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
            name="jefe_obra"
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
          name="descripcion_trabajo"
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
