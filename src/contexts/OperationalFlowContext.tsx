
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

type OperationalMode = 'full_planning' | 'direct_immersion' | 'maintenance_only' | 'basic';
type CompanyType = 'salmonera' | 'contratista';

interface OperationalFlowContextType {
  operationalMode: OperationalMode;
  companyType: CompanyType;
  setOperationalMode: (mode: OperationalMode) => void;
  canPlanOperations: boolean;
  canExecuteDirectly: boolean;
  requiresValidation: boolean;
  validateOperationFlow: (operationType: string) => any;
  canCreateDirectImmersion: () => boolean;
  getRequiredDocuments: (operationType: string) => string[];
}

const OperationalFlowContext = createContext<OperationalFlowContextType | undefined>(undefined);

export const useOperationalFlow = () => {
  const context = useContext(OperationalFlowContext);
  if (!context) {
    throw new Error('useOperationalFlow must be used within an OperationalFlowProvider');
  }
  return context;
};

interface OperationalFlowProviderProps {
  children: React.ReactNode;
}

export const OperationalFlowProvider: React.FC<OperationalFlowProviderProps> = ({ children }) => {
  const { profile } = useAuth();
  const [operationalMode, setOperationalMode] = useState<OperationalMode>('basic');

  // Determinar tipo de empresa y modo por defecto
  useEffect(() => {
    if (!profile) return;

    const userRole = profile.role;
    
    if (profile.salmonera_id) {
      // Usuario de salmonera - puede planificar y ejecutar
      setOperationalMode('full_planning');
    } else if (profile.servicio_id) {
      // Usuario de contratista - principalmente ejecución directa
      if (userRole === 'admin_servicio' || userRole === 'supervisor') {
        setOperationalMode('full_planning');
      } else {
        setOperationalMode('direct_immersion');
      }
    }
  }, [profile]);

  const companyType: CompanyType = profile?.salmonera_id ? 'salmonera' : 'contratista';

  const canPlanOperations = operationalMode === 'full_planning';
  const canExecuteDirectly = operationalMode !== 'maintenance_only';
  const requiresValidation = operationalMode === 'full_planning';

  const validateOperationFlow = (operationType: string) => {
    return {
      canProceed: true,
      missingRequirements: [],
      warnings: [],
      nextSteps: []
    };
  };

  const canCreateDirectImmersion = () => {
    return operationalMode === 'direct_immersion' || operationalMode === 'full_planning';
  };

  const getRequiredDocuments = (operationType: string): string[] => {
    switch (operationType) {
      case 'planned_operation':
        return ['HPT', 'Anexo Bravo', 'Bitácora'];
      case 'direct_immersion':
        return ['Bitácora'];
      default:
        return [];
    }
  };

  const value: OperationalFlowContextType = {
    operationalMode,
    companyType,
    setOperationalMode,
    canPlanOperations,
    canExecuteDirectly,
    requiresValidation,
    validateOperationFlow,
    canCreateDirectImmersion,
    getRequiredDocuments
  };

  return (
    <OperationalFlowContext.Provider value={value}>
      {children}
    </OperationalFlowContext.Provider>
  );
};
