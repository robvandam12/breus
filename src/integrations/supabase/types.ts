export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      anexo_bravo: {
        Row: {
          anexo_bravo_checklist: Json | null
          anexo_bravo_firmas: Json | null
          anexo_bravo_trabajadores: Json | null
          asistente_buzo_matricula: string | null
          asistente_buzo_nombre: string | null
          autorizacion_armada: boolean | null
          bitacora_fecha: string | null
          bitacora_hora_inicio: string | null
          bitacora_hora_termino: string | null
          bitacora_relator: string | null
          buzo_matricula: string | null
          buzo_o_empresa_nombre: string | null
          checklist_completo: boolean
          codigo: string
          company_id: string | null
          company_type: string | null
          created_at: string
          empresa_nombre: string | null
          estado: string
          fecha: string | null
          fecha_creacion: string
          fecha_verificacion: string
          firmado: boolean
          form_version: number | null
          id: string
          jefe_centro: string
          jefe_centro_firma: string | null
          jefe_centro_nombre: string | null
          lugar_faena: string | null
          observaciones_generales: string | null
          operacion_id: string
          progreso: number
          supervisor: string
          supervisor_firma: string | null
          supervisor_mandante_id: string | null
          supervisor_mandante_nombre: string | null
          supervisor_mandante_timestamp: string | null
          supervisor_servicio_id: string | null
          supervisor_servicio_nombre: string | null
          supervisor_servicio_timestamp: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          anexo_bravo_checklist?: Json | null
          anexo_bravo_firmas?: Json | null
          anexo_bravo_trabajadores?: Json | null
          asistente_buzo_matricula?: string | null
          asistente_buzo_nombre?: string | null
          autorizacion_armada?: boolean | null
          bitacora_fecha?: string | null
          bitacora_hora_inicio?: string | null
          bitacora_hora_termino?: string | null
          bitacora_relator?: string | null
          buzo_matricula?: string | null
          buzo_o_empresa_nombre?: string | null
          checklist_completo?: boolean
          codigo: string
          company_id?: string | null
          company_type?: string | null
          created_at?: string
          empresa_nombre?: string | null
          estado?: string
          fecha?: string | null
          fecha_creacion?: string
          fecha_verificacion: string
          firmado?: boolean
          form_version?: number | null
          id?: string
          jefe_centro: string
          jefe_centro_firma?: string | null
          jefe_centro_nombre?: string | null
          lugar_faena?: string | null
          observaciones_generales?: string | null
          operacion_id: string
          progreso?: number
          supervisor: string
          supervisor_firma?: string | null
          supervisor_mandante_id?: string | null
          supervisor_mandante_nombre?: string | null
          supervisor_mandante_timestamp?: string | null
          supervisor_servicio_id?: string | null
          supervisor_servicio_nombre?: string | null
          supervisor_servicio_timestamp?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          anexo_bravo_checklist?: Json | null
          anexo_bravo_firmas?: Json | null
          anexo_bravo_trabajadores?: Json | null
          asistente_buzo_matricula?: string | null
          asistente_buzo_nombre?: string | null
          autorizacion_armada?: boolean | null
          bitacora_fecha?: string | null
          bitacora_hora_inicio?: string | null
          bitacora_hora_termino?: string | null
          bitacora_relator?: string | null
          buzo_matricula?: string | null
          buzo_o_empresa_nombre?: string | null
          checklist_completo?: boolean
          codigo?: string
          company_id?: string | null
          company_type?: string | null
          created_at?: string
          empresa_nombre?: string | null
          estado?: string
          fecha?: string | null
          fecha_creacion?: string
          fecha_verificacion?: string
          firmado?: boolean
          form_version?: number | null
          id?: string
          jefe_centro?: string
          jefe_centro_firma?: string | null
          jefe_centro_nombre?: string | null
          lugar_faena?: string | null
          observaciones_generales?: string | null
          operacion_id?: string
          progreso?: number
          supervisor?: string
          supervisor_firma?: string | null
          supervisor_mandante_id?: string | null
          supervisor_mandante_nombre?: string | null
          supervisor_mandante_timestamp?: string | null
          supervisor_servicio_id?: string | null
          supervisor_servicio_nombre?: string | null
          supervisor_servicio_timestamp?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "anexo_bravo_operacion_id_fkey"
            columns: ["operacion_id"]
            isOneToOne: false
            referencedRelation: "operacion"
            referencedColumns: ["id"]
          },
        ]
      }
      anexo_bravo_checklist: {
        Row: {
          anexo_bravo_id: string
          created_at: string
          id: string
          item: string
          observaciones: string | null
          orden: number
          verificado: boolean
        }
        Insert: {
          anexo_bravo_id: string
          created_at?: string
          id?: string
          item: string
          observaciones?: string | null
          orden: number
          verificado?: boolean
        }
        Update: {
          anexo_bravo_id?: string
          created_at?: string
          id?: string
          item?: string
          observaciones?: string | null
          orden?: number
          verificado?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "anexo_bravo_checklist_anexo_bravo_id_fkey"
            columns: ["anexo_bravo_id"]
            isOneToOne: false
            referencedRelation: "anexo_bravo"
            referencedColumns: ["id"]
          },
        ]
      }
      anexo_bravo_equipos: {
        Row: {
          anexo_bravo_id: string
          created_at: string | null
          equipo_nombre: string
          id: string
          observaciones: string | null
          orden: number
          verificado: boolean | null
        }
        Insert: {
          anexo_bravo_id: string
          created_at?: string | null
          equipo_nombre: string
          id?: string
          observaciones?: string | null
          orden: number
          verificado?: boolean | null
        }
        Update: {
          anexo_bravo_id?: string
          created_at?: string | null
          equipo_nombre?: string
          id?: string
          observaciones?: string | null
          orden?: number
          verificado?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "anexo_bravo_equipos_anexo_bravo_id_fkey"
            columns: ["anexo_bravo_id"]
            isOneToOne: false
            referencedRelation: "anexo_bravo"
            referencedColumns: ["id"]
          },
        ]
      }
      anexo_bravo_participantes: {
        Row: {
          anexo_bravo_id: string
          created_at: string | null
          id: string
          nombre: string
          orden: number
          rut: string
        }
        Insert: {
          anexo_bravo_id: string
          created_at?: string | null
          id?: string
          nombre: string
          orden: number
          rut: string
        }
        Update: {
          anexo_bravo_id?: string
          created_at?: string | null
          id?: string
          nombre?: string
          orden?: number
          rut?: string
        }
        Relationships: [
          {
            foreignKeyName: "anexo_bravo_participantes_anexo_bravo_id_fkey"
            columns: ["anexo_bravo_id"]
            isOneToOne: false
            referencedRelation: "anexo_bravo"
            referencedColumns: ["id"]
          },
        ]
      }
      bitacora_buzo: {
        Row: {
          aprobada_por: string | null
          bitacora_id: string
          buzo: string
          buzo_firma: string | null
          buzo_rut: string | null
          centro_nombre: string | null
          codigo: string
          codigo_verificacion: string | null
          comentarios_aprobacion: string | null
          company_id: string | null
          company_type: string | null
          condamb_corriente_fondo_nudos: number | null
          condamb_estado_mar: string | null
          condamb_estado_puerto: string | null
          condamb_temp_agua_c: number | null
          condamb_temp_aire_c: number | null
          condamb_visibilidad_fondo_mts: number | null
          condcert_buceo_altitud: boolean | null
          condcert_buceo_areas_confinadas: boolean | null
          condcert_certificados_equipos_usados: boolean | null
          condcert_observaciones: string | null
          contratista_nombre: string | null
          contratista_rut: string | null
          created_at: string
          datostec_equipo_usado: string | null
          datostec_hora_dejo_superficie: string | null
          datostec_hora_llegada_fondo: string | null
          datostec_hora_llegada_superficie: string | null
          datostec_hora_salida_fondo: string | null
          datostec_traje: string | null
          empresa_nombre: string | null
          estado_aprobacion: string | null
          estado_fisico_post: string
          fecha: string
          fecha_aprobacion: string | null
          firmado: boolean
          folio: string | null
          inmersion_id: string
          jefe_centro_correo: string | null
          objetivo_caracteristicas_dimensiones: string | null
          objetivo_proposito: string | null
          objetivo_tipo_area: string | null
          observaciones_tecnicas: string | null
          profundidad_maxima: number
          supervisor_correo: string | null
          supervisor_nombre: string | null
          supervisor_rut: string | null
          tiempos_grupo_repetitivo_anterior: string | null
          tiempos_intervalo_superficie: string | null
          tiempos_nitrogeno_residual: string | null
          tiempos_nuevo_grupo_repetitivo: string | null
          tiempos_tabulacion_usada: string | null
          tiempos_total_buceo: string | null
          tiempos_total_descompresion: string | null
          tiempos_total_fondo: string | null
          trabajos_realizados: string
          updated_at: string
          validador_nombre: string | null
        }
        Insert: {
          aprobada_por?: string | null
          bitacora_id?: string
          buzo: string
          buzo_firma?: string | null
          buzo_rut?: string | null
          centro_nombre?: string | null
          codigo: string
          codigo_verificacion?: string | null
          comentarios_aprobacion?: string | null
          company_id?: string | null
          company_type?: string | null
          condamb_corriente_fondo_nudos?: number | null
          condamb_estado_mar?: string | null
          condamb_estado_puerto?: string | null
          condamb_temp_agua_c?: number | null
          condamb_temp_aire_c?: number | null
          condamb_visibilidad_fondo_mts?: number | null
          condcert_buceo_altitud?: boolean | null
          condcert_buceo_areas_confinadas?: boolean | null
          condcert_certificados_equipos_usados?: boolean | null
          condcert_observaciones?: string | null
          contratista_nombre?: string | null
          contratista_rut?: string | null
          created_at?: string
          datostec_equipo_usado?: string | null
          datostec_hora_dejo_superficie?: string | null
          datostec_hora_llegada_fondo?: string | null
          datostec_hora_llegada_superficie?: string | null
          datostec_hora_salida_fondo?: string | null
          datostec_traje?: string | null
          empresa_nombre?: string | null
          estado_aprobacion?: string | null
          estado_fisico_post: string
          fecha: string
          fecha_aprobacion?: string | null
          firmado?: boolean
          folio?: string | null
          inmersion_id: string
          jefe_centro_correo?: string | null
          objetivo_caracteristicas_dimensiones?: string | null
          objetivo_proposito?: string | null
          objetivo_tipo_area?: string | null
          observaciones_tecnicas?: string | null
          profundidad_maxima: number
          supervisor_correo?: string | null
          supervisor_nombre?: string | null
          supervisor_rut?: string | null
          tiempos_grupo_repetitivo_anterior?: string | null
          tiempos_intervalo_superficie?: string | null
          tiempos_nitrogeno_residual?: string | null
          tiempos_nuevo_grupo_repetitivo?: string | null
          tiempos_tabulacion_usada?: string | null
          tiempos_total_buceo?: string | null
          tiempos_total_descompresion?: string | null
          tiempos_total_fondo?: string | null
          trabajos_realizados: string
          updated_at?: string
          validador_nombre?: string | null
        }
        Update: {
          aprobada_por?: string | null
          bitacora_id?: string
          buzo?: string
          buzo_firma?: string | null
          buzo_rut?: string | null
          centro_nombre?: string | null
          codigo?: string
          codigo_verificacion?: string | null
          comentarios_aprobacion?: string | null
          company_id?: string | null
          company_type?: string | null
          condamb_corriente_fondo_nudos?: number | null
          condamb_estado_mar?: string | null
          condamb_estado_puerto?: string | null
          condamb_temp_agua_c?: number | null
          condamb_temp_aire_c?: number | null
          condamb_visibilidad_fondo_mts?: number | null
          condcert_buceo_altitud?: boolean | null
          condcert_buceo_areas_confinadas?: boolean | null
          condcert_certificados_equipos_usados?: boolean | null
          condcert_observaciones?: string | null
          contratista_nombre?: string | null
          contratista_rut?: string | null
          created_at?: string
          datostec_equipo_usado?: string | null
          datostec_hora_dejo_superficie?: string | null
          datostec_hora_llegada_fondo?: string | null
          datostec_hora_llegada_superficie?: string | null
          datostec_hora_salida_fondo?: string | null
          datostec_traje?: string | null
          empresa_nombre?: string | null
          estado_aprobacion?: string | null
          estado_fisico_post?: string
          fecha?: string
          fecha_aprobacion?: string | null
          firmado?: boolean
          folio?: string | null
          inmersion_id?: string
          jefe_centro_correo?: string | null
          objetivo_caracteristicas_dimensiones?: string | null
          objetivo_proposito?: string | null
          objetivo_tipo_area?: string | null
          observaciones_tecnicas?: string | null
          profundidad_maxima?: number
          supervisor_correo?: string | null
          supervisor_nombre?: string | null
          supervisor_rut?: string | null
          tiempos_grupo_repetitivo_anterior?: string | null
          tiempos_intervalo_superficie?: string | null
          tiempos_nitrogeno_residual?: string | null
          tiempos_nuevo_grupo_repetitivo?: string | null
          tiempos_tabulacion_usada?: string | null
          tiempos_total_buceo?: string | null
          tiempos_total_descompresion?: string | null
          tiempos_total_fondo?: string | null
          trabajos_realizados?: string
          updated_at?: string
          validador_nombre?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bitacora_buzo_aprobada_por_fkey"
            columns: ["aprobada_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "bitacora_buzo_inmersion_id_fkey"
            columns: ["inmersion_id"]
            isOneToOne: false
            referencedRelation: "inmersion"
            referencedColumns: ["inmersion_id"]
          },
        ]
      }
      bitacora_supervisor: {
        Row: {
          aprobada_por: string | null
          bitacora_id: string
          centro_nombre: string | null
          codigo: string
          codigo_verificacion: string | null
          comentarios_aprobacion: string | null
          comentarios_validacion: string | null
          company_id: string | null
          company_type: string | null
          created_at: string
          desarrollo_inmersion: string
          descripcion_trabajo: string | null
          diving_records: Json | null
          embarcacion_apoyo: string | null
          empresa_nombre: string | null
          equipos_utilizados: Json | null
          estado_aprobacion: string | null
          estado_mar: string | null
          evaluacion_general: string
          fecha: string
          fecha_aprobacion: string | null
          fecha_inicio_faena: string | null
          firmado: boolean
          folio: string | null
          hora_inicio_faena: string | null
          hora_termino_faena: string | null
          incidentes: string | null
          inmersion_id: string
          inmersiones_buzos: Json | null
          lugar_trabajo: string | null
          observaciones_generales_texto: string | null
          supervisor: string
          supervisor_firma: string | null
          supervisor_nombre_matricula: string | null
          trabajo_a_realizar: string | null
          updated_at: string
          validacion_contratista: boolean | null
          visibilidad_fondo: number | null
        }
        Insert: {
          aprobada_por?: string | null
          bitacora_id?: string
          centro_nombre?: string | null
          codigo: string
          codigo_verificacion?: string | null
          comentarios_aprobacion?: string | null
          comentarios_validacion?: string | null
          company_id?: string | null
          company_type?: string | null
          created_at?: string
          desarrollo_inmersion: string
          descripcion_trabajo?: string | null
          diving_records?: Json | null
          embarcacion_apoyo?: string | null
          empresa_nombre?: string | null
          equipos_utilizados?: Json | null
          estado_aprobacion?: string | null
          estado_mar?: string | null
          evaluacion_general: string
          fecha: string
          fecha_aprobacion?: string | null
          fecha_inicio_faena?: string | null
          firmado?: boolean
          folio?: string | null
          hora_inicio_faena?: string | null
          hora_termino_faena?: string | null
          incidentes?: string | null
          inmersion_id: string
          inmersiones_buzos?: Json | null
          lugar_trabajo?: string | null
          observaciones_generales_texto?: string | null
          supervisor: string
          supervisor_firma?: string | null
          supervisor_nombre_matricula?: string | null
          trabajo_a_realizar?: string | null
          updated_at?: string
          validacion_contratista?: boolean | null
          visibilidad_fondo?: number | null
        }
        Update: {
          aprobada_por?: string | null
          bitacora_id?: string
          centro_nombre?: string | null
          codigo?: string
          codigo_verificacion?: string | null
          comentarios_aprobacion?: string | null
          comentarios_validacion?: string | null
          company_id?: string | null
          company_type?: string | null
          created_at?: string
          desarrollo_inmersion?: string
          descripcion_trabajo?: string | null
          diving_records?: Json | null
          embarcacion_apoyo?: string | null
          empresa_nombre?: string | null
          equipos_utilizados?: Json | null
          estado_aprobacion?: string | null
          estado_mar?: string | null
          evaluacion_general?: string
          fecha?: string
          fecha_aprobacion?: string | null
          fecha_inicio_faena?: string | null
          firmado?: boolean
          folio?: string | null
          hora_inicio_faena?: string | null
          hora_termino_faena?: string | null
          incidentes?: string | null
          inmersion_id?: string
          inmersiones_buzos?: Json | null
          lugar_trabajo?: string | null
          observaciones_generales_texto?: string | null
          supervisor?: string
          supervisor_firma?: string | null
          supervisor_nombre_matricula?: string | null
          trabajo_a_realizar?: string | null
          updated_at?: string
          validacion_contratista?: boolean | null
          visibilidad_fondo?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bitacora_supervisor_aprobada_por_fkey"
            columns: ["aprobada_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "bitacora_supervisor_inmersion_id_fkey"
            columns: ["inmersion_id"]
            isOneToOne: false
            referencedRelation: "inmersion"
            referencedColumns: ["inmersion_id"]
          },
        ]
      }
      centros: {
        Row: {
          capacidad_jaulas: number | null
          codigo: string
          coordenadas_lat: number | null
          coordenadas_lng: number | null
          created_at: string
          estado: string
          id: string
          nombre: string
          observaciones: string | null
          profundidad_maxima: number | null
          region: string | null
          salmonera_id: string
          ubicacion: string
          updated_at: string
        }
        Insert: {
          capacidad_jaulas?: number | null
          codigo: string
          coordenadas_lat?: number | null
          coordenadas_lng?: number | null
          created_at?: string
          estado?: string
          id?: string
          nombre: string
          observaciones?: string | null
          profundidad_maxima?: number | null
          region?: string | null
          salmonera_id: string
          ubicacion: string
          updated_at?: string
        }
        Update: {
          capacidad_jaulas?: number | null
          codigo?: string
          coordenadas_lat?: number | null
          coordenadas_lng?: number | null
          created_at?: string
          estado?: string
          id?: string
          nombre?: string
          observaciones?: string | null
          profundidad_maxima?: number | null
          region?: string | null
          salmonera_id?: string
          ubicacion?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sitios_salmonera_id_fkey"
            columns: ["salmonera_id"]
            isOneToOne: false
            referencedRelation: "salmoneras"
            referencedColumns: ["id"]
          },
        ]
      }
      company_modules: {
        Row: {
          activated_at: string | null
          activated_by: string | null
          company_id: string
          company_type: string
          configuration: Json | null
          created_at: string | null
          deactivated_at: string | null
          id: string
          is_active: boolean | null
          module_name: string
          updated_at: string | null
        }
        Insert: {
          activated_at?: string | null
          activated_by?: string | null
          company_id: string
          company_type: string
          configuration?: Json | null
          created_at?: string | null
          deactivated_at?: string | null
          id?: string
          is_active?: boolean | null
          module_name: string
          updated_at?: string | null
        }
        Update: {
          activated_at?: string | null
          activated_by?: string | null
          company_id?: string
          company_type?: string
          configuration?: Json | null
          created_at?: string | null
          deactivated_at?: string | null
          id?: string
          is_active?: boolean | null
          module_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_modules_module_name_fkey"
            columns: ["module_name"]
            isOneToOne: false
            referencedRelation: "system_modules"
            referencedColumns: ["name"]
          },
        ]
      }
      contractor_invitations: {
        Row: {
          admin_email: string
          admin_nombre: string
          created_at: string
          empresa_nombre: string
          empresa_rut: string
          id: string
          invited_at: string
          responded_at: string | null
          salmonera_id: string | null
          status: string
          token: string
          updated_at: string
        }
        Insert: {
          admin_email: string
          admin_nombre: string
          created_at?: string
          empresa_nombre: string
          empresa_rut: string
          id?: string
          invited_at?: string
          responded_at?: string | null
          salmonera_id?: string | null
          status?: string
          token: string
          updated_at?: string
        }
        Update: {
          admin_email?: string
          admin_nombre?: string
          created_at?: string
          empresa_nombre?: string
          empresa_rut?: string
          id?: string
          invited_at?: string
          responded_at?: string | null
          salmonera_id?: string | null
          status?: string
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractor_invitations_salmonera_id_fkey"
            columns: ["salmonera_id"]
            isOneToOne: false
            referencedRelation: "salmoneras"
            referencedColumns: ["id"]
          },
        ]
      }
      contratistas: {
        Row: {
          certificaciones: string[] | null
          created_at: string
          direccion: string
          email: string | null
          especialidades: string[] | null
          estado: string
          id: string
          nombre: string
          rut: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          certificaciones?: string[] | null
          created_at?: string
          direccion: string
          email?: string | null
          especialidades?: string[] | null
          estado?: string
          id?: string
          nombre: string
          rut: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          certificaciones?: string[] | null
          created_at?: string
          direccion?: string
          email?: string | null
          especialidades?: string[] | null
          estado?: string
          id?: string
          nombre?: string
          rut?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cuadrilla_asignaciones: {
        Row: {
          created_at: string
          cuadrilla_id: string
          estado: string
          fecha_asignacion: string
          id: string
          inmersion_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cuadrilla_id: string
          estado?: string
          fecha_asignacion: string
          id?: string
          inmersion_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cuadrilla_id?: string
          estado?: string
          fecha_asignacion?: string
          id?: string
          inmersion_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cuadrilla_asignaciones_cuadrilla_id_fkey"
            columns: ["cuadrilla_id"]
            isOneToOne: false
            referencedRelation: "cuadrillas_buceo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cuadrilla_asignaciones_inmersion_id_fkey"
            columns: ["inmersion_id"]
            isOneToOne: false
            referencedRelation: "inmersion"
            referencedColumns: ["inmersion_id"]
          },
        ]
      }
      cuadrilla_miembros: {
        Row: {
          created_at: string
          cuadrilla_id: string | null
          disponible: boolean
          id: string
          rol_equipo: string
          usuario_id: string | null
        }
        Insert: {
          created_at?: string
          cuadrilla_id?: string | null
          disponible?: boolean
          id?: string
          rol_equipo: string
          usuario_id?: string | null
        }
        Update: {
          created_at?: string
          cuadrilla_id?: string | null
          disponible?: boolean
          id?: string
          rol_equipo?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipo_buceo_miembros_equipo_id_fkey"
            columns: ["cuadrilla_id"]
            isOneToOne: false
            referencedRelation: "cuadrillas_buceo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipo_buceo_miembros_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      cuadrillas_buceo: {
        Row: {
          activo: boolean
          centro_id: string | null
          company_id: string | null
          company_type: string | null
          created_at: string
          descripcion: string | null
          empresa_id: string
          estado: string
          id: string
          nombre: string
          tipo_empresa: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          centro_id?: string | null
          company_id?: string | null
          company_type?: string | null
          created_at?: string
          descripcion?: string | null
          empresa_id: string
          estado?: string
          id?: string
          nombre: string
          tipo_empresa: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          centro_id?: string | null
          company_id?: string | null
          company_type?: string | null
          created_at?: string
          descripcion?: string | null
          empresa_id?: string
          estado?: string
          id?: string
          nombre?: string
          tipo_empresa?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cuadrillas_buceo_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_layouts: {
        Row: {
          created_at: string
          id: string
          layout_config: Json
          updated_at: string
          user_id: string
          widget_configs: Json
        }
        Insert: {
          created_at?: string
          id?: string
          layout_config?: Json
          updated_at?: string
          user_id: string
          widget_configs?: Json
        }
        Update: {
          created_at?: string
          id?: string
          layout_config?: Json
          updated_at?: string
          user_id?: string
          widget_configs?: Json
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_layouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "usuario"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      dashboard_templates: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          layout_config: Json
          name: string
          type: string
          updated_at: string
          widget_configs: Json
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          layout_config: Json
          name: string
          type?: string
          updated_at?: string
          widget_configs: Json
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          layout_config?: Json
          name?: string
          type?: string
          updated_at?: string
          widget_configs?: Json
        }
        Relationships: []
      }
      domain_event: {
        Row: {
          aggregate_id: string
          aggregate_type: string
          created_at: string
          event_data: Json
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          aggregate_id: string
          aggregate_type: string
          created_at?: string
          event_data?: Json
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          aggregate_id?: string
          aggregate_type?: string
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      hpt: {
        Row: {
          asistentes: Json | null
          buzos: Json | null
          camara_hiperbarica: string | null
          centro_trabajo_nombre: string | null
          codigo: string
          company_id: string | null
          company_type: string | null
          contactos_emergencia: Json | null
          corrientes: string | null
          created_at: string
          descripcion_tarea: string | null
          descripcion_trabajo: string | null
          empresa_servicio_nombre: string | null
          equipo_buceo: Json | null
          equipo_comunicacion: Json | null
          equipo_seguridad: Json | null
          es_rutinaria: boolean | null
          estado: string | null
          estado_puerto: string | null
          fecha: string | null
          fecha_creacion: string
          fecha_programada: string | null
          firmado: boolean
          folio: string | null
          form_version: number | null
          herramientas: Json | null
          hora_fin: string | null
          hora_inicio: string | null
          hora_termino: string | null
          hospital_cercano: string | null
          hpt_conocimiento: Json | null
          hpt_conocimiento_asistentes: Json | null
          hpt_epp: Json | null
          hpt_erc: Json | null
          hpt_firmas: Json | null
          hpt_medidas: Json | null
          hpt_riesgos_comp: Json | null
          id: string
          jefe_mandante_nombre: string | null
          jefe_obra: string | null
          jefe_obra_firma: string | null
          jefe_operaciones_firma: string | null
          lugar_especifico: string | null
          medidas_control: Json | null
          observaciones: string | null
          operacion_id: string
          plan_emergencia: string | null
          plan_trabajo: string
          profundidad_maxima: number | null
          progreso: number | null
          riesgos_identificados: Json | null
          supervisor: string
          supervisor_firma: string | null
          supervisor_mandante_id: string | null
          supervisor_nombre: string | null
          supervisor_servicio_id: string | null
          temperatura: number | null
          tipo_trabajo: string | null
          updated_at: string
          user_id: string
          visibilidad: string | null
        }
        Insert: {
          asistentes?: Json | null
          buzos?: Json | null
          camara_hiperbarica?: string | null
          centro_trabajo_nombre?: string | null
          codigo: string
          company_id?: string | null
          company_type?: string | null
          contactos_emergencia?: Json | null
          corrientes?: string | null
          created_at?: string
          descripcion_tarea?: string | null
          descripcion_trabajo?: string | null
          empresa_servicio_nombre?: string | null
          equipo_buceo?: Json | null
          equipo_comunicacion?: Json | null
          equipo_seguridad?: Json | null
          es_rutinaria?: boolean | null
          estado?: string | null
          estado_puerto?: string | null
          fecha?: string | null
          fecha_creacion?: string
          fecha_programada?: string | null
          firmado?: boolean
          folio?: string | null
          form_version?: number | null
          herramientas?: Json | null
          hora_fin?: string | null
          hora_inicio?: string | null
          hora_termino?: string | null
          hospital_cercano?: string | null
          hpt_conocimiento?: Json | null
          hpt_conocimiento_asistentes?: Json | null
          hpt_epp?: Json | null
          hpt_erc?: Json | null
          hpt_firmas?: Json | null
          hpt_medidas?: Json | null
          hpt_riesgos_comp?: Json | null
          id?: string
          jefe_mandante_nombre?: string | null
          jefe_obra?: string | null
          jefe_obra_firma?: string | null
          jefe_operaciones_firma?: string | null
          lugar_especifico?: string | null
          medidas_control?: Json | null
          observaciones?: string | null
          operacion_id: string
          plan_emergencia?: string | null
          plan_trabajo: string
          profundidad_maxima?: number | null
          progreso?: number | null
          riesgos_identificados?: Json | null
          supervisor: string
          supervisor_firma?: string | null
          supervisor_mandante_id?: string | null
          supervisor_nombre?: string | null
          supervisor_servicio_id?: string | null
          temperatura?: number | null
          tipo_trabajo?: string | null
          updated_at?: string
          user_id: string
          visibilidad?: string | null
        }
        Update: {
          asistentes?: Json | null
          buzos?: Json | null
          camara_hiperbarica?: string | null
          centro_trabajo_nombre?: string | null
          codigo?: string
          company_id?: string | null
          company_type?: string | null
          contactos_emergencia?: Json | null
          corrientes?: string | null
          created_at?: string
          descripcion_tarea?: string | null
          descripcion_trabajo?: string | null
          empresa_servicio_nombre?: string | null
          equipo_buceo?: Json | null
          equipo_comunicacion?: Json | null
          equipo_seguridad?: Json | null
          es_rutinaria?: boolean | null
          estado?: string | null
          estado_puerto?: string | null
          fecha?: string | null
          fecha_creacion?: string
          fecha_programada?: string | null
          firmado?: boolean
          folio?: string | null
          form_version?: number | null
          herramientas?: Json | null
          hora_fin?: string | null
          hora_inicio?: string | null
          hora_termino?: string | null
          hospital_cercano?: string | null
          hpt_conocimiento?: Json | null
          hpt_conocimiento_asistentes?: Json | null
          hpt_epp?: Json | null
          hpt_erc?: Json | null
          hpt_firmas?: Json | null
          hpt_medidas?: Json | null
          hpt_riesgos_comp?: Json | null
          id?: string
          jefe_mandante_nombre?: string | null
          jefe_obra?: string | null
          jefe_obra_firma?: string | null
          jefe_operaciones_firma?: string | null
          lugar_especifico?: string | null
          medidas_control?: Json | null
          observaciones?: string | null
          operacion_id?: string
          plan_emergencia?: string | null
          plan_trabajo?: string
          profundidad_maxima?: number | null
          progreso?: number | null
          riesgos_identificados?: Json | null
          supervisor?: string
          supervisor_firma?: string | null
          supervisor_mandante_id?: string | null
          supervisor_nombre?: string | null
          supervisor_servicio_id?: string | null
          temperatura?: number | null
          tipo_trabajo?: string | null
          updated_at?: string
          user_id?: string
          visibilidad?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hpt_operacion_id_fkey"
            columns: ["operacion_id"]
            isOneToOne: false
            referencedRelation: "operacion"
            referencedColumns: ["id"]
          },
        ]
      }
      hpt_asistentes: {
        Row: {
          created_at: string | null
          empresa: string
          firma_url: string | null
          hpt_id: string
          id: string
          nombre: string
          rut: string
        }
        Insert: {
          created_at?: string | null
          empresa: string
          firma_url?: string | null
          hpt_id: string
          id?: string
          nombre: string
          rut: string
        }
        Update: {
          created_at?: string | null
          empresa?: string
          firma_url?: string | null
          hpt_id?: string
          id?: string
          nombre?: string
          rut?: string
        }
        Relationships: [
          {
            foreignKeyName: "hpt_asistentes_hpt_id_fkey"
            columns: ["hpt_id"]
            isOneToOne: false
            referencedRelation: "hpt"
            referencedColumns: ["id"]
          },
        ]
      }
      inmersion: {
        Row: {
          actual_end_time: string | null
          anexo_bravo_validado: boolean
          buzo_asistente: string | null
          buzo_asistente_id: string | null
          buzo_principal: string
          buzo_principal_id: string | null
          centro_id: string | null
          codigo: string
          company_id: string | null
          company_type: string | null
          context_type: string | null
          contexto_operativo: string | null
          corriente: string
          created_at: string
          current_depth: number | null
          depth_history: Json | null
          empresa_creadora_id: string | null
          empresa_creadora_tipo: string | null
          estado: string
          estimated_end_time: string | null
          external_operation_code: string | null
          fecha_inmersion: string
          hora_fin: string | null
          hora_inicio: string
          hpt_validado: boolean
          inmersion_id: string
          is_independent: boolean | null
          metadata: Json | null
          notification_status: Json | null
          objetivo: string
          observaciones: string | null
          operacion_id: string | null
          planned_bottom_time: number | null
          priority: string | null
          profundidad_max: number
          requiere_validacion_previa: boolean | null
          requires_validation: boolean | null
          supervisor: string
          supervisor_id: string | null
          temperatura_agua: number
          updated_at: string
          validacion_contextual: Json | null
          validation_status: string | null
          visibilidad: number
          work_type: string | null
        }
        Insert: {
          actual_end_time?: string | null
          anexo_bravo_validado?: boolean
          buzo_asistente?: string | null
          buzo_asistente_id?: string | null
          buzo_principal: string
          buzo_principal_id?: string | null
          centro_id?: string | null
          codigo: string
          company_id?: string | null
          company_type?: string | null
          context_type?: string | null
          contexto_operativo?: string | null
          corriente: string
          created_at?: string
          current_depth?: number | null
          depth_history?: Json | null
          empresa_creadora_id?: string | null
          empresa_creadora_tipo?: string | null
          estado?: string
          estimated_end_time?: string | null
          external_operation_code?: string | null
          fecha_inmersion: string
          hora_fin?: string | null
          hora_inicio: string
          hpt_validado?: boolean
          inmersion_id?: string
          is_independent?: boolean | null
          metadata?: Json | null
          notification_status?: Json | null
          objetivo: string
          observaciones?: string | null
          operacion_id?: string | null
          planned_bottom_time?: number | null
          priority?: string | null
          profundidad_max: number
          requiere_validacion_previa?: boolean | null
          requires_validation?: boolean | null
          supervisor: string
          supervisor_id?: string | null
          temperatura_agua: number
          updated_at?: string
          validacion_contextual?: Json | null
          validation_status?: string | null
          visibilidad: number
          work_type?: string | null
        }
        Update: {
          actual_end_time?: string | null
          anexo_bravo_validado?: boolean
          buzo_asistente?: string | null
          buzo_asistente_id?: string | null
          buzo_principal?: string
          buzo_principal_id?: string | null
          centro_id?: string | null
          codigo?: string
          company_id?: string | null
          company_type?: string | null
          context_type?: string | null
          contexto_operativo?: string | null
          corriente?: string
          created_at?: string
          current_depth?: number | null
          depth_history?: Json | null
          empresa_creadora_id?: string | null
          empresa_creadora_tipo?: string | null
          estado?: string
          estimated_end_time?: string | null
          external_operation_code?: string | null
          fecha_inmersion?: string
          hora_fin?: string | null
          hora_inicio?: string
          hpt_validado?: boolean
          inmersion_id?: string
          is_independent?: boolean | null
          metadata?: Json | null
          notification_status?: Json | null
          objetivo?: string
          observaciones?: string | null
          operacion_id?: string | null
          planned_bottom_time?: number | null
          priority?: string | null
          profundidad_max?: number
          requiere_validacion_previa?: boolean | null
          requires_validation?: boolean | null
          supervisor?: string
          supervisor_id?: string | null
          temperatura_agua?: number
          updated_at?: string
          validacion_contextual?: Json | null
          validation_status?: string | null
          visibilidad?: number
          work_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inmersion_buzo_asistente_id_fkey"
            columns: ["buzo_asistente_id"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "inmersion_buzo_principal_id_fkey"
            columns: ["buzo_principal_id"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "inmersion_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inmersion_operacion_id_fkey"
            columns: ["operacion_id"]
            isOneToOne: false
            referencedRelation: "operacion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inmersion_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      inmersion_team_members: {
        Row: {
          created_at: string
          id: string
          inmersion_id: string
          is_emergency: boolean
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inmersion_id: string
          is_emergency?: boolean
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inmersion_id?: string
          is_emergency?: boolean
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inmersion_team_members_inmersion_id_fkey"
            columns: ["inmersion_id"]
            isOneToOne: false
            referencedRelation: "inmersion"
            referencedColumns: ["inmersion_id"]
          },
          {
            foreignKeyName: "inmersion_team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      module_access: {
        Row: {
          activo: boolean
          configuracion: Json | null
          created_at: string
          empresa_id: string
          id: string
          modulo_nombre: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          configuracion?: Json | null
          created_at?: string
          empresa_id: string
          id?: string
          modulo_nombre: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          configuracion?: Json | null
          created_at?: string
          empresa_id?: string
          id?: string
          modulo_nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
      module_activation_logs: {
        Row: {
          action: string
          company_id: string
          company_type: string
          created_at: string
          id: string
          module_name: string
          new_state: Json | null
          performed_by: string | null
          previous_state: Json | null
          reason: string | null
        }
        Insert: {
          action: string
          company_id: string
          company_type: string
          created_at?: string
          id?: string
          module_name: string
          new_state?: Json | null
          performed_by?: string | null
          previous_state?: Json | null
          reason?: string | null
        }
        Update: {
          action?: string
          company_id?: string
          company_type?: string
          created_at?: string
          id?: string
          module_name?: string
          new_state?: Json | null
          performed_by?: string | null
          previous_state?: Json | null
          reason?: string | null
        }
        Relationships: []
      }
      module_configurations: {
        Row: {
          company_id: string
          company_type: string
          config_data: Json
          created_at: string
          created_by: string | null
          enabled: boolean
          id: string
          module_name: string
          updated_at: string
          usage_limits: Json | null
        }
        Insert: {
          company_id: string
          company_type: string
          config_data?: Json
          created_at?: string
          created_by?: string | null
          enabled?: boolean
          id?: string
          module_name: string
          updated_at?: string
          usage_limits?: Json | null
        }
        Update: {
          company_id?: string
          company_type?: string
          config_data?: Json
          created_at?: string
          created_by?: string | null
          enabled?: boolean
          id?: string
          module_name?: string
          updated_at?: string
          usage_limits?: Json | null
        }
        Relationships: []
      }
      module_usage_stats: {
        Row: {
          active_users: number
          company_id: string
          company_type: string
          created_at: string
          date_recorded: string
          id: string
          module_name: string
          operations_count: number
          performance_metrics: Json | null
          usage_count: number
        }
        Insert: {
          active_users?: number
          company_id: string
          company_type: string
          created_at?: string
          date_recorded?: string
          id?: string
          module_name: string
          operations_count?: number
          performance_metrics?: Json | null
          usage_count?: number
        }
        Update: {
          active_users?: number
          company_id?: string
          company_type?: string
          created_at?: string
          date_recorded?: string
          id?: string
          module_name?: string
          operations_count?: number
          performance_metrics?: Json | null
          usage_count?: number
        }
        Relationships: []
      }
      multix: {
        Row: {
          codigo: string
          created_at: string | null
          estado: string | null
          estado_puerto: string | null
          fecha: string
          firmado: boolean | null
          hora_inicio: string | null
          hora_termino: string | null
          id: string
          lugar_trabajo: string | null
          matricula_nave: string | null
          multix_data: Json | null
          nave_maniobras: string | null
          operacion_id: string | null
          profundidad_max: number | null
          progreso: number | null
          team_be: string | null
          team_bi: string | null
          team_s: string | null
          temperatura: number | null
          tipo_formulario: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          codigo: string
          created_at?: string | null
          estado?: string | null
          estado_puerto?: string | null
          fecha: string
          firmado?: boolean | null
          hora_inicio?: string | null
          hora_termino?: string | null
          id?: string
          lugar_trabajo?: string | null
          matricula_nave?: string | null
          multix_data?: Json | null
          nave_maniobras?: string | null
          operacion_id?: string | null
          profundidad_max?: number | null
          progreso?: number | null
          team_be?: string | null
          team_bi?: string | null
          team_s?: string | null
          temperatura?: number | null
          tipo_formulario: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          codigo?: string
          created_at?: string | null
          estado?: string | null
          estado_puerto?: string | null
          fecha?: string
          firmado?: boolean | null
          hora_inicio?: string | null
          hora_termino?: string | null
          id?: string
          lugar_trabajo?: string | null
          matricula_nave?: string | null
          multix_data?: Json | null
          nave_maniobras?: string | null
          operacion_id?: string | null
          profundidad_max?: number | null
          progreso?: number | null
          team_be?: string | null
          team_bi?: string | null
          team_s?: string | null
          temperatura?: number | null
          tipo_formulario?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "multix_operacion_id_fkey"
            columns: ["operacion_id"]
            isOneToOne: false
            referencedRelation: "operacion"
            referencedColumns: ["id"]
          },
        ]
      }
      multix_dotacion: {
        Row: {
          apellido: string | null
          contratista: boolean | null
          created_at: string | null
          equipo: string | null
          hora_fin_buzo: string | null
          hora_inicio_buzo: string | null
          id: string
          matricula: string | null
          multix_id: string | null
          nombre: string | null
          orden: number | null
          profundidad: number | null
          rol: string
        }
        Insert: {
          apellido?: string | null
          contratista?: boolean | null
          created_at?: string | null
          equipo?: string | null
          hora_fin_buzo?: string | null
          hora_inicio_buzo?: string | null
          id?: string
          matricula?: string | null
          multix_id?: string | null
          nombre?: string | null
          orden?: number | null
          profundidad?: number | null
          rol: string
        }
        Update: {
          apellido?: string | null
          contratista?: boolean | null
          created_at?: string | null
          equipo?: string | null
          hora_fin_buzo?: string | null
          hora_inicio_buzo?: string | null
          id?: string
          matricula?: string | null
          multix_id?: string | null
          nombre?: string | null
          orden?: number | null
          profundidad?: number | null
          rol?: string
        }
        Relationships: [
          {
            foreignKeyName: "multix_dotacion_multix_id_fkey"
            columns: ["multix_id"]
            isOneToOne: false
            referencedRelation: "multix"
            referencedColumns: ["id"]
          },
        ]
      }
      multix_equipos_superficie: {
        Row: {
          created_at: string | null
          equipo_sup: string | null
          horometro_fin: number | null
          horometro_ini: number | null
          id: string
          matricula_eq: string | null
          multix_id: string | null
          orden: number | null
        }
        Insert: {
          created_at?: string | null
          equipo_sup?: string | null
          horometro_fin?: number | null
          horometro_ini?: number | null
          id?: string
          matricula_eq?: string | null
          multix_id?: string | null
          orden?: number | null
        }
        Update: {
          created_at?: string | null
          equipo_sup?: string | null
          horometro_fin?: number | null
          horometro_ini?: number | null
          id?: string
          matricula_eq?: string | null
          multix_id?: string | null
          orden?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "multix_equipos_superficie_multix_id_fkey"
            columns: ["multix_id"]
            isOneToOne: false
            referencedRelation: "multix"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_subscriptions: {
        Row: {
          channel: string
          created_at: string
          enabled: boolean
          event_type: string
          id: string
          user_id: string
        }
        Insert: {
          channel: string
          created_at?: string
          enabled?: boolean
          event_type: string
          id?: string
          user_id: string
        }
        Update: {
          channel?: string
          created_at?: string
          enabled?: boolean
          event_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          message: string
          metadata: Json | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      operacion: {
        Row: {
          centro_id: string | null
          codigo: string
          company_id: string | null
          company_type: string | null
          contratista_id: string | null
          created_at: string
          estado: string
          estado_aprobacion: string | null
          fecha_fin: string | null
          fecha_inicio: string
          id: string
          nombre: string
          salmonera_id: string | null
          servicio_id: string | null
          supervisor_asignado_id: string | null
          tareas: string | null
          updated_at: string
        }
        Insert: {
          centro_id?: string | null
          codigo: string
          company_id?: string | null
          company_type?: string | null
          contratista_id?: string | null
          created_at?: string
          estado?: string
          estado_aprobacion?: string | null
          fecha_fin?: string | null
          fecha_inicio: string
          id?: string
          nombre: string
          salmonera_id?: string | null
          servicio_id?: string | null
          supervisor_asignado_id?: string | null
          tareas?: string | null
          updated_at?: string
        }
        Update: {
          centro_id?: string | null
          codigo?: string
          company_id?: string | null
          company_type?: string | null
          contratista_id?: string | null
          created_at?: string
          estado?: string
          estado_aprobacion?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string
          id?: string
          nombre?: string
          salmonera_id?: string | null
          servicio_id?: string | null
          supervisor_asignado_id?: string | null
          tareas?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_operacion_contratista"
            columns: ["contratista_id"]
            isOneToOne: false
            referencedRelation: "contratistas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_operacion_salmonera"
            columns: ["salmonera_id"]
            isOneToOne: false
            referencedRelation: "salmoneras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_operacion_sitio"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operacion_supervisor_asignado_id_fkey"
            columns: ["supervisor_asignado_id"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      operacion_context: {
        Row: {
          created_at: string
          empresa_destino_id: string | null
          empresa_destino_tipo: string | null
          empresa_origen_id: string
          empresa_origen_tipo: string
          estado_planificacion: string | null
          id: string
          metadatos: Json | null
          operacion_id: string
          requiere_anexo_bravo: boolean
          requiere_documentos: boolean
          requiere_hpt: boolean
          tipo_contexto: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          empresa_destino_id?: string | null
          empresa_destino_tipo?: string | null
          empresa_origen_id: string
          empresa_origen_tipo: string
          estado_planificacion?: string | null
          id?: string
          metadatos?: Json | null
          operacion_id: string
          requiere_anexo_bravo?: boolean
          requiere_documentos?: boolean
          requiere_hpt?: boolean
          tipo_contexto: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          empresa_destino_id?: string | null
          empresa_destino_tipo?: string | null
          empresa_origen_id?: string
          empresa_origen_tipo?: string
          estado_planificacion?: string | null
          id?: string
          metadatos?: Json | null
          operacion_id?: string
          requiere_anexo_bravo?: boolean
          requiere_documentos?: boolean
          requiere_hpt?: boolean
          tipo_contexto?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operacion_context_operacion_id_fkey"
            columns: ["operacion_id"]
            isOneToOne: true
            referencedRelation: "operacion"
            referencedColumns: ["id"]
          },
        ]
      }
      operational_contexts: {
        Row: {
          active_modules: string[]
          allows_direct_operations: boolean
          company_id: string
          company_type: string
          configuration: Json
          context_type: string
          created_at: string
          id: string
          requires_documents: boolean
          requires_planning: boolean
          updated_at: string
        }
        Insert: {
          active_modules?: string[]
          allows_direct_operations?: boolean
          company_id: string
          company_type: string
          configuration?: Json
          context_type?: string
          created_at?: string
          id?: string
          requires_documents?: boolean
          requires_planning?: boolean
          updated_at?: string
        }
        Update: {
          active_modules?: string[]
          allows_direct_operations?: boolean
          company_id?: string
          company_type?: string
          configuration?: Json
          context_type?: string
          created_at?: string
          id?: string
          requires_documents?: boolean
          requires_planning?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      operational_forms: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          form_data: Json
          form_type: string
          id: string
          inmersion_id: string
          module_name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          form_data?: Json
          form_type: string
          id?: string
          inmersion_id: string
          module_name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          form_data?: Json
          form_type?: string
          id?: string
          inmersion_id?: string
          module_name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operational_forms_inmersion_id_fkey"
            columns: ["inmersion_id"]
            isOneToOne: false
            referencedRelation: "inmersion"
            referencedColumns: ["inmersion_id"]
          },
          {
            foreignKeyName: "operational_forms_module_name_fkey"
            columns: ["module_name"]
            isOneToOne: false
            referencedRelation: "system_modules"
            referencedColumns: ["name"]
          },
        ]
      }
      salmonera_contratista: {
        Row: {
          contratista_id: string | null
          created_at: string
          estado: string
          fecha_asociacion: string
          id: string
          salmonera_id: string | null
          updated_at: string
        }
        Insert: {
          contratista_id?: string | null
          created_at?: string
          estado?: string
          fecha_asociacion?: string
          id?: string
          salmonera_id?: string | null
          updated_at?: string
        }
        Update: {
          contratista_id?: string | null
          created_at?: string
          estado?: string
          fecha_asociacion?: string
          id?: string
          salmonera_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "salmonera_contratista_contratista_id_fkey"
            columns: ["contratista_id"]
            isOneToOne: false
            referencedRelation: "contratistas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salmonera_contratista_salmonera_id_fkey"
            columns: ["salmonera_id"]
            isOneToOne: false
            referencedRelation: "salmoneras"
            referencedColumns: ["id"]
          },
        ]
      }
      salmoneras: {
        Row: {
          created_at: string
          direccion: string
          email: string | null
          estado: string
          id: string
          nombre: string
          rut: string
          sitios_activos: number | null
          telefono: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          direccion: string
          email?: string | null
          estado?: string
          id?: string
          nombre: string
          rut: string
          sitios_activos?: number | null
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          direccion?: string
          email?: string | null
          estado?: string
          id?: string
          nombre?: string
          rut?: string
          sitios_activos?: number | null
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      security_alert_rules: {
        Row: {
          config: Json
          created_at: string
          description: string | null
          enabled: boolean
          escalation_policy: Json
          id: string
          is_template: boolean
          message_template: string
          name: string
          notification_channels: string[]
          priority: string
          scope_id: string | null
          scope_type: string | null
          target_roles: string[]
          type: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          description?: string | null
          enabled?: boolean
          escalation_policy?: Json
          id?: string
          is_template?: boolean
          message_template: string
          name: string
          notification_channels?: string[]
          priority?: string
          scope_id?: string | null
          scope_type?: string | null
          target_roles?: string[]
          type: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          description?: string | null
          enabled?: boolean
          escalation_policy?: Json
          id?: string
          is_template?: boolean
          message_template?: string
          name?: string
          notification_channels?: string[]
          priority?: string
          scope_id?: string | null
          scope_type?: string | null
          target_roles?: string[]
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      security_alerts: {
        Row: {
          acknowledged: boolean
          acknowledged_at: string | null
          acknowledged_by: string | null
          created_at: string
          details: Json | null
          escalation_level: number
          id: string
          inmersion_id: string
          last_escalated_at: string | null
          priority: string
          rule_id: string | null
          type: string
        }
        Insert: {
          acknowledged?: boolean
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          created_at?: string
          details?: Json | null
          escalation_level?: number
          id?: string
          inmersion_id: string
          last_escalated_at?: string | null
          priority: string
          rule_id?: string | null
          type: string
        }
        Update: {
          acknowledged?: boolean
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          created_at?: string
          details?: Json | null
          escalation_level?: number
          id?: string
          inmersion_id?: string
          last_escalated_at?: string | null
          priority?: string
          rule_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "security_alerts_acknowledged_by_fkey"
            columns: ["acknowledged_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["usuario_id"]
          },
          {
            foreignKeyName: "security_alerts_inmersion_id_fkey"
            columns: ["inmersion_id"]
            isOneToOne: false
            referencedRelation: "inmersion"
            referencedColumns: ["inmersion_id"]
          },
          {
            foreignKeyName: "security_alerts_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "security_alert_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      system_alerts: {
        Row: {
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          source: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          source: string
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          source?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          id: string
          metadata: Json | null
          metric_name: string
          recorded_at: string | null
          threshold_critical: number | null
          threshold_warning: number | null
          unit: string
          value: number
        }
        Insert: {
          id?: string
          metadata?: Json | null
          metric_name: string
          recorded_at?: string | null
          threshold_critical?: number | null
          threshold_warning?: number | null
          unit: string
          value: number
        }
        Update: {
          id?: string
          metadata?: Json | null
          metric_name?: string
          recorded_at?: string | null
          threshold_critical?: number | null
          threshold_warning?: number | null
          unit?: string
          value?: number
        }
        Relationships: []
      }
      system_modules: {
        Row: {
          category: string
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          display_name: string
          id: string
          is_core: boolean | null
          name: string
          updated_at: string | null
          version: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          display_name: string
          id?: string
          is_core?: boolean | null
          name: string
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          display_name?: string
          id?: string
          is_core?: boolean | null
          name?: string
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      usuario: {
        Row: {
          apellido: string
          created_at: string
          email: string | null
          estado_buzo: string | null
          nombre: string
          perfil_buzo: Json | null
          perfil_completado: boolean | null
          rol: string
          salmonera_id: string | null
          servicio_id: string | null
          updated_at: string
          usuario_id: string
        }
        Insert: {
          apellido: string
          created_at?: string
          email?: string | null
          estado_buzo?: string | null
          nombre: string
          perfil_buzo?: Json | null
          perfil_completado?: boolean | null
          rol?: string
          salmonera_id?: string | null
          servicio_id?: string | null
          updated_at?: string
          usuario_id: string
        }
        Update: {
          apellido?: string
          created_at?: string
          email?: string | null
          estado_buzo?: string | null
          nombre?: string
          perfil_buzo?: Json | null
          perfil_completado?: boolean | null
          rol?: string
          salmonera_id?: string | null
          servicio_id?: string | null
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuario_salmonera_id_fkey"
            columns: ["salmonera_id"]
            isOneToOne: false
            referencedRelation: "salmoneras"
            referencedColumns: ["id"]
          },
        ]
      }
      usuario_actividad: {
        Row: {
          accion: string
          created_at: string
          detalle: string | null
          entidad_id: string | null
          entidad_tipo: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          usuario_id: string | null
        }
        Insert: {
          accion: string
          created_at?: string
          detalle?: string | null
          entidad_id?: string | null
          entidad_tipo?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          usuario_id?: string | null
        }
        Update: {
          accion?: string
          created_at?: string
          detalle?: string | null
          entidad_id?: string | null
          entidad_tipo?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuario_actividad_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      usuario_invitaciones: {
        Row: {
          apellido: string | null
          created_at: string
          email: string
          empresa_id: string | null
          estado: string
          fecha_expiracion: string
          fecha_invitacion: string
          id: string
          invitado_por: string | null
          nombre: string | null
          rol: string
          tipo_empresa: string | null
          token: string
          updated_at: string
        }
        Insert: {
          apellido?: string | null
          created_at?: string
          email: string
          empresa_id?: string | null
          estado?: string
          fecha_expiracion?: string
          fecha_invitacion?: string
          id?: string
          invitado_por?: string | null
          nombre?: string | null
          rol: string
          tipo_empresa?: string | null
          token: string
          updated_at?: string
        }
        Update: {
          apellido?: string | null
          created_at?: string
          email?: string
          empresa_id?: string | null
          estado?: string
          fecha_expiracion?: string
          fecha_invitacion?: string
          id?: string
          invitado_por?: string | null
          nombre?: string | null
          rol?: string
          tipo_empresa?: string | null
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuario_invitaciones_invitado_por_fkey"
            columns: ["invitado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["usuario_id"]
          },
        ]
      }
      webhooks: {
        Row: {
          active: boolean
          created_at: string
          error_count: number
          events: string[]
          id: string
          last_triggered: string | null
          name: string
          secret_token: string
          success_count: number
          updated_at: string
          url: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          error_count?: number
          events?: string[]
          id?: string
          last_triggered?: string | null
          name: string
          secret_token: string
          success_count?: number
          updated_at?: string
          url: string
        }
        Update: {
          active?: boolean
          created_at?: string
          error_count?: number
          events?: string[]
          id?: string
          last_triggered?: string | null
          name?: string
          secret_token?: string
          success_count?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_estimated_end_time: {
        Args: {
          start_date: string
          start_time: string
          planned_bottom_time: number
        }
        Returns: string
      }
      can_access_company: {
        Args: { target_company_id: string; target_company_type: string }
        Returns: boolean
      }
      check_valid_invitation: {
        Args: { user_email: string }
        Returns: boolean
      }
      create_user_profile: {
        Args: {
          user_id: string
          user_email: string
          user_nombre: string
          user_apellido: string
          user_rol?: string
          user_salmonera_id?: string
          user_servicio_id?: string
        }
        Returns: undefined
      }
      create_workflow_notification: {
        Args: {
          p_user_id: string
          p_type: string
          p_title: string
          p_message: string
          p_metadata?: Json
        }
        Returns: string
      }
      emit_domain_event: {
        Args: {
          p_event_type: string
          p_aggregate_id: string
          p_aggregate_type: string
          p_event_data?: Json
        }
        Returns: string
      }
      get_company_active_modules: {
        Args: { p_company_id: string; p_company_type: string }
        Returns: {
          module_name: string
          display_name: string
          description: string
          category: string
          configuration: Json
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_salmonera: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_salmonera_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_servicio: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_servicio_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_immersion_stats: {
        Args: { p_start_date: string; p_end_date: string }
        Returns: Json
      }
      get_module_stats: {
        Args: {
          p_company_id: string
          p_company_type: string
          p_start_date?: string
          p_end_date?: string
        }
        Returns: Json
      }
      get_operacion_full_context: {
        Args: { p_operacion_id: string }
        Returns: Json
      }
      get_security_alert_stats: {
        Args: { p_start_date: string; p_end_date: string }
        Returns: Json
      }
      get_user_company_context: {
        Args: Record<PropertyKey, never>
        Returns: {
          company_id: string
          company_type: string
          is_superuser: boolean
        }[]
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_module_access: {
        Args: {
          p_company_id: string
          p_company_type: string
          p_module_name: string
        }
        Returns: boolean
      }
      is_super: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      jwt_salmonera: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      jwt_servicio: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      validate_cuadrilla_availability: {
        Args: {
          p_cuadrilla_id: string
          p_fecha_inmersion: string
          p_inmersion_id?: string
        }
        Returns: {
          is_available: boolean
          conflicting_inmersion_id: string
          conflicting_inmersion_codigo: string
        }[]
      }
      validate_rut: {
        Args: { rut_input: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
