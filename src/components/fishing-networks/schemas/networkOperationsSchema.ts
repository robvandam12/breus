
import { z } from 'zod';

const dotacionMemberSchema = z.object({
  rol: z.string().min(1, 'El rol es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  apellido: z.string().min(1, 'El apellido es requerido'),
  matricula: z.string().min(1, 'La matrícula es requerida'),
});

const equipoInmersionSchema = z.object({
  equipo: z.enum(['liviano', 'mediano'], {
    required_error: 'Debe seleccionar el tipo de equipo',
  }),
  hora_inicio: z.string().min(1, 'Hora de inicio es requerida'),
  hora_termino: z.string().min(1, 'Hora de término es requerida'),
  profundidad: z.number().min(0, 'La profundidad debe ser un número positivo'),
  horometro_inicio: z.number().min(0, 'El horómetro inicial debe ser un número positivo'),
  horometro_termino: z.number().min(0, 'El horómetro final debe ser un número positivo'),
});

export const networkOperationsSchema = z.object({
  datos_generales: z.object({
    lugar_trabajo: z.string().min(1, 'El lugar de trabajo es requerido'),
    supervisor: z.string().min(1, 'El supervisor es requerido'),
    hora_inicio_faena: z.string().min(1, 'Hora de inicio es requerida'),
    hora_termino_faena: z.string().min(1, 'Hora de término es requerida'),
    profundidad_maxima: z.number().min(0, 'La profundidad debe ser un número positivo'),
    team_s: z.number().min(0, 'Team S debe ser un número positivo'),
    team_e: z.number().min(0, 'Team E debe ser un número positivo'),
    team_b: z.number().min(0, 'Team B debe ser un número positivo'),
    fecha: z.string().min(1, 'La fecha es requerida'),
    temperatura: z.number().min(-10).max(50, 'Temperatura debe estar entre -10°C y 50°C'),
    nave_maniobras: z.string().min(1, 'La nave de maniobras es requerida'),
    matricula_nave: z.string().min(1, 'La matrícula de la nave es requerida'),
    estado_puerto: z.string().min(1, 'El estado del puerto es requerido'),
  }),

  dotacion: z.object({
    contratista: dotacionMemberSchema,
    supervisor: dotacionMemberSchema,
    buzo_emerg_1: dotacionMemberSchema,
    buzo_emerg_2: dotacionMemberSchema,
    buzo_1: dotacionMemberSchema,
    buzo_2: dotacionMemberSchema,
    buzo_3: dotacionMemberSchema,
    buzo_4: dotacionMemberSchema,
    buzo_5: dotacionMemberSchema,
    buzo_6: dotacionMemberSchema,
    buzo_7: dotacionMemberSchema,
    buzo_8: dotacionMemberSchema,
    compresor_1: dotacionMemberSchema,
    compresor_2: dotacionMemberSchema,
  }),

  equipo_inmersion: equipoInmersionSchema,

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

export type NetworkOperationsFormData = z.infer<typeof networkOperationsSchema>;

