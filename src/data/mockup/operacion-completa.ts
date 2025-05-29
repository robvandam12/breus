
// Mockup data para una operación completa con todo el flujo
export const operacionCompletaMockup = {
  // 1. OPERACIÓN BASE
  operacion: {
    id: "op-001-2024",
    codigo: "OP-SER-001-2024",
    nombre: "Inspección y Mantenimiento Jaulas Sector Norte",
    sitio_id: "sitio-norte-001",
    servicio_id: "servicio-001",
    salmonera_id: "salmonera-001",
    contratista_id: "contratista-001",
    fecha_inicio: "2024-12-28",
    fecha_fin: "2024-12-30",
    tareas: "Inspección estructural de jaulas, limpieza de redes, mantenimiento preventivo de sistemas de anclaje",
    estado: "activa",
    equipo_buceo_id: "equipo-001",
    created_at: "2024-12-27T09:00:00Z",
    updated_at: "2024-12-27T10:30:00Z",
    salmoneras: { nombre: "Salmonera Austral S.A." },
    sitios: { nombre: "Centro Norte Chiloé" },
    contratistas: { nombre: "Servicios Subacuáticos del Sur Ltda." }
  },

  // 2. EQUIPO DE BUCEO
  equipoBuceo: {
    id: "equipo-001",
    nombre: "Equipo Alpha - Inspección",
    descripcion: "Equipo especializado en inspección y mantenimiento de estructuras acuícolas",
    empresa_id: "contratista-001",
    tipo_empresa: "contratista",
    activo: true,
    created_at: "2024-12-20T10:00:00Z",
    updated_at: "2024-12-27T08:00:00Z",
    miembros: [
      {
        id: "miembro-001",
        equipo_id: "equipo-001",
        usuario_id: "user-supervisor-001",
        rol_equipo: "supervisor",
        disponible: true,
        usuario: {
          nombre: "Carlos",
          apellido: "Rodríguez",
          email: "carlos.rodriguez@serviciosur.cl",
          rol: "supervisor"
        }
      },
      {
        id: "miembro-002",
        equipo_id: "equipo-001",
        usuario_id: "user-buzo-001",
        rol_equipo: "buzo_principal",
        disponible: true,
        usuario: {
          nombre: "Juan",
          apellido: "Pérez",
          email: "juan.perez@serviciosur.cl",
          rol: "buzo"
        }
      },
      {
        id: "miembro-003",
        equipo_id: "equipo-001",
        usuario_id: "user-buzo-002",
        rol_equipo: "buzo_asistente",
        disponible: true,
        usuario: {
          nombre: "Pedro",
          apellido: "González",
          email: "pedro.gonzalez@serviciosur.cl",
          rol: "buzo"
        }
      },
      {
        id: "miembro-004",
        equipo_id: "equipo-001",
        usuario_id: "user-buzo-003",
        rol_equipo: "buzo_asistente",
        disponible: true,
        usuario: {
          nombre: "Miguel",
          apellido: "Torres",
          email: "miguel.torres@serviciosur.cl",
          rol: "buzo"
        }
      },
      {
        id: "miembro-005",
        equipo_id: "equipo-001",
        usuario_id: "user-buzo-004",
        rol_equipo: "buzo_asistente",
        disponible: true,
        usuario: {
          nombre: "Roberto",
          apellido: "Silva",
          email: "roberto.silva@serviciosur.cl",
          rol: "buzo"
        }
      }
    ]
  },

  // 3. HPT (HOJA DE PLANIFICACIÓN DE TAREAS)
  hpt: {
    id: "hpt-001",
    codigo: "HPT-OP-001-2024",
    supervisor: "Carlos Rodríguez",
    plan_trabajo: "Inspección visual y táctil de estructuras, limpieza preventiva, documentación fotográfica",
    operacion_id: "op-001-2024",
    fecha_programada: "2024-12-28",
    hora_inicio: "08:00:00",
    hora_fin: "16:00:00",
    descripcion_trabajo: "Inspección completa del sistema de jaulas incluyendo verificación de integridad estructural y sistemas de anclaje",
    profundidad_maxima: 25,
    temperatura: 12,
    observaciones: "Condiciones meteorológicas favorables. Mar calmo con viento sur 5-10 nudos",
    firmado: true,
    estado: "firmado",
    progreso: 100,
    user_id: "user-supervisor-001",
    created_at: "2024-12-27T10:00:00Z",
    updated_at: "2024-12-27T14:30:00Z",
    folio: "HPT-2024-001",
    fecha: "2024-12-28",
    hora_termino: "16:00:00",
    empresa_servicio_nombre: "Servicios Subacuáticos del Sur Ltda.",
    supervisor_nombre: "Carlos Rodríguez Mendoza",
    centro_trabajo_nombre: "Centro Norte Chiloé",
    jefe_mandante_nombre: "Ana María Contreras",
    descripcion_tarea: "Inspección estructural preventiva según protocolo SERNAPESCA",
    es_rutinaria: true,
    lugar_especifico: "Jaulas 1-8 Sector Norte",
    estado_puerto: "Operativo",
    hpt_epp: {
      traje_buceo: true,
      mascara_completa: true,
      regulador_principal: true,
      regulador_emergencia: true,
      chaleco_compensador: true,
      lastre: true,
      cuchillo_buceo: true,
      linterna_principal: true,
      linterna_backup: true
    },
    hpt_erc: {
      protocolo_emergencia: true,
      comunicacion_superficie: true,
      botiquin_primeros_auxilios: true,
      oxigeno_emergencia: true,
      plan_evacuacion: true,
      contacto_hospital: true,
      contacto_camara_hiperbarica: true
    },
    hpt_medidas: {
      verificacion_equipos: true,
      planificacion_inmersion: true,
      comunicacion_continua: true,
      sistema_buddy: true,
      ascenso_controlado: true,
      paradas_descompresion: true
    },
    hpt_firmas: {
      supervisor_servicio: {
        nombre: "Carlos Rodríguez",
        firma: "data:image/png;base64,iVBORw0KGgoAAAANS...",
        timestamp: "2024-12-27T14:30:00Z"
      },
      supervisor_mandante: {
        nombre: "Ana María Contreras",
        firma: "data:image/png;base64,iVBORw0KGgoAAAANS...",
        timestamp: "2024-12-27T14:35:00Z"
      }
    }
  },

  // 4. ANEXO BRAVO
  anexoBravo: {
    id: "anexo-001",
    codigo: "AB-OP-001-2024",
    operacion_id: "op-001-2024",
    fecha: "2024-12-28",
    lugar_faena: "Centro Norte Chiloé - Sector Jaulas",
    empresa_nombre: "Servicios Subacuáticos del Sur Ltda.",
    supervisor_servicio_nombre: "Carlos Rodríguez",
    supervisor_mandante_nombre: "Ana María Contreras",
    buzo_o_empresa_nombre: "Servicios Subacuáticos del Sur Ltda.",
    supervisor: "Carlos Rodríguez",
    estado: "firmado",
    firmado: true,
    progreso: 100,
    created_at: "2024-12-27T11:00:00Z",
    updated_at: "2024-12-27T15:00:00Z",
    autorizacion_armada: true,
    bitacora_fecha: "2024-12-28",
    bitacora_hora_inicio: "08:00:00",
    bitacora_hora_termino: "16:00:00",
    bitacora_relator: "Carlos Rodríguez",
    anexo_bravo_checklist: {
      equipos_buceo_verificados: true,
      comunicaciones_testeadas: true,
      procedimientos_emergencia_revisados: true,
      personal_capacitado: true,
      condiciones_ambientales_evaluadas: true,
      autorizaciones_vigentes: true
    },
    anexo_bravo_trabajadores: [
      {
        nombre: "Carlos Rodríguez",
        rut: "12.345.678-9",
        funcion: "Supervisor"
      },
      {
        nombre: "Juan Pérez",
        rut: "98.765.432-1",
        funcion: "Buzo Principal"
      },
      {
        nombre: "Pedro González",
        rut: "11.222.333-4",
        funcion: "Buzo Asistente"
      },
      {
        nombre: "Miguel Torres",
        rut: "44.555.666-7",
        funcion: "Buzo Asistente"
      },
      {
        nombre: "Roberto Silva",
        rut: "77.888.999-0",
        funcion: "Buzo Asistente"
      }
    ],
    anexo_bravo_firmas: {
      supervisor_servicio: {
        nombre: "Carlos Rodríguez",
        firma: "data:image/png;base64,iVBORw0KGgoAAAANS...",
        timestamp: "2024-12-27T15:00:00Z"
      },
      supervisor_mandante: {
        nombre: "Ana María Contreras",
        firma: "data:image/png;base64,iVBORw0KGgoAAAANS...",
        timestamp: "2024-12-27T15:05:00Z"
      },
      jefe_centro: {
        nombre: "Luis Hernández",
        firma: "data:image/png;base64,iVBORw0KGgoAAAANS...",
        timestamp: "2024-12-27T15:10:00Z"
      }
    },
    observaciones_generales: "Condiciones óptimas para la operación. Personal certificado y equipos en perfecto estado.",
    jefe_centro_nombre: "Luis Hernández"
  },

  // 5. INMERSIONES
  inmersiones: [
    {
      inmersion_id: "imm-001",
      codigo: "IMM-001-2024",
      fecha_inmersion: "2024-12-28",
      hora_inicio: "09:00:00",
      hora_fin: "10:30:00",
      operacion_id: "op-001-2024",
      buzo_principal: "Juan Pérez",
      buzo_principal_id: "user-buzo-001",
      buzo_asistente: "Pedro González",
      buzo_asistente_id: "user-buzo-002",
      supervisor: "Carlos Rodríguez",
      supervisor_id: "user-supervisor-001",
      objetivo: "Inspección jaulas 1-2 sector norte",
      estado: "completada",
      profundidad_max: 22,
      temperatura_agua: 12,
      visibilidad: 8,
      corriente: "débil",
      observaciones: "Inspección completada sin incidentes. Estructuras en buen estado.",
      hpt_validado: true,
      anexo_bravo_validado: true,
      created_at: "2024-12-28T09:00:00Z",
      updated_at: "2024-12-28T10:30:00Z"
    },
    {
      inmersion_id: "imm-002",
      codigo: "IMM-002-2024",
      fecha_inmersion: "2024-12-28",
      hora_inicio: "11:00:00",
      hora_fin: "12:30:00",
      operacion_id: "op-001-2024",
      buzo_principal: "Miguel Torres",
      buzo_principal_id: "user-buzo-003",
      buzo_asistente: "Roberto Silva",
      buzo_asistente_id: "user-buzo-004",
      supervisor: "Carlos Rodríguez",
      supervisor_id: "user-supervisor-001",
      objetivo: "Inspección jaulas 3-4 sector norte",
      estado: "completada",
      profundidad_max: 24,
      temperatura_agua: 12,
      visibilidad: 7,
      corriente: "moderada",
      observaciones: "Detectado desgaste menor en red jaula 4. Requiere mantenimiento preventivo.",
      hpt_validado: true,
      anexo_bravo_validado: true,
      created_at: "2024-12-28T11:00:00Z",
      updated_at: "2024-12-28T12:30:00Z"
    },
    {
      inmersion_id: "imm-003",
      codigo: "IMM-003-2024",
      fecha_inmersion: "2024-12-28",
      hora_inicio: "14:00:00",
      hora_fin: "15:30:00",
      operacion_id: "op-001-2024",
      buzo_principal: "Juan Pérez",
      buzo_principal_id: "user-buzo-001",
      buzo_asistente: "Miguel Torres",
      buzo_asistente_id: "user-buzo-003",
      supervisor: "Carlos Rodríguez",
      supervisor_id: "user-supervisor-001",
      objetivo: "Inspección jaulas 5-6 sector norte",
      estado: "completada",
      profundidad_max: 25,
      temperatura_agua: 11,
      visibilidad: 6,
      corriente: "moderada",
      observaciones: "Inspección completada. Sistemas de anclaje en perfecto estado.",
      hpt_validado: true,
      anexo_bravo_validado: true,
      created_at: "2024-12-28T14:00:00Z",
      updated_at: "2024-12-28T15:30:00Z"
    },
    {
      inmersion_id: "imm-004",
      codigo: "IMM-004-2024",
      fecha_inmersion: "2024-12-29",
      hora_inicio: "09:30:00",
      hora_fin: "11:00:00",
      operacion_id: "op-001-2024",
      buzo_principal: "Pedro González",
      buzo_principal_id: "user-buzo-002",
      buzo_asistente: "Roberto Silva",
      buzo_asistente_id: "user-buzo-004",
      supervisor: "Carlos Rodríguez",
      supervisor_id: "user-supervisor-001",
      objetivo: "Inspección jaulas 7-8 sector norte",
      estado: "completada",
      profundidad_max: 23,
      temperatura_agua: 11,
      visibilidad: 8,
      corriente: "débil",
      observaciones: "Completada inspección final. Documentación fotográfica realizada.",
      hpt_validado: true,
      anexo_bravo_validado: true,
      created_at: "2024-12-29T09:30:00Z",
      updated_at: "2024-12-29T11:00:00Z"
    }
  ],

  // 6. BITÁCORAS DE SUPERVISOR
  bitacorasSupervisor: [
    {
      id: "bits-001",
      bitacora_id: "bits-001",
      inmersion_id: "imm-001",
      supervisor: "Carlos Rodríguez",
      desarrollo_inmersion: "Inmersión realizada según protocolo establecido. Buzos descendieron a profundidad de trabajo (22m) sin inconvenientes. Comunicación constante mantenida durante toda la operación. Inspección visual y táctil de estructuras completada exitosamente.",
      incidentes: "Sin incidentes reportados",
      evaluacion_general: "Operación exitosa. Objetivos cumplidos al 100%. Condiciones ambientales favorables durante toda la inmersión.",
      fecha: "2024-12-28",
      firmado: true,
      codigo: "BS-001-2024",
      created_at: "2024-12-28T10:45:00Z",
      updated_at: "2024-12-28T11:00:00Z",
      supervisor_firma: "data:image/png;base64,iVBORw0KGgoAAAANS...",
      estado: "firmado"
    },
    {
      id: "bits-002",
      bitacora_id: "bits-002",
      inmersion_id: "imm-002",
      supervisor: "Carlos Rodríguez",
      desarrollo_inmersion: "Segunda inmersión del día ejecutada según planificación. Buzos Miguel Torres y Roberto Silva realizaron inspección detallada de jaulas 3-4. Se detectó desgaste menor en red de jaula 4 que será reportado para mantenimiento posterior.",
      incidentes: "Desgaste menor detectado en red jaula 4. No representa riesgo inmediato pero requiere seguimiento.",
      evaluacion_general: "Inmersión completada satisfactoriamente. Hallazgo de mantenimiento preventivo documentado apropiadamente.",
      fecha: "2024-12-28",
      firmado: true,
      codigo: "BS-002-2024",
      created_at: "2024-12-28T12:45:00Z",
      updated_at: "2024-12-28T13:00:00Z",
      supervisor_firma: "data:image/png;base64,iVBORw0KGgoAAAANS...",
      estado: "firmado"
    },
    {
      id: "bits-003",
      bitacora_id: "bits-003",
      inmersion_id: "imm-003",
      supervisor: "Carlos Rodríguez",
      desarrollo_inmersion: "Tercera inmersión programada ejecutada en horario vespertino. Equipo Juan Pérez - Miguel Torres completó inspección de jaulas 5-6. Condiciones de corriente moderada manejadas apropiadamente por el equipo.",
      incidentes: "Sin incidentes",
      evaluacion_general: "Operación desarrollada según estándares de seguridad. Sistemas de anclaje verificados en perfecto estado.",
      fecha: "2024-12-28",
      firmado: true,
      codigo: "BS-003-2024",
      created_at: "2024-12-28T15:45:00Z",
      updated_at: "2024-12-28T16:00:00Z",
      supervisor_firma: "data:image/png;base64,iVBORw0KGgoAAAANS...",
      estado: "firmado"
    },
    {
      id: "bits-004",
      bitacora_id: "bits-004",
      inmersion_id: "imm-004",
      supervisor: "Carlos Rodríguez",
      desarrollo_inmersion: "Inmersión final de la operación completada exitosamente. Pedro González y Roberto Silva finalizaron inspección de jaulas 7-8. Documentación fotográfica subacuática realizada para registro de estado de estructuras.",
      incidentes: "Sin incidentes reportados",
      evaluacion_general: "Operación global completada al 100%. Todos los objetivos cumplidos. Documentación técnica completa.",
      fecha: "2024-12-29",
      firmado: true,
      codigo: "BS-004-2024",
      created_at: "2024-12-29T11:15:00Z",
      updated_at: "2024-12-29T11:30:00Z",
      supervisor_firma: "data:image/png;base64,iVBORw0KGgoAAAANS...",
      estado: "firmado"
    }
  ],

  // 7. BITÁCORAS DE BUZOS
  bitacorasBuzo: [
    // Bitácoras para Inmersión 1
    {
      id: "bitb-001",
      bitacora_id: "bitb-001",
      inmersion_id: "imm-001",
      buzo: "Juan Pérez",
      trabajos_realizados: "Inspección visual y táctil de estructura jaula 1: verificación de integridad de malla, sistemas de anclaje y flotadores. Inspección jaula 2: revisión completa de sistema estructural y documentación fotográfica de puntos críticos.",
      observaciones_tecnicas: "Visibilidad buena (8m), corriente débil favorable para trabajo. Estructuras en excelente estado general. No se detectaron daños o desgastes significativos.",
      estado_fisico_post: "Normal - sin fatiga ni molestias",
      profundidad_maxima: 22,
      fecha: "2024-12-28",
      firmado: true,
      codigo: "BB-001-2024",
      created_at: "2024-12-28T10:35:00Z",
      updated_at: "2024-12-28T10:50:00Z",
      buzo_firma: "data:image/png;base64,iVBORw0KGgoAAAANS..."
    },
    {
      id: "bitb-002",
      bitacora_id: "bitb-002",
      inmersion_id: "imm-001",
      buzo: "Pedro González",
      trabajos_realizados: "Asistencia en inspección de jaulas 1-2. Apoyo en documentación fotográfica y verificación de puntos de anclaje secundarios. Monitoreo continuo de condiciones ambientales durante la inmersión.",
      observaciones_tecnicas: "Condiciones de trabajo óptimas. Buena coordinación con buzo principal. Sistemas de comunicación funcionando perfectamente.",
      estado_fisico_post: "Excelente estado físico post-inmersión",
      profundidad_maxima: 22,
      fecha: "2024-12-28",
      firmado: true,
      codigo: "BB-002-2024",
      created_at: "2024-12-28T10:35:00Z",
      updated_at: "2024-12-28T10:50:00Z",
      buzo_firma: "data:image/png;base64,iVBORw0KGgoAAAANS..."
    },
    // Bitácoras para Inmersión 2
    {
      id: "bitb-003",
      bitacora_id: "bitb-003",
      inmersion_id: "imm-002",
      buzo: "Miguel Torres",
      trabajos_realizados: "Inspección detallada jaula 3: verificación completa sin hallazgos. Jaula 4: detectado desgaste menor en sector noreste de la malla (aproximadamente 2m²), documentado fotográficamente para reporte de mantenimiento.",
      observaciones_tecnicas: "Corriente moderada manejable. Visibilidad ligeramente reducida (7m) pero suficiente para trabajo detallado. Desgaste en jaula 4 no compromete integridad estructural inmediata.",
      estado_fisico_post: "Buen estado general, leve fatiga normal",
      profundidad_maxima: 24,
      fecha: "2024-12-28",
      firmado: true,
      codigo: "BB-003-2024",
      created_at: "2024-12-28T12:35:00Z",
      updated_at: "2024-12-28T12:50:00Z",
      buzo_firma: "data:image/png;base64,iVBORw0KGgoAAAANS..."
    },
    {
      id: "bitb-004",
      bitacora_id: "bitb-004",
      inmersion_id: "imm-002",
      buzo: "Roberto Silva",
      trabajos_realizados: "Apoyo en inspección jaulas 3-4. Verificación de sistemas de anclaje y flotación. Asistencia en documentación del desgaste detectado en jaula 4. Medición aproximada del área afectada.",
      observaciones_tecnicas: "Trabajo en equipo eficiente. Condiciones de corriente moderada requirieron mayor esfuerzo pero sin complicaciones. Equipos de buceo funcionando óptimamente.",
      estado_fisico_post: "Estado físico normal post-inmersión",
      profundidad_maxima: 24,
      fecha: "2024-12-28",
      firmado: true,
      codigo: "BB-004-2024",
      created_at: "2024-12-28T12:35:00Z",
      updated_at: "2024-12-28T12:50:00Z",
      buzo_firma: "data:image/png;base64,iVBORw0KGgoAAAANS..."
    },
    // Bitácoras para Inmersión 3
    {
      id: "bitb-005",
      bitacora_id: "bitb-005",
      inmersion_id: "imm-003",
      buzo: "Juan Pérez",
      trabajos_realizados: "Segunda inmersión del día - inspección jaulas 5-6. Verificación exhaustiva de sistemas de anclaje en ambas jaulas. Revisión de integridad estructural completa. Documentación fotográfica de sistemas en perfecto estado.",
      observaciones_tecnicas: "Visibilidad reducida (6m) debido a actividad de tarde, pero suficiente para trabajo seguro. Corriente moderada estable. Excelente estado de todas las estructuras inspeccionadas.",
      estado_fisico_post: "Buen estado, fatiga leve por segunda inmersión",
      profundidad_maxima: 25,
      fecha: "2024-12-28",
      firmado: true,
      codigo: "BB-005-2024",
      created_at: "2024-12-28T15:35:00Z",
      updated_at: "2024-12-28T15:50:00Z",
      buzo_firma: "data:image/png;base64,iVBORw0KGgoAAAANS..."
    },
    {
      id: "bitb-006",
      bitacora_id: "bitb-006",
      inmersion_id: "imm-003",
      buzo: "Miguel Torres",
      trabajos_realizados: "Asistencia en inspección jaulas 5-6. Verificación de puntos de conexión y sistemas de flotación. Apoyo en documentación técnica y mediciones de profundidad de anclajes.",
      observaciones_tecnicas: "Segunda inmersión del día ejecutada sin inconvenientes. Condiciones ambientales manejables. Comunicación y coordinación con buzo principal excelente.",
      estado_fisico_post: "Estado físico satisfactorio",
      profundidad_maxima: 25,
      fecha: "2024-12-28",
      firmado: true,
      codigo: "BB-006-2024",
      created_at: "2024-12-28T15:35:00Z",
      updated_at: "2024-12-28T15:50:00Z",
      buzo_firma: "data:image/png;base64,iVBORw0KGgoAAAANS..."
    },
    // Bitácoras para Inmersión 4
    {
      id: "bitb-007",
      bitacora_id: "bitb-007",
      inmersion_id: "imm-004",
      buzo: "Pedro González",
      trabajos_realizados: "Inmersión final - inspección jaulas 7-8. Verificación completa de estructuras, sistemas de anclaje y flotación. Documentación fotográfica comprensiva para cierre de operación. Revisión final de toda el área de trabajo.",
      observaciones_tecnicas: "Condiciones mejoradas - visibilidad excelente (8m), corriente débil. Todas las estructuras inspeccionadas en perfecto estado. Operación completada exitosamente según protocolo.",
      estado_fisico_post: "Excelente estado físico",
      profundidad_maxima: 23,
      fecha: "2024-12-29",
      firmado: true,
      codigo: "BB-007-2024",
      created_at: "2024-12-29T11:05:00Z",
      updated_at: "2024-12-29T11:20:00Z",
      buzo_firma: "data:image/png;base64,iVBORw0KGgoAAAANS..."
    },
    {
      id: "bitb-008",
      bitacora_id: "bitb-008",
      inmersion_id: "imm-004",
      buzo: "Roberto Silva",
      trabajos_realizados: "Asistencia en inmersión de cierre. Apoyo en documentación final y verificación de limpieza del área de trabajo. Colaboración en registro fotográfico comprensivo del estado final de todas las estructuras inspeccionadas.",
      observaciones_tecnicas: "Inmersión de cierre ejecutada bajo condiciones óptimas. Trabajo en equipo eficiente. Todos los objetivos de la operación completados satisfactoriamente.",
      estado_fisico_post: "Estado físico normal, sin molestias",
      profundidad_maxima: 23,
      fecha: "2024-12-29",
      firmado: true,
      codigo: "BB-008-2024",
      created_at: "2024-12-29T11:05:00Z",
      updated_at: "2024-12-29T11:20:00Z",
      buzo_firma: "data:image/png;base64,iVBORw0KGgoAAAANS..."
    }
  ]
};

// Export individual components for easier access
export const {
  operacion,
  equipoBuceo,
  hpt,
  anexoBravo,
  inmersiones,
  bitacorasSupervisor,
  bitacorasBuzo
} = operacionCompletaMockup;
