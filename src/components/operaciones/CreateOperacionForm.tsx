
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';
import { useCentros } from '@/hooks/useCentros';
import { useContratistas } from '@/hooks/useContratistas';
import { useSalmoneras } from '@/hooks/useSalmoneras';

const operacionSchema = z.object({
  codigo: z.string().min(1, 'Código es requerido'),
  nombre: z.string().min(1, 'Nombre es requerido'),
  tareas: z.string().optional(),
  fecha_inicio: z.string().min(1, 'Fecha inicio es requerida'),
  fecha_fin: z.string().optional(),
  centro_id: z.string().optional(),
  contratista_id: z.string().optional(),
  salmonera_id: z.string().optional(),
  estado: z.enum(['activa', 'pausada', 'completada', 'cancelada']).default('activa'),
});

export type OperacionFormData = z.infer<typeof operacionSchema>;

interface CreateOperacionFormProps {
  onSubmit: (data: OperacionFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CreateOperacionForm = ({ onSubmit, onCancel, isLoading }: CreateOperacionFormProps) => {
  const { centros } = useCentros();
  const { contratistas } = useContratistas();
  const { salmoneras } = useSalmoneras();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OperacionFormData>({
    resolver: zodResolver(operacionSchema),
    defaultValues: {
      estado: 'activa'
    }
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Nueva Operación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                {...register('codigo')}
                placeholder="Ej: OP-2024-001"
              />
              {errors.codigo && (
                <p className="text-red-500 text-sm mt-1">{errors.codigo.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                {...register('nombre')}
                placeholder="Ej: Mantenimiento Jaulas Sector A"
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="fecha_inicio">Fecha Inicio *</Label>
              <Input
                id="fecha_inicio"
                type="date"
                {...register('fecha_inicio')}
              />
              {errors.fecha_inicio && (
                <p className="text-red-500 text-sm mt-1">{errors.fecha_inicio.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="fecha_fin">Fecha Fin</Label>
              <Input
                id="fecha_fin"
                type="date"
                {...register('fecha_fin')}
              />
            </div>

            <div>
              <Label htmlFor="salmonera_id">Salmonera</Label>
              <Select onValueChange={(value) => setValue('salmonera_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar salmonera..." />
                </SelectTrigger>
                <SelectContent>
                  {salmoneras.map((salmonera) => (
                    <SelectItem key={salmonera.id} value={salmonera.id}>
                      {salmonera.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="centro_id">Centro</Label>
              <Select onValueChange={(value) => setValue('centro_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar centro..." />
                </SelectTrigger>
                <SelectContent>
                  {centros.map((centro) => (
                    <SelectItem key={centro.id} value={centro.id}>
                      {centro.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select onValueChange={(value: 'activa' | 'pausada' | 'completada' | 'cancelada') => setValue('estado', value)}>
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

            <div>
              <Label htmlFor="contratista_id">Contratista</Label>
              <Select onValueChange={(value) => setValue('contratista_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar contratista..." />
                </SelectTrigger>
                <SelectContent>
                  {contratistas.map((contratista) => (
                    <SelectItem key={contratista.id} value={contratista.id}>
                      {contratista.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="tareas">Tareas y Descripción</Label>
              <Textarea
                id="tareas"
                {...register('tareas')}
                placeholder="Describe las tareas a realizar en esta operación..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Creando...' : 'Crear Operación'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
