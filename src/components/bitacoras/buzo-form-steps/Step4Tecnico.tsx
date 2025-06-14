
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { BitacoraBuzoFormValues } from "../buzoFormSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StepProps {
  register: UseFormRegister<BitacoraBuzoFormValues>;
  errors: FieldErrors<BitacoraBuzoFormValues>;
}

export const Step4Tecnico = ({ register, errors }: StepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Datos Técnicos del Buceo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="datostec_equipo_usado">Equipo Usado *</Label>
            <Input
              id="datostec_equipo_usado"
              {...register('datostec_equipo_usado')}
              placeholder="Equipo de buceo utilizado"
            />
            {errors.datostec_equipo_usado && (
              <p className="text-sm text-red-600">{errors.datostec_equipo_usado.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="datostec_traje">Tipo de Traje</Label>
            <Input
              id="datostec_traje"
              {...register('datostec_traje')}
              placeholder="Tipo de traje utilizado"
            />
          </div>
          <div>
            <Label htmlFor="profundidad_maxima">Profundidad Máxima (m) *</Label>
            <Input
              id="profundidad_maxima"
              type="number"
              {...register('profundidad_maxima', { valueAsNumber: true })}
              placeholder="Profundidad máxima alcanzada"
            />
            {errors.profundidad_maxima && (
              <p className="text-sm text-red-600">{errors.profundidad_maxima.message}</p>
            )}
          </div>
          <div></div>
          <div>
            <Label htmlFor="datostec_hora_dejo_superficie">Hora Dejó Superficie</Label>
            <Input
              id="datostec_hora_dejo_superficie"
              type="time"
              {...register('datostec_hora_dejo_superficie')}
            />
          </div>
          <div>
            <Label htmlFor="datostec_hora_llegada_fondo">Hora Llegada Fondo</Label>
            <Input
              id="datostec_hora_llegada_fondo"
              type="time"
              {...register('datostec_hora_llegada_fondo')}
            />
          </div>
          <div>
            <Label htmlFor="datostec_hora_salida_fondo">Hora Salida Fondo</Label>
            <Input
              id="datostec_hora_salida_fondo"
              type="time"
              {...register('datostec_hora_salida_fondo')}
            />
          </div>
          <div>
            <Label htmlFor="datostec_hora_llegada_superficie">Hora Llegada Superficie</Label>
            <Input
              id="datostec_hora_llegada_superficie"
              type="time"
              {...register('datostec_hora_llegada_superficie')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
