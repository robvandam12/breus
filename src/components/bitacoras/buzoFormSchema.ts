
import * as z from "zod";

export const bitacoraBuzoFormSchema = z.object({
  inmersion_id: z.string().min(1, "Debe seleccionar una inmersión"),
  folio: z.string().optional(),
  codigo_verificacion: z.string().optional(),
  empresa_nombre: z.string().min(1, "El nombre de la empresa es requerido"),
  centro_nombre: z.string().min(1, "El nombre del centro es requerido"),
  buzo: z.string().min(1, "El nombre del buzo es requerido"),
  buzo_rut: z.string().optional(),
  supervisor_nombre: z.string().optional(),
  supervisor_rut: z.string().optional(),
  supervisor_correo: z.string().email("Email inválido").optional().or(z.literal("")),
  jefe_centro_correo: z.string().email("Email inválido").optional().or(z.literal("")),
  contratista_nombre: z.string().optional(),
  contratista_rut: z.string().optional(),
  // Condiciones ambientales
  condamb_estado_puerto: z.string().optional(),
  condamb_estado_mar: z.string().optional(),
  condamb_temp_aire_c: z.number().optional(),
  condamb_temp_agua_c: z.number().optional(),
  condamb_visibilidad_fondo_mts: z.number().optional(),
  condamb_corriente_fondo_nudos: z.number().optional(),
  // Datos técnicos
  datostec_equipo_usado: z.string().min(1, "El equipo usado es requerido"),
  datostec_traje: z.string().optional(),
  datostec_hora_dejo_superficie: z.string().optional(),
  datostec_hora_llegada_fondo: z.string().optional(),
  datostec_hora_salida_fondo: z.string().optional(),
  datostec_hora_llegada_superficie: z.string().optional(),
  // Tiempos
  tiempos_total_fondo: z.string().optional(),
  tiempos_total_descompresion: z.string().optional(),
  tiempos_total_buceo: z.string().optional(),
  tiempos_tabulacion_usada: z.string().optional(),
  tiempos_intervalo_superficie: z.string().optional(),
  tiempos_nitrogeno_residual: z.string().optional(),
  tiempos_grupo_repetitivo_anterior: z.string().optional(),
  tiempos_nuevo_grupo_repetitivo: z.string().optional(),
  // Objetivo
  objetivo_proposito: z.string().min(1, "El propósito es requerido"),
  objetivo_tipo_area: z.string().optional(),
  objetivo_caracteristicas_dimensiones: z.string().optional(),
  // Trabajo realizado
  trabajos_realizados: z.string().min(10, "Debe describir los trabajos realizados"),
  observaciones_tecnicas: z.string().optional(),
  estado_fisico_post: z.string().min(1, "El estado físico post buceo es requerido"),
  profundidad_maxima: z.number().min(0, "La profundidad debe ser mayor a 0"),
  // Condiciones y certificaciones
  condcert_buceo_altitud: z.boolean().optional(),
  condcert_certificados_equipos_usados: z.boolean().optional(),
  condcert_buceo_areas_confinadas: z.boolean().optional(),
  condcert_observaciones: z.string().optional(),
  validador_nombre: z.string().optional(),
});

export type BitacoraBuzoFormValues = z.infer<typeof bitacoraBuzoFormSchema>;
