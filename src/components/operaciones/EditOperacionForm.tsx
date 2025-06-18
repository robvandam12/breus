
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { useSitios } from "@/hooks/useSitios";
import { useEquiposBuceo } from "@/hooks/useEquiposBuceo";
import { useUsuarios } from "@/hooks/useUsuarios";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  codigo: z.string().min(1, "Código es requerido"),
  nombre: z.string().min(1, "Nombre es requerido"),
  tareas: z.string().optional(),
  fecha_inicio: z.string().min(1, "Fecha de inicio es requerida"),
  fecha_fin: z.string().optional(),
  estado: z.enum(['activa', 'pausada', 'completada', 'cancelada']),
  estado_aprobacion: z.enum(['pendiente', 'aprobada', 'rechazada']).optional(),
  salmonera_id: z.string().optional(),
  contratista_id: z.string().optional(),
  sitio_id: z.string().optional(),
  servicio_id: z.string().optional(),
  equipo_buceo_id: z.string().optional(),
  supervisor_asignado_id: z.string().optional(),
});

interface EditOperacionFormProps {
  operacion: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const EditOperacionForm = ({ operacion, onSubmit, onCancel }: EditOperacionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  const { sitios } = useSitios();
  const { equipos } = useEquiposBuceo();
  const { usuarios } = useUsuarios();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: operacion?.codigo || '',
      nombre: operacion?.nombre || '',
      tareas: operacion?.tareas || '',
      fecha_inicio: operacion?.fecha_inicio || '',
      fecha_fin: operacion?.fecha_fin || '',
      estado: operacion?.estado || 'activa',
      estado_aprobacion: operacion?.estado_aprobacion || 'pendiente',
      salmonera_id: operacion?.salmonera_id || '',
      contratista_id: operacion?.contratista_id || '',
      sitio_id: operacion?.sitio_id || '',
      servicio_id: operacion?.servicio_id || '',
      equipo_buceo_id: operacion?.equipo_buceo_id || '',
      supervisor_asignado_id: operacion?.supervisor_asignado_id || '',
    }
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrar supervisores (usuarios con rol admin_servicio o superuser)
  const supervisores = usuarios?.filter(u => 
    u.rol === 'admin_servicio' || u.rol === 'superuser'
  ) || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="Código de la operación" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="activa">Activa</SelectItem>
                    <SelectItem value="pausada">Pausada</SelectItem>
                    <SelectItem value="completada">Completada</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la operación" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tareas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tareas</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descripción de las tareas a realizar" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fecha_inicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Inicio</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fecha_fin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Fin</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    value={field.value || ''} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="salmonera_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salmonera</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar salmonera" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="__empty__">Sin asignar</SelectItem>
                    {salmoneras?.filter(s => s.id && s.nombre).map((salmonera) => (
                      <SelectItem key={salmonera.id} value={salmonera.id}>
                        {salmonera.nombre}
                      </SelectItem>
                    )) || []}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contratista_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contratista</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar contratista" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="__empty__">Sin asignar</SelectItem>
                    {contratistas?.filter(c => c.id && c.nombre).map((contratista) => (
                      <SelectItem key={contratista.id} value={contratista.id}>
                        {contratista.nombre}
                      </SelectItem>
                    )) || []}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sitio_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sitio</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sitio" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="__empty__">Sin asignar</SelectItem>
                    {sitios?.filter(s => s.id && s.nombre).map((sitio) => (
                      <SelectItem key={sitio.id} value={sitio.id}>
                        {sitio.nombre} ({sitio.codigo})
                      </SelectItem>
                    )) || []}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="equipo_buceo_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipo de Buceo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar equipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="__empty__">Sin asignar</SelectItem>
                    {equipos?.filter(e => e.id && e.nombre).map((equipo) => (
                      <SelectItem key={equipo.id} value={equipo.id}>
                        {equipo.nombre}
                      </SelectItem>
                    )) || []}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="supervisor_asignado_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supervisor Asignado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar supervisor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="__empty__">Sin asignar</SelectItem>
                  {supervisores.filter(s => s.usuario_id && s.nombre).map((supervisor) => (
                    <SelectItem key={supervisor.usuario_id} value={supervisor.usuario_id}>
                      {supervisor.nombre} {supervisor.apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Actualizar Operación
          </Button>
        </div>
      </form>
    </Form>
  );
};
