
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Wrench, X } from "lucide-react";
import { OperacionFormData } from "@/hooks/useOperaciones";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useSitios } from "@/hooks/useSitios";
import { useContratistas } from "@/hooks/useContratistas";

const formSchema = z.object({
  codigo: z.string().min(1, "El código es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  fecha_inicio: z.string().min(1, "La fecha de inicio es requerida"),
  fecha_fin: z.string().optional(),
  estado: z.enum(['activa', 'pausada', 'completada', 'cancelada']),
  salmonera_id: z.string().optional(),
  sitio_id: z.string().optional(),
  contratista_id: z.string().optional(),
});

interface CreateOperacionFormProps {
  onSubmit: (data: OperacionFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<OperacionFormData>;
  isEditing?: boolean;
}

export const CreateOperacionForm = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  isEditing = false 
}: CreateOperacionFormProps) => {
  const [loading, setLoading] = useState(false);
  const { salmoneras } = useSalmoneras();
  const { sitios } = useSitios();
  const { contratistas } = useContratistas();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: initialData?.codigo || "",
      nombre: initialData?.nombre || "",
      fecha_inicio: initialData?.fecha_inicio || "",
      fecha_fin: initialData?.fecha_fin || "",
      estado: initialData?.estado || 'activa',
      salmonera_id: initialData?.salmonera_id || "",
      sitio_id: initialData?.sitio_id || "",
      contratista_id: initialData?.contratista_id || "",
    }
  });

  const selectedSalmoneraId = watch('salmonera_id');
  const filteredSitios = sitios.filter(sitio => 
    !selectedSalmoneraId || sitio.salmonera_id === selectedSalmoneraId
  );

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const formData: OperacionFormData = {
        codigo: data.codigo,
        nombre: data.nombre,
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin || undefined,
        estado: data.estado,
        salmonera_id: data.salmonera_id || undefined,
        sitio_id: data.sitio_id || undefined,
        contratista_id: data.contratista_id || undefined,
      };
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting operacion form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {isEditing ? 'Editar Operación' : 'Nueva Operación'}
              </CardTitle>
              <p className="text-sm text-zinc-500">
                {isEditing ? 'Modifica los datos de la operación' : 'Registra una nueva operación'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código de Operación *</Label>
              <Input
                id="codigo"
                {...register('codigo')}
                placeholder="Ej: OP-2024-001"
              />
              {errors.codigo && (
                <p className="text-sm text-red-600">{errors.codigo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select onValueChange={(value) => setValue('estado', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activa">Activa</SelectItem>
                  <SelectItem value="pausada">Pausada</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la Operación *</Label>
            <Input
              id="nombre"
              {...register('nombre')}
              placeholder="Ej: Mantenimiento de Jaulas - Sitio Norte"
            />
            {errors.nombre && (
              <p className="text-sm text-red-600">{errors.nombre.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fecha_inicio">Fecha de Inicio *</Label>
              <Input
                id="fecha_inicio"
                type="date"
                {...register('fecha_inicio')}
              />
              {errors.fecha_inicio && (
                <p className="text-sm text-red-600">{errors.fecha_inicio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_fin">Fecha de Fin</Label>
              <Input
                id="fecha_fin"
                type="date"
                {...register('fecha_fin')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="salmonera_id">Salmonera</Label>
              <Select onValueChange={(value) => {
                setValue('salmonera_id', value);
                setValue('sitio_id', ''); // Reset sitio when salmonera changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar salmonera..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin asignar</SelectItem>
                  {salmoneras.map((salmonera) => (
                    <SelectItem key={salmonera.id} value={salmonera.id}>
                      {salmonera.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sitio_id">Sitio</Label>
              <Select onValueChange={(value) => setValue('sitio_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sitio..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin asignar</SelectItem>
                  {filteredSitios.map((sitio) => (
                    <SelectItem key={sitio.id} value={sitio.id}>
                      {sitio.nombre} ({sitio.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contratista_id">Contratista</Label>
              <Select onValueChange={(value) => setValue('contratista_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar contratista..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin asignar</SelectItem>
                  {contratistas.map((contratista) => (
                    <SelectItem key={contratista.id} value={contratista.id}>
                      {contratista.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {isEditing ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                isEditing ? 'Actualizar Operación' : 'Crear Operación'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
