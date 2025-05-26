
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const bitacoraBuzoSchema = z.object({
  // Identificación del Registro
  folio: z.string().min(1, "Folio es requerido"),
  codigo_verificacion: z.string().min(1, "Código de verificación es requerido"),
  
  // Datos Generales
  empresa_nombre: z.string().min(1, "Nombre de empresa es requerido"),
  centro_nombre: z.string().min(1, "Nombre del centro es requerido"),
  fecha: z.string().min(1, "Fecha es requerida"),
  
  // Datos del Buzo
  buzo_nombre: z.string().min(1, "Nombre del buzo es requerido"),
  buzo_rut: z.string().min(1, "RUT del buzo es requerido"),
  
  // Datos del Supervisor
  supervisor_nombre: z.string().min(1, "Nombre del supervisor es requerido"),
  supervisor_rut: z.string().min(1, "RUT del supervisor es requerido"),
  supervisor_correo: z.string().email("Correo del supervisor debe ser válido"),
  
  // Otros Contactos
  jefe_centro_correo: z.string().email("Correo del jefe de centro debe ser válido"),
  contratista_nombre: z.string().min(1, "Nombre del contratista es requerido"),
  contratista_rut: z.string().min(1, "RUT del contratista es requerido"),
  
  // Condiciones Ambientales
  estado_puerto: z.enum(["abierto", "cerrado"]),
  estado_mar: z.enum(["calmo", "moderado", "agitado"]),
  temp_aire: z.number().min(-50).max(50),
  temp_agua: z.number().min(-10).max(40),
  visibilidad_fondo: z.number().min(0),
  corriente_fondo: z.number().min(0),
  
  // Datos Técnicos del Buceo
  equipo_usado: z.string().min(1, "Equipo usado es requerido"),
  traje: z.string().min(1, "Tipo de traje es requerido"),
  profundidad_maxima: z.number().min(0),
  hora_dejo_superficie: z.string().min(1, "Hora es requerida"),
  hora_llegada_fondo: z.string().min(1, "Hora es requerida"),
  hora_salida_fondo: z.string().min(1, "Hora es requerida"),
  hora_llegada_superficie: z.string().min(1, "Hora es requerida"),
  
  // Tiempos y Tabulación
  tiempo_total_fondo: z.string().min(1, "Tiempo total en fondo es requerido"),
  tiempo_total_descompresion: z.string().min(1, "Tiempo total de descompresión es requerido"),
  tiempo_total_buceo: z.string().min(1, "Tiempo total de buceo es requerido"),
  tabulacion_usada: z.string().min(1, "Tabulación usada es requerida"),
  intervalo_superficie: z.string().min(1, "Intervalo en superficie es requerido"),
  nitrogeno_residual: z.string().min(1, "Nitrógeno residual es requerido"),
  grupo_repetitivo_anterior: z.string().min(1, "Grupo repetitivo anterior es requerido"),
  nuevo_grupo_repetitivo: z.string().min(1, "Nuevo grupo repetitivo es requerido"),
  
  // Objetivo del Buceo
  proposito_buceo: z.string().min(1, "Propósito del buceo es requerido"),
  tipo_area: z.string().min(1, "Tipo de área es requerido"),
  caracteristicas_dimensiones: z.string().min(1, "Características y dimensiones son requeridas"),
  
  // Condiciones y Certificaciones
  buceo_altitud: z.boolean(),
  certificados_equipos: z.boolean(),
  buceo_areas_confinadas: z.boolean(),
  observaciones_certificaciones: z.string().optional(),
});

type BitacoraBuzoFormData = z.infer<typeof bitacoraBuzoSchema>;

interface CompleteBitacoraBuzoFormProps {
  onSubmit: (data: BitacoraBuzoFormData) => void;
  onCancel: () => void;
}

