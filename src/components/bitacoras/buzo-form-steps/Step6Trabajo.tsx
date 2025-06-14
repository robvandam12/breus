
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { BitacoraBuzoFormValues } from "../buzoFormSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface StepProps {
  register: UseFormRegister<BitacoraBuzoFormValues>;
  errors: FieldErrors<BitacoraBuzoFormValues>;
  setValue: UseFormSetValue<BitacoraBuzoFormValues>;
  watch: UseFormWatch<BitacoraBuzoFormValues>;
}

export const Step6Trabajo = ({ register, errors, setValue, watch }: StepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Trabajo Realizado y Certificaciones</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="trabajos_realizados">Trabajos Realizados *</Label>
            <Textarea
              id="trabajos_realizados"
              {...register('trabajos_realizados')}
              placeholder="Describa detalladamente los trabajos realizados durante la inmersión..."
              className="min-h-[120px]"
            />
            {errors.trabajos_realizados && (
              <p className="text-sm text-red-600">{errors.trabajos_realizados.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="observaciones_tecnicas">Observaciones Técnicas</Label>
            <Textarea
              id="observaciones_tecnicas"
              {...register('observaciones_tecnicas')}
              placeholder="Observaciones técnicas adicionales..."
              className="min-h-[100px]"
            />
          </div>
          <div>
            <Label htmlFor="estado_fisico_post">Estado Físico Post Buceo *</Label>
            <Select onValueChange={(value) => setValue('estado_fisico_post', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado físico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excelente">Excelente</SelectItem>
                <SelectItem value="bueno">Bueno</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="cansado">Cansado</SelectItem>
                <SelectItem value="con_molestias">Con Molestias</SelectItem>
              </SelectContent>
            </Select>
            {errors.estado_fisico_post && (
              <p className="text-sm text-red-600">{errors.estado_fisico_post.message}</p>
            )}
          </div>

          <Separator />

          <div className="pt-4">
            <h4 className="font-medium mb-4">Condiciones y Certificaciones</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="condcert_buceo_altitud"
                  checked={watch('condcert_buceo_altitud')}
                  onCheckedChange={(checked) => setValue('condcert_buceo_altitud', checked as boolean)}
                />
                <Label htmlFor="condcert_buceo_altitud">Buceo en Altitud</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="condcert_certificados_equipos_usados"
                  checked={watch('condcert_certificados_equipos_usados')}
                  onCheckedChange={(checked) => setValue('condcert_certificados_equipos_usados', checked as boolean)}
                />
                <Label htmlFor="condcert_certificados_equipos_usados">Equipos Certificados</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="condcert_buceo_areas_confinadas"
                  checked={watch('condcert_buceo_areas_confinadas')}
                  onCheckedChange={(checked) => setValue('condcert_buceo_areas_confinadas', checked as boolean)}
                />
                <Label htmlFor="condcert_buceo_areas_confinadas">Buceo en Áreas Confinadas</Label>
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="condcert_observaciones">Observaciones sobre Condiciones/Certificaciones</Label>
              <Textarea
                id="condcert_observaciones"
                {...register('condcert_observaciones')}
                placeholder="Observaciones adicionales sobre condiciones y certificaciones..."
                className="min-h-[80px]"
              />
            </div>
          </div>

          <Separator />

          <div className="pt-4">
            <Label htmlFor="validador_nombre">Nombre del Validador</Label>
            <Input
              id="validador_nombre"
              {...register('validador_nombre')}
              placeholder="Nombre de quien valida esta bitácora"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
