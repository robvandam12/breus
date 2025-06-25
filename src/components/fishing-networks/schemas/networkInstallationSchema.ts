
import { z } from 'zod';

const dotacionMemberSchema = z.object({
  rol: z.string().min(1, 'El rol es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  apellido: z.string().min(1, 'El apellido es requerido'),
  matricula: z.string().min(1, 'La matrícula es requerida'),
});

export const networkInstallationSchema = z.object({
  seleccion_inicial: z.object({
    red_lober: z.boolean(),
    red_pecera: z.boolean(),
    faena_instalacion: z.boolean(),
    faena_cambio: z.boolean(),
    faena_retiro: z.boolean(),
  }).refine(
    (data) => data.red_lober || data.red_pecera,
    { message: 'Debe seleccionar al menos un tipo de red' }
  ).refine(
    (data) => data.faena_instalacion || data.faena_cambio || data.faena_retiro,
    { message: 'Debe seleccionar al menos un tipo de faena' }
  ),

  instalacion_redes: z.object({
    instalacion_redes: z.record(z.string()),
    instalacion_impias: z.record(z.string()),
    contrapeso_250kg: z.record(z.string()),
    contrapeso_150kg: z.record(z.string()),
    reticulado_cabecera: z.record(z.string()),
  }),

  cambio_franjas: z.object({
    costura_ftc_fcd: z.string().optional(),
    costura_fced_fcs: z.string().optional(),
    costura_fces_fcs: z.string().optional(),
    costura_fma: z.string().optional(),
  }),

  cambio_pecera_buzos: z.record(z.object({
    jaula_numero: z.string(),
    actividades: z.object({
      soltar_tensores: z.number().min(0),
      descosturar_extractor: z.number().min(0),
      liberar_micropesos: z.number().min(0),
      reconectar_tensores: z.number().min(0),
      reinstalar_tensores: z.number().min(0),
      costurar_extractor: z.number().min(0),
      reinstalar_micropesos: z.number().min(0),
    }),
  })),

  observaciones_generales: z.string().optional(),

  firmas: z.object({
    supervisor_buceo: z.object({
      nombre: z.string().min(1, 'Nombre del supervisor es requerido'),
      firma: z.string().min(1, 'Firma del supervisor es requerida'),
    }),
    jefe_centro: z.object({
      nombre: z.string().min(1, 'Nombre del jefe de centro es requerido'),
      firma: z.string().min(1, 'Firma del jefe de centro es requerida'),
    }),
  }),
});

export type NetworkInstallationFormData = z.infer<typeof networkInstallationSchema>;

