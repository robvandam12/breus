
import React from 'react';
import { DotacionTable } from "../components/DotacionTable";
import type { NetworkOperationsData } from '@/types/fishing-networks';

interface NetworkOperationsStep2Props {
  formData: NetworkOperationsData;
  updateFormData: (updates: Partial<NetworkOperationsData>) => void;
  readOnly?: boolean;
}

export const NetworkOperationsStep2 = ({ 
  formData, 
  updateFormData, 
  readOnly = false 
}: NetworkOperationsStep2Props) => {
  // Convertir NetworkOperationsData a FishingNetworkMaintenanceData para reutilizar el componente
  const convertedFormData = {
    dotacion: formData.dotacion,
    // Agregar otros campos necesarios con valores por defecto
    datos_generales: {
      lugar_trabajo: '',
      fecha: '',
      hora_inicio_faena: '',
      hora_termino_faena: '',
      profundidad_maxima: 0,
      temperatura: 0,
      nave_maniobras: '',
      matricula_nave: '',
      estado_puerto: '',
    },
    equipo_inmersion: {
      equipo: 'liviano' as const,
      hora_inicio: '',
      hora_termino: '',
      profundidad: 0,
      horometro_inicio: 0,
      horometro_termino: 0,
    },
    fichas_buzos: [],
    otros: {
      navegacion_relevo: false,
      cableado_perfilada_buceo: false,
      revision_documental: false,
      relevo: false,
    },
    contingencias: {
      bloom_algas: false,
      enfermedad_peces: false,
      marea_roja: false,
      manejo_cambio_redes: false,
      otro: '',
    },
    totales: {
      horas_inmersion: 0,
      horas_trabajo: 0,
      total_horas: 0,
      jaulas_intervenidas: '',
    },
    observaciones_generales: '',
    firmas: {
      supervisor_buceo: { nombre: '', firma: '' },
      jefe_centro: { nombre: '', firma: '' },
    },
  };

  const handleUpdateFormData = (updates: any) => {
    if (updates.dotacion) {
      updateFormData({
        dotacion: updates.dotacion
      });
    }
  };

  return (
    <DotacionTable
      formData={convertedFormData}
      updateFormData={handleUpdateFormData}
      readOnly={readOnly}
    />
  );
};

