
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Shield, AlertTriangle } from 'lucide-react';
import { EnterpriseSelectionResult } from '@/hooks/useEnterpriseContext';

interface ContextualOperationBadgeProps {
  enterpriseContext: EnterpriseSelectionResult;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ContextualOperationBadge: React.FC<ContextualOperationBadgeProps> = ({
  enterpriseContext,
  showDetails = false,
  size = 'md'
}) => {
  const getModeColor = () => {
    switch (enterpriseContext.context_metadata.selection_mode) {
      case 'superuser': return 'bg-purple-100 text-purple-700';
      case 'salmonera_admin': return 'bg-blue-100 text-blue-700';
      case 'contratista_admin': return 'bg-orange-100 text-orange-700';
      case 'inherited': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getModeIcon = () => {
    switch (enterpriseContext.context_metadata.selection_mode) {
      case 'superuser': return <Shield className="w-3 h-3" />;
      case 'salmonera_admin': return <Building2 className="w-3 h-3" />;
      case 'contratista_admin': return <Users className="w-3 h-3" />;
      case 'inherited': return <AlertTriangle className="w-3 h-3" />;
      default: return <Shield className="w-3 h-3" />;
    }
  };

  const getModeText = () => {
    switch (enterpriseContext.context_metadata.selection_mode) {
      case 'superuser': return 'Superusuario';
      case 'salmonera_admin': return 'Admin Salmonera';
      case 'contratista_admin': return 'Admin Contratista';
      case 'inherited': return 'Heredado';
      default: return 'Desconocido';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  if (!showDetails) {
    return (
      <Badge 
        variant="outline" 
        className={`${getModeColor()} ${sizeClasses[size]} flex items-center gap-1`}
      >
        {getModeIcon()}
        {getModeText()}
      </Badge>
    );
  }

  return (
    <div className="space-y-2">
      <Badge 
        variant="outline" 
        className={`${getModeColor()} ${sizeClasses[size]} flex items-center gap-1`}
      >
        {getModeIcon()}
        {getModeText()}
      </Badge>
      
      <div className="text-xs text-muted-foreground space-y-1">
        <div className="flex items-center gap-1">
          <Building2 className="w-3 h-3" />
          <span>Salmonera: {enterpriseContext.salmonera_id.slice(0, 8)}...</span>
        </div>
        {enterpriseContext.contratista_id && (
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>Contratista: {enterpriseContext.contratista_id.slice(0, 8)}...</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          <span>Empresa Origen: {enterpriseContext.context_metadata.empresa_origen_tipo}</span>
        </div>
      </div>
    </div>
  );
};
