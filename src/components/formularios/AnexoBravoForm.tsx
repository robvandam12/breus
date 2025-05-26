
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, FileText, Users, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AnexoBravoFormData {
  operacion_id: string;
  empresa_nombre: string;
  lugar_faena: string;
  fecha: string;
  jefe_centro_nombre: string;
  buzo_o_empresa_nombre: string;
  buzo_matricula: string;
  autorizacion_armada: boolean;
  asistente_buzo_nombre: string;
  asistente_buzo_matricula: string;
  supervisor_servicio_nombre: string;
  supervisor_mandante_nombre: string;
  observaciones_generales: string;
}

interface Operacion {
  id: string;
  codigo: string;
  nombre: string;
  salmonera_nombre?: string;
  contratista_nombre?: string;
}

interface AnexoBravoFormProps {
  onSubmit: (data: AnexoBravoFormData) => void;
  onCancel: () => void;
  initialData?: Partial<AnexoBravoFormData>;
}

export const AnexoBravoForm = ({ onSubmit, onCancel, initialData }: AnexoBravoFormProps) => {
  const [operaciones, setOperaciones] = useState<Operacion[]>([]);
  const [loadingOperaciones, setLoadingOperaciones] = useState(false);
  const [equiposChecklist, setEquiposChecklist] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      operacion_id: initialData?.operacion_id || "",
      empresa_nombre: initialData?.empresa_nombre || "",
      lugar_faena: initialData?.lugar_faena || "",
      fecha: initialData?.fecha || new Date().toISOString().split('T')[0],
      jefe_centro_nombre: initialData?.jefe_centro_nombre || "",
      buzo_o_empresa_nombre: initialData?.buzo_o_empresa_nombre || "",
      buzo_matricula: initialData?.buzo_matricula || "",
      autorizacion_armada: initialData?.autorizacion_armada || false,
      asistente_buzo_nombre: initialData?.asistente_buzo_nombre || "",
      asistente_buzo_matricula: initialData?.asistente_buzo_matricula || "",
      supervisor_servicio_nombre: initialData?.supervisor_servicio_nombre || "",
      supervisor_mandante_nombre: initialData?.supervisor_mandante_nombre || "",
      observaciones_generales: initialData?.observaciones_generales || "",
    }
  });

  const equiposRequeridos = [
    'Compresor',
    'Regulador',
    'Traje de Buceo',
    'Aletas',
    'Cinturón de Lastre',
    'Mascarilla',
    'Pufal',
    'Profundímetro',
    'Salvavidas',
    'Tablas de Descompresión',
    'Botiquín',
    'Cabo de Vida',
    'Cabo de Descenso',
    'Manguera',
    'Equipo de Comunicación',
    'Matrícula Buzo',
    'Matrícula Asistente',
    'Certificado Mantención Equipos',
    'Filtro de Aire',
    'Nivel Aceite Motor',
    'Nivel Aceite Cabezal',
    'Válvula Retención',
    'Protección Partes Móviles',
    'Botella Aire Auxiliar'
  ];

  useEffect(() => {
    loadOperaciones();
    // Inicializar checklist de equipos
    const initialChecklist: Record<string, boolean> = {};
    equiposRequeridos.forEach(equipo => {
      initialChecklist[equipo] = false;
    });
    setEquiposChecklist(initialChecklist);
  }, []);

  const loadOperaciones = async () => {
    setLoadingOperaciones(true);
    try {
      const { data, error } = await supabase
        .from('operacion')
        .select(`
          id, 
          codigo, 
          nombre,
          salmoneras:salmonera_id (nombre),
          contratistas:contratista_id (nombre)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedOperaciones: Operacion[] = (data || []).map((item: any) => ({
        id: item.id,
        codigo: item.codigo,
        nombre: item.nombre,
        salmonera_nombre: item.salmoneras?.nombre,
        contratista_nombre: item.contratistas?.nombre
      }));
      
      setOperaciones(formattedOperaciones);
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

  const handleSubmit = (data: AnexoBravoFormData) => {
    // Validar que se hayan verificado equipos críticos
    const equiposCriticos = ['Compresor', 'Regulador', 'Traje de Buceo', 'Mascarilla'];
    const equiposCriticosVerificados = equiposCriticos.every(equipo => equiposChecklist[equipo]);
    
    if (!equiposCriticosVerificados) {
      toast({
        title: "Verificación Incompleta",
        description: "Debe verificar todos los equipos críticos antes de continuar",
        variant: "destructive",
      });
      return;
    }

    onSubmit(data);
  };

  if (loadingOperaciones) {
    return <AnexoBravoFormSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-green-600" />
            <div>
              <CardTitle>Anexo Bravo</CardTitle>
              <p className="text-sm text-zinc-500">
                Verificación de Equipos y Autorización de Buceo
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="operacion_id"
                  rules={{ required: "Operación es requerida" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operación Asociada *</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar operación" />
                          </SelectTrigger>
                          <SelectContent>
                            {operaciones.map((operacion) => (
                              <SelectItem key={operacion.id} value={operacion.id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{operacion.codigo} - {operacion.nombre}</span>
                                  <span className="text-xs text-gray-500">
                                    {operacion.salmonera_nombre} → {operacion.contratista_nombre}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="empresa_nombre"
                  rules={{ required: "Empresa es requerida" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre de la empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lugar_faena"
                  rules={{ required: "Lugar de faena es requerido" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lugar de Faena / Centro *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ubicación de la faena" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fecha"
                  rules={{ required: "Fecha es requerida" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jefe_centro_nombre"
                  rules={{ required: "Jefe de centro es requerido" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jefe de Centro *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del jefe de centro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Identificación del Buzo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Identificación del Buzo o Empresa de Buceo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="buzo_o_empresa_nombre"
                  rules={{ required: "Buzo o empresa es requerido" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buzo o Empresa de Buceo *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del buzo o empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="buzo_matricula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matrícula</FormLabel>
                      <FormControl>
                        <Input placeholder="Número de matrícula" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="autorizacion_armada"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Autorización Autoridad Marítima
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          ¿Se adjunta copia de autorización?
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="asistente_buzo_nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asistente de Buzo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del asistente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="asistente_buzo_matricula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matrícula del Asistente</FormLabel>
                      <FormControl>
                        <Input placeholder="Número de matrícula del asistente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Chequeo de Equipos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Chequeo de Equipos e Insumos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {equiposRequeridos.map((equipo) => (
                  <div key={equipo} className="flex items-center space-x-3">
                    <Checkbox
                      id={equipo}
                      checked={equiposChecklist[equipo] || false}
                      onCheckedChange={(checked) => 
                        setEquiposChecklist(prev => ({
                          ...prev,
                          [equipo]: checked as boolean
                        }))
                      }
                    />
                    <label
                      htmlFor={equipo}
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                        ['Compresor', 'Regulador', 'Traje de Buceo', 'Mascarilla'].includes(equipo) 
                          ? 'text-red-600 font-semibold' 
                          : ''
                      }`}
                    >
                      {equipo}
                      {['Compresor', 'Regulador', 'Traje de Buceo', 'Mascarilla'].includes(equipo) && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-red-600 mt-4">
                * Equipos críticos que deben ser verificados obligatoriamente
              </p>
            </CardContent>
          </Card>

          {/* Supervisores */}
          <Card>
            <CardHeader>
              <CardTitle>Supervisores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="supervisor_servicio_nombre"
                  rules={{ required: "Supervisor de servicio es requerido" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supervisor de Servicio *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del supervisor de servicio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supervisor_mandante_nombre"
                  rules={{ required: "Supervisor mandante es requerido" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supervisor Mandante *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del supervisor mandante" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Observaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Observaciones Generales</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="observaciones_generales"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observaciones adicionales..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-between items-center">
            <Button 
              type="button"
              variant="outline" 
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Shield className="w-4 h-4 mr-2" />
              Crear Anexo Bravo
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const AnexoBravoFormSkeleton = () => (
  <div className="max-w-4xl mx-auto p-6">
    <Card className="mb-6">
      <CardHeader>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
    </Card>

    {[...Array(5)].map((_, i) => (
      <Card key={i} className="mb-6">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);
