
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { BitacoraBuzoFormValues } from "../buzoFormSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StepProps {
  register: UseFormRegister<BitacoraBuzoFormValues>;
  errors: FieldErrors<BitacoraBuzoFormValues>;
}

export const Step2Personal = ({ register, errors }: StepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Información del Personal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="folio">Folio</Label>
            <Input id="folio" {...register('folio')} placeholder="Número de folio"/>
          </div>
          <div>
            <Label htmlFor="codigo_verificacion">Código de Verificación</Label>
            <Input id="codigo_verificacion" {...register('codigo_verificacion')} placeholder="Código de verificación"/>
          </div>
          <div>
            <Label htmlFor="empresa_nombre">Empresa *</Label>
            <Input id="empresa_nombre" {...register('empresa_nombre')} placeholder="Nombre de la empresa"/>
            {errors.empresa_nombre && (<p className="text-sm text-red-600">{errors.empresa_nombre.message}</p>)}
          </div>
          <div>
            <Label htmlFor="centro_nombre">Centro de Trabajo *</Label>
            <Input id="centro_nombre" {...register('centro_nombre')} placeholder="Nombre del centro de trabajo"/>
            {errors.centro_nombre && (<p className="text-sm text-red-600">{errors.centro_nombre.message}</p>)}
          </div>
          <div>
            <Label htmlFor="buzo">Buzo *</Label>
            <Input id="buzo" {...register('buzo')} placeholder="Nombre del buzo"/>
            {errors.buzo && (<p className="text-sm text-red-600">{errors.buzo.message}</p>)}
          </div>
          <div>
            <Label htmlFor="buzo_rut">RUT del Buzo</Label>
            <Input id="buzo_rut" {...register('buzo_rut')} placeholder="RUT del buzo"/>
          </div>
          <div>
            <Label htmlFor="supervisor_nombre">Supervisor</Label>
            <Input id="supervisor_nombre" {...register('supervisor_nombre')} placeholder="Nombre del supervisor"/>
          </div>
          <div>
            <Label htmlFor="supervisor_rut">RUT Supervisor</Label>
            <Input id="supervisor_rut" {...register('supervisor_rut')} placeholder="RUT del supervisor"/>
          </div>
          <div>
            <Label htmlFor="supervisor_correo">Email Supervisor</Label>
            <Input id="supervisor_correo" type="email" {...register('supervisor_correo')} placeholder="Email del supervisor"/>
            {errors.supervisor_correo && (<p className="text-sm text-red-600">{errors.supervisor_correo.message}</p>)}
          </div>
          <div>
            <Label htmlFor="jefe_centro_correo">Email Jefe Centro</Label>
            <Input id="jefe_centro_correo" type="email" {...register('jefe_centro_correo')} placeholder="Email del jefe de centro"/>
            {errors.jefe_centro_correo && (<p className="text-sm text-red-600">{errors.jefe_centro_correo.message}</p>)}
          </div>
          <div>
            <Label htmlFor="contratista_nombre">Contratista</Label>
            <Input id="contratista_nombre" {...register('contratista_nombre')} placeholder="Nombre del contratista"/>
          </div>
          <div>
            <Label htmlFor="contratista_rut">RUT Contratista</Label>
            <Input id="contratista_rut" {...register('contratista_rut')} placeholder="RUT del contratista"/>
          </div>
        </div>
      </div>
    </div>
  );
};
