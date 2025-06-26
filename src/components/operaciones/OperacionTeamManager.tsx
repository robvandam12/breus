
import React from 'react';
import { OperacionTeamTransition } from './OperacionTeamTransition';

/**
 * @deprecated Este componente ha sido deprecado. 
 * La gestión de personal de buceo ahora se realiza a nivel de inmersión individual.
 * Use InmersionTeamManagerEnhanced para gestionar personal por inmersión.
 */
interface OperacionTeamManagerProps {
  operacionId: string;
  salmoneraId?: string;
  onClose?: () => void;
}

export const OperacionTeamManager = ({ 
  operacionId,
  onClose 
}: OperacionTeamManagerProps) => {
  console.warn(
    'OperacionTeamManager is deprecated. Use InmersionTeamManagerEnhanced for per-immersion team management.'
  );

  return (
    <OperacionTeamTransition 
      operacionId={operacionId}
      onNavigateToInmersiones={onClose}
    />
  );
};
