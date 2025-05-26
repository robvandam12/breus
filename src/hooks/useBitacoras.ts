import { useState, useEffect } from 'react';

export interface BitacoraSupervisorFormData {
  inmersion_id: string;
  supervisor: string;
  desarrollo_inmersion: string;
  incidentes: string;
  evaluacion_general: string;
  fecha: string;
  diving_records?: {
    id: string;
    buzo_id: string;
    buzo_nombre: string;
    profundidad_maxima: number;
    hora_dejo_superficie: string;
    hora_llego_superficie: string;
    tiempo_fondo: number;
    tiempo_descompresion: number;
    tiempo_buceo: number;
    tabulacion_usada: string;
    gas_usado: string;
  }[];
}

export interface BitacoraBuzoFormData {
  inmersion_id: string;
  buzo: string;
  trabajos_realizados: string;
  observaciones_tecnicas: string;
  estado_fisico_post: string;
  profundidad_maxima: number;
  fecha: string;
  // Additional fields for complete form
  folio: string;
  codigo_verificacion: string;
  empresa_nombre: string;
  centro_nombre: string;
  buzo_rut: string;
  supervisor_nombre: string;
  supervisor_rut: string;
  supervisor_correo: string;
  jefe_centro_correo: string;
  contratista_nombre: string;
  contratista_rut: string;
  // Condiciones ambientales
  condamb_estado_puerto: string;
  condamb_estado_mar: string;
  condamb_temp_aire_c: number;
  condamb_temp_agua_c: number;
  condamb_visibilidad_fondo_mts: number;
  condamb_corriente_fondo_nudos: number;
  // Datos técnicos del buceo
  datostec_equipo_usado: string;
  datostec_traje: string;
  datostec_hora_dejo_superficie: string;
  datostec_hora_llegada_fondo: string;
  datostec_hora_salida_fondo: string;
  datostec_hora_llegada_superficie: string;
  // Tiempos y tabulación
  tiempos_total_fondo: string;
  tiempos_total_descompresion: string;
  tiempos_total_buceo: string;
  tiempos_tabulacion_usada: string;
  tiempos_intervalo_superficie: string;
  tiempos_nitrogeno_residual: string;
  tiempos_grupo_repetitivo_anterior: string;
  tiempos_nuevo_grupo_repetitivo: string;
  // Objetivo del buceo
  objetivo_proposito: string;
  objetivo_tipo_area: string;
  objetivo_caracteristicas_dimensiones: string;
  // Condiciones y certificaciones
  condcert_buceo_altitud: boolean;
  condcert_certificados_equipos_usados: boolean;
  condcert_buceo_areas_confinadas: boolean;
  condcert_observaciones: string;
  // Firma final
  validador_nombre: string;
}

export interface BitacoraSupervisor {
  id: string;
  bitacora_id: string;
  inmersion_id: string;
  supervisor: string;
  desarrollo_inmersion: string;
  incidentes?: string;
  evaluacion_general: string;
  fecha: string;
  firmado: boolean;
  codigo: string;
  created_at: string;
  updated_at: string;
  supervisor_firma?: string;
}

export interface BitacoraBuzo {
  id: string;
  bitacora_id: string;
  inmersion_id: string;
  buzo: string;
  trabajos_realizados: string;
  observaciones_tecnicas?: string;
  estado_fisico_post: string;
  profundidad_maxima: number;
  fecha: string;
  firmado: boolean;
  codigo: string;
  created_at: string;
  updated_at: string;
  buzo_firma?: string;
}

export const useBitacoras = () => {
  const [bitacorasSupervisor, setBitacorasSupervisor] = useState<BitacoraSupervisor[]>([]);
  const [bitacorasBuzo, setBitacorasBuzo] = useState<BitacoraBuzo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBitacoras();
  }, []);

  const loadBitacoras = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      setBitacorasSupervisor([
        {
          id: '1',
          bitacora_id: '1',
          inmersion_id: 'imm-001',
          supervisor: 'Carlos Rodríguez',
          desarrollo_inmersion: 'Inmersión realizada según protocolo establecido.',
          incidentes: 'Sin incidentes',
          evaluacion_general: 'Operación exitosa',
          fecha: '2024-12-27',
          firmado: true,
          codigo: 'BS-001',
          created_at: '2024-12-27T10:00:00Z',
          updated_at: '2024-12-27T10:00:00Z'
        }
      ]);

      setBitacorasBuzo([
        {
          id: '1',
          bitacora_id: '1',
          inmersion_id: 'imm-001',
          buzo: 'Juan Pérez',
          trabajos_realizados: 'Inspección de jaulas',
          observaciones_tecnicas: 'Visibilidad buena',
          estado_fisico_post: 'Normal',
          profundidad_maxima: 25,
          fecha: '2024-12-27',
          firmado: false,
          codigo: 'BB-001',
          created_at: '2024-12-27T10:00:00Z',
          updated_at: '2024-12-27T10:00:00Z'
        }
      ]);
    } catch (error) {
      console.error('Error loading bitácoras:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshBitacoras = async () => {
    await loadBitacoras();
  };

  const createBitacoraSupervisor = async (data: BitacoraSupervisorFormData) => {
    setLoading(true);
    try {
      const newBitacora: BitacoraSupervisor = {
        id: Date.now().toString(),
        bitacora_id: Date.now().toString(),
        inmersion_id: data.inmersion_id,
        supervisor: data.supervisor,
        desarrollo_inmersion: data.desarrollo_inmersion,
        incidentes: data.incidentes,
        evaluacion_general: data.evaluacion_general,
        fecha: data.fecha,
        firmado: false,
        codigo: `BS-${Date.now().toString().slice(-4)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setBitacorasSupervisor(prev => [...prev, newBitacora]);
      return newBitacora;
    } catch (error) {
      console.error('Error creating bitácora supervisor:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createBitacoraBuzo = async (data: BitacoraBuzoFormData) => {
    setLoading(true);
    try {
      const newBitacora: BitacoraBuzo = {
        id: Date.now().toString(),
        bitacora_id: Date.now().toString(),
        inmersion_id: data.inmersion_id,
        buzo: data.buzo,
        trabajos_realizados: data.trabajos_realizados,
        observaciones_tecnicas: data.observaciones_tecnicas,
        estado_fisico_post: data.estado_fisico_post,
        profundidad_maxima: data.profundidad_maxima,
        fecha: data.fecha,
        firmado: false,
        codigo: `BB-${Date.now().toString().slice(-4)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setBitacorasBuzo(prev => [...prev, newBitacora]);
      return newBitacora;
    } catch (error) {
      console.error('Error creating bitácora buzo:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    bitacorasSupervisor,
    bitacorasBuzo,
    loading,
    createBitacoraSupervisor,
    createBitacoraBuzo,
    loadBitacoras,
    refreshBitacoras
  };
};
