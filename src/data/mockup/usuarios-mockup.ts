
// Usuarios mockup para la operación completa
export const usuariosMockup = [
  // Supervisor
  {
    usuario_id: "user-supervisor-001",
    email: "carlos.rodriguez@serviciosur.cl",
    nombre: "Carlos",
    apellido: "Rodríguez",
    rol: "supervisor",
    salmonera_id: null,
    servicio_id: "contratista-001",
    perfil_completado: true,
    perfil_buzo: {
      matricula: "SUP-001-2024",
      especialidades: ["Inspección estructural", "Supervisión operacional", "Gestión de equipos"],
      certificaciones: ["PADI Divemaster", "SSI Dive Guide", "Primeros auxilios nivel avanzado"],
      anos_experiencia: 8,
      inmersiones_registradas: 2450
    },
    empresa_nombre: "Servicios Subacuáticos del Sur Ltda.",
    empresa_tipo: "contratista",
    created_at: "2024-01-15T09:00:00Z"
  },
  
  // Buzos
  {
    usuario_id: "user-buzo-001",
    email: "juan.perez@serviciosur.cl",
    nombre: "Juan",
    apellido: "Pérez",
    rol: "buzo",
    salmonera_id: null,
    servicio_id: "contratista-001",
    perfil_completado: true,
    perfil_buzo: {
      matricula: "BUZ-001-2024",
      especialidades: ["Inspección visual", "Soldadura subacuática", "Reparación de redes"],
      certificaciones: ["PADI Advanced Open Water", "Soldadura subacuática AWS", "Rescue Diver"],
      anos_experiencia: 6,
      inmersiones_registradas: 1850
    },
    empresa_nombre: "Servicios Subacuáticos del Sur Ltda.",
    empresa_tipo: "contratista",
    created_at: "2024-02-01T10:00:00Z"
  },
  
  {
    usuario_id: "user-buzo-002",
    email: "pedro.gonzalez@serviciosur.cl",
    nombre: "Pedro",
    apellido: "González",
    rol: "buzo",
    salmonera_id: null,
    servicio_id: "contratista-001",
    perfil_completado: true,
    perfil_buzo: {
      matricula: "BUZ-002-2024",
      especialidades: ["Mantenimiento preventivo", "Inspección de anclajes", "Documentación técnica"],
      certificaciones: ["PADI Open Water Diver", "Nitrox", "Deep Diver"],
      anos_experiencia: 4,
      inmersiones_registradas: 1200
    },
    empresa_nombre: "Servicios Subacuáticos del Sur Ltda.",
    empresa_tipo: "contratista",
    created_at: "2024-02-15T11:00:00Z"
  },
  
  {
    usuario_id: "user-buzo-003",
    email: "miguel.torres@serviciosur.cl",
    nombre: "Miguel",
    apellido: "Torres",
    rol: "buzo",
    salmonera_id: null,
    servicio_id: "contratista-001",
    perfil_completado: true,
    perfil_buzo: {
      matricula: "BUZ-003-2024",
      especialidades: ["Limpieza de estructuras", "Mantenimiento de redes", "Reparaciones menores"],
      certificaciones: ["PADI Advanced Open Water", "Equipment Specialist", "Underwater Navigator"],
      anos_experiencia: 5,
      inmersiones_registradas: 1650
    },
    empresa_nombre: "Servicios Subacuáticos del Sur Ltda.",
    empresa_tipo: "contratista",
    created_at: "2024-03-01T09:30:00Z"
  },
  
  {
    usuario_id: "user-buzo-004",
    email: "roberto.silva@serviciosur.cl",
    nombre: "Roberto",
    apellido: "Silva",
    rol: "buzo",
    salmonera_id: null,
    servicio_id: "contratista-001",
    perfil_completado: true,
    perfil_buzo: {
      matricula: "BUZ-004-2024",
      especialidades: ["Inspección de jaulas", "Documentación fotográfica", "Mediciones subacuáticas"],
      certificaciones: ["PADI Open Water Diver", "Digital Underwater Photographer", "Peak Performance Buoyancy"],
      anos_experiencia: 3,
      inmersiones_registradas: 980
    },
    empresa_nombre: "Servicios Subacuáticos del Sur Ltda.",
    empresa_tipo: "contratista",
    created_at: "2024-03-15T14:00:00Z"
  },

  // Personal de la salmonera
  {
    usuario_id: "user-mandante-001",
    email: "ana.contreras@salmoneraustral.cl",
    nombre: "Ana María",
    apellido: "Contreras",
    rol: "admin_salmonera",
    salmonera_id: "salmonera-001",
    servicio_id: null,
    perfil_completado: true,
    perfil_buzo: null,
    empresa_nombre: "Salmonera Austral S.A.",
    empresa_tipo: "salmonera",
    created_at: "2024-01-10T08:00:00Z"
  },

  {
    usuario_id: "user-jefe-centro-001",
    email: "luis.hernandez@salmoneraustral.cl",
    nombre: "Luis",
    apellido: "Hernández",
    rol: "supervisor",
    salmonera_id: "salmonera-001",
    servicio_id: null,
    perfil_completado: true,
    perfil_buzo: {
      matricula: "SUP-SAL-001",
      especialidades: ["Gestión de centro", "Supervisión operacional", "Control de calidad"],
      certificaciones: ["Supervisor certificado", "Gestión acuícola", "Seguridad industrial"],
      anos_experiencia: 12,
      inmersiones_registradas: 850
    },
    empresa_nombre: "Salmonera Austral S.A.",
    empresa_tipo: "salmonera",
    created_at: "2024-01-05T09:00:00Z"
  }
];
