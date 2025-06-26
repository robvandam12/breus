
import React from 'react';
import { OperacionTeamTransition } from './OperacionTeamTransition';

/**
 * @deprecated Este componente ha sido deprecado. 
 * La gestión de personal de buceo ahora se realiza a nivel de inmersión individual.
 * Use InmersionTeamManagerEnhanced para gestionar personal por inmersión.
 */
interface OperacionTeamManagerEnhancedProps {
  operacionId: string;
  salmoneraId?: string;
  contratistaId?: string;
}

export const OperacionTeamManagerEnhanced = ({ 
  operacionId 
}: OperacionTeamManagerEnhancedProps) => {
  console.warn(
    'OperacionTeamManagerEnhanced is deprecated. Use InmersionTeamManagerEnhanced for per-immersion team management.'
  );

  return (
    <OperacionTeamTransition 
      operacionId={operacionId}
      onNavigateToInmersiones={() => {
        // En un caso real, esto podría navegar a la pestaña de inmersiones
        console.log('Navigate to inmersiones tab');
      }}
    />
  );
};
