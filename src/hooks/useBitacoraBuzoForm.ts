
import { useState } from 'react';
import { BitacoraBuzoData } from '@/types/auth';

export const useBitacoraBuzoForm = (initialData?: Partial<BitacoraBuzoData>) => {
  const [formData, setFormData] = useState<Partial<BitacoraBuzoData>>({
    folio: '',
    codigo_verificacion: '',
    empresa_nombre: '',
    centro_nombre: '',
    fecha: '',
    buzo_nombre: '',
    buzo_rut: '',
    supervisor_nombre: '',
    supervisor_rut: '',
    supervisor_correo: '',
    jefe_centro_correo: '',
    contratista_nombre: '',
    contratista_rut: '',
    condamb_estado_puerto: 'abierto',
    condamb_estado_mar: '',
    condamb_temp_aire_c: 0,
    condamb_temp_agua_c: 0,
    condamb_visibilidad_fondo_mts: 0,
    condamb_corriente_fondo_nudos: 0,
    datostec_equipo_usado: '',
    datostec_traje: '',
    profundidad_maxima: 0,
    datostec_hora_dejo_superficie: '',
    datostec_hora_llegada_fondo: '',
    datostec_hora_salida_fondo: '',
    datostec_hora_llegada_superficie: '',
    tiempos_total_fondo: '',
    tiempos_total_descompresion: '',
    tiempos_total_buceo: '',
    tiempos_tabulacion_usada: '',
    tiempos_intervalo_superficie: '',
    tiempos_nitrogeno_residual: '',
    tiempos_grupo_repetitivo_anterior: '',
    tiempos_nuevo_grupo_repetitivo: '',
    objetivo_proposito: '',
    objetivo_tipo_area: '',
    objetivo_caracteristicas_dimensiones: '',
    condcert_buceo_altitud: false,
    condcert_certificados_equipos_usados: false,
    condcert_buceo_areas_confinadas: false,
    condcert_observaciones: '',
    buzo_firma: null,
    validador_nombre: '',
    validador_firma: null,
    inmersion_id: '',
    ...initialData
  });

  const updateFormData = (updates: Partial<BitacoraBuzoData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return {
    formData,
    setFormData,
    updateFormData
  };
};
