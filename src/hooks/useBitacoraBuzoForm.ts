
import { useState } from 'react';
import { BitacoraBuzoData } from '@/types/auth';

export const useBitacoraBuzoForm = () => {
  const [formData, setFormData] = useState<Partial<BitacoraBuzoData>>({
    folio: '',
    codigo: '',
    fecha: '',
    buzo: '', // Changed from buzo_nombre to buzo
    buzo_rut: '',
    supervisor_nombre: '',
    supervisor_rut: '',
    supervisor_correo: '',
    profundidad_maxima: 0,
    datostec_equipo_usado: '',
    datostec_traje: '',
    condamb_temp_aire_c: 0,
    condamb_temp_agua_c: 0,
    condamb_visibilidad_fondo_mts: 0,
    condamb_corriente_fondo_nudos: 0,
    condamb_estado_mar: '',
    condamb_estado_puerto: '',
    tiempos_total_fondo: '',
    tiempos_total_descompresion: '',
    tiempos_total_buceo: '',
    objetivo_proposito: '',
    objetivo_tipo_area: '',
    objetivo_caracteristicas_dimensiones: '',
    condcert_buceo_areas_confinadas: false,
    condcert_buceo_altitud: false,
    condcert_certificados_equipos_usados: false,
    condcert_observaciones: '',
    estado_fisico_post: '',
    trabajos_realizados: '',
    observaciones_tecnicas: '',
    empresa_nombre: '',
    centro_nombre: '',
    contratista_nombre: '',
    contratista_rut: '',
    jefe_centro_correo: '',
    firmado: false,
    estado_aprobacion: 'pendiente'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.codigo) newErrors.codigo = 'El código es requerido';
    if (!formData.fecha) newErrors.fecha = 'La fecha es requerida';
    if (!formData.buzo) newErrors.buzo = 'El nombre del buzo es requerido';
    if (!formData.buzo_rut) newErrors.buzo_rut = 'El RUT del buzo es requerido';
    if (!formData.profundidad_maxima || formData.profundidad_maxima <= 0) {
      newErrors.profundidad_maxima = 'La profundidad máxima debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: keyof BitacoraBuzoData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const submitForm = async () => {
    if (!validateForm()) return false;

    setIsSubmitting(true);
    try {
      // Mock submission
      console.log('Submitting bitacora buzo:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Error submitting form:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({});
    setErrors({});
  };

  return {
    formData,
    setFormData,
    errors,
    isSubmitting,
    updateField,
    validateForm,
    submitForm,
    resetForm
  };
};
