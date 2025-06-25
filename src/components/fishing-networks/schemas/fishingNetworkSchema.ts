
import { z } from 'zod';

const dotacionMemberSchema = z.object({
  rol: z.string().min(1, 'Rol es requerido'),
  nombre: z.string().min(1, 'Nombre es requerido'),
  apellido: z.string().min(1, 'Apellido es requerido'),
  matricula: z.string().min(1, 'Matrícula es requerida'),
});

const equipoInmersionSchema = z.object({
  equipo: z.enum(['liviano', 'mediano']),
  hora_inicio: z.string().min(1, 'Hora inicio es requerida'),
  hora_termino: z.string().min(1, 'Hora término es requerida'),
  profundidad: z.number().min(0, 'Profundidad debe ser positiva'),
  horometro_inicio: z.number().min(0, 'Horómetro inicio debe ser positivo'),
  horometro_termino: z.number().min(0, 'Horómetro término debe ser positivo'),
});

const actividadSchema = z.object({
  checked: z.boolean(),
  cantidad: z.number().min(0, 'Cantidad debe ser positiva'),
});

const actividadConDescripcionSchema = z.object({
  checked: z.boolean(),
  cantidad: z.number().min(0, 'Cantidad debe ser positiva'),
  descripcion: z.string().optional(),
});

const faenasMantencionSchema = z.object({
  red_lober: z.boolean(),
  red_pecera: z.boolean(),
  reparacion_roturas: z.boolean(),
  reparacion_descosturas: z.boolean(),
  num_jaulas: z.string(),
  cantidad: z.number().min(0, 'Cantidad debe ser positiva'),
  ubicacion: z.string(),
  tipo_rotura_2x1: z.boolean(),
  tipo_rotura_2x2: z.boolean(),
  tipo_rotura_mayor_2x2: z.boolean(),
  observaciones: z.string().optional().default(''),
});

const sistemasEquiposSchema = z.object({
  instalacion: actividadSchema,
  mantencion: actividadSchema,
  recuperacion: actividadSchema,
  limpieza: actividadSchema,
  ajuste: actividadSchema,
  focos_fotoperiodo: actividadSchema,
  extractor_mortalidad: actividadSchema,
  sistema_aireacion: actividadSchema,
  sistema_oxigenacion: actividadSchema,
  otros: actividadConDescripcionSchema,
  observaciones: z.string().optional().default(''),
});

const apoyoFaenasSchema = z.object({
  red_lober: z.boolean(),
  red_pecera: z.boolean(),
  balsas: z.boolean(),
  cosecha: z.boolean(),
  actividades: z.object({
    soltar_reinstalar_tensores: actividadSchema,
    reparacion_red: actividadSchema,
    reinstalacion_extractor: actividadSchema,
    instalacion_reventadores: actividadSchema,
    recuperacion_fondones: actividadSchema,
  }),
  observaciones: z.string().optional().default(''),
});

const fichaBuzoSchema = z.object({
  buzo_numero: z.number().min(1).max(8),
  faenas_mantencion: faenasMantencionSchema,
  sistemas_equipos: sistemasEquiposSchema,
  apoyo_faenas: apoyoFaenasSchema,
});

const firmaSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  firma: z.string().min(1, 'Firma es requerida'),
});

export const fishingNetworkMaintenanceSchema = z.object({
  datos_generales: z.object({
    lugar_trabajo: z.string().min(1, 'Lugar de trabajo es requerido'),
    fecha: z.string().min(1, 'Fecha es requerida'),
    hora_inicio_faena: z.string().min(1, 'Hora inicio es requerida'),
    hora_termino_faena: z.string().min(1, 'Hora término es requerida'),
    profundidad_maxima: z.number().min(0, 'Profundidad debe ser positiva'),
    temperatura: z.number(),
    nave_maniobras: z.string().min(1, 'Nave de maniobras es requerida'),
    matricula_nave: z.string().min(1, 'Matrícula de nave es requerida'),
    estado_puerto: z.string().min(1, 'Estado de puerto es requerido'),
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

  fichas_buzos: z.array(fichaBuzoSchema).max(8, 'Máximo 8 fichas de buzos'),

  otros: z.object({
    navegacion_relevo: z.boolean(),
    cableado_perfilada_buceo: z.boolean(),
    revision_documental: z.boolean(),
    relevo: z.boolean(),
  }),

  contingencias: z.object({
    bloom_algas: z.boolean(),
    enfermedad_peces: z.boolean(),
    marea_roja: z.boolean(),
    manejo_cambio_redes: z.boolean(),
    otro: z.string().optional().default(''),
  }),

  totales: z.object({
    horas_inmersion: z.number().min(0).max(24, 'Horas no pueden exceder 24'),
    horas_trabajo: z.number().min(0).max(24, 'Horas no pueden exceder 24'),
    total_horas: z.number().min(0).max(24, 'Horas no pueden exceder 24'),
    jaulas_intervenidas: z.string(),
  }),

  observaciones_generales: z.string().optional().default(''),

  firmas: z.object({
    supervisor_buceo: firmaSchema,
    jefe_centro: firmaSchema,
  }),
});

export type FishingNetworkMaintenanceFormData = z.infer<typeof fishingNetworkMaintenanceSchema>;
