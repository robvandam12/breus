
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SalmoneraFormData } from "@/hooks/useSalmoneras";

interface SalmoneraFormFieldsProps {
  form: UseFormReturn<SalmoneraFormData>;
}

export const SalmoneraFormFields = ({ form }: SalmoneraFormFieldsProps) => {
  const { register, setValue, formState: { errors } } = form;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre de la Empresa *</Label>
          <Input
            id="nombre"
            {...register('nombre')}
            placeholder="Ej: AquaChile S.A."
            className="touch-target"
          />
          {errors.nombre && (
            <p className="text-sm text-red-600">{errors.nombre.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rut">RUT *</Label>
          <Input
            id="rut"
            {...register('rut')}
            placeholder="Ej: 96.856.780-3"
            className="touch-target"
          />
          {errors.rut && (
            <p className="text-sm text-red-600">{errors.rut.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion">Dirección *</Label>
        <Input
          id="direccion"
          {...register('direccion')}
          placeholder="Ej: Puerto Montt, Región de Los Lagos"
          className="touch-target"
        />
        {errors.direccion && (
          <p className="text-sm text-red-600">{errors.direccion.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            {...register('telefono')}
            placeholder="Ej: +56 65 2270000"
            className="touch-target"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="Ej: contacto@empresa.cl"
            className="touch-target"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="estado">Estado</Label>
        <Select onValueChange={(value) => setValue('estado', value as 'activa' | 'inactiva' | 'suspendida')}>
          <SelectTrigger className="touch-target">
            <SelectValue placeholder="Seleccionar estado..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="activa">Activa</SelectItem>
            <SelectItem value="inactiva">Inactiva</SelectItem>
            <SelectItem value="suspendida">Suspendida</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
