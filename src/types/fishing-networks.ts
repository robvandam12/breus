
export interface DotacionMember {
  rol: string;
  nombre: string;
  apellido: string;
  matricula: string;
}

export interface EquipoInmersion {
  equipo: 'liviano' | 'mediano';
  hora_inicio: string;
  hora_termino: string;
  profundidad: number;
  horometro_inicio: number;
  horometro_termino: number;
}

export interface FaenasMantencion {
  red_lober: boolean;
  red_pecera: boolean;
  reparacion_roturas: boolean;
  reparacion_descosturas: boolean;
  num_jaulas: string;
  cantidad: number;
  ubicacion: string;
  tipo_rotura_2x1: boolean;
  tipo_rotura_2x2: boolean;
  tipo_rotura_mayor_2x2: boolean;
  observaciones: string;
}

export interface SistemasEquipos {
  instalacion: { checked: boolean; cantidad: number };
  mantencion: { checked: boolean; cantidad: number };
  recuperacion: { checked: boolean; cantidad: number };
  limpieza: { checked: boolean; cantidad: number };
  ajuste: { checked: boolean; cantidad: number };
  focos_fotoperiodo: { checked: boolean; cantidad: number };
  extractor_mortalidad: { checked: boolean; cantidad: number };
  sistema_aireacion: { checked: boolean; cantidad: number };
  sistema_oxigenacion: { checked: boolean; cantidad: number };
  otros: { checked: boolean; cantidad: number; descripcion: string };
  observaciones: string;
}

export interface ApoyoFaenas {
  red_lober: boolean;
  red_pecera: boolean;
  balsas: boolean;
  cosecha: boolean;
  actividades: {
    soltar_reinstalar_tensores: { checked: boolean; cantidad: number };
    reparacion_red: { checked: boolean; cantidad: number };
    reinstalacion_extractor: { checked: boolean; cantidad: number };
    instalacion_reventadores: { checked: boolean; cantidad: number };
    recuperacion_fondones: { checked: boolean; cantidad: number };
  };
  observaciones: string;
}

export interface FichaBuzo {
  buzo_numero: number;
  faenas_mantencion: FaenasMantencion;
  sistemas_equipos: SistemasEquipos;
  apoyo_faenas: ApoyoFaenas;
}

export interface FishingNetworkMaintenanceData {
  // 1. Datos generales de la faena
  datos_generales: {
    lugar_trabajo: string;
    fecha: string;
    hora_inicio_faena: string;
    hora_termino_faena: string;
    profundidad_maxima: number;
    temperatura: number;
    nave_maniobras: string;
    matricula_nave: string;
    estado_puerto: string;
  };

  // 2. Dotación
  dotacion: {
    contratista: DotacionMember;
    supervisor: DotacionMember;
    buzo_emerg_1: DotacionMember;
    buzo_emerg_2: DotacionMember;
    buzo_1: DotacionMember;
    buzo_2: DotacionMember;
    buzo_3: DotacionMember;
    buzo_4: DotacionMember;
    buzo_5: DotacionMember;
    buzo_6: DotacionMember;
    buzo_7: DotacionMember;
    buzo_8: DotacionMember;
    compresor_1: DotacionMember;
    compresor_2: DotacionMember;
  };

  // 3. Datos de equipo por inmersión
  equipo_inmersion: EquipoInmersion;

  // 4. Fichas individuales de buzos
  fichas_buzos: FichaBuzo[];

  // 5. Otros
  otros: {
    navegacion_relevo: boolean;
    cableado_perfilada_buceo: boolean;
    revision_documental: boolean;
    relevo: boolean;
  };

  // 6. Contingencias de mortalidad
  contingencias: {
    bloom_algas: boolean;
    enfermedad_peces: boolean;
    marea_roja: boolean;
    manejo_cambio_redes: boolean;
    otro: string;
  };

  // 7. Totales de la jornada
  totales: {
    horas_inmersion: number;
    horas_trabajo: number;
    total_horas: number;
    jaulas_intervenidas: string;
  };

  // 8. Observaciones generales
  observaciones_generales: string;

  // 9. Firmas digitales
  firmas: {
    supervisor_buceo: { nombre: string; firma: string };
    jefe_centro: { nombre: string; firma: string };
  };
}

// NUEVOS TIPOS PARA LOS FORMULARIOS ADICIONALES

// Tipos para "Instalación / Cambio de Redes"
export interface NetworkInstallationData {
  // 1. Selección inicial
  seleccion_inicial: {
    red_lober: boolean;
    red_pecera: boolean;
    faena_instalacion: boolean;
    faena_cambio: boolean;
    faena_retiro: boolean;
  };

  // 3. Instalación de Loberos/Peceras
  instalacion_redes: {
    instalacion_redes: { [franja: string]: string }; // jaula numbers
    instalacion_impias: { [franja: string]: string };
    contrapeso_250kg: { [franja: string]: string };
    contrapeso_150kg: { [franja: string]: string };
    reticulado_cabecera: { [franja: string]: string };
  };

  // 4. Cambio de Franjas
  cambio_franjas: {
    costura_ftc_fcd: string; // jaula number
    costura_fced_fcs: string;
    costura_fces_fcs: string;
    costura_fma: string;
  };

  // 5. Cambio de Pecera por buzo
  cambio_pecera_buzos: {
    [buzo_numero: string]: {
      jaula_numero: string;
      actividades: {
        soltar_tensores: number;
        descosturar_extractor: number;
        liberar_micropesos: number;
        reconectar_tensores: number;
        reinstalar_tensores: number;
        costurar_extractor: number;
        reinstalar_micropesos: number;
      };
    };
  };

  // 6. Observaciones
  observaciones_generales: string;

  // 7. Firmas
  firmas: {
    supervisor_buceo: { nombre: string; firma: string };
    jefe_centro: { nombre: string; firma: string };
  };
}

// Tipos para "Faenas de Redes"
export interface NetworkOperationsData {
  // 1. Datos generales
  datos_generales: {
    lugar_trabajo: string;
    supervisor: string;
    hora_inicio_faena: string;
    hora_termino_faena: string;
    profundidad_maxima: number;
    team_s: number;
    team_e: number;
    team_b: number;
    fecha: string;
    temperatura: number;
    nave_maniobras: string;
    matricula_nave: string;
    estado_puerto: string;
  };

  // 2. Dotación de Personal (reutiliza la estructura existente)
  dotacion: {
    contratista: DotacionMember;
    supervisor: DotacionMember;
    buzo_emerg_1: DotacionMember;
    buzo_emerg_2: DotacionMember;
    buzo_1: DotacionMember;
    buzo_2: DotacionMember;
    buzo_3: DotacionMember;
    buzo_4: DotacionMember;
    buzo_5: DotacionMember;
    buzo_6: DotacionMember;
    buzo_7: DotacionMember;
    buzo_8: DotacionMember;
    compresor_1: DotacionMember;
    compresor_2: DotacionMember;
  };

  // 3. Equipo de Inmersión
  equipo_inmersion: EquipoInmersion;

  // 5. Observaciones
  observaciones_generales: string;

  // 6. Firmas
  firmas: {
    supervisor_buceo: { nombre: string; firma: string };
    jefe_centro: { nombre: string; firma: string };
  };
}

// Tipo unión para todos los formularios del módulo de redes
export type NetworkFormsData = 
  | FishingNetworkMaintenanceData 
  | NetworkInstallationData 
  | NetworkOperationsData;

export type NetworkFormType = 
  | 'mantencion_redes' 
  | 'instalacion_cambio_redes' 
  | 'faenas_redes';

