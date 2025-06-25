
import { useEquiposBuceo, EquipoBuceoFormData } from './useEquiposBuceo';
import { useOperationalFlow } from '@/contexts/OperationalFlowContext';
import { useAuth } from '@/hooks/useAuth';

export { EquipoBuceoFormData };

export const useEquiposBuceoEnhanced = () => {
  const equiposBasicos = useEquiposBuceo();
  const { operationalMode, companyType } = useOperationalFlow();
  const { profile } = useAuth();

  // Filtrar equipos según el contexto operativo
  const equiposDisponibles = equiposBasicos.equipos.filter(equipo => {
    // En modo básico o inmersión directa, mostrar solo equipos propios
    if (operationalMode === 'basic' || operationalMode === 'direct_immersion') {
      return equipo.empresa_id === (profile?.salmonera_id || profile?.servicio_id);
    }
    
    // En modo planificación completa, mostrar equipos según tipo de empresa
    if (operationalMode === 'full_planning') {
      if (companyType === 'salmonera') {
        return equipo.tipo_empresa === 'salmonera' || equipo.tipo_empresa === 'contratista';
      } else {
        return equipo.empresa_id === profile?.servicio_id;
      }
    }
    
    return true;
  });

  const puedeGestionarEquipos = () => {
    return profile?.role === 'admin_salmonera' || 
           profile?.role === 'admin_servicio' || 
           profile?.role === 'supervisor';
  };

  return {
    ...equiposBasicos,
    equipos: equiposDisponibles,
    equiposDisponibles,
    puedeGestionarEquipos: puedeGestionarEquipos(),
    operationalMode,
    companyType
  };
};