export const CompleteBitacoraBuzoForm = ({ onSubmit, onCancel }: CompleteBitacoraBuzoFormProps) => {
  const form = useForm<BitacoraBuzoFormData>({
    resolver: zodResolver(bitacoraBuzoSchema),
    defaultValues: {
      fecha: new Date().toISOString().split('T')[0],
      buceo_altitud: false,
      certificados_equipos: false,
      buceo_areas_confinadas: false,
    },
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Nueva Bitácora de Buzo</h2>
          <p className="text-muted-foreground">Registro personal de inmersión</p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="identificacion" className="w-full">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="identificacion">Identificación</TabsTrigger>
              <TabsTrigger value="datos-generales">Datos Generales</TabsTrigger>
              <TabsTrigger value="condiciones">Condiciones</TabsTrigger>
              <TabsTrigger value="tecnico">Datos Técnicos</TabsTrigger>
              <TabsTrigger value="tiempos">Tiempos</TabsTrigger>
              <TabsTrigger value="objetivo">Objetivo</TabsTrigger>
            </TabsList>

            <TabsContent value="identificacion" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>1. Identificación del Registro</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="folio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Folio</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="codigo_verificacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código de Verificación</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="datos-generales" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>2. Datos Generales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="empresa_nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Empresa</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="centro_nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del Centro</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fecha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-4" />
                  
                  <h3 className="text-lg font-medium">3. Datos del Buzo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="buzo_nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del Buzo</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="buzo_rut"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RUT del Buzo</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-4" />
                  
                  <h3 className="text-lg font-medium">4. Datos del Supervisor</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="supervisor_nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del Supervisor</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="supervisor_rut"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RUT del Supervisor</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="supervisor_correo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo del Supervisor</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-4" />
                  
                  <h3 className="text-lg font-medium">5. Otros Contactos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="jefe_centro_correo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo del Jefe de Centro</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contratista_nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del Contratista de Buceo</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contratista_rut"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RUT del Contratista</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="condiciones" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>6. Condiciones Ambientales</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="estado_puerto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado del Puerto</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="abierto">Abierto</SelectItem>
                            <SelectItem value="cerrado">Cerrado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estado_mar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado del Mar</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="calmo">Calmo</SelectItem>
                            <SelectItem value="moderado">Moderado</SelectItem>
                            <SelectItem value="agitado">Agitado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="temp_aire"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperatura del Aire (°C)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="temp_agua"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperatura del Agua (°C)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="visibilidad_fondo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visibilidad del Fondo (mts)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="corriente_fondo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Corriente del Fondo (nudos)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tecnico" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>7. Datos Técnicos del Buceo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="equipo_usado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Equipo Usado</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="traje"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Traje</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="profundidad_maxima"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profundidad Máxima (mts)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <h3 className="text-lg font-medium mt-6">Horarios</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="hora_dejo_superficie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora en que dejó superficie</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hora_llegada_fondo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora de llegada al fondo</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hora_salida_fondo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora de salida del fondo</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hora_llegada_superficie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora de llegada a superficie</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tiempos" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>8. Tiempos y Tabulación</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tiempo_total_fondo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiempo total en el fondo</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="ej: 45 min" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tiempo_total_descompresion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiempo total de descompresión</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="ej: 15 min" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tiempo_total_buceo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiempo total de buceo</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="ej: 60 min" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tabulacion_usada"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tabulación usada</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="intervalo_superficie"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Intervalo en superficie</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nitrogeno_residual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nitrógeno residual</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="grupo_repetitivo_anterior"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grupo repetitivo anterior</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nuevo_grupo_repetitivo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nuevo grupo repetitivo</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="objetivo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>9. Objetivo del Buceo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="proposito_buceo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Propósito del Buceo</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tipo_area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Área</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="caracteristicas_dimensiones"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Características y/o Dimensiones</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>10. Condiciones y Certificaciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="buceo_altitud"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <FormLabel>¿Buceo en altitud?</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="certificados_equipos"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <FormLabel>¿Certificados de los equipos usados?</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="buceo_areas_confinadas"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <FormLabel>¿Buceo en áreas confinadas?</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="observaciones_certificaciones"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observaciones</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Crear Bitácora
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
