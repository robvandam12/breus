
import { useState, useEffect } from 'react';
import { MultiXData } from '@/types/multix';

export const useMultiX = (operacionId?: string, tipo: 'mantencion' | 'faena' = 'faena', multiXId?: string) => {
  const [data, setData] = useState<MultiXData>({
    tipo_formulario: tipo,
    operacion_id: operacionId,
    fecha: '',
    estado: 'borrador',
    firmado: false,
    progreso: 0,
    lugar_trabajo: '',
    hora_inicio: '',
    hora_termino: '',
    nave_maniobras: '',
    team_s: '',
    team_be: '',
    team_bi: '',
    matricula_nave: '',
    estado_puerto: '',
    dotacion: [],
    equipos_superficie: [],
    faenas_mantencion: [],
    iconografia_simbologia: [],
    sistemas_equipos: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Simular carga de datos existentes si hay multiXId
  useEffect(() => {
    if (multiXId) {
      setIsLoading(true);
      // Simular carga de datos desde el servidor
      setTimeout(() => {
        // Aquí se cargarían los datos reales desde la base de datos
        setIsLoading(false);
      }, 1000);
    }
  }, [multiXId]);

  const updateField = (field: keyof MultiXData, value: any) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const saveMultiX = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Simular guardado en el servidor
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aquí se enviarían los datos al servidor
      console.log('Guardando MultiX:', data);
      
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw new Error('Error al guardar el formulario MultiX');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.lugar_trabajo) {
      newErrors.lugar_trabajo = 'El lugar de trabajo es requerido';
    }

    if (!data.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    }

    if (!data.hora_inicio) {
      newErrors.hora_inicio = 'La hora de inicio es requerida';
    }

    if (!data.hora_termino) {
      newErrors.hora_termino = 'La hora de término es requerida';
    }

    if (data.dotacion.length === 0) {
      newErrors.dotacion = 'Debe agregar al menos un miembro a la dotación';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    data,
    updateField,
    saveMultiX,
    validateForm,
    isLoading,
    errors
  };
};
