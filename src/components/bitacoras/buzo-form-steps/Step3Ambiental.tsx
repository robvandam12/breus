
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { BitacoraBuzoFormValues } from "../buzoFormSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepProps {
  register: UseFormRegister<BitacoraBuzoFormValues>;
  setValue: UseFormSetValue<BitacoraBuzoFormValues>;
}

export const Step3Ambiental = ({ register, setValue }: StepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Condiciones Ambientales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="condamb_estado_puerto">Estado del Puerto</Label>
            <Select onValueChange={(value) => setValue('condamb_estado_puerto', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bueno">Bueno</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="malo">Malo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="condamb_estado_mar">Estado del Mar</Label>
            <Select onValueChange={(value) => setValue('condamb_estado_mar', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado del mar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calmo">Calmo</SelectItem>
                <SelectItem value="ligero">Ligero</SelectItem>
                <SelectItem value="moderado">Moderado</SelectItem>
                <SelectItem value="agitado">Agitado</SelectItem>
                <SelectItem value="muy_agitado">Muy Agitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="condamb_temp_aire_c">Temperatura Aire (°C)</Label>
            <Input
              id="condamb_temp_aire_c"
              type="number"
              {...register('condamb_temp_aire_c', { valueAsNumber: true })}
              placeholder="Temperatura del aire"
            />
          </div>
          <div>
            <Label htmlFor="condamb_temp_agua_c">Temperatura Agua (°C)</Label>
            <Input
              id="condamb_temp_agua_c"
              type="number"
              {...register('condamb_temp_agua_c', { valueAsNumber: true })}
              placeholder="Temperatura del agua"
            />
          </div>
          <div>
            <Label htmlFor="condamb_visibilidad_fondo_mts">Visibilidad Fondo (m)</Label>
            <Input
              id="condamb_visibilidad_fondo_mts"
              type="number"
              {...register('condamb_visibilidad_fondo_mts', { valueAsNumber: true })}
              placeholder="Visibilidad en metros"
            />
          </div>
          <div>
            <Label htmlFor="condamb_corriente_fondo_nudos">Corriente Fondo (nudos)</Label>
            <Input
              id="condamb_corriente_fondo_nudos"
              type="number"
              step="0.1"
              {...register('condamb_corriente_fondo_nudos', { valueAsNumber: true })}
              placeholder="Corriente en nudos"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
