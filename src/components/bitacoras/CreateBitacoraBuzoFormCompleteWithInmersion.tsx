
import { useState, useEffect } from "react";
import { CreateBitacoraBuzoFormComplete } from "./CreateBitacoraBuzoFormComplete";
import { BitacoraBuzoFormData } from "@/hooks/useBitacoraEnhanced";
import { useInmersiones } from "@/hooks/useInmersiones";
import { useBitacoraEnhanced } from "@/hooks/useBitacoraEnhanced";
import { useOperaciones } from "@/hooks/useOperaciones";

interface CreateBitacoraBuzoFormCompleteWithInmersionProps {
  inmersionId: string;
  onSubmit: (data: BitacoraBuzoFormData) => Promise<void>;
  onCancel: () => void;
}

export const CreateBitacoraBuzoFormCompleteWithInmersion = ({ 
  inmersionId,
  onSubmit, 
  onCancel 
}: CreateBitacoraBuzoFormCompleteWithInmersionProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<BitacoraBuzoFormData> | null>(null);
  const { inmersiones } = useInmersiones();
  const { bitacorasSupervisor } = useBitacoraEnhanced();
  const { operaciones } = useOperaciones();

  useEffect(() => {
    // Obtener datos de la inmersión y bitácora supervisor
    const inmersion = inmersiones.find(i => i.inmersion_id === inmersionId);
    const bitacoraSupervisor = bitacorasSupervisor.find(b => b.inmersion_id === inmersionId);
    
    if (inmersion) {
      // Obtener operación asociada
      const operacion = operaciones.find(op => op.id === inmersion.operacion_id);
      
      const datosIniciales: Partial<BitacoraBuzoFormData> = {
        inmersion_id: inmersionId,
        codigo: `BIT-BUZ-${Date.now()}`,
        buzo: inmersion.buzo_principal,
        fecha: inmersion.fecha_inmersion,
        profundidad_maxima: inmersion.profundidad_max,
        firmado: false,
        estado_aprobacion: 'pendiente',
        // Datos de la operación
        empresa_nombre: operacion?.nombre || '',
        centro_nombre: operacion?.nombre || '',
        supervisor_nombre: inmersion.supervisor,
        // Condiciones ambientales de la inmersión
        condamb_temp_agua_c: inmersion.temperatura_agua,
        condamb_visibilidad_fondo_mts: inmersion.visibilidad,
        condamb_corriente_fondo_nudos: parseFloat(inmersion.corriente) || 0,
        // Datos técnicos del buceo de la bitácora supervisor si existe
        datostec_hora_dejo_superficie: inmersion.hora_inicio,
        datostec_hora_llegada_superficie: inmersion.hora_fin,
        // Trabajos realizados basado en el objetivo
        trabajos_realizados: inmersion.objetivo || '',
        estado_fisico_post: 'Normal', // Valor por defecto
        objetivo_proposito: inmersion.objetivo || '',
        // Valores por defecto para campos requeridos
        tiempos_total_fondo: '',
        tiempos_tabulacion_usada: '',
      };
      
      setFormData(datosIniciales);
    }
  }, [inmersionId, inmersiones, bitacorasSupervisor, operaciones]);

  const handleSubmit = async (data: BitacoraBuzoFormData) => {
    setLoading(true);
    try {
      // Asegurar que el inmersion_id esté incluido en los datos
      const dataWithInmersion = {
        ...data,
        inmersion_id: inmersionId
      };
      await onSubmit(dataWithInmersion);
    } catch (error) {
      console.error('Error creating bitácora buzo:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!formData) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Cargando datos de la inmersión...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900">Datos Pre-cargados</h3>
        <p className="text-sm text-blue-700">
          Los datos de la inmersión y bitácora de supervisor han sido pre-cargados automáticamente.
        </p>
      </div>
      
      <CreateBitacoraBuzoFormComplete
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
};
