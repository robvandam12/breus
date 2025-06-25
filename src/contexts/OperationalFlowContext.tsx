
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useModularSystem } from '@/hooks/useModularSystem';
import { useOperationalContext } from '@/hooks/useOperationalContext';

interface OperationalFlowContextType {
  // Validaciones de flujo
  canCreateOperation: () => boolean;
  canCreateDirectImmersion: () => boolean;
  canCreateDocuments: () => boolean;
  canCreateNetworkMaintenance: () => boolean;
  
  // Requerimientos por contexto
  getRequiredDocuments: (operationType: string) => string[];
  validateOperationFlow: (operationType: string) => {
    canProceed: boolean;
    missingRequirements: string[];
    warnings: string[];
    nextSteps: string[];
  };
  
  // Contexto operativo
  operationalMode: 'full_planning' | 'direct_immersion' | 'maintenance_only' | 'basic';
  activeModules: string[];
  companyType: 'salmonera' | 'contratista';
}

const OperationalFlowContext = createContext<OperationalFlowContextType | undefined>(undefined);

export const OperationalFlowProvider = ({ children }: { children: ReactNode }) => {
  const { profile } = useAuth();
  const { hasModuleAccess, modules } = useModularSystem();
  const { operationalContext } = useOperationalContext();

  const activeModules = Object.values(modules).filter(module => hasModuleAccess(module));
  
  const operationalMode = (() => {
    if (hasModuleAccess(modules.PLANNING_OPERATIONS) && hasModuleAccess(modules.MAINTENANCE_NETWORKS)) {
      return 'full_planning';
    } else if (hasModuleAccess(modules.MAINTENANCE_NETWORKS)) {
      return 'maintenance_only';
    } else if (!hasModuleAccess(modules.PLANNING_OPERATIONS)) {
      return 'direct_immersion';
    }
    return 'basic';
  })();

  const companyType = profile?.salmonera_id ? 'salmonera' : 'contratista';

  const canCreateOperation = () => {
    return hasModuleAccess(modules.PLANNING_OPERATIONS) && 
           (profile?.role === 'admin_salmonera' || profile?.role === 'admin_servicio' || profile?.role === 'supervisor');
  };

  const canCreateDirectImmersion = () => {
    // Puede crear inmersiones directas si no requiere planificación completa
    return operationalMode === 'direct_immersion' || operationalMode === 'basic' ||
           (operationalMode === 'full_planning' && profile?.role !== 'buzo');
  };

  const canCreateDocuments = () => {
    return hasModuleAccess(modules.PLANNING_OPERATIONS) && 
           (profile?.role === 'supervisor' || profile?.role === 'admin_salmonera' || profile?.role === 'admin_servicio');
  };

  const canCreateNetworkMaintenance = () => {
    return hasModuleAccess(modules.MAINTENANCE_NETWORKS) && companyType === 'salmonera';
  };

  const getRequiredDocuments = (operationType: string): string[] => {
    const requirements: string[] = [];
    
    if (operationType === 'planned_operation' && hasModuleAccess(modules.PLANNING_OPERATIONS)) {
      requirements.push('HPT', 'Anexo Bravo', 'Equipo de Buceo');
    }
    
    if (operationType === 'network_maintenance' && hasModuleAccess(modules.MAINTENANCE_NETWORKS)) {
      requirements.push('Formulario de Mantenimiento de Redes');
    }
    
    return requirements;
  };

  const validateOperationFlow = (operationType: string) => {
    const missingRequirements: string[] = [];
    const warnings: string[] = [];
    const nextSteps: string[] = [];

    switch (operationType) {
      case 'create_operation':
        if (!canCreateOperation()) {
          missingRequirements.push('Módulo de Planificación de Operaciones no disponible');
          missingRequirements.push('Permisos insuficientes para crear operaciones');
        } else {
          nextSteps.push('Crear operación');
          nextSteps.push('Asignar sitio y equipo');
          nextSteps.push('Generar documentos HPT y Anexo Bravo');
        }
        break;

      case 'create_immersion':
        if (operationalMode === 'full_planning' && !canCreateOperation()) {
          warnings.push('Se recomienda crear una operación primero para mejor trazabilidad');
        }
        if (canCreateDirectImmersion()) {
          nextSteps.push('Crear inmersión directa');
          nextSteps.push('Generar bitácoras automáticamente');
        }
        break;

      case 'create_network_maintenance':
        if (!canCreateNetworkMaintenance()) {
          missingRequirements.push('Módulo de Mantenimiento de Redes no disponible');
          missingRequirements.push('Solo disponible para empresas salmoneras');
        } else {
          nextSteps.push('Crear formulario de mantenimiento');
          nextSteps.push('Asignar personal y equipos');
        }
        break;

      case 'create_bitacora':
        if (!profile?.id) {
          missingRequirements.push('Usuario no autenticado');
        } else {
          nextSteps.push('Crear bitácora de buzo');
          if (profile.rol === 'supervisor') {
            nextSteps.push('Crear bitácora de supervisor');
          }
        }
        break;
    }

    return {
      canProceed: missingRequirements.length === 0,
      missingRequirements,
      warnings,
      nextSteps
    };
  };

  const value: OperationalFlowContextType = {
    canCreateOperation,
    canCreateDirectImmersion,
    canCreateDocuments,
    canCreateNetworkMaintenance,
    getRequiredDocuments,
    validateOperationFlow,
    operationalMode,
    activeModules,
    companyType
  };

  return (
    <OperationalFlowContext.Provider value={value}>
      {children}
    </OperationalFlowContext.Provider>
  );
};

export const useOperationalFlow = () => {
  const context = useContext(OperationalFlowContext);
  if (context === undefined) {
    throw new Error('useOperationalFlow must be used within an OperationalFlowProvider');
  }
  return context;
};
