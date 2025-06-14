
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { BitacoraBuzoFormValues } from "../buzoFormSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface StepProps {
  register: UseFormRegister<BitacoraBuzoFormValues>;
  errors: FieldErrors<BitacoraBuzoFormValues>;
}

export const Step5Tiempos = ({ register, errors }: StepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Tiempos y Objetivo del Buceo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="tiempos_total_fondo">Tiempo Total Fondo</Label>
            <Input
              id="tiempos_total_fondo"
              {...register('tiempos_total_fondo')}
              placeholder="ej: 45 min"
            />
          </div>
          <div>
            <Label htmlFor="tiempos_total_descompresion">Tiempo Total Descompresión</Label>
            <Input
              id="tiempos_total_descompresion"
              {...register('tiempos_total_descompresion')}
              placeholder="ej: 10 min"
            />
          </div>
          <div>
            <Label htmlFor="tiempos_total_buceo">Tiempo Total Buceo</Label>
            <Input
              id="tiempos_total_buceo"
              {...register('tiempos_total_buceo')}
              placeholder="ej: 55 min"
            />
          </div>
          <div>
            <Label htmlFor="tiempos_tabulacion_usada">Tabulación Usada</Label>
            <Input
              id="tiempos_tabulacion_usada"
              {...register('tiempos_tabulacion_usada')}
              placeholder="Tipo de tabla utilizada"
            />
          </div>
          <div>
            <Label htmlFor="tiempos_intervalo_superficie">Intervalo Superficie</Label>
            <Input
              id="tiempos_intervalo_superficie"
              {...register('tiempos_intervalo_superficie')}
              placeholder="ej: 2 horas"
            />
          </div>
          <div>
            <Label htmlFor="tiempos_nitrogeno_residual">Nitrógeno Residual</Label>
            <Input
              id="tiempos_nitrogeno_residual"
              {...register('tiempos_nitrogeno_residual')}
              placeholder="Valor de nitrógeno residual"
            />
          </div>
          <div>
            <Label htmlFor="tiempos_grupo_repetitivo_anterior">Grupo Repetitivo Anterior</Label>
            <Input
              id="tiempos_grupo_repetitivo_anterior"
              {...register('tiempos_grupo_repetitivo_anterior')}
              placeholder="ej: A, B, C..."
            />
          </div>
          <div>
            <Label htmlFor="tiempos_nuevo_grupo_repetitivo">Nuevo Grupo Repetitivo</Label>
            <Input
              id="tiempos_nuevo_grupo_repetitivo"
              {...register('tiempos_nuevo_grupo_repetitivo')}
              placeholder="ej: A, B, C..."
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4 pt-4">
          <h4 className="font-medium">Objetivo del Buceo</h4>
          <div>
            <Label htmlFor="objetivo_proposito">Propósito *</Label>
            <Textarea
              id="objetivo_proposito"
              {...register('objetivo_proposito')}
              placeholder="Describa el propósito de la inmersión..."
              className="min-h-[80px]"
            />
            {errors.objetivo_proposito && (
              <p className="text-sm text-red-600">{errors.objetivo_proposito.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="objetivo_tipo_area">Tipo de Área</Label>
            <Input
              id="objetivo_tipo_area"
              {...register('objetivo_tipo_area')}
              placeholder="ej: Jaulas, Fondeo, Estructuras..."
            />
          </div>
          <div>
            <Label htmlFor="objetivo_caracteristicas_dimensiones">Características y Dimensiones</Label>
            <Textarea
              id="objetivo_caracteristicas_dimensiones"
              {...register('objetivo_caracteristicas_dimensiones')}
              placeholder="Describa características y dimensiones del área de trabajo..."
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
