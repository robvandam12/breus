
import { useState, useEffect } from 'react';

export interface BitacoraSupervisorFormData {
  inmersion_id: string;
  supervisor: string;
  desarrollo_inmersion: string;
  incidentes: string;
  evaluacion_general: string;
  fecha: string;
}

export interface BitacoraBuzoFormData {
  inmersion_id: string;
  buzo: string;
  trabajos_realizados: string;
  observaciones_tecnicas: string;
  estado_fisico_post: string;
  profundidad_maxima: number;
  fecha: string;
}

export interface BitacoraSupervisor {
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
}

export interface BitacoraBuzo {
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

  const createBitacoraSupervisor = async (data: BitacoraSupervisorFormData) => {
    setLoading(true);
    try {
      const newBitacora: BitacoraSupervisor = {
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
    loadBitacoras
  };
};
